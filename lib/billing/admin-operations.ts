export const MIN_ADMIN_BILLING_REASON_LENGTH = 12

export function normalizeAdminBillingReason(value: string) {
  return value.trim().replace(/\s+/g, ' ')
}

export function isAdminBillingReasonValid(value: string) {
  return normalizeAdminBillingReason(value).length >= MIN_ADMIN_BILLING_REASON_LENGTH
}
