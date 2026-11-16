-- Guest orders are limited to Dodo course licences and templates. Credit packs still need an account.
ALTER TABLE billing_orders ALTER COLUMN user_id DROP NOT NULL;
ALTER TABLE billing_orders ADD CONSTRAINT billing_orders_guest_products_only CHECK (
  user_id IS NOT NULL OR (
    payment_provider = 'dodo' AND credits = 0
    AND (catalog_key LIKE 'course:%' OR catalog_key LIKE 'template:%')
  )
);
