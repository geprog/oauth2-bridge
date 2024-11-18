import { z } from 'zod'
import { StateId } from '~/model/state'

export const oauthAuthSchema = z.object({ redirect_uri: z.string().url().transform(decodeURIComponent) })

export const oauthAuthCallbackSchema = z.object({ code: z.string().min(1), state: StateId, session_state: z.string().min(1) })

export const redirectUriSchema = z.object({ redirectUri: z.string().url().transform(decodeURIComponent) })
