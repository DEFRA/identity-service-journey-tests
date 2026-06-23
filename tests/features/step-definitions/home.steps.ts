import { Given, Then } from '../../fixtures/test.fixture'
import { expect } from '@playwright/test'

Given(
  'I am on the identity service handler home page',
  async ({ homePage }) => {
    await homePage.navigateToHomePage()
  }
)

Then('the home page should be loaded correctly', async function ({ homePage }) {
  await expect(homePage.heading).toBeVisible()
  await expect(homePage.heading).toHaveText('404')
})
