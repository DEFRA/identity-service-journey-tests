import { BasePage } from './base.page'
import { Locator, Page } from '@playwright/test'
import { getLoginSelectors } from './selectors/login.selectors'
import { getEnv } from '../../../../configs/env'
import { EndPoints } from '../../../utils/enums'

export class LoginPage extends BasePage {
  public readonly emailAddressInput: Locator
  public readonly signInButton: Locator

  constructor(page: Page) {
    super(page)
    const env = getEnv()
    const selectors = getLoginSelectors(env)
    this.emailAddressInput = page.locator(selectors.emailAddressInput)
    this.signInButton = page.locator(selectors.signInButton)
  }

  public async authenticate(emailAddress: string, redirect: EndPoints) {
    await this.goto(`/login?next=${redirect}`)
    await Promise.all([this.page.waitForURL(/b2c\/authorize/)])
    await this.emailAddressInput.waitFor({
      state: 'visible'
    })
    await this.emailAddressInput.fill(emailAddress)
    await this.signInButton.click()
  }
}
