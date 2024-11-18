import { nanoid } from 'nanoid'
import { useApiTokens } from '~/model/apiToken'
import { useProxies } from '~/model/proxy'
import { getLogger } from '~/server/utils/logger'
import { proxyParamsSchema } from '~/server/utils/paramSchemas'

export default defineEventHandler(async (event) => {
  const logger = getLogger()
  await checkAuthenticated(event, logger)

  const params = await getValidatedRouterParams(event, proxyParamsSchema.parse)
  logger.info(`Generating new api token for proxy with name ${params.proxy}`)
  const proxy = await useProxies().getItem(params.proxy)
  if (!proxy) {
    logger.error(`Proxy with name ${params.proxy} not found`)
    throw Error('Not found')
  }
  const apiToken = nanoid(64)
  useApiTokens().setItem(proxy.name, { proxy: proxy.name, apiToken })

  return apiToken
})
