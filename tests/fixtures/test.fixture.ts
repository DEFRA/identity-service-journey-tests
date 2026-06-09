import { request } from '@playwright/test'
import { test as base, createBdd } from 'playwright-bdd'
import { IdentityServiceHelperClient } from '../features/support/api/identity.service.helper.client'
import { IdentityServiceHandlerClient } from '../features/support/api/identity.service.handler.client'
import { UserRolesResponse } from '../types/responses/userRolesResponse.type'
import { EndPoints } from '../utils/enums'
import { StatusCodes } from 'http-status-codes'
import { CPHResponse } from '../types/responses/cphResponse.type'

export const test = base.extend<{
  identityServiceHelperClient: IdentityServiceHelperClient
  identityServiceHandlerClient: IdentityServiceHandlerClient
  userRoles: UserRolesResponse[]
  cphs: CPHResponse
  delegatingUserIds: string[]
}>({
  // eslint-disable-next-line no-empty-pattern
  identityServiceHelperClient: async ({}, use) => {
    const apiContext = await request.newContext({
      baseURL:
        process.env.CDP === undefined && process.env.ENVIRONMENT === 'dev'
          ? process.env.apiURLExt
          : process.env.apiURL
    })
    const identityServiceHelperClient = new IdentityServiceHelperClient(
      apiContext,
      'identity-service-helper'
    )
    await use(identityServiceHelperClient)
  },
  userRoles: async ({ identityServiceHelperClient }, use) => {
    const userRoles = await identityServiceHelperClient.get<
      UserRolesResponse[]
    >(EndPoints.UserRoles, StatusCodes.OK)
    await use(userRoles)
  },
  cphs: async ({ identityServiceHelperClient }, use) => {
    const cphs = await identityServiceHelperClient.get<CPHResponse>(
      EndPoints.Cphs,
      StatusCodes.OK
    )
    await use(cphs)
  },
  // eslint-disable-next-line no-empty-pattern
  identityServiceHandlerClient: async ({}, use) => {
    const apiContext = await request.newContext({
      baseURL: process.env.uiURL
    })
    const identityServiceHandlerClient = new IdentityServiceHandlerClient(
      apiContext
    )
    await use(identityServiceHandlerClient)
  },
  // eslint-disable-next-line no-empty-pattern
  delegatingUserIds: async ({}, use) => {
    const delegatingUserIds = [
      process.env.DELEGATING_USER_WITH_MULTIPLE_CPHS,
      process.env.DELEGATING_USER_WITH_SINGLE_CPH
    ].filter((v): v is string => !!v)
    await use(delegatingUserIds)
  }
})

export const { Given, When, Then } = createBdd(test)
