const { Client } = require('pg');

const client = new Client({
    connectionString: 'postgresql://postgres.uidngmofhtjwaotxcvru:TbY3MeFA5nje0c1t@aws-0-ap-south-1.pooler.supabase.com:5432/postgres'
});

async function createTables() {
    try {
        await client.connect();
        console.log('Connected to database');

        // Create user_makeReceipt table
        console.log('\nCreating user_makeReceipt table...');
        await client.query(`
            CREATE TABLE IF NOT EXISTS user_makeReceipt (
                id TEXT PRIMARY KEY,
                name TEXT NOT NULL,
                email TEXT NOT NULL UNIQUE,
                email_verified BOOLEAN DEFAULT FALSE,
                image TEXT,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
                updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
            );
        `);
        console.log('✅ user_makeReceipt created');

        // Create session_makeReceipt table
        console.log('\nCreating session_makeReceipt table...');
        await client.query(`
            CREATE TABLE IF NOT EXISTS session_makeReceipt (
                id TEXT PRIMARY KEY,
                user_id TEXT NOT NULL REFERENCES user_makeReceipt(id) ON DELETE CASCADE,
                token TEXT NOT NULL UNIQUE,
                expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
                ip_address TEXT,
                user_agent TEXT,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
                updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
            );
        `);
        console.log('✅ session_makeReceipt created');

        // Create account_makeReceipt table (for OAuth - Google, etc.)
        console.log('\nCreating account_makeReceipt table...');
        await client.query(`
            CREATE TABLE IF NOT EXISTS account_makeReceipt (
                id TEXT PRIMARY KEY,
                user_id TEXT NOT NULL REFERENCES user_makeReceipt(id) ON DELETE CASCADE,
                account_id TEXT NOT NULL,
                provider_id TEXT NOT NULL,
                access_token TEXT,
                refresh_token TEXT,
                access_token_expires_at TIMESTAMP WITH TIME ZONE,
                refresh_token_expires_at TIMESTAMP WITH TIME ZONE,
                scope TEXT,
                id_token TEXT,
                password TEXT,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
                updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
            );
        `);
        console.log('✅ account_makeReceipt created');

        // Create verification_makeReceipt table (for email verification)
        console.log('\nCreating verification_makeReceipt table...');
        await client.query(`
            CREATE TABLE IF NOT EXISTS verification_makeReceipt (
                id TEXT PRIMARY KEY,
                identifier TEXT NOT NULL,
                value TEXT NOT NULL,
                expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
                updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
            );
        `);
        console.log('✅ verification_makeReceipt created');

        // Create indexes for performance
        console.log('\nCreating indexes...');
        await client.query(`
            CREATE INDEX IF NOT EXISTS idx_session_user_id_makeReceipt ON session_makeReceipt(user_id);
            CREATE INDEX IF NOT EXISTS idx_session_token_makeReceipt ON session_makeReceipt(token);
            CREATE INDEX IF NOT EXISTS idx_account_user_id_makeReceipt ON account_makeReceipt(user_id);
            CREATE INDEX IF NOT EXISTS idx_account_provider_makeReceipt ON account_makeReceipt(provider_id, account_id);
            CREATE INDEX IF NOT EXISTS idx_user_email_makeReceipt ON user_makeReceipt(email);
        `);
        console.log('✅ Indexes created');

        // Verify created tables
        console.log('\n--- Verification ---');
        const result = await client.query(`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public' 
            AND table_name LIKE '%makeReceipt%'
            ORDER BY table_name;
        `);

        console.log('New makeReceipt tables:');
        result.rows.forEach(r => console.log('✅', r.table_name));

        console.log('\n🎉 All tables created successfully!');

    } catch (err) {
        console.error('❌ Error:', err.message);
    } finally {
        await client.end();
    }
}

createTables();
