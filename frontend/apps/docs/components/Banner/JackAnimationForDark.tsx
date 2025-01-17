'use client'

import { Fit, Layout, useRive } from '@rive-app/react-canvas'
import type { FC } from 'react'

const RiveComponent = () => {
  const { RiveComponent } = useRive({
    src: '/rivs/jack_animation_for_dark.riv',
    stateMachines: 'State Machine 1',
    layout: new Layout({
      fit: Fit.Cover,
    }),
    autoplay: true,
  })

  return <RiveComponent />
}

export const JackAnimationForDark: FC = () => {
  return (
    <div className="w-[1.875rem] h-[1.875rem]">
      <RiveComponent />
    </div>
  )
}
