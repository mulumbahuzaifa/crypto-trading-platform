import { Button } from '@/Components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Input } from '@/Components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/Components/ui/table';
import { formatCurrency, formatNumber } from '@/lib/utils';
import { PageProps } from '@/types';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';

interface TradingProps extends PageProps {
    cryptocurrency: any;
    userWallets: any[];
    recentTrades: any[];
    orderBook: {
        bids: any[];
        asks: any[];
    };
}

export default function Trading({ cryptocurrency, userWallets, recentTrades, orderBook }: TradingProps) {
    const [orderType, setOrderType] = useState('market');
    const [orderSide, setOrderSide] = useState('buy');
    const [amount, setAmount] = useState('');
    const [price, setPrice] = useState('');

    const handleOrderSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        router.post(route('trading.orders.create'), {
            cryptocurrency_id: cryptocurrency.id,
            type: orderSide,
            order_type: orderType,
            amount: parseFloat(amount),
            price: orderType !== 'market' ? parseFloat(price) : null,
        });
    };

    return (
        <>
            <Head title={`${cryptocurrency.name} Trading`} />

            <div className="container mx-auto py-6">
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    {/* Order Book */}
                    <Card className="lg:col-span-1">
                        <CardHeader>
                            <CardTitle>Order Book</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {/* Asks (Sell Orders) */}
                                <div>
                                    <h3 className="mb-2 text-sm font-medium">Asks</h3>
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Price</TableHead>
                                                <TableHead>Amount</TableHead>
                                                <TableHead>Total</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {orderBook.asks.map((ask) => (
                                                <TableRow key={ask.id} className="text-red-500">
                                                    <TableCell>{formatCurrency(ask.price)}</TableCell>
                                                    <TableCell>{formatNumber(ask.amount)}</TableCell>
                                                    <TableCell>{formatCurrency(ask.total)}</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>

                                {/* Current Price */}
                                <div className="py-4 text-center">
                                    <div className="text-2xl font-bold">{formatCurrency(cryptocurrency.current_price)}</div>
                                    <div className={`text-sm ${cryptocurrency.price_change_percentage_24h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                        {formatNumber(cryptocurrency.price_change_percentage_24h)}%
                                    </div>
                                </div>

                                {/* Bids (Buy Orders) */}
                                <div>
                                    <h3 className="mb-2 text-sm font-medium">Bids</h3>
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Price</TableHead>
                                                <TableHead>Amount</TableHead>
                                                <TableHead>Total</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {orderBook.bids.map((bid) => (
                                                <TableRow key={bid.id} className="text-green-500">
                                                    <TableCell>{formatCurrency(bid.price)}</TableCell>
                                                    <TableCell>{formatNumber(bid.amount)}</TableCell>
                                                    <TableCell>{formatCurrency(bid.total)}</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Trading Form */}
                    <Card className="lg:col-span-1">
                        <CardHeader>
                            <CardTitle>Place Order</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleOrderSubmit} className="space-y-4">
                                <div className="flex space-x-2">
                                    <Button
                                        type="button"
                                        variant={orderSide === 'buy' ? 'default' : 'outline'}
                                        onClick={() => setOrderSide('buy')}
                                        className="flex-1"
                                    >
                                        Buy
                                    </Button>
                                    <Button
                                        type="button"
                                        variant={orderSide === 'sell' ? 'default' : 'outline'}
                                        onClick={() => setOrderSide('sell')}
                                        className="flex-1"
                                    >
                                        Sell
                                    </Button>
                                </div>

                                <Select value={orderType} onValueChange={setOrderType}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Order Type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="market">Market</SelectItem>
                                        <SelectItem value="limit">Limit</SelectItem>
                                        <SelectItem value="stop_loss">Stop Loss</SelectItem>
                                        <SelectItem value="take_profit">Take Profit</SelectItem>
                                    </SelectContent>
                                </Select>

                                {orderType !== 'market' && (
                                    <Input
                                        type="number"
                                        placeholder="Price"
                                        value={price}
                                        onChange={(e) => setPrice(e.target.value)}
                                        step="0.00000001"
                                    />
                                )}

                                <Input
                                    type="number"
                                    placeholder="Amount"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    step="0.00000001"
                                />

                                <Button type="submit" className="w-full">
                                    {orderSide === 'buy' ? 'Buy' : 'Sell'} {cryptocurrency.symbol}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>

                    {/* Recent Trades */}
                    <Card className="lg:col-span-1">
                        <CardHeader>
                            <CardTitle>Recent Trades</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Price</TableHead>
                                        <TableHead>Amount</TableHead>
                                        <TableHead>Time</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {recentTrades.map((trade) => (
                                        <TableRow key={trade.id}>
                                            <TableCell className={trade.type === 'buy' ? 'text-green-500' : 'text-red-500'}>
                                                {formatCurrency(trade.price)}
                                            </TableCell>
                                            <TableCell>{formatNumber(trade.amount)}</TableCell>
                                            <TableCell>{new Date(trade.created_at).toLocaleTimeString()}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
}
