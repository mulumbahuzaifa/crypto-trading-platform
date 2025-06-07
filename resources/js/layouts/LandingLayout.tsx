import { AppHeader } from '@/components/app-header';
import { Link } from '@inertiajs/react';
import { PropsWithChildren, useEffect } from 'react';

export default function LandingLayout({ children }: PropsWithChildren) {
    useEffect(() => {
        // Load required CSS files
        const loadCSS = (href: string) => {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = href;
            document.head.appendChild(link);
            return link;
        };

        const cssFiles = [
            'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css',
            'https://unpkg.com/ionicons@4.5.10-0/dist/css/ionicons.min.css',
            '/assets/css/style.css',
            // '/assets/css/home.css',
        ];

        const loadedLinks = cssFiles.map(loadCSS);

        // Load required JavaScript files
        const loadJS = (src: string) => {
            const script = document.createElement('script');
            script.src = src;
            script.async = true;
            document.body.appendChild(script);
            return script;
        };

        const jsFiles = [
            '/assets/js/jquery-3.4.1.min.js',
            '/assets/js/popper.min.js',
            '/assets/js/bootstrap.min.js',
            '/assets/js/amcharts-core.min.js',
            '/assets/js/amcharts.min.js',
            '/assets/js/custom.js',
        ];

        const loadedScripts = jsFiles.map(loadJS);

        return () => {
            // Cleanup
            loadedLinks.forEach((link) => document.head.removeChild(link));
            loadedScripts.forEach((script) => document.body.removeChild(script));
        };
    }, []);

    return (
        <div className="bg-background flex min-h-screen w-full flex-col">
            <AppHeader />
            <main className="flex-1">{children}</main>
            <footer className="bg-background border-t">
                <div className="container mx-auto px-4 py-8">
                    <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
                        <div className="space-y-4">
                            <Link href="/" className="inline-block">
                                <img src="/assets/img/logo-light.svg" alt="logo" className="h-8" />
                            </Link>
                            <p className="text-muted-foreground text-sm">
                                A trusted and secure cryptocurrency exchange platform for professional traders.
                            </p>
                        </div>

                        <div className="space-y-4">
                            <h4 className="text-sm font-semibold">Platform</h4>
                            <ul className="space-y-2">
                                <li>
                                    <Link href={route('trading.index')} className="text-muted-foreground hover:text-foreground text-sm">
                                        Exchange
                                    </Link>
                                </li>
                                <li>
                                    <Link href={route('dashboard')} className="text-muted-foreground hover:text-foreground text-sm">
                                        Dashboard
                                    </Link>
                                </li>
                                <li>
                                    <Link href={route('wallets.index')} className="text-muted-foreground hover:text-foreground text-sm">
                                        Wallet
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        <div className="space-y-4">
                            <h4 className="text-sm font-semibold">Company</h4>
                            <ul className="space-y-2">
                                <li>
                                    <Link href="#" className="text-muted-foreground hover:text-foreground text-sm">
                                        About Us
                                    </Link>
                                </li>
                                <li>
                                    <Link href="#" className="text-muted-foreground hover:text-foreground text-sm">
                                        Careers
                                    </Link>
                                </li>
                                <li>
                                    <Link href="#" className="text-muted-foreground hover:text-foreground text-sm">
                                        Contact
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        <div className="space-y-4">
                            <h4 className="text-sm font-semibold">Stay Updated</h4>
                            <p className="text-muted-foreground text-sm">Subscribe to our newsletter for the latest updates and news.</p>
                            <div className="flex space-x-2">
                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    className="border-input bg-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-9 w-full rounded-md border px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-1 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                                />
                                <button className="bg-primary text-primary-foreground hover:bg-primary/90 focus-visible:ring-ring inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium shadow transition-colors focus-visible:ring-1 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50">
                                    Subscribe
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 border-t pt-8">
                        <div className="flex flex-col items-center justify-between space-y-4 md:flex-row md:space-y-0">
                            <p className="text-muted-foreground text-sm">&copy; {new Date().getFullYear()} Your Company. All rights reserved.</p>
                            <div className="flex space-x-4">
                                <a href="#" className="text-muted-foreground hover:text-foreground">
                                    <i className="fab fa-twitter"></i>
                                </a>
                                <a href="#" className="text-muted-foreground hover:text-foreground">
                                    <i className="fab fa-facebook"></i>
                                </a>
                                <a href="#" className="text-muted-foreground hover:text-foreground">
                                    <i className="fab fa-linkedin"></i>
                                </a>
                                <a href="#" className="text-muted-foreground hover:text-foreground">
                                    <i className="fab fa-telegram"></i>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
