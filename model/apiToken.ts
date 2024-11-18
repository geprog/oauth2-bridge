import { z } from 'zod'

export const ApiToken = z.object({
  proxy: z.string().min(1),
  apiToken: z.string().min(64),
})

export type ApiToken = z.infer<typeof ApiToken>

export function useApiTokens() {
  return useStorage<ApiToken>('api-tokens')
}
