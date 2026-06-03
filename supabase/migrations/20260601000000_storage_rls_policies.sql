-- Políticas de RLS para o bucket car-images no storage

DROP POLICY IF EXISTS "Authenticated users can upload" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete" ON storage.objects;
DROP POLICY IF EXISTS "Public read access" ON storage.objects;

CREATE POLICY "Authenticated users can upload"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'car-images');

CREATE POLICY "Authenticated users can update"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'car-images');

CREATE POLICY "Authenticated users can delete"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'car-images');

CREATE POLICY "Public read access"
ON storage.objects FOR SELECT TO public
USING (bucket_id = 'car-images');
