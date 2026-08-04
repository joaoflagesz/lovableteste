CREATE POLICY "oficina_read" ON storage.objects FOR SELECT TO authenticated USING (bucket_id = 'oficina');
CREATE POLICY "oficina_insert" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'oficina');
CREATE POLICY "oficina_update" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'oficina') WITH CHECK (bucket_id = 'oficina');
CREATE POLICY "oficina_delete" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'oficina');