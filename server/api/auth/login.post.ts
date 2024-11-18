import { nanoid } from 'nanoid'
import z from 'zod'

export default defineEventHandler(async (event) => {
  const { auth } = useRuntimeConfig()

  const { password } = await readValidatedBody(event, z.object({ password: z.string() }).parse)

  if (password !== auth.password) {
    throw createError('Invalid credentials')
  }

  const session = await useAuthSession(event)
  await session.update({
    token: nanoid(64),
  })

  return {
    ok: true,
  }
})
