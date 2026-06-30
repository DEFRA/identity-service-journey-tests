import { expect } from '@playwright/test'
import { HealthResponse } from '../../types/responses/healthResponse.type'
import { StatusCodes } from 'http-status-codes'
import { EndPoints } from '../../utils/enums'
import { Given, When, Then } from '../../fixtures/test.fixture'
import { IdentityServiceHelperClient } from '../support/api/identity.service.helper.client'
import { IdentityServiceHandlerClient } from '../support/api/identity.service.handler.client'

let client: IdentityServiceHelperClient | IdentityServiceHandlerClient
let response: HealthResponse

Given(
  'the identity service helper is running',
  async function ({ identityServiceHelperClient }) {
    client = identityServiceHelperClient
  }
)

Given(
  'the identity service handler is running',
  async function ({ identityServiceHandlerClient }) {
    client = identityServiceHandlerClient
  }
)

When('I check the health endpoint', async function () {
  response = await client.get<HealthResponse>(EndPoints.Health, StatusCodes.OK)
})

Then('I should receive a healthy response', async function () {
  if (client instanceof IdentityServiceHelperClient) {
    expect(response).toHaveProperty('status', 'ok')
  } else if (client instanceof IdentityServiceHandlerClient) {
    expect(response).toHaveProperty('message', 'success')
  } else {
    throw new Error('Unknown client type')
  }
})
