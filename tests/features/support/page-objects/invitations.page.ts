import { Locator, Page, expect } from '@playwright/test'
import { BasePage } from './base.page'
import {
  getInvitationSelectors,
  InvitationSelectors
} from './selectors/invitation.selectors'
import { getEnv, TestEnv } from '../../../../configs/env'
import { SelectedCph } from '../../../types/selectedCph.type'
import { EndPoints } from '../../../utils/enums'

export class InvitationsPage extends BasePage {
  public readonly mainHeadingText: Locator
  public readonly acceptHeadingText: Locator
  public readonly body: Locator
  public readonly invitations: Locator
  public readonly acceptInvitationButton: Locator
  public readonly rejectInvitationButton: Locator
  public readonly cancelLink: Locator
  private readonly env: TestEnv
  private readonly selectors: InvitationSelectors
  public readonly nextPageLink: Locator
  public readonly prevPageLink: Locator

  constructor(page: Page) {
    super(page)
    this.env = getEnv()
    this.selectors = getInvitationSelectors(this.env)
    this.mainHeadingText = page.locator(this.selectors.mainHeadingText)
    this.acceptHeadingText = page.locator(this.selectors.acceptHeadingText)
    this.body = page.locator(this.selectors.body)
    this.invitations = page.locator(this.selectors.invitations)
    this.acceptInvitationButton = page.locator(
      this.selectors.acceptInvitationButton
    )
    this.rejectInvitationButton = page.locator(
      this.selectors.rejectInvitationButton
    )
    this.cancelLink = page.locator(this.selectors.cancelLink)
    this.nextPageLink = page.locator(this.selectors.nextPageLink)
    this.prevPageLink = page.locator(this.selectors.prevPageLink)
  }

  public async navigateToInvitationsPage() {
    if (this.page.url() !== EndPoints.Invitations) {
      await this.goto(EndPoints.Invitations)
    }
  }

  public async verifyInvitation(
    displayName: string,
    selectedCphs: SelectedCph[]
  ) {
    let itemPaginationCounter = 0
    for (const selectedCph of selectedCphs) {
      const invitation = this.invitations
        .filter({ hasText: selectedCph.cphNumber })
        .filter({ hasText: displayName })
      await expect(invitation).toBeVisible()
      ++itemPaginationCounter
      if (selectedCphs.length > 5 && itemPaginationCounter > 5) {
        await this.nextPageLink.click()
      }
    }
  }

  public async acceptInvitation(
    displayName: string,
    selectedCphs: SelectedCph[]
  ) {
    const env = getEnv()
    const selectors = getInvitationSelectors(env)

    for (const selectedCph of selectedCphs) {
      const invitation = await this.invitations
        .filter({ hasText: selectedCph.cphNumber })
        .filter({ hasText: displayName })
      await invitation.locator(selectors.acceptLink).click()
      await expect(this.acceptHeadingText).toHaveText('Accept this invitation?')
      await expect(this.acceptInvitationButton).toBeVisible()
      await expect(
        this.alertMessage.filter({
          hasText: `You are accepting an invitation from ${displayName} to manage County Parish Holding number ${selectedCph.cphNumber}.`
        })
      ).toBeVisible()
      await this.acceptInvitationButton.click()
      await this.alert.waitFor({ state: 'visible' })
      await expect(this.alertHeading).toContainText('Invitation accepted')
      await expect(
        this.alertMessage.filter({
          hasText: `You can now manage County Parish Holding number ${selectedCph.cphNumber} on behalf of ${displayName}.`
        })
      ).toBeVisible()
      selectedCph.status = 'accepted'
    }
    return selectedCphs
  }

  public async rejectInvitation(
    displayName: string,
    selectedCphs: SelectedCph[]
  ) {
    const env = getEnv()
    const selectors = getInvitationSelectors(env)

    for (const selectedCph of selectedCphs) {
      const invitation = await this.invitations
        .filter({ hasText: selectedCph.cphNumber })
        .filter({ hasText: displayName })
      await invitation.locator(selectors.rejectLink).click()
      await expect(this.acceptHeadingText).toHaveText('Reject this invitation?')
      await expect(this.rejectInvitationButton).toBeVisible()
      await expect(
        this.alertMessage.filter({
          hasText: `You are rejecting an invitation from ${displayName} to manage County Parish Holding number ${selectedCph.cphNumber}.`
        })
      )
      await this.rejectInvitationButton.click()
      await this.alert.waitFor({ state: 'visible' })
      await expect(this.alertHeading).toContainText('Invitation rejected')
      await expect(
        this.alertMessage.filter({
          hasText: `You rejected the invitation from ${displayName} for County Parish Holding number ${selectedCph.cphNumber}.`
        })
      ).toBeVisible()
      selectedCph.status = 'rejected'
    }
    return selectedCphs
  }
}
