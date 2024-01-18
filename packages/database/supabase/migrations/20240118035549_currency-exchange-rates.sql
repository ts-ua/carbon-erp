CREATE TABLE "currencyExchangeRate" (
  "id" SERIAL PRIMARY KEY,
  "currency" TEXT NOT NULL,
  "exchangeRate" NUMERIC NOT NULL,
  "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX "currencyExchangeRate_currency_index" ON "currencyExchangeRate" ("currency");
CREATE INDEX "currencyExchangeRate_createdAt_index" ON "currencyExchangeRate" ("createdAt");

ALTER TABLE "currencyExchangeRate" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read currencyExchangeRate" ON "currencyExchangeRate" 
  FOR SELECT USING (auth.role() = 'authenticated');