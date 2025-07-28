import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { useMovies } from './useMovies'
import { mockMovies } from '@test/utils'

// Mock the API module
vi.mock('@api/tmdb', () => ({
  getMoviesByCategory: vi.fn(),
}))

// Mock the categories
vi.mock('@constants/categories', () => ({
  HOMEPAGE_CATEGORIES: [
    {
      key: 'popular',
      endpoint: 'movie/popular',
    },
    {
      key: 'top_rated',
      endpoint: 'movie/top_rated',
    },
    {
      key: 'now_playing',
      endpoint: 'movie/now_playing',
    },
  ],
}))

describe('useMovies', () => {
  let mockGetMoviesByCategory: any

  beforeEach(async () => {
    vi.clearAllMocks()
    const apiModule = await import('@api/tmdb')
    mockGetMoviesByCategory = vi.mocked(apiModule.getMoviesByCategory)
  })

  it('should fetch movies successfully', async () => {
    mockGetMoviesByCategory
      .mockResolvedValueOnce(mockMovies)
      .mockResolvedValueOnce(mockMovies)
      .mockResolvedValueOnce(mockMovies)

    const { result } = renderHook(() => useMovies())

    // Initially should be loading
    expect(result.current.loading).toBe(true)
    expect(result.current.error).toBe(null)

    // Wait for the hook to finish loading
    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    // Should have movies for all categories
    expect(result.current.moviesByCategory.popular).toEqual(mockMovies)
    expect(result.current.moviesByCategory.top_rated).toEqual(mockMovies)
    expect(result.current.moviesByCategory.now_playing).toEqual(mockMovies)

    // Should have called the API for each category
    expect(mockGetMoviesByCategory).toHaveBeenCalledTimes(3)
    expect(mockGetMoviesByCategory).toHaveBeenCalledWith('movie/popular')
    expect(mockGetMoviesByCategory).toHaveBeenCalledWith('movie/top_rated')
    expect(mockGetMoviesByCategory).toHaveBeenCalledWith('movie/now_playing')
  })

  it('should handle API errors', async () => {
    const errorMessage = 'Failed to fetch movies'
    mockGetMoviesByCategory.mockRejectedValueOnce(new Error(errorMessage))

    const { result } = renderHook(() => useMovies())

    // Wait for the hook to finish loading
    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    // Should have error state
    expect(result.current.error).toBe(errorMessage)
    expect(result.current.moviesByCategory.popular).toEqual([])
  })

  it('should provide refetch functionality', async () => {
    mockGetMoviesByCategory
      .mockResolvedValueOnce(mockMovies)
      .mockResolvedValueOnce(mockMovies)
      .mockResolvedValueOnce(mockMovies)
      .mockResolvedValueOnce([{ ...mockMovies[0], id: 999 }]) // Different data on refetch

    const { result } = renderHook(() => useMovies())

    // Wait for initial load
    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    // Clear mocks to verify refetch calls
    vi.clearAllMocks()

    // Trigger refetch
    await result.current.refetch()

    // Should have called the API again
    expect(mockGetMoviesByCategory).toHaveBeenCalledTimes(3)
  })

  it('should handle partial failures gracefully', async () => {
    // Mock the API to fail on the second call (top_rated)
    mockGetMoviesByCategory
      .mockResolvedValueOnce(mockMovies) // popular succeeds
      .mockRejectedValueOnce(new Error('Top rated failed')) // top_rated fails
      .mockResolvedValueOnce(mockMovies) // now_playing succeeds

    const { result } = renderHook(() => useMovies())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    // Should have error state from the failure
    expect(result.current.error).toBe('Top rated failed')

    // Categories should be empty because the error handler returns null
    expect(result.current.moviesByCategory.popular).toEqual([])
    expect(result.current.moviesByCategory.top_rated).toEqual([])
    expect(result.current.moviesByCategory.now_playing).toEqual([])
  })
})
