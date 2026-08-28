import XLSX from 'xlsx';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Excel file is in the project root (two levels up from app/Bin/)
const excelPath = path.resolve(__dirname, '../../REPORTE VENCIMIENTOS  (1).xlsx');

export async function getExcelData(companyFilter) {
  const apiStocks = new Map();
  try {
    const urls = {
      '047': 'https://funciones-digital-strategy-831038044.development.catalystserverless.com/productos?pautorizacion=047-1001089458071&pcod_empresa=047',
      '079': 'https://funciones-digital-strategy-831038044.development.catalystserverless.com/productos?pautorizacion=079-1001176123971&pcod_empresa=079'
    };
    
    const fetchPromises = [];
    if (companyFilter === '047' || !companyFilter) {
      fetchPromises.push(
        fetch(urls['047']).then(res => res.json()).then(data => {
          data.forEach(item => {
            if (item.codItem) {
              apiStocks.set('047_' + item.codItem, Number(item.saldoDisponible) || 0);
            }
          });
        }).catch(err => console.error('Error fetching live stock 047:', err.message))
      );
    }
    if (companyFilter === '079' || !companyFilter) {
      fetchPromises.push(
        fetch(urls['079']).then(res => res.json()).then(data => {
          data.forEach(item => {
            if (item.codItem) {
              apiStocks.set('079_' + item.codItem, Number(item.saldoDisponible) || 0);
            }
          });
        }).catch(err => console.error('Error fetching live stock 079:', err.message))
      );
    }
    
    // Fetch live API stocks with an 8-second safety timeout
    if (fetchPromises.length > 0) {
      await Promise.race([
        Promise.all(fetchPromises),
        new Promise((_, reject) => setTimeout(() => reject(new Error('API timeout')), 8000))
      ]);
    }
  } catch (err) {
    console.warn('Could not fetch live stock from API, falling back to Excel stock:', err.message);
  }

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

      // Overwrite Excel stock with live API stock if match found
      const compCode = r.empresa === 'INGELAB S.A.S' ? '047' : '079';
      const key = compCode + '_' + r.codigo;
      let stock = Number(r.stock) || 0;
      if (apiStocks.has(key)) {
        stock = apiStocks.get(key);
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
        saldoDisponible: stock,
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
  getExcelData(companyFilter).then(data => {
    process.stdout.write(JSON.stringify(data));
  }).catch(err => {
    console.error(err);
    process.exit(1);
  });
}
