export interface AuthProfile {
  roles: string[]
  permissions: string[]
}

const samples: AuthProfile[] = [
  {
    roles: ['maintainer'],
    permissions: ['system:config:export', 'system:dept:add', 'system:report:read'],
  },
  {
    roles: ['support'],
    permissions: ['system:report:read', 'system:user:read'],
  },
  {
    roles: ['auditor'],
    permissions: ['*:read'],
  },
  {
    roles: ['guest'],
    permissions: [],
  },
]

let cursor = -1

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

export async function fetchAuthProfile(): Promise<AuthProfile> {
  await delay(650)
  cursor = (cursor + 1) % samples.length
  const profile = samples[cursor]

  if (!profile) {
    throw new Error('No auth profiles configured.')
  }

  return profile
}
