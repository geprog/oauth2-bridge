import { z } from 'zod'

export const StateId = z.string().min(21)

export const State = z.object({
  id: StateId,
  proxy: z.string().min(1),
  redirectUri: z.string().url(),
})

export type State = z.infer<typeof State>

export function useStates() {
  return useStorage<State>('states')
}
