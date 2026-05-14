import { expect, request } from '@playwright/test'
import { createBdd } from 'playwright-bdd'
import { HealthResponse } from '../../types/responses/healthResponse.type'
import { StatusCodes } from 'http-status-codes'
import { EndPoints } from '../../utils/enums'
import { IdentityServiceHelperClient } from '../support/api/identity.service.helper.client'
import { IdentityServiceHandlerClient } from '../support/api/identity.service.handler.client'

const { Given, When, Then } = createBdd()
let client: IdentityServiceHelperClient | IdentityServiceHandlerClient
let response: HealthResponse

Given('the identity service helper is running', async function () {
  const apiContext = await request.newContext({
    baseURL:
      process.env.CDP === undefined && process.env.ENVIRONMENT === 'dev'
        ? process.env.apiURLExt
        : process.env.apiURL
  })
  client = new IdentityServiceHelperClient(
    apiContext,
    'identity-service-helper'
  )
})

Given('the identity service handler is running', async function () {
  const apiContext = await request.newContext({
    baseURL: process.env.uiURL
  })
  client = new IdentityServiceHandlerClient(apiContext)
})

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
