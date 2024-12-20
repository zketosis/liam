import { pushToDataLayer } from './pushToDataLayer'

type ClickLogEvent = {
  element: string
  cliVer: string
}

export const clickLogEvent = ({ element, cliVer }: ClickLogEvent) => {
  pushToDataLayer({
    event: 'click',
    element,
    cliVer,
  })
}
