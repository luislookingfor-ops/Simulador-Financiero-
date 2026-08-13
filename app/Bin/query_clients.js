import pg from 'pg';

const dbConfig = {
  host: 'db.gdddjsyfqvhgpebivoln.supabase.co',
  port: 5432,
  database: 'postgres',
  user: 'postgres',
  password: 'dcstuNOhUWbFSntp',
  ssl: {
    rejectUnauthorized: false
  }
};

async function getFilters(client) {
  const resEmp = await client.query("SELECT DISTINCT empresa FROM clientes WHERE empresa IS NOT NULL AND empresa != '' ORDER BY empresa;");
  const resSec = await client.query("SELECT DISTINCT sector FROM clientes WHERE sector IS NOT NULL AND sector != '' ORDER BY sector;");
  const resProv = await client.query("SELECT DISTINCT provincia FROM clientes WHERE provincia IS NOT NULL AND provincia != '' ORDER BY provincia;");

  return {
    empresas: resEmp.rows.map(r => r.empresa),
    sectores: resSec.rows.map(r => r.sector),
    provincias: resProv.rows.map(r => r.provincia)
  };
}

async function searchClients(client, args) {
  const params = [];
  let paramIndex = 1;
  const conditions = [];

  let query = `
    SELECT id, nombre, identificacion, empresa, sector, provincia, cod_cliente
    FROM clientes
    WHERE 1=1
  `;

  // Parse custom key-value arguments
  args.forEach(arg => {
    if (arg.startsWith('--empresa=')) {
      const val = arg.slice('--empresa='.length);
      if (val) {
        conditions.push(`empresa = $${paramIndex++}`);
        params.push(val);
      }
    } else if (arg.startsWith('--sector=')) {
      const val = arg.slice('--sector='.length);
      if (val) {
        conditions.push(`sector = $${paramIndex++}`);
        params.push(val);
      }
    } else if (arg.startsWith('--provincia=')) {
      const val = arg.slice('--provincia='.length);
      if (val) {
        conditions.push(`provincia = $${paramIndex++}`);
        params.push(val);
      }
    } else if (arg.startsWith('--search=')) {
      const val = arg.slice('--search='.length);
      if (val) {
        conditions.push(`(nombre ILIKE $${paramIndex} OR identificacion ILIKE $${paramIndex} OR cod_cliente::text ILIKE $${paramIndex})`);
        params.push(`%${val}%`);
        paramIndex++;
      }
    }
  });

  if (conditions.length > 0) {
    query += " AND " + conditions.join(" AND ");
  }

  query += " ORDER BY nombre LIMIT 100";

  const res = await client.query(query, params);
  return res.rows;
}

async function main() {
  const args = process.argv.slice(2);
  const action = args[0];

  if (!action) {
    console.error(JSON.stringify({ error: "Missing action parameter" }));
    process.exit(1);
  }

  const client = new pg.Client(dbConfig);
  try {
    await client.connect();

    let output;
    if (action === 'get-filters') {
      output = await getFilters(client);
    } else if (action === 'search-clients') {
      output = await searchClients(client, args.slice(1));
    } else {
      throw new Error(`Unknown action: ${action}`);
    }

    console.log(JSON.stringify(output));
  } catch (err) {
    console.error(JSON.stringify({ error: err.message }));
    process.exit(1);
  } finally {
    await client.end();
  }
}

main();
