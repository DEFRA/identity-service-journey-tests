import { Given, Then } from '../../fixtures/test.fixture'
import { HomePage } from '../support/page-objects/home.page'
import { expect } from '@playwright/test'

let homePage: HomePage

Given('I am on the identity service handler home page', async ({ page }) => {
  homePage = new HomePage(page)
  await homePage.navigateToHomePage()
})

Then('the home page should be loaded correctly', async function () {
  await expect(homePage.heading).toBeVisible()
  await expect(homePage.heading).toHaveText('404')
})
