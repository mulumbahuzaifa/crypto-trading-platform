import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Head, useForm } from '@inertiajs/react';
import { Trash2 } from 'lucide-react';
import { useState } from 'react';

interface User {
    id: number;
    name: string;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    language: string;
    currency: string;
    notification_settings: {
        price_updates: boolean;
        two_factor: boolean;
        news_updates: boolean;
        email_notifications: boolean;
        phone_notifications: boolean;
    };
}

interface ApiKey {
    id: number;
    name: string;
    key: string;
    is_active: boolean;
}

interface SettingsProps {
    user: User;
    apiKeys: ApiKey[];
}

type SecurityFormData = {
    current_password: string;
    new_password: string;
    new_password_confirmation: string;
    security_question_1: string;
    security_answer_1: string;
    security_question_2: string;
    security_answer_2: string;
    security_question_3: string;
    security_answer_3: string;
};

export default function Settings({ user, apiKeys }: SettingsProps) {
    const [activeTab, setActiveTab] = useState('profile');

    const profileForm = useForm({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        email: user.email,
        phone: user.phone || '',
        language: user.language,
        currency: user.currency,
    });

    const securityForm = useForm<SecurityFormData>({
        current_password: '',
        new_password: '',
        new_password_confirmation: '',
        security_question_1: '',
        security_answer_1: '',
        security_question_2: '',
        security_answer_2: '',
        security_question_3: '',
        security_answer_3: '',
    });

    const apiKeyForm = useForm({
        name: '',
        password: '',
    });

    const notificationForm = useForm(user.notification_settings);
    const apiKeyToggleForm = useForm({});
    const apiKeyDeleteForm = useForm({});

    const handleProfileSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        profileForm.post(route('settings.profile.update'));
    };

    const handleSecuritySubmit = (e: React.FormEvent) => {
        e.preventDefault();
        securityForm.post(route('settings.security.update'));
    };

    const handleApiKeySubmit = (e: React.FormEvent) => {
        e.preventDefault();
        apiKeyForm.post(route('settings.api-keys.create'));
    };

    const handleNotificationToggle = (key: keyof User['notification_settings']) => {
        notificationForm.setData(key, !user.notification_settings[key]);
        notificationForm.post(route('settings.notifications.update'));
    };

    const handleApiKeyToggle = (id: number) => {
        apiKeyToggleForm.post(route('settings.api-keys.toggle', id));
    };

    const handleApiKeyDelete = (id: number) => {
        apiKeyDeleteForm.delete(route('settings.api-keys.delete', id));
    };

    const getSecurityQuestionValue = (num: number): string => {
        return securityForm.data[`security_question_${num}` as keyof SecurityFormData] as string;
    };

    const getSecurityAnswerValue = (num: number): string => {
        return securityForm.data[`security_answer_${num}` as keyof SecurityFormData] as string;
    };

    const setSecurityQuestionValue = (num: number, value: string) => {
        securityForm.setData(`security_question_${num}` as keyof SecurityFormData, value);
    };

    const setSecurityAnswerValue = (num: number, value: string) => {
        securityForm.setData(`security_answer_${num}` as keyof SecurityFormData, value);
    };

    return (
        <div className="container py-8">
            <Head title="Settings" />

            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                <TabsList>
                    <TabsTrigger value="profile">Profile</TabsTrigger>
                    <TabsTrigger value="security">Security</TabsTrigger>
                    <TabsTrigger value="notifications">Notifications</TabsTrigger>
                    <TabsTrigger value="api-keys">API Keys</TabsTrigger>
                </TabsList>

                <TabsContent value="profile">
                    <Card>
                        <CardHeader>
                            <CardTitle>General Information</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleProfileSubmit} className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="first_name">First name</Label>
                                        <Input
                                            id="first_name"
                                            value={profileForm.data.first_name}
                                            onChange={(e) => profileForm.setData('first_name', e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="last_name">Last name</Label>
                                        <Input
                                            id="last_name"
                                            value={profileForm.data.last_name}
                                            onChange={(e) => profileForm.setData('last_name', e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="email">Email</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            value={profileForm.data.email}
                                            onChange={(e) => profileForm.setData('email', e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="phone">Phone</Label>
                                        <Input
                                            id="phone"
                                            value={profileForm.data.phone}
                                            onChange={(e) => profileForm.setData('phone', e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="language">Language</Label>
                                        <select
                                            id="language"
                                            className="border-input bg-background w-full rounded-md border px-3 py-2"
                                            value={profileForm.data.language}
                                            onChange={(e) => profileForm.setData('language', e.target.value)}
                                        >
                                            <option value="en">English</option>
                                            <option value="es">Spanish</option>
                                            <option value="fr">French</option>
                                            <option value="de">German</option>
                                            <option value="zh">Chinese</option>
                                            <option value="ru">Russian</option>
                                            <option value="ar">Arabic</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="currency">Currency</Label>
                                        <select
                                            id="currency"
                                            className="border-input bg-background w-full rounded-md border px-3 py-2"
                                            value={profileForm.data.currency}
                                            onChange={(e) => profileForm.setData('currency', e.target.value)}
                                        >
                                            <option value="USD">USD</option>
                                            <option value="EUR">EUR</option>
                                            <option value="GBP">GBP</option>
                                            <option value="CHF">CHF</option>
                                        </select>
                                    </div>
                                </div>
                                <Button type="submit">Update Profile</Button>
                            </form>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="security">
                    <Card>
                        <CardHeader>
                            <CardTitle>Security Settings</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSecuritySubmit} className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="current_password">Current password</Label>
                                        <Input
                                            id="current_password"
                                            type="password"
                                            value={securityForm.data.current_password}
                                            onChange={(e) => securityForm.setData('current_password', e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="new_password">New password</Label>
                                        <Input
                                            id="new_password"
                                            type="password"
                                            value={securityForm.data.new_password}
                                            onChange={(e) => securityForm.setData('new_password', e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="new_password_confirmation">Confirm new password</Label>
                                        <Input
                                            id="new_password_confirmation"
                                            type="password"
                                            value={securityForm.data.new_password_confirmation}
                                            onChange={(e) => securityForm.setData('new_password_confirmation', e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <h3 className="text-lg font-medium">Security Questions</h3>
                                    {[1, 2, 3].map((num) => (
                                        <div key={num} className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor={`security_question_${num}`}>Question {num}</Label>
                                                <select
                                                    id={`security_question_${num}`}
                                                    className="border-input bg-background w-full rounded-md border px-3 py-2"
                                                    value={getSecurityQuestionValue(num)}
                                                    onChange={(e) => setSecurityQuestionValue(num, e.target.value)}
                                                >
                                                    <option value="">Select a question</option>
                                                    <option value="What was the name of your first pet?">What was the name of your first pet?</option>
                                                    <option value="What's your Mother's middle name?">What's your Mother's middle name?</option>
                                                    <option value="What was the name of your first school?">
                                                        What was the name of your first school?
                                                    </option>
                                                    <option value="Where did you travel for the first time?">
                                                        Where did you travel for the first time?
                                                    </option>
                                                </select>
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor={`security_answer_${num}`}>Answer {num}</Label>
                                                <Input
                                                    id={`security_answer_${num}`}
                                                    value={getSecurityAnswerValue(num)}
                                                    onChange={(e) => setSecurityAnswerValue(num, e.target.value)}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <Button type="submit">Update Security Settings</Button>
                            </form>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="notifications">
                    <Card>
                        <CardHeader>
                            <CardTitle>Notification Settings</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="font-medium">Price Updates</h3>
                                        <p className="text-muted-foreground text-sm">Get the update price in your dashboard</p>
                                    </div>
                                    <Switch
                                        checked={user.notification_settings.price_updates}
                                        onCheckedChange={() => handleNotificationToggle('price_updates')}
                                    />
                                </div>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="font-medium">Two-Factor Authentication</h3>
                                        <p className="text-muted-foreground text-sm">Enable two-factor authentication service</p>
                                    </div>
                                    <Switch
                                        checked={user.notification_settings.two_factor}
                                        onCheckedChange={() => handleNotificationToggle('two_factor')}
                                    />
                                </div>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="font-medium">News Updates</h3>
                                        <p className="text-muted-foreground text-sm">Get the latest news in your mail</p>
                                    </div>
                                    <Switch
                                        checked={user.notification_settings.news_updates}
                                        onCheckedChange={() => handleNotificationToggle('news_updates')}
                                    />
                                </div>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="font-medium">Email Notifications</h3>
                                        <p className="text-muted-foreground text-sm">Get security code in your mail</p>
                                    </div>
                                    <Switch
                                        checked={user.notification_settings.email_notifications}
                                        onCheckedChange={() => handleNotificationToggle('email_notifications')}
                                    />
                                </div>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="font-medium">Phone Notifications</h3>
                                        <p className="text-muted-foreground text-sm">Get transition notification in your phone</p>
                                    </div>
                                    <Switch
                                        checked={user.notification_settings.phone_notifications}
                                        onCheckedChange={() => handleNotificationToggle('phone_notifications')}
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="api-keys">
                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Create API Key</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleApiKeySubmit} className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="api_key_name">Key Name</Label>
                                            <Input
                                                id="api_key_name"
                                                value={apiKeyForm.data.name}
                                                onChange={(e) => apiKeyForm.setData('name', e.target.value)}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="api_key_password">Confirm Password</Label>
                                            <Input
                                                id="api_key_password"
                                                type="password"
                                                value={apiKeyForm.data.password}
                                                onChange={(e) => apiKeyForm.setData('password', e.target.value)}
                                            />
                                        </div>
                                    </div>
                                    <Button type="submit">Create API Key</Button>
                                </form>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Your API Keys</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Name</TableHead>
                                            <TableHead>Key</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead>Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {apiKeys.map((apiKey) => (
                                            <TableRow key={apiKey.id}>
                                                <TableCell>{apiKey.name}</TableCell>
                                                <TableCell className="font-mono">{apiKey.key}</TableCell>
                                                <TableCell>
                                                    <Switch checked={apiKey.is_active} onCheckedChange={() => handleApiKeyToggle(apiKey.id)} />
                                                </TableCell>
                                                <TableCell>
                                                    <Button variant="ghost" size="icon" onClick={() => handleApiKeyDelete(apiKey.id)}>
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}
