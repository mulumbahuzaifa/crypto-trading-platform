import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'History',
        href: '/dashboard/history',
    },
];

interface HistoryProps {
    orders: {
        data: Array<{
            id: number;
            type: string;
            amount: string;
            price: string;
            total: string;
            status: string;
            created_at: string;
            cryptocurrency: {
                symbol: string;
                name: string;
            };
            tradingPair: {
                symbol: string;
            };
        }>;
    };
    trades: {
        data: Array<{
            id: number;
            amount: string;
            price: string;
            total: string;
            fee: string;
            status: string;
            created_at: string;
            cryptocurrency: {
                symbol: string;
                name: string;
            };
            tradingPair: {
                symbol: string;
            };
        }>;
    };
    statistics: {
        totalOrders: number;
        totalTrades: number;
        successfulTrades: number;
        totalVolume: string;
    };
}

export default function History({ orders, trades, statistics }: HistoryProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Trading History" />
        </AppLayout>
    );
}
