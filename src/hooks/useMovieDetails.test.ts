import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { useMovieDetails } from './useMovieDetails'
import { mockMovieDetails } from '@test/utils'

// Mock the API module
vi.mock('@api/tmdb', () => ({
  getMovieDetails: vi.fn(),
}))

describe('useMovieDetails', () => {
  let mockGetMovieDetails: any

  beforeEach(async () => {
    vi.clearAllMocks()
    const apiModule = await import('@api/tmdb')
    mockGetMovieDetails = vi.mocked(apiModule.getMovieDetails)
  })

  it('should fetch movie details successfully', async () => {
    mockGetMovieDetails.mockResolvedValueOnce(mockMovieDetails)

    const { result } = renderHook(() => useMovieDetails('123'))

    // Initially should be loading
    expect(result.current.loading).toBe(true)
    expect(result.current.error).toBe(null)
    expect(result.current.movie).toBe(null)

    // Wait for the hook to finish loading
    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    // Should have movie data
    expect(result.current.movie).toEqual(mockMovieDetails)
    expect(result.current.error).toBe(null)

    // Should have called the API
    expect(mockGetMovieDetails).toHaveBeenCalledWith(123)
  })

  it('should handle API errors', async () => {
    const errorMessage = 'Failed to fetch movie details'
    mockGetMovieDetails.mockRejectedValueOnce(new Error(errorMessage))

    const { result } = renderHook(() => useMovieDetails('123'))

    // Wait for the hook to finish loading
    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    // Should have error state
    expect(result.current.error).toBe(errorMessage)
    expect(result.current.movie).toBe(null)
  })

  it('should handle missing movie ID', async () => {
    const { result } = renderHook(() => useMovieDetails(undefined))

    // Should immediately have error state
    expect(result.current.loading).toBe(false)
    expect(result.current.error).toBe(null) // No error when ID is undefined, just no fetch
    expect(result.current.movie).toBe(null)

    // Should not have called the API
    expect(mockGetMovieDetails).not.toHaveBeenCalled()
  })

  it('should refetch when movie ID changes', async () => {
    const movie1 = { ...mockMovieDetails, id: 123 }
    const movie2 = { ...mockMovieDetails, id: 456 }

    mockGetMovieDetails.mockResolvedValueOnce(movie1).mockResolvedValueOnce(movie2)

    const { result, rerender } = renderHook(({ id }) => useMovieDetails(id), {
      initialProps: { id: '123' },
    })

    // Wait for first load
    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.movie?.id).toBe(123)

    // Change movie ID
    rerender({ id: '456' })

    // Should be loading again
    expect(result.current.loading).toBe(true)

    // Wait for second load
    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.movie?.id).toBe(456)

    // Should have called the API twice
    expect(mockGetMovieDetails).toHaveBeenCalledTimes(2)
    expect(mockGetMovieDetails).toHaveBeenCalledWith(123)
    expect(mockGetMovieDetails).toHaveBeenCalledWith(456)
  })

  it('should provide refetch functionality', async () => {
    mockGetMovieDetails
      .mockResolvedValueOnce(mockMovieDetails)
      .mockResolvedValueOnce({ ...mockMovieDetails, title: 'Updated Title' })

    const { result } = renderHook(() => useMovieDetails('123'))

    // Wait for initial load
    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    // Clear mocks to verify refetch calls
    vi.clearAllMocks()

    // Trigger refetch
    await result.current.refetch()

    // Should have called the API again
    expect(mockGetMovieDetails).toHaveBeenCalledWith(123)
  })
})
