

CREATE TYPE "quoteStatus" AS ENUM (
  'Draft', 
  'Open', 
  'Replied', 
  'Ordered',
  'Partially Ordered',
  'Lost', 
  'Cancelled',
  'Expired'
);

CREATE TABLE "quote" (
  "id" TEXT NOT NULL DEFAULT xid(),
  "quoteId" TEXT NOT NULL,
  "revisionId" INTEGER NOT NULL DEFAULT 0,
  "ownerId" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "status" "quoteStatus" NOT NULL DEFAULT 'Draft',
  "quoteDate" DATE,
  "expirationDate" DATE,
  "notes" TEXT,
  "customerId" TEXT NOT NULL,
  "customerLocationId" TEXT,
  "customerContactId" TEXT,
  "customerReference" TEXT,
  "locationId" TEXT,
  "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  "createdBy" TEXT NOT NULL,
  "updatedAt" TIMESTAMP WITH TIME ZONE,
  "updatedBy" TEXT,

  CONSTRAINT "quote_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "quote_quoteId_key" UNIQUE ("quoteId"),
  CONSTRAINT "quote_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "user" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT "quote_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "customer" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "quote_customerLocationId_fkey" FOREIGN KEY ("customerLocationId") REFERENCES "location" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT "quote_customerContactId_fkey" FOREIGN KEY ("customerContactId") REFERENCES "contact" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT "quote_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "location" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT "quote_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "user" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT "quote_updatedBy_fkey" FOREIGN KEY ("updatedBy") REFERENCES "user" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE TABLE "quoteLine" (
  "id" TEXT NOT NULL DEFAULT xid(),
  "quoteId" TEXT NOT NULL,
  "quoteRevisionId" INTEGER NOT NULL DEFAULT 0,
  "partId" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "customerPartId" TEXT,
  "customerPartRevision" TEXT,
  "replenishmentSystem" TEXT,
  "unitOfMeasureCode" TEXT,
  "createdBy" TEXT NOT NULL,
  "updatedAt" TIMESTAMP WITH TIME ZONE,
  "updatedBy" TEXT,

  CONSTRAINT "quoteLine_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "quoteLine_quoteId_fkey" FOREIGN KEY ("quoteId") REFERENCES "quote" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "quoteLine_partId_fkey" FOREIGN KEY ("partId") REFERENCES "part" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
  
  CONSTRAINT "quoteLine_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "user" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT "quoteLine_updatedBy_fkey" FOREIGN KEY ("updatedBy") REFERENCES "user" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE INDEX "quoteLine_quoteId_idx" ON "quoteLine" ("quoteId");

CREATE TABLE "quoteLineQuantities" (
  "id" TEXT NOT NULL DEFAULT xid(),
  "quoteLineId" TEXT NOT NULL,
  "quantity" NUMERIC(10, 2) NOT NULL DEFAULT 0,
  "scrapPercentage" NUMERIC(5, 2) NOT NULL DEFAULT 0,
  "setupHours" NUMERIC(10, 2) NOT NULL DEFAULT 0,
  "productionHours" NUMERIC(10, 2) NOT NULL DEFAULT 0,
  "materialCost" NUMERIC(10, 2) NOT NULL DEFAULT 0,
  "laborCost" NUMERIC(10, 2) NOT NULL DEFAULT 0,
  "overheadCost" NUMERIC(10, 2) NOT NULL DEFAULT 0,
  "additionalCost" NUMERIC(10, 2) NOT NULL DEFAULT 0,
  "discountPercentage" NUMERIC(5, 2) NOT NULL DEFAULT 0,
  "markupPercentage" NUMERIC(5, 2) NOT NULL DEFAULT 0,
  "unitCostBase" NUMERIC(10, 2) NOT NULL DEFAULT 0,
  "unitTaxAmount" NUMERIC(10, 2) NOT NULL DEFAULT 0,
  "extendedCost" NUMERIC(10, 2) NOT NULL DEFAULT 0,
  "leadTime" NUMERIC (5,2) NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  "createdBy" TEXT NOT NULL,
  "updatedAt" TIMESTAMP WITH TIME ZONE,
  "updatedBy" TEXT,

  CONSTRAINT "quoteLineQuantities_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "quoteLineQuantities_quoteLineId_fkey" FOREIGN KEY ("quoteLineId") REFERENCES "quoteLine" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "quoteLineQuantities_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "user" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT "quoteLineQuantities_updatedBy_fkey" FOREIGN KEY ("updatedBy") REFERENCES "user" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE INDEX "quoteLineQuantities_quoteLineId_idx" ON "quoteLineQuantities" ("quoteLineId");

CREATE TABLE "quoteAssembly" (
  "id" TEXT NOT NULL DEFAULT xid(),
  "quoteId" TEXT NOT NULL,
  "quoteLineId" TEXT NOT NULL,
  "quoteAssemblyId" TEXT NOT NULL DEFAULT xid(),
  "parentModuleId" TEXT,
  "partId" TEXT NOT NULL,
  "description" TEXT,
  "unitOfMeasureCode" TEXT,
  "quantityPerParent" NUMERIC(10, 2) NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  "createdBy" TEXT NOT NULL,
  "updatedAt" TIMESTAMP WITH TIME ZONE,
  "updatedBy" TEXT,

  CONSTRAINT "quoteAssembly_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "quoteAssembly_quoteId_fkey" FOREIGN KEY ("quoteId") REFERENCES "quote" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "quoteAssembly_quoteLineId_fkey" FOREIGN KEY ("quoteLineId") REFERENCES "quoteLine" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "quoteAssembly_parentModuleId_fkey" FOREIGN KEY ("parentModuleId") REFERENCES "quoteAssembly" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "quoteAssembly_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "user" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT "quoteAssembly_updatedBy_fkey" FOREIGN KEY ("updatedBy") REFERENCES "user" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE INDEX "quoteAssembly_quoteId_idx" ON "quoteAssembly" ("quoteId");
CREATE INDEX "quoteAssembly_quoteLineId_idx" ON "quoteAssembly" ("quoteLineId");
CREATE INDEX "quoteAssembly_parentModuleId_idx" ON "quoteAssembly" ("parentModuleId");

CREATE TABLE "quoteProcess" (
  "id" TEXT NOT NULL DEFAULT xid(),
  "quoteId" TEXT NOT NULL,
  "quoteLineId" TEXT NOT NULL,
  "quoteAssemblyId" TEXT NOT NULL,
  "workCellTypeId" TEXT NOT NULL,
  "equipmentTypeId" TEXT,
  "description" TEXT NOT NULL,
  "setupHours" NUMERIC(10,2) NOT NULL DEFAULT 0,
  "standardFactor" factor NOT NULL DEFAULT 'Hours/Piece',
  "productionStandard" NUMERIC(10,4) NOT NULL DEFAULT 0,
  "quotingRate" NUMERIC(10,4) NOT NULL DEFAULT 0,
  "laborRate" NUMERIC(10,4) NOT NULL DEFAULT 0,
  "overheadRate" NUMERIC(10,4) NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  "createdBy" TEXT NOT NULL,
  "updatedAt" TIMESTAMP WITH TIME ZONE,
  "updatedBy" TEXT,

  CONSTRAINT "quoteProcess_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "quoteProcess_quoteId_fkey" FOREIGN KEY ("quoteId") REFERENCES "quote" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "quoteProcess_quoteLineId_fkey" FOREIGN KEY ("quoteLineId") REFERENCES "quoteLine" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "quoteProcess_quoteAssemblyId_fkey" FOREIGN KEY ("quoteAssemblyId") REFERENCES "quoteAssembly" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "quoteProcess_workCellTypeId_fkey" FOREIGN KEY ("workCellTypeId") REFERENCES "workCellType" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT "quoteProcess_equipmentTypeId_fkey" FOREIGN KEY ("equipmentTypeId") REFERENCES "equipmentType" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT "quoteProcess_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "user" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT "quoteProcess_updatedBy_fkey" FOREIGN KEY ("updatedBy") REFERENCES "user" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE INDEX "quoteProcess_quoteId_idx" ON "quoteProcess" ("quoteId");
CREATE INDEX "quoteProcess_quoteLineId_idx" ON "quoteProcess" ("quoteLineId");
CREATE INDEX "quoteProcess_quoteAssemblyId_idx" ON "quoteProcess" ("quoteAssemblyId");

CREATE TABLE "quoteMaterial" (
  "id" TEXT NOT NULL DEFAULT xid(),
  "quoteId" TEXT NOT NULL,
  "quoteLineId" TEXT NOT NULL,
  "quoteProcessId" TEXT NOT NULL,
  "partId" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "quantity" NUMERIC(10, 2) NOT NULL DEFAULT 0,
  "unitOfMeasureCode" TEXT,
  "unitCost" NUMERIC(10, 2) NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  "createdBy" TEXT NOT NULL,
  "updatedAt" TIMESTAMP WITH TIME ZONE,
  "updatedBy" TEXT,

  CONSTRAINT "quoteMaterial_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "quoteMaterial_quoteId_fkey" FOREIGN KEY ("quoteId") REFERENCES "quote" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "quoteMaterial_quoteLineId_fkey" FOREIGN KEY ("quoteLineId") REFERENCES "quoteLine" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "quoteMaterial_quoteProcessId_fkey" FOREIGN KEY ("quoteProcessId") REFERENCES "quoteProcess" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "quoteMaterial_partId_fkey" FOREIGN KEY ("partId") REFERENCES "part" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT "quoteMaterial_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "user" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT "quoteMaterial_updatedBy_fkey" FOREIGN KEY ("updatedBy") REFERENCES "user" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE TABLE "quoteFavorite" (
  "quoteId" TEXT NOT NULL,
  "userId" TEXT NOT NULL,

  CONSTRAINT "quoteFavorites_pkey" PRIMARY KEY ("quoteId", "userId"),
  CONSTRAINT "quoteFavorites_quoteId_fkey" FOREIGN KEY ("quoteId") REFERENCES "quote"("id") ON DELETE CASCADE,
  CONSTRAINT "quoteFavorites_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE
);

CREATE INDEX "quoteFavorites_userId_idx" ON "quoteFavorite" ("userId");
CREATE INDEX "quoteFavorites_quoteId_idx" ON "quoteFavorite" ("quoteId");

ALTER TABLE "quoteFavorite" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own quote favorites" ON "quoteFavorite" 
  FOR SELECT USING (
    auth.uid()::text = "userId"
  );

CREATE POLICY "Users can create their own quote favorites" ON "quoteFavorite" 
  FOR INSERT WITH CHECK (
    auth.uid()::text = "userId"
  );

CREATE POLICY "Users can delete their own quote favorites" ON "quoteFavorite"
  FOR DELETE USING (
    auth.uid()::text = "userId"
  ); 

CREATE OR REPLACE VIEW "quotes" WITH(SECURITY_INVOKER=true) AS
  SELECT 
  q."id",
  q."quoteId",
  q."customerId",
  q."customerLocationId",
  q."customerContactId",
  q."name",
  q."status",
  q."notes",
  q."quoteDate",
  q."expirationDate",
  q."customerReference",
  q."locationId",
  q."createdAt",
  q."createdBy",
  q."ownerId",
  uo."fullName" AS "ownerFullName",
  uo."avatarUrl" AS "ownerAvatar",
  c."name" AS "customerName",
  uc."fullName" AS "createdByFullName",
  uc."avatarUrl" AS "createdByAvatar",
  uu."fullName" AS "updatedByFullName",
  uu."avatarUrl" AS "updatedByAvatar",
  l."name" AS "locationName",
  array_agg(ql."partId") AS "partIds",
  EXISTS(SELECT 1 FROM "quoteFavorite" pf WHERE pf."quoteId" = q.id AND pf."userId" = auth.uid()::text) AS favorite
FROM "quote" q
LEFT JOIN "customer" c
  ON c.id = q."customerId"
LEFT JOIN "location" l
  ON l.id = q."locationId"
LEFT JOIN "quoteLine" ql
  ON ql."quoteId" = q.id
LEFT JOIN "user" uo
  ON uo.id = q."ownerId"
LEFT JOIN "user" uc
  ON uc.id = q."createdBy"
LEFT JOIN "user" uu
  ON uu.id = q."updatedBy"
GROUP BY
  q."id",
  q."quoteId",
  q."customerId",
  q."customerLocationId",
  q."customerContactId",
  q."name",
  q."status",
  q."notes",
  q."quoteDate",
  q."expirationDate",
  q."customerReference",
  q."locationId",
  q."createdAt",
  q."createdBy",
  c."name",
  uo."fullName",
  uo."avatarUrl",
  uc."fullName",
  uc."avatarUrl",
  uu."fullName",
  uu."avatarUrl",
  l."name";