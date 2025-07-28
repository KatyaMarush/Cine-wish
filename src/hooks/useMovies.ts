import { useState, useEffect } from 'react'
import { getMoviesByCategory } from '@api/tmdb'
import type { Movie } from '@types'
import { HOMEPAGE_CATEGORIES } from '@constants/categories'
import { useAsyncErrorHandler } from './useErrorHandler'

type CategoryKey = (typeof HOMEPAGE_CATEGORIES)[number]['key']

interface UseMoviesReturn {
  moviesByCategory: Record<CategoryKey, Movie[]>
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
  retry: () => Promise<void>
}

export const useMovies = (): UseMoviesReturn => {
  const [moviesByCategory, setMoviesByCategory] = useState<Record<CategoryKey, Movie[]>>({
    popular: [],
    top_rated: [],
    now_playing: [],
  })
  const [loading, setLoading] = useState(true)
  const { error, executeWithErrorHandling, clearError } = useAsyncErrorHandler()

  const fetchMovies = async () => {
    setLoading(true)
    clearError()

    const result = await executeWithErrorHandling(async () => {
      const promises = HOMEPAGE_CATEGORIES.map(async ({ key, endpoint }) => {
        const movies = await getMoviesByCategory(endpoint)
        return { key, movies }
      })

      const results = await Promise.all(promises)
      const newMoviesByCategory = results.reduce(
        (acc, { key, movies }) => {
          acc[key] = movies
          return acc
        },
        {} as Record<CategoryKey, Movie[]>,
      )

      setMoviesByCategory(newMoviesByCategory)
      return newMoviesByCategory
    }, 'fetchMovies')

    setLoading(false)
    return result
  }

  const refetch = async () => {
    await fetchMovies()
  }

  const retry = async () => {
    if (error) {
      await fetchMovies()
    }
  }

  useEffect(() => {
    fetchMovies()
  }, [])

  return {
    moviesByCategory,
    loading,
    error: error?.message || null,
    refetch,
    retry,
  }
}
