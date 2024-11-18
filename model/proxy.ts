import { z } from 'zod'

export const Proxy = z.object({
  name: z.string().min(1),
  authorizationUri: z.string().url(),
  tokenUri: z.string().url(),
  allowedRedirectUris: z.array(z.string().url()),
})

export type Proxy = z.infer<typeof Proxy>

export function useProxies() {
  return useStorage<Proxy>('proxies')
}
