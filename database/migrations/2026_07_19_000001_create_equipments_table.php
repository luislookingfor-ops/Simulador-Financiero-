<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('equipments', function (Blueprint $table) {
            $table->id();
            $table->string('code')->unique();
            $table->string('name');
            $table->decimal('fob', 12, 2);
            $table->decimal('ups', 12, 2)->default(0.00);
            $table->decimal('pc', 12, 2)->default(0.00);
            $table->decimal('impresora', 12, 2)->default(0.00);
            $table->decimal('control', 12, 2)->default(0.00);
            $table->decimal('calibrador', 12, 2)->default(0.00);
            $table->string('line');
            $table->decimal('default_reagent_cost', 12, 2)->default(0.00);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('equipments');
    }
};
