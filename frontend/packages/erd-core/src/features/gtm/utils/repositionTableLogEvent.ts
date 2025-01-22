import { pushToDataLayer } from './pushToDataLayer'

type RepositionTable = {
  tableId: string
  operationId: string
  platform: string
  ver: string
  appEnv: string
}

export const repositionTableLogEvent = ({
  tableId,
  operationId,
  platform,
  ver,
  appEnv,
}: RepositionTable) => {
  pushToDataLayer({
    event: 'repositionTable',
    tableId,
    operationId,
    platform,
    ver,
    appEnv,
  })
}
