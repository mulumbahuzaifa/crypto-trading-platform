import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { ArrowDown, ArrowUp, Wallet } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Portfolio',
        href: '/dashboard/portfolio',
    },
];

interface PortfolioProps {
    wallets: Array<{
        id: number;
        balance: string;
        currency: string;
        available_balance: string;
        transactions: Array<{
            id: number;
            type: string;
            amount: string;
            created_at: string;
        }>;
    }>;
    portfolioValue: string;
    availableBalance: string;
    recentTransactions: Array<{
        id: number;
        type: string;
        amount: string;
        created_at: string;
    }>;
}

export default function Portfolio({ wallets, portfolioValue, availableBalance, recentTransactions }: PortfolioProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Portfolio" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Portfolio Value</CardTitle>
                            <Wallet className="text-muted-foreground h-4 w-4" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">${portfolioValue}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Available Balance</CardTitle>
                            <Wallet className="text-muted-foreground h-4 w-4" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">${availableBalance}</div>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Wallets</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {wallets.map((wallet) => (
                                    <div key={wallet.id} className="flex items-center justify-between">
                                        <div>
                                            <p className="font-medium">{wallet.currency}</p>
                                            <p className="text-muted-foreground text-sm">Available: {wallet.available_balance}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-medium">{wallet.balance}</p>
                                            <p className="text-muted-foreground text-sm">Total Balance</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Recent Transactions</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {recentTransactions.map((transaction) => (
                                    <div key={transaction.id} className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            {transaction.type === 'deposit' ? (
                                                <ArrowDown className="h-4 w-4 text-green-500" />
                                            ) : (
                                                <ArrowUp className="h-4 w-4 text-red-500" />
                                            )}
                                            <div>
                                                <p className="font-medium capitalize">{transaction.type}</p>
                                                <p className="text-muted-foreground text-sm">
                                                    {new Date(transaction.created_at).toLocaleDateString()}
                                                </p>
                                            </div>
                                        </div>
                                        <p className="font-medium">{transaction.amount}</p>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
