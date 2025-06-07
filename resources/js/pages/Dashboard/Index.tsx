import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { formatCurrency, formatNumber } from '@/lib/utils';
import { Head } from '@inertiajs/react';
import { ArrowDown, ArrowUp, Wallet } from 'lucide-react';

interface Wallet {
    id: number;
    currency: string;
    balance: number;
    address: string;
}

interface Order {
    id: number;
    type: 'buy' | 'sell';
    cryptocurrency: {
        symbol: string;
    };
    amount: number;
    price: number;
    status: 'completed' | 'pending' | 'cancelled';
}

interface Cryptocurrency {
    id: number;
    name: string;
    symbol: string;
    current_price: number;
    price_change_percentage_24h: number;
    market_cap: number;
    volume_24h: number;
}

interface DashboardProps {
    wallets: Wallet[];
    recentOrders: Order[];
    topCryptocurrencies: Cryptocurrency[];
}

export default function Dashboard({ wallets, recentOrders, topCryptocurrencies }: DashboardProps) {
    return (
        <>
            <Head title="Dashboard" />

            <div className="container mx-auto space-y-6 py-6">
                {/* Portfolio Overview */}
                <Card>
                    <CardHeader>
                        <CardTitle>Portfolio Overview</CardTitle>
                        <CardDescription>Your cryptocurrency holdings and balances</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                            {wallets.map((wallet) => (
                                <Card key={wallet.id} className="relative overflow-hidden">
                                    <CardContent className="pt-6">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <div className="text-muted-foreground text-sm font-medium">{wallet.currency}</div>
                                                <div className="text-2xl font-bold">{formatNumber(wallet.balance)}</div>
                                            </div>
                                            <div className="bg-primary/10 rounded-full p-3">
                                                <Wallet className="text-primary h-6 w-6" />
                                            </div>
                                        </div>
                                        <div className="text-muted-foreground mt-4 text-sm">
                                            <span className="font-medium">Address:</span> {wallet.address}
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Recent Orders */}
                <Card>
                    <CardHeader>
                        <CardTitle>Recent Orders</CardTitle>
                        <CardDescription>Your latest trading orders and their status</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Type</TableHead>
                                    <TableHead>Pair</TableHead>
                                    <TableHead>Amount</TableHead>
                                    <TableHead>Price</TableHead>
                                    <TableHead>Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {recentOrders.map((order) => (
                                    <TableRow key={order.id}>
                                        <TableCell className="font-medium">
                                            <div className="flex items-center space-x-2">
                                                {order.type === 'buy' ? (
                                                    <ArrowUp className="h-4 w-4 text-green-500" />
                                                ) : (
                                                    <ArrowDown className="h-4 w-4 text-red-500" />
                                                )}
                                                <span className={`capitalize ${order.type === 'buy' ? 'text-green-500' : 'text-red-500'}`}>
                                                    {order.type}
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell>{order.cryptocurrency.symbol}/USD</TableCell>
                                        <TableCell>{formatNumber(order.amount)}</TableCell>
                                        <TableCell>{formatCurrency(order.price)}</TableCell>
                                        <TableCell>
                                            <span
                                                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                                    order.status === 'completed'
                                                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                                                        : order.status === 'pending'
                                                          ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
                                                          : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                                                }`}
                                            >
                                                {order.status}
                                            </span>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                {/* Market Overview */}
                <Card>
                    <CardHeader>
                        <CardTitle>Market Overview</CardTitle>
                        <CardDescription>Top cryptocurrencies by market capitalization</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Coin</TableHead>
                                    <TableHead>Price</TableHead>
                                    <TableHead>24h Change</TableHead>
                                    <TableHead>Market Cap</TableHead>
                                    <TableHead>Volume (24h)</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {topCryptocurrencies.map((crypto) => (
                                    <TableRow key={crypto.id}>
                                        <TableCell className="font-medium">
                                            <div className="flex items-center space-x-2">
                                                <span>{crypto.name}</span>
                                                <span className="text-muted-foreground">({crypto.symbol})</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>{formatCurrency(crypto.current_price)}</TableCell>
                                        <TableCell>
                                            <div className="flex items-center space-x-1">
                                                {crypto.price_change_percentage_24h >= 0 ? (
                                                    <ArrowUp className="h-4 w-4 text-green-500" />
                                                ) : (
                                                    <ArrowDown className="h-4 w-4 text-red-500" />
                                                )}
                                                <span className={crypto.price_change_percentage_24h >= 0 ? 'text-green-500' : 'text-red-500'}>
                                                    {formatNumber(crypto.price_change_percentage_24h)}%
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell>{formatCurrency(crypto.market_cap)}</TableCell>
                                        <TableCell>{formatCurrency(crypto.volume_24h)}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}
