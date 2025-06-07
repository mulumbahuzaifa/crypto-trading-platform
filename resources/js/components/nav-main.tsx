import { SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';

export function NavMain({ items = [] }: { items: NavItem[] }) {
    const page = usePage();
    const [openDropdowns, setOpenDropdowns] = useState<Record<string, boolean>>({});

    const toggleDropdown = (title: string) => {
        setOpenDropdowns((prev) => ({
            ...prev,
            [title]: !prev[title],
        }));
    };

    return (
        <SidebarGroup className="px-2 py-0">
            <SidebarGroupLabel>Platform</SidebarGroupLabel>
            <SidebarMenu>
                {items.map((item) => (
                    <SidebarMenuItem key={item.title}>
                        {item.dropdown ? (
                            <div className="mt-2 w-full space-y-5">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <SidebarMenuButton
                                            onClick={() => toggleDropdown(item.title)}
                                            isActive={item.href === page.url}
                                            tooltip={{ children: item.title }}
                                            className="flex w-full items-center justify-between gap-5 p-6"
                                        >
                                            <div className="flex items-center gap-2">
                                                {item.icon && <item.icon className="h-4 w-4" />}
                                                <span>{item.title}</span>
                                            </div>
                                            <ChevronDown
                                                className={`h-4 w-4 transition-transform ${openDropdowns[item.title] ? 'rotate-180' : ''}`}
                                            />
                                        </SidebarMenuButton>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent className="w-full">
                                        <div className="mt-1 ml-4 space-y-1">
                                            {item.dropdown.map((subItem) => (
                                                <DropdownMenuItem>
                                                    <Link
                                                        key={subItem.title}
                                                        href={subItem.href || '#'}
                                                        prefetch
                                                        className={`hover:bg-sidebar-hover block rounded-md px-2 py-1.5 text-sm ${
                                                            subItem.href === page.url ? 'bg-sidebar-hover' : ''
                                                        }`}
                                                    >
                                                        {subItem.title}
                                                    </Link>
                                                </DropdownMenuItem>
                                            ))}
                                        </div>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        ) : (
                            <SidebarMenuButton
                                asChild
                                isActive={item.href === page.url}
                                tooltip={{ children: item.title }}
                                className="flex w-full items-center gap-2 p-6"
                            >
                                <Link href={item.href || '#'} prefetch className="flex items-center gap-2">
                                    {item.icon && <item.icon className="h-7 w-7" />}
                                    <span>{item.title}</span>
                                </Link>
                            </SidebarMenuButton>
                        )}
                    </SidebarMenuItem>
                ))}
            </SidebarMenu>
        </SidebarGroup>
    );
}
