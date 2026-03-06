function marketingLayout(params: { preheader: string; body: string }): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="color-scheme" content="light" />
  <title>Accessibility.build</title>
  <style>
    body { margin: 0; padding: 0; background-color: #0f172a; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #e2e8f0; -webkit-text-size-adjust: 100%; }
    .container { max-width: 600px; margin: 0 auto; padding: 40px 20px; }
    .preheader { display: none; max-height: 0; overflow: hidden; mso-hide: all; }
    .hero { text-align: center; padding: 32px 24px 24px; }
    .hero h1 { font-size: 26px; font-weight: 700; margin: 0 0 8px; color: #ffffff; line-height: 1.3; }
    .hero .subtitle { font-size: 15px; color: #94a3b8; margin: 0; }
    .card { background: #1e293b; border-radius: 12px; padding: 28px; margin-bottom: 16px; border: 1px solid #334155; }
    .card-accent { border-left: 3px solid #22c55e; }
    .card h2 { font-size: 17px; font-weight: 600; margin: 0 0 8px; color: #ffffff; }
    .card p { font-size: 14px; line-height: 1.6; margin: 0 0 6px; color: #cbd5e1; }
    .card .tag { display: inline-block; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; color: #22c55e; background: rgba(34,197,94,0.1); padding: 3px 8px; border-radius: 4px; margin-bottom: 8px; }
    .services-grid { padding: 0 4px; }
    .service-row { display: table; width: 100%; margin-bottom: 12px; }
    .service-icon { display: table-cell; width: 40px; vertical-align: top; padding-top: 2px; }
    .service-icon span { display: inline-block; width: 32px; height: 32px; line-height: 32px; text-align: center; font-size: 16px; background: #334155; border-radius: 8px; }
    .service-text { display: table-cell; vertical-align: top; padding-left: 12px; }
    .service-text h3 { font-size: 15px; font-weight: 600; color: #f1f5f9; margin: 0 0 3px; }
    .service-text p { font-size: 13px; color: #94a3b8; margin: 0; line-height: 1.5; }
    .divider { height: 1px; background: #334155; margin: 24px 0; }
    .cta-section { text-align: center; padding: 24px; }
    .cta-section p { font-size: 15px; color: #cbd5e1; margin: 0 0 16px; }
    .cta-btn { display: inline-block; background: #22c55e; color: #ffffff; font-size: 15px; font-weight: 600; text-decoration: none; padding: 12px 32px; border-radius: 8px; }
    .cta-btn:hover { background: #16a34a; text-decoration: none; }
    .stats-row { display: table; width: 100%; text-align: center; padding: 16px 0; }
    .stat { display: table-cell; width: 33%; }
    .stat strong { display: block; font-size: 20px; font-weight: 700; color: #22c55e; }
    .stat span { font-size: 12px; color: #64748b; }
    .footer { text-align: center; padding: 32px 0 0; }
    .footer p { font-size: 12px; color: #475569; margin: 0 0 4px; }
    .footer a { color: #64748b; text-decoration: underline; }
    a { color: #60a5fa; text-decoration: none; }
  </style>
</head>
<body>
  <span class="preheader">${params.preheader}</span>
  <div class="container">
    ${params.body}
    <div class="footer">
      <p>Accessibility.build &mdash; Making the web work for everyone</p>
      <p>You got this because you signed up. No hard feelings if it&rsquo;s not your thing &mdash; we won&rsquo;t spam you.</p>
    </div>
  </div>
</body>
</html>`
}

function emailLayout(params: { preheader: string; body: string }): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="color-scheme" content="light" />
  <title>Accessibility.build</title>
  <style>
    body { margin: 0; padding: 0; background-color: #f9fafb; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #1f2937; -webkit-text-size-adjust: 100%; }
    .container { max-width: 560px; margin: 0 auto; padding: 40px 24px; }
    .card { background: #ffffff; border-radius: 8px; padding: 32px; border: 1px solid #e5e7eb; }
    .preheader { display: none; max-height: 0; overflow: hidden; mso-hide: all; }
    h1 { font-size: 22px; font-weight: 600; margin: 0 0 16px; color: #111827; }
    p { font-size: 15px; line-height: 1.6; margin: 0 0 12px; color: #374151; }
    .highlight { background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 6px; padding: 16px; margin: 16px 0; }
    .highlight strong { color: #15803d; }
    .highlight p { margin: 0 0 4px; }
    .highlight p:last-child { margin: 0; }
    .muted { font-size: 13px; color: #6b7280; }
    .footer { text-align: center; padding: 24px 0 0; }
    .footer p { font-size: 12px; color: #9ca3af; }
    a { color: #2563eb; text-decoration: none; }
    a:hover { text-decoration: underline; }
  </style>
</head>
<body>
  <span class="preheader">${params.preheader}</span>
  <div class="container">
    <div class="card">
      ${params.body}
    </div>
    <div class="footer">
      <p>Accessibility.build &mdash; Making the web accessible for everyone</p>
      <p class="muted">You received this email because of your account activity on Accessibility.build.</p>
    </div>
  </div>
</body>
</html>`
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function renderPlainTextAsHtmlParagraphs(value: string): string {
  const trimmed = value.trim()
  if (!trimmed) {
    return ''
  }

  return trimmed
    .split(/\n{2,}/)
    .map((block) => `<p>${escapeHtml(block).replace(/\n/g, '<br />')}</p>`)
    .join('\n')
}

export function renderWelcomeEmail(data: {
  firstName?: string | null
  credits: number
}): { subject: string; html: string } {
  const greeting = data.firstName ? `Hi ${data.firstName},` : 'Hi there,'

  return {
    subject: 'Welcome to Accessibility.build',
    html: emailLayout({
      preheader: `You have ${data.credits.toLocaleString()} free credits to get started.`,
      body: `
        <h1>Welcome to Accessibility.build</h1>
        <p>${greeting}</p>
        <p>Thanks for joining. Your account is ready, and we've added free credits so you can start right away.</p>
        <div class="highlight">
          <p><strong>${data.credits.toLocaleString()} credits</strong> added to your account</p>
        </div>
        <p>Use your credits on any of our tools &mdash; alt text generation, accessibility audits, contrast checking, and more.</p>
        <p><a href="https://accessibility.build/tools">Explore tools &rarr;</a></p>
        <p class="muted">If you have questions, reply to this email or visit our <a href="https://accessibility.build/contact">contact page</a>.</p>
      `,
    }),
  }
}

export function renderPurchaseConfirmationEmail(data: {
  firstName?: string | null
  orderId: string
  packName: string
  credits: number
  amountFormatted: string
  newBalance: number
}): { subject: string; html: string } {
  const greeting = data.firstName ? `Hi ${data.firstName},` : 'Hi there,'

  return {
    subject: `Receipt: ${data.packName} (${data.credits.toLocaleString()} credits)`,
    html: emailLayout({
      preheader: `Your purchase of ${data.credits.toLocaleString()} credits is confirmed.`,
      body: `
        <h1>Purchase confirmed</h1>
        <p>${greeting}</p>
        <p>Your payment has been processed and credits have been added to your account.</p>
        <div class="highlight">
          <p><strong>${data.packName}</strong></p>
          <p>Credits: <strong>${data.credits.toLocaleString()}</strong></p>
          <p>Amount: <strong>${data.amountFormatted}</strong></p>
          <p>New balance: <strong>${data.newBalance.toLocaleString()} credits</strong></p>
        </div>
        <p class="muted">Order ID: ${data.orderId}</p>
        <p>You can view your purchase history in the <a href="https://accessibility.build/billing/manage">billing center</a>.</p>
      `,
    }),
  }
}

export function renderRefundNotificationEmail(data: {
  firstName?: string | null
  orderId: string
  packName: string
  creditsReversed: number
  refundAmountFormatted: string
  remainingBalance: number
}): { subject: string; html: string } {
  const greeting = data.firstName ? `Hi ${data.firstName},` : 'Hi there,'

  return {
    subject: `Refund processed: ${data.packName}`,
    html: emailLayout({
      preheader: `A refund of ${data.refundAmountFormatted} has been processed for your account.`,
      body: `
        <h1>Refund processed</h1>
        <p>${greeting}</p>
        <p>A refund has been processed for your recent purchase. The corresponding credits have been adjusted.</p>
        <div class="highlight">
          <p><strong>${data.packName}</strong></p>
          <p>Credits reversed: <strong>${data.creditsReversed.toLocaleString()}</strong></p>
          <p>Refund amount: <strong>${data.refundAmountFormatted}</strong></p>
          <p>Remaining balance: <strong>${data.remainingBalance.toLocaleString()} credits</strong></p>
        </div>
        <p class="muted">Order ID: ${data.orderId}</p>
        <p>The refund will appear on your original payment method within 5&ndash;10 business days. If you have questions, <a href="https://accessibility.build/contact">contact us</a>.</p>
      `,
    }),
  }
}

export function renderServicesIntroEmail(data: {
  firstName?: string | null
}): { subject: string; html: string } {
  const name = data.firstName || 'there'

  return {
    subject: `Quick question, ${name} — is your site actually accessible?`,
    html: marketingLayout({
      preheader: 'We help teams ship accessible products. Here\'s what that looks like.',
      body: `
    <div class="hero">
      <h1>So you&rsquo;ve got the tools.<br/>But what if you need the humans?</h1>
      <p class="subtitle">We&rsquo;re not just a tool company. We do the hard stuff too.</p>
    </div>

    <div class="card card-accent">
      <p>Hey ${name},</p>
      <p>Welcome aboard. You probably signed up for the AI tools (good call), but we wanted you to know there&rsquo;s a whole team behind this thing.</p>
      <p>We&rsquo;ve worked with startups, agencies, and enterprise teams to make their products genuinely accessible &mdash; not just &ldquo;checkbox compliant.&rdquo;</p>
      <p>Here&rsquo;s what we actually do:</p>
    </div>

    <div class="services-grid">
      <div class="card">
        <div class="service-row">
          <div class="service-icon"><span>&#128269;</span></div>
          <div class="service-text">
            <h3>Accessibility Audits</h3>
            <p>Full WCAG 2.2 audit of your site. Automated scans catch maybe 30% of issues &mdash; we catch the rest. You get a prioritized list, not a 200-page PDF nobody reads.</p>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="service-row">
          <div class="service-icon"><span>&#128736;</span></div>
          <div class="service-text">
            <h3>Remediation &amp; Fixes</h3>
            <p>Found issues? We fix them. Code-level patches, ARIA patterns, content rewrites &mdash; whatever it takes. Works with React, Angular, Vue, or plain HTML.</p>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="service-row">
          <div class="service-icon"><span>&#127891;</span></div>
          <div class="service-text">
            <h3>Team Training</h3>
            <p>Workshops for designers, devs, and PMs. Not death-by-slides &mdash; hands-on, role-specific sessions. Your team ships accessible code because they understand why it matters.</p>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="service-row">
          <div class="service-icon"><span>&#127912;</span></div>
          <div class="service-text">
            <h3>Design Reviews</h3>
            <p>Catch accessibility problems in Figma, not in production. We review wireframes, mockups, and design systems before a single line of code is written.</p>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="service-row">
          <div class="service-icon"><span>&#129489;</span></div>
          <div class="service-text">
            <h3>User Testing with Real People</h3>
            <p>Screen reader users, keyboard-only navigators, people with cognitive disabilities &mdash; actual humans testing your product. That&rsquo;s how you find the stuff no scanner ever will.</p>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="service-row">
          <div class="service-icon"><span>&#128203;</span></div>
          <div class="service-text">
            <h3>Compliance Docs &amp; VPATs</h3>
            <p>Need an accessibility statement? VPAT for procurement? Remediation roadmap for legal? We write the boring-but-critical paperwork so you don&rsquo;t have to.</p>
          </div>
        </div>
      </div>
    </div>

    <div class="divider"></div>

    <div class="stats-row">
      <div class="stat">
        <strong>50K+</strong>
        <span>Developers</span>
      </div>
      <div class="stat">
        <strong>1M+</strong>
        <span>Insights</span>
      </div>
      <div class="stat">
        <strong>30+</strong>
        <span>Tools</span>
      </div>
    </div>

    <div class="divider"></div>

    <div class="cta-section">
      <p>Not sure where to start? Most teams don&rsquo;t.<br/>Grab a free consultation and we&rsquo;ll figure it out together.</p>
      <a href="https://accessibility.build/contact" class="cta-btn">Let&rsquo;s talk</a>
    </div>

    <div class="card" style="text-align:center; margin-top: 16px;">
      <p style="margin:0; font-size:13px; color:#94a3b8;">Or just use the tools &mdash; no pressure. <a href="https://accessibility.build/tools">Explore all tools &rarr;</a></p>
    </div>
      `,
    }),
  }
}

export function renderNewsletterWelcomeEmail(data: {
  firstName?: string | null
}): { subject: string; html: string } {
  const greeting = data.firstName ? `Hi ${data.firstName},` : 'Hi there,'

  return {
    subject: 'You are subscribed to Accessibility.build updates',
    html: emailLayout({
      preheader: 'You are in. We will send practical accessibility updates.',
      body: `
        <h1>Thanks for subscribing</h1>
        <p>${greeting}</p>
        <p>You are now subscribed to Accessibility.build email updates.</p>
        <p>We share practical accessibility insights, WCAG updates, and product announcements you can use right away.</p>
        <p><a href="https://accessibility.build/blog">Read recent accessibility guides &rarr;</a></p>
      `,
    }),
  }
}

export function renderMarketingCampaignEmail(data: {
  subject: string
  firstName?: string | null
  preheader?: string
  heading?: string
  body: string
  ctaLabel?: string
  ctaUrl?: string
}): { subject: string; html: string } {
  const heading = data.heading?.trim() || data.subject
  const greetingName = data.firstName?.trim() || 'there'
  const bodyHtml = renderPlainTextAsHtmlParagraphs(data.body)
  const preheader = data.preheader?.trim() || data.subject
  const ctaHtml =
    data.ctaLabel && data.ctaUrl
      ? `
    <div class="divider"></div>
    <div class="cta-section">
      <a href="${escapeHtml(data.ctaUrl)}" class="cta-btn">${escapeHtml(data.ctaLabel)}</a>
    </div>
      `
      : ''

  return {
    subject: data.subject,
    html: marketingLayout({
      preheader: escapeHtml(preheader),
      body: `
    <div class="hero">
      <h1>${escapeHtml(heading)}</h1>
      <p class="subtitle">From the Accessibility.build team</p>
    </div>

    <div class="card card-accent">
      <p>Hi ${escapeHtml(greetingName)},</p>
      ${bodyHtml}
    </div>
    ${ctaHtml}
      `,
    }),
  }
}
