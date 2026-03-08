import { expect, test } from '@playwright/test'

test('@smoke admin user can access /admin', async ({ page }) => {
  await page.goto('/admin')

  await expect(page).toHaveURL(/\/admin$/)
  await expect(page.getByRole('heading', { name: /Admin Dashboard/i })).toBeVisible()
})
