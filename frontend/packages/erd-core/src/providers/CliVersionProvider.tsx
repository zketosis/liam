import type { Version } from '@/schemas/version'
import { type FC, type ReactNode, createContext, useContext } from 'react'

interface CliVersionContextProps {
  version: Version
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
  version: Version
  children: ReactNode
}> = ({ version, children }) => {
  return (
    <CliVersionContext.Provider value={{ version }}>
      {children}
    </CliVersionContext.Provider>
  )
}
