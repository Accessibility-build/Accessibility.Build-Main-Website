DO $$ BEGIN
 CREATE TYPE "public"."tool_type" AS ENUM('alt_text_generator', 'contrast_checker', 'accessibility_checker');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."transaction_status" AS ENUM('pending', 'completed', 'failed', 'cancelled');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."transaction_type" AS ENUM('purchase', 'bonus', 'usage', 'refund');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "credit_packages" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"credits" integer NOT NULL,
	"price" integer NOT NULL,
	"currency" text DEFAULT 'USD' NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"metadata" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "credit_transactions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"type" "transaction_type" NOT NULL,
	"amount" integer NOT NULL,
	"balance_before" integer NOT NULL,
	"balance_after" integer NOT NULL,
	"description" text NOT NULL,
	"status" "transaction_status" DEFAULT 'completed' NOT NULL,
	"tool_used" "tool_type",
	"metadata" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "payments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"package_id" uuid NOT NULL,
	"transaction_id" uuid,
	"payment_id" text,
	"order_id" text NOT NULL,
	"amount" integer NOT NULL,
	"currency" text DEFAULT 'USD' NOT NULL,
	"status" "transaction_status" DEFAULT 'pending' NOT NULL,
	"payment_method" text,
	"payment_data" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "tool_usage" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"tool" "tool_type" NOT NULL,
	"credits_used" integer NOT NULL,
	"input_data" jsonb,
	"output_data" jsonb,
	"success" boolean DEFAULT true NOT NULL,
	"error_message" text,
	"processing_time" integer,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"id" text PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"first_name" text,
	"last_name" text,
	"profile_image_url" text,
	"credits" integer DEFAULT 100 NOT NULL,
	"total_credits_earned" integer DEFAULT 100 NOT NULL,
	"total_credits_used" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"metadata" jsonb,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "credit_transactions" ADD CONSTRAINT "credit_transactions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "payments" ADD CONSTRAINT "payments_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "payments" ADD CONSTRAINT "payments_package_id_credit_packages_id_fk" FOREIGN KEY ("package_id") REFERENCES "public"."credit_packages"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "payments" ADD CONSTRAINT "payments_transaction_id_credit_transactions_id_fk" FOREIGN KEY ("transaction_id") REFERENCES "public"."credit_transactions"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "tool_usage" ADD CONSTRAINT "tool_usage_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
