<template>
  <div class="app-container">
    <!-- Sidebar -->
    <aside class="sidebar">
      <div class="brand">
        <img src="/images/logo.png" alt="INGELAB Logo" class="brand-logo" />
      </div>

      <nav class="nav-menu">
        <a href="#" class="nav-item active">
          <svg class="icon" viewBox="0 0 24 24"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-2 10H7v-2h10v2zm0-4H7V7h10v2zm0 8H7v-2h10v2z"/></svg>
          Simulador HUC
        </a>
        <a href="#" class="nav-item" @click.prevent="showToast('Módulo Maestro de Equipos en desarrollo', 'info')">
          <svg class="icon" viewBox="0 0 24 24"><path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H8V4h12v12z"/></svg>
          Maestro Equipos
        </a>
        <a href="#" class="nav-item" @click.prevent="showToast('Historial comercial en desarrollo', 'info')">
          <svg class="icon" viewBox="0 0 24 24"><path d="M13 3c-4.97 0-9 4.03-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42C8.27 19.99 10.51 21 13 21c4.97 0 9-4.03 9-9s-4.03-9-9-9zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z"/></svg>
          Historial Escenarios
        </a>
      </nav>

      <div class="sidebar-footer">
        <div class="user-profile">
          <div class="avatar">C</div>
          <div class="user-info">
            <strong>Asesor Ingelab</strong>
            <span>Vendedor Senior</span>
          </div>
        </div>
      </div>
    </aside>

    <!-- Main Content -->
    <main class="main-content">
      <!-- Header -->
      <header class="top-header">
        <div class="header-title">
          <h1>Simulador de Costos y Proyecciones HUC</h1>
          <p>Simulador financiero para propuestas de comodato y venta de reactivos</p>
        </div>
        <div class="scenario-actions">
          <input 
            type="text" 
            v-model="scenarioName" 
            placeholder="Nombre de la Simulación (ej. Hosp. Metropolitano)" 
            class="form-input text-input shadow-sm"
          />
          <button @click="saveScenario" class="btn btn-primary" :disabled="saving">
            <span v-if="saving">Guardando...</span>
            <span v-else>Guardar Escenario</span>
          </button>
        </div>
      </header>

      <!-- Dashboard Grid -->
      <div class="dashboard-grid">
        <!-- Global Settings Card -->
        <section class="card global-settings-card">
          <div class="card-header">
            <h3>Consideraciones Generales:</h3>
            <span class="badge">Afecta todos los cálculos</span>
          </div>
          <div class="settings-grid">
            <div class="form-group">
              <label>Tipo de cliente</label>
              <select v-model="globalSettings.client_type" class="form-input text-success font-semibold">
                <option value="Público">Público</option>
                <option value="Privado">Privado</option>
              </select>
            </div>
            <div class="form-group">
              <label>Periodo Contrato (Meses)</label>
              <input type="number" v-model.number="globalSettings.contract_months" class="form-input" min="1" max="120" />
            </div>
            <div class="form-group">
              <label>Amortización Equipos (Meses)</label>
              <input type="number" v-model.number="globalSettings.amortization_months" class="form-input text-success font-semibold" min="1" max="120" />
            </div>
            <div class="form-group">
              <label>Prueba Reportada</label>
              <select v-model="globalSettings.reported_test" class="form-input text-danger font-semibold">
                <option value="No">No</option>
                <option value="Sí">Sí</option>
              </select>
            </div>
            <div class="form-group">
              <label>Tasa de Interés Anual</label>
              <div class="input-with-suffix">
                <input type="number" v-model.number="globalSettings.interest_rate" class="form-input text-danger font-semibold" min="0" max="100" step="0.1" />
                <span class="suffix">%</span>
              </div>
            </div>
            <div class="form-group">
              <label>Inflación Anual</label>
              <div class="input-with-suffix">
                <input type="number" v-model.number="globalSettings.inflation_rate" class="form-input text-danger font-semibold" min="0" max="50" step="0.1" />
                <span class="suffix">%</span>
              </div>
            </div>
            <div class="form-group">
              <label>Índice de Importación</label>
              <input type="number" v-model.number="globalSettings.import_index" class="form-input text-danger font-semibold" min="1.0" max="3.0" step="0.01" />
            </div>
          </div>
        </section>

        <!-- Equipment Columns Comparison Workspace -->
        <section class="workspace-section">
          <div class="workspace-header-bar">
            <div class="workspace-header-text">
              <h2>Configuración & Análisis de Propuestas</h2>
              <p>Edita cantidades, equipos y accesorios directamente en la tabla con cálculo automático en tiempo real.</p>
            </div>
            
            <div class="workspace-tabs-nav">
              <button 
                v-for="cIdx in [0, 1, 2]" 
                :key="cIdx"
                @click="activeProposalTab = cIdx"
                class="tab-nav-btn"
                :class="{ active: activeProposalTab === cIdx }"
              >
                📋 EQUIPO {{ cIdx + 1 }}
              </button>
              <button 
                @click="activeProposalTab = 'all'"
                class="tab-nav-btn tab-nav-btn-alt"
                :class="{ active: activeProposalTab === 'all' }"
              >
                📊 VISTA COMPARATIVA (3 COLUMNAS)
              </button>
            </div>
          </div>

          <div class="columns-grid" :class="{ 'single-col-expanded': activeProposalTab !== 'all' }">
            <template v-for="colIndex in [0, 1, 2]" :key="colIndex">
              <div 
                v-if="activeProposalTab === 'all' || activeProposalTab === colIndex" 
                class="card equipment-column-card"
              >
                <div class="excel-card-top-bar">
                  <span class="excel-title">EQUIPO {{ colIndex + 1 }}</span>
                  <button 
                    v-if="equipmentConfigs[colIndex].equipment_id" 
                    @click="resetColumn(colIndex)" 
                    class="btn-reset-excel" 
                    title="Limpiar propuesta"
                  >
                    ×
                  </button>
                </div>

                <div class="column-body">
                  <!-- Excel Top Metadata Grid -->
                  <div class="excel-form-top">
                    <div class="excel-form-row">
                      <div class="excel-label">Línea:</div>
                      <div class="excel-val">
                        <select v-model="equipmentConfigs[colIndex].lineFilter" class="excel-select font-bold">
                          <option value="">TODAS LAS LÍNEAS</option>
                          <option v-for="line in uniqueLines" :key="line" :value="line">{{ line.toUpperCase() }}</option>
                        </select>
                      </div>
                      <div class="excel-label text-right">Cantidad:</div>
                      <div class="excel-val">
                        <input type="number" v-model.number="equipmentConfigs[colIndex].quantity" min="1" max="100" class="excel-input text-success font-bold text-center" />
                      </div>
                    </div>

                    <div class="excel-form-row">
                      <div class="excel-label">Equipo:</div>
                      <div class="excel-val col-span-3">
                        <select 
                          v-model="equipmentConfigs[colIndex].equipment_id" 
                          @change="onEquipmentChange(colIndex)"
                          class="excel-select font-bold underline-select"
                        >
                          <option :value="null">-- SELECCIONAR EQUIPO --</option>
                          <option 
                            v-for="eq in filteredEquipments(equipmentConfigs[colIndex].lineFilter)" 
                            :key="eq.id" 
                            :value="eq.id"
                          >
                            {{ eq.name }}
                          </option>
                        </select>
                      </div>
                    </div>

                    <div class="excel-form-row" v-if="equipmentConfigs[colIndex].equipment_id">
                      <div class="excel-label">Tipo:</div>
                      <div class="excel-val col-span-3">
                        <select v-model="equipmentConfigs[colIndex].equipment_type" class="excel-select font-bold text-primary">
                          <option value="EQUIPO NUEVO">EQUIPO NUEVO</option>
                          <option value="EQUIPO REACONDICIONADO">EQUIPO REACONDICIONADO</option>
                          <option value="EQUIPO USADO">EQUIPO USADO</option>
                          <option value="EQUIPO EN COMODATO">EQUIPO EN COMODATO</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <!-- If equipment is selected, show itemized table & calculations -->
                  <div v-if="equipmentConfigs[colIndex].equipment_id" class="results-wrapper">
                    
                    <!-- Itemized Interactive Table Breakdown -->
                    <div class="excel-table-wrapper">
                      <table class="excel-breakdown-table">
                        <thead>
                          <tr>
                            <th style="width: 85px;" class="text-center">Cantidad</th>
                            <th style="width: 1fr;" class="text-left">Equipos</th>
                            <th style="width: 170px;" class="text-right">Costo Unit FOB</th>
                            <th style="width: 170px;" class="text-right">Costo Total</th>
                            <th style="width: 50px;" class="text-center">Acción</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr v-for="(item, idx) in (equipmentConfigs[colIndex].customItems || [])" :key="idx">
                            <td class="text-center">
                              <input 
                                type="number" 
                                v-model.number="item.qty" 
                                min="1" 
                                class="table-editable-input text-center font-bold" 
                              />
                            </td>
                            <td>
                              <input 
                                type="text" 
                                v-model="item.name" 
                                class="table-editable-input font-medium" 
                              />
                            </td>
                            <td class="text-right">
                              <div class="table-money-input">
                                <span class="prefix">$</span>
                                <input 
                                  type="number" 
                                  v-model.number="item.unitFob" 
                                  step="0.01" 
                                  min="0" 
                                  class="table-editable-input text-right font-semibold" 
                                />
                              </div>
                            </td>
                            <td class="text-right font-bold text-main">
                              ${{ formatMoney((Number(item.qty) || 0) * (Number(item.unitFob) || 0)) }}
                            </td>
                            <td class="text-center">
                              <button 
                                @click="removeItem(colIndex, idx)" 
                                class="btn-delete-row" 
                                title="Eliminar este ítem"
                              >
                                ✕
                              </button>
                            </td>
                          </tr>
                        </tbody>
                        <tfoot>
                          <tr class="dark-red-total-row">
                            <td colspan="3" class="text-right font-bold text-lg">Total</td>
                            <td class="text-right font-bold text-lg">${{ formatMoney(calculations[colIndex].fob_selected_sum) }}</td>
                            <td></td>
                          </tr>
                        </tfoot>
                      </table>

                      <div class="table-add-bar">
                        <button @click="addItem(colIndex)" class="btn-add-item">
                          + Añadir Equipo / Ítem a la Tabla
                        </button>
                      </div>
                    </div>

                  <!-- Options Section below table -->
                  <div class="excel-options-section">
                    <div class="excel-option-row">
                      <span class="lbl">¿Necesita Impresora Zebra? -></span>
                      <select v-model="equipmentConfigs[colIndex].need_zebra" @change="syncToggles(colIndex)" class="excel-mini-select font-semibold">
                        <option value="No">No</option>
                        <option value="Sí">Sí</option>
                      </select>
                    </div>

                    <div class="excel-option-row">
                      <span class="lbl">¿Necesita Software? -></span>
                      <select v-model="equipmentConfigs[colIndex].need_software" @change="syncToggles(colIndex)" class="excel-mini-select font-semibold">
                        <option value="No">No</option>
                        <option value="Sí">Sí</option>
                      </select>

                      <template v-if="equipmentConfigs[colIndex].need_software === 'Sí'">
                        <span class="lbl text-danger font-bold ml-2">Seleccione Valor -></span>
                        <div class="excel-val-input-box">
                          <span class="prefix">$</span>
                          <input type="number" v-model.number="equipmentConfigs[colIndex].software_value" class="excel-mini-input font-bold" />
                        </div>
                      </template>
                    </div>
                  </div>

                  <!-- Dark Red Amortization Bar -->
                  <div class="dark-red-amortization-bar">
                    <span>Amortización ({{ globalSettings.amortization_months || 36 }} meses)</span>
                    <div class="val-box">
                      <span class="currency">$</span>
                      <strong class="amount">{{ formatMoney(calculations[colIndex].monthly_amortization) }}</strong>
                      <span class="check-icon">✓</span>
                    </div>
                  </div>

                  <!-- Volumetrics Grid -->
                  <div class="excel-volumetrics-card">
                    <div class="vol-left-col">
                      <div class="vol-item-row">
                        <span class="vol-lbl text-danger font-bold">Pruebas Diarias</span>
                        <input type="number" v-model.number="equipmentConfigs[colIndex].daily_tests" class="vol-input text-center font-bold text-danger" min="0" />
                      </div>
                      <div class="vol-item-row">
                        <span class="vol-lbl">Pruebas Mensuales</span>
                        <div class="vol-box-val font-bold">{{ formatNumber(calculations[colIndex].volumetrics.monthly_tests) }}</div>
                      </div>
                      <div class="vol-item-row">
                        <span class="vol-lbl">Pruebas Anuales</span>
                        <div class="vol-box-val font-bold">{{ formatNumber(calculations[colIndex].volumetrics.annual_tests) }}</div>
                      </div>
                      <div class="vol-item-row">
                        <span class="vol-lbl">¿Necesita Controles?</span>
                        <select v-model="equipmentConfigs[colIndex].need_controls" @change="syncToggles(colIndex)" class="excel-mini-select font-semibold">
                          <option value="No">No</option>
                          <option value="Sí">Sí</option>
                        </select>
                      </div>
                    </div>

                    <div class="vol-right-col text-center">
                      <span class="vol-title-lbl">Pruebas Totales</span>
                      <div class="total-tests-underline">
                        {{ formatNumber(calculations[colIndex].volumetrics.total_tests) }}
                      </div>
                    </div>
                  </div>

                  <!-- Commercial P&L & Margin Analysis Section -->
                  <div class="form-section mt-4">
                    <h4>Análisis de Rentabilidad Comercial</h4>

                    <div class="pricing-grid mb-3">
                      <div class="form-group">
                        <label>Precio Venta Prueba (PVP)</label>
                        <div class="input-with-prefix">
                          <span class="prefix">$</span>
                          <input type="number" v-model.number="equipmentConfigs[colIndex].pvp_per_test" class="form-input font-bold" min="0.01" step="0.01" />
                        </div>
                      </div>

                      <div class="form-group">
                        <label>Costo Reactivo Prueba</label>
                        <div class="input-with-prefix">
                          <span class="prefix">$</span>
                          <input type="number" v-model.number="equipmentConfigs[colIndex].reagent_cost_per_test" class="form-input font-bold" min="0" step="0.01" />
                        </div>
                      </div>
                    </div>

                    <div 
                      class="pl-card" 
                      :class="getProfitMarginClass(calculations[colIndex].p_and_l.net_profit_percent)"
                    >
                      <div class="pl-item">
                        <span>Ingresos Totales</span>
                        <strong>${{ formatMoney(calculations[colIndex].p_and_l.total_revenue) }}</strong>
                      </div>

                      <div class="pl-item">
                        <span>Utilidad Bruta</span>
                        <div class="pl-val">
                          <strong>${{ formatMoney(calculations[colIndex].p_and_l.gross_profit_usd) }}</strong>
                          <span class="percent-badge">{{ formatNumber(calculations[colIndex].p_and_l.gross_profit_percent) }}%</span>
                        </div>
                      </div>

                      <div class="pl-item border-top pt-2 mt-2">
                        <span class="highlight-lbl">Utilidad Neta</span>
                        <div class="pl-val">
                          <strong class="highlight-val">${{ formatMoney(calculations[colIndex].p_and_l.net_profit_usd) }}</strong>
                          <span class="percent-badge net-badge">{{ formatNumber(calculations[colIndex].p_and_l.net_profit_percent) }}% Net</span>
                        </div>
                      </div>

                      <div class="pl-warning-indicator mt-3">
                        <span class="lbl">Consumo Mínimo Mensual Requerido:</span>
                        <strong class="val">${{ formatMoney(calculations[colIndex].p_and_l.min_monthly_consumption) }} / mes</strong>
                      </div>
                    </div>
                  </div>

                </div>

                <!-- Empty State Column -->
                <div v-else class="column-empty-state">
                  <div class="empty-icon">🔬</div>
                  <h5>Propuesta Vacía</h5>
                  <p>Selecciona un equipo de la lista para iniciar la simulación y el análisis de costes HUC.</p>
                </div>
              </div>
            </template>
          </div>
          </div>
        </section>
      </div>
    </main>

    <!-- Toast Notification -->
    <div v-if="toast.show" class="toast" :class="'toast-' + toast.type">
      {{ toast.message }}
    </div>
  </div>
</template>

<script>
export default {
  props: {
    equipments: {
      type: Array,
      default: () => []
    },
    simulations: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      activeProposalTab: 0, // 0 = Equipo 1, 1 = Equipo 2, 2 = Equipo 3, 'all' = Vista comparativa
      scenarioName: '',
      saving: false,
      globalSettings: {
        client_type: 'Público',
        contract_months: 36,
        amortization_months: 36,
        interest_rate: 11,
        inflation_rate: 1,
        import_index: 1.15,
        reported_test: 'No'
      },
      equipmentConfigs: [
        this.getEmptyConfig(),
        this.getEmptyConfig(),
        this.getEmptyConfig()
      ],
      toast: {
        show: false,
        message: '',
        type: 'info'
      }
    };
  },
  computed: {
    uniqueLines() {
      const lines = this.equipments.map(eq => eq.line);
      return [...new Set(lines)];
    },
    // Real-time client-side calculation engine
    calculations() {
      return this.equipmentConfigs.map(cfg => {
        if (!cfg.equipment_id) {
          return this.getEmptyCalculation();
        }

        const eq = this.equipments.find(e => e.id === cfg.equipment_id);
        if (!eq) return this.getEmptyCalculation();

        const qty = Number(cfg.quantity) || 1;

        // Custom accessories pricing defaults
        const upsCost = cfg.include_ups ? Number(eq.ups) : 0;
        const pcCost = cfg.include_pc ? Number(eq.pc) : 0;
        const printerBaseCost = cfg.include_printer_base ? Number(eq.impresora) : 0;
        const zebraCost = cfg.include_zebra ? 330 : 0;
        const softwareCost = cfg.include_software ? Number(cfg.software_value) : 0;
        const syringesCost = cfg.include_syringes ? 150 : 0;
        const controlCost = cfg.include_controls ? Number(eq.control) : 0;
        const calibratorCost = cfg.include_controls ? Number(eq.calibrador) : 0;

        const importIndex = Number(this.globalSettings.import_index) || 1.15;

        // Sum FOB from customItems if present, otherwise default fallback
        let fobTotalSelected = 0;
        if (cfg.customItems && cfg.customItems.length > 0) {
          fobTotalSelected = cfg.customItems.reduce((sum, item) => {
            return sum + (Number(item.qty) || 0) * (Number(item.unitFob) || 0);
          }, 0);
        } else {
          fobTotalSelected = Number(eq.fob) + upsCost + pcCost + printerBaseCost + zebraCost + softwareCost + syringesCost + controlCost + calibratorCost;
        }

        const landedTeoricoUnit = fobTotalSelected * importIndex;
        const landedTeoricoTotal = landedTeoricoUnit * qty;

        // Landed Real: base equipment + all base accessories from master data
        const fobTotalBase = Number(eq.fob) + Number(eq.ups) + Number(eq.pc) + Number(eq.impresora) + Number(eq.control) + Number(eq.calibrador);
        const landedRealUnit = fobTotalBase * importIndex;
        const landedRealTotal = landedRealUnit * qty;

        // PMT Amortization calculation
        const contractMonths = Number(this.globalSettings.contract_months) || Number(this.globalSettings.months) || 36;
        const amortizationMonths = Number(this.globalSettings.amortization_months) || Number(this.globalSettings.months) || 36;
        const annualInterest = (Number(this.globalSettings.interest_rate) || 0) / 100;
        const r = annualInterest / 12;
        const n = amortizationMonths;
        let pmt = 0;

        if (r > 0) {
          pmt = (landedTeoricoTotal * r) / (1 - Math.pow(1 + r, -n));
        } else {
          pmt = landedTeoricoTotal / n;
        }

        // Volumetrics
        const dailyTests = Number(cfg.daily_tests) || 0;
        const monthlyTests = dailyTests * 30 * qty;
        const annualTests = monthlyTests * 12;
        const totalTests = monthlyTests * contractMonths;

        const pvp = Number(cfg.pvp_per_test) || 0;
        const totalRevenue = totalTests * pvp;

        // Reagents cost with compounded annual inflation
        const baseReagentCost = Number(cfg.reagent_cost_per_test) || 0;
        const annualInflation = (Number(this.globalSettings.inflation_rate) || 0) / 100;
        
        let totalReagentCost = 0;
        const monthlyTestsPerEq = dailyTests * 30;

        for (let m = 1; m <= contractMonths; m++) {
          const year = Math.floor((m - 1) / 12);
          const inflatedCost = baseReagentCost * Math.pow(1 + annualInflation, year);
          totalReagentCost += (monthlyTestsPerEq * qty) * inflatedCost;
        }

        // Profitability metrics
        const grossProfitUSD = totalRevenue - totalReagentCost;
        const grossProfitPercent = totalRevenue > 0 ? (grossProfitUSD / totalRevenue) * 100 : 0;

        const totalAmortization = pmt * contractMonths;
        const netProfitUSD = grossProfitUSD - totalAmortization;
        const netProfitPercent = totalRevenue > 0 ? (netProfitUSD / totalRevenue) * 100 : 0;

        // Cost of equipment per test (prorated monthly fee)
        const costPerTest = monthlyTests > 0 ? (pmt / monthlyTests) : 0;

        // Break-even consumption (average reagent cost over contract is used)
        const avgReagentCost = totalTests > 0 ? (totalReagentCost / totalTests) : baseReagentCost;
        const marginRatio = pvp > 0 ? (1 - (avgReagentCost / pvp)) : 0;
        const minMonthlyConsumption = marginRatio > 0 ? (pmt / marginRatio) : 0;

        return {
          fob_selected_sum: fobTotalSelected,
          landed_teorico_unit: landedTeoricoUnit,
          landed_teorico_total: landedTeoricoTotal,
          landed_real_unit: landedRealUnit,
          landed_real_total: landedRealTotal,
          monthly_amortization: pmt,
          total_amortization: totalAmortization,
          cost_per_test: costPerTest,
          volumetrics: {
            monthly_tests: monthlyTests,
            annual_tests: annualTests,
            total_tests: totalTests
          },
          p_and_l: {
            total_revenue: totalRevenue,
            gross_profit_usd: grossProfitUSD,
            gross_profit_percent: grossProfitPercent,
            net_profit_usd: netProfitUSD,
            net_profit_percent: netProfitPercent,
            min_monthly_consumption: minMonthlyConsumption
          }
        };
      });
    }
  },
  methods: {
    getEmptyConfig() {
      return {
        lineFilter: '',
        equipment_id: null,
        equipment_type: 'EQUIPO NUEVO',
        quantity: 1,
        customItems: [],
        include_ups: true,
        include_pc: true,
        include_printer_base: true,
        include_zebra: false,
        need_zebra: 'No',
        include_software: false,
        need_software: 'No',
        software_value: 2000,
        include_syringes: false,
        include_controls: true,
        need_controls: 'Sí',
        daily_tests: 30,
        pvp_per_test: 1.10,
        reagent_cost_per_test: 0.35
      };
    },
    getEmptyCalculation() {
      return {
        fob_selected_sum: 0,
        landed_teorico_unit: 0,
        landed_teorico_total: 0,
        landed_real_unit: 0,
        landed_real_total: 0,
        monthly_amortization: 0,
        total_amortization: 0,
        cost_per_test: 0,
        volumetrics: {
          monthly_tests: 0,
          annual_tests: 0,
          total_tests: 0
        },
        p_and_l: {
          total_revenue: 0,
          gross_profit_usd: 0,
          gross_profit_percent: 0,
          net_profit_usd: 0,
          net_profit_percent: 0,
          min_monthly_consumption: 0
        }
      };
    },
    rebuildCustomItems(colIndex) {
      const config = this.equipmentConfigs[colIndex];
      if (!config.equipment_id) {
        config.customItems = [];
        return;
      }
      const eq = this.getSelectedEquipment(config.equipment_id);
      if (!eq) return;

      const items = [
        { qty: 1, name: eq.name, unitFob: Number(eq.fob) }
      ];

      if (config.include_ups && Number(eq.ups) > 0) {
        items.push({ qty: 1, name: 'UPS SMART RT 1500VA 120V', unitFob: Number(eq.ups) });
      }
      if (config.include_pc && Number(eq.pc) > 0) {
        items.push({ qty: 1, name: 'COMPUTADOR 19.5"', unitFob: Number(eq.pc) });
      }
      if (config.include_printer_base && Number(eq.impresora) > 0) {
        items.push({ qty: 1, name: 'IMPRESORA TINTA CONTINUA', unitFob: Number(eq.impresora) });
      }
      if (config.need_zebra === 'Sí' || config.include_zebra) {
        items.push({ qty: 1, name: 'IMPRESORA ZEBRA', unitFob: 330 });
      }
      if (config.need_software === 'Sí' || config.include_software) {
        items.push({ qty: 1, name: 'SOFTWARE', unitFob: Number(config.software_value) || 2000 });
      }
      if (config.need_controls === 'Sí' || config.include_controls) {
        const ctrlCost = Number(eq.control) + Number(eq.calibrador);
        if (ctrlCost > 0) {
          items.push({ qty: 1, name: 'CONTROLES Y CALIBRADORES', unitFob: ctrlCost });
        }
      }

      config.customItems = items;
    },
    syncToggles(colIndex) {
      const cfg = this.equipmentConfigs[colIndex];
      cfg.include_zebra = (cfg.need_zebra === 'Sí');
      cfg.include_software = (cfg.need_software === 'Sí');
      cfg.include_controls = (cfg.need_controls === 'Sí');
      this.rebuildCustomItems(colIndex);
    },
    addItem(colIndex) {
      const cfg = this.equipmentConfigs[colIndex];
      if (!cfg.customItems) cfg.customItems = [];
      cfg.customItems.push({
        qty: 1,
        name: 'NUEVO EQUIPO / ACCESORIO',
        unitFob: 0.00
      });
    },
    removeItem(colIndex, itemIdx) {
      const cfg = this.equipmentConfigs[colIndex];
      if (cfg.customItems && cfg.customItems.length > 0) {
        cfg.customItems.splice(itemIdx, 1);
      }
    },
    filteredEquipments(filterLine) {
      if (!filterLine) return this.equipments;
      return this.equipments.filter(e => e.line === filterLine);
    },
    getSelectedEquipment(id) {
      return this.equipments.find(e => e.id === id) || { fob: 0, ups: 0, pc: 0, impresora: 0, control: 0, calibrador: 0 };
    },
    onEquipmentChange(colIndex) {
      const config = this.equipmentConfigs[colIndex];
      if (!config.equipment_id) {
        this.resetColumn(colIndex);
        return;
      }
      const eq = this.getSelectedEquipment(config.equipment_id);
      
      config.include_ups = eq.ups > 0;
      config.include_pc = eq.pc > 0;
      config.include_printer_base = eq.impresora > 0;
      config.include_controls = (eq.control > 0 || eq.calibrador > 0);
      config.need_controls = config.include_controls ? 'Sí' : 'No';
      
      config.reagent_cost_per_test = Number(eq.default_reagent_cost) || 0.35;
      
      config.include_zebra = false;
      config.need_zebra = 'No';
      config.include_software = false;
      config.need_software = 'No';
      config.software_value = 2000;
      config.include_syringes = false;

      if (eq.line === 'Inmunología' || eq.line === 'Inmunoensayo') {
        config.daily_tests = 50;
      } else if (eq.line === 'Hematología') {
        config.daily_tests = 30;
      } else {
        config.daily_tests = 20;
      }

      this.rebuildCustomItems(colIndex);
    },
    resetColumn(index) {
      this.equipmentConfigs[index] = this.getEmptyConfig();
    },
    getLineClass(equipmentId) {
      if (!equipmentId) return 'none';
      const eq = this.getSelectedEquipment(equipmentId);
      if (!eq || !eq.line) return 'default';
      const line = eq.line.toLowerCase();
      if (line.includes('hematolog')) return 'hematology';
      if (line.includes('coagulac')) return 'coagulation';
      if (line.includes('inmuno')) return 'immuno';
      if (line.includes('hplc')) return 'hplc';
      if (line.includes('químic') || line.includes('quimic')) return 'chemistry';
      if (line.includes('gas')) return 'gases';
      if (line.includes('electrolit')) return 'electrolytes';
      if (line.includes('uroanál') || line.includes('uroanal')) return 'urinalysis';
      return 'default';
    },
    getProfitMarginClass(netPercent) {
      if (netPercent >= 30) return 'pl-profitable';
      if (netPercent >= 15) return 'pl-warning';
      return 'pl-danger';
    },
    formatMoney(val) {
      if (isNaN(val) || val === null) return '0.00';
      return Number(val).toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      });
    },
    formatNumber(val) {
      if (isNaN(val) || val === null) return '0';
      return Math.round(Number(val)).toLocaleString('en-US');
    },
    truncateText(str, len) {
      if (!str) return '';
      if (str.length <= len) return str;
      return str.substring(0, len) + '...';
    },
    showToast(message, type = 'info') {
      this.toast.message = message;
      this.toast.type = type;
      this.toast.show = true;
      setTimeout(() => {
        this.toast.show = false;
      }, 3500);
    },
    async saveScenario() {
      if (!this.scenarioName) {
        this.showToast('Por favor, ingresa un nombre para la simulación.', 'warning');
        return;
      }

      const activeConfigs = this.equipmentConfigs.filter(c => c.equipment_id !== null);
      if (activeConfigs.length === 0) {
        this.showToast('Debes configurar al menos un equipo antes de guardar.', 'warning');
        return;
      }

      this.saving = true;
      
      // Mimic Inertia post request
      try {
        // We will post to '/simulations' endpoint
        const payload = {
          name: this.scenarioName,
          global_settings: this.globalSettings,
          equipment_settings: this.equipmentConfigs
        };

        // Inertia.post alternative since this runs on client and server mock
        if (window.hasOwnProperty('Inertia') || this.$inertia) {
          const client = this.$inertia || window.Inertia;
          client.post('/simulations', payload, {
            onSuccess: () => {
              this.showToast('Simulación guardada correctamente en base de datos.', 'success');
              this.scenarioName = '';
              this.saving = false;
            },
            onError: () => {
              this.showToast('Ocurrió un error al guardar.', 'danger');
              this.saving = false;
            }
          });
        } else {
          // Fallback fetch post for local dev mock server
          const response = await fetch('/simulations', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'X-Inertia': 'true',
              'X-Requested-With': 'XMLHttpRequest'
            },
            body: JSON.stringify(payload)
          });
          
          if (response.ok) {
            this.showToast('Simulación guardada correctamente (Local Mock DB).', 'success');
            this.scenarioName = '';
          } else {
            this.showToast('Error al conectar con la base de datos local.', 'danger');
          }
          this.saving = false;
        }
      } catch (err) {
        console.error(err);
        this.showToast('Error de red al guardar el escenario.', 'danger');
        this.saving = false;
      }
    }
  }
};
</script>

<style>
/* Reset & Theme Variable Setup */
:root {
  --bg-app: #f4f6fa;
  --bg-sidebar: #ffffff;
  --bg-card: #ffffff;
  --bg-card-hover: #fafbfc;
  --border-color: rgba(27, 35, 62, 0.08);
  --text-main: #1e293b;
  --text-muted: #64748b;
  --primary: #1b365d;       /* Ingelab Deep Blue */
  --primary-hover: #11223e;
  --success: #4fae5a;       /* Ingelab Green */
  --warning: #f59e0b;
  --danger: #ef4444;
  --font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
  --shadow-glow: 0 4px 18px 0 rgba(15, 23, 42, 0.04);
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  background-color: var(--bg-app);
  color: var(--text-main);
  font-family: var(--font-family);
  overflow-x: hidden;
  line-height: 1.5;
}

/* App Container Layout */
.app-container {
  display: flex;
  min-height: 100vh;
  background-attachment: fixed;
}

/* Sidebar Layout */
.sidebar {
  width: 260px;
  background-color: var(--bg-sidebar);
  border-right: 1px solid var(--border-color);
  display: flex;
  flex-direction: column;
  padding: 24px 16px;
  flex-shrink: 0;
}

.brand {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 32px;
  padding: 8px;
}

.brand-logo {
  max-width: 100%;
  max-height: 52px;
  object-fit: contain;
  display: block;
}

.nav-menu {
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex-grow: 1;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  color: var(--text-muted);
  text-decoration: none;
  border-radius: 10px;
  font-weight: 500;
  font-size: 0.9rem;
  transition: all 0.2s ease-in-out;
}

.nav-item:hover {
  color: var(--primary);
  background-color: rgba(27, 54, 93, 0.04);
}

.nav-item.active {
  background: rgba(79, 174, 90, 0.08); /* Light green background tint */
  color: var(--success); /* Ingelab Green active text */
  border-left: 3px solid var(--primary); /* Ingelab Blue border */
  font-weight: 600;
}

.nav-item .icon {
  width: 20px;
  height: 20px;
  fill: currentColor;
}

.sidebar-footer {
  padding-top: 16px;
  border-top: 1px solid var(--border-color);
}

.user-profile {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px;
}

.avatar {
  width: 36px;
  height: 36px;
  background-color: rgba(27, 54, 93, 0.1);
  border-radius: 50%;
  color: var(--primary);
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
}

.user-info strong {
  display: block;
  font-size: 0.85rem;
  color: var(--text-main);
}

.user-info span {
  font-size: 0.75rem;
  color: var(--text-muted);
}

/* Main Content Area */
.main-content {
  flex-grow: 1;
  padding: 32px;
  overflow-y: auto;
}

.top-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
  gap: 20px;
}

.header-title h1 {
  font-family: 'Outfit', sans-serif;
  font-size: 2rem;
  font-weight: 700;
  color: var(--primary);
}

.header-title p {
  color: var(--text-muted);
  font-size: 0.95rem;
}

.scenario-actions {
  display: flex;
  gap: 12px;
  align-items: center;
}

/* Shared Cards Styling */
.card {
  background-color: var(--bg-card);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  box-shadow: var(--shadow-glow);
  padding: 24px;
  transition: all 0.3s ease;
}

.card:hover {
  background-color: var(--bg-card-hover);
  border-color: rgba(27, 54, 93, 0.12);
}

/* Global Settings Card */
.global-settings-card {
  margin-bottom: 32px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.card-header h3 {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--primary);
}

.badge {
  background-color: rgba(79, 174, 90, 0.12);
  color: var(--success);
  font-size: 0.75rem;
  padding: 4px 8px;
  border-radius: 6px;
  font-weight: 600;
}

.settings-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px 24px;
}

@media (max-width: 1024px) {
  .settings-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 600px) {
  .settings-grid {
    grid-template-columns: 1fr;
  }
}

.settings-grid .form-group {
  display: flex;
  flex-direction: column;
}

.settings-grid .form-group label {
  font-size: 0.78rem;
  font-weight: 700;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  min-height: 34px;
  display: flex;
  align-items: flex-end;
  margin-bottom: 8px;
  line-height: 1.25;
}

/* Inputs & Form Controls */
.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form-group label {
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.form-input {
  background-color: #ffffff;
  border: 1px solid rgba(15, 23, 42, 0.15);
  border-radius: 8px;
  color: var(--text-main);
  padding: 10px 14px;
  font-size: 0.9rem;
  outline: none;
  width: 100%;
  transition: all 0.2s ease;
}

.form-input:focus {
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(27, 54, 93, 0.15);
}

.text-input {
  width: 320px;
}

.input-with-suffix, .input-with-prefix {
  position: relative;
  display: flex;
  align-items: center;
}

.input-with-suffix .suffix {
  position: absolute;
  right: 12px;
  color: var(--text-muted);
  font-size: 0.9rem;
  pointer-events: none;
}

.input-with-suffix .form-input {
  padding-right: 32px;
}

.input-with-prefix .prefix {
  position: absolute;
  left: 12px;
  color: var(--text-muted);
  font-size: 0.9rem;
  pointer-events: none;
}

.input-with-prefix .form-input {
  padding-left: 28px;
}

.selector-highlight {
  border-color: rgba(79, 174, 90, 0.4);
  font-weight: 600;
}

.val-input-box {
  margin-top: 8px;
  animation: fadeIn 0.2s ease;
}

/* Buttons */
.btn {
  padding: 10px 20px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  outline: none;
  border: none;
  transition: all 0.2s;
}

.btn-primary {
  background-color: var(--primary);
  color: #fff;
  box-shadow: 0 4px 14px rgba(27, 54, 93, 0.25);
}

.btn-primary:hover:not(:disabled) {
  background-color: var(--primary-hover);
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-reset {
  background: none;
  border: none;
  color: var(--text-muted);
  font-size: 1.5rem;
  cursor: pointer;
  line-height: 1;
  transition: color 0.2s;
}

.btn-reset:hover {
  color: var(--danger);
}

/* Workspace Columns layout */
.workspace-section {
  margin-top: 16px;
}

.workspace-header {
  margin-bottom: 24px;
}

.workspace-header h2 {
  font-family: 'Outfit', sans-serif;
  font-size: 1.4rem;
  font-weight: 600;
  color: var(--primary);
}

.workspace-header p {
  color: var(--text-muted);
  font-size: 0.9rem;
}

.columns-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}

@media (max-width: 1024px) {
  .columns-grid {
    grid-template-columns: 1fr;
  }
}

.equipment-column-card {
  padding: 0;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

/* Theme bands for Equipment Columns */
.column-header {
  padding: 16px 20px;
  background-color: rgba(27, 54, 93, 0.02);
  border-bottom: 1px solid var(--border-color);
}

.col-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.column-badge {
  font-size: 0.75rem;
  font-weight: 800;
  letter-spacing: 0.8px;
  color: var(--text-muted);
}

/* Color theme mappings based on medical equipment line */
.line-theme-hematology {
  background: linear-gradient(90deg, rgba(239, 68, 68, 0.06) 0%, rgba(0,0,0,0) 100%);
  border-bottom: 2px solid var(--danger);
}
.line-theme-hematology .column-badge {
  color: var(--danger);
}

.line-theme-coagulation {
  background: linear-gradient(90deg, rgba(245, 158, 11, 0.06) 0%, rgba(0,0,0,0) 100%);
  border-bottom: 2px solid var(--warning);
}
.line-theme-coagulation .column-badge {
  color: var(--warning);
}

.line-theme-immuno {
  background: linear-gradient(90deg, rgba(27, 54, 93, 0.06) 0%, rgba(0,0,0,0) 100%);
  border-bottom: 2px solid var(--primary);
}
.line-theme-immuno .column-badge {
  color: var(--primary);
}

.line-theme-hplc {
  background: linear-gradient(90deg, rgba(79, 174, 90, 0.06) 0%, rgba(0,0,0,0) 100%);
  border-bottom: 2px solid var(--success);
}
.line-theme-hplc .column-badge {
  color: var(--success);
}

.line-theme-chemistry {
  background: linear-gradient(90deg, rgba(168, 85, 247, 0.06) 0%, rgba(0,0,0,0) 100%);
  border-bottom: 2px solid #a855f7;
}
.line-theme-chemistry .column-badge { color: #a855f7; }

.line-theme-gases {
  background: linear-gradient(90deg, rgba(14, 165, 233, 0.06) 0%, rgba(0,0,0,0) 100%);
  border-bottom: 2px solid #0ea5e9;
}
.line-theme-gases .column-badge { color: #0ea5e9; }

.line-theme-electrolytes {
  background: linear-gradient(90deg, rgba(234, 179, 8, 0.06) 0%, rgba(0,0,0,0) 100%);
  border-bottom: 2px solid #eab308;
}
.line-theme-electrolytes .column-badge { color: #eab308; }

.line-theme-urinalysis {
  background: linear-gradient(90deg, rgba(236, 72, 153, 0.06) 0%, rgba(0,0,0,0) 100%);
  border-bottom: 2px solid #ec4899;
}
.line-theme-urinalysis .column-badge { color: #ec4899; }

.column-body {
  padding: 20px;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-section {
  border-bottom: 1px dashed var(--border-color);
  padding-bottom: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.form-section:last-of-type {
  border-bottom: none;
  padding-bottom: 0;
}

.form-section h4 {
  font-size: 0.85rem;
  font-weight: 700;
  text-transform: uppercase;
  color: var(--primary);
  letter-spacing: 0.5px;
  margin-bottom: 4px;
}

.specs-mini-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  background-color: rgba(27, 54, 93, 0.03);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 8px 12px;
  font-size: 0.8rem;
  gap: 6px;
}

.specs-mini-grid .label {
  color: var(--text-muted);
}

.specs-mini-grid .value {
  color: var(--text-main);
  font-weight: 600;
}

/* Switch toggles styling */
.accessories-toggles {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 4px;
}

.toggle-item {
  display: flex;
  align-items: center;
  gap: 10px;
}

.toggle-switch {
  position: relative;
  display: inline-block;
  width: 36px;
  height: 20px;
  flex-shrink: 0;
}

.toggle-switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #cbd5e1;
  transition: .2s;
  border-radius: 20px;
}

.slider:before {
  position: absolute;
  content: "";
  height: 14px;
  width: 14px;
  left: 3px;
  bottom: 3px;
  background-color: white;
  transition: .2s;
  border-radius: 50%;
}

input:checked + .slider {
  background-color: var(--success); /* Green toggle for positive indication */
}

input:checked + .slider:before {
  transform: translateX(16px);
}

.toggle-label {
  font-size: 0.8rem;
  color: var(--text-main);
  user-select: none;
}

.volumetrics-summary {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  background-color: rgba(27, 54, 93, 0.03);
  border: 1px solid var(--border-color);
  border-radius: 10px;
  padding: 10px;
  text-align: center;
  gap: 6px;
}

.vol-metric {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.vol-metric:not(:last-child) {
  border-right: 1px solid var(--border-color);
}

.vol-metric .val {
  font-size: 0.95rem;
  font-weight: 700;
  color: var(--text-main);
}

.vol-metric .lbl {
  font-size: 0.65rem;
  color: var(--text-muted);
  text-transform: uppercase;
  margin-top: 2px;
}

.pricing-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

/* Landed Cost Details Styling */
.landed-cost-box {
  background: rgba(27, 54, 93, 0.03);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 12px;
}

.cost-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.cost-desc h5 {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--text-main);
}

.cost-desc span {
  font-size: 0.7rem;
  color: var(--text-muted);
}

.cost-values {
  display: flex;
  flex-direction: column;
  text-align: right;
}

.cost-values strong {
  font-size: 1.05rem;
  font-weight: 700;
}

.cost-values small {
  font-size: 0.7rem;
  color: var(--text-muted);
}

.mt-2 { margin-top: 8px; }

/* Amortization box */
.amortization-card {
  background: linear-gradient(135deg, rgba(27, 54, 93, 0.06) 0%, rgba(79, 174, 90, 0.04) 100%);
  border: 1px solid rgba(27, 54, 93, 0.12);
  border-radius: 12px;
  padding: 14px;
}

.fee-display {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  margin-bottom: 10px;
}

.fee-lbl {
  font-size: 0.75rem;
  color: var(--primary);
  text-transform: uppercase;
  font-weight: 600;
  letter-spacing: 0.5px;
}

.fee-val {
  font-size: 1.5rem;
  font-weight: 800;
  color: var(--primary);
  margin-top: 2px;
}

.fee-prorrateo {
  display: flex;
  justify-content: space-between;
  font-size: 0.75rem;
  color: var(--text-muted);
  border-top: 1px solid rgba(0,0,0,0.06);
  padding-top: 8px;
}

/* Profit and Loss Card and Indicators */
.pl-card {
  border-radius: 12px;
  padding: 16px;
  border-left: 4px solid #cbd5e1;
  display: flex;
  flex-direction: column;
  gap: 10px;
  transition: all 0.2s ease;
}

.pl-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.85rem;
  color: var(--text-muted);
}

.pl-val {
  display: flex;
  align-items: center;
  gap: 8px;
}

.pl-item strong {
  color: var(--text-main);
  font-size: 0.95rem;
}

.percent-badge {
  font-size: 0.75rem;
  font-weight: 700;
  padding: 2px 6px;
  border-radius: 4px;
  background-color: rgba(15, 23, 42, 0.05);
  color: var(--text-main);
}

.pl-item .highlight-lbl {
  font-weight: 700;
  color: var(--text-main);
  font-size: 0.9rem;
}

.pl-item .highlight-val {
  font-size: 1.15rem;
  font-weight: 800;
}

.border-top {
  border-top: 1px solid rgba(0,0,0,0.08);
}

.pl-warning-indicator {
  display: flex;
  flex-direction: column;
  font-size: 0.75rem;
  background-color: rgba(15, 23, 42, 0.03);
  padding: 8px 10px;
  border-radius: 6px;
}

.pl-warning-indicator .lbl {
  color: var(--text-muted);
}

.pl-warning-indicator .val {
  color: var(--text-main);
  font-size: 0.85rem;
  margin-top: 2px;
}

/* Commercial Margin Color Alerts */
.pl-profitable {
  background-color: rgba(79, 174, 90, 0.08);
  border-left: 4px solid var(--success);
  border-top: 1px solid rgba(79, 174, 90, 0.15);
  border-right: 1px solid rgba(79, 174, 90, 0.15);
  border-bottom: 1px solid rgba(79, 174, 90, 0.15);
}
.pl-profitable .highlight-val, .pl-profitable .net-badge {
  color: #2e7d32;
}
.pl-profitable .net-badge {
  background-color: rgba(79, 174, 90, 0.16);
}

.pl-warning {
  background-color: rgba(245, 158, 11, 0.06);
  border-left: 4px solid var(--warning);
  border-top: 1px solid rgba(245, 158, 11, 0.12);
  border-right: 1px solid rgba(245, 158, 11, 0.12);
  border-bottom: 1px solid rgba(245, 158, 11, 0.12);
}
.pl-warning .highlight-val, .pl-warning .net-badge {
  color: #b45309;
}
.pl-warning .net-badge {
  background-color: rgba(245, 158, 11, 0.15);
}

.pl-danger {
  background-color: rgba(239, 68, 68, 0.06);
  border-left: 4px solid var(--danger);
  border-top: 1px solid rgba(239, 68, 68, 0.12);
  border-right: 1px solid rgba(239, 68, 68, 0.12);
  border-bottom: 1px solid rgba(239, 68, 68, 0.12);
}
.pl-danger .highlight-val, .pl-danger .net-badge {
  color: #c2410c;
}
.pl-danger .net-badge {
  background-color: rgba(239, 68, 68, 0.15);
}

/* Empty State Styling */
.column-empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 60px 20px;
  background-color: rgba(15, 23, 42, 0.01);
  border: 1px dashed rgba(15, 23, 42, 0.15);
  border-radius: 12px;
  flex-grow: 1;
}

.empty-icon {
  font-size: 2.5rem;
  margin-bottom: 16px;
  opacity: 0.5;
}

.column-empty-state h5 {
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--text-main);
  margin-bottom: 6px;
}

.column-empty-state p {
  font-size: 0.8rem;
  color: var(--text-muted);
}

/* Toast Notifications */
.toast {
  position: fixed;
  bottom: 24px;
  right: 24px;
  background-color: var(--primary);
  border: 1px solid var(--border-color);
  padding: 12px 24px;
  border-radius: 8px;
  box-shadow: 0 10px 25px rgba(0,0,0,0.15);
  color: #fff;
  z-index: 1000;
  font-size: 0.9rem;
  font-weight: 500;
  animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.toast-success {
  border-left: 4px solid var(--success);
  background-color: var(--primary);
}
.toast-warning {
  border-left: 4px solid var(--warning);
  background-color: var(--primary);
}
.toast-danger {
  border-left: 4px solid var(--danger);
  background-color: var(--primary);
}
.toast-info {
  border-left: 4px solid #60a5fa;
  background-color: var(--primary);
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-5px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes slideUp {
  from { transform: translateY(20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

/* Excel Table Calculator Styling */
.excel-card-top-bar {
  background-color: #dcfce7;
  text-align: center;
  padding: 10px 14px;
  border-bottom: 2px solid #bbf7d0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.excel-title {
  font-size: 1.1rem;
  font-weight: 800;
  color: #166534;
  letter-spacing: 1px;
}

.btn-reset-excel {
  background: transparent;
  border: none;
  font-size: 1.3rem;
  color: #166534;
  cursor: pointer;
  font-weight: bold;
}

.excel-form-top {
  background-color: #f1f5f9;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  border-bottom: 1px solid #e2e8f0;
}

.excel-form-row {
  display: grid;
  grid-template-columns: 75px 1fr 85px 1fr;
  align-items: center;
  gap: 8px;
  font-size: 0.85rem;
}

.excel-label {
  font-weight: 700;
  color: #475569;
}

.excel-select, .excel-input {
  background-color: #ffffff;
  border: 1px solid #cbd5e1;
  border-radius: 4px;
  padding: 6px 10px;
  font-size: 0.88rem;
  width: 100%;
  outline: none;
}

.excel-select:focus, .excel-input:focus {
  border-color: var(--primary);
  box-shadow: 0 0 0 2px rgba(27, 54, 93, 0.12);
}

.underline-select {
  border-bottom: 2px solid var(--primary);
}

.col-span-3 {
  grid-column: span 3;
}

.excel-table-wrapper {
  margin-top: 12px;
  border-radius: 4px;
  overflow: hidden;
  border: 1px solid #94a3b8;
}

.excel-breakdown-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.83rem;
}

.excel-breakdown-table th {
  background-color: #8b1d1d;
  color: #ffffff;
  padding: 8px 10px;
  font-weight: 700;
  border-right: 1px solid #a53232;
}

.excel-breakdown-table td {
  padding: 7px 10px;
  border-bottom: 1px solid #e2e8f0;
  color: #1e293b;
}

.excel-breakdown-table tbody tr:nth-child(even) {
  background-color: #f8fafc;
}

.dark-red-total-row td {
  background-color: #8b1d1d;
  color: #ffffff;
  border: none;
  padding: 10px;
}

.excel-options-section {
  background-color: #f1f5f9;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 12px;
  border-radius: 4px;
  font-size: 0.85rem;
}

.excel-option-row {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.excel-option-row .lbl {
  font-weight: 600;
  color: #334155;
}

.excel-mini-select {
  background-color: #ffffff;
  border: 1px solid #cbd5e1;
  border-radius: 4px;
  padding: 4px 8px;
  font-size: 0.85rem;
  outline: none;
}

.excel-val-input-box {
  display: flex;
  align-items: center;
  background-color: #ffffff;
  border: 1px solid #cbd5e1;
  border-radius: 4px;
  padding: 0 8px;
}

.excel-mini-input {
  border: none;
  outline: none;
  padding: 4px 6px;
  width: 90px;
  font-size: 0.85rem;
}

.dark-red-amortization-bar {
  background-color: #8b1d1d;
  color: #ffffff;
  padding: 12px 18px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 800;
  font-size: 1.05rem;
  margin-top: 12px;
  border-radius: 4px;
  box-shadow: 0 2px 6px rgba(139, 29, 29, 0.25);
}

.dark-red-amortization-bar .val-box {
  display: flex;
  align-items: center;
  gap: 8px;
}

.dark-red-amortization-bar .check-icon {
  color: #22c55e;
  font-size: 1.3rem;
  font-weight: 900;
}

.excel-volumetrics-card {
  display: grid;
  grid-template-columns: 1.3fr 1fr;
  gap: 16px;
  padding: 14px;
  background-color: #ffffff;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  margin-top: 12px;
  align-items: center;
}

.vol-item-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.vol-lbl {
  font-size: 0.85rem;
  font-weight: 600;
  color: #475569;
}

.vol-input, .vol-box-val {
  background-color: #f8fafc;
  border: 1px solid #cbd5e1;
  border-radius: 4px;
  padding: 4px 8px;
  font-size: 0.9rem;
  width: 100px;
  text-align: center;
}

.vol-title-lbl {
  font-size: 0.85rem;
  font-weight: 700;
  color: #475569;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* Workspace Nav Tabs & Expandable Layout */
.workspace-header-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  flex-wrap: wrap;
  gap: 12px;
}

.workspace-header-text h2 {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--primary);
}

.workspace-header-text p {
  font-size: 0.85rem;
  color: var(--text-muted);
}

.workspace-tabs-nav {
  display: flex;
  align-items: center;
  gap: 6px;
  background-color: #e2e8f0;
  padding: 4px;
  border-radius: 8px;
}

.tab-nav-btn {
  background: transparent;
  border: none;
  padding: 8px 14px;
  border-radius: 6px;
  font-size: 0.82rem;
  font-weight: 700;
  color: #475569;
  cursor: pointer;
  transition: all 0.2s ease;
}

.tab-nav-btn:hover {
  color: var(--primary);
}

.tab-nav-btn.active {
  background-color: #ffffff;
  color: var(--primary);
  box-shadow: 0 2px 4px rgba(0,0,0,0.08);
}

.tab-nav-btn-alt.active {
  background-color: var(--primary);
  color: #ffffff;
}

.single-col-expanded {
  grid-template-columns: 1fr !important;
}

/* Interactive Editable Table Styling */
.table-editable-input {
  background-color: #ffffff;
  border: 1px solid #cbd5e1;
  border-radius: 4px;
  padding: 6px 10px;
  font-size: 0.88rem;
  width: 100%;
  color: var(--text-main);
  outline: none;
  transition: border-color 0.2s ease;
}

.table-editable-input:focus {
  border-color: var(--primary);
  box-shadow: 0 0 0 2px rgba(27, 54, 93, 0.15);
}

.table-money-input {
  display: flex;
  align-items: center;
  background-color: #ffffff;
  border: 1px solid #cbd5e1;
  border-radius: 4px;
  padding: 0 8px;
}

.table-money-input .currency-prefix {
  font-weight: 700;
  color: var(--text-muted);
  font-size: 0.9rem;
}

.table-money-input .table-editable-input {
  border: none;
  box-shadow: none;
}

.btn-delete-row {
  background-color: #fee2e2;
  color: #dc2626;
  border: 1px solid #fca5a5;
  border-radius: 4px;
  width: 30px;
  height: 30px;
  font-size: 0.9rem;
  font-weight: bold;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.btn-delete-row:hover {
  background-color: #dc2626;
  color: #ffffff;
}

.table-add-bar {
  background-color: #f8fafc;
  padding: 8px 12px;
  border-top: 1px solid #cbd5e1;
  text-align: left;
}

.btn-add-item {
  background-color: #ffffff;
  color: var(--primary);
  border: 1px dashed var(--primary);
  border-radius: 6px;
  padding: 6px 14px;
  font-size: 0.85rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-add-item:hover {
  background-color: rgba(27, 54, 93, 0.05);
  border-style: solid;
}
</style>
