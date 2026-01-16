export interface AuthProfile {
  roles: string[]
  permissions: string[]
}

const samples: AuthProfile[] = [
  {
    roles: ['maintainer'],
    permissions: ['system:read', 'system:deploy', 'report:read'],
  },
  {
    roles: ['support'],
    permissions: ['report:read', 'user:read'],
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
  return samples[cursor]
}
