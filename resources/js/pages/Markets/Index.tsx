import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import LandingLayout from '@/layouts/LandingLayout';
import { formatCurrency, formatNumber } from '@/lib/utils';
import { coinGeckoService } from '@/services/coingecko';
import { type BreadcrumbItem } from '@/types';
import { CoinMarketData } from '@/types/coingecko';
import { Head } from '@inertiajs/react';
import { ArrowDownRight, ArrowUpRight, BarChart2, DollarSign, Search, Star, TrendingDown, TrendingUp } from 'lucide-react';
import { useEffect, useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Markets',
        href: '/markets',
    },
];

export default function Markets() {
    const [marketData, setMarketData] = useState<CoinMarketData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState('market_cap_desc');
    const [favorites, setFavorites] = useState<string[]>([]);

    useEffect(() => {
        const fetchMarketData = async () => {
            try {
                setLoading(true);
                const data = await coinGeckoService.getMarketData({
                    vs_currency: 'usd',
                    order: sortBy as any,
                    per_page: 100,
                    sparkline: false,
                });
                setMarketData(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to fetch market data');
            } finally {
                setLoading(false);
            }
        };

        fetchMarketData();
        const interval = setInterval(fetchMarketData, 60000); // Refresh every minute
        return () => clearInterval(interval);
    }, [sortBy]);

    const filteredData = marketData.filter(
        (coin) => coin.name.toLowerCase().includes(searchQuery.toLowerCase()) || coin.symbol.toLowerCase().includes(searchQuery.toLowerCase()),
    );

    const toggleFavorite = (coinId: string) => {
        setFavorites((prev) => (prev.includes(coinId) ? prev.filter((id) => id !== coinId) : [...prev, coinId]));
    };

    return (
        <LandingLayout>
            <Head title="Markets" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                {/* Market Overview Cards */}
                <div className="grid gap-4 md:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Market Cap</CardTitle>
                            <DollarSign className="text-muted-foreground h-4 w-4" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{formatCurrency(marketData.reduce((sum, coin) => sum + coin.market_cap, 0))}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">24h Volume</CardTitle>
                            <BarChart2 className="text-muted-foreground h-4 w-4" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{formatCurrency(marketData.reduce((sum, coin) => sum + coin.total_volume, 0))}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Active Cryptocurrencies</CardTitle>
                            <TrendingUp className="h-4 w-4 text-green-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{marketData.length}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Market Dominance</CardTitle>
                            <TrendingDown className="h-4 w-4 text-red-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {((marketData[0]?.market_cap / marketData.reduce((sum, coin) => sum + coin.market_cap, 0)) * 100).toFixed(2)}%
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Top Cryptocurrencies */}
                <div className="grid gap-4 md:grid-cols-3">
                    {marketData.slice(0, 3).map((coin) => (
                        <Card key={coin.id} className="overflow-hidden">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <div className="flex items-center space-x-2">
                                    <img src={coin.image} alt={coin.name} className="h-8 w-8" />
                                    <div>
                                        <CardTitle className="text-sm font-medium">{coin.name}</CardTitle>
                                        <p className="text-muted-foreground text-xs">{coin.symbol.toUpperCase()}</p>
                                    </div>
                                </div>
                                <Button variant="ghost" size="icon" onClick={() => toggleFavorite(coin.id)}>
                                    <Star className={`h-4 w-4 ${favorites.includes(coin.id) ? 'fill-yellow-500 text-yellow-500' : ''}`} />
                                </Button>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <span className="text-muted-foreground text-sm">Price</span>
                                        <span className="font-medium">{formatCurrency(coin.current_price)}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-muted-foreground text-sm">24h Change</span>
                                        <span className={coin.price_change_percentage_24h >= 0 ? 'text-green-500' : 'text-red-500'}>
                                            {coin.price_change_percentage_24h >= 0 ? (
                                                <ArrowUpRight className="mr-1 inline-block h-4 w-4" />
                                            ) : (
                                                <ArrowDownRight className="mr-1 inline-block h-4 w-4" />
                                            )}
                                            {formatNumber(coin.price_change_percentage_24h)}%
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-muted-foreground text-sm">Market Cap</span>
                                        <span className="font-medium">{formatCurrency(coin.market_cap)}</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Market Table */}
                <Card className="flex flex-col">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle>All Cryptocurrencies</CardTitle>
                            <div className="flex items-center space-x-2">
                                <div className="relative">
                                    <Search className="text-muted-foreground absolute top-2.5 left-2 h-4 w-4" />
                                    <Input
                                        placeholder="Search coins..."
                                        className="pl-8"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                </div>
                                <Select value={sortBy} onValueChange={setSortBy}>
                                    <SelectTrigger className="w-[180px]">
                                        <SelectValue placeholder="Sort by" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="market_cap_desc">Market Cap (High to Low)</SelectItem>
                                        <SelectItem value="market_cap_asc">Market Cap (Low to High)</SelectItem>
                                        <SelectItem value="volume_desc">Volume (High to Low)</SelectItem>
                                        <SelectItem value="volume_asc">Volume (Low to High)</SelectItem>
                                        <SelectItem value="id_desc">Name (Z to A)</SelectItem>
                                        <SelectItem value="id_asc">Name (A to Z)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="flex-1 overflow-hidden p-0">
                        <div className="relative h-[600px] overflow-auto">
                            <Table>
                                <TableHeader className="bg-background sticky top-0 z-10">
                                    <TableRow>
                                        <TableHead>Coin</TableHead>
                                        <TableHead className="text-right">Price</TableHead>
                                        <TableHead className="text-right">24h Change</TableHead>
                                        <TableHead className="text-right">Market Cap</TableHead>
                                        <TableHead className="text-right">Volume</TableHead>
                                        <TableHead className="text-right">Circulating Supply</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {loading ? (
                                        // Loading state
                                        Array.from({ length: 5 }).map((_, index) => (
                                            <TableRow key={index}>
                                                <TableCell>
                                                    <div className="flex items-center space-x-2">
                                                        <div className="bg-muted h-4 w-4 animate-pulse rounded" />
                                                        <div className="bg-muted h-4 w-20 animate-pulse rounded" />
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="bg-muted h-4 w-24 animate-pulse rounded" />
                                                </TableCell>
                                                <TableCell>
                                                    <div className="bg-muted h-4 w-16 animate-pulse rounded" />
                                                </TableCell>
                                                <TableCell>
                                                    <div className="bg-muted h-4 w-32 animate-pulse rounded" />
                                                </TableCell>
                                                <TableCell>
                                                    <div className="bg-muted h-4 w-32 animate-pulse rounded" />
                                                </TableCell>
                                                <TableCell>
                                                    <div className="bg-muted h-4 w-32 animate-pulse rounded" />
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : error ? (
                                        <TableRow>
                                            <TableCell colSpan={6}>
                                                <div className="border-destructive bg-destructive/10 text-destructive rounded-lg border p-4">
                                                    {error}
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        filteredData.map((coin) => (
                                            <TableRow key={coin.id}>
                                                <TableCell>
                                                    <div className="flex items-center space-x-2">
                                                        <Button variant="ghost" size="icon" onClick={() => toggleFavorite(coin.id)}>
                                                            <Star
                                                                className={`h-4 w-4 ${favorites.includes(coin.id) ? 'fill-yellow-500 text-yellow-500' : ''}`}
                                                            />
                                                        </Button>
                                                        <img src={coin.image} alt={coin.name} className="h-6 w-6" />
                                                        <span className="font-medium">{coin.name}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-right font-medium">{formatCurrency(coin.current_price)}</TableCell>
                                                <TableCell
                                                    className={`text-right ${coin.price_change_percentage_24h >= 0 ? 'text-green-500' : 'text-red-500'}`}
                                                >
                                                    <div className="flex items-center justify-end">
                                                        {coin.price_change_percentage_24h >= 0 ? (
                                                            <ArrowUpRight className="mr-1 h-4 w-4" />
                                                        ) : (
                                                            <ArrowDownRight className="mr-1 h-4 w-4" />
                                                        )}
                                                        {formatNumber(coin.price_change_percentage_24h)}%
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-right">{formatCurrency(coin.market_cap)}</TableCell>
                                                <TableCell className="text-right">{formatCurrency(coin.total_volume)}</TableCell>
                                                <TableCell className="text-right">
                                                    {formatNumber(coin.circulating_supply)} {coin.symbol.toUpperCase()}
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </LandingLayout>
    );
}
