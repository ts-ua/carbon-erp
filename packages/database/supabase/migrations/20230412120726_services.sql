CREATE TYPE "serviceType" AS ENUM (
  'Internal',
  'External'
);

CREATE TABLE "service" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "description" TEXT,
  "blocked" BOOLEAN NOT NULL DEFAULT false,
  "partGroupId" TEXT,
  "serviceType" "serviceType" NOT NULL,
  "active" BOOLEAN NOT NULL DEFAULT true,
  "approved" BOOLEAN NOT NULL DEFAULT false,
  "approvedBy" TEXT,
  "fromDate" DATE,
  "toDate" DATE,
  "createdBy" TEXT NOT NULL,
  "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  "updatedBy" TEXT,
  "updatedAt" TIMESTAMP WITH TIME ZONE,

  CONSTRAINT "service_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "service_partGroupId_fkey" FOREIGN KEY ("partGroupId") REFERENCES "partGroup"("id"),
  CONSTRAINT "service_approvedBy_fkey" FOREIGN KEY ("approvedBy") REFERENCES "user"("id"),
  CONSTRAINT "service_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "user"("id"),
  CONSTRAINT "service_updatedBy_fkey" FOREIGN KEY ("updatedBy") REFERENCES "user"("id")
);

CREATE POLICY "Employees can view services" ON "service"
  FOR SELECT
  USING (
    (get_my_claim('role'::text)) = '"employee"'::jsonb
  );

CREATE POLICY "Employees with parts_create can insert services" ON "service"
  FOR INSERT
  WITH CHECK (   
    coalesce(get_my_claim('parts_create')::boolean,false) 
    AND (get_my_claim('role'::text)) = '"employee"'::jsonb
  );

CREATE POLICY "Employees with parts_update can update services" ON "service"
  FOR UPDATE
  USING (
    coalesce(get_my_claim('parts_update')::boolean, false) = true 
    AND (get_my_claim('role'::text)) = '"employee"'::jsonb
  );

CREATE POLICY "Employees with parts_delete can delete services" ON "service"
  FOR DELETE
  USING (
    coalesce(get_my_claim('parts_delete')::boolean, false) = true 
    AND (get_my_claim('role'::text)) = '"employee"'::jsonb
  );


CREATE TABLE "serviceSupplier" (
  "id" TEXT NOT NULL DEFAULT xid(),
  "serviceId" TEXT NOT NULL,
  "supplierId" TEXT NOT NULL,
  "supplierServiceId" TEXT,
  "active" BOOLEAN NOT NULL DEFAULT true,
  "createdBy" TEXT NOT NULL,
  "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  "updatedBy" TEXT,
  "updatedAt" TIMESTAMP WITH TIME ZONE,

  CONSTRAINT "serviceSupplier_id_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "serviceSupplier_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "service"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "serviceSupplier_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "supplier"("id") ON DELETE CASCADE,
  CONSTRAINT "serviceSupplier_service_supplier_unique" UNIQUE ("serviceId", "supplierId"),
  CONSTRAINT "serviceSupplier_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "user"("id"),
  CONSTRAINT "serviceSupplier_updatedBy_fkey" FOREIGN KEY ("updatedBy") REFERENCES "user"("id")
);

CREATE INDEX "serviceSupplier_serviceId_index" ON "serviceSupplier"("serviceId");

ALTER TABLE "serviceSupplier" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Employees with part_view can view service suppliers" ON "serviceSupplier"
  FOR SELECT
  USING (
    coalesce(get_my_claim('parts_view')::boolean,false) 
    AND (get_my_claim('role'::text)) = '"employee"'::jsonb
  );

CREATE POLICY "Employees with parts_update can update service suppliers" ON "serviceSupplier"
  FOR UPDATE
  USING (
    coalesce(get_my_claim('parts_update')::boolean, false) = true 
    AND (get_my_claim('role'::text)) = '"employee"'::jsonb
  );

CREATE POLICY "Employees with parts_create can create service suppliers" ON "serviceSupplier"
  FOR INSERT
  WITH CHECK (
    coalesce(get_my_claim('parts_create')::boolean, false) = true 
    AND (get_my_claim('role'::text)) = '"employee"'::jsonb
  );

CREATE POLICY "Employees with parts_delete can delete service suppliers" ON "serviceSupplier"
  FOR DELETE
  USING (
    coalesce(get_my_claim('parts_delete')::boolean, false) = true 
    AND (get_my_claim('role'::text)) = '"employee"'::jsonb
  );

CREATE POLICY "Suppliers with parts_view can view their own part suppliers" ON "serviceSupplier"
  FOR SELECT
  USING (
    coalesce(get_my_claim('parts_view')::boolean,false) 
    AND (get_my_claim('role'::text)) = '"supplier"'::jsonb
    AND "supplierId" IN (
      SELECT "supplierId" FROM "supplierAccount" WHERE id::uuid = auth.uid()
    )
  );

CREATE POLICY "Suppliers with parts_update can update their own part suppliers" ON "serviceSupplier"
  FOR UPDATE
  USING (
    coalesce(get_my_claim('parts_update')::boolean,false) 
    AND (get_my_claim('role'::text)) = '"supplier"'::jsonb
    AND "supplierId" IN (
      SELECT "supplierId" FROM "supplierAccount" WHERE id::uuid = auth.uid()
    )
  );

CREATE OR REPLACE VIEW "services" WITH(SECURITY_INVOKER=true) AS
  SELECT
    s.id,
    s.name,
    s.description,
    s."serviceType",
    pg.id AS "partGroupId",
    pg.name AS "partGroup",
    s.active,
    s.blocked,
    array_agg(ss."supplierId") AS "supplierIds"
  FROM "service" s
  LEFT JOIN "partGroup" pg ON pg.id = s."partGroupId"
  LEFT JOIN "serviceSupplier" ss ON ss."serviceId" = s.id
  GROUP BY s.id,
    s.name,
    s.description,
    s."serviceType",
    pg.id,
    pg.name,
    s.active;