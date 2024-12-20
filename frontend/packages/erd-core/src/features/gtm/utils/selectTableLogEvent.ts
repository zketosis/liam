import { pushToDataLayer } from './pushToDataLayer'

type SelectTable = {
  ref: 'leftPane' | 'mainArea'
  tableId: string
  cliVer: string
}

export const selectTableLogEvent = ({ ref, tableId, cliVer }: SelectTable) => {
  pushToDataLayer({
    event: 'selectTable',
    ref,
    tableId,
    cliVer,
  })
}
