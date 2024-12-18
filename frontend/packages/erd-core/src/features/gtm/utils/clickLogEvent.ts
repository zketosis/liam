import { pushToDataLayer } from './pushToDataLayer'

type ClickLogEvent = {
  element: string
}

export const clickLogEvent = ({ element }: ClickLogEvent) => {
  pushToDataLayer({
    event: 'click',
    element,
  })
}
