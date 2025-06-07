import AssetTable from '@/components/AssetTable';
import StockChart from '@/components/StockChart';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import LandingLayout from '@/layouts/LandingLayout';
import { formatCurrency } from '@/lib/utils';
import { coinGeckoService } from '@/services/coingecko';
import { ExchangeRate } from '@/types/coingecko';
import { Head } from '@inertiajs/react';
import { useEffect, useState } from 'react';

export default function Home() {
    const [category, setCategory] = useState<'all' | 'top50' | 'topGainers' | 'topLosers'>('all');
    const [exchangeRates, setExchangeRates] = useState<ExchangeRate[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchExchangeRates = async () => {
            try {
                const response = await coinGeckoService.getExchangeRates();
                const rates = Object.entries(response.rates)
                    .map(([key, value]) => ({
                        ...value,
                        id: key,
                    }))
                    .filter((rate) => ['usd', 'eur', 'gbp', 'jpy', 'aud', 'cad'].includes(rate.id));
                setExchangeRates(rates);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to fetch exchange rates');
            } finally {
                setLoading(false);
            }
        };

        fetchExchangeRates();
        const interval = setInterval(fetchExchangeRates, 60000);
        return () => clearInterval(interval);
    }, []);

    return (
        <LandingLayout>
            <div className="home">
                <Head title="Welcome" />

                {/* Hero Section */}
                <section className="bg-background min-h-screen py-12">
                    <div className="container mx-auto px-4">
                        {/* Section Header */}
                        <div className="mb-8">
                            <h1 className="text-foreground text-4xl font-bold tracking-tight sm:text-5xl">Cryptocurrency Market Overview</h1>
                            <p className="text-muted-foreground mt-4 text-lg">
                                Track real-time cryptocurrency prices, market caps, and trading volumes
                            </p>
                        </div>

                        {/* Exchange Rates */}
                        <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
                            {loading ? (
                                // Loading state
                                Array.from({ length: 6 }).map((_, index) => (
                                    <Card key={index} className="bg-card">
                                        <CardContent className="p-4">
                                            <div className="bg-muted h-4 w-20 animate-pulse rounded" />
                                            <div className="bg-muted mt-2 h-6 w-24 animate-pulse rounded" />
                                        </CardContent>
                                    </Card>
                                ))
                            ) : error ? (
                                // Error state
                                <div className="col-span-full">
                                    <div className="border-destructive bg-destructive/10 text-destructive rounded-lg border p-4">{error}</div>
                                </div>
                            ) : (
                                // Success state
                                exchangeRates.map((rate) => (
                                    <Card key={rate.id} className="bg-card">
                                        <CardContent className="p-4">
                                            <div className="text-muted-foreground text-sm">{rate.name}</div>
                                            <div className="text-lg font-semibold">{formatCurrency(rate.value)}</div>
                                        </CardContent>
                                    </Card>
                                ))
                            )}
                        </div>

                        {/* Category Filters */}
                        <div className="mb-6 flex flex-wrap gap-2">
                            <Button onClick={() => setCategory('all')} variant={category === 'all' ? 'default' : 'outline'} className="rounded-full">
                                All
                            </Button>
                            <Button
                                onClick={() => setCategory('top50')}
                                variant={category === 'top50' ? 'default' : 'outline'}
                                className="rounded-full"
                            >
                                Top 50
                            </Button>
                            <Button
                                onClick={() => setCategory('topGainers')}
                                variant={category === 'topGainers' ? 'default' : 'outline'}
                                className="rounded-full"
                            >
                                Top Gainers
                            </Button>
                            <Button
                                onClick={() => setCategory('topLosers')}
                                variant={category === 'topLosers' ? 'default' : 'outline'}
                                className="rounded-full"
                            >
                                Top Losers
                            </Button>
                        </div>

                        {/* Main Content Grid */}
                        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                            {/* Left Column - Asset Table */}
                            <div className="h-[700px] w-full">
                                <div className="bg-card h-full w-full overflow-hidden rounded-lg border shadow-lg">
                                    <div className="h-full overflow-y-auto">
                                        <AssetTable category={category} />
                                    </div>
                                </div>
                            </div>

                            {/* Right Column - Chart */}
                            <div className="h-[700px] w-full">
                                <div className="bg-card h-full w-full overflow-hidden rounded-lg border shadow-lg">
                                    <StockChart />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </LandingLayout>
    );
}
