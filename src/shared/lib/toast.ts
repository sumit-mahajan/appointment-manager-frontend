import { toast as sonnerToast } from 'sonner'

/**
 * Reusable toast utilities for consistent notifications across the app
 * 
 * Usage examples:
 * 
 * Success:
 * toast.success('Title', { description: 'Details here' })
 * 
 * Error:
 * toast.error('Error occurred', { description: error.message })
 * 
 * Info:
 * toast.info('FYI', { description: 'Some information' })
 * 
 * Warning:
 * toast.warning('Warning', { description: 'Be careful' })
 * 
 * Loading (returns ID to dismiss later):
 * const loadingId = toast.loading('Processing...')
 * // Later: toast.dismiss(loadingId)
 * 
 * Promise (auto-handles loading/success/error):
 * toast.promise(apiCall(), {
 *   loading: 'Saving...',
 *   success: 'Saved successfully!',
 *   error: 'Failed to save'
 * })
 */

export const toast = {
  success: (message: string, options?: { description?: string; duration?: number }) => {
    return sonnerToast.success(message, {
      description: options?.description,
      duration: options?.duration ?? 3000,
    })
  },

  error: (message: string, options?: { description?: string; duration?: number }) => {
    return sonnerToast.error(message, {
      description: options?.description,
      duration: options?.duration ?? 4000,
    })
  },

  info: (message: string, options?: { description?: string; duration?: number }) => {
    return sonnerToast.info(message, {
      description: options?.description,
      duration: options?.duration ?? 3000,
    })
  },

  warning: (message: string, options?: { description?: string; duration?: number }) => {
    return sonnerToast.warning(message, {
      description: options?.description,
      duration: options?.duration ?? 3000,
    })
  },

  loading: (message: string, options?: { description?: string }) => {
    return sonnerToast.loading(message, {
      description: options?.description,
    })
  },

  promise: <T,>(
    promise: Promise<T>,
    messages: {
      loading: string
      success: string | ((data: T) => string)
      error: string | ((error: any) => string)
    }
  ) => {
    return sonnerToast.promise(promise, messages)
  },

  dismiss: (toastId?: string | number) => {
    return sonnerToast.dismiss(toastId)
  },
}
