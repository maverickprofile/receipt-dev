/**
 * Migration script to create credit system tables
 *
 * Creates NEW tables (does NOT affect existing tables):
 * - user_credits_makereceipt: Stores user credit balance
 * - credit_transactions_makereceipt: Audit trail of credit changes
 * - subscription_makereceipt: Tracks user subscriptions
 *
 * Also creates a trigger to auto-initialize 10 credits on user signup.
 *
 * Run with: node db/create-credits-tables.js
 */

require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

async function createTables() {
    const client = await pool.connect();

    try {
        console.log('Starting migration: Creating credit system tables...\n');

        // Table 1: User Credits
        console.log('Creating user_credits_makereceipt table...');
        await client.query(`
            CREATE TABLE IF NOT EXISTS user_credits_makereceipt (
                id TEXT PRIMARY KEY,
                user_id TEXT NOT NULL UNIQUE REFERENCES user_makereceipt(id) ON DELETE CASCADE,
                balance INTEGER NOT NULL DEFAULT 10,
                total_earned INTEGER NOT NULL DEFAULT 10,
                total_spent INTEGER NOT NULL DEFAULT 0,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
                updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
            );
        `);
        console.log('  -> Table created successfully');

        // Index for user_id lookups
        console.log('Creating index on user_id...');
        await client.query(`
            CREATE INDEX IF NOT EXISTS idx_user_credits_user_id
            ON user_credits_makereceipt(user_id);
        `);
        console.log('  -> Index created successfully');

        // Table 2: Credit Transactions
        console.log('\nCreating credit_transactions_makereceipt table...');
        await client.query(`
            CREATE TABLE IF NOT EXISTS credit_transactions_makereceipt (
                id TEXT PRIMARY KEY,
                user_id TEXT NOT NULL REFERENCES user_makereceipt(id) ON DELETE CASCADE,
                amount INTEGER NOT NULL,
                balance_after INTEGER NOT NULL,
                transaction_type TEXT NOT NULL,
                description TEXT,
                reference_id TEXT,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
            );
        `);
        console.log('  -> Table created successfully');

        // Index for user_id lookups
        console.log('Creating index on user_id...');
        await client.query(`
            CREATE INDEX IF NOT EXISTS idx_credit_transactions_user_id
            ON credit_transactions_makereceipt(user_id);
        `);
        console.log('  -> Index created successfully');

        // Index for sorting by created_at
        console.log('Creating index on created_at...');
        await client.query(`
            CREATE INDEX IF NOT EXISTS idx_credit_transactions_created
            ON credit_transactions_makereceipt(created_at DESC);
        `);
        console.log('  -> Index created successfully');

        // Table 3: Subscriptions
        console.log('\nCreating subscription_makereceipt table...');
        await client.query(`
            CREATE TABLE IF NOT EXISTS subscription_makereceipt (
                id TEXT PRIMARY KEY,
                user_id TEXT NOT NULL UNIQUE REFERENCES user_makereceipt(id) ON DELETE CASCADE,
                plan_type TEXT NOT NULL,
                status TEXT NOT NULL DEFAULT 'active',
                dodo_product_id TEXT,
                dodo_payment_id TEXT,
                credits_per_period INTEGER,
                started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
                expires_at TIMESTAMP WITH TIME ZONE,
                last_credit_grant_at TIMESTAMP WITH TIME ZONE,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
            );
        `);
        console.log('  -> Table created successfully');

        // Index for user_id lookups
        console.log('Creating index on user_id...');
        await client.query(`
            CREATE INDEX IF NOT EXISTS idx_subscription_user_id
            ON subscription_makereceipt(user_id);
        `);
        console.log('  -> Index created successfully');

        // Index for status filtering
        console.log('Creating index on status...');
        await client.query(`
            CREATE INDEX IF NOT EXISTS idx_subscription_status
            ON subscription_makereceipt(status);
        `);
        console.log('  -> Index created successfully');

        // Create trigger function to auto-initialize credits on user signup
        console.log('\nCreating trigger function for auto-initializing credits...');
        await client.query(`
            CREATE OR REPLACE FUNCTION initialize_user_credits()
            RETURNS TRIGGER AS $$
            BEGIN
                -- Insert credit record with 10 free credits
                INSERT INTO user_credits_makereceipt (id, user_id, balance, total_earned, total_spent)
                VALUES (
                    'cred_' || extract(epoch from now())::bigint || '_' || substr(md5(random()::text), 1, 9),
                    NEW.id,
                    10,
                    10,
                    0
                );

                -- Log the signup bonus transaction
                INSERT INTO credit_transactions_makereceipt (id, user_id, amount, balance_after, transaction_type, description)
                VALUES (
                    'tx_' || extract(epoch from now())::bigint || '_' || substr(md5(random()::text), 1, 9),
                    NEW.id,
                    10,
                    10,
                    'signup_bonus',
                    'Welcome bonus - 10 free credits'
                );

                RETURN NEW;
            END;
            $$ LANGUAGE plpgsql;
        `);
        console.log('  -> Trigger function created successfully');

        // Create trigger on user_makereceipt table
        console.log('Creating trigger on user_makereceipt...');
        await client.query(`
            DROP TRIGGER IF EXISTS trigger_initialize_credits ON user_makereceipt;
            CREATE TRIGGER trigger_initialize_credits
            AFTER INSERT ON user_makereceipt
            FOR EACH ROW
            EXECUTE FUNCTION initialize_user_credits();
        `);
        console.log('  -> Trigger created successfully');

        console.log('\n========================================');
        console.log('Migration completed successfully!');
        console.log('========================================');
        console.log('\nNew tables created:');
        console.log('  - user_credits_makereceipt');
        console.log('  - credit_transactions_makereceipt');
        console.log('  - subscription_makereceipt');
        console.log('\nTrigger created:');
        console.log('  - trigger_initialize_credits (auto-grants 10 credits on signup)');
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
