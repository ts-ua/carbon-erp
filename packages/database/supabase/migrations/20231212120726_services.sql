CREATE TABLE "serviceGroup" (
  "id" TEXT NOT NULL DEFAULT xid(),
  "name" TEXT NOT NULL,
  "description" TEXT,
  "active" BOOLEAN NOT NULL DEFAULT true,
  "createdBy" TEXT NOT NULL,
  "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  "updatedBy" TEXT,
  "updatedAt" TIMESTAMP WITH TIME ZONE,

  CONSTRAINT "serviceGroup_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "serviceGroup_name_key" UNIQUE ("name"),
  CONSTRAINT "serviceGroup_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "user"("id"),
  CONSTRAINT "serviceGroup_updatedBy_fkey" FOREIGN KEY ("updatedBy") REFERENCES "user"("id")
);

ALTER TABLE "serviceGroup" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Employees with parts_view can view service groups" ON "serviceGroup"
  FOR SELECT
  USING (
    coalesce(get_my_claim('parts_view')::boolean, false) = true 
    AND (get_my_claim('role'::text)) = '"employee"'::jsonb
  );
  

CREATE POLICY "Employees with parts_create can insert service groups" ON "serviceGroup"
  FOR INSERT
  WITH CHECK (   
    coalesce(get_my_claim('parts_create')::boolean,false) 
    AND (get_my_claim('role'::text)) = '"employee"'::jsonb
);

CREATE POLICY "Employees with parts_update can update service groups" ON "serviceGroup"
  FOR UPDATE
  USING (
    coalesce(get_my_claim('parts_update')::boolean, false) = true 
    AND (get_my_claim('role'::text)) = '"employee"'::jsonb
  );

CREATE POLICY "Employees with parts_delete can delete service groups" ON "serviceGroup"
  FOR DELETE
  USING (
    coalesce(get_my_claim('parts_delete')::boolean, false) = true 
    AND (get_my_claim('role'::text)) = '"employee"'::jsonb
  );

CREATE TYPE "serviceType" AS ENUM (
  'Internal',
  'External'
);

CREATE TABLE "service" (
  "id" TEXT NOT NULL DEFAULT xid(),
  "name" TEXT NOT NULL,
  "description" TEXT,
  "blocked" BOOLEAN NOT NULL DEFAULT false,
  "serviceGroupId" TEXT,
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
  CONSTRAINT "service_serviceGroupId_fkey" FOREIGN KEY ("serviceGroupId") REFERENCES "serviceGroup"("id"),
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