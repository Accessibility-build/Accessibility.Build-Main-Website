'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { Eraser, FileText, Loader2, Mail, Megaphone, RefreshCw, Send } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  MARKETING_EMAIL_TEMPLATES,
  getMarketingCategoryLabel,
  type MarketingEmailTemplate,
} from '@/lib/marketing-templates'

type MarketingAudience = 'active_users' | 'newsletter_subscribers' | 'all_contacts'

type AudienceCounts = {
  activeUsers: number
  newsletterSubscribers: number
  allContacts: number
}

type MarketingConfigResponse = {
  emailServiceEnabled: boolean
  marketingEmailEnabled: boolean
  fromAddress: string | null
  audienceCounts: AudienceCounts
}

type MarketingSendSummary = {
  audience: MarketingAudience
  requestedRecipients: number
  processedRecipients: number
  sent: number
  failed: number
}

const DEFAULT_COUNTS: AudienceCounts = {
  activeUsers: 0,
  newsletterSubscribers: 0,
  allContacts: 0,
}

const AUDIENCE_LABELS: Record<MarketingAudience, string> = {
  active_users: 'Active Users',
  newsletter_subscribers: 'Newsletter Subscribers',
  all_contacts: 'All Contacts (Deduplicated)',
}

export function AdminMarketingClient() {
  const [config, setConfig] = useState<MarketingConfigResponse | null>(null)
  const [configLoading, setConfigLoading] = useState(false)
  const [configError, setConfigError] = useState<string | null>(null)

  const [subject, setSubject] = useState('')
  const [preheader, setPreheader] = useState('')
  const [heading, setHeading] = useState('')
  const [body, setBody] = useState('')
  const [ctaLabel, setCtaLabel] = useState('')
  const [ctaUrl, setCtaUrl] = useState('')
  const [reason, setReason] = useState('')
  const [audience, setAudience] = useState<MarketingAudience>('all_contacts')
  const [recipientLimit, setRecipientLimit] = useState('')
  const [testEmail, setTestEmail] = useState('')

  const [activeTemplateId, setActiveTemplateId] = useState<string | null>(null)

  const [testLoading, setTestLoading] = useState(false)
  const [campaignLoading, setCampaignLoading] = useState(false)
  const [sendError, setSendError] = useState<string | null>(null)
  const [testSuccessMessage, setTestSuccessMessage] = useState<string | null>(null)
  const [campaignSummary, setCampaignSummary] = useState<MarketingSendSummary | null>(null)
  const [campaignFailedRecipients, setCampaignFailedRecipients] = useState<
    Array<{ email: string; error: string }>
  >([])

  const loadConfig = useCallback(async () => {
    try {
      setConfigLoading(true)
      setConfigError(null)

      const response = await fetch('/api/admin/marketing', {
        method: 'GET',
        cache: 'no-store',
      })
      const payload = await response.json().catch(() => ({}))

      if (!response.ok) {
        throw new Error(payload.error || 'Failed to load marketing configuration')
      }

      setConfig(payload as MarketingConfigResponse)
    } catch (error) {
      setConfigError(error instanceof Error ? error.message : 'Failed to load marketing configuration')
    } finally {
      setConfigLoading(false)
    }
  }, [])

  useEffect(() => {
    loadConfig()
  }, [loadConfig])

  const applyTemplate = useCallback((template: MarketingEmailTemplate) => {
    setSubject(template.subject)
    setPreheader(template.preheader)
    setHeading(template.heading)
    setBody(template.body)
    setCtaLabel(template.ctaLabel ?? '')
    setCtaUrl(template.ctaUrl ?? '')
    setReason(template.reason)
    setActiveTemplateId(template.id)
    setSendError(null)
    setTestSuccessMessage(null)
    setCampaignSummary(null)
    setCampaignFailedRecipients([])
  }, [])

  const clearForm = useCallback(() => {
    setSubject('')
    setPreheader('')
    setHeading('')
    setBody('')
    setCtaLabel('')
    setCtaUrl('')
    setReason('')
    setActiveTemplateId(null)
  }, [])

  const canSend = useMemo(() => {
    const hasCtaPair = (ctaLabel.trim().length > 0 && ctaUrl.trim().length > 0) || (!ctaLabel.trim() && !ctaUrl.trim())

    return (
      subject.trim().length >= 3 &&
      body.trim().length >= 10 &&
      reason.trim().length >= 8 &&
      hasCtaPair
    )
  }, [subject, body, reason, ctaLabel, ctaUrl])

  const sendTestEmail = async () => {
    try {
      setSendError(null)
      setTestSuccessMessage(null)
      setCampaignSummary(null)
      setCampaignFailedRecipients([])
      setTestLoading(true)

      const response = await fetch('/api/admin/marketing', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'send_test',
          testEmail: testEmail.trim(),
          subject: subject.trim(),
          preheader: preheader.trim() || undefined,
          heading: heading.trim() || undefined,
          body: body.trim(),
          ctaLabel: ctaLabel.trim() || undefined,
          ctaUrl: ctaUrl.trim() || undefined,
          reason: reason.trim() || 'Marketing test email from admin panel',
        }),
      })

      const payload = await response.json().catch(() => ({}))
      if (!response.ok) {
        throw new Error(payload.error || 'Failed to send test email')
      }

      setTestSuccessMessage(payload.message || 'Test email sent successfully')
    } catch (error) {
      setSendError(error instanceof Error ? error.message : 'Failed to send test email')
    } finally {
      setTestLoading(false)
    }
  }

  const sendCampaign = async () => {
    try {
      setSendError(null)
      setTestSuccessMessage(null)
      setCampaignSummary(null)
      setCampaignFailedRecipients([])
      setCampaignLoading(true)

      const numericLimit = recipientLimit.trim().length > 0 ? Number.parseInt(recipientLimit, 10) : undefined

      const response = await fetch('/api/admin/marketing', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'send_campaign',
          audience,
          subject: subject.trim(),
          preheader: preheader.trim() || undefined,
          heading: heading.trim() || undefined,
          body: body.trim(),
          ctaLabel: ctaLabel.trim() || undefined,
          ctaUrl: ctaUrl.trim() || undefined,
          reason: reason.trim(),
          limit: Number.isInteger(numericLimit) ? numericLimit : undefined,
        }),
      })

      const payload = await response.json().catch(() => ({}))
      if (!response.ok) {
        throw new Error(payload.error || 'Failed to send campaign')
      }

      setCampaignSummary(payload.summary as MarketingSendSummary)
      setCampaignFailedRecipients(
        Array.isArray(payload.failedRecipients) ? payload.failedRecipients : []
      )
      await loadConfig()
    } catch (error) {
      setSendError(error instanceof Error ? error.message : 'Failed to send campaign')
    } finally {
      setCampaignLoading(false)
    }
  }

  const audienceCounts = config?.audienceCounts || DEFAULT_COUNTS
  const serviceReady = Boolean(config?.emailServiceEnabled && config?.marketingEmailEnabled)
  const selectedAudienceCount =
    audience === 'active_users'
      ? audienceCounts.activeUsers
      : audience === 'newsletter_subscribers'
        ? audienceCounts.newsletterSubscribers
        : audienceCounts.allContacts

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Megaphone className="h-5 w-5 text-blue-600" />
              Marketing Email Controls
            </CardTitle>
            <CardDescription>
              Compose a campaign, send a test, then send to active users, newsletter subscribers, or both.
            </CardDescription>
          </div>
          <Button type="button" variant="outline" size="sm" onClick={() => loadConfig()} disabled={configLoading}>
            {configLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {configError && <div className="text-sm text-red-700 dark:text-red-300">{configError}</div>}

          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-lg border p-3">
              <div className="text-xs text-muted-foreground">Email Service</div>
              <div className="mt-1">
                <Badge variant={config?.emailServiceEnabled ? 'default' : 'destructive'}>
                  {config?.emailServiceEnabled ? 'Enabled' : 'Disabled'}
                </Badge>
              </div>
            </div>
            <div className="rounded-lg border p-3">
              <div className="text-xs text-muted-foreground">Marketing Emails</div>
              <div className="mt-1">
                <Badge variant={config?.marketingEmailEnabled ? 'default' : 'destructive'}>
                  {config?.marketingEmailEnabled ? 'Enabled' : 'Disabled'}
                </Badge>
              </div>
            </div>
            <div className="rounded-lg border p-3">
              <div className="text-xs text-muted-foreground">From Address</div>
              <div className="mt-1 text-sm font-medium">{config?.fromAddress || 'Not configured'}</div>
            </div>
            <div className="rounded-lg border p-3">
              <div className="text-xs text-muted-foreground">Total Reach</div>
              <div className="mt-1 text-sm font-medium">{audienceCounts.allContacts.toLocaleString()} contacts</div>
            </div>
          </div>

          <div className="grid gap-2 md:grid-cols-3">
            <div className="rounded-md border p-3 text-sm">
              Active users: <span className="font-medium">{audienceCounts.activeUsers.toLocaleString()}</span>
            </div>
            <div className="rounded-md border p-3 text-sm">
              Newsletter subscribers:{' '}
              <span className="font-medium">{audienceCounts.newsletterSubscribers.toLocaleString()}</span>
            </div>
            <div className="rounded-md border p-3 text-sm">
              Deduplicated all contacts:{' '}
              <span className="font-medium">{audienceCounts.allContacts.toLocaleString()}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <div>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-violet-600" />
              Ready-to-send Templates
            </CardTitle>
            <CardDescription>
              Click a template to load it into the composer. Edit any field before sending.
            </CardDescription>
          </div>
          {activeTemplateId && (
            <Button type="button" variant="ghost" size="sm" onClick={clearForm}>
              <Eraser className="mr-2 h-4 w-4" />
              Clear
            </Button>
          )}
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {MARKETING_EMAIL_TEMPLATES.map((template) => {
              const isActive = template.id === activeTemplateId
              return (
                <button
                  key={template.id}
                  type="button"
                  onClick={() => applyTemplate(template)}
                  className={`group flex h-full flex-col rounded-lg border p-4 text-left transition-colors hover:border-violet-400 hover:bg-violet-50/40 focus:outline-none focus:ring-2 focus:ring-violet-500 dark:hover:bg-violet-900/10 ${
                    isActive
                      ? 'border-violet-500 bg-violet-50 ring-1 ring-violet-500 dark:bg-violet-900/20'
                      : 'border-border bg-background'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="text-sm font-semibold leading-tight">{template.name}</div>
                    <Badge variant={isActive ? 'default' : 'secondary'} className="shrink-0 text-[10px] uppercase tracking-wide">
                      {getMarketingCategoryLabel(template.category)}
                    </Badge>
                  </div>
                  <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                    {template.description}
                  </p>
                  <div className="mt-3 line-clamp-2 rounded-md bg-muted/60 px-2 py-1.5 text-[11px] text-muted-foreground">
                    <span className="font-medium text-foreground">Subject:</span> {template.subject}
                  </div>
                </button>
              )
            })}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5 text-emerald-600" />
            Compose Campaign
          </CardTitle>
          <CardDescription>
            Write plain text content (line breaks are preserved). Test before sending to an audience.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-1">
              <Label htmlFor="marketing-subject">Subject</Label>
              <Input
                id="marketing-subject"
                value={subject}
                onChange={(event) => setSubject(event.target.value)}
                placeholder="New accessibility updates from Accessibility.build"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="marketing-preheader">Preheader (optional)</Label>
              <Input
                id="marketing-preheader"
                value={preheader}
                onChange={(event) => setPreheader(event.target.value)}
                placeholder="Short preview text shown in inboxes"
              />
            </div>
          </div>

          <div className="space-y-1">
            <Label htmlFor="marketing-heading">Heading (optional)</Label>
            <Input
              id="marketing-heading"
              value={heading}
              onChange={(event) => setHeading(event.target.value)}
              placeholder="Big heading in the email body"
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="marketing-body">Body</Label>
            <Textarea
              id="marketing-body"
              value={body}
              onChange={(event) => setBody(event.target.value)}
              placeholder="Write your campaign content here..."
              rows={10}
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-1">
              <Label htmlFor="marketing-cta-label">CTA Label (optional)</Label>
              <Input
                id="marketing-cta-label"
                value={ctaLabel}
                onChange={(event) => setCtaLabel(event.target.value)}
                placeholder="Read more"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="marketing-cta-url">CTA URL (optional)</Label>
              <Input
                id="marketing-cta-url"
                value={ctaUrl}
                onChange={(event) => setCtaUrl(event.target.value)}
                placeholder="https://accessibility.build/blog"
              />
            </div>
          </div>

          <div className="space-y-1">
            <Label htmlFor="marketing-reason">Reason / internal note</Label>
            <Textarea
              id="marketing-reason"
              value={reason}
              onChange={(event) => setReason(event.target.value)}
              placeholder="Why this campaign is being sent (stored in admin audit log)"
              rows={3}
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-1">
              <Label htmlFor="marketing-audience">Audience</Label>
              <select
                id="marketing-audience"
                className="h-10 w-full rounded-md border bg-background px-3 text-sm"
                value={audience}
                onChange={(event) => setAudience(event.target.value as MarketingAudience)}
              >
                <option value="all_contacts">{AUDIENCE_LABELS.all_contacts}</option>
                <option value="active_users">{AUDIENCE_LABELS.active_users}</option>
                <option value="newsletter_subscribers">{AUDIENCE_LABELS.newsletter_subscribers}</option>
              </select>
              <p className="text-xs text-muted-foreground">
                Eligible recipients in selected audience: {selectedAudienceCount.toLocaleString()}
              </p>
            </div>
            <div className="space-y-1">
              <Label htmlFor="marketing-limit">Recipient limit (optional)</Label>
              <Input
                id="marketing-limit"
                inputMode="numeric"
                value={recipientLimit}
                onChange={(event) => setRecipientLimit(event.target.value.replace(/[^\d]/g, ''))}
                placeholder="Leave blank to send to full audience"
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-1">
              <Label htmlFor="marketing-test-email">Test email</Label>
              <Input
                id="marketing-test-email"
                type="email"
                value={testEmail}
                onChange={(event) => setTestEmail(event.target.value)}
                placeholder="you@example.com"
              />
            </div>
            <div className="flex items-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={sendTestEmail}
                disabled={!serviceReady || !canSend || !testEmail.trim() || testLoading || campaignLoading}
              >
                {testLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
                Send Test
              </Button>
              <Button
                type="button"
                onClick={sendCampaign}
                disabled={!serviceReady || !canSend || campaignLoading || testLoading}
              >
                {campaignLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Megaphone className="mr-2 h-4 w-4" />}
                Send Campaign
              </Button>
            </div>
          </div>

          <div className="text-xs text-muted-foreground">
            Minimums: subject (3 chars), body (10 chars), reason (8 chars). CTA label and URL must be provided together.
          </div>
          {!serviceReady && (
            <div className="text-sm text-amber-700 dark:text-amber-300">
              Enable both email service and marketing emails to send test or campaign messages.
            </div>
          )}

          {sendError && <div className="text-sm text-red-700 dark:text-red-300">{sendError}</div>}
          {testSuccessMessage && (
            <div className="rounded-md border border-green-200 bg-green-50 p-3 text-sm text-green-800 dark:border-green-800 dark:bg-green-900/20 dark:text-green-300">
              {testSuccessMessage}
            </div>
          )}

          {campaignSummary && (
            <div className="space-y-3 rounded-md border border-green-200 bg-green-50 p-3 text-sm text-green-800 dark:border-green-800 dark:bg-green-900/20 dark:text-green-300">
              <div className="font-medium">Campaign sent</div>
              <div>Audience: {AUDIENCE_LABELS[campaignSummary.audience]}</div>
              <div>Requested recipients: {campaignSummary.requestedRecipients.toLocaleString()}</div>
              <div>Processed recipients: {campaignSummary.processedRecipients.toLocaleString()}</div>
              <div>Successfully sent: {campaignSummary.sent.toLocaleString()}</div>
              <div>Failed sends: {campaignSummary.failed.toLocaleString()}</div>
            </div>
          )}

          {campaignFailedRecipients.length > 0 && (
            <div className="space-y-2 rounded-md border border-amber-300 bg-amber-50 p-3 text-sm text-amber-900 dark:border-amber-700 dark:bg-amber-900/20 dark:text-amber-200">
              <div className="font-medium">Failed recipients (showing up to 50)</div>
              <div className="max-h-40 overflow-y-auto space-y-1 pr-1">
                {campaignFailedRecipients.map((failure) => (
                  <div key={failure.email} className="rounded border border-amber-200 bg-white/60 p-2 text-xs dark:border-amber-700 dark:bg-black/20">
                    <div className="font-medium">{failure.email}</div>
                    <div>{failure.error}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
