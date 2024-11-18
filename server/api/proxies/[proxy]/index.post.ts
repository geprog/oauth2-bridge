import { Proxy, useProxies } from '~/model/proxy'
import { proxyParamsSchema } from '~/server/utils/paramSchemas'

export default defineEventHandler(async (event) => {
  const logger = getLogger()
  await checkAuthenticated(event, logger)

  const params = await getValidatedRouterParams(event, proxyParamsSchema.parse)
  logger.info(`Updating proxy with name ${params.proxy}`)
  const proxy = await readValidatedBody(event, Proxy.parse)

  if (!(await useProxies().hasItem(params.proxy))) {
    logger.error(`Proxy with name ${params.proxy} not found`)
    throw createError('Not found')
  }

  if (params.proxy !== proxy.name) {
    if (await useProxies().hasItem(proxy.name)) {
      logger.error(`Duplicated proxy name ${params.proxy}`)
      throw createError('Proxy with that name already exists')
    }
    await useProxies().removeItem(params.proxy)
  }

  await useProxies().setItem(proxy.name, proxy)
  return proxy
})
