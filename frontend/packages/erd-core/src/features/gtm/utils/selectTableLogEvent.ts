import { pushToDataLayer } from './pushToDataLayer'

type selectTable = {
  ref: 'leftPane' | 'mainArea'
  tableId: string
}

export const selectTableLogEvent = ({ ref, tableId }: selectTable) => {
  pushToDataLayer({
    event: 'selectTable',
    ref,
    tableId,
  })
}
