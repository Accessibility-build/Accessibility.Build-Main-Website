export type EmailType =
  | 'welcome'
  | 'services_intro'
  | 'newsletter_welcome'
  | 'marketing_campaign'
  | 'purchase_confirmation'
  | 'refund_notification'

export interface EmailRecipient {
  email: string
  firstName?: string | null
  lastName?: string | null
}

export interface WelcomeEmailData {
  type: 'welcome'
  recipient: EmailRecipient
  credits: number
}

export interface PurchaseConfirmationEmailData {
  type: 'purchase_confirmation'
  recipient: EmailRecipient
  orderId: string
  packName: string
  credits: number
  amountFormatted: string
  currency: string
  paymentProvider: 'stripe' | 'razorpay'
  newBalance: number
}

export interface ServicesIntroEmailData {
  type: 'services_intro'
  recipient: EmailRecipient
}

export interface NewsletterWelcomeEmailData {
  type: 'newsletter_welcome'
  recipient: EmailRecipient
  source: 'footer' | 'blog' | 'other'
}

export interface MarketingCampaignEmailData {
  type: 'marketing_campaign'
  campaignId: string
  recipient: EmailRecipient
  subject: string
  preheader?: string
  heading?: string
  body: string
  ctaLabel?: string
  ctaUrl?: string
}

export interface RefundNotificationEmailData {
  type: 'refund_notification'
  recipient: EmailRecipient
  orderId: string
  packName: string
  creditsReversed: number
  refundAmountFormatted: string
  currency: string
  remainingBalance: number
}

export type TransactionalEmailData =
  | WelcomeEmailData
  | ServicesIntroEmailData
  | NewsletterWelcomeEmailData
  | MarketingCampaignEmailData
  | PurchaseConfirmationEmailData
  | RefundNotificationEmailData

export interface EmailSendResult {
  success: boolean
  resendId?: string
  error?: string
}
