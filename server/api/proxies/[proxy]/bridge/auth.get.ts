import { nanoid } from 'nanoid'
import { stringifyQuery } from 'ufo'
import { useProxies } from '~/model/proxy'
import { useStates } from '~/model/state'
import { getLogger } from '~/server/utils/logger'
import { proxyParamsSchema } from '~/server/utils/paramSchemas'
import { oauthAuthSchema } from '~/server/utils/querySchemas'

export default defineEventHandler(async (event) => {
  const logger = getLogger()

  const params = await getValidatedRouterParams(event, proxyParamsSchema.parse)
  logger.info('Bridge for proxy with name %s', params.proxy)

  const proxy = await useProxies().getItem(params.proxy)
  if (!proxy) {
    logger.error('Proxy with name %s not found', params.proxy)
    throw createError('Invalid request')
  }

  const { redirect_uri: redirectUri } = await getValidatedQuery(event, oauthAuthSchema.parse)
  const query = getQuery(event)
  logger.info('Performing authorization with query', query)

  if (!proxy.allowedRedirectUris.includes(redirectUri)) {
    logger.error('Redirect-URI is not included in the allowed redirect-URIs')
    throw createError('Invalid request')
  }

  const states = useStates()

  const state = { id: nanoid(), proxy: proxy.name, redirectUri }
  states.setItem(state.id, state)

  const requestURL = getRequestURL(event)
  const adjustedQuery = { ...query, redirect_uri: `${requestURL.protocol}//${requestURL.host}/api/oauth2/callback`, state: state.id }

  const oauthProviderUrl = `${proxy.authorizationUri}?${stringifyQuery(adjustedQuery)}`
  logger.info('Redirecting to %s', oauthProviderUrl, state)
  return sendRedirect(event, oauthProviderUrl)
})
