CREATE TYPE "quoteStatus" AS ENUM (
  'Draft', 
  'Open', 
  'Replied', 
  'Ordered',
  'Partially Ordered',
  'Lost' 
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
  "quoteDate" DATE NOT NULL DEFAULT CURRENT_DATE,
  "notes" TEXT,
  "customerId" TEXT NOT NULL,
  "customerLocationId" TEXT,
  "customerContactId" TEXT,
  "customerReference" TEXT,
  "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  "createdBy" TEXT NOT NULL,
  "updatedAt" TIMESTAMP WITH TIME ZONE,
  "updatedBy" TEXT
);