const { Client } = require('pg');

const client = new Client({
    connectionString: 'postgresql://postgres.uidngmofhtjwaotxcvru:TbY3MeFA5nje0c1t@aws-0-ap-south-1.pooler.supabase.com:5432/postgres'
});

async function listTables() {
    try {
        await client.connect();
        console.log('Connected to database');

        const result = await client.query(`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public' 
            ORDER BY table_name;
        `);

        console.log('\nExisting tables in public schema:');
        result.rows.forEach(r => console.log('-', r.table_name));

    } catch (err) {
        console.error('Error:', err.message);
    } finally {
        await client.end();
    }
}

listTables();
