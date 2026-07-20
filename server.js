import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 8000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Saved simulations database file
const SIMULATIONS_FILE = path.join(__dirname, 'simulations.json');

// Preloaded equipments matching the database seeder exactly
const EQUIPMENTS = [
  // Hematología
  { id: 1, code: 'KT-6610', name: 'KT 6610', fob: 0, ups: 0, pc: 0, impresora: 0, control: 0, calibrador: 0, line: 'Hematología', default_reagent_cost: 0.35 },
  { id: 2, code: 'KT-8000', name: 'KT 8000', fob: 0, ups: 0, pc: 0, impresora: 0, control: 0, calibrador: 0, line: 'Hematología', default_reagent_cost: 0.40 },
  { id: 3, code: 'F-560', name: 'F560', fob: 0, ups: 0, pc: 0, impresora: 0, control: 0, calibrador: 0, line: 'Hematología', default_reagent_cost: 0.45 },
  { id: 4, code: 'F-810', name: 'F810', fob: 0, ups: 0, pc: 0, impresora: 0, control: 0, calibrador: 0, line: 'Hematología', default_reagent_cost: 0.50 },
  { id: 5, code: 'MND-3008B-CTO-S01', name: 'CONTADOR HEMATOLOGICO BC-20S', fob: 2111.00, ups: 87.40, pc: 0.00, impresora: 272.32, control: 52.98, calibrador: 100.30, line: 'Hematología', default_reagent_cost: 0.35 },
  { id: 6, code: 'MND-3008B-CTO-S02', name: 'CONTADOR HEMATOLOGICO BC-30S', fob: 3297.00, ups: 87.40, pc: 0.00, impresora: 272.32, control: 52.98, calibrador: 100.30, line: 'Hematología', default_reagent_cost: 0.35 },
  { id: 7, code: 'MND-3107B-CTO-S01', name: 'CONTADOR HEMATOLOGICO BC-5000', fob: 4401.00, ups: 87.40, pc: 0.00, impresora: 272.32, control: 50.57, calibrador: 100.30, line: 'Hematología', default_reagent_cost: 0.45 },
  { id: 8, code: 'MND-3107B-CTO-S02', name: 'CONTADOR HEMATOLOGICO BC-5150', fob: 6259.00, ups: 87.40, pc: 0.00, impresora: 272.32, control: 50.57, calibrador: 100.30, line: 'Hematología', default_reagent_cost: 0.45 },
  { id: 9, code: 'MND-3101B-CTO-S01', name: 'CONTADOR HEMATOLOGICO BC-5300', fob: 7500.00, ups: 662.57, pc: 616.16, impresora: 272.32, control: 50.57, calibrador: 100.30, line: 'Hematología', default_reagent_cost: 0.50 },
  { id: 10, code: 'MND-3102B-CTO-S01', name: 'CONTADOR HEMATOLOGICO BC-5380', fob: 8063.95, ups: 662.57, pc: 616.16, impresora: 272.32, control: 50.57, calibrador: 100.30, line: 'Hematología', default_reagent_cost: 0.50 },
  { id: 11, code: 'MND-3206B-CTO-S01', name: 'CONTADOR HEMATOLOGICO BC-6000', fob: 15000.00, ups: 746.33, pc: 559.54, impresora: 272.32, control: 150.89, calibrador: 100.30, line: 'Hematología', default_reagent_cost: 0.60 },
  { id: 12, code: 'MND-3206B-CTO-S02', name: 'CONTADOR HEMATOLOGICO BC-6200', fob: 19000.00, ups: 746.33, pc: 559.54, impresora: 272.32, control: 150.89, calibrador: 100.30, line: 'Hematología', default_reagent_cost: 0.60 },
  { id: 13, code: 'MND-3201B-CTO-S01', name: 'CONTADOR HEMATOLOGICO BC-6800', fob: 25000.00, ups: 746.33, pc: 559.54, impresora: 272.32, control: 150.89, calibrador: 100.30, line: 'Hematología', default_reagent_cost: 0.65 },
  { id: 14, code: 'MND-3205B-PA00010', name: 'CONTADOR HEMATOLOGICO BC-6800PLUS', fob: 23250.00, ups: 746.33, pc: 559.54, impresora: 272.32, control: 150.89, calibrador: 100.30, line: 'Hematología', default_reagent_cost: 0.65 },

  // Química
  { id: 15, code: 'TC-M160', name: 'TECO MATRIX 160', fob: 0, ups: 0, pc: 0, impresora: 0, control: 0, calibrador: 0, line: 'Química', default_reagent_cost: 0.25 },
  { id: 16, code: 'TC-M240', name: 'TECO MATRIX 240', fob: 0, ups: 0, pc: 0, impresora: 0, control: 0, calibrador: 0, line: 'Química', default_reagent_cost: 0.25 },
  { id: 17, code: 'TC-M480', name: 'TECO MATRIX 480', fob: 0, ups: 0, pc: 0, impresora: 0, control: 0, calibrador: 0, line: 'Química', default_reagent_cost: 0.25 },
  { id: 18, code: 'MND-BS240', name: 'BS-240 ANALIZADOR DE QUÍMICA CLÍNICA', fob: 0, ups: 0, pc: 0, impresora: 0, control: 0, calibrador: 0, line: 'Química', default_reagent_cost: 0.25 },
  { id: 19, code: 'MND-BS430', name: 'BS-430 ANALIZADOR DE QUÍMICA CLÍNICA', fob: 0, ups: 0, pc: 0, impresora: 0, control: 0, calibrador: 0, line: 'Química', default_reagent_cost: 0.25 },

  // Inmunología
  { id: 20, code: 'LFT-E8000', name: 'LIFOTRONIC ECLIA 8000', fob: 0, ups: 0, pc: 0, impresora: 0, control: 0, calibrador: 0, line: 'Inmunología', default_reagent_cost: 1.10 },
  { id: 21, code: 'LFT-E8600', name: 'LIFOTRONIC ECLIA 8600', fob: 0, ups: 0, pc: 0, impresora: 0, control: 0, calibrador: 0, line: 'Inmunología', default_reagent_cost: 1.10 },
  { id: 22, code: 'LFT-E9000', name: 'LIFOTRONIC ECLIA 9000', fob: 0, ups: 0, pc: 0, impresora: 0, control: 0, calibrador: 0, line: 'Inmunología', default_reagent_cost: 1.10 },
  { id: 23, code: 'YHLO-C6104', name: 'iFLASH 1800A YHLO ANALIZADOR DE INMUNOENSAYO CLIA', fob: 19023.00, ups: 746.33, pc: 559.54, impresora: 272.32, control: 0.00, calibrador: 0.00, line: 'Inmunología', default_reagent_cost: 1.20 },

  // Gasometría
  { id: 24, code: 'EDAN-GAS', name: 'Edan', fob: 0, ups: 0, pc: 0, impresora: 0, control: 0, calibrador: 0, line: 'Gasometría', default_reagent_cost: 0.80 },
  { id: 25, code: 'SEAMATY-GAS', name: 'Seamaty', fob: 0, ups: 0, pc: 0, impresora: 0, control: 0, calibrador: 0, line: 'Gasometría', default_reagent_cost: 0.80 },

  // Electrolitos
  { id: 26, code: 'HRN-H900', name: 'HORRON H900', fob: 0, ups: 0, pc: 0, impresora: 0, control: 0, calibrador: 0, line: 'Electrolitos', default_reagent_cost: 0.50 },
  { id: 27, code: 'BSN-BE900', name: 'BIOSENS BE900', fob: 0, ups: 0, pc: 0, impresora: 0, control: 0, calibrador: 0, line: 'Electrolitos', default_reagent_cost: 0.50 },

  // Uroanálisis
  { id: 28, code: 'MND-EU5300P', name: 'MINDRAY EU-5300 PRO', fob: 0, ups: 0, pc: 0, impresora: 0, control: 0, calibrador: 0, line: 'Uroanálisis', default_reagent_cost: 0.30 },
  { id: 29, code: 'MND-EU5600P', name: 'MINDRAY EU-5600 PRO', fob: 0, ups: 0, pc: 0, impresora: 0, control: 0, calibrador: 0, line: 'Uroanálisis', default_reagent_cost: 0.30 },

  // Coagulación
  { id: 30, code: 'BE-018-016', name: 'COAGULOMETRO THROMBOLYZER COMPACT X AUTO.', fob: 10988.00, ups: 519.48, pc: 616.16, impresora: 272.32, control: 0.00, calibrador: 0.00, line: 'Coagulación', default_reagent_cost: 0.70 },
  { id: 31, code: 'BE-018-028', name: 'COAGULOMETRO THROMBOLYZER XRC CON ACCESORIOS', fob: 17570.00, ups: 519.48, pc: 616.16, impresora: 272.32, control: 0.00, calibrador: 0.00, line: 'Coagulación', default_reagent_cost: 0.70 },

  // HPLC
  { id: 32, code: 'LFT-008', name: 'ANALIZADOR HBA1C HPLC H-9 LIFOTRONIC', fob: 8700.00, ups: 519.48, pc: 0.00, impresora: 0.00, control: 0.00, calibrador: 0.00, line: 'HPLC', default_reagent_cost: 0.80 },
  { id: 33, code: 'LFT-014', name: 'ANALIZADOR HbA1c HPLC H8 LIFOTRONIC', fob: 7350.00, ups: 519.48, pc: 0.00, impresora: 0.00, control: 0.00, calibrador: 0.00, line: 'HPLC', default_reagent_cost: 0.80 }
];

// Helper to read saved simulations
function getSimulations() {
  if (!fs.existsSync(SIMULATIONS_FILE)) {
    return [];
  }
  try {
    const data = fs.readFileSync(SIMULATIONS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Error reading simulations file, resetting database.', err);
    return [];
  }
}

// Helper to write saved simulations
function saveSimulation(sim) {
  const sims = getSimulations();
  sim.id = sims.length + 1;
  sim.created_at = new Date().toISOString();
  sims.unshift(sim); // Add newest first
  fs.writeFileSync(SIMULATIONS_FILE, JSON.stringify(sims, null, 2), 'utf8');
  return sim;
}

// Renders the app.blade.php Inertia HTML template
function renderInertiaView(pagePayload) {
  const templatePath = path.join(__dirname, 'resources/views/app.blade.php');
  let html = fs.readFileSync(templatePath, 'utf8');

  // Replace @vite directive with local dev server paths
  const viteReplacement = `
    <script type="module" src="http://localhost:5173/@vite/client"></script>
    <script type="module" src="http://localhost:5173/resources/js/app.js"></script>
  `;
  html = html.replace("@vite('resources/js/app.js')", viteReplacement);
  html = html.replace('@inertiaHead', '');

  // Inject data into @inertia element
  const pageJson = JSON.stringify(pagePayload).replace(/"/g, '&quot;');
  const inertiaDiv = `<div id="app" data-page="${pageJson}"></div>`;
  html = html.replace('@inertia', inertiaDiv);

  return html;
}

// Route: GET /
app.get('/', (req, res) => {
  const sims = getSimulations();
  const pageData = {
    component: 'SimulationForm',
    props: {
      equipments: EQUIPMENTS,
      simulations: sims
    },
    url: '/',
    version: '1.0'
  };

  // If it's an Inertia client request, return JSON
  if (req.headers['x-inertia']) {
    res.setHeader('X-Inertia', 'true');
    return res.json(pageData);
  }

  // Else, serve HTML shell
  res.send(renderInertiaView(pageData));
});

// Route: POST /simulations (Save scenario)
app.post('/simulations', (req, res) => {
  const { name, global_settings, equipment_settings } = req.body;
  if (!name || !global_settings || !equipment_settings) {
    return res.status(400).send('Faltan parámetros requeridos');
  }

  saveSimulation({
    name,
    global_settings,
    equipment_settings
  });

  // Redirect to GET / with 333/303 redirect as expected by Inertia
  if (req.headers['x-inertia']) {
    res.setHeader('X-Inertia', 'true');
    res.setHeader('X-Inertia-Location', '/');
    return res.status(303).json({});
  }
  
  res.redirect(303, '/');
});

// Route: POST /simulations/calculate
app.post('/simulations/calculate', (req, res) => {
  // Calculations are replicated from Laravel SimulationController.php
  const global = req.body.global_settings || {};
  const configs = req.body.equipment_settings || [];
  
  const contractMonths = parseInt(global.contract_months) || parseInt(global.months) || 36;
  const amortizationMonths = parseInt(global.amortization_months) || parseInt(global.months) || 36;
  const annualInterest = (parseFloat(global.interest_rate) || 11) / 100;
  const annualInflation = (parseFloat(global.inflation_rate) || 1) / 100;
  const importIndex = (parseFloat(global.import_index) || 1.15);

  const results = configs.map(cfg => {
    if (!cfg.equipment_id) return null;

    const eq = EQUIPMENTS.find(e => e.id === cfg.equipment_id);
    if (!eq) return null;

    const qty = parseInt(cfg.quantity) || 1;
    const hasUPS = cfg.include_ups !== false;
    const hasPC = cfg.include_pc !== false;
    const hasPrinterBase = cfg.include_printer_base !== false;
    const hasZebra = !!cfg.include_zebra;
    const hasSoftware = !!cfg.include_software;
    const softwareVal = parseFloat(cfg.software_value) || 2000;
    const hasSyringes = !!cfg.include_syringes;
    const hasControls = !!cfg.include_controls;

    const upsCost = hasUPS ? eq.ups : 0;
    const pcCost = hasPC ? eq.pc : 0;
    const printerBaseCost = hasPrinterBase ? eq.impresora : 0;
    const zebraCost = hasZebra ? 330 : 0;
    const softwareCost = hasSoftware ? softwareVal : 0;
    const syringesCost = hasSyringes ? 150 : 0;
    const controlCost = hasControls ? eq.control : 0;
    const calibratorCost = hasControls ? eq.calibrador : 0;

    // Landed Teórico
    const fobTotalSelected = eq.fob + upsCost + pcCost + printerBaseCost + zebraCost + softwareCost + syringesCost + controlCost + calibratorCost;
    const landedTeoricoUnit = fobTotalSelected * importIndex;
    const landedTeoricoTotal = landedTeoricoUnit * qty;

    // Landed Real
    const fobTotalBase = eq.fob + eq.ups + eq.pc + eq.impresora + eq.control + eq.calibrador;
    const landedRealUnit = fobTotalBase * importIndex;
    const landedRealTotal = landedRealUnit * qty;

    // PMT Amortization
    const pv = landedTeoricoTotal;
    const r = annualInterest / 12;
    const n = amortizationMonths;
    let pmt = 0;

    if (r > 0) {
      pmt = (pv * r) / (1 - Math.pow(1 + r, -n));
    } else {
      pmt = n > 0 ? (pv / n) : 0;
    }

    // Volumetrics
    const dailyTests = parseInt(cfg.daily_tests) || 0;
    const monthlyTests = dailyTests * 30 * qty;
    const annualTests = monthlyTests * 12;
    const totalTests = monthlyTests * contractMonths;

    const pvp = parseFloat(cfg.pvp_per_test) || 1.10;
    const totalRevenue = totalTests * pvp;

    // Reagent Cost inflation
    const baseReagentCost = parseFloat(cfg.reagent_cost_per_test) || eq.default_reagent_cost || 0.35;
    let totalReagentCost = 0;
    const monthlyTestsPerEq = dailyTests * 30;

    for (let m = 1; m <= contractMonths; m++) {
      const year = Math.floor((m - 1) / 12);
      const inflatedCost = baseReagentCost * Math.pow(1 + annualInflation, year);
      totalReagentCost += (monthlyTestsPerEq * qty) * inflatedCost;
    }

    const grossProfitUSD = totalRevenue - totalReagentCost;
    const grossProfitPercent = totalRevenue > 0 ? (grossProfitUSD / totalRevenue) * 100 : 0;

    const totalAmortization = pmt * contractMonths;
    const netProfitUSD = grossProfitUSD - totalAmortization;
    const netProfitPercent = totalRevenue > 0 ? (netProfitUSD / totalRevenue) * 100 : 0;

    const costPerTest = monthlyTests > 0 ? (pmt / monthlyTests) : 0;

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

  res.json(results);
});

app.listen(PORT, () => {
  console.log(`\n🚀 Ingelab Mock Laravel + Inertia Server running at: http://localhost:${PORT}`);
  console.log(`👉 Make sure to run the Vite dev server with: npm run dev\n`);
});
