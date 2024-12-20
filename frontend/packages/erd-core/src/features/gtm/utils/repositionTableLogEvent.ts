import { pushToDataLayer } from './pushToDataLayer'

type RepositionTable = {
  tableId: string
  operationId: string
  cliVer: string
}

export const repositionTableLogEvent = ({
  tableId,
  operationId,
  cliVer,
}: RepositionTable) => {
  pushToDataLayer({
    event: 'repositionTable',
    tableId,
    operationId,
    cliVer,
  })
}
