import { request, Page } from '@playwright/test'
import { test as base, createBdd } from 'playwright-bdd'
import { IdentityServiceHelperClient } from '../features/support/api/identity.service.helper.client'
import { IdentityServiceHandlerClient } from '../features/support/api/identity.service.handler.client'
import { UserRolesResponse } from '../types/responses/userRolesResponse.type'
import { EndPoints } from '../utils/enums'
import { StatusCodes } from 'http-status-codes'
import { CPHResponse } from '../types/responses/cphResponse.type'
import { HomePage } from '../features/support/page-objects/home.page'
import { InvitationsPage } from '../features/support/page-objects/invitations.page'
import { DelegationPage } from '../features/support/page-objects/delegation.page'

export const test = base.extend<{
  identityServiceHelperClient: IdentityServiceHelperClient
  identityServiceHandlerClient: IdentityServiceHandlerClient
  userRoles: UserRolesResponse[]
  cphs: CPHResponse
  delegatingUserIds: string[]
  delegatorPage: Page
  delegatePage: Page
  homePage: HomePage
  invitationsPage: InvitationsPage
  delegationPage: DelegationPage
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
      `${EndPoints.Cphs}?pageNumber=1&pageSize=20`,
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
  },
  delegatorPage: async ({ browser }, use) => {
    const context = await browser.newContext({})
    await use(await context.newPage())
    await context.close()
  },
  delegatePage: async ({ browser }, use) => {
    const context = await browser.newContext({})
    await use(await context.newPage())
    await context.close()
  },
  homePage: async ({ page }, use) => {
    const homePage = new HomePage(page)
    await use(homePage)
  },
  delegationPage: async ({ delegatorPage }, use) => {
    const delegationPage = new DelegationPage(delegatorPage)
    await use(delegationPage)
  },
  invitationsPage: async ({ delegatePage }, use) => {
    const invitationsPage = new InvitationsPage(delegatePage)
    await use(invitationsPage)
  }
})

const { AfterScenario } = createBdd(test)

AfterScenario(async ({ page, delegatorPage, delegatePage }) => {
  await page.close()
  await delegatorPage.close()
  await delegatePage.close()
})

export const { Given, When, Then } = createBdd(test)
