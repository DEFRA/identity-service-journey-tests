import { Given, Then, When } from '../../fixtures/test.fixture'
import { EndPoints } from '../../utils/enums'
import { StatusCodes } from 'http-status-codes/build/cjs/status-codes'
import { DelegationResponse } from '../../types/responses/delegationResponse.type'
import { expect } from '@playwright/test'
import { HttpResponse } from '../../types/responses/httpResponse.type'

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
        EndPoints.Delegations,
        StatusCodes.CREATED,
        {
          data: delegationData
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
        `${EndPoints.Delegations}/${this.delegation.id}`,
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
    >(EndPoints.Delegations, StatusCodes.OK)
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
      `${EndPoints.Delegations}/${this.delegation.id}:accept`,
      StatusCodes.NO_CONTENT
    )
    expect(response).toBeDefined()
  }
)

Then(
  'the delegation should be accepted successfully',
  async function ({ identityServiceHelperClient }) {
    const retrievedDelegation =
      await identityServiceHelperClient.get<DelegationResponse>(
        `${EndPoints.Delegations}/${this.delegation.id}`,
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
      `${EndPoints.Delegations}/${this.delegation.id}:reject`,
      StatusCodes.NO_CONTENT
    )
    expect(response).toBeDefined()
  }
)

Then(
  'the delegation should be rejected successfully',
  async function ({ identityServiceHelperClient }) {
    const retrievedDelegation =
      await identityServiceHelperClient.get<DelegationResponse>(
        `${EndPoints.Delegations}/${this.delegation.id}`,
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
      `${EndPoints.Delegations}/${this.delegation.id}:revoke`,
      StatusCodes.NO_CONTENT
    )
    expect(response).toBeDefined()
  }
)

Then(
  'the delegation should be revoked successfully',
  async function ({ identityServiceHelperClient }) {
    const retrievedDelegation =
      await identityServiceHelperClient.get<DelegationResponse>(
        `${EndPoints.Delegations}/${this.delegation.id}`,
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
      `${EndPoints.Delegations}/${this.delegation.id}:expire`,
      StatusCodes.NO_CONTENT
    )
    expect(response).toBeDefined()
  }
)

Then(
  'the delegation should be expired successfully',
  async function ({ identityServiceHelperClient }) {
    const response = await identityServiceHelperClient.get<HttpResponse>(
      `${EndPoints.Delegations}/${this.delegation.id}`,
      StatusCodes.NOT_FOUND
    )
    expect(response).toBeDefined()
    expect(response.title).toEqual('Not Found')
    expect(response.status).toEqual(StatusCodes.NOT_FOUND)
    expect(response.detail).toEqual(
      'County parish holding delegation not found.'
    )
    expect(response.instance).toEqual(`/delegations/${this.delegation.id}`)
    expect(response.traceId).toBeDefined()
  }
)
