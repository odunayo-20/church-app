-- ================================================================
-- Add user_id column to members to link auth accounts
-- ================================================================
ALTER TABLE members ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;
CREATE UNIQUE INDEX IF NOT EXISTS members_user_id_idx ON members(user_id) WHERE user_id IS NOT NULL;

-- ================================================================
-- Messages table: admin-composed or automated messages to members
-- ================================================================
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subject TEXT NOT NULL,
  body TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'general',
  -- 'general' | 'announcement' | 'sermon' | 'event' | 'welcome'
  recipient_type TEXT NOT NULL DEFAULT 'all',
  -- 'all' | 'member'
  recipient_member_id TEXT REFERENCES members(id) ON DELETE SET NULL,
  sent_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  sent_at TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Members can read messages addressed to all, or specifically to themselves
CREATE POLICY "Members can read their messages"
  ON messages FOR SELECT
  USING (
    recipient_type = 'all'
    OR (
      recipient_type = 'member'
      AND recipient_member_id IN (
        SELECT id FROM members
        WHERE members.user_id = auth.uid()
      )
    )
  );

-- Admins can manage all messages
CREATE POLICY "Admins can manage messages"
  ON messages FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles."userId"::text = auth.uid()::text
      AND (profiles.role = 'admin' OR profiles.role = 'media')
    )
  );

-- Trigger for updated_at
CREATE TRIGGER update_messages_updated_at BEFORE UPDATE ON messages
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Update RLS: members can read their own record
CREATE POLICY "Members can view their own record"
  ON members FOR SELECT
  USING (user_id = auth.uid());

-- Members can update their own record (name, phone, birthday, anniversary)
CREATE POLICY "Members can update their own record"
  ON members FOR UPDATE
  USING (user_id = auth.uid());

-- Grant permissions
GRANT ALL ON public.messages TO anon, authenticated, service_role;
