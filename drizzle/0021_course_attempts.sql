CREATE TABLE IF NOT EXISTS course_attempts (
  user_id text NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  course_slug text NOT NULL,
  id text NOT NULL,
  data jsonb NOT NULL,
  created_at timestamp NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, course_slug, id)
);
CREATE INDEX IF NOT EXISTS course_attempts_owner_idx ON course_attempts (user_id, course_slug, created_at);
