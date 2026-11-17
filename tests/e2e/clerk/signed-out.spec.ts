import { expect, test } from '@playwright/test'
import { clerk } from '@clerk/testing/playwright'

test('@smoke /sign-in renders with Clerk loaded', async ({ page }) => {
  await page.goto('/sign-in')
  await clerk.loaded({ page })

  const formRegion = page.getByRole('region', { name: 'Sign in', exact: true })
  await expect(formRegion).toBeVisible()
  await expect(formRegion.getByRole('heading').first()).toBeVisible()
  await expect(page.getByText('Welcome back', { exact: true })).toBeVisible()
})

test('@smoke /sign-up renders with Clerk loaded', async ({ page }) => {
  await page.goto('/sign-up')
  await clerk.loaded({ page })

  const formRegion = page.getByRole('region', { name: 'Create an account', exact: true })
  await expect(formRegion).toBeVisible()
  await expect(formRegion.getByRole('heading').first()).toBeVisible()
  await expect(page.getByText(/Welcome credits are included/i)).toBeVisible()
})

for (const route of ['/billing', '/billing/manage', '/dashboard', '/profile', '/admin']) {
  test(`@smoke signed-out visitors are redirected away from ${route}`, async ({ page }) => {
    await page.goto(route)

    await expect(page).toHaveURL(/\/sign-in(?:\?|$)/)
    await expect(page.getByRole('region', { name: 'Sign in', exact: true })).toBeVisible()
  })
}
