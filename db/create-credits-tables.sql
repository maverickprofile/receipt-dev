-- Credit System Migration SQL
-- Run this in Supabase SQL Editor
-- Creates NEW tables only - does NOT affect existing tables

-- ============================================
-- Table 1: User Credits
-- ============================================
CREATE TABLE IF NOT EXISTS user_credits_makereceipt (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL UNIQUE REFERENCES user_makereceipt(id) ON DELETE CASCADE,
    balance INTEGER NOT NULL DEFAULT 10,
    total_earned INTEGER NOT NULL DEFAULT 10,
    total_spent INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for user_id lookups
CREATE INDEX IF NOT EXISTS idx_user_credits_user_id
ON user_credits_makereceipt(user_id);

-- ============================================
-- Table 2: Credit Transactions (Audit Trail)
-- ============================================
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

-- Index for user_id lookups
CREATE INDEX IF NOT EXISTS idx_credit_transactions_user_id
ON credit_transactions_makereceipt(user_id);

-- Index for sorting by created_at
CREATE INDEX IF NOT EXISTS idx_credit_transactions_created
ON credit_transactions_makereceipt(created_at DESC);

-- ============================================
-- Table 3: Subscriptions
-- ============================================
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

-- Index for user_id lookups
CREATE INDEX IF NOT EXISTS idx_subscription_user_id
ON subscription_makereceipt(user_id);

-- Index for status filtering
CREATE INDEX IF NOT EXISTS idx_subscription_status
ON subscription_makereceipt(status);

-- ============================================
-- Trigger: Auto-initialize 10 credits on signup
-- ============================================
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

-- Drop existing trigger if it exists, then create new one
DROP TRIGGER IF EXISTS trigger_initialize_credits ON user_makereceipt;
CREATE TRIGGER trigger_initialize_credits
AFTER INSERT ON user_makereceipt
FOR EACH ROW
EXECUTE FUNCTION initialize_user_credits();

-- ============================================
-- Done! Tables created:
-- - user_credits_makereceipt
-- - credit_transactions_makereceipt
-- - subscription_makereceipt
--
-- Trigger created:
-- - trigger_initialize_credits (auto-grants 10 credits on signup)
-- ============================================
