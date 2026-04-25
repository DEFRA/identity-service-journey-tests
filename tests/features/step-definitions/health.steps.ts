import { test, expect, request } from '@playwright/test'
import { createBdd } from 'playwright-bdd'
import { HealthResponse } from '../../types/responses/healthResponse.type'
import { StatusCodes } from 'http-status-codes'
import { EndPoints } from '../../utils/enums'
import { IdentityServiceHelperClient } from '../support/api/identity.service.helper.client'

const { Given, When, Then } = createBdd()
let identityServiceHelperClient: IdentityServiceHelperClient
let response: HealthResponse

Given('the identity service helper is running', async function () {
  const apiContext = await request.newContext({
    baseURL:
      process.env.CDP === undefined && process.env.ENVIRONMENT === 'dev'
        ? process.env.apiURLExt
        : process.env.apiURL
  })
  identityServiceHelperClient = new IdentityServiceHelperClient(apiContext)
})

When('I check the health endpoint', async function () {
  response = await identityServiceHelperClient.get<HealthResponse>(
    EndPoints.Health,
    StatusCodes.OK
  )
})

Then('I should receive a healthy response', async function () {
  expect(response).toHaveProperty('status', 'ok')
})
