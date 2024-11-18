import type { H3Event } from 'h3'
import type { Logger } from './logger'
import { useApiTokens } from '~/model/apiToken'

export type AuthSession = {
  token?: string
}

export async function useAuthSession(event: H3Event) {
  const session = await useSession<AuthSession>(event, useRuntimeConfig().auth)
  return session
}

export async function checkAuthenticated(event: H3Event, logger: Logger = getLogger()) {
  const session = await useAuthSession(event)
  if (!session.data?.token) {
    logger.error('Unauthorized API access on', getRequestURL(event).pathname)
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized',
    })
  }
}

export async function checkApiToken(event: H3Event, proxy: string, logger: Logger = getLogger()) {
  const proxyApiToken = await useApiTokens().getItem(proxy)
  if (!proxyApiToken) {
    logger.error('No api token found for proxy', proxy)
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized',
    })
  }
  const apiToken = getHeader(event, 'Api-Token')
  if (proxyApiToken.apiToken !== apiToken) {
    logger.error('Invalid api token provided for proxy', proxy)
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized',
    })
  }
}
