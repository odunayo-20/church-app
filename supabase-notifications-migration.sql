-- ================================================================
-- NOTIFICATIONS TABLE: Full schema migration + constraint fixes
-- Run this in the Supabase SQL Editor (Project > SQL Editor > New Query)
-- All statements are idempotent — safe to run multiple times
-- ================================================================

-- Ensure the table exists
CREATE TABLE IF NOT EXISTS notifications (
  id TEXT PRIMARY KEY
);

-- Core columns
ALTER TABLE notifications ADD COLUMN IF NOT EXISTS member_id   TEXT;
ALTER TABLE notifications ADD COLUMN IF NOT EXISTS message     TEXT;
ALTER TABLE notifications ADD COLUMN IF NOT EXISTS type        TEXT NOT NULL DEFAULT 'general';
ALTER TABLE notifications ADD COLUMN IF NOT EXISTS status      TEXT NOT NULL DEFAULT 'pending';
ALTER TABLE notifications ADD COLUMN IF NOT EXISTS metadata    JSONB;
ALTER TABLE notifications ADD COLUMN IF NOT EXISTS sent_at     TIMESTAMPTZ;
ALTER TABLE notifications ADD COLUMN IF NOT EXISTS created_at  TIMESTAMPTZ NOT NULL DEFAULT now();
ALTER TABLE notifications ADD COLUMN IF NOT EXISTS updated_at  TIMESTAMPTZ NOT NULL DEFAULT now();

-- !! CRITICAL: Drop NOT NULL from sent_at if it was previously added that way.
-- This prevents the "invalid input syntax for type timestamp: null" error.
ALTER TABLE notifications ALTER COLUMN sent_at DROP NOT NULL;

-- Grant service role full access
GRANT ALL ON public.notifications TO service_role;

-- Indexes
CREATE INDEX IF NOT EXISTS notifications_status_idx      ON notifications(status);
CREATE INDEX IF NOT EXISTS notifications_type_idx        ON notifications(type);
CREATE INDEX IF NOT EXISTS notifications_created_at_idx  ON notifications(created_at DESC);
CREATE INDEX IF NOT EXISTS notifications_member_type_idx ON notifications(member_id, type, created_at);

-- ================================================================
-- MEMBERS TABLE: Add user_id for self-service profile linking
-- ================================================================
ALTER TABLE members ADD COLUMN IF NOT EXISTS user_id TEXT;
CREATE INDEX IF NOT EXISTS members_user_id_idx ON members(user_id);

-- ================================================================
-- PROFILES TABLE: Add name column if missing
-- ================================================================
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS name TEXT;

-- ================================================================
-- Done! Refresh your Notifications admin page after running this.
-- ================================================================
