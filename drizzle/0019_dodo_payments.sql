-- Dodo Payments becomes the payment provider (merchant of record). Additive.
-- Run outside a transaction block: ALTER TYPE ... ADD VALUE cannot be used in the same
-- transaction that adds it.
ALTER TYPE "payment_provider" ADD VALUE IF NOT EXISTS 'dodo';

-- Idempotency and replay safety for Dodo webhooks (keyed on the webhook-id header).
CREATE TABLE IF NOT EXISTS "dodo_webhook_events" (
  "event_id" text PRIMARY KEY,
  "event_type" text NOT NULL,
  "processed_at" timestamp,
  "processing_status" text NOT NULL DEFAULT 'processing',
  "order_id" uuid REFERENCES "billing_orders"("id"),
  "error_message" text,
  "payload" jsonb NOT NULL,
  "created_at" timestamp NOT NULL DEFAULT now()
);

-- Downloadable products (paid templates). A purchase grants an entitlement; files are served
-- from product_files only to entitled users. The site repo is public, so files live here.
CREATE TABLE IF NOT EXISTS "product_entitlements" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "user_id" text REFERENCES "users"("id") ON DELETE SET NULL,
  "email" text NOT NULL,
  "product_slug" text NOT NULL,
  "licence" text NOT NULL,
  "billing_order_id" uuid UNIQUE REFERENCES "billing_orders"("id"),
  "source" text NOT NULL,          -- purchase | admin
  "note" text,
  "revoked_at" timestamp,
  "created_at" timestamp NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS "product_entitlements_user_idx" ON "product_entitlements" ("user_id");
CREATE INDEX IF NOT EXISTS "product_entitlements_email_idx" ON "product_entitlements" ("email");

CREATE TABLE IF NOT EXISTS "product_files" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "product_slug" text NOT NULL,
  "filename" text NOT NULL,
  "content_type" text NOT NULL,
  "version" text NOT NULL,
  "size_bytes" integer NOT NULL,
  "sha256" text NOT NULL,
  "data" bytea NOT NULL,
  "updated_at" timestamp NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX IF NOT EXISTS "product_files_slug_filename_idx" ON "product_files" ("product_slug", "filename");
