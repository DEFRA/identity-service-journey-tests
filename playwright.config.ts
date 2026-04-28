import * as dotenv from 'dotenv'
import * as fs from 'fs'
import { defineConfig, devices } from '@playwright/test'
import { defineBddConfig } from 'playwright-bdd'
import type { GitHubActionOptions } from '@estruyf/github-actions-reporter'
import { ReporterDescription } from 'playwright/test'

const serverTimeout = 2 * 60 * 1000
// Set Environment
const ENV = process.env.ENVIRONMENT ?? 'local'
const isLocal = ENV === 'local'

// Only load env files for local + docker
let envFile: string | null = null

if (ENV === 'local') envFile = '.env'
if (ENV === 'docker') envFile = '.env.docker'

if (envFile && fs.existsSync(envFile)) {
  dotenv.config({ path: envFile })
}

// Read values from environment variables
const ui =
  process.env.IDENTITY_SERVICE_FRONTEND_BASE_URL || 'https://localhost:3000'
const api =
  process.env.IDENTITY_SERVICE_BACKEND_BASE_URL || 'http://localhost:3001'
const apiExt = process.env.IDENTITY_SERVICE_BACKEND_EXTERNAL_BASE_URL ?? ''
const isCDPEnvironment = ENV === 'dev' || ENV === 'test'

process.env.isLocal = isLocal.toString()
process.env.uiURL = ui
process.env.apiURL = api
process.env.apiURLExt = apiExt
process.env.apiKey =
  !process.env.CI && ENV === 'dev' && process.env.CDP === undefined
    ? 'API_KEY'
    : undefined

const reporters: ReporterDescription[] = [
  ['list'], // CLI console output
  [
    'html',
    {
      outputFolder: 'playwright-report/html',
      open: isCDPEnvironment ? 'never' : 'on-failure'
    }
  ],
  ['json', { outputFile: 'playwright-report/results.json' }],
  ['allure-playwright', { reportDir: 'allure-report' }]
]

// Enable GitHub reporter ONLY inside GitHub Actions runner
if (process.env.GITHUB_ACTIONS === 'true') {
  reporters.push([
    '@estruyf/github-actions-reporter',
    <GitHubActionOptions>{
      title: `Journey Tests on environment: ${ENV}`,
      useDetails: true,
      showError: true
    }
  ])
}

const testDir = defineBddConfig({
  features: 'tests/features/**/*.feature',
  steps: 'tests/features/step-definitions/**/*.ts'
})

export default defineConfig({
  testDir,
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: reporters,
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('')`. */
    baseURL: ui,
    screenshot: 'only-on-failure',
    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'retain-on-failure',
    video: 'retain-on-failure',
    ignoreHTTPSErrors: true
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] }
    }

    /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },

    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    // },
  ],

  /* Run your local dev server before starting the tests if we are in a local development environment */
  webServer: isLocal
    ? [
        {
          name: 'backend-server',
          command: 'bin/platform.sh backend up',
          gracefulShutdown: { signal: 'SIGTERM', timeout: serverTimeout },
          url: 'http://127.0.0.1:3001/health',
          reuseExistingServer: !process.env.CI,
          timeout: serverTimeout
        },
        {
          name: 'frontend-server',
          command: 'bin/platform.sh frontend up',
          gracefulShutdown: { signal: 'SIGTERM', timeout: serverTimeout },
          ignoreHTTPSErrors: true,
          url: 'https://localhost:3000/health',
          reuseExistingServer: !process.env.CI,
          timeout: serverTimeout
        }
      ]
    : []
})
