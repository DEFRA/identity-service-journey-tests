import { Given } from '../../fixtures/test.fixture'
import { expect } from '@playwright/test'

Given('a valid CPH exists', async function ({ cphs }) {
  expect(cphs).toBeDefined()
  expect(Array.isArray(cphs.items)).toBe(true)
  expect(cphs.items.length).toBeGreaterThan(0)
  this.cph = cphs.items[Math.floor(Math.random() * cphs.items.length)]
})
