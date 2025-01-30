import type { QueryParam } from '@/schemas/queryParam'
import { type ShowMode, showModeSchema } from '@/schemas/showMode'
import { decompressFromEncodedURIComponent } from '@/utils'
import * as v from 'valibot'

const getQueryParam = (param: QueryParam): string | undefined => {
  const urlParams = new URLSearchParams(window.location.search)
  const value = urlParams.get(param)
  return value || undefined
}

export const getActiveTableNameFromUrl = (): string | undefined => {
  return getQueryParam('active')
}

export const getHiddenNodeIdsFromUrl = async (): Promise<string[]> => {
  const compressed = getQueryParam('hidden')
  const decompressed = compressed
    ? await decompressFromEncodedURIComponent(compressed).catch(() => undefined)
    : undefined

  return decompressed ? decompressed.split(',') : []
}

export const getShowModeFromUrl = (): ShowMode => {
  const showMode = getQueryParam('showMode')
  const result = v.safeParse(showModeSchema, showMode)
  if (result.success && result.output) {
    return result.output
  }

  return 'TABLE_NAME'
}
