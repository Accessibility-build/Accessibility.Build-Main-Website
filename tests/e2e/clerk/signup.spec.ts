import { expect, test } from '@playwright/test'
import { createPageObjects } from '@clerk/testing/playwright/unstable'
import {
  createDisposableEmail,
  createDisposablePassword,
  deleteClerkUserByEmail,
  deleteDbUserByEmail,
} from './helpers'

test('@extended disposable sign-up lands on /welcome and can reach protected pages', async ({ page }) => {
  const email = createDisposableEmail('playwright')
  const password = createDisposablePassword()
  const { signUp } = createPageObjects({
    page,
    useTestingToken: true,
    baseURL: process.env.NEXT_PUBLIC_APP_URL,
  })

  await deleteClerkUserByEmail(email)
  await deleteDbUserByEmail(email)

  try {
    await signUp.goTo()
    await signUp.signUpWithEmailAndPassword({
      email,
      password,
    })
    await signUp.waitForEmailVerificationScreen()
    await signUp.enterTestOtpCode()
    await signUp.waitForSession()

    await expect(page).toHaveURL(/\/welcome(?:\?.*)?$/)

    await page.goto('/dashboard')
    await expect(page.getByRole('heading', { name: /Welcome back/i })).toBeVisible()

    await page.goto('/onboarding')
    await expect(page.getByRole('heading', { name: /Welcome to Accessibility\.build/i })).toBeVisible()

    await page.goto('/profile')
    await expect(page.getByRole('heading', { name: /Profile Settings/i })).toBeVisible()
  } finally {
    await deleteClerkUserByEmail(email)
    await deleteDbUserByEmail(email)
  }
})
