-- Create storage bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('provider-photos', 'provider-photos', true)
ON CONFLICT (id) DO NOTHING;

-- Policy 1: Allow authenticated users to upload their own files
CREATE POLICY "Allow authenticated users to upload their own files"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'provider-photos'
  AND (auth.uid()::text = (storage.foldername(name))[1])
);

-- Policy 2: Allow public read access
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
