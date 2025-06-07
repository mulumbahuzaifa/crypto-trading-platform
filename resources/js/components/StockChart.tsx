import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { coinGeckoService } from '@/services/coingecko';
import { CoinMarketData, type MarketChartData } from '@/types/coingecko';
import * as am5 from '@amcharts/amcharts5';
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';
import * as am5xy from '@amcharts/amcharts5/xy';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

interface StockChartProps {
    coinId?: string;
}

type TimePeriod = '1D' | '1W' | '1M' | '3M' | '1Y';

const timePeriodConfig: Record<TimePeriod, { days: number }> = {
    '1D': { days: 1 },
    '1W': { days: 7 },
    '1M': { days: 30 },
    '3M': { days: 90 },
    '1Y': { days: 365 },
};

export default function StockChart({ coinId = 'bitcoin' }: StockChartProps) {
    const [data, setData] = useState<MarketChartData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedPeriod, setSelectedPeriod] = useState<TimePeriod>('1W');
    const [retryCount, setRetryCount] = useState(0);
    const [selectedCoin, setSelectedCoin] = useState<CoinMarketData | null>(null);
    const chartRef = useRef<am5xy.XYChart | null>(null);
    const rootRef = useRef<am5.Root | null>(null);

    const fetchData = async () => {
        try {
            setLoading(true);
            setError(null);
            const { days } = timePeriodConfig[selectedPeriod];
            const response = await coinGeckoService.getMarketChart({
                id: coinId,
                vs_currency: 'usd',
                days: days,
            });
            setData(response);
            setRetryCount(0);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch market data');
            if (retryCount < 3) {
                setRetryCount((prev) => prev + 1);
                setTimeout(fetchData, 2000);
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [coinId, selectedPeriod]);

    useEffect(() => {
        const fetchCoins = async () => {
            try {
                setLoading(true);
                const data = await coinGeckoService.getMarketData({
                    vs_currency: 'usd',
                    order: 'market_cap_desc',
                    per_page: 10,
                    sparkline: false,
                });
                if (data.length > 0) {
                    setSelectedCoin(data[0]);
                }
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to fetch coins');
            } finally {
                setLoading(false);
            }
        };

        fetchCoins();
    }, []);

    useEffect(() => {
        if (!data) return;

        // Create root element
        const root = am5.Root.new('chartdiv');
        rootRef.current = root;

        // Set themes
        root.setThemes([am5themes_Animated.new(root)]);

        // Create chart
        const chart = root.container.children.push(
            am5xy.XYChart.new(root, {
                panX: true,
                panY: true,
                wheelX: 'panX',
                wheelY: 'zoomX',
                pinchZoomX: true,
                paddingRight: 20,
                background: am5.Rectangle.new(root, {
                    fill: am5.color('#1a1a1a'),
                }),
            }),
        );
        chartRef.current = chart;

        // Create axes
        const xAxis = chart.xAxes.push(
            am5xy.DateAxis.new(root, {
                baseInterval: { timeUnit: 'minute', count: 1 },
                renderer: am5xy.AxisRendererX.new(root, {
                    minGridDistance: 60,
                    cellStartLocation: 0.1,
                    cellEndLocation: 0.9,
                }),
                tooltip: am5.Tooltip.new(root, {
                    themeTags: ['axis'],
                }),
                gridIntervals: [
                    { timeUnit: 'hour', count: 1 },
                    { timeUnit: 'day', count: 1 },
                ],
            }),
        );

        xAxis.get('renderer').labels.template.setAll({
            fill: am5.color('#888888'),
            fontSize: 12,
        });

        xAxis.get('renderer').grid.template.setAll({
            stroke: am5.color('#2a2a2a'),
            strokeWidth: 1,
        });

        const yAxis = chart.yAxes.push(
            am5xy.ValueAxis.new(root, {
                renderer: am5xy.AxisRendererY.new(root, {
                    pan: 'zoom',
                    cellStartLocation: 0.1,
                    cellEndLocation: 0.9,
                }),
                tooltip: am5.Tooltip.new(root, {
                    themeTags: ['axis'],
                }),
                numberFormat: '#,###.00',
            }),
        );

        yAxis.get('renderer').labels.template.setAll({
            fill: am5.color('#888888'),
            fontSize: 12,
        });

        yAxis.get('renderer').grid.template.setAll({
            stroke: am5.color('#2a2a2a'),
            strokeWidth: 1,
        });

        // Add series
        const series = chart.series.push(
            am5xy.LineSeries.new(root, {
                name: 'Price',
                xAxis: xAxis,
                yAxis: yAxis,
                valueXField: 'date',
                valueYField: 'price',
                tooltip: am5.Tooltip.new(root, {
                    labelText: '{valueY}',
                    themeTags: ['series'],
                }),
                stroke: am5.color('#8884d8'),
            }),
        );

        // Add price range series
        const rangeSeries = chart.series.push(
            am5xy.LineSeries.new(root, {
                name: 'Range',
                xAxis: xAxis,
                yAxis: yAxis,
                valueXField: 'date',
                valueYField: 'price',
                valueYShow: 'valueYChangeSelectionPercent',
                stroke: am5.color('#8884d8'),
                fill: am5.color('#8884d8'),
                fillOpacity: 0.1,
                tooltip: am5.Tooltip.new(root, {
                    labelText: '{valueY}',
                    themeTags: ['series'],
                }),
            }),
        );

        // Add cursor
        chart.set(
            'cursor',
            am5xy.XYCursor.new(root, {
                behavior: 'zoomX',
                xAxis: xAxis,
                snapToSeries: [series],
                lineX: {
                    stroke: am5.color('#8884d8'),
                    strokeWidth: 1,
                    strokeDasharray: [5, 5],
                },
                lineY: {
                    stroke: am5.color('#8884d8'),
                    strokeWidth: 1,
                    strokeDasharray: [5, 5],
                },
            }),
        );

        // Set data
        const chartData = data.prices.map(([timestamp, price]) => ({
            date: timestamp,
            price: price,
        }));

        series.data.setAll(chartData);
        rangeSeries.data.setAll(chartData);

        // Add scrollbar
        chart.set(
            'scrollbarX',
            am5.Scrollbar.new(root, {
                orientation: 'horizontal',
                marginBottom: 20,
                height: 20,
                themeTags: ['scrollbar'],
            }),
        );

        // Make stuff animate on load
        series.appear(1000);
        rangeSeries.appear(1000);
        chart.appear(1000, 100);

        return () => {
            root.dispose();
        };
    }, [data]);

    const handleRetry = () => {
        setRetryCount(0);
        fetchData();
    };

    if (loading) {
        return (
            <Card className="border-[#2a2a2a] bg-[#1a1a1a]">
                <CardHeader>
                    <CardTitle className="text-white">Market Chart</CardTitle>
                </CardHeader>
                <CardContent>
                    <Skeleton className="h-[300px] w-full bg-[#2a2a2a]" />
                </CardContent>
            </Card>
        );
    }

    if (error) {
        return (
            <Card className="border-[#2a2a2a] bg-[#1a1a1a]">
                <CardHeader>
                    <CardTitle className="text-white">Market Chart</CardTitle>
                </CardHeader>
                <CardContent>
                    <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription className="flex items-center justify-between">
                            <span>{error}</span>
                            <Button variant="outline" size="sm" onClick={handleRetry} className="ml-4">
                                <RefreshCw className="mr-2 h-4 w-4" />
                                Retry
                            </Button>
                        </AlertDescription>
                    </Alert>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="border-[#2a2a2a] bg-[#1a1a1a]">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle className="text-white">Market Chart</CardTitle>
                    <div className="flex gap-2">
                        {Object.keys(timePeriodConfig).map((period) => (
                            <Button
                                key={period}
                                variant={selectedPeriod === period ? 'default' : 'outline'}
                                onClick={() => setSelectedPeriod(period as TimePeriod)}
                                className="rounded-full"
                                disabled={loading}
                            >
                                {period}
                            </Button>
                        ))}
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <div id="chartdiv" className="h-[300px] w-full" />
            </CardContent>
        </Card>
    );
}
