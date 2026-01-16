export interface AuthProfile {
  roles: string[]
  permissions: string[]
}

const samples: AuthProfile[] = [
  {
    roles: ['admin'],
    permissions: ['system:dept:add', 'system:post:edit', 'system:post:publish', 'system:user:remove'],
  },
  {
    roles: ['editor'],
    permissions: ['system:dept:add', 'system:post:edit'],
  },
  {
    roles: ['ops'],
    permissions: ['system:post:*', 'system:audit:read'],
  },
  {
    roles: ['viewer'],
    permissions: ['system:dept:add'],
  },
]

let cursor = -1

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

export async function fetchAuthProfile(): Promise<AuthProfile> {
  await delay(500)
  cursor = (cursor + 1) % samples.length
  return samples[cursor]
}
