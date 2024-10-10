/* eslint-disable no-restricted-imports */
import {
  Content,
  Portal,
  Provider,
  Root,
  Trigger,
} from '@radix-ui/react-tooltip'
import {
  type ComponentProps,
  type FC,
  type PropsWithChildren,
  forwardRef,
} from 'react'
import styles from './Tooltip.module.css'

export const TooltipContent = forwardRef<
  HTMLDivElement,
  ComponentProps<typeof Content>
>((props, ref) => {
  return <Content {...props} ref={ref} className={styles.content} />
})

TooltipContent.displayName = 'TooltipContent'

export const TooltipProvider: FC<PropsWithChildren> = ({ children }) => {
  return <Provider delayDuration={100}>{children}</Provider>
}
export const TooltipPortal = Portal
export const TooltipRoot = Root
export const TooltipTrigger = Trigger
