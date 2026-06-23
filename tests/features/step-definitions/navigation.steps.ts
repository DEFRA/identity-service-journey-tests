import { Given } from '../../fixtures/test.fixture'

Given(
  'I am on the identity service handler delegations page',
  async function ({ delegationPage }) {
    await delegationPage.navigateToDelegationPage()
  }
)

Given(
  'the delegate is on the identity service handler invitations page',
  async function ({ invitationsPage }) {
    await invitationsPage.navigateToInvitationsPage()
  }
)
