<template>
  <div class="excel-standalone-wrapper">
    <!-- Top Navigation Tabs (Excel-like Sheet Switcher) -->
    <div class="excel-top-nav-bar">
      <button 
        @click="activeSheet = 'EU-5600Pro'" 
        class="excel-tab-btn"
        :class="{ 'active-tab': activeSheet === 'EU-5600Pro' }"
      >
        HOJA 1: EU-5600Pro (Envase y Costo por Prueba)
      </button>
      <button 
        @click="activeSheet = 'consumo de reactivos'" 
        class="excel-tab-btn"
        :class="{ 'active-tab': activeSheet === 'consumo de reactivos' }"
      >
        HOJA 2: consumo de reactivos (Matriz de Consumo Técnico)
      </button>
    </div>

    <!-- SHEET 1: EU-5600Pro -->
    <div v-if="activeSheet === 'EU-5600Pro'" class="excel-sheet-box">
      <div class="sheet-title-header">
        Tabla de consumo de reactivos para EU-5600 Pro (100 T/H para sedimentos; 160 T/H para química seca)
      </div>

      <!-- Top Summary Grid (Yellow Inputs) -->
      <table class="excel-grid-table mb-4">
        <thead>
          <tr class="excel-header-row">
            <th style="width: 35%;">VOLUMEN DE PRUEBAS POR TIPO</th>
            <th style="width: 20%;">NÚMERO</th>
            <th style="width: 15%;">DÍAS DE OPERACIÓN AL MES</th>
            <th style="width: 15%;">DÍAS DE OPERACIÓN AL AÑO</th>
            <th style="width: 15%;">Costo/prueba (USD/EUR)</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="excel-cell-lbl">Química seca (Pruebas al día)</td>
            <td class="excel-cell-yellow">
              <input type="number" v-model.number="inputs.dryChemistryDaily" class="excel-yellow-input" />
            </td>
            <td rowspan="3" class="excel-cell-yellow text-center align-middle">
              <input type="number" v-model.number="inputs.operatingDaysMonth" class="excel-yellow-input text-center text-lg font-bold" />
            </td>
            <td rowspan="3" class="excel-cell-gray text-center align-middle text-base font-bold">
              {{ calcData.dias_operacion_ano }}
            </td>
            <td rowspan="3" class="excel-cell-cost text-center align-middle text-base font-bold">
              {{ formatSpanishDecimal(calcData.tabla1.costo_prueba_fob, 9) }}
            </td>
          </tr>
          <tr>
            <td class="excel-cell-lbl">Sedimentos (Pruebas al día)</td>
            <td class="excel-cell-yellow">
              <input type="number" v-model.number="inputs.sedimentDaily" class="excel-yellow-input" />
            </td>
          </tr>
          <tr>
            <td class="excel-cell-lbl">Química seca y sedimentos (Pruebas al día)</td>
            <td class="excel-cell-yellow">
              <input type="number" v-model.number="inputs.comboDaily" class="excel-yellow-input" />
            </td>
          </tr>
        </tbody>
      </table>

      <div class="excel-yellow-banner mb-4">
        ¡¡¡SOLO INTRODUZCA LOS NÚMEROS DE LA TABLA AMARILLA!!!
      </div>

      <!-- Bottom Reagent Packaging Table -->
      <table class="excel-grid-table mb-4">
        <thead>
          <tr class="excel-header-row">
            <th style="width: 22%;">ENVASE DE REACTIVOS</th>
            <th style="width: 18%;">PART NUMBER</th>
            <th style="width: 12%;" class="excel-th-yellow">Precio (USD/EUR)</th>
            <th style="width: 14%;">Especificación</th>
            <th style="width: 10%;">Botella/mes</th>
            <th style="width: 10%;">Botella/año (solo cálculo)</th>
            <th style="width: 10%;">Botella/año (Incluye fecha de caducidad)</th>
            <th style="width: 8%;">Envase /año</th>
          </tr>
        </thead>
        <tbody>
          <!-- EU-50 -->
          <tr>
            <td class="excel-cell-item">EU-50</td>
            <td class="excel-cell-code">105-039227-A0</td>
            <td class="excel-cell-yellow">
              <input type="number" v-model.number="inputs.priceEu50" class="excel-yellow-input text-blue" />
            </td>
            <td class="excel-cell-blue text-center">2 bottle/package</td>
            <td class="excel-cell-blue text-center">{{ formatSpanishDecimal(calcData.tabla1.eu50.botella_mes, 1) }}</td>
            <td class="excel-cell-blue text-center">{{ formatSpanishDecimal(calcData.tabla1.eu50.botella_ano, 1) }}</td>
            <td class="excel-cell-blue text-center text-green font-bold">{{ formatSpanishDecimal(calcData.tabla1.eu50.botella_caducidad, 1) }}</td>
            <td class="excel-cell-blue text-center font-bold text-sm bg-light-blue">{{ calcData.tabla1.eu50.envase_ano }}</td>
          </tr>

          <!-- URS-Strips(11 items) -->
          <tr>
            <td class="excel-cell-item">URS-Strips(11 items)</td>
            <td class="excel-cell-code">105-035331-00</td>
            <td class="excel-cell-yellow">
              <input type="number" v-model.number="inputs.priceStrips11" class="excel-yellow-input text-blue" />
            </td>
            <td class="excel-cell-blue text-center">10 can/package</td>
            <td class="excel-cell-blue text-center">{{ formatSpanishDecimal(calcData.tabla1.strips11.botella_mes, 1) }}</td>
            <td class="excel-cell-blue text-center">{{ formatSpanishDecimal(calcData.tabla1.strips11.botella_ano, 1) }}</td>
            <td class="excel-cell-blue text-center">/</td>
            <td class="excel-cell-blue text-center font-bold text-sm bg-light-blue">{{ calcData.tabla1.strips11.envase_ano }}</td>
          </tr>

          <!-- URS-Strips(14 items) -->
          <tr>
            <td class="excel-cell-item">URS-Strips(14 items)</td>
            <td class="excel-cell-code">105-035297-00</td>
            <td class="excel-cell-yellow">
              <input type="number" v-model.number="inputs.priceStrips14" class="excel-yellow-input text-blue" />
            </td>
            <td class="excel-cell-blue text-center">10 can/package</td>
            <td class="excel-cell-blue text-center">{{ formatSpanishDecimal(calcData.tabla1.strips14.botella_mes, 1) }}</td>
            <td class="excel-cell-blue text-center">{{ formatSpanishDecimal(calcData.tabla1.strips14.botella_ano, 1) }}</td>
            <td class="excel-cell-blue text-center">/</td>
            <td class="excel-cell-blue text-center font-bold text-sm bg-light-blue">{{ calcData.tabla1.strips14.envase_ano }}</td>
          </tr>

          <!-- Cleanser -->
          <tr>
            <td class="excel-cell-item">Cleanser</td>
            <td class="excel-cell-code">/</td>
            <td class="excel-cell-yellow">
              <input type="number" v-model.number="inputs.priceCleanser" class="excel-yellow-input text-blue" placeholder="0" />
            </td>
            <td class="excel-cell-blue text-center">
              <span class="text-xs font-semibold text-gray-700">1 frasco / mes</span>
            </td>
            <td class="excel-cell-blue text-center">1,0</td>
            <td class="excel-cell-blue text-center">12,0</td>
            <td class="excel-cell-blue text-center">/</td>
            <td class="excel-cell-yellow">
              <input type="number" v-model.number="inputs.cleanserTotalQuantity" class="excel-yellow-input text-blue font-bold text-sm" />
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Cleanser Total Cost Calculation Box (Outside Main Table) -->
      <div v-if="inputs.priceCleanser > 0" class="cleanser-summary-box mb-4">
        <div class="cleanser-summary-content">
          <span class="summary-lbl">Costo Total Cleanser (Contrato {{ inputs.cleanserMonths }} meses):</span>
          <span class="summary-val">${{ formatSpanishDecimal(cleanserTotalCost, 2) }} USD</span>
          <span class="summary-sub">({{ inputs.cleanserTotalQuantity }} frascos × ${{ inputs.priceCleanser }} USD)</span>
        </div>
      </div>

      <div class="excel-yellow-banner mb-3">
        SOLO INTRODUZCA LOS NÚMEROS DE LA TABLA AMARILLA!!!
      </div>

      <!-- Footer Yellow Notes -->
      <div class="excel-notes-box">
        <p class="font-bold mb-1">Note:</p>
        <p class="yellow-highlight">Al calcular el costo, seleccione solo un tipo de tiras y establezca el otro como "0".</p>
        <p class="yellow-highlight">EU-50, vida útil: 2 años, fecha de caducidad: 90 días una vez abierto.</p>
        <p>Cleanser debe ser preparado por el usuario final. El costo del limpiador no está incluido.</p>
        <p>El costo por prueba incluye el arranque, el apagado y el tiempo de inactividad. No incluye el tiempo de espera ni otros mantenimientos.</p>
        <p>En la práctica de laboratorio, la cantidad de reactivos necesarios puede ser ligeramente mayor debido al consumo de tiempo de espera y otros mantenimientos.</p>
      </div>
    </div>

    <!-- SHEET 2: consumo de reactivos -->
    <div v-else-if="activeSheet === 'consumo de reactivos'" class="excel-sheet-box">
      <div class="sheet-title-header-dark">
        EU-5600 Pro
      </div>

      <table class="excel-grid-table mb-4">
        <thead>
          <tr class="excel-header-row">
            <th>REACTIVO</th>
            <th>Items</th>
            <th class="excel-th-yellow">Pruebas/día</th>
            <th class="excel-th-yellow">Prueba/muestra (ml/strip)</th>
            <th>Dias laborables al mes</th>
            <th>Dias laborables al año</th>
            <th>Consumo/día (ml/strip)</th>
            <th>Consumo/mes (ml/strip)</th>
            <th>Consumo/año (ml/strip)</th>
            <th class="excel-th-yellow">Volumen muerto</th>
            <th class="excel-th-yellow">Start up (ml)</th>
            <th class="excel-th-yellow">Shut down (ml)</th>
            <th class="excel-th-yellow">Especificación del frasco (ml/strip)</th>
            <th class="excel-th-yellow">Frasco/mes</th>
            <th class="excel-th-yellow">Frasco/año</th>
          </tr>
        </thead>
        <tbody>
          <!-- EU-50 Row Group -->
          <tr>
            <td rowspan="3" class="excel-cell-bold text-center align-middle">EU-50</td>
            <td>Química seca</td>
            <td class="excel-cell-yellow">
              <input type="number" v-model.number="inputs.dryChemistryDaily" class="excel-yellow-input" />
            </td>
            <td class="excel-cell-yellow">
              <input type="number" v-model.number="inputs.dryMlPerSample" class="excel-yellow-input" />
            </td>
            <td rowspan="3" class="text-center bg-gray-300 font-bold align-middle text-base">
              <input type="number" v-model.number="inputs.operatingDaysMonth" class="excel-gray-input text-center font-bold" />
            </td>
            <td rowspan="3" class="text-center bg-gray-300 font-bold align-middle text-base">{{ calcData.tabla2.dias_ano }}</td>
            <td class="text-center font-semibold">{{ calcData.tabla2.eu50.dry.cons_dia }}</td>
            <td class="text-center font-semibold">{{ calcData.tabla2.eu50.dry.cons_mes }}</td>
            <td class="text-center font-semibold">{{ calcData.tabla2.eu50.dry.cons_ano }}</td>
            <td rowspan="3" class="excel-cell-yellow text-center align-middle font-semibold">
              <input type="number" step="0.01" v-model.number="inputs.eu50DeadVolumeRatio" class="excel-yellow-input" style="width: 50px;" />
            </td>
            <td rowspan="3" class="excel-cell-yellow text-center align-middle font-semibold">
              <input type="number" v-model.number="inputs.eu50StartUp" class="excel-yellow-input" style="width: 50px;" />
            </td>
            <td rowspan="3" class="excel-cell-yellow text-center align-middle font-semibold">
              <input type="number" v-model.number="inputs.eu50ShutDown" class="excel-yellow-input" style="width: 50px;" />
            </td>
            <td rowspan="3" class="excel-cell-yellow text-center align-middle font-semibold">
              <input type="number" v-model.number="inputs.eu50BottleSpec" class="excel-yellow-input" style="width: 60px;" />
            </td>
            <td rowspan="3" class="excel-cell-yellow text-center align-middle font-bold text-base">{{ formatSpanishDecimal(calcData.tabla2.eu50.frasco_mes, 1) }}</td>
            <td rowspan="3" class="excel-cell-yellow text-center align-middle font-bold text-base">{{ formatSpanishDecimal(calcData.tabla2.eu50.frasco_ano, 1) }}</td>
          </tr>
          <tr>
            <td>Sedimento</td>
            <td class="excel-cell-yellow">
              <input type="number" v-model.number="inputs.sedimentDaily" class="excel-yellow-input" />
            </td>
            <td class="excel-cell-yellow">
              <input type="number" v-model.number="inputs.sedMlPerSample" class="excel-yellow-input" />
            </td>
            <td class="text-center font-semibold">{{ calcData.tabla2.eu50.sed.cons_dia }}</td>
            <td class="text-center font-semibold">{{ calcData.tabla2.eu50.sed.cons_mes }}</td>
            <td class="text-center font-semibold">{{ calcData.tabla2.eu50.sed.cons_ano }}</td>
          </tr>
          <tr>
            <td>Química seca + Sedimento</td>
            <td class="excel-cell-yellow">
              <input type="number" v-model.number="inputs.comboDaily" class="excel-yellow-input" />
            </td>
            <td class="excel-cell-yellow">
              <input type="number" v-model.number="inputs.comboMlPerSample" class="excel-yellow-input" />
            </td>
            <td class="text-center font-semibold">{{ calcData.tabla2.eu50.combo.cons_dia }}</td>
            <td class="text-center font-semibold">{{ calcData.tabla2.eu50.combo.cons_mes }}</td>
            <td class="text-center font-semibold">{{ calcData.tabla2.eu50.combo.cons_ano }}</td>
          </tr>

          <!-- Strips Row -->
          <tr>
            <td class="excel-cell-bold text-center">Strips</td>
            <td class="text-center">/</td>
            <td class="text-center bg-gray-100 font-bold">{{ calcData.tabla2.strips.dia }}</td>
            <td class="excel-cell-yellow">
              <input type="number" v-model.number="inputs.stripsMlPerSample" class="excel-yellow-input" />
            </td>
            <td class="text-center bg-gray-300"></td>
            <td class="text-center bg-gray-300"></td>
            <td class="text-center font-semibold">{{ calcData.tabla2.strips.cons_dia }}</td>
            <td class="text-center font-semibold">{{ calcData.tabla2.strips.cons_mes }}</td>
            <td class="text-center font-semibold">{{ calcData.tabla2.strips.cons_ano }}</td>
            <td class="text-center font-semibold">0%</td>
            <td class="text-center font-semibold">0</td>
            <td class="text-center font-semibold">0</td>
            <td class="excel-cell-yellow">
              <input type="number" v-model.number="inputs.stripsCanSpec" class="excel-yellow-input" style="width: 60px;" />
            </td>
            <td class="excel-cell-yellow text-center font-bold text-base">{{ formatSpanishDecimal(calcData.tabla2.strips.frasco_mes, 1) }}</td>
            <td class="excel-cell-yellow text-center font-bold text-base">{{ formatSpanishDecimal(calcData.tabla2.strips.frasco_ano, 1) }}</td>
          </tr>

          <!-- Cleanser Row -->
          <tr>
            <td class="excel-cell-bold text-center">Cleanser</td>
            <td class="text-center">/</td>
            <td class="text-center bg-gray-100 font-semibold">1</td>
            <td class="text-center"></td>
            <td class="text-center bg-gray-300"></td>
            <td class="text-center bg-gray-300"></td>
            <td class="text-center"></td>
            <td class="text-center"></td>
            <td class="text-center"></td>
            <td class="text-center"></td>
            <td class="text-center"></td>
            <td class="excel-cell-yellow">
              <input type="number" v-model.number="inputs.cleanserShutDown" class="excel-yellow-input" style="width: 50px;" />
            </td>
            <td class="text-center"></td>
            <td class="excel-cell-yellow text-center font-bold">1,0</td>
            <td class="excel-cell-yellow text-center font-bold text-base">
              <input type="number" v-model.number="inputs.cleanserTotalQuantity" class="excel-yellow-input font-bold text-base" />
            </td>
          </tr>
        </tbody>
      </table>

      <div class="sheet-footer-note">
        Nota: No cambie ningún elemento de esta página.
      </div>
    </div>

    <!-- Excel Bottom Tabs Bar -->
    <div class="excel-bottom-tabs">
      <span class="excel-tabs-lbl">Hojas de Excel:</span>
      <button 
        @click="activeSheet = 'EU-5600Pro'" 
        class="excel-tab-pill"
        :class="{ 'active-pill': activeSheet === 'EU-5600Pro' }"
      >
        EU-5600Pro
      </button>
      <button 
        @click="activeSheet = 'consumo de reactivos'" 
        class="excel-tab-pill"
        :class="{ 'active-pill': activeSheet === 'consumo de reactivos' }"
      >
        consumo de reactivos
      </button>
    </div>
  </div>
</template>

<script>
import { calculateEU5600ReagentConsumption } from '../Utils/eu5600ReagentCalculator.js';

export default {
  name: 'EU5600ReagentSection',
  props: {
    contractMonths: {
      type: Number,
      default: 60
    },
    operatingDaysDefault: {
      type: Number,
      default: 24
    },
    initialDryTests: {
      type: Number,
      default: 100
    },
    initialSedTests: {
      type: Number,
      default: 100
    },
    initialComboTests: {
      type: Number,
      default: 100
    }
  },
  data() {
    return {
      activeSheet: 'EU-5600Pro',
      inputs: {
        dryChemistryDaily: this.initialDryTests || 100,
        sedimentDaily: this.initialSedTests || 100,
        comboDaily: this.initialComboTests || 100,
        dryMlPerSample: 4,
        sedMlPerSample: 16,
        comboMlPerSample: 16,
        operatingDaysMonth: this.operatingDaysDefault || 24,
        eu50DeadVolumeRatio: 0.052,
        eu50StartUp: 54,
        eu50ShutDown: 70,
        eu50BottleSpec: 5000,
        stripsMlPerSample: 1,
        stripsCanSpec: 100,
        cleanserShutDown: 6,
        cleanserMonths: this.contractMonths || 60,
        cleanserTotalQuantity: this.contractMonths || 60,
        priceEu50: 105,
        priceStrips11: 90,
        priceStrips14: 108,
        priceCleanser: 0
      }
    };
  },
  watch: {
    contractMonths: {
      immediate: true,
      handler(newMonths) {
        if (newMonths && newMonths > 0) {
          this.inputs.cleanserMonths = newMonths;
          this.inputs.cleanserTotalQuantity = newMonths; // 1 frasco por mes
        }
      }
    },
    operatingDaysDefault: {
      immediate: true,
      handler(newDays) {
        if (newDays && newDays > 0) {
          this.inputs.operatingDaysMonth = newDays;
        }
      }
    },
    initialDryTests(newVal) {
      if (newVal !== undefined) this.inputs.dryChemistryDaily = newVal;
    },
    initialSedTests(newVal) {
      if (newVal !== undefined) this.inputs.sedimentDaily = newVal;
    },
    initialComboTests(newVal) {
      if (newVal !== undefined) this.inputs.comboDaily = newVal;
    }
  },
  computed: {
    calcData() {
      return calculateEU5600ReagentConsumption(this.inputs);
    },
    cleanserTotalCost() {
      const price = Number(this.inputs.priceCleanser || 0);
      const qty = Number(this.inputs.cleanserTotalQuantity || 0);
      return price * qty;
    }
  },
  methods: {
    formatSpanishDecimal(val, decimals = 1) {
      if (val === null || val === undefined || val === '') return '';
      const num = Number(val);
      if (isNaN(num)) return val;
      return num.toFixed(decimals).replace('.', ',');
    }
  }
};
</script>

<style scoped>
.excel-standalone-wrapper {
  background: #ffffff !important;
  border: 2px solid #333333 !important;
  border-radius: 4px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  color: #000000 !important;
  margin-bottom: 20px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

.excel-top-nav-bar {
  background: #1b5e20;
  padding: 8px 12px;
  display: flex;
  gap: 10px;
}

.excel-tab-btn {
  background: #2e7d32;
  color: #ffffff;
  border: none;
  padding: 6px 14px;
  font-size: 13px;
  font-weight: bold;
  border-radius: 4px;
  cursor: pointer;
}

.excel-tab-btn.active-tab {
  background: #ffffff;
  color: #1b5e20;
  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
}

.excel-sheet-box {
  padding: 16px;
  background: #ffffff !important;
  overflow-x: auto;
}

.sheet-title-header {
  font-size: 15px;
  font-weight: bold;
  text-align: center;
  margin-bottom: 12px;
  color: #000000 !important;
}

.sheet-title-header-dark {
  font-size: 18px;
  font-weight: bold;
  text-align: center;
  background: #616161;
  color: #ffffff;
  padding: 6px 12px;
  margin-bottom: 14px;
  border-radius: 2px;
}

/* Explicit Table Grid Lines */
.excel-grid-table {
  width: 100%;
  border-collapse: collapse !important;
  border: 2px solid #222222 !important;
  font-size: 12px;
  background: #ffffff !important;
}

.excel-grid-table th,
.excel-grid-table td {
  border: 1px solid #444444 !important;
  padding: 6px 8px;
  color: #000000 !important;
}

.excel-header-row th {
  background: #cccccc !important;
  color: #000000 !important;
  font-weight: bold;
  text-align: center;
}

.excel-th-yellow {
  background: #ffff00 !important;
  color: #000000 !important;
}

.excel-cell-lbl {
  font-weight: bold;
  background: #ffffff !important;
}

.excel-cell-yellow {
  background: #ffff00 !important;
  padding: 0 !important;
}

.excel-yellow-input {
  width: 100%;
  height: 100%;
  background: #ffff00 !important;
  border: none !important;
  outline: none !important;
  text-align: center;
  font-weight: bold;
  font-size: 13px;
  color: #000000 !important;
  padding: 6px 0;
}

.excel-gray-input {
  width: 100%;
  height: 100%;
  background: transparent !important;
  border: none !important;
  outline: none !important;
  text-align: center;
  font-weight: bold;
  font-size: 14px;
  color: #000000 !important;
}

.excel-yellow-input.text-blue {
  color: #0000cc !important;
}

.excel-cell-gray {
  background: #d6d6d6 !important;
}

.excel-cell-cost {
  background: #d6d6d6 !important;
  color: #000000 !important;
}

.excel-cell-item {
  font-weight: bold;
  color: #0055cc !important;
}

.excel-cell-code {
  font-weight: bold;
  text-align: center;
  font-family: 'Courier New', Courier, monospace;
}

.excel-cell-blue {
  color: #0055cc !important;
  font-weight: 600;
}

.excel-cell-bold {
  font-weight: bold;
  color: #000000 !important;
}

.bg-light-blue {
  background: #e3f2fd !important;
}

.cleanser-summary-box {
  background: #e8f5e9;
  border: 1.5px solid #2e7d32;
  border-radius: 6px;
  padding: 10px 14px;
}

.cleanser-summary-content {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 13px;
}

.summary-lbl {
  font-weight: bold;
  color: #1b5e20;
}

.summary-val {
  font-weight: 800;
  color: #2e7d32;
  font-size: 15px;
}

.summary-sub {
  color: #555555;
  font-size: 12px;
}

.excel-yellow-banner {
  background: #ffff00 !important;
  border: 1px solid #222222 !important;
  color: #000000 !important;
  font-weight: 800;
  text-align: center;
  padding: 4px 10px;
  font-size: 12px;
}

.excel-notes-box {
  background: #ffffff !important;
  border: 1px solid #444444 !important;
  padding: 10px 12px;
  font-size: 11px;
  line-height: 1.5;
  color: #000000 !important;
}

.yellow-highlight {
  background: #ffff00 !important;
  display: inline-block;
  padding: 1px 4px;
  font-weight: bold;
}

.sheet-footer-note {
  font-size: 11px;
  font-weight: bold;
  color: #333333 !important;
  padding: 6px 0;
}

.excel-bottom-tabs {
  background: #cccccc;
  border-top: 2px solid #333333;
  padding: 6px 12px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.excel-tabs-lbl {
  font-size: 11px;
  font-weight: bold;
  color: #000000 !important;
}

.excel-tab-pill {
  background: #bbbbbb;
  color: #000000;
  border: 1px solid #666666;
  padding: 4px 12px;
  font-size: 11px;
  font-weight: bold;
  border-radius: 3px 3px 0 0;
  cursor: pointer;
}

.excel-tab-pill.active-pill {
  background: #ffffff !important;
  color: #1b5e20 !important;
  border-bottom: 2px solid #ffffff !important;
  margin-bottom: -7px;
}
</style>
