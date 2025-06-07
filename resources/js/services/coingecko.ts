import {
    CoinHistoricalData,
    CoinListItem,
    CoinMarketData,
    CoinTicker,
    Exchange,
    ExchangeListItem,
    ExchangeParams,
    ExchangeTickersResponse,
    HistoricalDataParams,
    MarketChartData,
    MarketChartParams,
    MarketChartRangeParams,
    MarketDataParams,
} from '@/types/coingecko';
import axios, { AxiosInstance } from 'axios';

/**
 * CoinGecko API Service
 * Handles all interactions with the CoinGecko API
 */
class CoinGeckoService {
    private readonly baseUrl: string;
    private readonly API_URL = 'https://api.coingecko.com/api/v3';
    private readonly MAX_RETRIES = 3;
    private readonly CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

    private axiosInstance: AxiosInstance;
    private retryCount: number = 0;
    private coinsListCache: CoinListItem[] | null = null;
    private lastCoinsListFetch: number = 0;
    private exchangesCache: Exchange[] | null = null;
    private lastExchangesFetch: number = 0;
    private exchangeListCache: ExchangeListItem[] | null = null;
    private lastExchangeListFetch: number = 0;

    constructor() {
        this.baseUrl = '/api/coingecko';
        this.axiosInstance = this.createAxiosInstance();
    }

    /**
     * Creates and configures the Axios instance with interceptors
     */
    private createAxiosInstance(): AxiosInstance {
        const instance = axios.create({
            baseURL: this.API_URL,
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            timeout: 10000, // 10 second timeout
        });

        // Add response interceptor to handle rate limiting
        instance.interceptors.response.use(
            (response) => response,
            async (error) => {
                if (error.response?.status === 429 && this.retryCount < this.MAX_RETRIES) {
                    this.retryCount++;
                    // Exponential backoff: 60s, 120s, 240s
                    const waitTime = 60000 * Math.pow(2, this.retryCount - 1);
                    await new Promise((resolve) => setTimeout(resolve, waitTime));
                    return instance.request(error.config);
                }
                this.retryCount = 0;
                return Promise.reject(error);
            },
        );

        return instance;
    }

    /**
     * Handles API errors and throws appropriate error messages
     */
    private handleApiError(error: unknown, context: string): never {
        if (axios.isAxiosError(error)) {
            if (error.response?.status === 429) {
                throw new Error('Rate limit exceeded. Please try again in a minute.');
            }
            if (error.response?.status === 401) {
                throw new Error('API access error. Please check your API configuration.');
            }
            if (error.code === 'ECONNABORTED') {
                throw new Error('Request timed out. Please try again.');
            }
            throw new Error(`Failed to ${context}: ${error.response?.data?.error || error.message}`);
        }
        throw error;
    }

    /**
     * Fetches the list of all available coins
     */
    async getCoinsList(): Promise<CoinListItem[]> {
        const now = Date.now();

        // Return cached data if it's still valid
        if (this.coinsListCache && now - this.lastCoinsListFetch < this.CACHE_DURATION) {
            return this.coinsListCache;
        }

        try {
            const response = await this.axiosInstance.get('/coins/list');

            if (!Array.isArray(response.data)) {
                throw new Error('Invalid response format from CoinGecko API');
            }

            this.coinsListCache = response.data;
            this.lastCoinsListFetch = now;

            return response.data;
        } catch (error) {
            this.handleApiError(error, 'fetch coins list');
        }
    }

    /**
     * Fetches market data for coins
     */
    async getMarketData(params: MarketDataParams = {}): Promise<CoinMarketData[]> {
        try {
            const response = await this.axiosInstance.get('/coins/markets', {
                params: {
                    vs_currency: 'usd',
                    order: 'market_cap_desc',
                    per_page: 100,
                    page: 1,
                    sparkline: false,
                    ...params,
                },
            });

            if (!Array.isArray(response.data)) {
                throw new Error('Invalid response format from CoinGecko API');
            }

            return response.data;
        } catch (error) {
            this.handleApiError(error, 'fetch market data');
        }
    }

    /**
     * Fetches detailed information about a specific coin
     */
    async getCoinDetail(id: string): Promise<CoinHistoricalData> {
        try {
            const response = await this.axiosInstance.get(`/coins/${id}`);

            if (!response.data || !response.data.id) {
                throw new Error('Invalid response format from CoinGecko API');
            }

            return response.data;
        } catch (error) {
            this.handleApiError(error, 'fetch coin detail');
        }
    }

    /**
     * Fetches ticker data for a specific coin
     */
    async getCoinTickers(id: string): Promise<ExchangeTickersResponse> {
        try {
            const response = await this.axiosInstance.get(`/coins/${id}/tickers`);

            if (!response.data || !response.data.name || !Array.isArray(response.data.tickers)) {
                throw new Error('Invalid response format from CoinGecko API');
            }

            return response.data;
        } catch (error) {
            this.handleApiError(error, 'fetch coin tickers');
        }
    }

    /**
     * Fetches historical data for a specific coin and date
     */
    async getHistoricalData({ id, date }: HistoricalDataParams): Promise<CoinHistoricalData> {
        try {
            const response = await this.axiosInstance.get(`/coins/${id}/history`, {
                params: { date },
            });

            if (!response.data || !response.data.id) {
                throw new Error('Invalid response format from CoinGecko API');
            }

            return response.data;
        } catch (error) {
            this.handleApiError(error, 'fetch historical data');
        }
    }

    /**
     * Fetches market chart data for a specific coin
     */
    async getMarketChart(params: MarketChartParams): Promise<MarketChartData> {
        try {
            const response = await this.axiosInstance.get(`/coins/${params.id}/market_chart`, {
                params: {
                    vs_currency: params.vs_currency || 'usd',
                    days: params.days || 7,
                },
                headers: {
                    Accept: 'application/json',
                },
            });

            if (!response.data || !Array.isArray(response.data.prices)) {
                throw new Error('Invalid response format from CoinGecko API');
            }

            return this.sortChartData(response.data);
        } catch (error) {
            this.handleApiError(error, 'fetch market chart');
        }
    }

    /**
     * Fetches market chart data for a specific time range
     */
    async getMarketChartRange({ id, vs_currency = 'usd', from, to }: MarketChartRangeParams): Promise<MarketChartData> {
        try {
            const response = await this.axiosInstance.get(`/coins/${id}/market_chart/range`, {
                params: { vs_currency, from, to },
            });

            if (!response.data || !Array.isArray(response.data.prices)) {
                throw new Error('Invalid response format from CoinGecko API');
            }

            return this.sortChartData(response.data);
        } catch (error) {
            this.handleApiError(error, 'fetch market chart range');
        }
    }

    /**
     * Sorts chart data by timestamp
     */
    private sortChartData(data: MarketChartData): MarketChartData {
        return {
            prices: [...data.prices].sort((a, b) => a[0] - b[0]),
            market_caps: [...data.market_caps].sort((a, b) => a[0] - b[0]),
            total_volumes: [...data.total_volumes].sort((a, b) => a[0] - b[0]),
        };
    }

    /**
     * Fetches the list of all exchanges
     */
    async getExchanges(params: ExchangeParams = {}): Promise<Exchange[]> {
        const now = Date.now();

        // Return cached data if it's still valid
        if (this.exchangesCache && now - this.lastExchangesFetch < this.CACHE_DURATION) {
            return this.exchangesCache;
        }

        try {
            const response = await this.axiosInstance.get('/exchanges', {
                params: {
                    per_page: 100,
                    page: 1,
                    ...params,
                },
            });

            if (!Array.isArray(response.data)) {
                throw new Error('Invalid response format from CoinGecko API');
            }

            this.exchangesCache = response.data;
            this.lastExchangesFetch = now;

            return response.data;
        } catch (error) {
            this.handleApiError(error, 'fetch exchanges list');
        }
    }

    /**
     * Fetches detailed information about a specific exchange
     * @param id The exchange ID (e.g., 'binance', 'coinbase')
     * @returns Detailed exchange information including tickers and statistics
     */
    async getExchangeDetail(id: string): Promise<Exchange> {
        try {
            const response = await this.axiosInstance.get(`/exchanges/${id}`);

            if (!response.data || !response.data.name) {
                throw new Error('Invalid response format from CoinGecko API');
            }

            // Validate tickers if present
            if (response.data.tickers && !Array.isArray(response.data.tickers)) {
                throw new Error('Invalid tickers format in exchange data');
            }

            return response.data;
        } catch (error) {
            this.handleApiError(error, 'fetch exchange detail');
        }
    }

    /**
     * Fetches exchange tickers for a specific exchange with optional filtering
     * @param id The exchange ID
     * @param params Optional parameters for filtering and pagination
     * @returns Exchange tickers response including exchange name and tickers array
     */
    async getExchangeTickers(id: string, params: ExchangeParams = {}): Promise<ExchangeTickersResponse> {
        try {
            const response = await this.axiosInstance.get(`/exchanges/${id}/tickers`, {
                params: {
                    per_page: 100,
                    page: 1,
                    ...params,
                },
            });

            if (!response.data || !response.data.name || !Array.isArray(response.data.tickers)) {
                throw new Error('Invalid response format from CoinGecko API');
            }

            // Validate each ticker in the response
            const validTickers = response.data.tickers.filter((ticker: CoinTicker) => {
                return (
                    ticker.base &&
                    ticker.target &&
                    ticker.market &&
                    typeof ticker.last === 'number' &&
                    typeof ticker.volume === 'number' &&
                    ticker.converted_last &&
                    ticker.converted_volume &&
                    ticker.trust_score &&
                    ticker.timestamp &&
                    ticker.last_traded_at &&
                    ticker.last_fetch_at &&
                    typeof ticker.is_anomaly === 'boolean' &&
                    typeof ticker.is_stale === 'boolean' &&
                    ticker.trade_url &&
                    ticker.coin_id &&
                    ticker.target_coin_id
                );
            });

            return {
                name: response.data.name,
                tickers: validTickers,
            };
        } catch (error) {
            this.handleApiError(error, 'fetch exchange tickers');
        }
    }

    /**
     * Fetches exchange volume chart data for a specific exchange
     * @param id The exchange ID
     * @param days Number of days of data to fetch (default: 7)
     * @returns Array of [timestamp, volume] pairs
     */
    async getExchangeVolumeChart(id: string, days: number = 7): Promise<[number, number][]> {
        try {
            const response = await this.axiosInstance.get(`/exchanges/${id}/volume_chart`, {
                params: { days },
            });

            if (!response.data || !Array.isArray(response.data)) {
                throw new Error('Invalid response format from CoinGecko API');
            }

            return response.data;
        } catch (error) {
            this.handleApiError(error, 'fetch exchange volume chart');
        }
    }

    /**
     * Fetches the list of all exchange IDs and names
     * This is a lightweight endpoint that returns just the exchange IDs and names
     */
    async getExchangeList(): Promise<ExchangeListItem[]> {
        const now = Date.now();

        // Return cached data if it's still valid
        if (this.exchangeListCache && now - this.lastExchangeListFetch < this.CACHE_DURATION) {
            return this.exchangeListCache;
        }

        try {
            const response = await this.axiosInstance.get('/exchanges/list');

            if (!Array.isArray(response.data)) {
                throw new Error('Invalid response format from CoinGecko API');
            }

            this.exchangeListCache = response.data;
            this.lastExchangeListFetch = now;

            return response.data;
        } catch (error) {
            this.handleApiError(error, 'fetch exchange list');
        }
    }

    /**
     * Creates a map of exchange IDs to their names for quick lookup
     */
    async getExchangeIdMap(): Promise<Map<string, string>> {
        const exchanges = await this.getExchangeList();
        return new Map(exchanges.map((exchange) => [exchange.id, exchange.name]));
    }

    /**
     * Fetches BTC-to-currency exchange rates
     */
    async getExchangeRates(): Promise<import('@/types/coingecko').ExchangeRatesResponse> {
        try {
            const response = await this.axiosInstance.get('/exchange_rates');
            if (!response.data || typeof response.data.rates !== 'object') {
                throw new Error('Invalid response format from CoinGecko API');
            }
            return response.data;
        } catch (error) {
            this.handleApiError(error, 'fetch exchange rates');
        }
    }
}

// Export a singleton instance
export const coinGeckoService = new CoinGeckoService();
