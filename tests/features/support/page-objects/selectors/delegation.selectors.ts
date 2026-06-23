import type { TestEnv } from '../../../../../configs/env'

export type DelegationSelectors = {
  headingText: string
  addDelegateButton: string
  emailInput: string
  continueButton: string
  cancelLink: string
  cphs: string
  selectedCphs: string
  confirmAndSendInviteButton: string
  successMessage: string
  delegates: string
  emailAddressText: string
  manageLink: string
  removeLink: string
  delegateEmail: string
  confirmButton: string
  prevPageLink: string
  nextPageLink: string
}

const delegationSelectorsByEnv: Record<TestEnv, DelegationSelectors> = {
  docker: {
    headingText: 'h1.govuk-heading-l',
    addDelegateButton:
      '.app-delegation-list__invite a:has-text("Add a new delegate")',
    emailInput: '#email',
    continueButton: 'button:has-text("Continue")',
    cancelLink: 'a:has-text("Cancel")',
    cphs: '.govuk-checkboxes .govuk-checkboxes__item input[type=checkbox]',
    selectedCphs: 'ul.govuk-list li',
    confirmAndSendInviteButton: 'button:has-text("Confirm and Send Invite")',
    successMessage: '.govuk-panel--confirmation .govuk-panel__title',
    delegates: '.app-delegation-list tr.govuk-table__row',
    emailAddressText: 'td.app-delegation-list__email',
    manageLink: 'a.has-text("Manage")',
    delegateEmail: '.govuk-summary-list__row .govuk-summary-list__value',
    removeLink: 'a:has-text("Remove")',
    confirmButton: 'button:has-text("Confirm")',
    nextPageLink: '.govuk-pagination__next a',
    prevPageLink: '.govuk-pagination__prev a'
  },
  local: {
    headingText: 'h1.govuk-heading-l',
    addDelegateButton:
      '.app-delegation-list__invite a:has-text("Add a new delegate")',
    emailInput: '#email',
    continueButton: 'button[type=submit]',
    cancelLink: 'a:has-text("Cancel")',
    cphs: '.govuk-checkboxes .govuk-checkboxes__item input[type=checkbox]',
    selectedCphs: 'ul.govuk-list li',
    confirmAndSendInviteButton: 'button:has-text("Confirm and Send Invite")',
    successMessage: '.govuk-panel--confirmation .govuk-panel__title',
    delegates: '.app-delegation-list tr.govuk-table__row',
    emailAddressText: 'td.app-delegation-list__email',
    manageLink: 'a:has-text("Manage")',
    delegateEmail: '.govuk-summary-list__row .govuk-summary-list__value',
    removeLink: 'a:has-text("Remove")',
    confirmButton: 'button:has-text("Confirm")',
    nextPageLink: '.govuk-pagination__next a',
    prevPageLink: '.govuk-pagination__prev a'
  },
  dev: {
    headingText: 'h1.govuk-heading-l',
    addDelegateButton:
      '.app-delegation-list__invite a:has-text("Add a new delegate")',
    emailInput: '#email',
    continueButton: 'button[type=submit]',
    cancelLink: 'a:has-text("Cancel")',
    cphs: '.govuk-checkboxes .govuk-checkboxes__item input[type=checkbox]',
    selectedCphs: 'ul.govuk-list li',
    confirmAndSendInviteButton: 'button:has-text("Confirm and Send Invite")',
    successMessage: '.govuk-panel--confirmation .govuk-panel__title',
    delegates: '.app-delegation-list tr.govuk-table__row',
    emailAddressText: 'td.app-delegation-list__email',
    manageLink: 'a:has-text("Manage")',
    delegateEmail: '.govuk-summary-list__row .govuk-summary-list__value',
    removeLink: 'a:has-text("Remove")',
    confirmButton: 'button:has-text("Confirm")',
    nextPageLink: '.govuk-pagination__next a',
    prevPageLink: '.govuk-pagination__prev a'
  },
  test: {
    headingText: 'h1.govuk-heading-l',
    addDelegateButton:
      '.app-delegation-list__invite a:has-text("Add a new delegate")',
    emailInput: '#email',
    continueButton: 'button[type=submit]',
    cancelLink: 'a:has-text("Cancel")',
    cphs: '.govuk-checkboxes .govuk-checkboxes__item input[type=checkbox]',
    selectedCphs: 'ul.govuk-list li',
    confirmAndSendInviteButton: 'button:has-text("Confirm and Send Invite")',
    successMessage: '.govuk-panel--confirmation .govuk-panel__title',
    delegates: '.app-delegation-list tr.govuk-table__row',
    emailAddressText: 'td.app-delegation-list__email',
    manageLink: 'a:has-text("Manage")',
    delegateEmail: '.govuk-summary-list__row .govuk-summary-list__value',
    removeLink: 'a:has-text("Remove")',
    confirmButton: 'button:has-text("Confirm")',
    nextPageLink: '.govuk-pagination__next a',
    prevPageLink: '.govuk-pagination__prev a'
  }
}

export function getDelegationSelectors(env: TestEnv): DelegationSelectors {
  return delegationSelectorsByEnv[env]
}
