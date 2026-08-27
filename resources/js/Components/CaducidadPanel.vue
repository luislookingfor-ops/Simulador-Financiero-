<template>
  <div class="pcz-root" @click="closeAllMs">
    
    <!-- ===== HEADER ===== -->
    <div class="pcz-header">
      <div>
        <div class="pcz-title-row">
          <div class="pcz-logo">
            <i class="ti ti-flask"></i>
          </div>
          <h1>Panel de caducidad · Insumos y equipos de laboratorio</h1>
        </div>
        <p class="pcz-subtitle">Control de vencimiento, rotación y valor en riesgo · INGELAB S.A.S y JORGE ESTRELLA</p>
      </div>
      <div class="pcz-corte-badge">
        Corte de análisis <span class="pcz-num font-bold">{{ fechaCorte }}</span>
      </div>
    </div>

    <!-- ===== ESTADO DE CONEXION / CONTROL DE APIS ===== -->
    <div class="pcz-api-control">
      <i class="ti ti-cloud-download text-primary" style="font-size: 1.25rem;"></i>
      <span class="pcz-api-status-label">Conexión con APIs de Catalyst Serverless (Empresas 047 y 079)</span>
      
      <button @click.stop="fetchData" :disabled="loading" class="pcz-btn pcz-btn-fetch">
        <template v-if="loading">Cargando...</template>
        <template v-else>Actualizar Datos</template>
      </button>

      <span v-if="lastUpdated" class="pcz-last-update pcz-num">Última actualización: {{ lastUpdated }}</span>
    </div>

    <div v-if="error" class="pcz-error-alert">
      <strong>Error:</strong> {{ error }}
    </div>

    <!-- ===== FILTROS ===== -->
    <div class="pcz-filters-bar" @click.stop>
      <i class="ti ti-filter pcz-filter-icon"></i>

      <!-- Empresa -->
      <div class="ms" :class="{ open: msOpen.empresa }">
        <button type="button" @click="toggleMs('empresa')" class="ms-btn" :class="{ 'has-selection': filterEmpresas.length > 0 }">
          <span>{{ filterEmpresas.length === 0 ? 'Todas las empresas' : (filterEmpresas.length === 1 ? filterEmpresas[0] : filterEmpresas.length + ' seleccionadas') }}</span> ▾
        </button>
        <div class="ms-panel" :class="{ open: msOpen.empresa }">
          <label v-for="opt in empresasOptions" :key="opt" class="ms-opt">
            <input type="checkbox" :value="opt" v-model="filterEmpresas">
            {{ opt }}
          </label>
          <div v-if="empresasOptions.length === 0" class="ms-empty">Sin opciones</div>
          <button v-if="filterEmpresas.length > 0" @click="filterEmpresas = []" class="ms-clear">Limpiar</button>
        </div>
      </div>

      <!-- Bodega -->
      <div class="ms" :class="{ open: msOpen.bodega }">
        <button type="button" @click="toggleMs('bodega')" class="ms-btn" :class="{ 'has-selection': filterBodegas.length > 0 }">
          <span>{{ filterBodegas.length === 0 ? 'Todas las bodegas' : (filterBodegas.length === 1 ? filterBodegas[0] : filterBodegas.length + ' seleccionadas') }}</span> ▾
        </button>
        <div class="ms-panel" :class="{ open: msOpen.bodega }">
          <label v-for="opt in bodegasOptions" :key="opt" class="ms-opt">
            <input type="checkbox" :value="opt" v-model="filterBodegas">
            {{ opt }}
          </label>
          <div v-if="bodegasOptions.length === 0" class="ms-empty">Sin opciones</div>
          <button v-if="filterBodegas.length > 0" @click="filterBodegas = []" class="ms-clear">Limpiar</button>
        </div>
      </div>

      <!-- Marca -->
      <div class="ms" :class="{ open: msOpen.marca }">
        <button type="button" @click="toggleMs('marca')" class="ms-btn" :class="{ 'has-selection': filterMarcas.length > 0 }">
          <span>{{ filterMarcas.length === 0 ? 'Todas las marcas' : (filterMarcas.length === 1 ? filterMarcas[0] : filterMarcas.length + ' seleccionadas') }}</span> ▾
        </button>
        <div class="ms-panel" :class="{ open: msOpen.marca }">
          <label v-for="opt in marcasOptions" :key="opt" class="ms-opt">
            <input type="checkbox" :value="opt" v-model="filterMarcas">
            {{ opt }}
          </label>
          <div v-if="marcasOptions.length === 0" class="ms-empty">Sin opciones</div>
          <button v-if="filterMarcas.length > 0" @click="filterMarcas = []" class="ms-clear">Limpiar</button>
        </div>
      </div>

      <!-- Rango de Riesgo -->
      <div class="ms" :class="{ open: msOpen.riesgo }">
        <button type="button" @click="toggleMs('riesgo')" class="ms-btn" :class="{ 'has-selection': filterRiesgos.length > 0 }">
          <span>{{ filterRiesgos.length === 0 ? 'Todos los rangos' : (filterRiesgos.length === 1 ? getZonaLabel(filterRiesgos[0]) : filterRiesgos.length + ' seleccionados') }}</span> ▾
        </button>
        <div class="ms-panel" :class="{ open: msOpen.riesgo }">
          <label v-for="opt in riesgosOptions" :key="opt.value" class="ms-opt">
            <input type="checkbox" :value="opt.value" v-model="filterRiesgos">
            {{ opt.label }}
          </label>
          <button v-if="filterRiesgos.length > 0" @click="filterRiesgos = []" class="ms-clear">Limpiar</button>
        </div>
      </div>

      <!-- Mes -->
      <div class="ms" :class="{ open: msOpen.mes }">
        <button type="button" @click="toggleMs('mes')" class="ms-btn" :class="{ 'has-selection': filterMeses.length > 0 }">
          <span>{{ filterMeses.length === 0 ? 'Todos los meses' : (filterMeses.length === 1 ? formatMesAno(filterMeses[0]) : filterMeses.length + ' seleccionados') }}</span> ▾
        </button>
        <div class="ms-panel" :class="{ open: msOpen.mes }">
          <label v-for="opt in mesesOptions" :key="opt" class="ms-opt">
            <input type="checkbox" :value="opt" v-model="filterMeses">
            {{ formatMesAno(opt) }}
          </label>
          <div v-if="mesesOptions.length === 0" class="ms-empty">Sin opciones</div>
          <button v-if="filterMeses.length > 0" @click="filterMeses = []" class="ms-clear">Limpiar</button>
        </div>
      </div>

      <input 
        type="text" 
        v-model="searchQuery" 
        placeholder="Buscar código, descripción o lote..." 
        class="pcz-search-input"
      />
      <button @click="resetFilters" class="pcz-btn-reset">Limpiar filtros</button>
    </div>

    <!-- ===== KPIs ===== -->
    <div class="pcz-kpis-grid">
      <div class="pcz-kpi-card" v-for="kpi in kpis" :key="kpi.label">
        <div class="pcz-kpi-label">{{ kpi.label }}</div>
        <div class="pcz-kpi-value pcz-num" :style="{ color: kpi.color }">{{ kpi.value }}</div>
        <div class="pcz-kpi-sub">{{ kpi.sub }}</div>
      </div>
    </div>

    <!-- ===== CHARTS ===== -->
    <div class="pcz-charts-grid">
      <div class="pcz-chart-box">
        <h3>Distribución de valor en riesgo por rango de vencimiento</h3>
        <p class="pcz-chart-desc">Costo de unidades sin vender agrupado por urgencia</p>
        <div class="pcz-chart-container">
          <canvas ref="chartBandas"></canvas>
        </div>
      </div>
      
      <div class="pcz-chart-box">
        <h3>Valor en riesgo por marca</h3>
        <p class="pcz-chart-desc">Participación sobre el total filtrado</p>
        <div class="pcz-legend-container">
          <span v-for="(item, idx) in marcaChartLegend" :key="item.label" class="pcz-legend-item">
            <span class="pcz-legend-dot" :style="{ backgroundColor: item.color }"></span>
            {{ item.label }} {{ item.pct }}
          </span>
        </div>
        <div class="pcz-chart-container doughnut">
          <canvas ref="chartMarca"></canvas>
        </div>
      </div>
    </div>

    <!-- ===== ÍNDICE DE ROTACIÓN ===== -->
    <div class="pcz-section-card">
      <h3>Índice de rotación por marca</h3>
      <p class="pcz-chart-desc">Unidades gestionadas sobre el stock próximo a vencer</p>
      
      <div class="pcz-rotation-list">
        <div v-for="item in rotacionList" :key="item.marca" class="pcz-rotation-row">
          <span class="pcz-rotation-name">{{ item.marca }}</span>
          <div class="pcz-rotation-bar-bg">
            <div class="pcz-rotation-bar" :style="{ width: item.pctBar + '%', backgroundColor: item.color }"></div>
          </div>
          <span class="pcz-rotation-val pcz-num">{{ item.vendido }}/{{ item.stock }} · {{ item.pct }}%</span>
        </div>
        <div v-if="rotacionList.length === 0" class="pcz-empty-text">Sin datos para el filtro actual.</div>
      </div>
    </div>

    <!-- ===== DETALLE TABLA ===== -->
    <div class="pcz-section-card">
      <div class="pcz-table-header">
        <h3>Detalle de productos por caducar</h3>
        <span class="pcz-table-count pcz-num">{{ sortedRows.length }} de {{ rawData.length }} lotes</span>
      </div>
      
      <div class="pcz-table-wrapper">
        <table class="pcz-table">
          <thead>
            <tr>
              <th>Empresa</th>
              <th>Código</th>
              <th>Descripción</th>
              <th>Marca</th>
              <th>Bodega</th>
              <th>Lote / Ref</th>
              <th>Vence</th>
              <th style="width: 170px;">Días para caducar</th>
              <th class="text-right">Costo unit.</th>
              <th class="text-right">Stock</th>
              <th class="text-right">Stock actual</th>
              <th class="text-right">Valor en riesgo</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="d in sortedRows" :key="d.codigo + d.lote + d.empresa">
              <td>
                <span class="pcz-badge" :class="d.empresa === 'INGELAB S.A.S' ? 'primary' : 'purple'">
                  {{ d.empresa }}
                </span>
              </td>
              <td class="pcz-num font-medium">{{ d.codigo }}</td>
              <td class="pcz-desc-cell font-medium">{{ d.desc }}</td>
              <td>{{ d.marca }}</td>
              <td>{{ d.bodega }}</td>
              <td class="pcz-num text-soft">{{ d.lote }}</td>
              <td class="pcz-num">{{ formatFecha(d.vence) }}</td>
              <td>
                <div class="pcz-dias-cell">
                  <div class="pcz-progress-bar-bg">
                    <div class="pcz-progress-bar" :style="{ width: getDiasPctBar(d.dias) + '%', backgroundColor: getZonaColor(d.zona) }"></div>
                  </div>
                  <span class="pcz-num text-soft pcz-dias-lbl">{{ getDiasLabel(d.dias) }}</span>
                </div>
              </td>
              <td class="pcz-num text-right">{{ fmtMoney(d.costo) }}</td>
              <td class="pcz-num text-right">{{ d.stock }}</td>
              <td class="pcz-num text-right font-semibold">{{ d.sinVender }}</td>
              <td class="pcz-num text-right font-semibold">{{ fmtMoney(d.valorRiesgo) }}</td>
              <td>
                <span class="pcz-badge-status" :style="{ backgroundColor: getZonaSoftColor(d.zona), color: getZonaTextColor(d.zona) }">
                  {{ getZonaLabel(d.zona) }}
                </span>
              </td>
            </tr>
            <tr v-if="sortedRows.length === 0">
              <td colspan="13" class="pcz-empty-table">No se encontraron lotes activos para los filtros elegidos.</td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <p class="pcz-table-note">
        Los datos se cargan dinámicamente desde las APIs de Catalyst. Se muestran únicamente los productos con inventario disponible o fecha de caducidad asignada.
      </p>
    </div>

  </div>
</template>

<script>
export default {
  name: 'CaducidadPanel',
  data() {
    return {
      loading: false,
      error: null,
      rawData: [],
      lastUpdated: null,
      searchQuery: '',
      filterEmpresas: [],
      filterBodegas: [],
      filterMarcas: [],
      filterRiesgos: [],
      filterMeses: [],
      msOpen: {
        empresa: false,
        bodega: false,
        marca: false,
        riesgo: false,
        mes: false
      },
      chartBandasInstance: null,
      chartMarcaInstance: null,
      fechaCorte: '',
      zones: {
        critical: { label: 'Crítico', max: 15, color: '#C43B45', soft: '#FBE4E5', text: '#8E232B' },
        warning: { label: 'Alto', max: 30, color: '#D98F2B', soft: '#FBEDD8', text: '#9C6415' },
        caution: { label: 'Medio', max: 60, color: '#3E7FB0', soft: '#E1EDF6', text: '#28587D' },
        safe: { label: 'Bajo', max: Infinity, color: '#3F9468', soft: '#E1F0E7', text: '#286B48' },
        sold: { label: 'Vendido', color: '#5B6B6E', soft: '#E7ECEC', text: '#3E4A4C' },
        unknown: { label: 'Fecha inválida', color: '#9B5DE5', soft: '#F1E6FB', text: '#6B3FA0' }
      },
      zoneOrder: ['critical', 'warning', 'caution', 'safe'],
      mesesEs: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
      marcaChartLegend: []
    };
  },
  computed: {
    empresasOptions() {
      return [...new Set(this.rawData.map(d => d.empresa))].sort();
    },
    bodegasOptions() {
      return [...new Set(this.rawData.map(d => d.bodega))].sort();
    },
    marcasOptions() {
      return [...new Set(this.rawData.map(d => d.marca))].sort();
    },
    riesgosOptions() {
      return this.zoneOrder.concat(['sold', 'unknown']).map(z => ({
        value: z,
        label: this.zones[z].label
      }));
    },
    mesesOptions() {
      return [...new Set(this.rawData.map(d => d.mesAno).filter(Boolean))].sort();
    },
    filteredRows() {
      const q = this.searchQuery.trim().toLowerCase();
      return this.rawData.filter(d => {
        if (this.filterEmpresas.length && !this.filterEmpresas.includes(d.empresa)) return false;
        if (this.filterBodegas.length && !this.filterBodegas.includes(d.bodega)) return false;
        if (this.filterMarcas.length && !this.filterMarcas.includes(d.marca)) return false;
        if (this.filterRiesgos.length && !this.filterRiesgos.includes(d.zona)) return false;
        if (this.filterMeses.length && !this.filterMeses.includes(d.mesAno)) return false;
        
        if (q) {
          const matchText = `${d.codigo} ${d.desc} ${d.lote}`.toLowerCase();
          if (!matchText.includes(q)) return false;
        }
        return true;
      });
    },
    sortedRows() {
      return this.filteredRows.slice().sort((a, b) => {
        const aTime = a.vence.getTime();
        const bTime = b.vence.getTime();
        if (isNaN(aTime)) return 1;
        if (isNaN(bTime)) return -1;
        return a.dias - b.dias;
      });
    },
    kpis() {
      const rows = this.filteredRows;
      const valorRiesgo = rows.reduce((s, d) => s + d.valorRiesgo, 0);
      const valorInicial = rows.reduce((s, d) => s + d.valorInicial, 0);
      const stockTotal = rows.reduce((s, d) => s + d.stock, 0);
      const stockActualTotal = rows.reduce((s, d) => s + d.sinVender, 0);
      const vendidoTotal = rows.reduce((s, d) => s + d.vendido, 0);
      const valorRecuperado = rows.reduce((s, d) => s + d.valorRecuperado, 0);
      const pctGestionado = stockTotal ? (vendidoTotal / stockTotal * 100) : 0;
      const criticos = rows.filter(d => d.zona === 'critical').length;

      return [
        { label: 'Valor en riesgo', value: this.fmtMoney(valorRiesgo), sub: 'costo de unidades sin vender', color: 'var(--primary-dark)' },
        { label: '% gestionado', value: this.fmtPct(pctGestionado), sub: `${vendidoTotal} de ${stockTotal} unidades`, color: 'var(--safe-text)' },
        { label: 'Valor recuperado', value: this.fmtMoney(valorRecuperado), sub: `sobre ${this.fmtMoney(valorInicial)} inicial`, color: 'var(--ink)' },
        { label: 'Stock actual total', value: stockActualTotal.toLocaleString('es-EC'), sub: 'unidades sin vender (stock − vendido)', color: 'var(--warning-text)' },
        { label: 'Ítems críticos', value: criticos, sub: '≤ 15 días para vencer', color: 'var(--critical-text)' },
        { label: 'SKUs monitoreados', value: rows.length, sub: 'lotes activos en el corte', color: 'var(--ink)' }
      ];
    },
    rotacionList() {
      const rows = this.filteredRows;
      const rotByMarca = {};
      rows.forEach(d => {
        if (!rotByMarca[d.marca]) rotByMarca[d.marca] = { stock: 0, vendido: 0 };
        rotByMarca[d.marca].stock += d.stock;
        rotByMarca[d.marca].vendido += d.vendido;
      });
      
      const rotKeys = Object.keys(rotByMarca).sort();
      return rotKeys.map(m => {
        const r = rotByMarca[m];
        const pct = r.stock ? (r.vendido / r.stock * 100) : 0;
        const color = pct >= 50 ? 'var(--safe)' : pct >= 20 ? 'var(--warning)' : 'var(--critical)';
        return {
          marca: m,
          stock: r.stock,
          vendido: r.vendido,
          pct: pct.toFixed(0),
          pctBar: Math.min(pct, 100),
          color: color
        };
      });
    }
  },
  watch: {
    filteredRows: {
      deep: true,
      handler() {
        this.$nextTick(() => {
          this.updateCharts();
        });
      }
    }
  },
  mounted() {
    const hoy = new Date();
    this.fechaCorte = `${String(hoy.getDate()).padStart(2, '0')}/${String(hoy.getMonth() + 1).padStart(2, '0')}/${hoy.getFullYear()}`;
    
    // Load Chart.js CDN dynamically if not present
    if (window.Chart) {
      this.fetchData();
    } else {
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.js';
      script.onload = () => {
        this.fetchData();
      };
      document.head.appendChild(script);
    }
  },
  beforeUnmount() {
    if (this.chartBandasInstance) this.chartBandasInstance.destroy();
    if (this.chartMarcaInstance) this.chartMarcaInstance.destroy();
  },
  methods: {
    toggleMs(type) {
      Object.keys(this.msOpen).forEach(k => {
        if (k !== type) this.msOpen[k] = false;
      });
      this.msOpen[type] = !this.msOpen[type];
    },
    closeAllMs() {
      Object.keys(this.msOpen).forEach(k => {
        this.msOpen[k] = false;
      });
    },
    resetFilters() {
      this.filterEmpresas = [];
      this.filterBodegas = [];
      this.filterMarcas = [];
      this.filterRiesgos = [];
      this.filterMeses = [];
      this.searchQuery = '';
    },
    getZonaLabel(zona) {
      return this.zones[zona]?.label || zona;
    },
    getZonaColor(zona) {
      return this.zones[zona]?.color || '#9B5DE5';
    },
    getZonaSoftColor(zona) {
      return this.zones[zona]?.soft || '#F1E6FB';
    },
    getZonaTextColor(zona) {
      return this.zones[zona]?.text || '#6B3FA0';
    },
    getDiasPctBar(dias) {
      if (isNaN(dias)) return 0;
      return Math.min(Math.max(dias, 0) / 90 * 100, 100);
    },
    getDiasLabel(dias) {
      return isNaN(dias) ? '—' : `${dias}d`;
    },
    formatFecha(date) {
      if (isNaN(date.getTime())) return '—';
      return `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`;
    },
    formatMesAno(val) {
      if (!val) return '';
      const parts = val.split('-');
      const mesNombre = this.mesesEs[parseInt(parts[1], 10) - 1];
      return `${mesNombre} ${parts[0]}`;
    },
    fmtMoney(v) {
      return '$' + v.toLocaleString('es-EC', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    },
    fmtPct(v) {
      return v.toFixed(1) + '%';
    },
    horaActual() {
      const a = new Date();
      return `${String(a.getHours()).padStart(2, '0')}:${String(a.getMinutes()).padStart(2, '0')}:${String(a.getSeconds()).padStart(2, '0')}`;
    },
    async fetchData() {
      this.loading = true;
      this.error = null;
      
      try {
        const [res1, res2] = await Promise.all([
          fetch('/api/catalyst-productos?pcod_empresa=047'),
          fetch('/api/catalyst-productos?pcod_empresa=079')
        ]);
        
        if (!res1.ok || !res2.ok) {
          throw new Error('Error al conectar con el servidor proxy de Catalyst API');
        }
        
        const data1 = await res1.json();
        const data2 = await res2.json();
        
        const rawMerged = [
          ...data1.map(item => this.mapItem(item, 'INGELAB S.A.S')),
          ...data2.map(item => this.mapItem(item, 'JORGE ESTRELLA'))
        ];
        
        // Filter out items with no stock and no expiry date to optimize rendering
        this.rawData = rawMerged.filter(d => d.stock > 0 || !isNaN(d.vence.getTime()));
        
        this.lastUpdated = this.horaActual();
        
        this.$nextTick(() => {
          this.updateCharts();
        });
      } catch (err) {
        console.error(err);
        this.error = err.message || 'No se pudo cargar la información del panel.';
      } finally {
        this.loading = false;
      }
    },
    mapItem(item, companyName) {
      const rawDate = item.fechaCaducaRegSanitario;
      let venceDate = new Date(NaN);
      
      if (rawDate) {
        // ISO: AAAA-MM-DD
        const iso = rawDate.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);
        if (iso) {
          venceDate = new Date(+iso[1], +iso[2] - 1, +iso[3]);
        } else {
          venceDate = new Date(rawDate);
        }
      }

      const costo = Number(item.precioCompra) || Number(item.costoPromedio) || 0;
      const stock = Number(item.saldoDisponible) || 0;
      
      const hoy = new Date();
      hoy.setHours(0, 0, 0, 0);
      const dias = Math.round((venceDate - hoy) / 86400000);

      let zona = 'safe';
      if (stock <= 0) {
        zona = 'sold';
      } else if (isNaN(dias)) {
        zona = 'unknown';
      } else {
        if (dias <= 15) {
          zona = 'critical';
        } else if (dias <= 30) {
          zona = 'warning';
        } else if (dias <= 60) {
          zona = 'caution';
        } else {
          zona = 'safe';
        }
      }

      return {
        empresa: companyName,
        codigo: item.codItem || '',
        desc: item.descripcion || '',
        marca: item.nombreTipo || item.codMarca || 'Sin marca',
        bodega: item.nombreSubGrupo || 'Sin bodega',
        lote: item.referencia || item.regSanitario || 'S/L',
        vencimiento: rawDate || '',
        vence: venceDate,
        dias: dias,
        costo: costo,
        stock: stock,
        vendido: 0,
        aumento: 0,
        sinVender: stock,
        inconsistente: false,
        valorRiesgo: Number((stock * costo).toFixed(2)),
        valorInicial: Number((stock * costo).toFixed(2)),
        valorRecuperado: 0,
        mesAno: isNaN(venceDate.getTime()) ? '' : `${venceDate.getFullYear()}-${String(venceDate.getMonth() + 1).padStart(2, '0')}`,
        zona: zona
      };
    },
    updateCharts() {
      if (!window.Chart) return;
      
      const rows = this.filteredRows;
      
      // 1. Bands Chart
      const bandCounts = { critical: 0, warning: 0, caution: 0, safe: 0 };
      const bandValues = { critical: 0, warning: 0, caution: 0, safe: 0 };
      rows.forEach(d => {
        if (bandCounts.hasOwnProperty(d.zona)) {
          bandCounts[d.zona]++;
          bandValues[d.zona] += d.valorRiesgo;
        }
      });
      
      const bandLabels = this.zoneOrder.map(z => `${this.zones[z].label} (${bandCounts[z]})`);
      const bandData = this.zoneOrder.map(z => Number(bandValues[z].toFixed(2)));
      const bandColors = this.zoneOrder.map(z => this.zones[z].color);
      
      if (this.chartBandasInstance) this.chartBandasInstance.destroy();
      
      const ctxBandas = this.$refs.chartBandas;
      if (ctxBandas) {
        this.chartBandasInstance = new window.Chart(ctxBandas, {
          type: 'bar',
          data: {
            labels: bandLabels,
            datasets: [{
              label: 'Valor en riesgo',
              data: bandData,
              backgroundColor: bandColors,
              borderRadius: 4,
              maxBarThickness: 56
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { display: false },
              tooltip: {
                callbacks: {
                  label: (ctx) => this.fmtMoney(ctx.raw)
                }
              }
            },
            scales: {
              y: {
                beginAtZero: true,
                grid: { color: '#E1E0D9' },
                ticks: {
                  callback: (v) => '$' + v
                }
              },
              x: { grid: { display: false } }
            }
          }
        });
      }
      
      // 2. Brands Chart
      const byMarca = {};
      rows.forEach(d => {
        byMarca[d.marca] = (byMarca[d.marca] || 0) + d.valorRiesgo;
      });
      
      const marcaLabels = Object.keys(byMarca);
      const marcaData = marcaLabels.map(m => Number(byMarca[m].toFixed(2)));
      const palette = ['#2a78d6', '#eb6834', '#1baf7a', '#eda100', '#e87ba4', '#008300', '#4a3aa7', '#e34948'];
      const marcaColors = marcaLabels.map((_, i) => palette[i % palette.length]);
      const totalMarca = marcaData.reduce((a, b) => a + b, 0) || 1;
      
      if (this.chartMarcaInstance) this.chartMarcaInstance.destroy();
      
      const ctxMarca = this.$refs.chartMarca;
      if (ctxMarca) {
        this.chartMarcaInstance = new window.Chart(ctxMarca, {
          type: 'doughnut',
          data: {
            labels: marcaLabels,
            datasets: [{
              data: marcaData,
              backgroundColor: marcaColors,
              borderColor: '#FFFFFF',
              borderWidth: 2
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '62%',
            plugins: {
              legend: { display: false },
              tooltip: {
                callbacks: {
                  label: (ctx) => `${ctx.label}: ${this.fmtMoney(ctx.raw)}`
                }
              }
            }
          }
        });
      }
      
      this.marcaChartLegend = marcaLabels.map((m, i) => {
        const pct = (marcaData[i] / totalMarca * 100).toFixed(0);
        return {
          label: m,
          color: marcaColors[i],
          pct: pct + '%'
        };
      });
    }
  }
};
</script>

<style scoped>
.pcz-root {
  --bg: #EEF3F3;
  --surface: #FFFFFF;
  --surface-soft: #F5F9F9;
  --ink: #132A2D;
  --ink-soft: #587277;
  --ink-faint: #8AA0A3;
  --primary: #0B5563;
  --primary-dark: #083E48;
  --primary-soft: #DCEEEF;
  --critical: #C43B45;
  --critical-soft: #FBE4E5;
  --critical-text: #8E232B;
  --warning: #D98F2B;
  --warning-soft: #FBEDD8;
  --warning-text: #9C6415;
  --caution: #3E7FB0;
  --caution-soft: #E1EDF6;
  --caution-text: #28587D;
  --safe: #3F9468;
  --safe-soft: #E1F0E7;
  --safe-text: #286B48;
  --line: #DCE6E7;
  
  font-family: 'Outfit', sans-serif;
  color: var(--ink);
  background: var(--bg);
  padding: 24px;
  border-radius: 16px;
  line-height: 1.4;
  margin-top: 10px;
}

.pcz-num {
  font-family: 'IBM Plex Mono', monospace;
  font-variant-numeric: tabular-nums;
}

.pcz-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  flex-wrap: wrap;
  gap: 16px;
  margin-bottom: 20px;
}

.pcz-title-row {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 6px;
}

.pcz-title-row h1 {
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--primary-dark);
  margin: 0;
}

.pcz-logo {
  width: 38px;
  height: 38px;
  border-radius: 10px;
  background: var(--primary);
  display: flex;
  align-items: center;
  justify-content: center;
}

.pcz-logo i {
  color: #fff;
  font-size: 1.3rem;
}

.pcz-subtitle {
  font-size: 13px;
  color: var(--ink-soft);
  margin: 0 0 0 50px;
}

.pcz-corte-badge {
  background: var(--primary-soft);
  border: 0.5px solid var(--primary);
  border-radius: 10px;
  padding: 8px 14px;
  font-size: 12px;
  color: var(--primary-dark);
}

.pcz-api-control {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  align-items: center;
  margin-bottom: 16px;
  background: var(--surface);
  border: 0.5px solid var(--primary);
  border-radius: 12px;
  padding: 12px 16px;
}

.pcz-api-status-label {
  font-size: 13px;
  color: var(--primary-dark);
  font-weight: 600;
}

.pcz-last-update {
  font-size: 12px;
  color: var(--safe-text);
  margin-left: auto;
  font-weight: 500;
}

.pcz-error-alert {
  background-color: var(--critical-soft);
  border: 0.5px solid var(--critical);
  color: var(--critical-text);
  padding: 12px 16px;
  border-radius: 10px;
  font-size: 13px;
  margin-bottom: 16px;
}

.pcz-btn {
  height: 34px;
  border-radius: 8px;
  border: 0.5px solid var(--primary);
  background: var(--primary);
  color: #fff;
  padding: 0 14px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.pcz-btn:hover {
  background: var(--primary-dark);
}

.pcz-btn:disabled {
  background: var(--ink-faint);
  border-color: var(--ink-faint);
  cursor: not-allowed;
}

.pcz-filters-bar {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  align-items: center;
  margin-bottom: 20px;
  background: var(--surface);
  border: 0.5px solid var(--line);
  border-radius: 12px;
  padding: 12px 14px;
}

.pcz-filter-icon {
  color: var(--ink-soft);
  font-size: 1.1rem;
}

.pcz-search-input {
  flex: 1;
  min-width: 180px;
  height: 34px;
  border-radius: 8px;
  border: 0.5px solid var(--line);
  padding: 0 12px;
  font-size: 13px;
  background: var(--surface-soft);
  color: var(--ink);
}

.pcz-search-input:focus {
  outline: none;
  border-color: var(--primary);
}

.pcz-btn-reset {
  height: 34px;
  border-radius: 8px;
  border: 0.5px solid var(--line);
  background: var(--surface);
  padding: 0 12px;
  font-size: 12px;
  color: var(--ink-soft);
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s ease;
}

.pcz-btn-reset:hover {
  border-color: var(--primary);
  color: var(--primary);
}

/* MultiSelect styling */
.ms {
  position: relative;
  display: inline-block;
}

.ms-btn {
  height: 34px;
  border-radius: 8px;
  border: 0.5px solid var(--line);
  padding: 0 12px;
  font-size: 13px;
  color: var(--ink);
  background: var(--surface-soft);
  cursor: pointer;
  white-space: nowrap;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.2s ease;
}

.ms-btn:hover {
  border-color: var(--primary);
}

.ms-btn.has-selection {
  border-color: var(--primary);
  background: var(--primary-soft);
  color: var(--primary-dark);
  font-weight: 500;
}

.ms-panel {
  display: none;
  position: absolute;
  top: calc(100% + 6px);
  left: 0;
  min-width: 220px;
  max-height: 260px;
  overflow-y: auto;
  background: var(--surface);
  border: 0.5px solid var(--line);
  border-radius: 10px;
  box-shadow: 0 8px 24px rgba(19,42,45,0.14);
  padding: 6px;
  z-index: 30;
}

.ms-panel.open {
  display: block;
}

.ms-opt {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 7px 8px;
  border-radius: 6px;
  font-size: 13px;
  color: var(--ink);
  cursor: pointer;
  white-space: nowrap;
}

.ms-opt:hover {
  background: var(--surface-soft);
}

.ms-opt input {
  cursor: pointer;
}

.ms-empty {
  padding: 8px;
  font-size: 12px;
  color: var(--ink-faint);
}

.ms-clear {
  display: block;
  width: 100%;
  text-align: left;
  padding: 7px 8px;
  font-size: 11px;
  color: var(--primary);
  background: none;
  border: none;
  border-top: 0.5px solid var(--line);
  margin-top: 4px;
  cursor: pointer;
  font-weight: 600;
}

.ms-clear:hover {
  color: var(--primary-dark);
}

/* KPIs Styling */
.pcz-kpis-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(170px, 1fr));
  gap: 12px;
  margin-bottom: 22px;
}

.pcz-kpi-card {
  background: var(--surface);
  border: 0.5px solid var(--line);
  border-radius: 12px;
  padding: 14px 16px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.02);
}

.pcz-kpi-label {
  font-size: 12px;
  color: var(--ink-soft);
  margin-bottom: 6px;
  font-weight: 500;
}

.pcz-kpi-value {
  font-size: 22px;
  font-weight: 600;
}

.pcz-kpi-sub {
  font-size: 11px;
  color: var(--ink-faint);
  margin-top: 2px;
}

/* Charts styling */
.pcz-charts-grid {
  display: grid;
  grid-template-columns: 1.3fr 1fr;
  gap: 14px;
  margin-bottom: 22px;
}

@media (max-width: 1024px) {
  .pcz-charts-grid {
    grid-template-columns: 1fr;
  }
}

.pcz-chart-box {
  background: var(--surface);
  border: 0.5px solid var(--line);
  border-radius: 12px;
  padding: 16px;
}

.pcz-chart-box h3 {
  font-size: 14px;
  color: var(--ink);
  margin-bottom: 4px;
  font-weight: 600;
}

.pcz-chart-desc {
  font-size: 11px;
  color: var(--ink-faint);
  margin: 0 0 10px;
}

.pcz-chart-container {
  position: relative;
  height: 230px;
}

.pcz-chart-container.doughnut {
  height: 190px;
}

.pcz-legend-container {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 8px;
  font-size: 11px;
  color: var(--ink-soft);
}

.pcz-legend-item {
  display: flex;
  align-items: center;
  gap: 4px;
}

.pcz-legend-dot {
  width: 9px;
  height: 9px;
  border-radius: 2px;
  display: inline-block;
}

/* Rotation section */
.pcz-section-card {
  background: var(--surface);
  border: 0.5px solid var(--line);
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 22px;
}

.pcz-section-card h3 {
  font-size: 14px;
  color: var(--ink);
  margin-bottom: 2px;
  font-weight: 600;
}

.pcz-rotation-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.pcz-rotation-row {
  display: flex;
  align-items: center;
  gap: 10px;
}

.pcz-rotation-name {
  width: 120px;
  font-size: 12px;
  color: var(--ink);
  font-weight: 500;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.pcz-rotation-bar-bg {
  flex: 1;
  height: 8px;
  background: var(--surface-soft);
  border-radius: 4px;
  overflow: hidden;
}

.pcz-rotation-bar {
  height: 100%;
  border-radius: 4px;
  transition: width 0.3s ease;
}

.pcz-rotation-val {
  width: 90px;
  text-align: right;
  font-size: 12px;
  color: var(--ink-soft);
}

.pcz-empty-text {
  font-size: 12px;
  color: var(--ink-faint);
  text-align: center;
  padding: 10px;
}

/* Table styling */
.pcz-table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.pcz-table-count {
  font-size: 11px;
  color: var(--ink-faint);
  font-weight: 500;
}

.pcz-table-wrapper {
  overflow-x: auto;
  border-radius: 8px;
  border: 0.5px solid var(--line);
}

.pcz-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 12px;
  min-width: 1020px;
}

.pcz-table th {
  text-align: left;
  color: var(--ink-soft);
  border-bottom: 0.5px solid var(--line);
  padding: 10px 8px;
  background: var(--surface-soft);
  font-weight: 600;
}

.pcz-table td {
  padding: 10px 8px;
  border-bottom: 0.5px solid var(--line);
  color: var(--ink-soft);
  vertical-align: middle;
}

.pcz-table tr:hover {
  background: var(--surface-soft);
}

.pcz-desc-cell {
  max-width: 240px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: var(--ink) !important;
}

.pcz-badge {
  font-size: 10.5px;
  font-weight: 600;
  padding: 3px 9px;
  border-radius: 999px;
  white-space: nowrap;
  display: inline-block;
}

.pcz-badge.primary {
  background: var(--primary-soft);
  color: var(--primary);
}

.pcz-badge.purple {
  background: #EEE5F7;
  color: #7A4FB0;
}

.pcz-badge-status {
  font-size: 10.5px;
  font-weight: 600;
  padding: 3px 9px;
  border-radius: 999px;
  white-space: nowrap;
  display: inline-block;
}

.pcz-dias-cell {
  display: flex;
  align-items: center;
  gap: 8px;
}

.pcz-dias-lbl {
  width: 36px;
  text-align: right;
  font-size: 11px;
}

.pcz-progress-bar-bg {
  flex: 1;
  height: 6px;
  border-radius: 3px;
  background: var(--surface-soft);
  overflow: hidden;
}

.pcz-progress-bar {
  height: 100%;
  border-radius: 3px;
}

.pcz-empty-table {
  text-align: center;
  padding: 20px !important;
  color: var(--ink-faint);
  font-size: 13px;
}

.pcz-table-note {
  font-size: 10.5px;
  color: var(--ink-faint);
  margin-top: 10px;
}

.text-right {
  text-align: right !important;
}

.text-soft {
  color: var(--ink-faint);
}

.font-medium {
  font-weight: 500;
}
</style>
