import { Given, Then, When } from '../../fixtures/test.fixture'
import { EndPoints } from '../../utils/enums'
import { StatusCodes } from 'http-status-codes/build/cjs/status-codes'
import { DelegationResponse } from '../../types/responses/delegationResponse.type'
import { UserResponse } from '../../types/responses/userResponse.type'
import { expect } from '@playwright/test'
import { HttpResponse } from '../../types/responses/httpResponse.type'
import { SelectedCph } from '../../types/selectedCph.type'

Given(
  'I create a new CPH delegation',
  async function ({ identityServiceHelperClient, userRoles }) {
    const delegationData = {
      county_parish_holding_id: this.cph.id,
      delegating_user_id: this.delegatingUser.id,
      delegated_user_role_id: userRoles[0].id,
      delegated_user_email: this.delegatedUser.email
    }
    this.delegation =
      await identityServiceHelperClient.post<DelegationResponse>(
        EndPoints.DelegationsApi,
        StatusCodes.CREATED,
        {
          data: delegationData,
          headers: {
            'x-operator-id': process.env.operatorId
          }
        }
      )
  }
)

Then('the delegation should be created successfully', async function () {
  expect(this.delegation).toBeDefined()
  expect(this.delegation).toHaveProperty('id')
  expect(this.delegation.county_parish_holding_id).toEqual(this.cph.id)
  expect(this.delegation.delegating_user_id).toEqual(this.delegatingUser.id)
  expect(this.delegation.delegated_user_email).toEqual(this.delegatedUser.email)
})

Given(
  'I can retrieve the delegation using its ID',
  async function ({ identityServiceHelperClient }) {
    const retrievedDelegation =
      await identityServiceHelperClient.get<DelegationResponse>(
        `${EndPoints.DelegationsApi}/${this.delegation.id}`,
        StatusCodes.OK
      )
    expect(retrievedDelegation).toBeDefined()
    expect(retrievedDelegation.id).toEqual(this.delegation.id)
  }
)

Given(
  'I retrieve all delegations',
  async function ({ identityServiceHelperClient }) {
    this.delegations = await identityServiceHelperClient.get<
      DelegationResponse[]
    >(EndPoints.DelegationsApi, StatusCodes.OK)
  }
)

Then(
  'the newly created delegation should be in the list of retrieved delegations',
  async function () {
    expect(Array.isArray(this.delegations)).toBe(true)
    const delegationIds = this.delegations.map((d: { id: string }) => d.id)
    expect(delegationIds).toContain(this.delegation.id)
  }
)

When(
  'I accept the CPH delegation invitation',
  async function ({ identityServiceHelperClient }) {
    const response = await identityServiceHelperClient.post(
      `${EndPoints.DelegationsApi}/${this.delegation.id}:accept`,
      StatusCodes.NO_CONTENT,
      {
        headers: {
          'x-operator-id': this.delegatedUser.id
        }
      }
    )
    expect(response).toBeDefined()
  }
)

Then(
  'the delegation should be accepted successfully',
  async function ({ identityServiceHelperClient }) {
    const retrievedDelegation =
      await identityServiceHelperClient.get<DelegationResponse>(
        `${EndPoints.DelegationsApi}/${this.delegation.id}`,
        StatusCodes.OK
      )
    expect(retrievedDelegation).toBeDefined()
    expect(retrievedDelegation.invitation_accepted_at).not.toBeNull()
    // TODO: Add assertion to check the delegation was accepted today.
  }
)

When(
  'I reject the CPH delegation invitation',
  async function ({ identityServiceHelperClient }) {
    const response = await identityServiceHelperClient.post(
      `${EndPoints.DelegationsApi}/${this.delegation.id}:reject`,
      StatusCodes.NO_CONTENT,
      {
        headers: {
          'x-operator-id': this.delegatedUser.id
        }
      }
    )
    expect(response).toBeDefined()
  }
)

Then(
  'the delegation should be rejected successfully',
  async function ({ identityServiceHelperClient }) {
    const retrievedDelegation =
      await identityServiceHelperClient.get<DelegationResponse>(
        `${EndPoints.DelegationsApi}/${this.delegation.id}`,
        StatusCodes.OK
      )
    expect(retrievedDelegation).toBeDefined()
    expect(retrievedDelegation.invitation_rejected_at).not.toBeNull()
    // TODO: Add assertion to check the delegation was rejected today.
  }
)

When(
  'I revoke the CPH delegation',
  async function ({ identityServiceHelperClient }) {
    const response = await identityServiceHelperClient.post(
      `${EndPoints.DelegationsApi}/${this.delegation.id}:revoke`,
      StatusCodes.NO_CONTENT,
      {
        headers: {
          'x-operator-id': this.delegatingUser.id
        }
      }
    )
    expect(response).toBeDefined()
  }
)

Then(
  'the delegation should be revoked successfully',
  async function ({ identityServiceHelperClient }) {
    const retrievedDelegation =
      await identityServiceHelperClient.get<DelegationResponse>(
        `${EndPoints.DelegationsApi}/${this.delegation.id}`,
        StatusCodes.OK
      )
    expect(retrievedDelegation).toBeDefined()
    expect(retrievedDelegation.revoked_at).not.toBeNull()
  }
)

When(
  'I expire the CPH delegation',
  async function ({ identityServiceHelperClient }) {
    const response = await identityServiceHelperClient.post(
      `${EndPoints.DelegationsApi}/${this.delegation.id}:expire`,
      StatusCodes.NO_CONTENT,
      {
        headers: {
          'x-operator-id': this.delegatingUser.id
        }
      }
    )
    expect(response).toBeDefined()
  }
)

Then(
  'the delegation should be expired successfully',
  async function ({ identityServiceHelperClient }) {
    const response = await identityServiceHelperClient.get<HttpResponse>(
      `${EndPoints.DelegationsApi}/${this.delegation.id}`,
      StatusCodes.NOT_FOUND
    )
    expect(response).toBeDefined()
    expect(response.title).toEqual('Not Found')
    expect(response.status).toEqual(StatusCodes.NOT_FOUND)
    expect(response.detail).toEqual(
      'County parish holding delegation not found'
    )
    expect(response.instance).toEqual(`/delegations/${this.delegation.id}`)
    expect(response.traceId).toBeDefined()
  }
)

Given(
  "I invite a delegate to manage my CPH's",
  async function ({ identityServiceHelperClient, delegationPage }) {
    const uuid = crypto.randomUUID()
    this.delegatedUser = await identityServiceHelperClient.post<UserResponse>(
      EndPoints.Users,
      StatusCodes.CREATED,
      {
        data: {
          email: `delegated.user.${uuid}@example.com`,
          first_name: 'Delegated',
          last_name: `User ${uuid}`,
          display_name: `Delegated User ${uuid}`
        },
        headers: {
          'x-operator-id': process.env.operatorId
        }
      }
    )
    this.selectedCphs = await delegationPage.addNewDelegate(
      this.delegatedUser.email,
      this.delegatingUserCphsHeld,
      identityServiceHelperClient
    )
  }
)

Given(
  "the delegate should see an invitation to manage the delegator's CPH's",
  async function ({ invitationsPage }) {
    await invitationsPage.verifyInvitation(
      this.delegatingUser.display_name,
      this.selectedCphs
    )
  }
)

When(
  'the delegate accepts the invitation',
  async function ({ invitationsPage }) {
    this.acceptedInvitations = await invitationsPage.acceptInvitation(
      this.delegatingUser.display_name,
      this.selectedCphs
    )
  }
)

When(
  'the delegate rejects the invitation',
  async function ({ invitationsPage }) {
    this.rejectedInvitations = await invitationsPage.rejectInvitation(
      this.delegatingUser.display_name,
      this.selectedCphs
    )
  }
)

Then(
  "I should see the delegate listed as managing my CPH's",
  async function ({ delegationPage }) {
    let cphsToProcess =
      this.acceptedInvitations !== undefined &&
      this.acceptedInvitations instanceof Array
        ? this.acceptedInvitations
        : []
    if (
      this.rejectedInvitations !== undefined &&
      this.rejectedInvitations instanceof Array
    ) {
      cphsToProcess = cphsToProcess.concat(this.rejectedInvitations)
    }
    await delegationPage.verifyDelegateCphMapping(
      this.delegatedUser.email,
      cphsToProcess
    )
  }
)

Then(
  "I should not see the delegate listed as managing my CPH's",
  async function ({ delegationPage }) {
    let cphsToProcess =
      this.acceptedInvitations !== undefined &&
      this.acceptedInvitations instanceof Array
        ? this.acceptedInvitations
        : []
    if (
      this.rejectedInvitations !== undefined &&
      this.rejectedInvitations instanceof Array
    ) {
      cphsToProcess = cphsToProcess.concat(this.rejectedInvitations)
    }
    await delegationPage.verifyDelegateCphMapping(
      this.delegatedUser.email,
      cphsToProcess
    )
  }
)

Then(
  'I should not be able to invite a delegate',
  async function ({ delegationPage }) {
    const message =
      'You do not have any County Parish Holdings assigned. You must claim your holdings before you can delegate access to them.'
    await expect(delegationPage.page.getByText(message)).toBeVisible()
    await expect(delegationPage.addDelegateButton).not.toBeVisible()
  }
)

Given(
  "I invite a delegate to manage {int} of my CPH's",
  async function (
    { identityServiceHelperClient, delegationPage },
    numberOfCphsToAssign: number
  ) {
    const uuid = crypto.randomUUID()
    this.delegatedUser = await identityServiceHelperClient.post<UserResponse>(
      EndPoints.Users,
      StatusCodes.CREATED,
      {
        data: {
          email: `delegated.user.${uuid}@example.com`,
          first_name: 'Delegated',
          last_name: `User ${uuid}`,
          display_name: `Delegated User ${uuid}`
        },
        headers: {
          'x-operator-id': process.env.operatorId
        }
      }
    )
    this.selectedCphs = await delegationPage.addNewDelegate(
      this.delegatedUser.email,
      this.delegatingUserCphsHeld,
      identityServiceHelperClient,
      numberOfCphsToAssign
    )
  }
)

When(
  'the delegate accepts {int} invitation',
  async function ({ invitationsPage }, numberOfInvitesToAccept: number) {
    const invitations: SelectedCph[] = []
    for (let i = 0; i < numberOfInvitesToAccept; i++) {
      invitations.push(this.selectedCphs.shift())
    }
    this.acceptedInvitations = await invitationsPage.acceptInvitation(
      this.delegatingUser.display_name,
      invitations
    )
  }
)

When(
  'the delegate rejects {int} invitation',
  async function ({ invitationsPage }, numberOfInvitesToDecline: number) {
    const invitations: SelectedCph[] = []
    for (let i = 0; i < numberOfInvitesToDecline; i++) {
      invitations.push(this.selectedCphs.shift())
    }
    this.rejectedInvitations = await invitationsPage.rejectInvitation(
      this.delegatingUser.display_name,
      invitations
    )
  }
)
