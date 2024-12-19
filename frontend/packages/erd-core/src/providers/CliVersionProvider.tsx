import type { CliVersion } from '@/schemas/cliVersion'
import { type FC, type ReactNode, createContext, useContext } from 'react'

interface CliVersionContextProps {
  cliVersion: CliVersion
}

const CliVersionContext = createContext<CliVersionContextProps | undefined>(
  undefined,
)

export const useCliVersion = (): CliVersionContextProps => {
  const context = useContext(CliVersionContext)
  if (!context) {
    throw new Error('useCliVersion must be used within a CliVersionProvider')
  }
  return context
}

export const CliVersionProvider: FC<{
  cliVersion: CliVersion
  children: ReactNode
}> = ({ cliVersion, children }) => {
  return (
    <CliVersionContext.Provider value={{ cliVersion }}>
      {children}
    </CliVersionContext.Provider>
  )
}
