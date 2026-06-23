import type { TestEnv } from '../../../../../configs/env'

type LoginSelectors = {
  emailAddressInput: string
  signInButton: string
}

const loginSelectorsByEnv: Record<TestEnv, LoginSelectors> = {
  docker: {
    emailAddressInput: '#email',
    signInButton: 'button:has-text("Sign in")'
  },
  local: {
    emailAddressInput: '#email',
    signInButton: 'button:has-text("Sign in")'
  },
  dev: {
    emailAddressInput: '#email',
    signInButton: 'button:has-text("Sign in")'
  },
  test: {
    emailAddressInput: '#email',
    signInButton: 'button:has-text("Sign in")'
  }
}

export function getLoginSelectors(env: TestEnv): LoginSelectors {
  return loginSelectorsByEnv[env]
}
