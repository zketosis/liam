import { pushToDataLayer } from './pushToDataLayer'

type OpenRelatedTablesLogEvent = {
  tableId: string
  platform: string
  ver: string
  appEnv: string
}

export const openRelatedTablesLogEvent = ({
  tableId,
  platform,
  ver,
  appEnv,
}: OpenRelatedTablesLogEvent) => {
  pushToDataLayer({
    event: 'openRelatedTables',
    tableId,
    platform,
    ver,
    appEnv,
  })
}
