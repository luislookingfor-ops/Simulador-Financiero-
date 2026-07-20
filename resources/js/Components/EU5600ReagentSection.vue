<template>
  <div class="reagent-section-card card">
    <div class="card-header bg-dark-red text-white flex justify-between items-center">
      <div>
        <h3 class="font-bold text-lg text-white">🧪 Volumen y Consumo de Reactivos - MINDRAY EU-5600 Pro</h3>
        <p class="text-xs text-white/80">Simulación técnica de frascos, tiras y costo por prueba basado en muestras diarias.</p>
      </div>
      <span class="badge bg-white/20 text-white font-bold">100 T/H Sedimento | 160 T/H Química Seca</span>
    </div>

    <div class="card-body">
      <!-- Input Panel: Yellow Cells from Excel -->
      <div class="yellow-table-container mb-4">
        <h4 class="section-subtitle text-danger font-bold mb-2">1. Configuración de Volumen de Pruebas (Tabla Amarilla)</h4>
        
        <div class="grid grid-cols-1 md:grid-cols-4 gap-3 bg-amber-50 border border-amber-300 p-3 rounded-lg">
          <div class="form-group">
            <label class="font-bold text-xs text-gray-700">Química Seca (Pruebas/día)</label>
            <input 
              type="number" 
              v-model.number="inputs.dryChemistryDaily" 
              min="0" 
              class="form-input bg-yellow-100 font-bold text-center border-yellow-400 text-lg text-dark" 
            />
          </div>

          <div class="form-group">
            <label class="font-bold text-xs text-gray-700">Sedimentos (Pruebas/día)</label>
            <input 
              type="number" 
              v-model.number="inputs.sedimentDaily" 
              min="0" 
              class="form-input bg-yellow-100 font-bold text-center border-yellow-400 text-lg text-dark" 
            />
          </div>

          <div class="form-group">
            <label class="font-bold text-xs text-gray-700">Química Seca + Sedimentos (Pruebas/día)</label>
            <input 
              type="number" 
              v-model.number="inputs.comboDaily" 
              min="0" 
              class="form-input bg-yellow-100 font-bold text-center border-yellow-400 text-lg text-dark" 
            />
          </div>

          <div class="form-group">
            <label class="font-bold text-xs text-gray-700">Días Operación/Mes</label>
            <input 
              type="number" 
              v-model.number="inputs.operatingDaysMonth" 
              min="1" 
              max="31" 
              class="form-input bg-yellow-100 font-bold text-center border-yellow-400 text-lg text-dark" 
            />
          </div>
        </div>

        <div class="flex justify-between items-center mt-3 p-3 bg-gray-100 rounded-lg">
          <div>
            <span class="text-sm font-semibold text-gray-700">Tipo de Tiras Seleccionado:</span>
            <select v-model="inputs.stripType" class="form-select font-bold ml-2">
              <option value="strips11">URS-Strips (11 items) - $90/pkg</option>
              <option value="strips14">URS-Strips (14 items) - $108/pkg</option>
            </select>
          </div>

          <div class="text-right">
            <span class="text-xs text-gray-500 block">Costo Directo por Prueba (FOB):</span>
            <strong class="text-2xl text-danger">${{ formatNumber(calculationResults.resumen_volumetria.costo_promedio_reactivo_por_prueba_fob, 4) }}</strong>
          </div>
        </div>
      </div>

      <!-- Reactives Matrix Output Table -->
      <div class="table-responsive">
        <h4 class="section-subtitle font-bold mb-2">2. Consumo Técnico y Envases Anuales</h4>
        <table class="excel-breakdown-table border text-sm">
          <thead>
            <tr class="bg-gray-800 text-white">
              <th class="p-2 text-left">Reactivo / Insumo</th>
              <th class="p-2 text-center">Part Number</th>
              <th class="p-2 text-right">Precio FOB (Pkg)</th>
              <th class="p-2 text-center">Especificación</th>
              <th class="p-2 text-right">Frascos/Mes</th>
              <th class="p-2 text-right">Frascos/Año</th>
              <th class="p-2 text-right font-bold bg-dark-red text-white">Envases/Año a Comprar</th>
              <th class="p-2 text-right">Gasto FOB Anual</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in calculationResults.detalle_reactivos" :key="item.part_number">
              <td class="p-2 font-bold">{{ item.item }}</td>
              <td class="p-2 text-center font-mono text-xs">{{ item.part_number }}</td>
              <td class="p-2 text-right">${{ formatMoney(item.precio_empaque_fob) }}</td>
              <td class="p-2 text-center text-xs text-gray-600">{{ item.especificacion_empaque }}</td>
              <td class="p-2 text-right font-semibold">{{ item.frascos_mes }}</td>
              <td class="p-2 text-right font-semibold">{{ item.frascos_ano_final }}</td>
              <td class="p-2 text-right font-bold text-danger bg-red-50 text-base">{{ item.empaques_comprar_ano }}</td>
              <td class="p-2 text-right font-bold">${{ formatMoney(item.costo_fob_total_ano) }}</td>
            </tr>
          </tbody>
          <tfoot>
            <tr class="bg-gray-200 font-bold">
              <td colspan="6" class="p-2 text-right">Total Gasto Anual Reactivos (FOB):</td>
              <td class="p-2 text-right text-base text-dark">${{ formatMoney(calculationResults.resumen_volumetria.total_gasto_reactivos_fob_ano) }}</td>
              <td></td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import { calculateEU5600ReagentConsumption } from '../Utils/eu5600ReagentCalculator.js';

export default {
  name: 'EU5600ReagentSection',
  data() {
    return {
      inputs: {
        dryChemistryDaily: 100,
        sedimentDaily: 100,
        comboDaily: 100,
        operatingDaysMonth: 24,
        stripType: 'strips11'
      }
    };
  },
  computed: {
    calculationResults() {
      return calculateEU5600ReagentConsumption(this.inputs);
    }
  },
  methods: {
    formatMoney(val) {
      return Number(val || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    },
    formatNumber(val, decimals = 2) {
      return Number(val || 0).toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
    }
  }
};
</script>

<style scoped>
.bg-dark-red {
  background-color: #7b1fa2;
}
.bg-yellow-100 {
  background-color: #fef9c3;
}
</style>
