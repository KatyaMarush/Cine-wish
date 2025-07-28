const API_KEY = import.meta.env.VITE_TMDB_API_KEY
const BASE_URL = 'https://api.themoviedb.org/3'
import { ApiError, NetworkError, ValidationError, validateApiKey } from '@utils/errorHandling'

// Retry configuration
const MAX_RETRIES = 3
const RETRY_DELAY = 1000 // 1 second

// Helper function to delay execution
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

// Helper function to handle API responses
async function handleApiResponse<T>(response: Response, endpoint: string): Promise<T> {
  if (!response.ok) {
    const errorMessage = `API request failed for ${endpoint}: ${response.status} ${response.statusText}`
    
    // Determine if error is retryable
    const retryable = response.status >= 500 || response.status === 429
    
    throw new ApiError(errorMessage, response.status, endpoint, retryable)
  }

  try {
    return await response.json()
      } catch (error) {
      throw new ApiError(
        `Failed to parse response from ${endpoint}: ${error}`,
        undefined,
        endpoint,
        false,
      )
    }
}

export const apiCall = async <T>(
  endpoint: string,
  params?: Record<string, string>,
  retryCount = 0,
): Promise<T> => {
  try {
    validateApiKey(API_KEY)
    const url = new URL(`${BASE_URL}/${endpoint}`)
    url.searchParams.set('api_key', API_KEY)
    url.searchParams.set('language', 'en-US')

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.set(key, value)
      })
    }

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 10000) // 10 second timeout

    try {
      const response = await fetch(url.toString(), {
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
        },
      })
      
      clearTimeout(timeoutId)
      return await handleApiResponse<T>(response, endpoint)
    } catch (fetchError) {
      clearTimeout(timeoutId)
      
      if (fetchError instanceof Error) {
        if (fetchError.name === 'AbortError') {
          throw new NetworkError('Request timeout. Please try again.')
        }
        if (fetchError.message.includes('Failed to fetch')) {
          throw new NetworkError('Network connection failed. Please check your internet connection.')
        }
      }
      
      throw fetchError
    }
  } catch (error) {
    // Handle retryable errors
    if (error instanceof ApiError && error.retryable && retryCount < MAX_RETRIES) {
      console.warn(`Retrying API call to ${endpoint} (attempt ${retryCount + 1}/${MAX_RETRIES})`)
      await delay(RETRY_DELAY * Math.pow(2, retryCount)) // Exponential backoff
      return apiCall<T>(endpoint, params, retryCount + 1)
    }
    
    // Handle validation errors (don't retry)
    if (error instanceof ValidationError) {
      console.error(`Validation error for ${endpoint}:`, error.message)
      throw error
    }
    
    // Handle network errors (don't retry)
    if (error instanceof NetworkError) {
      console.error(`Network error for ${endpoint}:`, error.message)
      throw error
    }
    
    // Log and rethrow other errors
    console.error(`API call failed for ${endpoint}:`, error)
    throw error
  }
}
