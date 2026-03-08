import { defineConfig } from '@playwright/test'

const baseURL = (process.env.NEXT_PUBLIC_APP_URL || 'http://127.0.0.1:3000').replace(/\/$/, '')
const serverUrl = new URL(baseURL)
const serverPort = serverUrl.port || (serverUrl.protocol === 'https:' ? '443' : '80')
const shouldManageWebServer = process.env.PLAYWRIGHT_SKIP_WEBSERVER !== '1'

export default defineConfig({
  testDir: './tests/e2e/clerk',
  timeout: 90_000,
  expect: {
    timeout: 15_000,
  },
  fullyParallel: false,
  workers: 1,
  globalSetup: './tests/e2e/clerk/global-setup.ts',
  outputDir: 'test-results/playwright',
  reporter: process.env.CI ? [['github'], ['html', { open: 'never' }]] : [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  webServer: shouldManageWebServer
    ? {
        command: `npm run dev -- --hostname ${serverUrl.hostname} --port ${serverPort}`,
        url: `${baseURL}/sign-in`,
        timeout: 120_000,
        reuseExistingServer: true,
        env: {
          ...process.env,
          NEXT_PUBLIC_APP_URL: baseURL,
          EMAIL_SERVICE_ENABLED: process.env.EMAIL_SERVICE_ENABLED ?? 'false',
          EMAIL_MARKETING_ENABLED: process.env.EMAIL_MARKETING_ENABLED ?? 'false',
        },
      }
    : undefined,
  projects: [
    {
      name: 'setup',
      testMatch: /auth\.setup\.ts/,
    },
    {
      name: 'signed-out',
      dependencies: ['setup'],
      testMatch: ['**/signed-out.spec.ts', '**/signup.spec.ts'],
    },
    {
      name: 'signed-in-user',
      dependencies: ['setup'],
      testMatch: '**/user.spec.ts',
      use: {
        storageState: 'playwright/.auth/user.json',
      },
    },
    {
      name: 'signed-in-admin',
      dependencies: ['setup'],
      testMatch: '**/admin.spec.ts',
      use: {
        storageState: 'playwright/.auth/admin.json',
      },
    },
  ],
})
