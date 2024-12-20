import { pushToDataLayer } from './pushToDataLayer'

type OpenRelatedTablesLogEvent = {
  tableId: string
  cliVer: string
}

export const openRelatedTablesLogEvent = ({
  tableId,
  cliVer,
}: OpenRelatedTablesLogEvent) => {
  pushToDataLayer({
    event: 'openRelatedTables',
    tableId,
    cliVer,
  })
}
