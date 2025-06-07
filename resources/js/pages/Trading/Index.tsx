import StockChart from '@/components/StockChart';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import LandingLayout from '@/layouts/LandingLayout';
import { formatCurrency, formatNumber } from '@/lib/utils';
import { coinGeckoService } from '@/services/coingecko';
import { CoinMarketData } from '@/types/coingecko';
import { Head } from '@inertiajs/react';
import { ArrowDownRight, ArrowUpRight, Search, Star } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function Trading() {
    const [orderType, setOrderType] = useState('limit');
    const [orderSide, setOrderSide] = useState('buy');
    const [price, setPrice] = useState('');
    const [amount, setAmount] = useState('');
    const [selectedPair, setSelectedPair] = useState('bitcoin');
    const [coins, setCoins] = useState<CoinMarketData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchCoins = async () => {
            try {
                setLoading(true);
                const data = await coinGeckoService.getMarketData({
                    vs_currency: 'usd',
                    order: 'market_cap_desc',
                    per_page: 100,
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
        const interval = setInterval(fetchCoins, 60000);
        return () => clearInterval(interval);
    }, []);

    const selectedCoin = coins.find((coin) => coin.id === selectedPair);

    return (
        <LandingLayout>
            <Head title="Trading" />

            <div className="container-fluid mtb15 no-fluid">
                <div className="row sm-gutters">
                    {/* Market Pairs */}
                    <div className="col-md-3">
                        <Card className="h-[calc(100vh-2rem)]">
                            <CardContent className="flex h-full flex-col p-4">
                                <div className="relative mb-4">
                                    <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                                    <Input type="text" placeholder="Search" className="pl-9" />
                                </div>
                                <div className="mb-4 flex space-x-2">
                                    <Button variant="ghost" size="sm" className="flex-1">
                                        <Star className="h-4 w-4" />
                                    </Button>
                                    <Button variant="ghost" size="sm" className="flex-1" onClick={() => setSelectedPair('bitcoin')}>
                                        BTC
                                    </Button>
                                    <Button variant="ghost" size="sm" className="flex-1" onClick={() => setSelectedPair('ethereum')}>
                                        ETH
                                    </Button>
                                    <Button variant="ghost" size="sm" className="flex-1" onClick={() => setSelectedPair('tether')}>
                                        USDT
                                    </Button>
                                </div>
                                <div className="relative flex-1">
                                    <div className="absolute inset-0 overflow-hidden">
                                        <div className="h-full overflow-y-auto">
                                            <Table>
                                                <TableHeader className="bg-background sticky top-0 z-10">
                                                    <TableRow>
                                                        <TableHead className="w-[120px]">Pairs</TableHead>
                                                        <TableHead className="text-right">Last Price</TableHead>
                                                        <TableHead className="text-right">Change</TableHead>
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
                                                            </TableRow>
                                                        ))
                                                    ) : error ? (
                                                        // Error state
                                                        <TableRow>
                                                            <TableCell colSpan={3}>
                                                                <div className="border-destructive bg-destructive/10 text-destructive rounded-lg border p-4">
                                                                    {error}
                                                                </div>
                                                            </TableCell>
                                                        </TableRow>
                                                    ) : (
                                                        // Success state
                                                        coins.map((coin) => (
                                                            <TableRow
                                                                key={coin.id}
                                                                className={`hover:bg-muted/50 cursor-pointer transition-colors ${
                                                                    selectedPair === coin.id ? 'bg-muted/50' : ''
                                                                }`}
                                                                onClick={() => setSelectedPair(coin.id)}
                                                            >
                                                                <TableCell>
                                                                    <div className="flex items-center space-x-2">
                                                                        <Star className="h-4 w-4 text-yellow-500" />
                                                                        <span className="font-medium">{coin.symbol.toUpperCase()}/USD</span>
                                                                    </div>
                                                                </TableCell>
                                                                <TableCell className="text-right font-medium">
                                                                    {formatCurrency(coin.current_price)}
                                                                </TableCell>
                                                                <TableCell
                                                                    className={`text-right ${
                                                                        coin.price_change_percentage_24h >= 0 ? 'text-green-500' : 'text-red-500'
                                                                    }`}
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
                                                            </TableRow>
                                                        ))
                                                    )}
                                                </TableBody>
                                            </Table>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Trading Chart and Form */}
                    <div className="col-md-6">
                        <Card className="mb-4">
                            <CardContent className="p-0">
                                <div className="h-[550px]">
                                    <StockChart coinId={selectedPair} />
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <div className="flex space-x-2">
                                    <Button variant={orderType === 'limit' ? 'default' : 'outline'} onClick={() => setOrderType('limit')}>
                                        Limit
                                    </Button>
                                    <Button variant={orderType === 'market' ? 'default' : 'outline'} onClick={() => setOrderType('market')}>
                                        Market
                                    </Button>
                                    <Button variant={orderType === 'stop-limit' ? 'default' : 'outline'} onClick={() => setOrderType('stop-limit')}>
                                        Stop Limit
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-2 gap-4">
                                    {/* Buy Form */}
                                    <div className="space-y-4">
                                        <div className="flex space-x-2">
                                            <Button
                                                variant={orderSide === 'buy' ? 'default' : 'outline'}
                                                onClick={() => setOrderSide('buy')}
                                                className="flex-1 bg-green-500 hover:bg-green-600"
                                            >
                                                Buy
                                            </Button>
                                            <Button
                                                variant={orderSide === 'sell' ? 'default' : 'outline'}
                                                onClick={() => setOrderSide('sell')}
                                                className="flex-1 bg-red-500 hover:bg-red-600"
                                            >
                                                Sell
                                            </Button>
                                        </div>

                                        {orderType !== 'market' && (
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium">Price</label>
                                                <Input type="number" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="0.00" />
                                            </div>
                                        )}

                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Amount</label>
                                            <Input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0.00" />
                                        </div>

                                        <div className="flex space-x-2">
                                            <Button variant="outline" className="flex-1">
                                                25%
                                            </Button>
                                            <Button variant="outline" className="flex-1">
                                                50%
                                            </Button>
                                            <Button variant="outline" className="flex-1">
                                                75%
                                            </Button>
                                            <Button variant="outline" className="flex-1">
                                                100%
                                            </Button>
                                        </div>

                                        <div className="space-y-2 text-sm">
                                            <p>
                                                Available: <span>0.00 {selectedCoin?.symbol.toUpperCase()}</span>
                                            </p>
                                            <p>
                                                Volume: <span>0.00 {selectedCoin?.symbol.toUpperCase()}</span>
                                            </p>
                                            <p>
                                                Fee: <span>0.00 {selectedCoin?.symbol.toUpperCase()}</span>
                                            </p>
                                        </div>

                                        <Button
                                            className={`w-full ${orderSide === 'buy' ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600'}`}
                                        >
                                            {orderSide === 'buy' ? 'Buy' : 'Sell'} {selectedCoin?.symbol.toUpperCase()}
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Order Book and Recent Trades */}
                    <div className="col-md-3">
                        <Card className="mb-4">
                            <CardHeader>
                                <CardTitle>Order Book</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Price(USD)</TableHead>
                                            <TableHead>Amount</TableHead>
                                            <TableHead>Total</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {/* Sell Orders */}
                                        <TableRow className="bg-red-500/10">
                                            <TableCell className="text-red-500">{selectedCoin?.current_price}</TableCell>
                                            <TableCell>1.253415</TableCell>
                                            <TableCell>15.27648</TableCell>
                                        </TableRow>
                                        {/* Buy Orders */}
                                        <TableRow className="bg-green-500/10">
                                            <TableCell className="text-green-500">{selectedCoin?.current_price}</TableCell>
                                            <TableCell>1.209515</TableCell>
                                            <TableCell>15.23248</TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Recent Trades</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Time</TableHead>
                                            <TableHead>Price(USD)</TableHead>
                                            <TableHead>Amount</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        <TableRow>
                                            <TableCell>13:03:53</TableCell>
                                            <TableCell className="text-red-500">{selectedCoin?.current_price}</TableCell>
                                            <TableCell>0.2155045</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>13:03:52</TableCell>
                                            <TableCell className="text-green-500">{selectedCoin?.current_price}</TableCell>
                                            <TableCell>0.2155045</TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </LandingLayout>
    );
}
