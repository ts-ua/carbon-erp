CREATE TABLE "theme" (
  "id" BOOLEAN NOT NULL DEFAULT TRUE,
  "primaryBackgroundLight" TEXT NOT NULL,
  "primaryForegroundLight" TEXT NOT NULL,
  "primaryBackgroundDark" TEXT NOT NULL,
  "primaryForegroundDark" TEXT NOT NULL,
  "accentBackgroundLight" TEXT NOT NULL,
  "accentForegroundLight" TEXT NOT NULL,
  "accentBackgroundDark" TEXT NOT NULL,
  "accentForegroundDark" TEXT NOT NULL,
  "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  "updatedBy" TEXT NOT NULL,

  CONSTRAINT "theme_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "theme_id_check" CHECK ("id" = TRUE),
  CONSTRAINT "theme_updatedBy_fkey" FOREIGN KEY ("updatedBy") REFERENCES "user"("id") ON DELETE SET NULL
);

ALTER TABLE "theme" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view themes" ON "theme"
  FOR SELECT
  USING (
    auth.role() = 'authenticated'
  );

CREATE POLICY "Employees with settings_update can update themes" ON "theme"
  FOR UPDATE
  USING (
    coalesce(get_my_claim('settings_update')::boolean, false) = true
    AND (get_my_claim('role'::text)) = '"employee"'::jsonb
  );


