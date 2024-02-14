INSERT INTO storage.buckets (id, name, public)
VALUES 
  ('quote-internal', 'quote-internal', false),
  ('quote-external', 'quote-external', false);

-- Internal quote documents

CREATE POLICY "Internal quote documents view requires sales_view" ON storage.objects 
FOR SELECT USING (
    bucket_id = 'quote-internal'
    AND (auth.role() = 'authenticated')
    AND coalesce(get_my_claim('sales_view')::boolean, false) = true
    AND (get_my_claim('role'::text)) = '"employee"'::jsonb
);

CREATE POLICY "Internal quote documents insert requires sales_create" ON storage.objects 
FOR INSERT WITH CHECK (
    bucket_id = 'quote-internal'
    AND (auth.role() = 'authenticated')
    AND coalesce(get_my_claim('sales_create')::boolean, false) = true
    AND (get_my_claim('role'::text)) = '"employee"'::jsonb
);

CREATE POLICY "Internal quote documents update requires sales_update" ON storage.objects 
FOR UPDATE USING (
    bucket_id = 'quote-internal'
    AND (auth.role() = 'authenticated')
    AND coalesce(get_my_claim('sales_update')::boolean, false) = true
    AND (get_my_claim('role'::text)) = '"employee"'::jsonb
);

CREATE POLICY "Internal quote documents delete requires sales_delete" ON storage.objects 
FOR DELETE USING (
    bucket_id = 'quote-internal'
    AND (auth.role() = 'authenticated')
    AND coalesce(get_my_claim('sales_delete')::boolean, false) = true
    AND (get_my_claim('role'::text)) = '"employee"'::jsonb
);

-- External quote documents

CREATE POLICY "External quote documents view requires sales_view" ON storage.objects 
FOR SELECT USING (
    bucket_id = 'quote-external'
    AND (auth.role() = 'authenticated')
    AND coalesce(get_my_claim('sales_view')::boolean, false) = true
    AND (
      (get_my_claim('role'::text)) = '"employee"'::jsonb OR
      (
        (get_my_claim('role'::text)) = '"customer"'::jsonb
      )
    )
);

CREATE POLICY "External quote documents insert requires sales_view" ON storage.objects 
FOR INSERT WITH CHECK (
    bucket_id = 'quote-external'
    AND (auth.role() = 'authenticated')
    AND coalesce(get_my_claim('sales_view')::boolean, false) = true
    AND (
      (get_my_claim('role'::text)) = '"employee"'::jsonb OR
      (
        (get_my_claim('role'::text)) = '"customer"'::jsonb
      )
    )
);

CREATE POLICY "External quote documents update requires sales_update" ON storage.objects 
FOR UPDATE USING (
    bucket_id = 'quote-external'
    AND (auth.role() = 'authenticated')
    AND coalesce(get_my_claim('sales_update')::boolean, false) = true
    AND (
      (get_my_claim('role'::text)) = '"employee"'::jsonb OR
      (
        (get_my_claim('role'::text)) = '"customer"'::jsonb
      )
    )
);

CREATE POLICY "External quote documents delete requires sales_delete" ON storage.objects 
FOR DELETE USING (
    bucket_id = 'quote-external'
    AND (auth.role() = 'authenticated')
    AND coalesce(get_my_claim('sales_delete')::boolean, false) = true
    AND (
      (get_my_claim('role'::text)) = '"employee"'::jsonb OR
      (
        (get_my_claim('role'::text)) = '"customer"'::jsonb
      )
    )
);