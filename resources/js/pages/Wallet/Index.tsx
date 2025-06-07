import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import LandingLayout from '@/layouts/LandingLayout';
import { formatCurrency } from '@/lib/utils';
import { Head, Link } from '@inertiajs/react';
import { ArrowDownRight, ArrowUpRight, BarChart2, DollarSign, History, Wallet } from 'lucide-react';

interface Wallet {
    id: number;
    currency: string;
    balance: number;
    available_balance: number;
    transactions: Transaction[];
    last_activity_at: string;
}

interface Transaction {
    id: number;
    type: 'deposit' | 'withdrawal';
    amount: number;
    currency: string;
    status: string;
    created_at: string;
    wallet: Wallet;
}

interface WalletIndexProps {
    wallets: Wallet[];
    recentTransactions: Transaction[];
}

export default function WalletIndex({ wallets, recentTransactions }: WalletIndexProps) {
    const totalBalance = wallets.reduce((sum, wallet) => sum + wallet.balance, 0);
    const totalAvailableBalance = wallets.reduce((sum, wallet) => sum + wallet.available_balance, 0);

    return (
        <LandingLayout>
            <Head title="My Wallets" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                {/* Overview Cards */}
                <div className="grid gap-4 md:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
                            <DollarSign className="text-muted-foreground h-4 w-4" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{formatCurrency(totalBalance)}</div>
                            <p className="text-muted-foreground text-xs">Across all wallets</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Available Balance</CardTitle>
                            <Wallet className="text-muted-foreground h-4 w-4" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{formatCurrency(totalAvailableBalance)}</div>
                            <p className="text-muted-foreground text-xs">Ready to trade</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Active Wallets</CardTitle>
                            <BarChart2 className="text-muted-foreground h-4 w-4" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{wallets.length}</div>
                            <p className="text-muted-foreground text-xs">Different currencies</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Recent Activity</CardTitle>
                            <History className="text-muted-foreground h-4 w-4" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{recentTransactions.length}</div>
                            <p className="text-muted-foreground text-xs">Last 24 hours</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Wallet Cards */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {wallets.map((wallet) => (
                        <Card key={wallet.id} className="overflow-hidden">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <div className="flex items-center space-x-2">
                                    <div className="bg-primary/10 rounded-full p-2">
                                        <Wallet className="text-primary h-4 w-4" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-sm font-medium">{wallet.currency}</CardTitle>
                                        <p className="text-muted-foreground text-xs">Wallet ID: {wallet.id}</p>
                                    </div>
                                </div>
                                <div className="flex space-x-2">
                                    <Link href={route('wallets.deposit')}>
                                        <Button variant="ghost" size="icon">
                                            <ArrowDownRight className="h-4 w-4 text-green-500" />
                                        </Button>
                                    </Link>
                                    <Link href={route('wallets.withdraw')}>
                                        <Button variant="ghost" size="icon">
                                            <ArrowUpRight className="h-4 w-4 text-red-500" />
                                        </Button>
                                    </Link>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <span className="text-muted-foreground text-sm">Total Balance</span>
                                        <span className="font-medium">{formatCurrency(wallet.balance)}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-muted-foreground text-sm">Available Balance</span>
                                        <span className="font-medium">{formatCurrency(wallet.available_balance)}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-muted-foreground text-sm">Last Activity</span>
                                        <span className="text-sm">{new Date(wallet.last_activity_at).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Recent Transactions */}
                <Card className="flex flex-col">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle>Recent Transactions</CardTitle>
                            <div className="flex space-x-2">
                                <Link href={route('wallets.deposit')}>
                                    <Button variant="outline" size="sm">
                                        <ArrowDownRight className="mr-2 h-4 w-4" />
                                        Deposit
                                    </Button>
                                </Link>
                                <Link href={route('wallets.withdraw')}>
                                    <Button variant="outline" size="sm">
                                        <ArrowUpRight className="mr-2 h-4 w-4" />
                                        Withdraw
                                    </Button>
                                </Link>
                                {/* <Link href={route('wallets.show', wallets[0]?.id)}>
                                <Button variant="outline" size="sm">
                                    View All
                                </Button>
                            </Link> */}
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="flex-1 overflow-hidden p-0">
                        <div className="relative h-[400px] overflow-auto">
                            <Table>
                                <TableHeader className="bg-background sticky top-0 z-10">
                                    <TableRow>
                                        <TableHead>Type</TableHead>
                                        <TableHead>Amount</TableHead>
                                        <TableHead>Currency</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Date</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {recentTransactions.map((transaction) => (
                                        <TableRow key={transaction.id}>
                                            <TableCell>
                                                <div className="flex items-center">
                                                    {transaction.type === 'deposit' ? (
                                                        <ArrowDownRight className="mr-2 h-4 w-4 text-green-500" />
                                                    ) : (
                                                        <ArrowUpRight className="mr-2 h-4 w-4 text-red-500" />
                                                    )}
                                                    <span className="capitalize">{transaction.type}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>{formatCurrency(transaction.amount)}</TableCell>
                                            <TableCell>{transaction.currency}</TableCell>
                                            <TableCell>
                                                <span
                                                    className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                                                        transaction.status === 'completed'
                                                            ? 'bg-green-100 text-green-700'
                                                            : transaction.status === 'pending'
                                                              ? 'bg-yellow-100 text-yellow-700'
                                                              : 'bg-red-100 text-red-700'
                                                    }`}
                                                >
                                                    {transaction.status}
                                                </span>
                                            </TableCell>
                                            <TableCell>{new Date(transaction.created_at).toLocaleDateString()}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </LandingLayout>
    );
}
