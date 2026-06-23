import { Given } from '../../fixtures/test.fixture'
import { EndPoints } from '../../utils/enums'
import { StatusCodes } from 'http-status-codes/build/cjs/status-codes'
import { UserResponse } from '../../types/responses/userResponse.type'
import { LoginPage } from '../support/page-objects/login.page'

Given(
  'an active delegating user exists',
  async function ({ identityServiceHelperClient, delegatingUserIds }) {
    if (!delegatingUserIds || delegatingUserIds.length === 0) {
      throw new Error(
        'No delegating user with CPH assignments configured. Please set DELEGATING_USER_WITH_MULTIPLE_CPHS and/or DELEGATING_USER_WITH_SINGLE_CPH in the environment variables.'
      )
    }
    const validDelegatingUserId =
      delegatingUserIds[Math.floor(Math.random() * delegatingUserIds.length)]
    this.delegatingUser = await identityServiceHelperClient.get<UserResponse>(
      `${EndPoints.Users}/${validDelegatingUserId}`,
      StatusCodes.OK
    )
  }
)

Given(
  'an active delegated user exists',
  async function ({ identityServiceHelperClient }) {
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
  }
)

Given(
  /^I am signed in as a delegator with(?: a )?(.*) CPH(?:'s)?$/,
  async function (
    { identityServiceHelperClient, delegatorPage },
    cphs_held: string
  ) {
    cphs_held = cphs_held.trim()
    const userId =
      process.env[`DELEGATING_USER_WITH_${cphs_held.toUpperCase()}_CPH`]
    if (!userId) {
      throw new Error(
        `Delegating user DELEGATING_USER_WITH_${cphs_held.toUpperCase()}_CPH not found in environment variables`
      )
    }
    this.delegatingUser = await identityServiceHelperClient.get<UserResponse>(
      `${EndPoints.Users}/${userId}`,
      StatusCodes.OK
    )
    this.delegatingUserCphsHeld = cphs_held
    const loginPage = new LoginPage(delegatorPage)
    await loginPage.authenticate(
      this.delegatingUser.email,
      EndPoints.Delegations
    )
  }
)

Given(
  'the delegate is signed in as an active user',
  async function ({ delegatePage }) {
    const loginPage = new LoginPage(delegatePage)
    await loginPage.authenticate(
      this.delegatedUser.email,
      EndPoints.Invitations
    )
  }
)
