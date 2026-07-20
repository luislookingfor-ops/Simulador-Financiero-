<template>
  <div class="excel-standalone-wrapper">
    <!-- Top Navigation Tabs (Excel-like Sheet Switcher) -->
    <div class="excel-top-nav-bar">
      <button 
        @click="activeSheet = 'EU-5600Pro'" 
        class="excel-tab-btn"
        :class="{ 'active-tab': activeSheet === 'EU-5600Pro' }"
      >
        📄 HOJA 1: EU-5600Pro (Envase y Costo por Prueba)
      </button>
      <button 
        @click="activeSheet = 'consumo de reactivos'" 
        class="excel-tab-btn"
        :class="{ 'active-tab': activeSheet === 'consumo de reactivos' }"
      >
        📊 HOJA 2: consumo de reactivos (Matriz de Consumo Técnico)
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
              ${{ formatDecimal(calcData.tabla1.costo_prueba_fob, 9) }}
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
            <td class="excel-cell-blue text-center">{{ formatDecimal(calcData.tabla1.eu50.botella_mes, 1) }}</td>
            <td class="excel-cell-blue text-center">{{ formatDecimal(calcData.tabla1.eu50.botella_ano, 1) }}</td>
            <td class="excel-cell-blue text-center text-green font-bold">{{ formatDecimal(calcData.tabla1.eu50.botella_caducidad, 1) }}</td>
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
            <td class="excel-cell-blue text-center">{{ formatDecimal(calcData.tabla1.strips11.botella_mes, 1) }}</td>
            <td class="excel-cell-blue text-center">{{ formatDecimal(calcData.tabla1.strips11.botella_ano, 1) }}</td>
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
            <td class="excel-cell-blue text-center">{{ formatDecimal(calcData.tabla1.strips14.botella_mes, 1) }}</td>
            <td class="excel-cell-blue text-center">{{ formatDecimal(calcData.tabla1.strips14.botella_ano, 1) }}</td>
            <td class="excel-cell-blue text-center">/</td>
            <td class="excel-cell-blue text-center font-bold text-sm bg-light-blue">{{ calcData.tabla1.strips14.envase_ano }}</td>
          </tr>

          <!-- Cleanser -->
          <tr>
            <td class="excel-cell-item">Cleanser</td>
            <td class="excel-cell-code">/</td>
            <td class="excel-cell-yellow">
              <input type="number" v-model.number="inputs.priceCleanser" class="excel-yellow-input text-blue" />
            </td>
            <td class="excel-cell-blue text-center"></td>
            <td class="excel-cell-blue text-center"></td>
            <td class="excel-cell-blue text-center"></td>
            <td class="excel-cell-blue text-center"></td>
            <td class="excel-cell-blue text-center bg-light-blue"></td>
          </tr>
        </tbody>
      </table>

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
            <th>Pruebas/día</th>
            <th>Prueba/muestra (ml/strip)</th>
            <th>Dias laborables al mes</th>
            <th>Dias laborables al año</th>
            <th>Consumo/día (ml/strip)</th>
            <th>Consumo/mes (ml/strip)</th>
            <th>Consumo/año (ml/strip)</th>
            <th>Volumen muerto</th>
            <th>Start up (ml)</th>
            <th>Shut down (ml)</th>
            <th>Especificación del frasco (ml/strip)</th>
            <th class="excel-th-yellow">Frasco/mes</th>
            <th class="excel-th-yellow">Frasco/año</th>
          </tr>
        </thead>
        <tbody>
          <!-- EU-50 Row Group -->
          <tr>
            <td rowspan="3" class="excel-cell-bold text-center align-middle">EU-50</td>
            <td>Química seca</td>
            <td class="text-center bg-gray-100 font-semibold">{{ calcData.tabla2.eu50.dry.dia }}</td>
            <td class="text-center bg-gray-100 font-semibold">{{ calcData.tabla2.eu50.dry.ml_sample }}</td>
            <td rowspan="3" class="text-center bg-gray-300 font-bold align-middle text-base">{{ calcData.tabla2.dias_mes }}</td>
            <td rowspan="3" class="text-center bg-gray-300 font-bold align-middle text-base">{{ calcData.tabla2.dias_ano }}</td>
            <td class="text-center font-semibold">{{ calcData.tabla2.eu50.dry.cons_dia }}</td>
            <td class="text-center font-semibold">{{ calcData.tabla2.eu50.dry.cons_mes }}</td>
            <td class="text-center font-semibold">{{ calcData.tabla2.eu50.dry.cons_ano }}</td>
            <td rowspan="3" class="text-center align-middle font-semibold">{{ calcData.tabla2.eu50.volumen_muerto }}</td>
            <td rowspan="3" class="text-center align-middle font-semibold">{{ calcData.tabla2.eu50.start_up }}</td>
            <td rowspan="3" class="text-center align-middle font-semibold">{{ calcData.tabla2.eu50.shut_down }}</td>
            <td rowspan="3" class="text-center align-middle font-semibold">{{ calcData.tabla2.eu50.especificacion_frasco }}</td>
            <td rowspan="3" class="excel-cell-yellow text-center align-middle font-bold text-base">{{ calcData.tabla2.eu50.frasco_mes }}</td>
            <td rowspan="3" class="excel-cell-yellow text-center align-middle font-bold text-base">{{ calcData.tabla2.eu50.frasco_ano }}</td>
          </tr>
          <tr>
            <td>Sedimento</td>
            <td class="text-center bg-gray-100 font-semibold">{{ calcData.tabla2.eu50.sed.dia }}</td>
            <td class="text-center bg-gray-100 font-semibold">{{ calcData.tabla2.eu50.sed.ml_sample }}</td>
            <td class="text-center font-semibold">{{ calcData.tabla2.eu50.sed.cons_dia }}</td>
            <td class="text-center font-semibold">{{ calcData.tabla2.eu50.sed.cons_mes }}</td>
            <td class="text-center font-semibold">{{ calcData.tabla2.eu50.sed.cons_ano }}</td>
          </tr>
          <tr>
            <td>Química seca + Sedimento</td>
            <td class="text-center bg-gray-100 font-semibold">{{ calcData.tabla2.eu50.combo.dia }}</td>
            <td class="text-center bg-gray-100 font-semibold">{{ calcData.tabla2.eu50.combo.ml_sample }}</td>
            <td class="text-center font-semibold">{{ calcData.tabla2.eu50.combo.cons_dia }}</td>
            <td class="text-center font-semibold">{{ calcData.tabla2.eu50.combo.cons_mes }}</td>
            <td class="text-center font-semibold">{{ calcData.tabla2.eu50.combo.cons_ano }}</td>
          </tr>

          <!-- Strips Row -->
          <tr>
            <td class="excel-cell-bold text-center">Strips</td>
            <td class="text-center">/</td>
            <td class="text-center bg-gray-100 font-semibold">{{ calcData.tabla2.strips.dia }}</td>
            <td class="text-center bg-gray-100 font-semibold">{{ calcData.tabla2.strips.ml_sample }}</td>
            <td class="text-center bg-gray-300"></td>
            <td class="text-center bg-gray-300"></td>
            <td class="text-center font-semibold">{{ calcData.tabla2.strips.cons_dia }}</td>
            <td class="text-center font-semibold">{{ calcData.tabla2.strips.cons_mes }}</td>
            <td class="text-center font-semibold">{{ calcData.tabla2.strips.cons_ano }}</td>
            <td class="text-center font-semibold">{{ calcData.tabla2.strips.volumen_muerto }}</td>
            <td class="text-center font-semibold">{{ calcData.tabla2.strips.start_up }}</td>
            <td class="text-center font-semibold">{{ calcData.tabla2.strips.shut_down }}</td>
            <td class="text-center font-semibold">{{ calcData.tabla2.strips.especificacion_frasco }}</td>
            <td class="excel-cell-yellow text-center font-bold text-base">{{ calcData.tabla2.strips.frasco_mes }}</td>
            <td class="excel-cell-yellow text-center font-bold text-base">{{ calcData.tabla2.strips.frasco_ano }}</td>
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
            <td class="text-center font-semibold">{{ calcData.tabla2.cleanser.shut_down }}</td>
            <td class="text-center"></td>
            <td class="excel-cell-yellow text-center"></td>
            <td class="excel-cell-yellow text-center"></td>
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
        🟢 EU-5600Pro
      </button>
      <button 
        @click="activeSheet = 'consumo de reactivos'" 
        class="excel-tab-pill"
        :class="{ 'active-pill': activeSheet === 'consumo de reactivos' }"
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
      activeSheet: 'EU-5600Pro',
      inputs: {
        dryChemistryDaily: 100,
        sedimentDaily: 100,
        comboDaily: 100,
        operatingDaysMonth: 24,
        priceEu50: 105,
        priceStrips11: 90,
        priceStrips14: 108,
        priceCleanser: 0,
        activeStripType: 'strips11'
      }
    };
  },
  computed: {
    calcData() {
      return calculateEU5600ReagentConsumption(this.inputs);
    }
  },
  methods: {
    formatDecimal(val, decimals = 1) {
      if (val === null || val === undefined || val === '') return '';
      const num = Number(val);
      if (isNaN(num)) return val;
      return num.toLocaleString('es-ES', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
    }
  }
};
</script>

<style scoped>
.excel-standalone-wrapper {
  background: #ffffff;
  border: 2px solid #555555;
  border-radius: 6px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  color: #000000;
  margin-bottom: 20px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

.excel-top-nav-bar {
  background: #2e7d32;
  padding: 8px 12px;
  display: flex;
  gap: 10px;
}

.excel-tab-btn {
  background: #1b5e20;
  color: #ffffff;
  border: none;
  padding: 6px 14px;
  font-size: 13px;
  font-weight: bold;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.excel-tab-btn.active-tab {
  background: #ffffff;
  color: #1b5e20;
  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
}

.excel-sheet-box {
  padding: 16px;
  background: #ffffff;
  overflow-x: auto;
}

.sheet-title-header {
  font-size: 15px;
  font-weight: bold;
  text-align: center;
  margin-bottom: 12px;
  color: #000000;
}

.sheet-title-header-dark {
  font-size: 18px;
  font-weight: bold;
  text-align: center;
  background: #757575;
  color: #ffffff;
  padding: 6px 12px;
  margin-bottom: 14px;
  border-radius: 4px;
}

/* Explicit Excel Table Grid Rules */
.excel-grid-table {
  width: 100%;
  border-collapse: collapse !important;
  border: 2px solid #333333 !important;
  font-size: 12px;
  background: #ffffff;
}

.excel-grid-table th,
.excel-grid-table td {
  border: 1px solid #555555 !important;
  padding: 6px 8px;
  color: #000000;
}

.excel-header-row th {
  background: #d6d6d6 !important;
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
  background: #ffffff;
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
  color: #000000;
  padding: 6px 0;
}

.excel-yellow-input.text-blue {
  color: #0000cc !important;
}

.excel-cell-gray {
  background: #e0e0e0 !important;
}

.excel-cell-cost {
  background: #e0e0e0 !important;
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
  color: #000000;
}

.bg-light-blue {
  background: #e3f2fd !important;
}

.excel-yellow-banner {
  background: #ffff00;
  border: 1px solid #333333;
  color: #000000;
  font-weight: 800;
  text-align: center;
  padding: 4px 10px;
  font-size: 12px;
}

.excel-notes-box {
  background: #ffffff;
  border: 1px solid #555555;
  padding: 10px 12px;
  font-size: 11px;
  line-height: 1.5;
  color: #000000;
}

.yellow-highlight {
  background: #ffff00;
  display: inline-block;
  padding: 1px 4px;
  font-weight: bold;
}

.sheet-footer-note {
  font-size: 11px;
  font-weight: bold;
  color: #333333;
  padding: 6px 0;
}

.excel-bottom-tabs {
  background: #e0e0e0;
  border-top: 2px solid #555555;
  padding: 6px 12px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.excel-tabs-lbl {
  font-size: 11px;
  font-weight: bold;
  color: #333333;
}

.excel-tab-pill {
  background: #cccccc;
  color: #333333;
  border: 1px solid #888888;
  padding: 4px 12px;
  font-size: 11px;
  font-weight: bold;
  border-radius: 3px 3px 0 0;
  cursor: pointer;
}

.excel-tab-pill.active-pill {
  background: #ffffff;
  color: #1b5e20;
  border-bottom: 2px solid #ffffff;
  margin-bottom: -7px;
}
</style>
