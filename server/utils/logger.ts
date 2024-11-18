import { nanoid } from 'nanoid'

export function getLogger() {
  const traceId = nanoid()
  const logPrefix = `[${traceId}]`
  return {
    info(...args: unknown[]) { console.info(logPrefix, ...args) },
    error(...args: unknown[]) { console.error(logPrefix, ...args) },
  }
}

export type Logger = ReturnType<typeof getLogger>
