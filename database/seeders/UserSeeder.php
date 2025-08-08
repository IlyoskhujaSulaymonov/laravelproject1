<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        User::create([
            'name' => 'Admin',
            'role_id' => 1,
            'email' => 'admin6870@gmail.com',
            'phone' => '1234567890',
            'password' => bcrypt('12345678')]);

        User::create([
            'name' => 'Teacher',
            'role_id' => 2,
            'email' => 'teacher6870@gmail.com',
            'phone' => '0987654321',
            'password' => bcrypt('12345678')]);

            User::create([
            'name' => 'Student',
            'role_id' => 3,
            'email' => 'student6870@gmail.com',
            'phone' => '1122334455',
            'password' => bcrypt('12345678')]);
    }
}
