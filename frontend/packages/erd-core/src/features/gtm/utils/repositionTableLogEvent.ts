import { pushToDataLayer } from './pushToDataLayer'

type RepositionTable = {
  tableId: string
}

export const repositionTableLogEvent = ({ tableId }: RepositionTable) => {
  pushToDataLayer({
    event: 'repositionTable',
    tableId,
  })
}
