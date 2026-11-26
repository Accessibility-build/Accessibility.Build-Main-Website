-- Completion certificates for skills courses. Additive; apply explicitly like 0021.
CREATE TABLE IF NOT EXISTS course_certificates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL UNIQUE,
  user_id text REFERENCES users(id) ON DELETE SET NULL,
  course_slug text NOT NULL,
  recipient_name text NOT NULL,
  recipient_email text NOT NULL,
  edition text NOT NULL,
  source text NOT NULL,
  issued_at timestamp NOT NULL DEFAULT now(),
  expires_at timestamp,
  renewal_count integer NOT NULL DEFAULT 0,
  revoked_at timestamp,
  revoked_reason text,
  history jsonb NOT NULL DEFAULT '[]'::jsonb,
  updated_at timestamp NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX IF NOT EXISTS course_certificates_user_course_idx ON course_certificates (user_id, course_slug);
CREATE INDEX IF NOT EXISTS course_certificates_course_idx ON course_certificates (course_slug, issued_at);

-- Final exam for skills courses.
CREATE TABLE IF NOT EXISTS course_exam_status (
  user_id text NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  course_slug text NOT NULL,
  round integer NOT NULL DEFAULT 1,
  attempts_used integer NOT NULL DEFAULT 0,
  extra_attempts integer NOT NULL DEFAULT 0,
  renewal_attempts_left integer NOT NULL DEFAULT 0,
  cooldown_until timestamp,
  passed_at timestamp,
  passed_attempt_id uuid,
  history jsonb NOT NULL DEFAULT '[]'::jsonb,
  updated_at timestamp NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, course_slug)
);
CREATE TABLE IF NOT EXISTS course_exam_attempts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id text NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  course_slug text NOT NULL,
  kind text NOT NULL DEFAULT 'final',
  round integer NOT NULL,
  attempt_no integer NOT NULL,
  edition text NOT NULL,
  paper jsonb NOT NULL,
  answers jsonb NOT NULL DEFAULT '{}'::jsonb,
  time_limit_seconds integer NOT NULL,
  started_at timestamp NOT NULL DEFAULT now(),
  expires_at timestamp NOT NULL,
  submitted_at timestamp,
  correct integer,
  total integer NOT NULL,
  passed boolean,
  section_scores jsonb,
  end_reason text
);
CREATE INDEX IF NOT EXISTS course_exam_attempts_owner_idx ON course_exam_attempts (user_id, course_slug, started_at);
-- At most one unfinished attempt per learner and course.
CREATE UNIQUE INDEX IF NOT EXISTS course_exam_attempts_open_idx ON course_exam_attempts (user_id, course_slug) WHERE submitted_at IS NULL;
