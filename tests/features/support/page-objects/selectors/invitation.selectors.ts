import type { TestEnv } from '../../../../../configs/env'

export type InvitationSelectors = {
  mainHeadingText: string
  acceptHeadingText: string
  body: string
  invitations: string
  cphNumber: string
  invitedBy: string
  acceptLink: string
  rejectLink: string
  acceptInvitationButton: string
  rejectInvitationButton: string
  cancelLink: string
  prevPageLink: string
  nextPageLink: string
}

const invitationSelectorsByEnv: Record<TestEnv, InvitationSelectors> = {
  docker: {
    mainHeadingText: '.govuk-heading-xl',
    acceptHeadingText: '.govuk-heading-l',
    body: '.govuk-body',
    invitations: '.govuk-table tr.govuk-table__row',
    cphNumber: 'td:nth-child(0)',
    invitedBy: 'td:nth-child(1)',
    acceptLink: 'a:has-text("Accept")',
    rejectLink: 'a:has-text("Reject")',
    acceptInvitationButton: 'button:has-text("Accept invitation")',
    rejectInvitationButton: 'button:has-text("Reject invitation")',
    cancelLink: 'a:has-text("Cancel")',
    nextPageLink: '.govuk-pagination__next a',
    prevPageLink: '.govuk-pagination__prev a'
  },
  local: {
    mainHeadingText: '.govuk-heading-xl',
    acceptHeadingText: '.govuk-heading-l',
    body: '.govuk-body',
    invitations: '.govuk-table tr.govuk-table__row',
    cphNumber: 'td:nth-child(0)',
    invitedBy: 'td:nth-child(1)',
    acceptLink: 'a:has-text("Accept")',
    rejectLink: 'a:has-text("Reject")',
    acceptInvitationButton: 'button:has-text("Accept invitation")',
    rejectInvitationButton: 'button:has-text("Reject invitation")',
    cancelLink: 'a:has-text("Cancel")',
    nextPageLink: '.govuk-pagination__next a',
    prevPageLink: '.govuk-pagination__prev a'
  },
  dev: {
    mainHeadingText: '.govuk-heading-xl',
    acceptHeadingText: '.govuk-heading-l',
    body: '.govuk-body',
    invitations: '.govuk-table tr.govuk-table__row',
    cphNumber: 'td:nth-child(0)',
    invitedBy: 'td:nth-child(1)',
    acceptLink: 'a:has-text("Accept")',
    rejectLink: 'a:has-text("Reject")',
    acceptInvitationButton: 'button:has-text("Accept invitation")',
    rejectInvitationButton: 'button:has-text("Reject invitation")',
    cancelLink: 'a:has-text("Cancel")',
    nextPageLink: '.govuk-pagination__next a',
    prevPageLink: '.govuk-pagination__prev a'
  },
  test: {
    mainHeadingText: '.govuk-heading-xl',
    acceptHeadingText: '.govuk-heading-l',
    body: '.govuk-body',
    invitations: '.govuk-table tr.govuk-table__row',
    cphNumber: 'td:nth-child(0)',
    invitedBy: 'td:nth-child(1)',
    acceptLink: 'a:has-text("Accept")',
    rejectLink: 'a:has-text("Reject")',
    acceptInvitationButton: 'button:has-text("Accept invitation")',
    rejectInvitationButton: 'button:has-text("Reject invitation")',
    cancelLink: 'a:has-text("Cancel")',
    nextPageLink: '.govuk-pagination__next a',
    prevPageLink: '.govuk-pagination__prev a'
  }
}

export function getInvitationSelectors(env: TestEnv): InvitationSelectors {
  return invitationSelectorsByEnv[env]
}
