import { useProxies } from '~/model/proxy'
import { getLogger } from '~/server/utils/logger'
import { proxyParamsSchema } from '~/server/utils/paramSchemas'

export default defineEventHandler(async (event) => {
  const logger = getLogger()
  const params = await getValidatedRouterParams(event, proxyParamsSchema.parse)
  logger.info('Bridge for proxy with name %s', params.proxy)

  const proxy = await useProxies().getItem(params.proxy)
  if (!proxy) {
    logger.error('Proxy with name %s not found', params.proxy)
    throw Error('Invalid request')
  }

  const body = await readBody(event)
  logger.info('Performing token request with body', body)

  const requestURL = getRequestURL(event)
  const adjustedBody = { ...body, redirect_uri: `${requestURL.protocol}//${requestURL.host}/api/oauth2/callback` }

  const oauthProviderUrl = `${proxy.tokenUri}`
  logger.info('Requesting token from %s', oauthProviderUrl)
  const tokenResponse = await $fetch(oauthProviderUrl, { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: new URLSearchParams(adjustedBody).toString() })
  logger.info('Received token')
  return tokenResponse
})
