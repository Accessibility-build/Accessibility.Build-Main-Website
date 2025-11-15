-- Production Database Indexes for URL Accessibility Auditor
-- Run these indexes after deploying to production for optimal performance

-- Index for user audits lookup (most common query)
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_url_audits_user_status 
ON url_accessibility_audits(user_id, status);

-- Index for recent audits sorting
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_url_audits_created_at 
ON url_accessibility_audits(created_at DESC);

-- Index for audit completion time queries
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_url_audits_processing_completed 
ON url_accessibility_audits(processing_completed_at DESC) 
WHERE status = 'completed';

-- Index for violation lookups
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_violations_audit_id 
ON audit_violations(audit_id);

-- Index for violation impact filtering
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_violations_impact 
ON audit_violations(impact);

-- Composite index for violation analysis queries
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_violations_audit_impact 
ON audit_violations(audit_id, impact);

-- Index for URL duplicate detection (caching optimization)
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_url_audits_url_recent 
ON url_accessibility_audits(url, created_at DESC) 
WHERE status = 'completed';

-- Index for credit transactions (existing table optimization)
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_credit_transactions_user_date 
ON credit_transactions(user_id, created_at DESC);

-- Index for tool usage analytics
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_tool_usage_tool_date 
ON tool_usage(tool, created_at DESC);

-- Partial index for failed audits (debugging)
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_url_audits_failed 
ON url_accessibility_audits(created_at DESC, error_message) 
WHERE status = 'failed';

-- ANALYZE tables for query optimizer
ANALYZE url_accessibility_audits;
ANALYZE audit_violations;
ANALYZE credit_transactions;
ANALYZE tool_usage; 