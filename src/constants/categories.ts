import type { CategoryType, CategoryConfig } from '@types'

// Simplified category configurations
export const CATEGORY_CONFIGS: Record<CategoryType, CategoryConfig> = {
  popular: {
    fontFamily: 'system-ui, sans-serif',
    buttonText: 'Add to Wishlist',
    buttonColor: '#3b82f6',
    buttonBg: '#3b82f6',
    accentColor: '#3b82f6',
  },
  top_rated: {
    fontFamily: 'Georgia, serif',
    buttonText: 'Add to Favorites',
    buttonColor: '#fbbf24',
    buttonBg: '#fbbf24',
    accentColor: '#fbbf24',
  },
  now_playing: {
    fontFamily: 'monospace',
    buttonText: 'Save for Later',
    buttonColor: '#10b981',
    buttonBg: '#10b981',
    accentColor: '#10b981',
  },
} as const

// Homepage categories configuration
export const HOMEPAGE_CATEGORIES = [
  {
    key: 'popular' as const,
    label: 'Popular Movies',
    endpoint: 'movie/popular',
    description: 'Most popular movies right now',
  },
  {
    key: 'top_rated' as const,
    label: 'Top Rated',
    endpoint: 'movie/top_rated',
    description: 'Highest rated movies of all time',
  },
  {
    key: 'now_playing' as const,
    label: 'Now Playing',
    endpoint: 'movie/now_playing',
    description: 'Movies currently in theaters',
  },
] as const

// Helper function to get category configuration
export const getCategoryConfig = (category: CategoryType): CategoryConfig => {
  return CATEGORY_CONFIGS[category]
}
