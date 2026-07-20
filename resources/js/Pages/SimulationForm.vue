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
              <label>Periodo Amortizacion Equipos (Meses)</label>
              <input type="number" v-model.number="globalSettings.amortization_months" class="form-input text-success font-semibold" min="1" max="120" />
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
              <label>Indice de Importación</label>
              <input type="number" v-model.number="globalSettings.import_index" class="form-input text-danger font-semibold" min="1.0" max="3.0" step="0.01" />
            </div>
            <div class="form-group">
              <label>Prueba Reportada</label>
              <select v-model="globalSettings.reported_test" class="form-input text-danger font-semibold">
                <option value="No">No</option>
                <option value="Sí">Sí</option>
              </select>
            </div>
          </div>
        </section>

        <!-- Equipment Columns Comparison Workspace -->
        <section class="workspace-section">
          <div class="workspace-header">
            <h2>Comparación Horizontal de Propuestas</h2>
            <p>Configura hasta 3 equipos en paralelo para comparar costes y utilidades comerciales.</p>
          </div>

          <div class="columns-grid">
            <!-- Equipment Cards (1 to 3) -->
            <div v-for="colIndex in [0, 1, 2]" :key="colIndex" class="card equipment-column-card">
              <div class="column-header" :class="'line-theme-' + getLineClass(equipmentConfigs[colIndex].equipment_id)">
                <div class="col-title">
                  <span class="column-badge">PROPUESTA {{ colIndex + 1 }}</span>
                  <button 
                    v-if="equipmentConfigs[colIndex].equipment_id" 
                    @click="resetColumn(colIndex)" 
                    class="btn-reset" 
                    title="Limpiar propuesta"
                  >
                    ×
                  </button>
                </div>
              </div>

              <div class="column-body">
                <!-- Step 1: Equipment Selection -->
                <div class="form-section">
                  <h4>1. Selección de Equipo</h4>
                  <div class="form-group">
                    <label>Filtro por Línea Médica</label>
                    <select v-model="equipmentConfigs[colIndex].lineFilter" class="form-input">
                      <option value="">Todas las Líneas</option>
                      <option v-for="line in uniqueLines" :key="line" :value="line">{{ line }}</option>
                    </select>
                  </div>
                  
                  <div class="form-group">
                    <label>Equipo Médico</label>
                    <select 
                      v-model="equipmentConfigs[colIndex].equipment_id" 
                      @change="onEquipmentChange(colIndex)"
                      class="form-input selector-highlight"
                    >
                      <option :value="null">-- Seleccionar Equipo --</option>
                      <option 
                        v-for="eq in filteredEquipments(equipmentConfigs[colIndex].lineFilter)" 
                        :key="eq.id" 
                        :value="eq.id"
                      >
                        {{ eq.name }}
                      </option>
                    </select>
                  </div>

                  <div class="form-group" v-if="equipmentConfigs[colIndex].equipment_id">
                    <label>Cantidad de Equipos</label>
                    <input type="number" v-model.number="equipmentConfigs[colIndex].quantity" min="1" max="100" class="form-input" />
                  </div>
                </div>

                <!-- If equipment is selected, show details and calculations -->
                <div v-if="equipmentConfigs[colIndex].equipment_id" class="results-wrapper">
                  
                  <!-- Step 2: Accessories Toggle -->
                  <div class="form-section">
                    <h4>2. Accesorios y Software</h4>
                    <div class="specs-mini-grid">
                      <div><span class="label">FOB Base:</span> <span class="value">${{ formatMoney(getSelectedEquipment(equipmentConfigs[colIndex].equipment_id).fob) }}</span></div>
                      <div><span class="label">Línea:</span> <span class="value">{{ getSelectedEquipment(equipmentConfigs[colIndex].equipment_id).line }}</span></div>
                    </div>

                    <!-- Toggles list -->
                    <div class="accessories-toggles">
                      <div class="toggle-item" v-if="getSelectedEquipment(equipmentConfigs[colIndex].equipment_id).ups > 0">
                        <label class="toggle-switch">
                          <input type="checkbox" v-model="equipmentConfigs[colIndex].include_ups" />
                          <span class="slider"></span>
                        </label>
                        <span class="toggle-label">Incluir UPS (+${{ formatMoney(getSelectedEquipment(equipmentConfigs[colIndex].equipment_id).ups) }})</span>
                      </div>

                      <div class="toggle-item" v-if="getSelectedEquipment(equipmentConfigs[colIndex].equipment_id).pc > 0">
                        <label class="toggle-switch">
                          <input type="checkbox" v-model="equipmentConfigs[colIndex].include_pc" />
                          <span class="slider"></span>
                        </label>
                        <span class="toggle-label">Incluir PC (+${{ formatMoney(getSelectedEquipment(equipmentConfigs[colIndex].equipment_id).pc) }})</span>
                      </div>

                      <div class="toggle-item" v-if="getSelectedEquipment(equipmentConfigs[colIndex].equipment_id).impresora > 0">
                        <label class="toggle-switch">
                          <input type="checkbox" v-model="equipmentConfigs[colIndex].include_printer_base" />
                          <span class="slider"></span>
                        </label>
                        <span class="toggle-label">Incluir Impresora Base (+${{ formatMoney(getSelectedEquipment(equipmentConfigs[colIndex].equipment_id).impresora) }})</span>
                      </div>

                      <div class="toggle-item">
                        <label class="toggle-switch">
                          <input type="checkbox" v-model="equipmentConfigs[colIndex].include_zebra" />
                          <span class="slider"></span>
                        </label>
                        <span class="toggle-label">¿Necesita Impresora Zebra? (+$330.00 FOB)</span>
                      </div>

                      <div class="toggle-item">
                        <label class="toggle-switch">
                          <input type="checkbox" v-model="equipmentConfigs[colIndex].include_software" />
                          <span class="slider"></span>
                        </label>
                        <span class="toggle-label">¿Necesita Software?</span>
                      </div>
                      
                      <div class="form-group val-input-box" v-if="equipmentConfigs[colIndex].include_software">
                        <label>Valor de Licencia Software ($ FOB)</label>
                        <input type="number" v-model.number="equipmentConfigs[colIndex].software_value" class="form-input" min="0" />
                      </div>

                      <div class="toggle-item">
                        <label class="toggle-switch">
                          <input type="checkbox" v-model="equipmentConfigs[colIndex].include_syringes" />
                          <span class="slider"></span>
                        </label>
                        <span class="toggle-label">¿Necesita Jeringas (Gases/Electrolitos)? (+$150.00 FOB)</span>
                      </div>

                      <div class="toggle-item" v-if="getSelectedEquipment(equipmentConfigs[colIndex].equipment_id).control > 0">
                        <label class="toggle-switch">
                          <input type="checkbox" v-model="equipmentConfigs[colIndex].include_controls" />
                          <span class="slider"></span>
                        </label>
                        <span class="toggle-label">¿Incluir Controles/Calibrador? (+${{ formatMoney(Number(getSelectedEquipment(equipmentConfigs[colIndex].equipment_id).control) + Number(getSelectedEquipment(equipmentConfigs[colIndex].equipment_id).calibrador)) }} FOB)</span>
                      </div>
                    </div>
                  </div>

                  <!-- Step 3: Work Volume -->
                  <div class="form-section">
                    <h4>3. Volumetría & Ventas</h4>
                    <div class="form-group">
                      <label>Pruebas Diarias Promedio</label>
                      <input type="number" v-model.number="equipmentConfigs[colIndex].daily_tests" class="form-input" min="0" />
                    </div>

                    <div class="volumetrics-summary">
                      <div class="vol-metric">
                        <span class="val">{{ formatNumber(calculations[colIndex].volumetrics.monthly_tests) }}</span>
                        <span class="lbl">Pruebas / Mes</span>
                      </div>
                      <div class="vol-metric">
                        <span class="val">{{ formatNumber(calculations[colIndex].volumetrics.annual_tests) }}</span>
                        <span class="lbl">Pruebas / Año</span>
                      </div>
                      <div class="vol-metric">
                        <span class="val">{{ formatNumber(calculations[colIndex].volumetrics.total_tests) }}</span>
                        <span class="lbl">Pruebas Totales Contrato</span>
                      </div>
                    </div>

                    <div class="pricing-grid">
                      <div class="form-group">
                        <label>Precio Venta Prueba (PVP)</label>
                        <div class="input-with-prefix">
                          <span class="prefix">$</span>
                          <input type="number" v-model.number="equipmentConfigs[colIndex].pvp_per_test" class="form-input" min="0.01" step="0.01" />
                        </div>
                      </div>

                      <div class="form-group">
                        <label>Costo Reactivo Prueba</label>
                        <div class="input-with-prefix">
                          <span class="prefix">$</span>
                          <input type="number" v-model.number="equipmentConfigs[colIndex].reagent_cost_per_test" class="form-input" min="0" step="0.01" />
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Step 4: Cost Analysis -->
                  <div class="form-section">
                    <h4>4. Análisis de Costo de Importación</h4>
                    
                    <div class="landed-cost-box">
                      <div class="cost-item">
                        <div class="cost-desc">
                          <h5>Landed Teórico</h5>
                          <span>FOB config. × Índice</span>
                        </div>
                        <div class="cost-values">
                          <strong class="text-primary">${{ formatMoney(calculations[colIndex].landed_teorico_total) }}</strong>
                          <small>Unit: ${{ formatMoney(calculations[colIndex].landed_teorico_unit) }}</small>
                        </div>
                      </div>

                      <div class="cost-item mt-2">
                        <div class="cost-desc">
                          <h5>Landed Real</h5>
                          <span>FOB maestro base × Índice</span>
                        </div>
                        <div class="cost-values text-muted">
                          <strong>${{ formatMoney(calculations[colIndex].landed_real_total) }}</strong>
                          <small>Unit: ${{ formatMoney(calculations[colIndex].landed_real_unit) }}</small>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Step 5: Financial Amortization -->
                  <div class="form-section">
                    <h4>5. Financiamiento & Cuota Mensual</h4>
                    
                    <div class="amortization-card">
                      <div class="fee-display">
                        <span class="fee-lbl">Cuota de Amortización Mensual</span>
                        <strong class="fee-val">${{ formatMoney(calculations[colIndex].monthly_amortization) }}</strong>
                      </div>
                      
                      <div class="fee-prorrateo">
                        <span>Prorrateo de Amortización por Prueba:</span>
                        <strong>${{ formatMoney(calculations[colIndex].cost_per_test) }}</strong>
                      </div>
                    </div>
                  </div>

                  <!-- Step 6: P&L Card -->
                  <div class="form-section">
                    <h4>6. Resumen de P&L (Margen de Contrato)</h4>

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

        // Custom accessories pricing
        const upsCost = cfg.include_ups ? Number(eq.ups) : 0;
        const pcCost = cfg.include_pc ? Number(eq.pc) : 0;
        const printerBaseCost = cfg.include_printer_base ? Number(eq.impresora) : 0;
        const zebraCost = cfg.include_zebra ? 330 : 0;
        const softwareCost = cfg.include_software ? Number(cfg.software_value) : 0;
        const syringesCost = cfg.include_syringes ? 150 : 0;
        const controlCost = cfg.include_controls ? Number(eq.control) : 0;
        const calibratorCost = cfg.include_controls ? Number(eq.calibrador) : 0;

        const importIndex = Number(this.globalSettings.import_index) || 1.15;

        // Landed Teórico: selected equipment + selected accessories
        const fobTotalSelected = Number(eq.fob) + upsCost + pcCost + printerBaseCost + zebraCost + softwareCost + syringesCost + controlCost + calibratorCost;
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
        quantity: 1,
        include_ups: true,
        include_pc: true,
        include_printer_base: true,
        include_zebra: false,
        include_software: false,
        software_value: 2000,
        include_syringes: false,
        include_controls: false,
        daily_tests: 0,
        pvp_per_test: 1.10,
        reagent_cost_per_test: 0.35
      };
    },
    getEmptyCalculation() {
      return {
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
      
      // Auto-set accessory defaults based on master database availability
      config.include_ups = eq.ups > 0;
      config.include_pc = eq.pc > 0;
      config.include_printer_base = eq.impresora > 0;
      config.include_controls = eq.control > 0;
      
      // Auto-set default reagent cost
      config.reagent_cost_per_test = Number(eq.default_reagent_cost) || 0.35;
      
      // Reset some toggles
      config.include_zebra = false;
      config.include_software = false;
      config.software_value = 2000;
      config.include_syringes = false;

      // Provide standard daily tests depending on equipment size to make it quick
      if (eq.line === 'Inmunoensayo') {
        config.daily_tests = 50;
      } else if (eq.line === 'Hematología') {
        config.daily_tests = 30;
      } else {
        config.daily_tests = 20;
      }
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
  grid-template-columns: repeat(7, 1fr);
  gap: 14px;
}

@media (max-width: 1400px) {
  .settings-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

@media (max-width: 900px) {
  .settings-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 600px) {
  .settings-grid {
    grid-template-columns: 1fr;
  }
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
</style>
