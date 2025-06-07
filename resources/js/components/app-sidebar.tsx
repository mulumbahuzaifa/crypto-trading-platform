import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { ArrowUpRight, BarChart2, Coins, CreditCard, Headphones, HomeIcon, LayoutGrid, LineChart, ShoppingCart, Users, Wallet } from 'lucide-react';
import AppLogo from './app-logo';

const mainNavItems: NavItem[] = [
    {
        title: 'Home',
        href: '/',
        icon: HomeIcon,
    },
    {
        title: 'Dashboard',
        href: '/dashboard',
        icon: LayoutGrid,
    },
    {
        title: 'Manage Orders',
        icon: ShoppingCart,
        dropdown: [
            { title: 'All Orders', href: '/dashboard/orders' },
            { title: 'Pending Orders', href: '/dashboard/orders/pending' },
            { title: 'Completed Orders', href: '/dashboard/orders/completed' },
            { title: 'Cancelled Orders', href: '/dashboard/orders/cancelled' },
        ],
    },
    {
        title: 'Manage Currency',
        icon: Coins,
        dropdown: [
            { title: 'All Currencies', href: '/dashboard/currencies' },
            { title: 'Add Currency', href: '/dashboard/currencies/create' },
            { title: 'Exchange Rates', href: '/dashboard/currencies/rates' },
        ],
    },
    {
        title: 'Manage Market',
        href: '/dashboard/market',
        icon: LineChart,
    },
    {
        title: 'Manage Users',
        icon: Users,
        dropdown: [
            { title: 'All Users', href: '/dashboard/users' },
            { title: 'Add User', href: '/dashboard/users/create' },
            { title: 'User Roles', href: '/dashboard/users/roles' },
        ],
    },
    {
        title: 'Payment Gateways',
        icon: CreditCard,
        dropdown: [
            { title: 'All Gateways', href: '/dashboard/gateways' },
            { title: 'Add Gateway', href: '/dashboard/gateways/create' },
            { title: 'Gateway Settings', href: '/dashboard/gateways/settings' },
        ],
    },
    {
        title: 'Deposits',
        icon: Wallet,
        dropdown: [
            { title: 'All Deposits', href: '/dashboard/deposits' },
            { title: 'Pending Deposits', href: '/dashboard/deposits/pending' },
            { title: 'Completed Deposits', href: '/dashboard/deposits/completed' },
        ],
    },
    {
        title: 'Withdrawals',
        icon: ArrowUpRight,
        dropdown: [
            { title: 'All Withdrawals', href: '/dashboard/withdrawals' },
            { title: 'Pending Withdrawals', href: '/dashboard/withdrawals/pending' },
            { title: 'Completed Withdrawals', href: '/dashboard/withdrawals/completed' },
        ],
    },
    {
        title: 'Support Ticket',
        icon: Headphones,
        dropdown: [
            { title: 'All Tickets', href: '/dashboard/tickets' },
            { title: 'Open Tickets', href: '/dashboard/tickets/open' },
            { title: 'Closed Tickets', href: '/dashboard/tickets/closed' },
        ],
    },
];

const footerNavItems: NavItem[] = [
    {
        title: 'Reports',
        icon: BarChart2,
        dropdown: [
            { title: 'Transaction Reports', href: '/dashboard/reports/transactions' },
            { title: 'User Reports', href: '/dashboard/reports/users' },
            { title: 'Financial Reports', href: '/dashboard/reports/financial' },
        ],
    },
];

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/" prefetch>
                                <AppLogo className="h-20 w-20" />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
