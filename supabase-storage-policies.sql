-- ============================================
-- Supabase Storage Setup for Profile Photos
-- ============================================

-- 1. Create storage bucket if it doesn't exist (PUBLIC)
INSERT INTO storage.buckets (id, name, public)
VALUES ('provider-photos', 'provider-photos', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- 2. Drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Allow authenticated users to upload their own files" ON storage.objects;
DROP POLICY IF EXISTS "Allow public read access" ON storage.objects;
DROP POLICY IF EXISTS "Allow users to update their own files" ON storage.objects;
DROP POLICY IF EXISTS "Allow users to delete their own files" ON storage.objects;

-- 3. Create new policies

-- Policy 1: Allow authenticated users to upload their own files
CREATE POLICY "Allow authenticated users to upload their own files"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'provider-photos'
  AND (auth.uid()::text = (storage.foldername(name))[1])
);

-- Policy 2: Allow public read access (CRITICAL for displaying images)
CREATE POLICY "Allow public read access"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'provider-photos');

-- Policy 3: Allow users to update their own files
CREATE POLICY "Allow users to update their own files"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'provider-photos'
  AND (auth.uid()::text = (storage.foldername(name))[1])
)
WITH CHECK (
  bucket_id = 'provider-photos'
  AND (auth.uid()::text = (storage.foldername(name))[1])
);

-- Policy 4: Allow users to delete their own files
CREATE POLICY "Allow users to delete their own files"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'provider-photos'
  AND (auth.uid()::text = (storage.foldername(name))[1])
);

-- ============================================
-- Verification Queries
-- ============================================

-- Check bucket configuration
SELECT id, name, public FROM storage.buckets WHERE id = 'provider-photos';

-- Check policies
SELECT schemaname, tablename, policyname
FROM pg_policies
WHERE tablename = 'objects'
AND policyname LIKE '%provider%';
