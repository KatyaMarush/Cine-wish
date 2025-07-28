import { useState, useCallback } from 'react'
import { handleApiError, getErrorMessage, type AppError } from '@utils/errorHandling'

interface UseErrorHandlerReturn {
  error: AppError | null
  setError: (error: AppError | null) => void
  handleError: (error: unknown, context: string) => void
  clearError: () => void
  hasError: boolean
}

export const useErrorHandler = (): UseErrorHandlerReturn => {
  const [error, setError] = useState<AppError | null>(null)

  const handleError = useCallback((error: unknown, context: string) => {
    const appError = handleApiError(error, context)
    setError(appError)
  }, [])

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  return {
    error,
    setError,
    handleError,
    clearError,
    hasError: error !== null,
  }
}

export const useAsyncErrorHandler = () => {
  const { error, handleError, clearError, hasError } = useErrorHandler()

  const executeWithErrorHandling = useCallback(
    async <T>(asyncFn: () => Promise<T>, context: string): Promise<T | null> => {
      try {
        clearError()
        return await asyncFn()
      } catch (err) {
        handleError(err, context)
        return null
      }
    },
    [handleError, clearError],
  )

  return {
    error,
    executeWithErrorHandling,
    clearError,
    hasError,
    errorMessage: error ? getErrorMessage(error) : null,
  }
} 