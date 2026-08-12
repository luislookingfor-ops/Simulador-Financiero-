<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class ReagentPlanning extends Model
{
    use HasFactory;

    protected $table = 'reagent_plannings';

    protected $fillable = [
        'asesor',
        'cliente',
        'cod_item',
        'descripcion',
        'stock',
        'rotacion_mensual',
        'uso_4_meses',
        'cantidad_importar',
        'total'
    ];
}
