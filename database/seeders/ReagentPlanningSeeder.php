<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\ReagentPlanning;

class ReagentPlanningSeeder extends Seeder
{
    public function run(): void
    {
        ReagentPlanning::truncate();
    }
}
