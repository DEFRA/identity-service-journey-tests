import { expect, Locator, Page } from '@playwright/test'
import { BasePage } from './base.page'
import {
  getDelegationSelectors,
  DelegationSelectors
} from './selectors/delegation.selectors'
import { getEnv, TestEnv } from '../../../../configs/env'
import { SelectedCph } from '../../../types/selectedCph.type'
import { IdentityServiceHelperClient } from '../api/identity.service.helper.client'
import { CPHItem } from '../../../types/responses/cphResponse.type'
import { EndPoints } from '../../../utils/enums'
import { StatusCodes } from 'http-status-codes'

export class DelegationPage extends BasePage {
  public readonly headingText: Locator
  public readonly addDelegateButton: Locator
  public readonly emailInput: Locator
  public readonly continueButton: Locator
  public readonly cancelLink: Locator
  public readonly cphs: Locator
  public readonly selectedCphs: Locator
  public readonly confirmAndSendInviteButton: Locator
  public readonly successMessage: Locator
  public readonly delegates: Locator
  public readonly delegateEmail: Locator
  public readonly removeLink: Locator
  private readonly env: TestEnv
  private readonly selectors: DelegationSelectors
  public readonly nextPageLink: Locator
  public readonly prevPageLink: Locator

  constructor(page: Page) {
    super(page)
    this.env = getEnv()
    this.selectors = getDelegationSelectors(this.env)
    this.headingText = page.locator(this.selectors.headingText)
    this.addDelegateButton = page.locator(this.selectors.addDelegateButton)
    this.emailInput = page.locator(this.selectors.emailInput)
    this.continueButton = page.locator(this.selectors.continueButton)
    this.cphs = page.locator(this.selectors.cphs)
    this.selectedCphs = page.locator(this.selectors.selectedCphs)
    this.cancelLink = page.locator(this.selectors.cancelLink)
    this.confirmAndSendInviteButton = page.locator(
      this.selectors.confirmAndSendInviteButton
    )
    this.successMessage = page.locator(this.selectors.successMessage)
    this.delegates = page.locator(this.selectors.delegates)
    this.delegateEmail = page.locator(this.selectors.delegateEmail)
    this.removeLink = page.locator(this.selectors.removeLink)
    this.nextPageLink = page.locator(this.selectors.nextPageLink)
    this.prevPageLink = page.locator(this.selectors.prevPageLink)
  }

  public async navigateToDelegationPage() {
    if (this.page.url() !== EndPoints.Delegations) {
      await this.goto(EndPoints.Delegations)
    }
  }

  public async addNewDelegate(
    emailAddress: string,
    cphsHeld: 'multiple' | 'single' | 'no',
    identityServiceHelperClient: IdentityServiceHelperClient,
    numberOfCphsToAssign?: number
  ) {
    const selectedCphsList = []
    await this.addDelegateButton.click()
    await this.emailInput.waitFor({ state: 'visible' })
    await this.emailInput.fill(emailAddress)
    await this.continueButton.click()
    // If multiple CPH's select a random set of them
    if (cphsHeld === 'multiple') {
      if (numberOfCphsToAssign === undefined) {
        const numOfCphs = (await this.cphs.all()).length
        numberOfCphsToAssign = Math.floor(
          Math.random() * (numOfCphs - 2 + 1) + 2
        )
      }
      for (let i = 0; i < numberOfCphsToAssign; i++) {
        const cph = (await this.cphs.all())[i]
        await cph.check()
      }
      await this.continueButton.click()
    }
    // Then on the summary page save a list of selected CPH's
    for (const selectedCph of await this.selectedCphs.all()) {
      // Hydrate cph details
      const cphDetail = await identityServiceHelperClient.get<CPHItem>(
        `${EndPoints.Cphs}/${await selectedCph.innerText()}`,
        StatusCodes.OK
      )
      selectedCphsList.push({
        id: cphDetail.id,
        cphNumber: cphDetail.county_parish_holding_number
      })
    }
    await this.confirmAndSendInviteButton.click()
    await this.successMessage.waitFor({ state: 'visible' })
    return selectedCphsList
  }

  public async verifyDelegateCphMapping(
    delegateEmail: string,
    selectedCphs: SelectedCph[]
  ) {
    do {
      const delegate = await this.delegates.filter({
        hasText: delegateEmail
      })
      if (await delegate.isVisible({ timeout: 1000 })) {
        // If the delegator has more than 1 CPH then we have the ability to manage them
        if (selectedCphs.length > 1) {
          await delegate.locator(this.selectors.manageLink).click()
          await expect(this.headingText).toHaveText('Manage delegate')
          await expect(this.delegateEmail).toHaveText(delegateEmail)
          await expect(this.removeLink).toBeVisible()
          for (const selectedCph of selectedCphs) {
            if (selectedCph.status === 'accepted') {
              await expect(this.cphs.locator(`input[value=${selectedCph.id}]`))
                .toBeChecked
            } else {
              await expect(this.cphs.locator(`input[value=${selectedCph.id}]`))
                .not.toBeChecked
            }
          }
        }
        // Else we just get the ability to remove them
        else {
          await expect(
            delegate.locator(this.selectors.manageLink)
          ).not.toBeVisible({ timeout: 1000 })
          await expect(
            delegate.locator(this.selectors.removeLink)
          ).toBeVisible()
        }
        break
      }
      if (await this.nextPageLink.isVisible({ timeout: 1000 })) {
        await this.nextPageLink.click()
      }
    } while (await this.nextPageLink.isVisible({ timeout: 1000 }))
  }
}
