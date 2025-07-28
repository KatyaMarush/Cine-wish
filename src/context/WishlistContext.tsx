import React, { createContext, useContext, useReducer, useEffect } from 'react'
import type { Movie, WishlistItem } from '@types'

interface WishlistState {
  items: WishlistItem[]
  isLoading: boolean
}

type WishlistAction =
  | { type: 'ADD_ITEM'; payload: Movie }
  | { type: 'REMOVE_ITEM'; payload: number }
  | { type: 'LOAD_ITEMS'; payload: WishlistItem[] }
  | { type: 'SET_LOADING'; payload: boolean }

interface WishlistContextType {
  state: WishlistState
  wishlist: Movie[]

  addToWishlist: (movie: Movie) => void

  removeFromWishlist: (movieId: number) => void
  clearWishlist: () => void

  isInWishlist: (movieId: number) => boolean
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined)

const wishlistReducer = (state: WishlistState, action: WishlistAction): WishlistState => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existingItem = state.items.find((item) => item.movie.id === action.payload.id)
      if (existingItem) {
        return state
      }
      return {
        ...state,
        items: [...state.items, { movie: action.payload, addedAt: new Date() }],
      }
    }

    case 'REMOVE_ITEM':
      return {
        ...state,
        items: state.items.filter((item) => item.movie.id !== action.payload),
      }

    case 'LOAD_ITEMS':
      return {
        ...state,
        items: action.payload,
      }

    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      }

    default:
      return state
  }
}

const WISHLIST_STORAGE_KEY = 'cine-wish-wishlist'

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(wishlistReducer, {
    items: [],
    isLoading: true,
  })

  // Load wishlist from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(WISHLIST_STORAGE_KEY)
      if (stored) {
        const items = JSON.parse(stored) as Array<{ movie: Movie; addedAt: string }>
        // Convert string dates back to Date objects
        const parsedItems = items.map((item) => ({
          ...item,
          addedAt: new Date(item.addedAt),
        }))
        dispatch({ type: 'LOAD_ITEMS', payload: parsedItems })
      }
    } catch (error) {
      console.error('Failed to load wishlist from localStorage:', error)
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }, [])

  // Save wishlist to localStorage whenever it changes
  useEffect(() => {
    if (!state.isLoading) {
      try {
        localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(state.items))
      } catch (error) {
        console.error('Failed to save wishlist to localStorage:', error)
      }
    }
  }, [state.items, state.isLoading])

  const addToWishlist = (movie: Movie) => {
    dispatch({ type: 'ADD_ITEM', payload: movie })
  }

  const removeFromWishlist = (movieId: number) => {
    dispatch({ type: 'REMOVE_ITEM', payload: movieId })
  }

  const clearWishlist = () => {
    dispatch({ type: 'LOAD_ITEMS', payload: [] })
  }

  const isInWishlist = (movieId: number): boolean => {
    return state.items.some((item) => item.movie.id === movieId)
  }

  const value: WishlistContextType = {
    state,
    wishlist: state.items.map((item) => item.movie),
    addToWishlist,
    removeFromWishlist,
    clearWishlist,
    isInWishlist,
  }

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>
}

export const useWishlist = (): WishlistContextType => {
  const context = useContext(WishlistContext)
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider')
  }
  return context
}
