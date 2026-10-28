-- The alt text checker's optional AI review (each image compared with its alt text by a vision
-- model) is metered like the other AI tools: trial usage for anonymous visitors, credits when
-- signed in. Additive; Postgres cannot drop an enum value, but nothing depends on removing it.
ALTER TYPE "tool_type" ADD VALUE IF NOT EXISTS 'alt_text_checker';
