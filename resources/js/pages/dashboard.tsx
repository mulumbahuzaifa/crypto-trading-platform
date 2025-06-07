import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { formatCurrency, formatNumber } from '@/lib/utils';
import { coinGeckoService } from '@/services/coingecko';
import { type BreadcrumbItem } from '@/types';
import { CoinMarketData } from '@/types/coingecko';
import { Head } from '@inertiajs/react';
import { ArrowDownRight, ArrowUpRight, BarChart2, DollarSign, TrendingDown, TrendingUp } from 'lucide-react';
import { useEffect, useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

export default function Dashboard() {
    const [marketData, setMarketData] = useState<CoinMarketData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchMarketData = async () => {
            try {
                setLoading(true);
                const data = await coinGeckoService.getMarketData({
                    vs_currency: 'usd',
                    order: 'market_cap_desc',
                    per_page: 10,
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
    }, []);

    const topGainers = [...marketData].sort((a, b) => b.price_change_percentage_24h - a.price_change_percentage_24h).slice(0, 3);

    const topLosers = [...marketData].sort((a, b) => a.price_change_percentage_24h - b.price_change_percentage_24h).slice(0, 3);

    const totalMarketCap = marketData.reduce((sum, coin) => sum + coin.market_cap, 0);
    const totalVolume = marketData.reduce((sum, coin) => sum + coin.total_volume, 0);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                {/* Market Overview Cards */}
                <div className="grid gap-4 md:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Market Cap</CardTitle>
                            <DollarSign className="text-muted-foreground h-4 w-4" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{formatCurrency(totalMarketCap)}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">24h Volume</CardTitle>
                            <BarChart2 className="text-muted-foreground h-4 w-4" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{formatCurrency(totalVolume)}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Top Gainers</CardTitle>
                            <TrendingUp className="h-4 w-4 text-green-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-green-500">{topGainers[0]?.price_change_percentage_24h.toFixed(2)}%</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Top Losers</CardTitle>
                            <TrendingDown className="h-4 w-4 text-red-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-red-500">{topLosers[0]?.price_change_percentage_24h.toFixed(2)}%</div>
                        </CardContent>
                    </Card>
                </div>

                {/* Market Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>Market Overview</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Coin</TableHead>
                                    <TableHead className="text-right">Price</TableHead>
                                    <TableHead className="text-right">24h Change</TableHead>
                                    <TableHead className="text-right">Market Cap</TableHead>
                                    <TableHead className="text-right">Volume</TableHead>
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
                                        </TableRow>
                                    ))
                                ) : error ? (
                                    <TableRow>
                                        <TableCell colSpan={5}>
                                            <div className="border-destructive bg-destructive/10 text-destructive rounded-lg border p-4">{error}</div>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    marketData.map((coin) => (
                                        <TableRow key={coin.id}>
                                            <TableCell>
                                                <div className="flex items-center space-x-2">
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
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
