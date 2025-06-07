<?php

namespace Database\Seeders;

use App\Models\Permission;
use App\Models\Role;
use Illuminate\Database\Seeder;

class RoleAndPermissionSeeder extends Seeder
{
    public function run(): void
    {
        // Reset cached roles and permissions
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        // Create permissions
        $permissions = [
            // Trading permissions
            ['name' => 'View Trading', 'slug' => 'view-trading', 'description' => 'Can view trading interface'],
            ['name' => 'Create Orders', 'slug' => 'create-orders', 'description' => 'Can create trading orders'],
            ['name' => 'Cancel Orders', 'slug' => 'cancel-orders', 'description' => 'Can cancel trading orders'],
            ['name' => 'View Order Book', 'slug' => 'view-order-book', 'description' => 'Can view order book'],

            // Wallet permissions
            ['name' => 'View Wallets', 'slug' => 'view-wallets', 'description' => 'Can view wallets'],
            ['name' => 'Create Wallets', 'slug' => 'create-wallets', 'description' => 'Can create new wallets'],
            ['name' => 'Deposit Funds', 'slug' => 'deposit-funds', 'description' => 'Can deposit funds'],
            ['name' => 'Withdraw Funds', 'slug' => 'withdraw-funds', 'description' => 'Can withdraw funds'],

            // Market permissions
            ['name' => 'View Markets', 'slug' => 'view-markets', 'description' => 'Can view market data'],
            ['name' => 'View Market Analytics', 'slug' => 'view-market-analytics', 'description' => 'Can view market analytics'],

            // Admin permissions
            ['name' => 'Manage Users', 'slug' => 'manage-users', 'description' => 'Can manage users'],
            ['name' => 'Manage Roles', 'slug' => 'manage-roles', 'description' => 'Can manage roles and permissions'],
            ['name' => 'Manage Markets', 'slug' => 'manage-markets', 'description' => 'Can manage markets and trading pairs'],
            ['name' => 'View Reports', 'slug' => 'view-reports', 'description' => 'Can view system reports'],
            ['name' => 'Manage Settings', 'slug' => 'manage-settings', 'description' => 'Can manage system settings'],
        ];

        foreach ($permissions as $permission) {
            Permission::create($permission);
        }

        // Create roles and assign permissions
        $roles = [
            [
                'name' => 'Admin',
                'slug' => 'admin',
                'description' => 'Administrator with full access',
                'permissions' => Permission::all()->pluck('slug')->toArray(),
            ],
            [
                'name' => 'Trader',
                'slug' => 'trader',
                'description' => 'Professional trader with advanced features',
                'permissions' => [
                    'view-trading',
                    'create-orders',
                    'cancel-orders',
                    'view-order-book',
                    'view-wallets',
                    'create-wallets',
                    'deposit-funds',
                    'withdraw-funds',
                    'view-markets',
                    'view-market-analytics',
                ],
            ],
            [
                'name' => 'User',
                'slug' => 'user',
                'description' => 'Regular user with basic features',
                'permissions' => [
                    'view-trading',
                    'create-orders',
                    'cancel-orders',
                    'view-wallets',
                    'deposit-funds',
                    'withdraw-funds',
                    'view-markets',
                ],
            ],
        ];

        foreach ($roles as $roleData) {
            $permissions = $roleData['permissions'];
            unset($roleData['permissions']);

            $role = Role::create($roleData);
            $role->permissions()->attach(
                Permission::whereIn('slug', $permissions)->get()
            );
        }
    }
}