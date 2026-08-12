<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SupabaseProduct extends Model
{
    protected $connection = 'supabase';
    protected $table = 'productos';
    protected $primaryKey = 'id';
    public $timestamps = false;

    protected $fillable = [
        'empresa',
        'cod_item',
        'descripcion',
        'modelo_equipo',
        'linea_negocio',
        'cod_grupo',
        'cod_subgrupo',
        'cod_tipo_item',
        'referencia',
        'cod_unidad_medida',
        'cantidad_x_unidad_medida',
        'stock_minimo',
        'stock_maximo',
        'cod_unidad_peso',
        'valor_peso',
        'cod_marca',
        'cod_unidad_medida_empaque',
        'cantidad_uni_medida_empaque',
        'cantidad_minima_venta',
        'nacional_importado',
        'tipo_producto',
        'cod_impuesto_default',
        'cod_clase_item',
        'cod_arancel',
        'largo',
        'ancho',
        'profundidad',
        'cod_unidad_medida_dimension',
        'cod_pais_origen',
        'codigo_barra',
        'cod_estado',
        'tipo_valor_seguro',
        'valor_seguro',
        'porcentaje_venta_embalaje',
        'controla_inventario',
        'nro_parte',
        'cod_importacion',
        'cod_anterior',
        'valor_dimension',
        'descripcion_proforma',
        'maneja_lotes',
        'maneja_series',
        'reg_sanitario',
        'fecha_caduca_reg_sanitario',
        'cod_pais_importacion',
        'kit',
        'meses_garantia',
        'observaciones',
        'discontinuado',
        'cantidad_reparacion',
        'pvp',
        'fob',
        'stock',
    ];
}
