import React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { WishlistProvider, useWishlist } from './WishlistContext'
import { mockMovie } from '@test/utils'

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
  length: 0,
  key: vi.fn(),
}
global.localStorage = localStorageMock as Storage

describe('WishlistContext', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorageMock.getItem.mockReturnValue(null)
  })

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <WishlistProvider>{children}</WishlistProvider>
  )

  it('should initialize with empty wishlist', () => {
    const { result } = renderHook(() => useWishlist(), { wrapper })

    expect(result.current.wishlist).toEqual([])
    expect(result.current.state.items).toEqual([])
    expect(result.current.isInWishlist(1)).toBe(false)
  })

  it('should load wishlist from localStorage on mount', () => {
    const storedWishlist = [
      {
        movie: mockMovie,
        addedAt: '2023-01-01T00:00:00.000Z',
      },
    ]
    localStorageMock.getItem.mockReturnValue(JSON.stringify(storedWishlist))

    const { result } = renderHook(() => useWishlist(), { wrapper })

    expect(result.current.wishlist).toEqual([mockMovie])
    expect(result.current.isInWishlist(mockMovie.id)).toBe(true)
  })

  it('should add movie to wishlist', () => {
    const { result } = renderHook(() => useWishlist(), { wrapper })

    act(() => {
      result.current.addToWishlist(mockMovie)
    })

    expect(result.current.wishlist).toEqual([mockMovie])
    expect(result.current.isInWishlist(mockMovie.id)).toBe(true)
    expect(localStorageMock.setItem).toHaveBeenCalled()
  })

  it('should not add duplicate movies to wishlist', () => {
    const { result } = renderHook(() => useWishlist(), { wrapper })

    act(() => {
      result.current.addToWishlist(mockMovie)
      result.current.addToWishlist(mockMovie) // Try to add again
    })

    expect(result.current.wishlist).toEqual([mockMovie])
    expect(result.current.wishlist).toHaveLength(1)
  })

  it('should remove movie from wishlist', () => {
    const { result } = renderHook(() => useWishlist(), { wrapper })

    // Add movie first
    act(() => {
      result.current.addToWishlist(mockMovie)
    })

    expect(result.current.isInWishlist(mockMovie.id)).toBe(true)

    // Remove movie
    act(() => {
      result.current.removeFromWishlist(mockMovie.id)
    })

    expect(result.current.wishlist).toEqual([])
    expect(result.current.isInWishlist(mockMovie.id)).toBe(false)
    expect(localStorageMock.setItem).toHaveBeenCalled()
  })

  it('should clear all wishlist items', () => {
    const { result } = renderHook(() => useWishlist(), { wrapper })

    // Add multiple movies
    act(() => {
      result.current.addToWishlist(mockMovie)
      result.current.addToWishlist({ ...mockMovie, id: 2 })
    })

    expect(result.current.wishlist).toHaveLength(2)

    // Clear wishlist
    act(() => {
      result.current.clearWishlist()
    })

    expect(result.current.wishlist).toEqual([])
    expect(result.current.state.items).toEqual([])
  })

  it('should handle localStorage errors gracefully', () => {
    localStorageMock.setItem.mockImplementation(() => {
      throw new Error('Storage quota exceeded')
    })

    const { result } = renderHook(() => useWishlist(), { wrapper })

    // Should not crash when adding to wishlist
    act(() => {
      result.current.addToWishlist(mockMovie)
    })

    expect(result.current.wishlist).toEqual([mockMovie])
  })

  it('should handle corrupted localStorage data', () => {
    localStorageMock.getItem.mockReturnValue('invalid json')

    const { result } = renderHook(() => useWishlist(), { wrapper })

    // Should initialize with empty wishlist
    expect(result.current.wishlist).toEqual([])
    expect(result.current.state.items).toEqual([])
  })

  it('should preserve addedAt timestamp when loading from localStorage', () => {
    const storedWishlist = [
      {
        movie: mockMovie,
        addedAt: '2023-01-01T00:00:00.000Z',
      },
    ]
    localStorageMock.getItem.mockReturnValue(JSON.stringify(storedWishlist))

    const { result } = renderHook(() => useWishlist(), { wrapper })

    expect(result.current.state.items[0].addedAt).toBeInstanceOf(Date)
    expect(result.current.state.items[0].addedAt.toISOString()).toBe('2023-01-01T00:00:00.000Z')
  })
})
