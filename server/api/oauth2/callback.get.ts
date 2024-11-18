import { stringifyQuery } from 'ufo'
import { useStates } from '~/model/state'
import { getLogger } from '~/server/utils/logger'
import { oauthAuthCallbackSchema } from '~/server/utils/querySchemas'

export default defineEventHandler(async (event) => {
  const logger = getLogger()

  const query = await getValidatedQuery(event, oauthAuthCallbackSchema.parse)
  logger.info('Receiving oauth2 callback with query', query)

  const state = await useStates().getItem(query.state)

  if (!state) {
    logger.error('Received oauth2 callback with unknown state', query)
    throw Error('Invalid request')
  }

  await useStates().removeItem(state.id)

  return sendRedirect(event, `${state.redirectUri}?${stringifyQuery(query)}`)
})
