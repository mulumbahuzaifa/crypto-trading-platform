import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import LandingLayout from '@/layouts/LandingLayout';
import { formatCurrency } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, CreditCard, Wallet } from 'lucide-react';
import { Controller, useForm } from 'react-hook-form';
import * as z from 'zod';

const formSchema = z.object({
    currency: z.string().min(1, 'Please select a currency'),
    amount: z
        .string()
        .min(1, 'Please enter an amount')
        .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
            message: 'Amount must be greater than 0',
        }),
    payment_method: z.string().min(1, 'Please select a payment method'),
});

type FormValues = z.infer<typeof formSchema>;

interface DepositProps {
    currencies: { id: string; name: string; symbol: string; min_deposit: number }[];
    payment_methods: { id: string; name: string; icon: string }[];
    wallet_balances: { currency: string; balance: number }[];
}

export default function Deposit({ currencies = [], payment_methods = [], wallet_balances = [] }: DepositProps) {
    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            currency: '',
            amount: '',
            payment_method: '',
        },
    });

    const selectedCurrency = form.watch('currency');
    const selectedCurrencyData = currencies?.find((c) => c.id === selectedCurrency) || null;
    const walletBalance = wallet_balances?.find((w) => w.currency === selectedCurrency)?.balance || 0;

    const onSubmit = (values: FormValues) => {
        // Handle form submission
        console.log(values);
    };

    return (
        <LandingLayout>
            <Head title="Deposit Funds" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Link href={route('wallets.index')}>
                            <Button variant="ghost" size="icon">
                                <ArrowLeft className="h-4 w-4" />
                            </Button>
                        </Link>
                        <h1 className="text-2xl font-bold">Deposit Funds</h1>
                    </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Deposit Details</CardTitle>
                            <CardDescription>Enter the amount you want to deposit and select your preferred payment method.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Currency</label>
                                    <Controller
                                        control={form.control}
                                        name="currency"
                                        render={({ field }) => (
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select a currency" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {currencies?.map((currency) => (
                                                        <SelectItem key={currency.id} value={currency.id}>
                                                            <div className="flex items-center gap-2">
                                                                <span>{currency.symbol}</span>
                                                                <span>{currency.name}</span>
                                                            </div>
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        )}
                                    />
                                    {form.formState.errors.currency && (
                                        <p className="text-sm text-red-500">{form.formState.errors.currency.message}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Amount</label>
                                    <Controller
                                        control={form.control}
                                        name="amount"
                                        render={({ field }) => (
                                            <div className="relative">
                                                <Input
                                                    type="number"
                                                    step="0.00000001"
                                                    min={selectedCurrencyData?.min_deposit || 0}
                                                    placeholder={`Min: ${formatCurrency(selectedCurrencyData?.min_deposit || 0)}`}
                                                    {...field}
                                                />
                                                {selectedCurrency && selectedCurrencyData && (
                                                    <div className="text-muted-foreground absolute top-1/2 right-3 -translate-y-1/2 text-sm">
                                                        {selectedCurrencyData.symbol}
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    />
                                    {form.formState.errors.amount && <p className="text-sm text-red-500">{form.formState.errors.amount.message}</p>}
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Payment Method</label>
                                    <Controller
                                        control={form.control}
                                        name="payment_method"
                                        render={({ field }) => (
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select a payment method" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {payment_methods?.map((method) => (
                                                        <SelectItem key={method.id} value={method.id}>
                                                            <div className="flex items-center gap-2">
                                                                <img src={method.icon} alt={method.name} className="h-4 w-4" />
                                                                <span>{method.name}</span>
                                                            </div>
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        )}
                                    />
                                    {form.formState.errors.payment_method && (
                                        <p className="text-sm text-red-500">{form.formState.errors.payment_method.message}</p>
                                    )}
                                </div>

                                <Button type="submit" className="w-full">
                                    <CreditCard className="mr-2 h-4 w-4" />
                                    Proceed to Payment
                                </Button>
                            </form>
                        </CardContent>
                    </Card>

                    <div className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Current Balance</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Wallet className="text-muted-foreground h-4 w-4" />
                                        <span className="text-muted-foreground text-sm">Available Balance</span>
                                    </div>
                                    <span className="font-medium">
                                        {formatCurrency(walletBalance)} {selectedCurrencyData?.symbol || ''}
                                    </span>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Deposit Information</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="text-muted-foreground text-sm">
                                    <p>• Minimum deposit: {formatCurrency(selectedCurrencyData?.min_deposit || 0)}</p>
                                    <p>• Deposits are typically credited within 10-30 minutes</p>
                                    <p>• Please ensure you're sending funds to the correct address</p>
                                    <p>• Contact support if you need assistance</p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </LandingLayout>
    );
}
