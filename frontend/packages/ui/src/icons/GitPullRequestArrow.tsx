import { GitPullRequestArrow as PrimitiveGitPullRequestArrow } from 'lucide-react'
import type { ComponentPropsWithoutRef, FC } from 'react'

type Props = ComponentPropsWithoutRef<typeof PrimitiveGitPullRequestArrow>

export const GitPullRequestArrow: FC<Props> = (props) => (
  <PrimitiveGitPullRequestArrow strokeWidth={1.5} {...props} />
)
