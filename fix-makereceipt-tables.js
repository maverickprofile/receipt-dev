const { Client } = require('pg');

const client = new Client({
    connectionString: 'postgresql://postgres.uidngmofhtjwaotxcvru:TbY3MeFA5nje0c1t@aws-0-ap-south-1.pooler.supabase.com:5432/postgres'
});

async function fixTables() {
    try {
        await client.connect();
        console.log('Connected to database');

        // Drop existing makeReceipt tables and recreate with correct column names
        console.log('\nDropping existing makeReceipt tables...');
        await client.query(`
            DROP TABLE IF EXISTS verification_makereceipt CASCADE;
            DROP TABLE IF EXISTS account_makereceipt CASCADE;
            DROP TABLE IF EXISTS session_makereceipt CASCADE;
            DROP TABLE IF EXISTS user_makereceipt CASCADE;
        `);
        console.log('✅ Dropped old tables');

        // Create user_makereceipt table with Better Auth expected columns (camelCase)
        console.log('\nCreating user_makereceipt table...');
        await client.query(`
            CREATE TABLE user_makereceipt (
                id TEXT PRIMARY KEY,
                name TEXT NOT NULL,
                email TEXT NOT NULL UNIQUE,
                "emailVerified" BOOLEAN DEFAULT FALSE,
                image TEXT,
                "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
                "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
            );
        `);
        console.log('✅ user_makereceipt created');

        // Create session_makereceipt table
        console.log('\nCreating session_makereceipt table...');
        await client.query(`
            CREATE TABLE session_makereceipt (
                id TEXT PRIMARY KEY,
                "userId" TEXT NOT NULL REFERENCES user_makereceipt(id) ON DELETE CASCADE,
                token TEXT NOT NULL UNIQUE,
                "expiresAt" TIMESTAMP WITH TIME ZONE NOT NULL,
                "ipAddress" TEXT,
                "userAgent" TEXT,
                "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
                "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
            );
        `);
        console.log('✅ session_makereceipt created');

        // Create account_makereceipt table
        console.log('\nCreating account_makereceipt table...');
        await client.query(`
            CREATE TABLE account_makereceipt (
                id TEXT PRIMARY KEY,
                "userId" TEXT NOT NULL REFERENCES user_makereceipt(id) ON DELETE CASCADE,
                "accountId" TEXT NOT NULL,
                "providerId" TEXT NOT NULL,
                "accessToken" TEXT,
                "refreshToken" TEXT,
                "accessTokenExpiresAt" TIMESTAMP WITH TIME ZONE,
                "refreshTokenExpiresAt" TIMESTAMP WITH TIME ZONE,
                scope TEXT,
                "idToken" TEXT,
                password TEXT,
                "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
                "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
            );
        `);
        console.log('✅ account_makereceipt created');

        // Create verification_makereceipt table
        console.log('\nCreating verification_makereceipt table...');
        await client.query(`
            CREATE TABLE verification_makereceipt (
                id TEXT PRIMARY KEY,
                identifier TEXT NOT NULL,
                value TEXT NOT NULL,
                "expiresAt" TIMESTAMP WITH TIME ZONE NOT NULL,
                "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
                "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
            );
        `);
        console.log('✅ verification_makereceipt created');

        // Create indexes
        console.log('\nCreating indexes...');
        await client.query(`
            CREATE INDEX idx_session_userId_makereceipt ON session_makereceipt("userId");
            CREATE INDEX idx_session_token_makereceipt ON session_makereceipt(token);
            CREATE INDEX idx_account_userId_makereceipt ON account_makereceipt("userId");
            CREATE INDEX idx_account_provider_makereceipt ON account_makereceipt("providerId", "accountId");
            CREATE INDEX idx_user_email_makereceipt ON user_makereceipt(email);
        `);
        console.log('✅ Indexes created');

        // Verify
        console.log('\n--- Verification: Checking columns ---');
        const result = await client.query(`
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name = 'verification_makereceipt'
            ORDER BY ordinal_position;
        `);

        console.log('verification_makereceipt columns:');
        result.rows.forEach(r => console.log('-', r.column_name));

        console.log('\n🎉 All tables recreated with correct column names!');

    } catch (err) {
        console.error('❌ Error:', err.message);
    } finally {
        await client.end();
    }
}

fixTables();
