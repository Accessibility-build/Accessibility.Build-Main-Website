import { pgTable, text, integer, timestamp, uuid, boolean, jsonb, pgEnum } from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'

// Enums
export const transactionTypeEnum = pgEnum('transaction_type', ['purchase', 'bonus', 'usage', 'refund'])
export const transactionStatusEnum = pgEnum('transaction_status', ['pending', 'completed', 'failed', 'cancelled'])
export const toolTypeEnum = pgEnum('tool_type', [
  'alt_text_generator', 
  'contrast_checker', 
  'accessibility_checker', 
  'accessibility_audit_helper', 
  'url_accessibility_auditor',
  'accessibility_code_generator',
  'heading_analyzer',
  'color_palette_generator',
  'mobile_accessibility_checker',
  'password_generator',
  'json_formatter',
  'base64_converter',
  'image_color_picker',
  'url_encoder_decoder'
])
export const auditStatusEnum = pgEnum('audit_status', ['pending', 'processing', 'completed', 'failed'])
export const severityEnum = pgEnum('severity', ['critical', 'serious', 'moderate', 'minor'])

// Users table (synced with Clerk)
export const users = pgTable('users', {
  id: text('id').primaryKey(), // Clerk user ID
  email: text('email').notNull().unique(),
  firstName: text('first_name'),
  lastName: text('last_name'),
  profileImageUrl: text('profile_image_url'),
  credits: integer('credits').notNull().default(100), // Current credit balance
  totalCreditsEarned: integer('total_credits_earned').notNull().default(100), // Total credits ever earned
  totalCreditsUsed: integer('total_credits_used').notNull().default(0), // Total credits ever used
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  isActive: boolean('is_active').notNull().default(true),
  metadata: jsonb('metadata'), // Additional user data
})

// Credit transactions table
export const creditTransactions = pgTable('credit_transactions', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  type: transactionTypeEnum('type').notNull(),
  amount: integer('amount').notNull(), // Positive for additions, negative for usage
  balanceBefore: integer('balance_before').notNull(),
  balanceAfter: integer('balance_after').notNull(),
  description: text('description').notNull(),
  status: transactionStatusEnum('status').notNull().default('completed'),
  toolUsed: toolTypeEnum('tool_used'), // If type is 'usage', which tool was used
  metadata: jsonb('metadata'), // Additional transaction data (e.g., payment details)
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

// Credit packages for purchase
export const creditPackages = pgTable('credit_packages', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  description: text('description'),
  credits: integer('credits').notNull(),
  price: integer('price').notNull(), // Price in cents (e.g., 999 = $9.99)
  currency: text('currency').notNull().default('USD'),
  isActive: boolean('is_active').notNull().default(true),
  metadata: jsonb('metadata'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

// Tool usage logs
export const toolUsage = pgTable('tool_usage', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  tool: toolTypeEnum('tool').notNull(),
  creditsUsed: integer('credits_used').notNull(),
  inputData: jsonb('input_data'), // Store input parameters
  outputData: jsonb('output_data'), // Store results
  success: boolean('success').notNull().default(true),
  errorMessage: text('error_message'),
  processingTime: integer('processing_time'), // Processing time in milliseconds
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

// Payment records (for Cashfree integration)
export const payments = pgTable('payments', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  packageId: uuid('package_id').notNull().references(() => creditPackages.id),
  transactionId: uuid('transaction_id').references(() => creditTransactions.id),
  paymentId: text('payment_id'), // Cashfree payment ID
  orderId: text('order_id').notNull(), // Our internal order ID
  amount: integer('amount').notNull(), // Amount in cents
  currency: text('currency').notNull().default('USD'),
  status: transactionStatusEnum('status').notNull().default('pending'),
  paymentMethod: text('payment_method'),
  paymentData: jsonb('payment_data'), // Store Cashfree response data
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

// URL Accessibility Audits table
export const urlAccessibilityAudits = pgTable('url_accessibility_audits', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  url: text('url').notNull(),
  title: text('title'), // Page title
  status: auditStatusEnum('status').notNull().default('pending'),
  creditsUsed: integer('credits_used').notNull().default(5), // URL audits cost more credits
  
  // Audit Results (Multi-Tool Enhanced)
  totalViolations: integer('total_violations').default(0),
  criticalCount: integer('critical_count').default(0),
  seriousCount: integer('serious_count').default(0),
  moderateCount: integer('moderate_count').default(0),
  minorCount: integer('minor_count').default(0),
  
  // Multi-Tool Results Summary
  toolsUsed: jsonb('tools_used'), // Array of tools used ['axe-core', 'pa11y']
  axeCoreResults: jsonb('axe_core_results'), // axe-core summary data
  pa11yResults: jsonb('pa11y_results'), // Pa11y summary data
  consensusViolations: integer('consensus_violations').default(0), // Issues found by multiple tools
  uniqueViolations: integer('unique_violations').default(0), // Issues found by single tool
  
  // AI Analysis
  aiSummary: text('ai_summary'),
  priorityRecommendations: jsonb('priority_recommendations'), // AI-generated priority fixes
  overallScore: integer('overall_score'), // 0-100 accessibility score
  confidenceScore: integer('confidence_score').default(100), // Multi-tool confidence rating
  
  // Processing Info
  processingStartedAt: timestamp('processing_started_at'),
  processingCompletedAt: timestamp('processing_completed_at'),
  errorMessage: text('error_message'),
  
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

// Detailed Audit Results table (Enhanced for Multi-Tool Support)
export const auditViolations = pgTable('audit_violations', {
  id: uuid('id').defaultRandom().primaryKey(),
  auditId: uuid('audit_id').notNull().references(() => urlAccessibilityAudits.id, { onDelete: 'cascade' }),
  
  // Violation Details
  violationId: text('violation_id').notNull(), // rule ID from various tools
  description: text('description').notNull(),
  impact: severityEnum('impact').notNull(),
  helpUrl: text('help_url'),
  
  // Multi-Tool Source Information
  detectedBy: jsonb('detected_by').notNull(), // Array of tools that detected this ['axe-core', 'pa11y']
  toolSpecificData: jsonb('tool_specific_data'), // Tool-specific raw data
  confidence: integer('confidence').default(100), // Confidence score (higher when multiple tools agree)
  
  // WCAG Information
  wcagCriteria: jsonb('wcag_criteria'), // Array of WCAG criteria
  wcagLevel: text('wcag_level'), // A, AA, AAA
  
  // Element Information
  selector: text('selector'), // CSS selector
  html: text('html'), // HTML snippet
  target: jsonb('target'), // Array of selectors
  
  // AI Analysis for this violation
  aiExplanation: text('ai_explanation'),
  fixSuggestion: text('fix_suggestion'),
  codeExample: text('code_example'),
  
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

// Email Subscriptions table for newsletter signups
export const emailSubscriptions = pgTable('email_subscriptions', {
  id: uuid('id').defaultRandom().primaryKey(),
  email: text('email').notNull().unique(),
  source: text('source').notNull(), // 'footer', 'blog', 'other'
  isActive: boolean('is_active').notNull().default(true),
  subscribedAt: timestamp('subscribed_at').defaultNow().notNull(),
  unsubscribedAt: timestamp('unsubscribed_at'),
  metadata: jsonb('metadata'), // Additional data like referrer, user agent, etc.
})

// Trial usage tracking for non-logged-in users (by IP address)
export const trialUsage = pgTable('trial_usage', {
  id: uuid('id').defaultRandom().primaryKey(),
  ipAddress: text('ip_address').notNull(),
  tool: toolTypeEnum('tool').notNull(),
  usageCount: integer('usage_count').notNull().default(1),
  inputData: jsonb('input_data'), // Store input parameters (anonymized)
  outputData: jsonb('output_data'), // Store results (for analytics)
  success: boolean('success').notNull().default(true),
  errorMessage: text('error_message'),
  userAgent: text('user_agent'), // For analytics
  country: text('country'), // Derived from IP for analytics
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  transactions: many(creditTransactions),
  toolUsage: many(toolUsage),
  payments: many(payments),
}))

export const creditTransactionsRelations = relations(creditTransactions, ({ one }) => ({
  user: one(users, {
    fields: [creditTransactions.userId],
    references: [users.id],
  }),
  payment: one(payments, {
    fields: [creditTransactions.id],
    references: [payments.transactionId],
  }),
}))

export const creditPackagesRelations = relations(creditPackages, ({ many }) => ({
  payments: many(payments),
}))

export const toolUsageRelations = relations(toolUsage, ({ one }) => ({
  user: one(users, {
    fields: [toolUsage.userId],
    references: [users.id],
  }),
}))

export const paymentsRelations = relations(payments, ({ one }) => ({
  user: one(users, {
    fields: [payments.userId],
    references: [users.id],
  }),
  package: one(creditPackages, {
    fields: [payments.packageId],
    references: [creditPackages.id],
  }),
  transaction: one(creditTransactions, {
    fields: [payments.transactionId],
    references: [creditTransactions.id],
  }),
}))

// New Relations
export const urlAccessibilityAuditsRelations = relations(urlAccessibilityAudits, ({ one, many }) => ({
  user: one(users, {
    fields: [urlAccessibilityAudits.userId],
    references: [users.id],
  }),
  violations: many(auditViolations),
}))

export const auditViolationsRelations = relations(auditViolations, ({ one }) => ({
  audit: one(urlAccessibilityAudits, {
    fields: [auditViolations.auditId],
    references: [urlAccessibilityAudits.id],
  }),
}))

// Types
export type User = typeof users.$inferSelect
export type NewUser = typeof users.$inferInsert
export type CreditTransaction = typeof creditTransactions.$inferSelect
export type NewCreditTransaction = typeof creditTransactions.$inferInsert
export type CreditPackage = typeof creditPackages.$inferSelect
export type NewCreditPackage = typeof creditPackages.$inferInsert
export type ToolUsage = typeof toolUsage.$inferSelect
export type NewToolUsage = typeof toolUsage.$inferInsert
export type Payment = typeof payments.$inferSelect
export type NewPayment = typeof payments.$inferInsert
export type UrlAccessibilityAudit = typeof urlAccessibilityAudits.$inferSelect
export type NewUrlAccessibilityAudit = typeof urlAccessibilityAudits.$inferInsert
export type AuditViolation = typeof auditViolations.$inferSelect
export type NewAuditViolation = typeof auditViolations.$inferInsert
export type EmailSubscription = typeof emailSubscriptions.$inferSelect
export type NewEmailSubscription = typeof emailSubscriptions.$inferInsert
export type TrialUsage = typeof trialUsage.$inferSelect
export type NewTrialUsage = typeof trialUsage.$inferInsert 