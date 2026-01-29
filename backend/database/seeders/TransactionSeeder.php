<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Category;

class TransactionSeeder extends Seeder
{
    public function run()
    {
        $user = User::first();
        if (!$user)
            return;

        $categories = $user->categories;
        if ($categories->isEmpty())
            return;

        for ($i = 0; $i < 120; $i++) {
            $cat = $categories->random();
            $user->transactions()->create([
                'category_id' => $cat->id,
                'amount' => rand(10, 800),
                'type' => $cat->type,
                'date' => now()->subDays(rand(0, 180)),
                'note' => 'Demo transaction ' . ($i + 1),
            ]);
        }
    }
}
