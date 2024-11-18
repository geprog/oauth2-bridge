import { useProxies } from '~/model/proxy'
import { checkApiToken } from '~/server/utils/auth'
import { getLogger } from '~/server/utils/logger'
import { proxyParamsSchema } from '~/server/utils/paramSchemas'
import { redirectUriSchema } from '~/server/utils/querySchemas'

export default defineEventHandler(async (event) => {
  const logger = getLogger()
  const params = await getValidatedRouterParams(event, proxyParamsSchema.parse)

  await checkApiToken(event, params.proxy, logger)
  logger.info(`Removing redirect uri for proxy with name ${params.proxy}`)
  const proxy = await useProxies().getItem(params.proxy)
  if (!proxy) {
    logger.error(`Proxy with name ${params.proxy} not found`)
    throw Error('Not found')
  }

  const { redirectUri } = await getValidatedQuery(event, redirectUriSchema.parse)

  if (proxy.allowedRedirectUris.includes(redirectUri)) {
    proxy.allowedRedirectUris.splice(proxy.allowedRedirectUris.indexOf(redirectUri), 1)
    await useProxies().setItem(proxy.name, proxy)
  }
  return proxy
})
