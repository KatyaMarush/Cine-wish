import React from 'react'
import { render } from '@testing-library/react'
import type { RenderOptions } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { WishlistProvider } from '@context/WishlistContext'
import type { Movie, MovieDetails } from '@types'

// Test wrapper with all necessary providers
const AllTheProviders: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <BrowserRouter>
      <WishlistProvider>{children}</WishlistProvider>
    </BrowserRouter>
  )
}

// Custom render function with providers
const customRender = (ui: React.ReactElement, options?: Omit<RenderOptions, 'wrapper'>) =>
  render(ui, { wrapper: AllTheProviders, ...options })

// Test data
export const mockMovie: Movie = {
  id: 1,
  title: 'Test Movie',
  overview: 'This is a test movie overview',
  poster_path: '/test-poster.jpg',
  backdrop_path: '/test-backdrop.jpg',
  release_date: '2023-01-01',
  vote_average: 8.5,
  vote_count: 1000,
  genre_ids: [28, 12],
  adult: false,
  original_language: 'en',
  original_title: 'Test Movie',
  popularity: 100,
  video: false,
}

export const mockMovieDetails: MovieDetails = {
  ...mockMovie,
  genres: [
    { id: 28, name: 'Action' },
    { id: 12, name: 'Adventure' },
  ],
  runtime: 120,
  status: 'Released',
  tagline: 'A test tagline',
  budget: 1000000,
  revenue: 5000000,
  production_companies: [
    {
      id: 1,
      name: 'Test Studio',
      logo_path: '/test-logo.png',
      origin_country: 'US',
    },
  ],
  production_countries: [
    {
      iso_3166_1: 'US',
      name: 'United States',
    },
  ],
  spoken_languages: [
    {
      english_name: 'English',
      iso_639_1: 'en',
      name: 'English',
    },
  ],
  homepage: 'https://test-movie.com',
}

export const mockMovies: Movie[] = [
  mockMovie,
  {
    ...mockMovie,
    id: 2,
    title: 'Test Movie 2',
  },
  {
    ...mockMovie,
    id: 3,
    title: 'Test Movie 3',
  },
]

// Re-export everything
export * from '@testing-library/react'
export { customRender as render }
