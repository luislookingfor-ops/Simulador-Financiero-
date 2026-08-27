import XLSX from 'xlsx';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Excel file is in the project root (two levels up from app/Bin/)
const excelPath = path.resolve(__dirname, '../../REPORTE VENCIMIENTOS  (1).xlsx');

export function getExcelData(companyFilter) {
  try {
    const workbook = XLSX.readFile(excelPath);
    const sheet = workbook.Sheets['CADUCIDAD'];
    if (!sheet) return [];
    
    const rows = XLSX.utils.sheet_to_json(sheet);
    
    // Map fields
    return rows.map(r => {
      // Convert Excel date to ISO or standard string
      let rawDate = r.vencimiento;
      let dateString = null;
      if (typeof rawDate === 'number') {
        // Adjust for Excel leap year bug and timezone offsets by using UTC
        const date = new Date(Math.round((rawDate - 25569) * 86400 * 1000));
        // Format as YYYY-MM-DD
        dateString = date.toISOString().split('T')[0] + 'T00:00:00.000+00:00';
      } else if (rawDate) {
        dateString = String(rawDate);
      }

      return {
        codItem: String(r.codigo || ''),
        descripcion: r.descripcion || '',
        nombreTipo: r.marca || 'Sin marca',
        nombreSubGrupo: r.bodega || 'Sin bodega',
        referencia: r.lote ? String(r.lote) : null,
        fechaCaducaRegSanitario: dateString,
        precioCompra: Number(r.costo) || 0,
        costoPromedio: Number(r.costo) || 0,
        saldoDisponible: Number(r.stock) || 0,
        empresa: r.empresa || '',
        vendido: Number(r.vendido) || 0,
        aumento: Number(r.aumento) || 0
      };
    }).filter(item => {
      // If companyFilter is provided, filter by company
      if (companyFilter === '047') {
        return item.empresa === 'INGELAB S.A.S';
      } else if (companyFilter === '079') {
        return item.empresa === 'JORGE ESTRELLA';
      }
      return true;
    });
  } catch (err) {
    console.error('Error reading Excel vencimientos:', err);
    return [];
  }
}

// If run directly from command line, print the output
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const companyFilter = process.argv[2];
  const data = getExcelData(companyFilter);
  process.stdout.write(JSON.stringify(data));
}
