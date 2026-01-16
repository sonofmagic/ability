export interface AuthProfile {
  roles: string[]
  permissions: string[]
}

const samples: AuthProfile[] = [
  {
    roles: ['admin'],
    permissions: ['post:read', 'post:edit', 'post:publish', 'user:manage'],
  },
  {
    roles: ['editor'],
    permissions: ['post:read', 'post:edit'],
  },
  {
    roles: ['ops'],
    permissions: ['post:*', 'audit:read'],
  },
  {
    roles: ['viewer'],
    permissions: ['post:read'],
  },
]

let cursor = -1

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

export async function fetchAuthProfile(): Promise<AuthProfile> {
  await delay(500)
  cursor = (cursor + 1) % samples.length
  return samples[cursor]
}
