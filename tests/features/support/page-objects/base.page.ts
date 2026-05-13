import { Locator, Page } from '@playwright/test'

export class BasePage {
  public page: Page
  public readonly heading: Locator

  constructor(page: Page) {
    this.page = page
    this.heading = page.getByTestId('app-heading-title')
  }

  async goto(path: string) {
    await this.page.goto(path)
  }

  async getTitle() {
    return await this.page.title()
  }
}
