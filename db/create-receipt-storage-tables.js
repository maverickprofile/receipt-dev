/**
 * Migration script to create receipt storage tables
 *
 * Creates two NEW tables (does NOT affect existing tables):
 * - saved_receipt_makereceipt: Stores user's saved receipts
 * - download_history_makereceipt: Tracks download history
 *
 * Run with: node db/create-receipt-storage-tables.js
 */

require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

async function createTables() {
    const client = await pool.connect();

    try {
        console.log('Starting migration: Creating receipt storage tables...\n');

        // Table 1: Saved Receipts
        console.log('Creating saved_receipt_makereceipt table...');
        await client.query(`
            CREATE TABLE IF NOT EXISTS saved_receipt_makereceipt (
                id TEXT PRIMARY KEY,
                user_id TEXT NOT NULL REFERENCES user_makereceipt(id) ON DELETE CASCADE,
                name TEXT NOT NULL,
                template_id TEXT,
                receipt_data JSONB NOT NULL,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
                updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
            );
        `);
        console.log('  -> Table created successfully');

        // Index for user_id lookups
        console.log('Creating index on user_id...');
        await client.query(`
            CREATE INDEX IF NOT EXISTS idx_saved_receipt_user_id
            ON saved_receipt_makereceipt(user_id);
        `);
        console.log('  -> Index created successfully');

        // Index for sorting by updated_at
        console.log('Creating index on updated_at...');
        await client.query(`
            CREATE INDEX IF NOT EXISTS idx_saved_receipt_updated
            ON saved_receipt_makereceipt(updated_at DESC);
        `);
        console.log('  -> Index created successfully');

        // Table 2: Download History
        console.log('\nCreating download_history_makereceipt table...');
        await client.query(`
            CREATE TABLE IF NOT EXISTS download_history_makereceipt (
                id TEXT PRIMARY KEY,
                user_id TEXT NOT NULL REFERENCES user_makereceipt(id) ON DELETE CASCADE,
                receipt_id TEXT REFERENCES saved_receipt_makereceipt(id) ON DELETE SET NULL,
                template_id TEXT,
                template_name TEXT,
                download_type TEXT NOT NULL,
                downloaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
            );
        `);
        console.log('  -> Table created successfully');

        // Index for user_id lookups
        console.log('Creating index on user_id...');
        await client.query(`
            CREATE INDEX IF NOT EXISTS idx_download_history_user_id
            ON download_history_makereceipt(user_id);
        `);
        console.log('  -> Index created successfully');

        // Index for sorting by downloaded_at
        console.log('Creating index on downloaded_at...');
        await client.query(`
            CREATE INDEX IF NOT EXISTS idx_download_history_downloaded
            ON download_history_makereceipt(downloaded_at DESC);
        `);
        console.log('  -> Index created successfully');

        console.log('\n========================================');
        console.log('Migration completed successfully!');
        console.log('========================================');
        console.log('\nNew tables created:');
        console.log('  - saved_receipt_makereceipt');
        console.log('  - download_history_makereceipt');
        console.log('\nExisting tables were NOT modified.');

    } catch (error) {
        console.error('\nMigration failed:', error.message);
        throw error;
    } finally {
        client.release();
        await pool.end();
    }
}

createTables().catch((err) => {
    console.error('Migration error:', err);
    process.exit(1);
});
