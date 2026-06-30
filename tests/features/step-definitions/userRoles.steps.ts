import { Given, Then } from '../../fixtures/test.fixture'
import { expect } from '@playwright/test'

Given('I request all user roles', async function ({ userRoles }) {
  expect(Array.isArray(userRoles)).toBe(true)
})

Then('I should receive a list of user roles', async function ({ userRoles }) {
  userRoles.forEach((role) => {
    expect(role).toHaveProperty('id')
    expect(role.id).not.toBeNull()
    expect(role).toHaveProperty('name')
    expect(role.name).not.toBeNull()
    expect(role).toHaveProperty('description')
    expect(role.description).not.toBeNull()
  })
})
