export interface MarketChartData {
    prices: [number, number][];
    market_caps: [number, number][];
    total_volumes: [number, number][];
}

export interface MarketChartParams {
    id: string;
    vs_currency?: string;
    days?: number;
}

export interface MarketChartRangeParams {
    id: string;
    vs_currency?: string;
    from: number; // Unix timestamp in seconds
    to: number; // Unix timestamp in seconds
}

export interface CoinListItem {
    id: string;
    symbol: string;
    name: string;
    platforms: {
        [platform: string]: string;
    };
}

export interface CoinMarketData {
    id: string;
    symbol: string;
    name: string;
    image: string;
    current_price: number;
    market_cap: number;
    market_cap_rank: number;
    fully_diluted_valuation: number;
    total_volume: number;
    high_24h: number;
    low_24h: number;
    price_change_24h: number;
    price_change_percentage_24h: number;
    market_cap_change_24h: number;
    market_cap_change_percentage_24h: number;
    circulating_supply: number;
    total_supply: number;
    max_supply: number;
    ath: number;
    ath_change_percentage: number;
    ath_date: string;
    atl: number;
    atl_change_percentage: number;
    atl_date: string;
    roi: {
        times: number;
        currency: string;
        percentage: number;
    } | null;
    last_updated: string;
}

export interface MarketDataParams {
    vs_currency?: string;
    ids?: string[];
    order?: 'market_cap_desc' | 'market_cap_asc' | 'volume_desc' | 'volume_asc' | 'id_desc' | 'id_asc';
    per_page?: number;
    page?: number;
    sparkline?: boolean;
    price_change_percentage?: string;
    locale?: string;
}

export interface CoinTicker {
    base: string;
    target: string;
    market: {
        name: string;
        identifier: string;
        has_trading_incentive: boolean;
        logo?: string;
    };
    last: number;
    volume: number;
    cost_to_move_up_usd?: number;
    cost_to_move_down_usd?: number;
    converted_last: {
        btc: number;
        eth: number;
        usd: number;
    };
    converted_volume: {
        btc: number;
        eth: number;
        usd: number;
    };
    trust_score: string;
    bid_ask_spread_percentage: number;
    timestamp: string;
    last_traded_at: string;
    last_fetch_at: string;
    is_anomaly: boolean;
    is_stale: boolean;
    trade_url: string;
    token_info_url: string | null;
    coin_id: string;
    target_coin_id: string;
}

export interface ExchangeTickersResponse {
    name: string;
    tickers: CoinTicker[];
}

export interface StatusUpdate {
    description: string;
    category: string;
    created_at: string;
    user: string;
    user_title: string;
    pin: boolean;
    project: {
        type: string;
        id: string;
        name: string;
        symbol: string;
        image: {
            thumb: string;
            small: string;
            large: string;
        };
    };
}

export interface CoinHistoricalData {
    id: string;
    symbol: string;
    name: string;
    localization: {
        [locale: string]: string;
    };
    image: {
        thumb: string;
        small: string;
    };
    market_data: {
        current_price: {
            [currency: string]: number;
        };
        market_cap: {
            [currency: string]: number;
        };
        total_volume: {
            [currency: string]: number;
        };
    };
    community_data: {
        facebook_likes: number | null;
        twitter_followers: number | null;
        reddit_average_posts_48h: number;
        reddit_average_comments_48h: number;
        reddit_subscribers: number | null;
        reddit_accounts_active_48h: number | null;
    };
    developer_data: {
        forks: number;
        stars: number;
        subscribers: number;
        total_issues: number;
        closed_issues: number;
        pull_requests_merged: number;
        pull_request_contributors: number;
        code_additions_deletions_4_weeks: {
            additions: number;
            deletions: number;
        };
        commit_count_4_weeks: number;
    };
    public_interest_stats: {
        alexa_rank: number | null;
        bing_matches: number | null;
    };
}

export interface HistoricalDataParams {
    id: string;
    date: string; // Format: dd-mm-yyyy
}

export type TimePeriod = '1D' | '1W' | '1M';

export const timePeriodConfig: Record<TimePeriod, { days: number }> = {
    '1D': { days: 1 },
    '1W': { days: 7 },
    '1M': { days: 30 },
};

export interface Exchange {
    name: string;
    year_established: number;
    country: string;
    description: string;
    url: string;
    image: string;
    facebook_url: string;
    reddit_url: string;
    telegram_url: string;
    slack_url: string;
    other_url_1: string;
    other_url_2: string;
    twitter_handle: string;
    has_trading_incentive: boolean;
    centralized: boolean;
    public_notice: string;
    alert_notice: string;
    trust_score: number;
    trust_score_rank: number;
    trade_volume_24h_btc: number;
    trade_volume_24h_btc_normalized: number;
    coins: number;
    pairs: number;
    tickers: CoinTicker[];
}

export interface ExchangeParams {
    per_page?: number;
    page?: number;
}

export interface ExchangeListItem {
    id: string;
    name: string;
}

export interface ExchangeRate {
    id: string;
    name: string;
    unit: string;
    value: number;
    type: string;
}

export interface ExchangeRatesResponse {
    rates: {
        [key: string]: ExchangeRate;
    };
}
