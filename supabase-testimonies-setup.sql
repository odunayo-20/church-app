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
