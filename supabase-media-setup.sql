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
