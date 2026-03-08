import fs from 'node:fs'
import path from 'node:path'
import { expect, test } from '@playwright/test'
import { clerk } from '@clerk/testing/playwright'
import { adminStatePath, requiredEnv, userStatePath } from './helpers'

const authDir = path.join(process.cwd(), 'playwright/.auth')

test('create reusable auth states for the standard and admin Clerk users', async ({ browser }) => {
  fs.mkdirSync(authDir, { recursive: true })

  const standardEmail = requiredEnv('E2E_CLERK_USER_EMAIL')
  const standardPassword = requiredEnv('E2E_CLERK_USER_PASSWORD')
  const adminEmail = requiredEnv('E2E_CLERK_ADMIN_EMAIL')
  const adminPassword = requiredEnv('E2E_CLERK_ADMIN_PASSWORD')

  const userContext = await browser.newContext()
  const userPage = await userContext.newPage()

  await userPage.goto('/sign-in')
  await clerk.loaded({ page: userPage })
  await clerk.signIn({
    page: userPage,
    signInParams: {
      strategy: 'password',
      identifier: standardEmail,
      password: standardPassword,
    },
  })
  await userPage.goto('/dashboard')
  await expect(userPage.getByRole('heading', { name: /Welcome back/i })).toBeVisible()
  await userContext.storageState({ path: userStatePath })
  await userContext.close()

  const adminContext = await browser.newContext()
  const adminPage = await adminContext.newPage()

  await adminPage.goto('/sign-in')
  await clerk.loaded({ page: adminPage })
  await clerk.signIn({
    page: adminPage,
    signInParams: {
      strategy: 'password',
      identifier: adminEmail,
      password: adminPassword,
    },
  })
  await adminPage.goto('/admin')
  await expect(adminPage.getByRole('heading', { name: /Admin Dashboard/i })).toBeVisible()
  await adminContext.storageState({ path: adminStatePath })
  await adminContext.close()
})
