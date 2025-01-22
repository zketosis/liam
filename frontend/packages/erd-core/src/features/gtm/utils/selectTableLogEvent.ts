import { pushToDataLayer } from './pushToDataLayer'

type SelectTable = {
  ref: 'leftPane' | 'mainArea'
  tableId: string
  platform: string
  ver: string
  appEnv: string
}

export const selectTableLogEvent = ({
  ref,
  tableId,
  platform,
  ver,
  appEnv,
}: SelectTable) => {
  pushToDataLayer({
    event: 'selectTable',
    ref,
    tableId,
    platform,
    ver,
    appEnv,
  })
}
