import { Proxy, useProxies } from '~/model/proxy'

export default defineEventHandler(async (event) => {
  const logger = getLogger()
  await checkAuthenticated(event, logger)

  const proxy = await readValidatedBody(event, Proxy.parse)
  logger.info(`Creating new proxy with name ${proxy.name}`)

  if (await useProxies().hasItem(proxy.name)) {
    logger.error(`Duplicated proxy name ${proxy.name}`)
    throw createError('Proxy with that name already exists')
  }

  await useProxies().setItem(proxy.name, proxy)
  return proxy
})
