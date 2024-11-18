import { z } from 'zod'

export const proxyParamsSchema = z.object({ proxy: z.string().trim().transform(decodeURIComponent) })
