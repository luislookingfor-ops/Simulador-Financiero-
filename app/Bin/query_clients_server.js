import http from 'http';
import url from 'url';
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

const pool = new pg.Pool(dbConfig);

const server = http.createServer(async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Content-Type', 'application/json');

  if (req.method === 'OPTIONS') {
    res.statusCode = 200;
    res.end();
    return;
  }

  try {
    const parsedUrl = url.parse(req.url, true);
    const path = parsedUrl.pathname;

    if (path === '/api/clientes/filtros') {
      const client = await pool.connect();
      try {
        const resEmp = await client.query("SELECT DISTINCT empresa FROM clientes WHERE empresa IS NOT NULL AND empresa != '' ORDER BY empresa;");
        const resSec = await client.query("SELECT DISTINCT sector FROM clientes WHERE sector IS NOT NULL AND sector != '' ORDER BY sector;");
        const resProv = await client.query("SELECT DISTINCT provincia FROM clientes WHERE provincia IS NOT NULL AND provincia != '' ORDER BY provincia;");

        res.end(JSON.stringify({
          empresas: resEmp.rows.map(r => r.empresa),
          sectores: resSec.rows.map(r => r.sector),
          provincias: resProv.rows.map(r => r.provincia)
        }));
      } finally {
        client.release();
      }
    } else if (path === '/api/clientes') {
      const queryParams = parsedUrl.query;
      const params = [];
      let paramIndex = 1;
      const conditions = [];

      let query = `
        SELECT id, nombre, identificacion, empresa, sector, provincia, cod_cliente
        FROM clientes
        WHERE 1=1
      `;

      if (queryParams.empresa) {
        conditions.push(`empresa = $${paramIndex++}`);
        params.push(queryParams.empresa);
      }
      if (queryParams.sector) {
        conditions.push(`sector = $${paramIndex++}`);
        params.push(queryParams.sector);
      }
      if (queryParams.provincia) {
        conditions.push(`provincia = $${paramIndex++}`);
        params.push(queryParams.provincia);
      }
      if (queryParams.search) {
        conditions.push(`(nombre ILIKE $${paramIndex} OR identificacion ILIKE $${paramIndex} OR cod_cliente::text ILIKE $${paramIndex})`);
        params.push(`%${queryParams.search}%`);
        paramIndex++;
      }

      if (conditions.length > 0) {
        query += " AND " + conditions.join(" AND ");
      }

      query += " ORDER BY nombre LIMIT 100";

      const client = await pool.connect();
      try {
        const dbRes = await client.query(query, params);
        res.end(JSON.stringify(dbRes.rows));
      } finally {
        client.release();
      }
    } else {
      res.statusCode = 404;
      res.end(JSON.stringify({ error: "Not found" }));
    }
  } catch (err) {
    res.statusCode = 500;
    res.end(JSON.stringify({ error: err.message }));
  }
});

server.listen(3000, () => {
  console.log("Clients microservice running on http://localhost:3000");
});
