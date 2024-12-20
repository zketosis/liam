import { pushToDataLayer } from './pushToDataLayer'

type SelectTable = {
  ref: 'leftPane' | 'mainArea'
  tableId: string
}

export const selectTableLogEvent = ({ ref, tableId }: SelectTable) => {
  pushToDataLayer({
    event: 'selectTable',
    ref,
    tableId,
  })
}
