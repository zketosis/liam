import type { FC } from 'react'

const Page: FC = () => {
  if (process.env.NEXT_PUBLIC_ENV_NAME === 'production')
    throw new Error('Galaxy page not available in production')

  return (
    <div>
      <p>Galaxy page</p>
    </div>
  )
}

export default Page
