<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        User::create([
            'name' => 'Administrador Ingelab',
            'username' => 'admin',
            'password' => Hash::make('Ingelab2026@'),
            'role' => 'admin',
        ]);
    }
}
