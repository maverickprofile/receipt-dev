const { Client } = require('pg');

const client = new Client({
    connectionString: 'postgresql://postgres.uidngmofhtjwaotxcvru:TbY3MeFA5nje0c1t@aws-0-ap-south-1.pooler.supabase.com:5432/postgres'
});

async function checkColumns() {
    try {
        await client.connect();

        const tables = ['user_makereceipt', 'session_makereceipt', 'account_makereceipt', 'verification_makereceipt'];

        for (const table of tables) {
            const result = await client.query(`
                SELECT column_name 
                FROM information_schema.columns 
                WHERE table_name = $1
                ORDER BY ordinal_position;
            `, [table]);

            console.log(`\n${table}:`);
            result.rows.forEach(r => console.log('  -', r.column_name));
        }

    } catch (err) {
        console.error('Error:', err.message);
    } finally {
        await client.end();
    }
}

checkColumns();
