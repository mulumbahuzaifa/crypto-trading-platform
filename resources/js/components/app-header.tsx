import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetHeader, SheetTrigger } from '@/components/ui/sheet';
import { UserMenuContent } from '@/components/user-menu-content';
import { useInitials } from '@/hooks/use-initials';
import { type NavItem, type SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { BarChart3, ChevronDown, ChevronRight, LayoutGrid, LogOut, Menu, Search, Settings, Wallet } from 'lucide-react';
import { useState } from 'react';
import AppLogo from './app-logo';

const mainNavItems: NavItem[] = [
    {
        title: 'Exchange',
        href: route('trading.index'),
        icon: BarChart3,
        dropdown: [
            { title: 'Spot Trading', href: route('trading.index') },
            { title: 'Live Prices', href: route('trading.live-prices') },
            { title: 'Order Book', href: route('trading.order-book') },
        ],
    },
    {
        title: 'Markets',
        href: route('markets.index'),
        icon: BarChart3,
        dropdown: [
            { title: 'Market Overview', href: route('markets.index') },
            { title: 'Market Cap', href: route('markets.cap') },
            { title: 'Market Trends', href: route('markets.trends') },
        ],
    },
    {
        title: 'Dashboard',
        href: route('dashboard'),
        icon: LayoutGrid,
        dropdown: [
            { title: 'Overview', href: route('dashboard') },
            { title: 'Portfolio', href: route('dashboard.portfolio') },
            { title: 'Trading History', href: route('dashboard.history') },
        ],
    },
    {
        title: 'Wallet',
        href: route('wallets.index'),
        icon: Wallet,
        dropdown: [
            { title: 'My Wallets', href: route('wallets.index') },
            { title: 'Deposit', href: route('wallets.deposit') },
            { title: 'Withdraw', href: route('wallets.withdraw') },
        ],
    },
];

const rightNavItems: NavItem[] = [
    {
        title: 'Sign In',
        href: route('login'),
        icon: null,
    },
    {
        title: 'Get Started',
        href: route('register'),
        icon: null,
    },
];

interface AppHeaderProps {
    breadcrumbs?: unknown[];
}

export function AppHeader({ breadcrumbs = [] }: AppHeaderProps) {
    const page = usePage<SharedData>();
    const { auth } = page.props;
    const getInitials = useInitials();
    const isAuthenticated = auth?.user;
    const [expandedMenu, setExpandedMenu] = useState<string | null>(null);

    const toggleMenu = (title: string) => {
        setExpandedMenu(expandedMenu === title ? null : title);
    };

    return (
        // <div className="border-b border-neutral-200 dark:border-neutral-800">
        <div className="border-sidebar-border/50 sticky top-0 right-0 left-0 shrink-0 items-center justify-between gap-2 border-b bg-gray-600 px-6 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 md:px-4">
            <nav className="navbar navbar-expand-lg">
                {/* Mobile Menu */}
                <div className="lg:hidden">
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-11 w-11 rounded-full">
                                <Menu className="h-7 w-7" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left" className="sm:max-w-xs">
                            <SheetHeader className="mb-6 flex justify-start text-left">
                                <AppLogo className="h-20 w-20" />
                            </SheetHeader>
                            <div className="flex flex-col space-y-2">
                            {mainNavItems.map((item) => (
                                    <div key={item.title} className="flex flex-col">
                                        <button
                                            onClick={() => item.dropdown && toggleMenu(item.title)}
                                            className="text-foreground hover:text-foreground flex items-center justify-between px-2.5 py-2"
                                        >
                                            <div className="flex items-center gap-4">
                                                {item.icon && <item.icon className="h-5 w-5" />}
                                                <span>{item.title}</span>
                                            </div>
                                            {item.dropdown && (
                                                <ChevronRight
                                                    className={`h-4 w-4 transition-transform ${expandedMenu === item.title ? 'rotate-90' : ''}`}
                                                />
                                            )}
                                        </button>
                                        {item.dropdown && expandedMenu === item.title && (
                                            <div className="dropdown-body mt-2 ml-4 flex flex-col space-y-2 border-l border-neutral-200 pl-4 dark:border-neutral-800">
                                                    {item.dropdown.map((subItem) => (
                                                            <Link
                                                                key={subItem.title}
                                                                href={subItem.href}
                                                        className="dropdown-item text-muted-foreground hover:text-foreground px-2.5 py-1 text-sm"
                                                            >
                                                                {subItem.title}
                                                            </Link>
                                                    ))}
                                                </div>
                                            )}
                                </div>
                            ))}

                                {!isAuthenticated ? (
                                <div className="mt-4 flex flex-col space-y-2">
                                    {rightNavItems.map((item) => (
                                        <Link
                                            key={item.title}
                                            href={item.href ? item.href : ''}
                                            className="text-muted-foreground hover:text-foreground flex items-center gap-4 px-2.5 py-2"
                                        >
                                            {item.icon && <item.icon className="h-5 w-5" />}
                                            <span>{item.title}</span>
                                        </Link>
                                    ))}
                                </div>
                                ) : (
                                    <div className="mt-4 flex flex-col space-y-2 border-t border-neutral-200 pt-4 dark:border-neutral-800">
                                        <div className="flex items-center gap-4 px-2.5 py-2">
                                            <Avatar className="size-8 overflow-hidden rounded-full">
                                                <AvatarImage src={auth.user.avatar} alt={auth.user.name} />
                                                <AvatarFallback className="rounded-lg bg-neutral-200 text-black dark:bg-neutral-700 dark:text-white">
                                                    {getInitials(auth.user.name)}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="flex flex-col">
                                                <span className="font-medium">{auth.user.name}</span>
                                                <span className="text-muted-foreground text-sm">{auth.user.email}</span>
                                            </div>
                                        </div>
                                        <div className="flex flex-col space-y-1">
                                            <Link
                                                href={route('settings.index')}
                                                className="text-muted-foreground hover:text-foreground flex items-center gap-4 px-2.5 py-2"
                                            >
                                                <Settings className="h-5 w-5" />
                                                <span>Settings</span>
                                            </Link>
                                            {/* <Link
                                                href={route('settings.profile')}
                                                className="text-muted-foreground hover:text-foreground flex items-center gap-4 px-2.5 py-2"
                                            >
                                                <User className="h-5 w-5" />
                                                <span>Profile</span>
                                            </Link>
                                            <Link
                                                href={route('settings.security')}
                                                className="text-muted-foreground hover:text-foreground flex items-center gap-4 px-2.5 py-2"
                                            >
                                                <Shield className="h-5 w-5" />
                                                <span>Security</span>
                                            </Link> */}
                                            <Link
                                                href={route('logout')}
                                                method="post"
                                                as="button"
                                                className="text-muted-foreground hover:text-foreground flex items-center gap-4 px-2.5 py-2"
                                            >
                                                <LogOut className="h-5 w-5" />
                                                <span>Sign Out</span>
                                            </Link>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>

                <Link href="/" className="navbar-brand">
                    <AppLogo className="h-30 w-30" />
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden lg:flex lg:flex-1 lg:items-center lg:justify-between">
                    <ul className="navbar-nav mr-auto flex space-x-6">
                        {mainNavItems.map((item) => (
                            <li key={item.title} className="nav-item">
                                {item.dropdown ? (
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" className="flex items-center space-x-1">
                                                <span>{item.title}</span>
                                                <ChevronDown className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent>
                                            {item.dropdown.map((subItem) => (
                                                <DropdownMenuItem key={subItem.title} asChild>
                                                    <Link href={subItem.href}>{subItem.title}</Link>
                                                </DropdownMenuItem>
                                            ))}
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                ) : (
                                    <Link href={item.href ? item.href : ''} className="nav-link">
                                        {item.title}
                                    </Link>
                                )}
                            </li>
                        ))}
                    </ul>

                    <div className="ml-auto flex items-center space-x-4">
                        <Button variant="ghost" size="icon" className="group h-9 w-9 cursor-pointer">
                            <Search className="!size-5 opacity-80 group-hover:opacity-100" />
                        </Button>

                        {isAuthenticated ? (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="size-10 rounded-full p-1">
                                        <Avatar className="size-8 overflow-hidden rounded-full">
                                            <AvatarImage src={auth.user.avatar} alt={auth.user.name} />
                                            <AvatarFallback className="rounded-lg bg-neutral-200 text-black dark:bg-neutral-700 dark:text-white">
                                                {getInitials(auth.user.name)}
                                            </AvatarFallback>
                                        </Avatar>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-56" align="end">
                                    <UserMenuContent user={auth.user} />
                                </DropdownMenuContent>
                            </DropdownMenu>
                        ) : (
                            <div className="flex space-x-2">
                                <Link href={route('login')}>
                                    <Button variant="outline" className="btn-1">
                                        Sign In
                                    </Button>
                                </Link>
                                <Link href={route('register')}>
                                    <Button className="btn-2">Get Started</Button>
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </nav>
        </div>
    );
}
