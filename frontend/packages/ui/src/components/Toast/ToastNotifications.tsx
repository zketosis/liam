'use client'

import { useEffect, useRef } from 'react'
import type { ToastStatus } from './types'
import { useToast } from './useToast'

export interface ToastNotificationsProps {
  /**
   * Error message to display in a toast
   */
  error?: string
  /**
   * Success message or flag to display a success toast
   */
  success?: string | boolean
  /**
   * Custom title for the success toast
   * @default "Success"
   */
  successTitle?: string
  /**
   * Custom description for the success toast when success is true or "true"
   * @default "Operation completed successfully"
   */
  successDescription?: string
  /**
   * Custom title for the error toast
   * @default "Error"
   */
  errorTitle?: string
  /**
   * Status for the success toast
   * @default "success"
   */
  successStatus?: ToastStatus
  /**
   * Status for the error toast
   * @default "error"
   */
  errorStatus?: ToastStatus
  /**
   * Whether to clear URL parameters after showing the toast
   * @default true
   */
  clearUrlParams?: boolean
  /**
   * Delay in milliseconds before clearing URL parameters
   * @default 3000
   */
  clearParamsDelay?: number
}

/**
 * A component that displays toast notifications based on URL parameters or props
 * Typically used with server actions that redirect with query parameters
 */
export function ToastNotifications({
  error,
  success,
  successTitle = 'Success',
  successDescription = 'Operation completed successfully',
  errorTitle = 'Error',
  successStatus = 'success',
  errorStatus = 'error',
  clearUrlParams = true,
  clearParamsDelay = 3000,
}: ToastNotificationsProps) {
  const toast = useToast()
  // Track if we've already shown toasts for the current values
  const shownToastsRef = useRef<{
    error?: string | undefined
    success?: string | boolean | undefined
  }>({})

  useEffect(() => {
    // Only show toast if we haven't shown it for this specific value yet
    if (error && shownToastsRef.current.error !== error) {
      shownToastsRef.current.error = error
      toast({
        title: errorTitle,
        description: error,
        status: errorStatus,
      })
    } else if (success && shownToastsRef.current.success !== success) {
      shownToastsRef.current.success = success
      // Handle different success values
      let description = successDescription

      // If success is a string and not "true", use it as the description
      if (typeof success === 'string' && success !== 'true') {
        description = success
      }

      toast({
        title: successTitle,
        description,
        status: successStatus,
      })
    }

    // Setup timer for clearing URL parameters
    let timeoutId: ReturnType<typeof setTimeout> | undefined

    // Clear URL parameters after showing toast
    if (clearUrlParams && (error || success) && typeof window !== 'undefined') {
      timeoutId = setTimeout(() => {
        // Replace current URL with pathname only (no query parameters)
        window.history.replaceState({}, '', window.location.pathname)
      }, clearParamsDelay)
    }

    // Always return a cleanup function
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
    }
  }, [
    error,
    success,
    successTitle,
    successDescription,
    errorTitle,
    successStatus,
    errorStatus,
    toast,
    clearUrlParams,
    clearParamsDelay,
  ])

  return null
}
