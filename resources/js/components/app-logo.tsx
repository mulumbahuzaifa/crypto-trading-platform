import { cn } from '@/lib/utils';

interface AppLogoProps {
    className?: string;
}

export default function AppLogo({ className }: AppLogoProps) {
    return <img src="/assets/img/logo-light.svg" alt="Crypto Trading Platform" className={cn('h-8 w-auto', className)} width={120} height={32} />;
}
