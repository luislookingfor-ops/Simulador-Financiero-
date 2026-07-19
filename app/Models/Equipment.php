<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Equipment extends Model
{
    use HasFactory;

    protected $table = 'equipments';

    protected $fillable = [
        'code',
        'name',
        'fob',
        'ups',
        'pc',
        'impresora',
        'control',
        'calibrador',
        'line',
        'default_reagent_cost'
    ];

    protected $casts = [
        'fob' => 'decimal:2',
        'ups' => 'decimal:2',
        'pc' => 'decimal:2',
        'impresora' => 'decimal:2',
        'control' => 'decimal:2',
        'calibrador' => 'decimal:2',
        'default_reagent_cost' => 'decimal:2',
    ];
}
