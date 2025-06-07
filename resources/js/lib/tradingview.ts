interface TradingViewConfig {
    width?: number;
    height?: number;
    symbol?: string;
    interval?: string;
    timezone?: string;
    theme?: string;
    style?: string;
    locale?: string;
    toolbar_bg?: string;
    enable_publishing?: boolean;
    allow_symbol_change?: boolean;
    container_id?: string;
    studies?: string[];
    show_popup_button?: boolean;
    popup_width?: string;
    popup_height?: string;
    autosize?: boolean;
    save_image?: boolean;
    hideideas?: boolean;
}

declare global {
    interface Window {
        TradingView: any;
    }
}

export function loadTradingViewWidget(config: TradingViewConfig) {
    if (typeof window !== 'undefined') {
        const script = document.createElement('script');
        script.src = 'https://s3.tradingview.com/tv.js';
        script.async = true;
        script.onload = () => {
            if (window.TradingView) {
                new window.TradingView.widget({
                    ...config,
                    autosize: true,
                    symbol: config.symbol || 'BINANCE:BTCUSDT',
                    interval: config.interval || 'D',
                    timezone: config.timezone || 'Etc/UTC',
                    theme: config.theme || 'dark',
                    style: config.style || '1',
                    locale: config.locale || 'en',
                    toolbar_bg: config.toolbar_bg || '#f1f3f6',
                    enable_publishing: config.enable_publishing || false,
                    allow_symbol_change: config.allow_symbol_change || true,
                    container_id: config.container_id || 'tradingview_widget',
                    studies: config.studies || [],
                    show_popup_button: config.show_popup_button || true,
                    popup_width: config.popup_width || '1000',
                    popup_height: config.popup_height || '650',
                    save_image: config.save_image || false,
                    hideideas: config.hideideas || true,
                });
            }
        };
        document.head.appendChild(script);
    }
}
