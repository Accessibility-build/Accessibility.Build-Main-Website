import { expect, test } from '@playwright/test'
import { clerk } from '@clerk/testing/playwright'

test('@smoke /sign-in renders with Clerk loaded', async ({ page }) => {
  await page.goto('/sign-in')
  await clerk.loaded({ page })

  await expect(page.getByRole('heading', { name: /Welcome back/i })).toBeVisible()
  await expect(page.getByText(/Access your accessibility dashboard/i)).toBeVisible()
})

test('@smoke /sign-up renders with Clerk loaded', async ({ page }) => {
  await page.goto('/sign-up')
  await clerk.loaded({ page })

  await expect(page.getByRole('heading', { name: /Start building/i })).toBeVisible()
  await expect(page.getByText(/Get started with 100 free credits/i)).toBeVisible()
})

for (const route of ['/billing', '/billing/manage', '/dashboard', '/profile', '/admin']) {
  test(`@smoke signed-out visitors are redirected away from ${route}`, async ({ page }) => {
    await page.goto(route)

    await expect(page).toHaveURL(/\/sign-in(?:\?|$)/)
    await expect(page.getByRole('heading', { name: /Welcome back/i })).toBeVisible()
  })
}
