import { useProxies } from '~/model/proxy'

export default defineEventHandler(async (event) => {
  const logger = getLogger()
  await checkAuthenticated(event, logger)

  logger.info('Loading existing proxies')
  const proxyNames = await useProxies().getKeys()
  return proxyNames.map(name => ({ name }))
})
