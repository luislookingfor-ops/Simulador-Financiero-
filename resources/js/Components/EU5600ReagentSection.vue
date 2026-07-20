<template>
  <div class="excel-window-container card shadow-md border">
    <!-- Excel Top Header Bar -->
    <div class="excel-header-banner bg-emerald-800 text-white p-3 flex justify-between items-center">
      <div>
        <h3 class="font-bold text-lg text-white">Tabla de consumo de reactivos para EU-5600 Pro (100 T/H para sedimentos; 160 T/H para química seca)</h3>
        <p class="text-xs text-emerald-100">Vista idéntica a las hojas de cálculo del fabricante MINDRAY</p>
      </div>
      <div class="flex gap-2">
        <button 
          @click="activeSheet = 'EU-5600Pro'" 
          class="px-3 py-1 text-xs font-bold rounded"
          :class="activeSheet === 'EU-5600Pro' ? 'bg-white text-emerald-900 shadow' : 'bg-emerald-700 text-white hover:bg-emerald-600'"
        >
          📄 HOJA 1: EU-5600Pro
        </button>
        <button 
          @click="activeSheet = 'consumo de reactivos'" 
          class="px-3 py-1 text-xs font-bold rounded"
          :class="activeSheet === 'consumo de reactivos' ? 'bg-white text-emerald-900 shadow' : 'bg-emerald-700 text-white hover:bg-emerald-600'"
        >
          🔬 HOJA 2: consumo de reactivos
        </button>
      </div>
    </div>

    <!-- SHEET 1: EU-5600Pro -->
    <div v-if="activeSheet === 'EU-5600Pro'" class="excel-sheet-content p-4">
      <div class="yellow-notice-banner bg-yellow-300 text-dark font-extrabold text-center py-1.5 px-4 mb-3 border border-yellow-400 rounded">
        ¡¡¡SOLO INTRODUZCA LOS NÚMEROS DE LA TABLA AMARILLA!!!
      </div>

      <!-- Top Summary Grid -->
      <table class="excel-table-grid w-full mb-4 text-xs border border-gray-400">
        <thead>
          <tr class="bg-gray-200 text-gray-800 font-bold border-b border-gray-400">
            <th class="p-2 text-left border-r border-gray-400 w-1/3">VOLUMEN DE PRUEBAS POR TIPO</th>
            <th class="p-2 text-center border-r border-gray-400 w-1/4">NÚMERO</th>
            <th class="p-2 text-center border-r border-gray-400">DÍAS DE OPERACIÓN AL MES</th>
            <th class="p-2 text-center border-r border-gray-400">DÍAS DE OPERACIÓN AL AÑO</th>
            <th class="p-2 text-center bg-gray-300">Costo/prueba (USD/EUR)</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="p-2 font-semibold border-r border-gray-300">Química seca (Pruebas al día)</td>
            <td class="p-1 bg-yellow-200 border-r border-gray-300">
              <input type="number" v-model.number="inputs.dryChemistryDaily" class="w-full bg-yellow-200 font-bold text-center border-none text-sm outline-none" />
            </td>
            <td rowspan="3" class="p-2 text-center font-bold bg-yellow-200 text-amber-900 border-r border-gray-300 text-base">
              <input type="number" v-model.number="inputs.operatingDaysMonth" class="w-full bg-yellow-200 font-bold text-center border-none text-base outline-none" />
            </td>
            <td rowspan="3" class="p-2 text-center font-bold border-r border-gray-300 text-base bg-gray-50">
              {{ calculationData.tabla1.dias_ano }}
            </td>
            <td rowspan="3" class="p-2 text-center font-bold text-base bg-gray-100 text-emerald-900">
              ${{ formatNumber(calculationData.tabla1.costo_prueba_fob, 9) }}
            </td>
          </tr>
          <tr>
            <td class="p-2 font-semibold border-r border-gray-300">Sedimentos (Pruebas al día)</td>
            <td class="p-1 bg-yellow-200 border-r border-gray-300">
              <input type="number" v-model.number="inputs.sedimentDaily" class="w-full bg-yellow-200 font-bold text-center border-none text-sm outline-none" />
            </td>
          </tr>
          <tr>
            <td class="p-2 font-semibold border-r border-gray-300">Química seca y sedimentos (Pruebas al día)</td>
            <td class="p-1 bg-yellow-200 border-r border-gray-300">
              <input type="number" v-model.number="inputs.comboDaily" class="w-full bg-yellow-200 font-bold text-center border-none text-sm outline-none" />
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Bottom Reagent Packaging Table -->
      <table class="excel-table-grid w-full text-xs border border-gray-400">
        <thead>
          <tr class="bg-gray-200 text-gray-800 font-bold border-b border-gray-400 text-center">
            <th class="p-2 text-left border-r border-gray-400 w-1/4">ENVASE DE REACTIVOS</th>
            <th class="p-2 border-r border-gray-400">PART NUMBER</th>
            <th class="p-2 border-r border-gray-400 bg-yellow-200 text-dark">Precio (USD/EUR)</th>
            <th class="p-2 border-r border-gray-400">Especificación</th>
            <th class="p-2 border-r border-gray-400">Botella/mes</th>
            <th class="p-2 border-r border-gray-400">Botella/año (solo cálculo)</th>
            <th class="p-2 border-r border-gray-400">Botella/año (Incluye fecha de caducidad)</th>
            <th class="p-2 bg-blue-50 text-blue-900">Envase /año</th>
          </tr>
        </thead>
        <tbody>
          <!-- EU-50 -->
          <tr class="border-b border-gray-300">
            <td class="p-2 font-bold text-blue-700 border-r border-gray-300">EU-50</td>
            <td class="p-2 text-center font-mono font-bold border-r border-gray-300">105-039227-A0</td>
            <td class="p-1 bg-yellow-200 text-center border-r border-gray-300">
              <input type="number" v-model.number="inputs.priceEu50" class="w-full bg-yellow-200 text-center font-bold text-blue-800 border-none outline-none" />
            </td>
            <td class="p-2 text-center font-semibold text-blue-600 border-r border-gray-300">2 bottle/package</td>
            <td class="p-2 text-center font-semibold text-blue-600 border-r border-gray-300">19,0</td>
            <td class="p-2 text-center font-semibold text-blue-600 border-r border-gray-300">227,0</td>
            <td class="p-2 text-center font-semibold text-emerald-700 bg-emerald-50 border-r border-gray-300">4,0</td>
            <td class="p-2 text-center font-bold text-blue-700 text-sm bg-blue-50">114</td>
          </tr>

          <!-- URS-Strips(11 items) -->
          <tr class="border-b border-gray-300">
            <td class="p-2 font-bold text-blue-700 border-r border-gray-300">URS-Strips(11 items)</td>
            <td class="p-2 text-center font-mono font-bold border-r border-gray-300">105-035331-00</td>
            <td class="p-1 bg-yellow-200 text-center border-r border-gray-300">
              <input type="number" v-model.number="inputs.priceStrips11" class="w-full bg-yellow-200 text-center font-bold text-blue-800 border-none outline-none" />
            </td>
            <td class="p-2 text-center font-semibold text-blue-600 border-r border-gray-300">10 can/package</td>
            <td class="p-2 text-center font-semibold text-blue-600 border-r border-gray-300">48,0</td>
            <td class="p-2 text-center font-semibold text-blue-600 border-r border-gray-300">576,0</td>
            <td class="p-2 text-center font-semibold text-gray-500 border-r border-gray-300">/</td>
            <td class="p-2 text-center font-bold text-blue-700 text-sm bg-blue-50">58</td>
          </tr>

          <!-- URS-Strips(14 items) -->
          <tr class="border-b border-gray-300">
            <td class="p-2 font-bold text-blue-700 border-r border-gray-300">URS-Strips(14 items)</td>
            <td class="p-2 text-center font-mono font-bold border-r border-gray-300">105-035297-00</td>
            <td class="p-1 bg-yellow-200 text-center border-r border-gray-300">
              <input type="number" v-model.number="inputs.priceStrips14" class="w-full bg-yellow-200 text-center font-bold text-blue-800 border-none outline-none" />
            </td>
            <td class="p-2 text-center font-semibold text-blue-600 border-r border-gray-300">10 can/package</td>
            <td class="p-2 text-center font-semibold text-blue-600 border-r border-gray-300">48,0</td>
            <td class="p-2 text-center font-semibold text-blue-600 border-r border-gray-300">576,0</td>
            <td class="p-2 text-center font-semibold text-gray-500 border-r border-gray-300">/</td>
            <td class="p-2 text-center font-bold text-blue-700 text-sm bg-blue-50">58</td>
          </tr>

          <!-- Cleanser -->
          <tr>
            <td class="p-2 font-bold text-blue-700 border-r border-gray-300">Cleanser</td>
            <td class="p-2 text-center font-mono text-gray-500 border-r border-gray-300">/</td>
            <td class="p-1 bg-yellow-200 text-center border-r border-gray-300">
              <input type="number" v-model.number="inputs.priceCleanser" class="w-full bg-yellow-200 text-center font-bold text-blue-800 border-none outline-none" />
            </td>
            <td class="p-2 text-center border-r border-gray-300"></td>
            <td class="p-2 text-center border-r border-gray-300"></td>
            <td class="p-2 text-center border-r border-gray-300"></td>
            <td class="p-2 text-center border-r border-gray-300"></td>
            <td class="p-2 text-center bg-blue-50"></td>
          </tr>
        </tbody>
      </table>

      <!-- Footer Yellow Notes -->
      <div class="excel-notes bg-yellow-50 border border-yellow-300 p-3 mt-4 text-xs font-semibold space-y-1 text-gray-800">
        <p class="text-yellow-800 font-bold">Note:</p>
        <p class="text-yellow-900 font-bold bg-yellow-200 p-1 rounded">Al calcular el costo, seleccione solo un tipo de tiras y establezca el otro como "0".</p>
        <p class="text-yellow-900 font-bold bg-yellow-200 p-1 rounded">EU-50, vida útil: 2 años, fecha de caducidad: 90 días una vez abierto.</p>
        <p>Cleanser debe ser preparado por el usuario final. El costo del limpiador no está incluido.</p>
        <p>El costo por prueba incluye el arranque, el apagado y el tiempo de inactividad. No incluye el tiempo de espera ni otros mantenimientos.</p>
        <p>En la práctica de laboratorio, la cantidad de reactivos necesarios puede ser ligeramente mayor debido al consumo de tiempo de espera y otros mantenimientos.</p>
      </div>
    </div>

    <!-- SHEET 2: consumo de reactivos -->
    <div v-else-if="activeSheet === 'consumo de reactivos'" class="excel-sheet-content p-4">
      <div class="sheet-title-banner bg-gray-700 text-white font-bold text-center py-2 px-4 mb-3 text-lg rounded">
        EU-5600 Pro
      </div>

      <table class="excel-table-grid w-full text-xs border border-gray-500">
        <thead>
          <tr class="bg-gray-200 text-gray-800 font-bold border-b border-gray-500 text-center">
            <th class="p-2 border-r border-gray-400">REACTIVO</th>
            <th class="p-2 border-r border-gray-400">Items</th>
            <th class="p-2 border-r border-gray-400">Pruebas/día</th>
            <th class="p-2 border-r border-gray-400">Prueba/muestra (ml/strip)</th>
            <th class="p-2 border-r border-gray-400">Dias laborables al mes</th>
            <th class="p-2 border-r border-gray-400">Dias laborables al año</th>
            <th class="p-2 border-r border-gray-400">Consumo/día (ml/strip)</th>
            <th class="p-2 border-r border-gray-400">Consumo/mes (ml/strip)</th>
            <th class="p-2 border-r border-gray-400">Consumo/año (ml/strip)</th>
            <th class="p-2 border-r border-gray-400">Volumen muerto</th>
            <th class="p-2 border-r border-gray-400">Start up (ml)</th>
            <th class="p-2 border-r border-gray-400">Shut down (ml)</th>
            <th class="p-2 border-r border-gray-400">Especificación del frasco (ml/strip)</th>
            <th class="p-2 border-r border-gray-400 bg-yellow-300 text-dark">Frasco/mes</th>
            <th class="p-2 bg-yellow-300 text-dark">Frasco/año</th>
          </tr>
        </thead>
        <tbody>
          <!-- EU-50 Row Group -->
          <tr class="border-b border-gray-300">
            <td rowspan="3" class="p-2 font-bold text-center border-r border-gray-400 align-middle">EU-50</td>
            <td class="p-2 border-r border-gray-300">Química seca</td>
            <td class="p-2 text-center bg-gray-100 border-r border-gray-300 font-semibold">100</td>
            <td class="p-2 text-center bg-gray-100 border-r border-gray-300 font-semibold">4</td>
            <td rowspan="3" class="p-2 text-center bg-gray-300 font-bold border-r border-gray-400 align-middle">24</td>
            <td rowspan="3" class="p-2 text-center bg-gray-300 font-bold border-r border-gray-400 align-middle">288</td>
            <td class="p-2 text-center border-r border-gray-300 font-semibold">400</td>
            <td class="p-2 text-center border-r border-gray-300 font-semibold">9600</td>
            <td class="p-2 text-center border-r border-gray-300 font-semibold">115200</td>
            <td rowspan="3" class="p-2 text-center border-r border-gray-300 align-middle font-semibold">5%</td>
            <td rowspan="3" class="p-2 text-center border-r border-gray-300 align-middle font-semibold">54</td>
            <td rowspan="3" class="p-2 text-center border-r border-gray-300 align-middle font-semibold">70</td>
            <td rowspan="3" class="p-2 text-center border-r border-gray-300 align-middle font-semibold">5000</td>
            <td rowspan="3" class="p-2 text-center bg-yellow-100 font-bold text-amber-900 border-r border-gray-400 align-middle text-sm">18,9</td>
            <td rowspan="3" class="p-2 text-center bg-yellow-100 font-bold text-amber-900 align-middle text-sm">226,3</td>
          </tr>
          <tr class="border-b border-gray-300">
            <td class="p-2 border-r border-gray-300">Sedimento</td>
            <td class="p-2 text-center bg-gray-100 border-r border-gray-300 font-semibold">100</td>
            <td class="p-2 text-center bg-gray-100 border-r border-gray-300 font-semibold">16</td>
            <td class="p-2 text-center border-r border-gray-300 font-semibold">1600</td>
            <td class="p-2 text-center border-r border-gray-300 font-semibold">38400</td>
            <td class="p-2 text-center border-r border-gray-300 font-semibold">460800</td>
          </tr>
          <tr class="border-b border-gray-400">
            <td class="p-2 border-r border-gray-300">Química seca + Sedimento</td>
            <td class="p-2 text-center bg-gray-100 border-r border-gray-300 font-semibold">100</td>
            <td class="p-2 text-center bg-gray-100 border-r border-gray-300 font-semibold">16</td>
            <td class="p-2 text-center border-r border-gray-300 font-semibold">1600</td>
            <td class="p-2 text-center border-r border-gray-300 font-semibold">38400</td>
            <td class="p-2 text-center border-r border-gray-300 font-semibold">460800</td>
          </tr>

          <!-- Strips Row -->
          <tr class="border-b border-gray-400">
            <td class="p-2 font-bold text-center border-r border-gray-400">Strips</td>
            <td class="p-2 text-center border-r border-gray-300 font-mono">/</td>
            <td class="p-2 text-center bg-gray-100 border-r border-gray-300 font-semibold">200</td>
            <td class="p-2 text-center bg-gray-100 border-r border-gray-300 font-semibold">1</td>
            <td class="p-2 text-center bg-gray-300 border-r border-gray-400 font-semibold"></td>
            <td class="p-2 text-center bg-gray-300 border-r border-gray-400 font-semibold"></td>
            <td class="p-2 text-center border-r border-gray-300 font-semibold">200</td>
            <td class="p-2 text-center border-r border-gray-300 font-semibold">4800</td>
            <td class="p-2 text-center border-r border-gray-300 font-semibold">57600</td>
            <td class="p-2 text-center border-r border-gray-300 font-semibold">0%</td>
            <td class="p-2 text-center border-r border-gray-300 font-semibold">0</td>
            <td class="p-2 text-center border-r border-gray-300 font-semibold">0</td>
            <td class="p-2 text-center border-r border-gray-300 font-semibold">100</td>
            <td class="p-2 text-center bg-yellow-100 font-bold text-amber-900 border-r border-gray-400 text-sm">48,0</td>
            <td class="p-2 text-center bg-yellow-100 font-bold text-amber-900 text-sm">576,0</td>
          </tr>

          <!-- Cleanser Row -->
          <tr>
            <td class="p-2 font-bold text-center border-r border-gray-400">Cleanser</td>
            <td class="p-2 text-center border-r border-gray-300 font-mono">/</td>
            <td class="p-2 text-center bg-gray-100 border-r border-gray-300 font-semibold">1</td>
            <td class="p-2 text-center border-r border-gray-300"></td>
            <td class="p-2 text-center bg-gray-300 border-r border-gray-400"></td>
            <td class="p-2 text-center bg-gray-300 border-r border-gray-400"></td>
            <td class="p-2 text-center border-r border-gray-300"></td>
            <td class="p-2 text-center border-r border-gray-300"></td>
            <td class="p-2 text-center border-r border-gray-300"></td>
            <td class="p-2 text-center border-r border-gray-300"></td>
            <td class="p-2 text-center border-r border-gray-300"></td>
            <td class="p-2 text-center border-r border-gray-300 font-semibold">6</td>
            <td class="p-2 text-center border-r border-gray-300"></td>
            <td class="p-2 text-center bg-yellow-100 border-r border-gray-400"></td>
            <td class="p-2 text-center bg-yellow-100"></td>
          </tr>
        </tbody>
      </table>

      <div class="sheet-footer-note bg-gray-100 p-2 border-t mt-3 text-xs font-semibold text-gray-700">
        Nota: No cambie ningún elemento de esta página.
      </div>
    </div>

    <!-- Excel Bottom Sheet Tabs Bar -->
    <div class="excel-bottom-tabs bg-gray-200 p-2 border-t flex items-center gap-1 text-xs">
      <span class="text-gray-500 font-bold mr-2">Hojas de Excel:</span>
      <button 
        @click="activeSheet = 'EU-5600Pro'" 
        class="px-4 py-1.5 font-bold rounded-t border-t-2 transition-all cursor-pointer"
        :class="activeSheet === 'EU-5600Pro' ? 'bg-white border-emerald-600 text-emerald-900 shadow-sm' : 'bg-gray-300 border-transparent text-gray-600 hover:bg-gray-400'"
      >
        🟢 EU-5600Pro
      </button>
      <button 
        @click="activeSheet = 'consumo de reactivos'" 
        class="px-4 py-1.5 font-bold rounded-t border-t-2 transition-all cursor-pointer"
        :class="activeSheet === 'consumo de reactivos' ? 'bg-white border-emerald-600 text-emerald-900 shadow-sm' : 'bg-gray-300 border-transparent text-gray-600 hover:bg-gray-400'"
      >
        📊 consumo de reactivos
      </button>
    </div>
  </div>
</template>

<script>
import { calculateEU5600ReagentConsumption } from '../Utils/eu5600ReagentCalculator.js';

export default {
  name: 'EU5600ReagentSection',
  data() {
    return {
      activeSheet: 'EU-5600Pro', // 'EU-5600Pro' | 'consumo de reactivos'
      inputs: {
        dryChemistryDaily: 100,
        sedimentDaily: 100,
        comboDaily: 100,
        operatingDaysMonth: 24,
        priceEu50: 105,
        priceStrips11: 90,
        priceStrips14: 108,
        priceCleanser: 0
      }
    };
  },
  computed: {
    calculationData() {
      return calculateEU5600ReagentConsumption(this.inputs);
    }
  },
  methods: {
    formatNumber(val, decimals = 2) {
      return Number(val || 0).toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
    }
  }
};
</script>

<style scoped>
.excel-table-grid td, .excel-table-grid th {
  border-collapse: collapse;
}
</style>
