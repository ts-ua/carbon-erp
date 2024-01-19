CREATE TABLE "currencyExchangeRate" (
  "currency" TEXT NOT NULL,
  "exchangeRate" NUMERIC NOT NULL,
  "timestamp" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),

  CONSTRAINT "currencyExchangeRate_pkey" PRIMARY KEY ("currency")
);

ALTER TABLE "currencyExchangeRate" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read currencyExchangeRate" ON "currencyExchangeRate" 
  FOR SELECT USING (auth.role() = 'authenticated');