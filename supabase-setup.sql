-- Create profiles table for user roles
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "userId" UUID UNIQUE NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'member',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view their own profile"
  ON profiles FOR SELECT
  USING (auth.uid()::text = "userId"::text);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (auth.uid()::text = "userId"::text);

CREATE POLICY "Service role can manage all profiles"
  ON profiles FOR ALL
  USING (true);

-- Create members table
CREATE TABLE IF NOT EXISTS members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  birthday DATE,
  anniversary DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view members"
  ON members FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can manage members"
  ON members FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles."userId"::text = auth.uid()::text
      AND profiles.role = 'admin'
    )
  );

-- Create donations table
CREATE TABLE IF NOT EXISTS donations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  amount DECIMAL(10, 2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  reference TEXT UNIQUE NOT NULL,
  member_id UUID NOT NULL REFERENCES members(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE donations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view donations"
  ON donations FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can manage donations"
  ON donations FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles."userId"::text = auth.uid()::text
      AND profiles.role = 'admin'
    )
  );

-- Create posts table
CREATE TABLE IF NOT EXISTS posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  image TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view posts"
  ON posts FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage posts"
  ON posts FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles."userId"::text = auth.uid()::text
      AND profiles.role = 'admin'
    )
  );

-- Create events table
CREATE TABLE IF NOT EXISTS events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  date TIMESTAMPTZ NOT NULL,
  location TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view events"
  ON events FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage events"
  ON events FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles."userId"::text = auth.uid()::text
      AND profiles.role = 'admin'
    )
  );

-- Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  message TEXT NOT NULL,
  member_id UUID NOT NULL REFERENCES members(id) ON DELETE CASCADE,
  sent_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own notifications"
  ON notifications FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM members
      WHERE members.id = notifications.member_id
      AND members.email = (SELECT email FROM auth.users WHERE id = auth.uid())
    )
  );

CREATE POLICY "Admins can manage notifications"
  ON notifications FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles."userId"::text = auth.uid()::text
      AND profiles.role = 'admin'
    )
  );

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply triggers
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_members_updated_at BEFORE UPDATE ON members
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_donations_updated_at BEFORE UPDATE ON donations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_posts_updated_at BEFORE UPDATE ON posts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON events
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_notifications_updated_at BEFORE UPDATE ON notifications
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create contact_messages table
CREATE TABLE IF NOT EXISTS contact_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'unread',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert contact_messages"
  ON contact_messages FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admins can manage contact_messages"
  ON contact_messages FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles."userId"::text = auth.uid()::text
      AND (profiles.role = 'admin' OR profiles.role = 'media')
    )
  );

CREATE TRIGGER update_contact_messages_updated_at BEFORE UPDATE ON contact_messages
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Grant permissions to default roles
GRANT ALL ON public.contact_messages TO anon, authenticated, service_role;


CREATE TABLE IF NOT EXISTS public.settings (
  id              INTEGER PRIMARY KEY DEFAULT 1,
  church_name     TEXT NOT NULL DEFAULT 'Grace Community Church',
  contact_email   TEXT NOT NULL DEFAULT 'contact@example.com',
  contact_phone   TEXT,
  address         TEXT,
  facebook_url    TEXT,
  twitter_url     TEXT,
  instagram_url   TEXT,
  youtube_url     TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT settings_single_row CHECK (id = 1)
);

INSERT INTO public.settings (id, church_name, contact_email)
VALUES (1, 'Grace Community Church', 'contact@example.com')
ON CONFLICT (id) DO NOTHING;

ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated read of settings"
  ON public.settings FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow public read of settings"
  ON public.settings FOR SELECT TO anon USING (true);

-- Grant permissions to default roles to prevent access denied errors
GRANT ALL ON public.settings TO anon, authenticated, service_role;
-- Media Folders Table
CREATE TABLE IF NOT EXISTS media_folders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  parent_id UUID REFERENCES media_folders(id) ON DELETE CASCADE,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Media Files Table
CREATE TABLE IF NOT EXISTS media_files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  folder_id UUID REFERENCES media_folders(id) ON DELETE CASCADE,
  file_path TEXT NOT NULL UNIQUE,
  file_type TEXT NOT NULL,
  size INTEGER NOT NULL,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE media_folders ENABLE ROW LEVEL SECURITY;
ALTER TABLE media_files ENABLE ROW LEVEL SECURITY;

-- Policies for media_folders
DROP POLICY IF EXISTS "Anyone can view folders" ON media_folders;
CREATE POLICY "Anyone can view folders"
  ON media_folders FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Admins and Media can manage folders" ON media_folders;
CREATE POLICY "Admins and Media can manage folders"
  ON media_folders FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles."userId" = auth.uid()::text
      AND profiles.role IN ('admin', 'media')
    )
  );

-- Policies for media_files
DROP POLICY IF EXISTS "Anyone can view files" ON media_files;
CREATE POLICY "Anyone can view files"
  ON media_files FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Admins and Media can manage files" ON media_files;
CREATE POLICY "Admins and Media can manage files"
  ON media_files FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles."userId" = auth.uid()::text
      AND profiles.role IN ('admin', 'media')
    )
  );

-- Triggers for updatedAt
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW."updatedAt" = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_media_folders_updated_at ON media_folders;
CREATE TRIGGER update_media_folders_updated_at BEFORE UPDATE ON media_folders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_media_files_updated_at ON media_files;
CREATE TRIGGER update_media_files_updated_at BEFORE UPDATE ON media_files
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Grant permissions
GRANT ALL ON TABLE media_folders TO service_role;
GRANT ALL ON TABLE media_files TO service_role;
GRANT ALL ON TABLE media_folders TO postgres;
GRANT ALL ON TABLE media_files TO postgres;
GRANT SELECT ON TABLE media_folders TO anon, authenticated;
GRANT SELECT ON TABLE media_files TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON TABLE media_folders TO authenticated;
GRANT INSERT, UPDATE, DELETE ON TABLE media_files TO authenticated;

-- Storage Setup (Run this to ensure bucket exists and is public)
-- Note: This requires the storage schema to exist (standard in Supabase)
INSERT INTO storage.buckets (id, name, public)
VALUES ('media', 'media', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Storage Policies
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'media' );

DROP POLICY IF EXISTS "Authenticated Upload" ON storage.objects;
CREATE POLICY "Authenticated Upload"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK ( bucket_id = 'media' );

DROP POLICY IF EXISTS "Service Role Full Access" ON storage.objects;
CREATE POLICY "Service Role Full Access"
ON storage.objects FOR ALL
TO service_role
USING ( bucket_id = 'media' )
WITH CHECK ( bucket_id = 'media' );

-- Create newsletter_subscribers table
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  status TEXT NOT NULL DEFAULT 'active', -- active, unsubscribed
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create newsletters table
CREATE TABLE IF NOT EXISTS newsletters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subject TEXT NOT NULL,
  content TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft', -- draft, sent
  sent_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletters ENABLE ROW LEVEL SECURITY;

-- Policies for newsletter_subscribers
CREATE POLICY "Anyone can subscribe to newsletter"
  ON newsletter_subscribers FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admins can manage newsletter_subscribers"
  ON newsletter_subscribers FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles."userId"::text = auth.uid()::text
      AND profiles.role = 'admin'
    )
  );

-- Policies for newsletters
CREATE POLICY "Admins can manage newsletters"
  ON newsletters FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles."userId"::text = auth.uid()::text
      AND profiles.role = 'admin'
    )
  );

-- Apply triggers for updated_at
CREATE TRIGGER update_newsletter_subscribers_updated_at BEFORE UPDATE ON newsletter_subscribers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_newsletters_updated_at BEFORE UPDATE ON newsletters
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Grant permissions
GRANT ALL ON public.newsletter_subscribers TO anon, authenticated, service_role;
GRANT ALL ON public.newsletters TO anon, authenticated, service_role;
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
-- ================================================================
-- Testimonies table: public submissions and admin moderation
-- ================================================================
CREATE TABLE IF NOT EXISTS testimonies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending', -- 'pending' | 'approved' | 'rejected'
  "isFeatured" BOOLEAN NOT NULL DEFAULT false,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE testimonies ENABLE ROW LEVEL SECURITY;

-- Anyone can read approved testimonies
CREATE POLICY "Anyone can view approved testimonies"
  ON testimonies FOR SELECT
  USING (status = 'approved');

-- Anyone can submit a testimony
CREATE POLICY "Anyone can insert testimonies"
  ON testimonies FOR INSERT
  WITH CHECK (true);

-- Admins/Media can manage all testimonies
CREATE POLICY "Admins can manage testimonies"
  ON testimonies FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles."userId"::text = auth.uid()::text
      AND (profiles.role = 'admin' OR profiles.role = 'media')
    )
  );

-- Trigger for update_updated_at_column if exists
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW."updatedAt" = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_testimonies_updated_at ON testimonies;
CREATE TRIGGER update_testimonies_updated_at BEFORE UPDATE ON testimonies
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Grant permissions to default roles
GRANT ALL ON public.testimonies TO anon, authenticated, service_role;
