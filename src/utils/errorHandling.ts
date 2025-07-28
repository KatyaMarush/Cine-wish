// Centralized error handling utilities

export interface AppError {
  message: string
  code?: string
  status?: number
  endpoint?: string
  retryable?: boolean
  timestamp?: number
}

export class ApiError extends Error {
  public status?: number
  public endpoint?: string
  public retryable: boolean

  constructor(message: string, status?: number, endpoint?: string, retryable = true) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.endpoint = endpoint
    this.retryable = retryable
  }
}

export class NetworkError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'NetworkError'
  }
}

export class ValidationError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'ValidationError'
  }
}

export const createError = (
  message: string,
  code?: string,
  status?: number,
  endpoint?: string,
  retryable = true,
): AppError => ({
  message,
  code,
  status,
  endpoint,
  retryable,
  timestamp: Date.now(),
})

export const handleApiError = (error: unknown, context: string): AppError => {
  if (error instanceof ApiError) {
    console.error(`API Error in ${context}:`, {
      message: error.message,
      status: error.status,
      endpoint: error.endpoint,
      retryable: error.retryable,
    })
    return {
      message: error.message,
      status: error.status,
      endpoint: error.endpoint,
      retryable: error.retryable,
      timestamp: Date.now(),
    }
  }

  if (error instanceof NetworkError) {
    console.error(`Network Error in ${context}:`, error.message)
    return {
      message: 'Network connection failed. Please check your internet connection.',
      code: 'NETWORK_ERROR',
      retryable: true,
      timestamp: Date.now(),
    }
  }

  if (error instanceof ValidationError) {
    console.error(`Validation Error in ${context}:`, error.message)
    return {
      message: error.message,
      code: 'VALIDATION_ERROR',
      retryable: false,
      timestamp: Date.now(),
    }
  }

  if (error instanceof Error) {
    console.error(`Error in ${context}:`, error.message)
    return {
      message: error.message,
      retryable: true,
      timestamp: Date.now(),
    }
  }

  console.error(`Unknown error in ${context}:`, error)
  return {
    message: 'An unexpected error occurred',
    code: 'UNKNOWN_ERROR',
    retryable: true,
    timestamp: Date.now(),
  }
}

export const validateApiKey = (apiKey: string | undefined): void => {
  if (!apiKey) {
    throw new ValidationError(
      'TMDB API key is required. Please set VITE_TMDB_API_KEY in your environment variables.',
    )
  }

  if (apiKey.length < 10) {
    throw new ValidationError(
      'TMDB API key appears to be invalid. Please check your API key configuration.',
    )
  }
}

export const isRetryableError = (error: AppError): boolean => {
  // Don't retry validation errors or 4xx client errors (except 429)
  if (error.code === 'VALIDATION_ERROR') return false
  if (error.status && error.status >= 400 && error.status < 500 && error.status !== 429) return false
  return error.retryable !== false
}

export const getErrorMessage = (error: AppError): string => {
  switch (error.code) {
    case 'NETWORK_ERROR':
      return 'Network connection failed. Please check your internet connection and try again.'
    case 'VALIDATION_ERROR':
      return error.message
    case 'API_KEY_ERROR':
      return 'API configuration error. Please check your API key settings.'
    case 'RATE_LIMIT_ERROR':
      return 'Too many requests. Please wait a moment and try again.'
    default:
      return error.message || 'An unexpected error occurred. Please try again.'
  }
}
