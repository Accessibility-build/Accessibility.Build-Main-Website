import { expect, test } from '@playwright/test'
import { clerk } from '@clerk/testing/playwright'

test('@smoke standard user can access /dashboard', async ({ page }) => {
  await page.goto('/dashboard')

  await expect(page).toHaveURL(/\/dashboard$/)
  await expect(page.getByRole('heading', { name: /Welcome back/i })).toBeVisible()
})

test('@smoke standard user can access /billing', async ({ page }) => {
  await page.goto('/billing')

  await expect(page).toHaveURL(/\/billing(?:\?.*)?$/)
  await expect(page.getByRole('heading', { name: /Billing & Credits/i })).toBeVisible()
})

test('@smoke standard user can access /profile', async ({ page }) => {
  await page.goto('/profile')

  await expect(page).toHaveURL(/\/profile(?:\/.*)?$/)
  await expect(page.getByRole('heading', { name: /Profile Settings/i })).toBeVisible()
})

test('@smoke standard user is redirected away from /admin', async ({ page }) => {
  await page.goto('/admin')

  await expect(page).toHaveURL(/\/$/)
})

test('@smoke sign-out clears the Clerk session for protected routes', async ({ page }) => {
  await page.goto('/dashboard')
  await clerk.loaded({ page })
  await clerk.signOut({ page })

  await page.goto('/dashboard')
  await expect(page).toHaveURL(/\/sign-in(?:\?|$)/)
})
