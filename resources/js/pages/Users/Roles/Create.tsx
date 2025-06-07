import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { type PageProps, type Permission } from '@/types';
import { Head, useForm } from '@inertiajs/react';

interface Props extends PageProps {
    permissions: Permission[];
}

export default function Create({ permissions }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        slug: '',
        description: '',
        permissions: [] as number[],
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('users.roles.store'));
    };

    const handlePermissionChange = (permissionId: number, checked: boolean) => {
        setData('permissions', (prev) => {
            if (checked) {
                return [...prev, permissionId];
            }
            return prev.filter((id) => id !== permissionId);
        });
    };

    return (
        <AppLayout>
            <Head title="Create Role" />

            <div className="container mx-auto py-6">
                <div className="mb-6 flex items-center justify-between">
                    <h1 className="text-2xl font-semibold">Create Role</h1>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Add New Role</CardTitle>
                        <CardDescription>Create a new role and assign permissions.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Name</Label>
                                    <Input id="name" value={data.name} onChange={(e) => setData('name', e.target.value)} required />
                                    {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="slug">Slug</Label>
                                    <Input id="slug" value={data.slug} onChange={(e) => setData('slug', e.target.value)} required />
                                    {errors.slug && <p className="text-sm text-red-500">{errors.slug}</p>}
                                </div>

                                <div className="space-y-2 md:col-span-2">
                                    <Label htmlFor="description">Description</Label>
                                    <Textarea id="description" value={data.description} onChange={(e) => setData('description', e.target.value)} />
                                    {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
                                </div>

                                <div className="space-y-2 md:col-span-2">
                                    <Label>Permissions</Label>
                                    <div className="mt-2 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                                        {permissions.map((permission) => (
                                            <div key={permission.id} className="flex items-center space-x-2">
                                                <Checkbox
                                                    id={`permission-${permission.id}`}
                                                    checked={data.permissions.includes(permission.id)}
                                                    onCheckedChange={(checked) => handlePermissionChange(permission.id, checked as boolean)}
                                                />
                                                <Label htmlFor={`permission-${permission.id}`} className="text-sm font-normal">
                                                    {permission.name}
                                                </Label>
                                            </div>
                                        ))}
                                    </div>
                                    {errors.permissions && <p className="text-sm text-red-500">{errors.permissions}</p>}
                                </div>
                            </div>

                            <div className="flex justify-end gap-4">
                                <Button type="submit" disabled={processing}>
                                    Create Role
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
