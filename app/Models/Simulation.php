<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Simulation extends Model
{
    use HasFactory;

    protected $table = 'simulations';

    protected $fillable = [
        'name',
        'global_settings',
        'equipment_settings'
    ];

    protected $casts = [
        'global_settings' => 'array',
        'equipment_settings' => 'array',
    ];
}
