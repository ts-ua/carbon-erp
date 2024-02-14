ALTER TABLE "quote" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Employees with sales_view can view quotes" ON "quote"
  FOR SELECT
  USING (
    coalesce(get_my_claim('sales_view')::boolean, false) = true
    AND (get_my_claim('role'::text)) = '"employee"'::jsonb);

CREATE POLICY "Customers with sales_view can their own quotes" ON "quote"
  FOR SELECT
  USING (
    coalesce(get_my_claim('sales_view')::boolean, false) = true 
    AND (get_my_claim('role'::text)) = '"customer"'::jsonb 
    AND "customerId" IN (
      SELECT "customerId" FROM "customerAccount" WHERE id::uuid = auth.uid()
    )
  );

CREATE POLICY "Employees with sales_create can create quotes" ON "quote"
  FOR INSERT
  WITH CHECK (coalesce(get_my_claim('sales_create')::boolean,false) AND (get_my_claim('role'::text)) = '"employee"'::jsonb);


CREATE POLICY "Employees with sales_update can update quotes" ON "quote"
  FOR UPDATE
  USING (coalesce(get_my_claim('sales_update')::boolean,false) AND (get_my_claim('role'::text)) = '"employee"'::jsonb);

CREATE POLICY "Customers with sales_update can their own quotes" ON "quote"
  FOR UPDATE
  USING (
    coalesce(get_my_claim('sales_update')::boolean, false) = true 
    AND (get_my_claim('role'::text)) = '"customer"'::jsonb 
    AND "customerId" IN (
      SELECT "customerId" FROM "customerAccount" WHERE id::uuid = auth.uid()
    )
  );

CREATE POLICY "Employees with sales_delete can delete quotes" ON "quote"
  FOR DELETE
  USING (coalesce(get_my_claim('sales_delete')::boolean, false) = true AND (get_my_claim('role'::text)) = '"employee"'::jsonb);


CREATE POLICY "Customers with sales_view can search for their own quotes" ON "search"
  FOR SELECT
  USING (
    coalesce(get_my_claim('sales_view')::boolean, false) = true 
    AND (get_my_claim('role'::text)) = '"customer"'::jsonb
    AND entity = 'Quotation' 
    AND uuid IN (
        SELECT id FROM "quote" WHERE "customerId" IN (
          SELECT "customerId" FROM "quote" WHERE "customerId" IN (
            SELECT "customerId" FROM "customerAccount" WHERE id::uuid = auth.uid()
          )
        )
      )
  );

-- Quotation Lines

ALTER TABLE "quoteLine" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Employees with sales_view can view quote lines" ON "quoteLine"
  FOR SELECT
  USING (coalesce(get_my_claim('sales_view')::boolean, false) = true AND (get_my_claim('role'::text)) = '"employee"'::jsonb);

CREATE POLICY "Customers with sales_view can their own quote lines" ON "quoteLine"
  FOR SELECT
  USING (
    coalesce(get_my_claim('sales_view')::boolean, false) = true 
    AND (get_my_claim('role'::text)) = '"customer"'::jsonb 
    AND "quoteId" IN (
      SELECT id FROM "quote" WHERE "customerId" IN (
        SELECT "customerId" FROM "quote" WHERE "customerId" IN (
          SELECT "customerId" FROM "customerAccount" WHERE id::uuid = auth.uid()
        )
      )
    )
  );

CREATE POLICY "Employees with sales_create can create quote lines" ON "quoteLine"
  FOR INSERT
  WITH CHECK (coalesce(get_my_claim('sales_create')::boolean,false) AND (get_my_claim('role'::text)) = '"employee"'::jsonb);

CREATE POLICY "Customers with sales_create can create lines on their own quote" ON "quoteLine"
  FOR INSERT
  WITH CHECK (
    coalesce(get_my_claim('sales_create')::boolean, false) = true 
    AND (get_my_claim('role'::text)) = '"customer"'::jsonb 
    AND "quoteId" IN (
      SELECT id FROM "quote" WHERE "customerId" IN (
        SELECT "customerId" FROM "quote" WHERE "customerId" IN (
          SELECT "customerId" FROM "customerAccount" WHERE id::uuid = auth.uid()
        )
      )
    )
  );

CREATE POLICY "Employees with sales_update can update quote lines" ON "quoteLine"
  FOR UPDATE
  USING (coalesce(get_my_claim('sales_update')::boolean,false) AND (get_my_claim('role'::text)) = '"employee"'::jsonb);

CREATE POLICY "Customers with sales_update can their own quote lines" ON "quoteLine"
  FOR UPDATE
  USING (
    coalesce(get_my_claim('sales_update')::boolean, false) = true 
    AND (get_my_claim('role'::text)) = '"customer"'::jsonb 
    AND "quoteId" IN (
      SELECT id FROM "quote" WHERE "customerId" IN (
        SELECT "customerId" FROM "quote" WHERE "customerId" IN (
          SELECT "customerId" FROM "customerAccount" WHERE id::uuid = auth.uid()
        )
      )
    )
  );

CREATE POLICY "Employees with sales_delete can delete quote lines" ON "quoteLine"
  FOR DELETE
  USING (coalesce(get_my_claim('sales_delete')::boolean, false) = true AND (get_my_claim('role'::text)) = '"employee"'::jsonb);

CREATE POLICY "Customers with sales_delete can delete lines on their own quote" ON "quoteLine"
  FOR DELETE
  USING (
    coalesce(get_my_claim('sales_delete')::boolean, false) = true 
    AND (get_my_claim('role'::text)) = '"customer"'::jsonb 
    AND "quoteId" IN (
      SELECT id FROM "quote" WHERE "customerId" IN (
        SELECT "customerId" FROM "quote" WHERE "customerId" IN (
          SELECT "customerId" FROM "customerAccount" WHERE id::uuid = auth.uid()
        )
      )
    )
  );


-- Search

CREATE FUNCTION public.create_quotation_search_result()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.search(name, description, entity, uuid, link)
  VALUES (new."quoteId", new.name, 'Quotation', new.id, '/x/quote/' || new.id);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER create_quotation_search_result
  AFTER INSERT on public."quote"
  FOR EACH ROW EXECUTE PROCEDURE public.create_quotation_search_result();

CREATE FUNCTION public.update_quotation_search_result()
RETURNS TRIGGER AS $$
BEGIN
  IF (old."quoteId" <> new."quoteId" OR old."name" <> new."name") THEN
    UPDATE public.search SET name = new."quoteId", description = new.description
    WHERE entity = 'Quotation' AND uuid = new.id;
  END IF;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER update_quotation_search_result
  AFTER UPDATE on public."quote"
  FOR EACH ROW EXECUTE PROCEDURE public.update_quotation_search_result();

CREATE FUNCTION public.delete_quotation_search_result()
RETURNS TRIGGER AS $$
BEGIN
  DELETE FROM public.search WHERE entity = 'Quotation' AND uuid = old.id;
  RETURN old;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER delete_quotation_search_result
  AFTER DELETE on public."quote"
  FOR EACH ROW EXECUTE PROCEDURE public.delete_quotation_search_result();