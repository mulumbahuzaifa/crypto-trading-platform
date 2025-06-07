import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { coinGeckoService } from '@/services/coingecko';
import { CoinMarketData } from '@/types/coingecko';
import { ArrowDown, ArrowUp, Search } from 'lucide-react';
import { useEffect, useState } from 'react';

interface AssetTableProps {
    category?: 'all' | 'top50' | 'topGainers' | 'topLosers';
}

function AssetTable({ category = 'all' }: AssetTableProps) {
    const [coins, setCoins] = useState<CoinMarketData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const fetchCoins = async () => {
            try {
                setLoading(true);
                const data = await coinGeckoService.getMarketData({
                    vs_currency: 'usd',
                    order: 'market_cap_desc',
                    per_page: 100, // Fetch more coins to handle filtering
                    sparkline: false,
                });
                setCoins(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to fetch coins');
            } finally {
                setLoading(false);
            }
        };

        fetchCoins();
        // Refresh data every 60 seconds
        const interval = setInterval(fetchCoins, 60000);
        return () => clearInterval(interval);
    }, []);

    const getFilteredCoins = () => {
        let filtered = [...coins];

        // Apply category filter
        switch (category) {
            case 'top50':
                filtered = filtered.slice(0, 50);
                break;
            case 'topGainers':
                filtered = filtered.sort((a, b) => b.price_change_percentage_24h - a.price_change_percentage_24h).slice(0, 50);
                break;
            case 'topLosers':
                filtered = filtered.sort((a, b) => a.price_change_percentage_24h - b.price_change_percentage_24h).slice(0, 50);
                break;
            default:
                // 'all' - no additional filtering needed
                break;
        }

        // Apply search filter
        if (searchQuery) {
            filtered = filtered.filter(
                (coin) =>
                    coin.name.toLowerCase().includes(searchQuery.toLowerCase()) || coin.symbol.toLowerCase().includes(searchQuery.toLowerCase()),
            );
        }

        return filtered;
    };

    const formatNumber = (num: number) => {
        if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`;
        if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`;
        if (num >= 1e3) return `$${(num / 1e3).toFixed(2)}K`;
        return `$${num.toFixed(2)}`;
    };

    const formatPercentage = (num: number) => {
        return `${num >= 0 ? '+' : ''}${num.toFixed(2)}%`;
    };

    if (loading) {
        return (
            <div className="flex h-full w-full flex-col space-y-4 p-4">
                <div className="bg-muted h-10 w-full animate-pulse rounded" />
                <div className="space-y-2">
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="bg-muted h-12 w-full animate-pulse rounded" />
                    ))}
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex h-full w-full items-center justify-center p-4">
                <div className="border-destructive bg-destructive/10 text-destructive rounded-lg border p-4">{error}</div>
            </div>
        );
    }

    const filteredCoins = getFilteredCoins();

    return (
        <div className="flex h-full w-full flex-col">
            <div className="bg-card sticky top-0 z-20 border-b p-4">
                <div className="relative">
                    <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                    <Input placeholder="Search coins..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-9" />
                </div>
            </div>
            <div className="flex-1 overflow-hidden">
                <Table>
                    <TableHeader className="bg-card sticky top-[72px] z-10">
                        <TableRow>
                            <TableHead className="w-[300px]">Coin</TableHead>
                            <TableHead className="text-right">Price</TableHead>
                            <TableHead className="text-right">24h %</TableHead>
                            <TableHead className="text-right">Market Cap</TableHead>
                            <TableHead className="text-right">Volume (24h)</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredCoins.map((coin) => (
                            <TableRow key={coin.id} className="hover:bg-muted/50">
                                <TableCell>
                                    <div className="flex items-center gap-3">
                                        <Avatar className="h-8 w-8">
                                            <AvatarImage src={coin.image} alt={coin.name} />
                                            <AvatarFallback>{coin.symbol.toUpperCase()}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <div className="font-medium">{coin.name}</div>
                                            <div className="text-muted-foreground text-sm">{coin.symbol.toUpperCase()}</div>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell className="text-right font-medium">{formatNumber(coin.current_price)}</TableCell>
                                <TableCell className="text-right">
                                    <div
                                        className={`flex items-center justify-end gap-1 ${
                                            coin.price_change_percentage_24h >= 0 ? 'text-green-500' : 'text-red-500'
                                        }`}
                                    >
                                        {coin.price_change_percentage_24h >= 0 ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />}
                                        {formatPercentage(coin.price_change_percentage_24h)}
                                    </div>
                                </TableCell>
                                <TableCell className="text-right">{formatNumber(coin.market_cap)}</TableCell>
                                <TableCell className="text-right">{formatNumber(coin.total_volume)}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}

export default AssetTable;
