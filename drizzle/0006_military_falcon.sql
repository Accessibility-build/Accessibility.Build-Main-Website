CREATE INDEX IF NOT EXISTS "billing_orders_checkout_session_idx" ON "billing_orders" USING btree ("stripe_checkout_session_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "billing_orders_user_created_at_idx" ON "billing_orders" USING btree ("user_id","created_at");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "billing_orders_status_idx" ON "billing_orders" USING btree ("status");
