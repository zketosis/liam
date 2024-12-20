import { pushToDataLayer } from './pushToDataLayer'

type RepositionTable = {
  tableId: string
  operationId: string
}

export const repositionTableLogEvent = ({
  tableId,
  operationId,
}: RepositionTable) => {
  pushToDataLayer({
    event: 'repositionTable',
    tableId,
    operationId,
  })
}
