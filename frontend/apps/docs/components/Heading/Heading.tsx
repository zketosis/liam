// biome-ignore lint/nursery/noRestrictedImports: Make original Heading component
import { Heading as FumadocsHeading } from 'fumadocs-ui/components/heading'
import type { ComponentProps, FC } from 'react'
import { tv } from 'tailwind-variants'

type Props = ComponentProps<typeof FumadocsHeading>

export const Heading: FC<Props> = ({ as, ...props }) => {
  const wrapper = tv({
    variants: {
      as: {
        h1: 'text-3xl',
        h2: 'text-2xl',
        h3: 'text-xl',
        h4: 'text-base',
        h5: 'text-sm',
        h6: 'text-xs',
      },
    },
  })

  return <FumadocsHeading {...props} as={as} className={wrapper({ as })} />
}
