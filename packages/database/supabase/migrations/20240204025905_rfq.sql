CREATE TABLE "requestForQuote" (
  "id" TEXT NOT NULL DEFAULT xid(),
  "name" TEXT NOT NULL,
  "receiptDate" DATE NOT NULL,
  "expirationDate" DATE,
  "locationId" TEXT,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT now(),
  "createdBy" TEXT NOT NULL,
  "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT now(),
  "updatedBy" TEXT,

  CONSTRAINT "requestForQuote_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "requestForQuote_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "location"("id"),
  CONSTRAINT "requestForQuote_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT "requestForQuote_updatedBy_fkey" FOREIGN KEY ("updatedBy") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE INDEX "requestForQuote_locationId_index" ON "requestForQuote" ("locationId");

CREATE TABLE "requestForQuoteLine" (
  "id" TEXT NOT NULL DEFAULT xid(),
  "requestForQuoteId" TEXT NOT NULL,
  "partId" TEXT NOT NULL,
  "quantity" NUMERIC(20, 2) NOT NULL,
  "unitPrice" NUMERIC(20, 2) NOT NULL DEFAULT 0,
  "unitOfMeasureCode" TEXT,
  "locationId" TEXT,
  "shelfId" TEXT,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT now(),
  "createdBy" TEXT NOT NULL,
  "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT now(),
  "updatedBy" TEXT,

  CONSTRAINT "requestForQuoteLine_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "requestForQuoteLine_requestForQuoteId_fkey" FOREIGN KEY ("requestForQuoteId") REFERENCES "requestForQuote"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "requestForQuoteLine_partId_fkey" FOREIGN KEY ("partId") REFERENCES "part"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT "requestForQuoteLine_unitOfMeasureCode_fkey" FOREIGN KEY ("unitOfMeasureCode") REFERENCES "unitOfMeasure"("code") ON UPDATE CASCADE ON DELETE SET NULL,
  CONSTRAINT "requestForQuoteLine_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "location"("id") ON UPDATE CASCADE ON DELETE SET NULL,
  CONSTRAINT "requestForQuoteLine_shelfId_fkey"  FOREIGN KEY ("shelfId", "locationId") REFERENCES "shelf" ("id", "locationId") ON DELETE CASCADE,
  CONSTRAINT "requestForQuoteLine_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT "requestForQuoteLine_updatedBy_fkey" FOREIGN KEY ("updatedBy") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE INDEX "requestForQuoteLine_requestForQuoteId_index" ON "requestForQuoteLine" ("requestForQuoteId");
CREATE INDEX "requestForQuoteLine_partId_index" ON "requestForQuoteLine" ("partId");
CREATE INDEX "requestForQuoteLine_locationId_index" ON "requestForQuoteLine" ("locationId");

CREATE TABLE "requestForQuoteSupplier" (
  "id" TEXT NOT NULL DEFAULT xid(),
  "requestForQuoteId" TEXT NOT NULL,
  "supplierId" TEXT NOT NULL,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT now(),
  "createdBy" TEXT NOT NULL,
  "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT now(),
  "updatedBy" TEXT,

  CONSTRAINT "requestForQuoteSupplier_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "requestForQuoteSupplier_requestForQuoteId_fkey" FOREIGN KEY ("requestForQuoteId") REFERENCES "requestForQuote"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "requestForQuoteSupplier_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "supplier"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT "requestForQuoteSupplier_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT "requestForQuoteSupplier_updatedBy_fkey" FOREIGN KEY ("updatedBy") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE INDEX "requestForQuoteSupplier_requestForQuoteId_index" ON "requestForQuoteSupplier" ("requestForQuoteId");
CREATE INDEX "requestForQuoteSupplier_supplierId_index" ON "requestForQuoteSupplier" ("supplierId");

CREATE TABLE "requestForQuoteSupplierLine" (
  "id" TEXT NOT NULL DEFAULT xid(),
  "requestForQuoteSupplierId" TEXT NOT NULL,
  "requestForQuoteLineId" TEXT NOT NULL,
  "quantity" NUMERIC(20, 2) NOT NULL,
  "unitPrice" NUMERIC(20, 2) NOT NULL,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT now(),
  "createdBy" TEXT NOT NULL,
  "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT now(),
  "updatedBy" TEXT,

  CONSTRAINT "requestForQuoteSupplierLine_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "requestForQuoteSupplierLine_requestForQuoteSupplierId_fkey" FOREIGN KEY ("requestForQuoteSupplierId") REFERENCES "requestForQuoteSupplier"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "requestForQuoteSupplierLine_requestForQuoteLineId_fkey" FOREIGN KEY ("requestForQuoteLineId") REFERENCES "requestForQuoteLine"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "requestForQuoteSupplierLine_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT "requestForQuoteSupplierLine_updatedBy_fkey" FOREIGN KEY ("updatedBy") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
