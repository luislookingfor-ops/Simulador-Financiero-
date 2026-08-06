<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('reagent_plannings', function (Blueprint $table) {
            $table->id();
            $table->string('asesor');
            $table->string('cliente')->nullable();
            $table->string('cod_item');
            $table->text('descripcion');
            $table->integer('stock')->default(0);
            $table->decimal('rotacion_mensual', 12, 2)->default(0.00);
            $table->decimal('uso_4_meses', 12, 2)->default(0.00);
            $table->decimal('cantidad_importar', 12, 2)->default(0.00);
            $table->decimal('total', 12, 2)->default(0.00);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('reagent_plannings');
    }
};
