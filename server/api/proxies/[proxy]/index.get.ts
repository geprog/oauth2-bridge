import { useProxies } from '~/model/proxy'
import { getLogger } from '~/server/utils/logger'
import { proxyParamsSchema } from '~/server/utils/paramSchemas'

export default defineEventHandler(async (event) => {
  const logger = getLogger()
  await checkAuthenticated(event, logger)

  const params = await getValidatedRouterParams(event, proxyParamsSchema.parse)
  logger.info(`Looking for proxy with name ${params.proxy}`)
  const proxy = await useProxies().getItem(params.proxy)
  if (!proxy) {
    logger.error(`Proxy with name ${params.proxy} not found`)
    throw Error('Not found')
  }
  return { ...proxy, apiToken: '' }
})
