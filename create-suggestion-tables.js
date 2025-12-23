const { Client } = require('pg');

const client = new Client({
    connectionString: 'postgresql://postgres.uidngmofhtjwaotxcvru:TbY3MeFA5nje0c1t@aws-0-ap-south-1.pooler.supabase.com:5432/postgres'
});

async function createSuggestionTables() {
    try {
        await client.connect();
        console.log('Connected to database');

        // Create suggestion_makeReceipt table
        console.log('\nCreating suggestion_makeReceipt table...');
        await client.query(`
            CREATE TABLE IF NOT EXISTS suggestion_makeReceipt (
                id TEXT PRIMARY KEY,
                title TEXT NOT NULL,
                description TEXT,
                status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'in_progress', 'done')),
                "userId" TEXT REFERENCES user_makereceipt(id) ON DELETE SET NULL,
                "userName" TEXT,
                "userImage" TEXT,
                "upvotes" INTEGER DEFAULT 0,
                "downvotes" INTEGER DEFAULT 0,
                "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
                "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
            );
        `);
        console.log('✅ suggestion_makeReceipt created');

        // Create suggestion_vote_makeReceipt table (to track who voted)
        console.log('\nCreating suggestion_vote_makeReceipt table...');
        await client.query(`
            CREATE TABLE IF NOT EXISTS suggestion_vote_makeReceipt (
                id TEXT PRIMARY KEY,
                "suggestionId" TEXT NOT NULL REFERENCES suggestion_makeReceipt(id) ON DELETE CASCADE,
                "userId" TEXT REFERENCES user_makereceipt(id) ON DELETE CASCADE,
                "voteType" TEXT NOT NULL CHECK ("voteType" IN ('up', 'down')),
                "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
                UNIQUE("suggestionId", "userId")
            );
        `);
        console.log('✅ suggestion_vote_makeReceipt created');

        // Create suggestion_comment_makeReceipt table
        console.log('\nCreating suggestion_comment_makeReceipt table...');
        await client.query(`
            CREATE TABLE IF NOT EXISTS suggestion_comment_makeReceipt (
                id TEXT PRIMARY KEY,
                "suggestionId" TEXT NOT NULL REFERENCES suggestion_makeReceipt(id) ON DELETE CASCADE,
                "userId" TEXT REFERENCES user_makereceipt(id) ON DELETE SET NULL,
                "userName" TEXT DEFAULT 'Anon',
                "userImage" TEXT,
                content TEXT NOT NULL,
                "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
                "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
            );
        `);
        console.log('✅ suggestion_comment_makeReceipt created');

        // Create indexes
        console.log('\nCreating indexes...');
        await client.query(`
            CREATE INDEX IF NOT EXISTS idx_suggestion_status ON suggestion_makeReceipt(status);
            CREATE INDEX IF NOT EXISTS idx_suggestion_userId ON suggestion_makeReceipt("userId");
            CREATE INDEX IF NOT EXISTS idx_suggestion_createdAt ON suggestion_makeReceipt("createdAt");
            CREATE INDEX IF NOT EXISTS idx_vote_suggestionId ON suggestion_vote_makeReceipt("suggestionId");
            CREATE INDEX IF NOT EXISTS idx_vote_userId ON suggestion_vote_makeReceipt("userId");
            CREATE INDEX IF NOT EXISTS idx_comment_suggestionId ON suggestion_comment_makeReceipt("suggestionId");
        `);
        console.log('✅ Indexes created');

        // Verify tables
        console.log('\n--- Verification ---');
        const result = await client.query(`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public' 
            AND table_name LIKE '%suggestion%'
            ORDER BY table_name;
        `);

        console.log('Suggestion tables created:');
        result.rows.forEach(r => console.log('✅', r.table_name));

        // Show columns for main suggestion table
        console.log('\n--- suggestion_makeReceipt columns ---');
        const cols = await client.query(`
            SELECT column_name, data_type 
            FROM information_schema.columns 
            WHERE table_name = 'suggestion_makereceipt'
            ORDER BY ordinal_position;
        `);
        cols.rows.forEach(r => console.log(`  - ${r.column_name}: ${r.data_type}`));

        console.log('\n🎉 All suggestion tables created successfully!');

    } catch (err) {
        console.error('❌ Error:', err.message);
    } finally {
        await client.end();
    }
}

createSuggestionTables();
