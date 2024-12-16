import { useContext } from 'react'
import { ToastContext } from './Toast'

export const useToast = () => useContext(ToastContext)
