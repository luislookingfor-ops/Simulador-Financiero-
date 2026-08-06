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

const PLANNING_FILE = path.join(__dirname, 'plannings.json');

function getPlannings() {
  if (!fs.existsSync(PLANNING_FILE)) {
    const defaultData = [
      { id: 1, asesor: 'JORGE ESTRELLA', cod_item: 'LRAFI001', descripcion: 'AFIAS NT-PROBNP X 24 TEST', stock: 2, cliente: 'Hospital Metropolitano', rotacion_mensual: 0, uso_4_meses: 0, cantidad_importar: 0, total: 0 },
      { id: 2, asesor: 'JORGE ESTRELLA', cod_item: 'LRAFI002', descripcion: 'AFIAS PSA NEO X 24 TEST', stock: 30, cliente: 'Hospital Metropolitano', rotacion_mensual: 0, uso_4_meses: 0, cantidad_importar: 0, total: 0 },
      { id: 3, asesor: 'JORGE ESTRELLA', cod_item: 'LRAFI003', descripcion: 'AFIAS FPSA NEO X 24 TEST', stock: 15, cliente: 'Hospital Metropolitano', rotacion_mensual: 0, uso_4_meses: 0, cantidad_importar: 0, total: 0 },
      { id: 4, asesor: 'JORGE ESTRELLA', cod_item: 'LRAFI004', descripcion: 'AFIAS AFP X 24 TEST', stock: 2, cliente: 'Hospital Metropolitano', rotacion_mensual: 0, uso_4_meses: 0, cantidad_importar: 0, total: 0 },
      { id: 5, asesor: 'JORGE ESTRELLA', cod_item: 'LRAFI005', descripcion: 'AFIAS HBA1C NEO (HEMOGLOBINA GLICOSILADA) X 24 TEST', stock: 81, cliente: 'Hospital Metropolitano', rotacion_mensual: 0, uso_4_meses: 0, cantidad_importar: 0, total: 0 },
      { id: 6, asesor: 'JORGE ESTRELLA', cod_item: 'LRAFI006', descripcion: 'AFIAS INSULINA X 24 TEST', stock: 23, cliente: 'Hospital Metropolitano', rotacion_mensual: 0, uso_4_meses: 0, cantidad_importar: 0, total: 0 },
      { id: 7, asesor: 'JORGE ESTRELLA', cod_item: 'LRAFI007', descripcion: 'AFIAS TSH X 24 TEST', stock: 115, cliente: 'Hospital Metropolitano', rotacion_mensual: 0, uso_4_meses: 0, cantidad_importar: 0, total: 0 },
      { id: 8, asesor: 'JORGE ESTRELLA', cod_item: 'LRAFI008', descripcion: 'AFIAS T3 X 24 TEST', stock: 10, cliente: 'Hospital Metropolitano', rotacion_mensual: 0, uso_4_meses: 0, cantidad_importar: 0, total: 0 },
      { id: 9, asesor: 'JORGE ESTRELLA', cod_item: 'LRAFI009', descripcion: 'AFIAS T4 X 24 TEST', stock: 15, cliente: 'Hospital Metropolitano', rotacion_mensual: 0, uso_4_meses: 0, cantidad_importar: 0, total: 0 },
      { id: 10, asesor: 'JORGE ESTRELLA', cod_item: 'LRAFI010', descripcion: 'AFIAS FT4 X 24 TEST', stock: 20, cliente: 'Hospital Metropolitano', rotacion_mensual: 0, uso_4_meses: 0, cantidad_importar: 0, total: 0 },
      { id: 11, asesor: 'JORGE ESTRELLA', cod_item: 'LRAFI011', descripcion: 'AFIAS FSH X 24 TEST', stock: 7, cliente: 'Hospital Metropolitano', rotacion_mensual: 0, uso_4_meses: 0, cantidad_importar: 0, total: 0 },
      { id: 12, asesor: 'JORGE ESTRELLA', cod_item: 'LRAFI012', descripcion: 'AFIAS PRL (PROLACTINA) X 24 TEST', stock: 2, cliente: 'Hospital Metropolitano', rotacion_mensual: 0, uso_4_meses: 0, cantidad_importar: 0, total: 0 },
      { id: 13, asesor: 'JORGE ESTRELLA', cod_item: 'LRAFI013', descripcion: 'AFIAS TESTOSTERONA X 24 TEST', stock: 5, cliente: 'Hospital Metropolitano', rotacion_mensual: 0, uso_4_meses: 0, cantidad_importar: 0, total: 0 },
      { id: 14, asesor: 'JORGE ESTRELLA', cod_item: 'LRAFI014', descripcion: 'AFIAS CORTISOL X 24 TEST', stock: 3, cliente: 'Hospital Metropolitano', rotacion_mensual: 0, uso_4_meses: 0, cantidad_importar: 0, total: 0 },
      { id: 15, asesor: 'JORGE ESTRELLA', cod_item: 'LRAFI015', descripcion: 'AFIAS HELICOBACTER PYLORI SA X 24 TEST', stock: 104, cliente: 'Hospital Metropolitano', rotacion_mensual: 0, uso_4_meses: 0, cantidad_importar: 0, total: 0 },
      { id: 16, asesor: 'JORGE ESTRELLA', cod_item: 'LRAFI016', descripcion: 'AFIAS CRP (PROTEINA C REACTIVA) X 24 TEST', stock: 39, cliente: 'Hospital Metropolitano', rotacion_mensual: 0, uso_4_meses: 0, cantidad_importar: 0, total: 0 },
      { id: 17, asesor: 'JORGE ESTRELLA', cod_item: 'LRAFI017', descripcion: 'AFIAS PROCALCITONINA (PCT) X 24 TEST', stock: 9, cliente: 'Hospital Metropolitano', rotacion_mensual: 0, uso_4_meses: 0, cantidad_importar: 0, total: 0 },
      { id: 18, asesor: 'JORGE ESTRELLA', cod_item: 'LRAFI018', descripcion: 'AFIAS TOXO IGG X 24 TEST', stock: 2, cliente: 'Hospital Metropolitano', rotacion_mensual: 0, uso_4_meses: 0, cantidad_importar: 0, total: 0 },
      { id: 19, asesor: 'JORGE ESTRELLA', cod_item: 'LRAFI019', descripcion: 'AFIAS TOXO IGM X 24 TEST', stock: 1, cliente: 'Hospital Metropolitano', rotacion_mensual: 0, uso_4_meses: 0, cantidad_importar: 0, total: 0 },
      { id: 20, asesor: 'JORGE ESTRELLA', cod_item: 'LRAFI020', descripcion: 'AFIAS RUBEOLLA IGG X 24 TEST', stock: 1, cliente: 'Hospital Metropolitano', rotacion_mensual: 0, uso_4_meses: 0, cantidad_importar: 0, total: 0 },
      { id: 21, asesor: 'JORGE ESTRELLA', cod_item: 'LRAFI021', descripcion: 'AFIAS TOTAL IGE X 24 TEST', stock: 15, cliente: 'Hospital Metropolitano', rotacion_mensual: 0, uso_4_meses: 0, cantidad_importar: 0, total: 0 },
      { id: 22, asesor: 'JORGE ESTRELLA', cod_item: 'LRAFI022', descripcion: 'AFIAS FERRITINA X 24 TEST', stock: 5, cliente: 'Hospital Metropolitano', rotacion_mensual: 0, uso_4_meses: 0, cantidad_importar: 0, total: 0 },
      { id: 23, asesor: 'JORGE ESTRELLA', cod_item: 'LRAFI023', descripcion: 'AFIAS VITAMINA D NEO X 24 TEST', stock: 20, cliente: 'Hospital Metropolitano', rotacion_mensual: 0, uso_4_meses: 0, cantidad_importar: 0, total: 0 },
      { id: 24, asesor: 'JORGE ESTRELLA', cod_item: 'LRAFI024', descripcion: 'AFIAS TSH X 24 TEST R', stock: 0, cliente: 'Hospital Metropolitano', rotacion_mensual: 0, uso_4_meses: 0, cantidad_importar: 0, total: 0 },
      { id: 25, asesor: 'JORGE ESTRELLA', cod_item: 'LRAFI025', descripcion: 'AFIAS HBA1C NEO (HEMOGLOBINA GLICOSILADA) X 24 TEST R', stock: 0, cliente: 'Hospital Metropolitano', rotacion_mensual: 0, uso_4_meses: 0, cantidad_importar: 0, total: 0 },
      { id: 26, asesor: 'JORGE ESTRELLA', cod_item: 'LRAFI027', descripcion: 'AFIAS TNI PLUS X 24 TEST', stock: 2, cliente: 'Hospital Metropolitano', rotacion_mensual: 0, uso_4_meses: 0, cantidad_importar: 0, total: 0 },
      { id: 27, asesor: 'JORGE ESTRELLA', cod_item: 'LRAFI028', descripcion: 'AFIAS CK-MB NEO X 24 TEST', stock: 0, cliente: 'Hospital Metropolitano', rotacion_mensual: 0, uso_4_meses: 0, cantidad_importar: 0, total: 0 },
      { id: 28, asesor: 'JORGE ESTRELLA', cod_item: 'LRAFI029', descripcion: 'AFIAS D-DIMER NEO X 24 TEST', stock: 0, cliente: 'Hospital Metropolitano', rotacion_mensual: 0, uso_4_meses: 0, cantidad_importar: 0, total: 0 },
      { id: 29, asesor: 'JORGE ESTRELLA', cod_item: 'LRAFI030', descripcion: 'AFIAS CARDIAC TRIPLE X 24 TEST', stock: 0, cliente: 'Hospital Metropolitano', rotacion_mensual: 0, uso_4_meses: 0, cantidad_importar: 0, total: 0 },
      { id: 30, asesor: 'JORGE ESTRELLA', cod_item: 'LRAFI031', descripcion: 'AFIAS HSCRP X 24 TEST', stock: 0, cliente: 'Hospital Metropolitano', rotacion_mensual: 0, uso_4_meses: 0, cantidad_importar: 0, total: 0 },
      { id: 31, asesor: 'JORGE ESTRELLA', cod_item: 'LRAFI032', descripcion: 'AFIAS TROPONIN T X 24 TEST', stock: 0, cliente: 'Hospital Metropolitano', rotacion_mensual: 0, uso_4_meses: 0, cantidad_importar: 0, total: 0 },
      { id: 32, asesor: 'JORGE ESTRELLA', cod_item: 'LRAFI033', descripcion: 'AFIAS CEA X 24 TEST', stock: 2, cliente: 'Hospital Metropolitano', rotacion_mensual: 0, uso_4_meses: 0, cantidad_importar: 0, total: 0 },
      { id: 33, asesor: 'JORGE ESTRELLA', cod_item: 'LRAFI034', descripcion: 'AFIAS CA 19-9 X 24 TEST', stock: 3, cliente: 'Hospital Metropolitano', rotacion_mensual: 0, uso_4_meses: 0, cantidad_importar: 0, total: 0 },
      { id: 34, asesor: 'JORGE ESTRELLA', cod_item: 'LRAFI035', descripcion: 'AFIAS CA 125 X 24 TEST', stock: 0, cliente: 'Hospital Metropolitano', rotacion_mensual: 0, uso_4_meses: 0, cantidad_importar: 0, total: 0 },
      { id: 35, asesor: 'JORGE ESTRELLA', cod_item: 'LRAFI036', descripcion: 'AFIAS CYFRA 21-1 X 24 TEST', stock: 0, cliente: 'Hospital Metropolitano', rotacion_mensual: 0, uso_4_meses: 0, cantidad_importar: 0, total: 0 },
      { id: 36, asesor: 'JORGE ESTRELLA', cod_item: 'LRAFI037', descripcion: 'AFIAS MICROALBUMIN X 24 TEST', stock: 0, cliente: 'Hospital Metropolitano', rotacion_mensual: 0, uso_4_meses: 0, cantidad_importar: 0, total: 0 },
      { id: 37, asesor: 'JORGE ESTRELLA', cod_item: 'LRAFI038', descripcion: 'AFIAS CYSTATIN C X 24 TEST', stock: 0, cliente: 'Hospital Metropolitano', rotacion_mensual: 0, uso_4_meses: 0, cantidad_importar: 0, total: 0 },
      { id: 38, asesor: 'JORGE ESTRELLA', cod_item: 'LRAFI039', descripcion: 'AFIAS TOTAL BHCG X 24 TEST', stock: 3, cliente: 'Hospital Metropolitano', rotacion_mensual: 0, uso_4_meses: 0, cantidad_importar: 0, total: 0 },
      { id: 39, asesor: 'JORGE ESTRELLA', cod_item: 'LRAFI040', descripcion: 'AFIAS LH X 24 TEST', stock: 0, cliente: 'Hospital Metropolitano', rotacion_mensual: 0, uso_4_meses: 0, cantidad_importar: 0, total: 0 },
      { id: 40, asesor: 'JORGE ESTRELLA', cod_item: 'LRAFI041', descripcion: 'AFIAS PROGESTERONE X 24 TEST', stock: 0, cliente: 'Hospital Metropolitano', rotacion_mensual: 0, uso_4_meses: 0, cantidad_importar: 0, total: 0 },
      { id: 41, asesor: 'JORGE ESTRELLA', cod_item: 'LRAFI042', descripcion: 'AFIAS ESTRADIOL X 24 TEST', stock: 3, cliente: 'Hospital Metropolitano', rotacion_mensual: 0, uso_4_meses: 0, cantidad_importar: 0, total: 0 },
      { id: 42, asesor: 'JORGE ESTRELLA', cod_item: 'LRAFI043', descripcion: 'AFIAS AMH X 24 TEST', stock: 2, cliente: 'Hospital Metropolitano', rotacion_mensual: 0, uso_4_meses: 0, cantidad_importar: 0, total: 0 },
      { id: 43, asesor: 'JORGE ESTRELLA', cod_item: 'LRAFI044', descripcion: 'AFIAS CALPROTECTIN X 24 TEST', stock: 0, cliente: 'Hospital Metropolitano', rotacion_mensual: 0, uso_4_meses: 0, cantidad_importar: 0, total: 0 },
      { id: 44, asesor: 'JORGE ESTRELLA', cod_item: 'LRAFI045', descripcion: 'AFIAS COVID-19 AB X 24 TEST', stock: 2, cliente: 'Hospital Metropolitano', rotacion_mensual: 0, uso_4_meses: 0, cantidad_importar: 0, total: 0 },
      { id: 45, asesor: 'JORGE ESTRELLA', cod_item: 'LRAFI046', descripcion: 'AFIAS COVID-19 AG X 24 TEST', stock: 2, cliente: 'Hospital Metropolitano', rotacion_mensual: 0, uso_4_meses: 0, cantidad_importar: 0, total: 0 },
      { id: 46, asesor: 'JORGE ESTRELLA', cod_item: 'LRAFI047', descripcion: 'AFIAS COVID-19/FLU AG COMBO X 24 TEST', stock: 0, cliente: 'Hospital Metropolitano', rotacion_mensual: 0, uso_4_meses: 0, cantidad_importar: 0, total: 0 },
      { id: 47, asesor: 'JORGE ESTRELLA', cod_item: 'LRAFI049', descripcion: 'AFIAS ANTI-HBS X 24 TEST', stock: 4, cliente: 'Hospital Metropolitano', rotacion_mensual: 0, uso_4_meses: 0, cantidad_importar: 0, total: 0 },
      { id: 48, asesor: 'JORGE ESTRELLA', cod_item: 'LRAFI050', descripcion: 'AFIAS ANTI-HCV X 24 TEST', stock: 0, cliente: 'Hospital Metropolitano', rotacion_mensual: 0, uso_4_meses: 0, cantidad_importar: 0, total: 0 },
      { id: 49, asesor: 'JORGE ESTRELLA', cod_item: 'LRAFI051', descripcion: 'AFIAS DENGUE IGG/IGM X 24 TEST', stock: 0, cliente: 'Hospital Metropolitano', rotacion_mensual: 0, uso_4_meses: 0, cantidad_importar: 0, total: 0 },
      { id: 50, asesor: 'JORGE ESTRELLA', cod_item: 'LRAFI052', descripcion: 'AFIAS DENGUE NS1 AG X 24 TEST', stock: 0, cliente: 'Hospital Metropolitano', rotacion_mensual: 0, uso_4_meses: 0, cantidad_importar: 0, total: 0 },
      { id: 51, asesor: 'JORGE ESTRELLA', cod_item: 'LRAFI053', descripcion: 'AFIAS HIV 1/2 AB X 24 TEST', stock: 0, cliente: 'Hospital Metropolitano', rotacion_mensual: 0, uso_4_meses: 0, cantidad_importar: 0, total: 0 },
      { id: 52, asesor: 'JORGE ESTRELLA', cod_item: 'LRAFI054', descripcion: 'AFIAS NORO X 24 TEST', stock: 0, cliente: 'Hospital Metropolitano', rotacion_mensual: 0, uso_4_meses: 0, cantidad_importar: 0, total: 0 },
      { id: 53, asesor: 'JORGE ESTRELLA', cod_item: 'LRAFI055', descripcion: 'AFIAS ROTA X 24 TEST', stock: 1, cliente: 'Hospital Metropolitano', rotacion_mensual: 0, uso_4_meses: 0, cantidad_importar: 0, total: 0 },
      { id: 54, asesor: 'JORGE ESTRELLA', cod_item: 'LRAFI056', descripcion: 'AFIAS ROTA/ADENO X 24 TEST', stock: 3, cliente: 'Hospital Metropolitano', rotacion_mensual: 0, uso_4_meses: 0, cantidad_importar: 0, total: 0 },
      { id: 55, asesor: 'JORGE ESTRELLA', cod_item: 'LRAFI057', descripcion: 'AFIAS STREP A X 24 TEST', stock: 2, cliente: 'Hospital Metropolitano', rotacion_mensual: 0, uso_4_meses: 0, cantidad_importar: 0, total: 0 },
      { id: 56, asesor: 'JORGE ESTRELLA', cod_item: 'LRAFI058', descripcion: 'AFIAS FLU A+B X 24 TEST', stock: 0, cliente: 'Hospital Metropolitano', rotacion_mensual: 0, uso_4_meses: 0, cantidad_importar: 0, total: 0 },
      { id: 57, asesor: 'JORGE ESTRELLA', cod_item: 'LRAFI059', descripcion: 'AFIAS ANTI-CCP PLUS, 108 X 24 TEST', stock: 0, cliente: 'Hospital Metropolitano', rotacion_mensual: 0, uso_4_meses: 0, cantidad_importar: 0, total: 0 },
      { id: 58, asesor: 'JORGE ESTRELLA', cod_item: 'LRAFI060', descripcion: 'AFIAS PTH X 24 TEST', stock: 0, cliente: 'Hospital Metropolitano', rotacion_mensual: 0, uso_4_meses: 0, cantidad_importar: 0, total: 0 },
      { id: 59, asesor: 'JORGE ESTRELLA', cod_item: 'LRAFI062', descripcion: 'AFIAS COVID-19/FLU A+B/RSV AG X 24 TEST', stock: 0, cliente: 'Hospital Metropolitano', rotacion_mensual: 0, uso_4_meses: 0, cantidad_importar: 0, total: 0 },
      { id: 60, asesor: 'JORGE ESTRELLA', cod_item: 'LRAFI066', descripcion: 'GT-AFIAS CEA X 24 TEST', stock: 2, cliente: 'Hospital Metropolitano', rotacion_mensual: 0, uso_4_meses: 0, cantidad_importar: 0, total: 0 },
      { id: 61, asesor: 'JORGE ESTRELLA', cod_item: 'LRAFI067', descripcion: 'GT-AFIAS DENGUE IGG/IGM X 24 TEST', stock: 39, cliente: 'Hospital Metropolitano', rotacion_mensual: 0, uso_4_meses: 0, cantidad_importar: 0, total: 0 },
      { id: 62, asesor: 'JORGE ESTRELLA', cod_item: 'LRAFI068', descripcion: 'GT-AFIAS FT4 X 24 TEST', stock: 1, cliente: 'Hospital Metropolitano', rotacion_mensual: 0, uso_4_meses: 0, cantidad_importar: 0, total: 0 },
      { id: 63, asesor: 'INGELAB CORP', cod_item: 'LEAFI001', descripcion: 'EQUIPO AFIAS-1', stock: -1, cliente: 'Hospital Metropolitano', rotacion_mensual: 0, uso_4_meses: 0, cantidad_importar: 0, total: 0 },
      { id: 64, asesor: 'INGELAB CORP', cod_item: 'LRAFI001', descripcion: 'AFIAS NT-PROBNP X 24 TEST', stock: 2, cliente: 'Hospital Metropolitano', rotacion_mensual: 0, uso_4_meses: 0, cantidad_importar: 0, total: 0 },
      { id: 65, asesor: 'INGELAB CORP', cod_item: 'LRAFI002', descripcion: 'AFIAS PSA NEO X 24 TEST', stock: 30, cliente: 'Hospital Metropolitano', rotacion_mensual: 0, uso_4_meses: 0, cantidad_importar: 0, total: 0 },
      { id: 66, asesor: 'INGELAB CORP', cod_item: 'LRAFI003', descripcion: 'AFIAS FPSA NEO X 24 TEST', stock: 8, cliente: 'Hospital Metropolitano', rotacion_mensual: 0, uso_4_meses: 0, cantidad_importar: 0, total: 0 },
      { id: 67, asesor: 'INGELAB CORP', cod_item: 'LRAFI004', descripcion: 'AFIAS AFP X 24 TEST', stock: 3, cliente: 'Hospital Metropolitano', rotacion_mensual: 0, uso_4_meses: 0, cantidad_importar: 0, total: 0 },
      { id: 68, asesor: 'INGELAB CORP', cod_item: 'LRAFI005', descripcion: 'AFIAS HBA1C NEO (HEMOGLOBINA GLYCOSILADA) X 24 TEST', stock: 26, cliente: 'Hospital Metropolitano', rotacion_mensual: 0, uso_4_meses: 0, cantidad_importar: 0, total: 0 },
      { id: 69, asesor: 'INGELAB CORP', cod_item: 'LRAFI006', descripcion: 'AFIAS INSULINA X 24 TEST', stock: 7, cliente: 'Hospital Metropolitano', rotacion_mensual: 0, uso_4_meses: 0, cantidad_importar: 0, total: 0 },
      { id: 70, asesor: 'INGELAB CORP', cod_item: 'LRAFI007', descripcion: 'AFIAS TSH X 24 TEST', stock: 17, cliente: 'Hospital Metropolitano', rotacion_mensual: 0, uso_4_meses: 0, cantidad_importar: 0, total: 0 },
      { id: 71, asesor: 'INGELAB CORP', cod_item: 'LRAFI008', descripcion: 'AFIAS T3 X 24 TEST', stock: 10, cliente: 'Hospital Metropolitano', rotacion_mensual: 0, uso_4_meses: 0, cantidad_importar: 0, total: 0 },
      { id: 72, asesor: 'INGELAB CORP', cod_item: 'LRAFI009', descripcion: 'AFIAS T4 X 24 TEST', stock: 18, cliente: 'Hospital Metropolitano', rotacion_mensual: 0, uso_4_meses: 0, cantidad_importar: 0, total: 0 },
      { id: 73, asesor: 'INGELAB CORP', cod_item: 'LRAFI010', descripcion: 'AFIAS FT4 X 24 TEST', stock: 11, cliente: 'Hospital Metropolitano', rotacion_mensual: 0, uso_4_meses: 0, cantidad_importar: 0, total: 0 },
      { id: 74, asesor: 'INGELAB CORP', cod_item: 'LRAFI011', descripcion: 'AFIAS FSH X 24 TEST', stock: 7, cliente: 'Hospital Metropolitano', rotacion_mensual: 0, uso_4_meses: 0, cantidad_importar: 0, total: 0 },
      { id: 75, asesor: 'INGELAB CORP', cod_item: 'LRAFI012', descripcion: 'AFIAS PRL (PROLACTINA) X 24 TEST', stock: 6, cliente: 'Hospital Metropolitano', rotacion_mensual: 0, uso_4_meses: 0, cantidad_importar: 0, total: 0 },
      { id: 76, asesor: 'INGELAB CORP', cod_item: 'LRAFI013', descripcion: 'AFIAS TESTOSTERONA X 24 TEST', stock: 2, cliente: 'Hospital Metropolitano', rotacion_mensual: 0, uso_4_meses: 0, cantidad_importar: 0, total: 0 },
      { id: 77, asesor: 'INGELAB CORP', cod_item: 'LRAFI014', descripcion: 'AFIAS CORTISOL X 24 TEST', stock: 5, cliente: 'Hospital Metropolitano', rotacion_mensual: 0, uso_4_meses: 0, cantidad_importar: 0, total: 0 },
      { id: 78, asesor: 'INGELAB CORP', cod_item: 'LRAFI015', descripcion: 'AFIAS HELICOBACTER PYLORI SA X 24 TEST', stock: 43, cliente: 'Hospital Metropolitano', rotacion_mensual: 0, uso_4_meses: 0, cantidad_importar: 0, total: 0 },
      { id: 79, asesor: 'INGELAB CORP', cod_item: 'LRAFI016', descripcion: 'AFIAS CRP (PROTEINA C REACTIVA) X 24 TEST', stock: 25, cliente: 'Hospital Metropolitano', rotacion_mensual: 0, uso_4_meses: 0, cantidad_importar: 0, total: 0 },
      { id: 80, asesor: 'INGELAB CORP', cod_item: 'LRAFI017', descripcion: 'AFIAS PROCALCITONINA (PCT) X 24 TEST', stock: 9, cliente: 'Hospital Metropolitano', rotacion_mensual: 0, uso_4_meses: 0, cantidad_importar: 0, total: 0 },
      { id: 81, asesor: 'INGELAB CORP', cod_item: 'LRAFI018', descripcion: 'AFIAS TOXO IGG X 24 TEST', stock: 1, cliente: 'Hospital Metropolitano', rotacion_mensual: 0, uso_4_meses: 0, cantidad_importar: 0, total: 0 },
      { id: 82, asesor: 'INGELAB CORP', cod_item: 'LRAFI019', descripcion: 'AFIAS TOXO IGM X 24 TEST', stock: 1, cliente: 'Hospital Metropolitano', rotacion_mensual: 0, uso_4_meses: 0, cantidad_importar: 0, total: 0 },
      { id: 83, asesor: 'INGELAB CORP', cod_item: 'LRAFI020', descripcion: 'AFIAS RUBEOLLA IGG X 24 TEST', stock: 1, cliente: 'Hospital Metropolitano', rotacion_mensual: 0, uso_4_meses: 0, cantidad_importar: 0, total: 0 },
      { id: 84, asesor: 'INGELAB CORP', cod_item: 'LRAFI021', descripcion: 'AFIAS TOTAL IGE X 24 TEST', stock: 3, cliente: 'Hospital Metropolitano', rotacion_mensual: 0, uso_4_meses: 0, cantidad_importar: 0, total: 0 },
      { id: 85, asesor: 'INGELAB CORP', cod_item: 'LRAFI022', descripcion: 'AFIAS FERRITINA X 24 TEST', stock: 7, cliente: 'Hospital Metropolitano', rotacion_mensual: 0, uso_4_meses: 0, cantidad_importar: 0, total: 0 },
      { id: 86, asesor: 'INGELAB CORP', cod_item: 'LRAFI023', descripcion: 'AFIAS VITAMINA D NEO X 24 TEST', stock: 9, cliente: 'Hospital Metropolitano', rotacion_mensual: 0, uso_4_meses: 0, cantidad_importar: 0, total: 0 },
      { id: 87, asesor: 'INGELAB CORP', cod_item: 'LRAFI024', descripcion: 'AFIAS TSH X 24 TEST R', stock: 0, cliente: 'Hospital Metropolitano', rotacion_mensual: 0, uso_4_meses: 0, cantidad_importar: 0, total: 0 },
      { id: 88, asesor: 'INGELAB CORP', cod_item: 'LRAFI025', descripcion: 'AFIAS HBA1C NEO (HEMOGLOBINA GLYCOSILADA) X 24 TEST R', stock: 0, cliente: 'Hospital Metropolitano', rotacion_mensual: 0, uso_4_meses: 0, cantidad_importar: 0, total: 0 },
      { id: 89, asesor: 'INGELAB CORP', cod_item: 'LRAFI026', descripcion: 'AFIAS TNI PLUS X 24 TEST', stock: 0, cliente: 'Hospital Metropolitano', rotacion_mensual: 0, uso_4_meses: 0, cantidad_importar: 0, total: 0 },
      { id: 90, asesor: 'INGELAB CORP', cod_item: 'LRAFI027', descripcion: 'AFIAS TNI PLUS X 24 TEST', stock: 2, cliente: 'Hospital Metropolitano', rotacion_mensual: 0, uso_4_meses: 0, cantidad_importar: 0, total: 0 },
      { id: 91, asesor: 'INGELAB CORP', cod_item: 'LRAFI028', descripcion: 'AFIAS CK-MB NEO X 24 TEST', stock: 0, cliente: 'Hospital Metropolitano', rotacion_mensual: 0, uso_4_meses: 0, cantidad_importar: 0, total: 0 },
      { id: 92, asesor: 'INGELAB CORP', cod_item: 'LRAFI029', descripcion: 'AFIAS D-DIMER NEO X 24 TEST', stock: 0, cliente: 'Hospital Metropolitano', rotacion_mensual: 0, uso_4_meses: 0, cantidad_importar: 0, total: 0 },
      { id: 93, asesor: 'INGELAB CORP', cod_item: 'LRAFI030', descripcion: 'AFIAS CARDIAC TRIPLE X 24 TEST', stock: 0, cliente: 'Hospital Metropolitano', rotacion_mensual: 0, uso_4_meses: 0, cantidad_importar: 0, total: 0 },
      { id: 94, asesor: 'INGELAB CORP', cod_item: 'LRAFI031', descripcion: 'AFIAS HSCRP X 24 TEST', stock: 0, cliente: 'Hospital Metropolitano', rotacion_mensual: 0, uso_4_meses: 0, cantidad_importar: 0, total: 0 },
      { id: 95, asesor: 'INGELAB CORP', cod_item: 'LRAFI032', descripcion: 'AFIAS TROPONIN T X 24 TEST', stock: 0, cliente: 'Hospital Metropolitano', rotacion_mensual: 0, uso_4_meses: 0, cantidad_importar: 0, total: 0 },
      { id: 96, asesor: 'INGELAB CORP', cod_item: 'LRAFI033', descripcion: 'AFIAS CEA X 24 TEST', stock: 2, cliente: 'Hospital Metropolitano', rotacion_mensual: 0, uso_4_meses: 0, cantidad_importar: 0, total: 0 },
      { id: 97, asesor: 'INGELAB CORP', cod_item: 'LRAFI034', descripcion: 'AFIAS CA 19-9 X 24 TEST', stock: 2, cliente: 'Hospital Metropolitano', rotacion_mensual: 0, uso_4_meses: 0, cantidad_importar: 0, total: 0 },
      { id: 98, asesor: 'INGELAB CORP', cod_item: 'LRAFI035', descripcion: 'AFIAS CA 125 X 24 TEST', stock: 0, cliente: 'Hospital Metropolitano', rotacion_mensual: 0, uso_4_meses: 0, cantidad_importar: 0, total: 0 },
      { id: 99, asesor: 'INGELAB CORP', cod_item: 'LRAFI036', descripcion: 'AFIAS CYFRA 21-1 X 24 TEST', stock: 0, cliente: 'Hospital Metropolitano', rotacion_mensual: 0, uso_4_meses: 0, cantidad_importar: 0, total: 0 },
      { id: 100, asesor: 'INGELAB CORP', cod_item: 'LRAFI037', descripcion: 'AFIAS MICROALBUMIN X 24 TEST', stock: 0, cliente: 'Hospital Metropolitano', rotacion_mensual: 0, uso_4_meses: 0, cantidad_importar: 0, total: 0 },
      { id: 101, asesor: 'INGELAB CORP', cod_item: 'LRAFI038', descripcion: 'AFIAS CYSTATIN C X 24 TEST', stock: 0, cliente: 'Hospital Metropolitano', rotacion_mensual: 0, uso_4_meses: 0, cantidad_importar: 0, total: 0 },
      { id: 102, asesor: 'INGELAB CORP', cod_item: 'LRAFI039', descripcion: 'AFIAS TOTAL BHCG X 24 TEST', stock: 3, cliente: 'Hospital Metropolitano', rotacion_mensual: 0, uso_4_meses: 0, cantidad_importar: 0, total: 0 },
      { id: 103, asesor: 'INGELAB CORP', cod_item: 'LRAFI040', descripcion: 'AFIAS LH X 24 TEST', stock: 0, cliente: 'Hospital Metropolitano', rotacion_mensual: 0, uso_4_meses: 0, cantidad_importar: 0, total: 0 },
      { id: 104, asesor: 'INGELAB CORP', cod_item: 'LRAFI041', descripcion: 'AFIAS PROGESTERONE X 24 TEST', stock: 0, cliente: 'Hospital Metropolitano', rotacion_mensual: 0, uso_4_meses: 0, cantidad_importar: 0, total: 0 },
      { id: 105, asesor: 'INGELAB CORP', cod_item: 'LRAFI042', descripcion: 'AFIAS ESTRADIOL X 24 TEST', stock: 2, cliente: 'Hospital Metropolitano', rotacion_mensual: 0, uso_4_meses: 0, cantidad_importar: 0, total: 0 },
      { id: 106, asesor: 'INGELAB CORP', cod_item: 'LRAFI043', descripcion: 'AFIAS AMH X 24 TEST', stock: 2, cliente: 'Hospital Metropolitano', rotacion_mensual: 0, uso_4_meses: 0, cantidad_importar: 0, total: 0 },
      { id: 107, asesor: 'INGELAB CORP', cod_item: 'LRAFI044', descripcion: 'AFIAS CALPROTECTIN X 24 TEST', stock: 0, cliente: 'Hospital Metropolitano', rotacion_mensual: 0, uso_4_meses: 0, cantidad_importar: 0, total: 0 },
      { id: 108, asesor: 'INGELAB CORP', cod_item: 'LRAFI045', descripcion: 'AFIAS COVID-19 AB X 24 TEST', stock: 3, cliente: 'Hospital Metropolitano', rotacion_mensual: 0, uso_4_meses: 0, cantidad_importar: 0, total: 0 },
      { id: 109, asesor: 'INGELAB CORP', cod_item: 'LRAFI046', descripcion: 'AFIAS COVID-19 AG X 24 TEST', stock: 3, cliente: 'Hospital Metropolitano', rotacion_mensual: 0, uso_4_meses: 0, cantidad_importar: 0, total: 0 },
      { id: 110, asesor: 'INGELAB CORP', cod_item: 'LRAFI047', descripcion: 'AFIAS COVID-19/FLU AG COMBO X 24 TEST', stock: 0, cliente: 'Hospital Metropolitano', rotacion_mensual: 0, uso_4_meses: 0, cantidad_importar: 0, total: 0 },
      { id: 111, asesor: 'INGELAB CORP', cod_item: 'LRAFI049', descripcion: 'AFIAS ANTI-HBS X 24 TEST', stock: 2, cliente: 'Hospital Metropolitano', rotacion_mensual: 0, uso_4_meses: 0, cantidad_importar: 0, total: 0 },
      { id: 112, asesor: 'INGELAB CORP', cod_item: 'LRAFI050', descripcion: 'AFIAS ANTI-HCV X 24 TEST', stock: 0, cliente: 'Hospital Metropolitano', rotacion_mensual: 0, uso_4_meses: 0, cantidad_importar: 0, total: 0 },
      { id: 113, asesor: 'INGELAB CORP', cod_item: 'LRAFI051', descripcion: 'AFIAS DENGUE IGG/IGM X 24 TEST', stock: 0, cliente: 'Hospital Metropolitano', rotacion_mensual: 0, uso_4_meses: 0, cantidad_importar: 0, total: 0 },
      { id: 114, asesor: 'INGELAB CORP', cod_item: 'LRAFI052', descripcion: 'AFIAS DENGUE NS1 AG X 24 TEST', stock: 0, cliente: 'Hospital Metropolitano', rotacion_mensual: 0, uso_4_meses: 0, cantidad_importar: 0, total: 0 },
      { id: 115, asesor: 'INGELAB CORP', cod_item: 'LRAFI053', descripcion: 'AFIAS HIV 1/2 AB X 24 TEST', stock: 0, cliente: 'Hospital Metropolitano', rotacion_mensual: 0, uso_4_meses: 0, cantidad_importar: 0, total: 0 },
      { id: 116, asesor: 'INGELAB CORP', cod_item: 'LRAFI054', descripcion: 'AFIAS NORO X 24 TEST', stock: 0, cliente: 'Hospital Metropolitano', rotacion_mensual: 0, uso_4_meses: 0, cantidad_importar: 0, total: 0 },
      { id: 117, asesor: 'INGELAB CORP', cod_item: 'LRAFI055', descripcion: 'AFIAS ROTA X 24 TEST', stock: 2, cliente: 'Hospital Metropolitano', rotacion_mensual: 0, uso_4_meses: 0, cantidad_importar: 0, total: 0 },
      { id: 118, asesor: 'INGELAB CORP', cod_item: 'LRAFI056', descripcion: 'AFIAS ROTA/ADENO X 24 TEST', stock: 3, cliente: 'Hospital Metropolitano', rotacion_mensual: 0, uso_4_meses: 0, cantidad_importar: 0, total: 0 },
      { id: 119, asesor: 'INGELAB CORP', cod_item: 'LRAFI057', descripcion: 'AFIAS STREP A X 24 TEST', stock: 2, cliente: 'Hospital Metropolitano', rotacion_mensual: 0, uso_4_meses: 0, cantidad_importar: 0, total: 0 },
      { id: 120, asesor: 'INGELAB CORP', cod_item: 'LRAFI058', descripcion: 'AFIAS FLU A+B X 24 TEST', stock: 0, cliente: 'Hospital Metropolitano', rotacion_mensual: 0, uso_4_meses: 0, cantidad_importar: 0, total: 0 },
      { id: 121, asesor: 'INGELAB CORP', cod_item: 'LRAFI059', descripcion: 'AFIAS ANTI-CCP PLUS, 108 X 24 TEST', stock: 0, cliente: 'Hospital Metropolitano', rotacion_mensual: 0, uso_4_meses: 0, cantidad_importar: 0, total: 0 },
      { id: 122, asesor: 'INGELAB CORP', cod_item: 'LRAFI060', descripcion: 'AFIAS PTH X 24 TEST', stock: 0, cliente: 'Hospital Metropolitano', rotacion_mensual: 0, uso_4_meses: 0, cantidad_importar: 0, total: 0 },
      { id: 123, asesor: 'INGELAB CORP', cod_item: 'LRAFI062', descripcion: 'AFIAS COVID-19/FLU A+B/RSV AG X 24 TEST', stock: 0, cliente: 'Hospital Metropolitano', rotacion_mensual: 0, uso_4_meses: 0, cantidad_importar: 0, total: 0 },
      { id: 124, asesor: 'INGELAB CORP', cod_item: 'LRAFI063', descripcion: 'AFIAS IL-6 X 24 TEST', stock: 1, cliente: 'Hospital Metropolitano', rotacion_mensual: 0, uso_4_meses: 0, cantidad_importar: 0, total: 0 },
      { id: 125, asesor: 'INGELAB CORP', cod_item: 'LRAFI066', descripcion: 'GT-AFIAS CEA X 24 TEST', stock: 2, cliente: 'Hospital Metropolitano', rotacion_mensual: 0, uso_4_meses: 0, cantidad_importar: 0, total: 0 },
      { id: 126, asesor: 'INGELAB CORP', cod_item: 'LRAFI067', descripcion: 'GT-AFIAS DENGUE IGG/IGM X 24 TEST', stock: 39, cliente: 'Hospital Metropolitano', rotacion_mensual: 0, uso_4_meses: 0, cantidad_importar: 0, total: 0 },
      { id: 127, asesor: 'INGELAB CORP', cod_item: 'LRAFI068', descripcion: 'GT-AFIAS FT4 X 24 TEST', stock: 1, cliente: 'Hospital Metropolitano', rotacion_mensual: 0, uso_4_meses: 0, cantidad_importar: 0, total: 0 },
      { id: 128, asesor: 'INGELAB CORP', cod_item: 'LRAFI048', descripcion: 'AFIAS HBSAG X 24 TEST', stock: 0, cliente: 'Hospital Metropolitano', rotacion_mensual: 0, uso_4_meses: 0, cantidad_importar: 0, total: 0 },
      { id: 129, asesor: 'JORGE ESTRELLA', cod_item: 'LRAFI048', descripcion: 'AFIAS HBSAG X 24 TEST', stock: 0, cliente: 'Hospital Metropolitano', rotacion_mensual: 0, uso_4_meses: 0, cantidad_importar: 0, total: 0 }
    ];
    fs.writeFileSync(PLANNING_FILE, JSON.stringify(defaultData, null, 2), 'utf8');
  }
  try {
    const data = fs.readFileSync(PLANNING_FILE, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Error reading plannings file', err);
    return [];
  }
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
  const plannings = getPlannings();
  const pageData = {
    component: 'SimulationForm',
    props: {
      equipments: EQUIPMENTS,
      simulations: sims,
      reagentPlannings: plannings
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

// Route: DELETE /simulations/:id (Delete scenario)
app.delete('/simulations/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const sims = getSimulations();
  const idx = sims.findIndex(s => s.id === id);
  if (idx !== -1) {
    sims.splice(idx, 1);
    fs.writeFileSync(SIMULATIONS_FILE, JSON.stringify(sims, null, 2), 'utf8');
  }
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

// Route: POST /equipments (Create equipment)
app.post('/equipments', (req, res) => {
  const { code, name, line, fob, ups, pc, impresora, control, calibrador, default_reagent_cost } = req.body;
  const newEq = {
    id: EQUIPMENTS.length ? Math.max(...EQUIPMENTS.map(e => e.id)) + 1 : 1,
    code,
    name,
    line,
    fob: Number(fob) || 0,
    ups: Number(ups) || 0,
    pc: Number(pc) || 0,
    impresora: Number(impresora) || 0,
    control: Number(control) || 0,
    calibrador: Number(calibrador) || 0,
    default_reagent_cost: Number(default_reagent_cost) || 0
  };
  EQUIPMENTS.push(newEq);
  if (req.headers['x-inertia']) {
    res.setHeader('X-Inertia', 'true');
    res.setHeader('X-Inertia-Location', '/');
    return res.status(303).json({});
  }
  res.redirect(303, '/');
});

// Route: PUT /equipments/:id (Update equipment)
app.put('/equipments/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const { code, name, line, fob, ups, pc, impresora, control, calibrador, default_reagent_cost } = req.body;
  const idx = EQUIPMENTS.findIndex(e => e.id === id);
  if (idx !== -1) {
    EQUIPMENTS[idx] = {
      ...EQUIPMENTS[idx],
      code,
      name,
      line,
      fob: Number(fob) || 0,
      ups: Number(ups) || 0,
      pc: Number(pc) || 0,
      impresora: Number(impresora) || 0,
      control: Number(control) || 0,
      calibrador: Number(calibrador) || 0,
      default_reagent_cost: Number(default_reagent_cost) || 0
    };
  }
  if (req.headers['x-inertia']) {
    res.setHeader('X-Inertia', 'true');
    res.setHeader('X-Inertia-Location', '/');
    return res.status(303).json({});
  }
  res.redirect(303, '/');
});

// Route: DELETE /equipments/:id (Delete equipment)
app.delete('/equipments/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const idx = EQUIPMENTS.findIndex(e => e.id === id);
  if (idx !== -1) {
    EQUIPMENTS.splice(idx, 1);
  }
  if (req.headers['x-inertia']) {
    res.setHeader('X-Inertia', 'true');
    res.setHeader('X-Inertia-Location', '/');
    return res.status(303).json({});
  }
  res.redirect(303, '/');
});

// Route: POST /reagent-plannings (Create planning item)
app.post('/reagent-plannings', (req, res) => {
  const plannings = getPlannings();
  const item = req.body;
  item.id = plannings.length ? Math.max(...plannings.map(p => p.id)) + 1 : 1;
  item.rotacion_mensual = Number(item.rotacion_mensual) || 0;
  item.uso_4_meses = Number(item.uso_4_meses) || 0;
  item.cantidad_importar = Number(item.cantidad_importar) || 0;
  item.total = Number(item.total) || 0;
  plannings.push(item);
  fs.writeFileSync(PLANNING_FILE, JSON.stringify(plannings, null, 2), 'utf8');
  if (req.headers['x-inertia']) {
    res.setHeader('X-Inertia', 'true');
    res.setHeader('X-Inertia-Location', '/');
    return res.status(303).json({});
  }
  res.redirect(303, '/');
});

// Route: PUT /reagent-plannings/:id (Update planning item)
app.put('/reagent-plannings/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const plannings = getPlannings();
  const idx = plannings.findIndex(p => p.id === id);
  if (idx !== -1) {
    plannings[idx] = {
      ...plannings[idx],
      ...req.body,
      rotacion_mensual: Number(req.body.rotacion_mensual) || 0,
      uso_4_meses: Number(req.body.uso_4_meses) || 0,
      cantidad_importar: Number(req.body.cantidad_importar) || 0,
      total: Number(req.body.total) || 0
    };
    fs.writeFileSync(PLANNING_FILE, JSON.stringify(plannings, null, 2), 'utf8');
  }
  if (req.headers['x-inertia']) {
    res.setHeader('X-Inertia', 'true');
    res.setHeader('X-Inertia-Location', '/');
    return res.status(303).json({});
  }
  res.redirect(303, '/');
});

// Route: DELETE /reagent-plannings/:id (Delete planning item)
app.delete('/reagent-plannings/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const plannings = getPlannings();
  const idx = plannings.findIndex(p => p.id === id);
  if (idx !== -1) {
    plannings.splice(idx, 1);
    fs.writeFileSync(PLANNING_FILE, JSON.stringify(plannings, null, 2), 'utf8');
  }
  if (req.headers['x-inertia']) {
    res.setHeader('X-Inertia', 'true');
    res.setHeader('X-Inertia-Location', '/');
    return res.status(303).json({});
  }
  res.redirect(303, '/');
});

// Route: POST /reagent-plannings/bulk-update (Bulk update plannings)
app.post('/reagent-plannings/bulk-update', (req, res) => {
  const list = req.body.plannings || [];
  const plannings = getPlannings();
  list.forEach(item => {
    const idx = plannings.findIndex(p => p.id === item.id);
    if (idx !== -1) {
      plannings[idx] = {
        ...plannings[idx],
        ...item,
        rotacion_mensual: Number(item.rotacion_mensual) || 0,
        uso_4_meses: Number(item.uso_4_meses) || 0,
        cantidad_importar: Number(item.cantidad_importar) || 0,
        total: Number(item.total) || 0
      };
    }
  });
  fs.writeFileSync(PLANNING_FILE, JSON.stringify(plannings, null, 2), 'utf8');
  if (req.headers['x-inertia']) {
    res.setHeader('X-Inertia', 'true');
    res.setHeader('X-Inertia-Location', '/');
    return res.status(303).json({});
  }
  res.redirect(303, '/');
});

app.listen(PORT, () => {
  console.log(`\n🚀 Ingelab Mock Laravel + Inertia Server running at: http://localhost:${PORT}`);
  console.log(`👉 Make sure to run the Vite dev server with: npm run dev\n`);
});
