import { useState, useEffect, useCallback } from 'react'
import { getMovieDetails } from '@api/tmdb'
import type { MovieDetails } from '@types'
import { useAsyncErrorHandler } from './useErrorHandler'

interface UseMovieDetailsReturn {
  movie: MovieDetails | null
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
  retry: () => Promise<void>
}

export const useMovieDetails = (movieId: string | undefined): UseMovieDetailsReturn => {
  const [movie, setMovie] = useState<MovieDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const { error, executeWithErrorHandling, clearError } = useAsyncErrorHandler()

  const fetchMovieDetails = useCallback(async () => {
    if (!movieId) {
      setLoading(false)
      return
    }

    setLoading(true)
    clearError()

    const result = await executeWithErrorHandling(async () => {
      const movieData = await getMovieDetails(parseInt(movieId))
      setMovie(movieData)
      return movieData
    }, 'fetchMovieDetails')

    setLoading(false)
    return result
  }, [movieId, executeWithErrorHandling, clearError])

  const refetch = useCallback(async () => {
    await fetchMovieDetails()
  }, [fetchMovieDetails])

  const retry = useCallback(async () => {
    if (error) {
      await fetchMovieDetails()
    }
  }, [error, fetchMovieDetails])

  useEffect(() => {
    fetchMovieDetails()
  }, [fetchMovieDetails])

  return {
    movie,
    loading,
    error: error?.message || null,
    refetch,
    retry,
  }
}
