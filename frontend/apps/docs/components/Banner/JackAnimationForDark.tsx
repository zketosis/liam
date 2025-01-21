'use client'

import { Fit, Layout, useRive } from '@rive-app/react-canvas'
import type { FC } from 'react'

const RiveComponent = () => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3002'
  const { RiveComponent } = useRive({
    src: `${baseUrl}/rivs/jack_animation_for_dark.riv`,
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
