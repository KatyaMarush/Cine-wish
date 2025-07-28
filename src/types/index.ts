// Unified movie types - consolidates types from src/api/types.ts and src/types/movie.ts

export interface Movie {
  id: number
  title: string
  overview: string
  poster_path: string
  backdrop_path: string
  release_date: string
  vote_average: number
  vote_count: number
  genre_ids: number[]
  adult: boolean
  original_language: string
  original_title: string
  popularity: number
  video: boolean
}

export interface Genre {
  id: number
  name: string
}

export interface MovieDetails extends Movie {
  genres: Genre[]
  runtime: number
  status: string
  tagline: string
  budget: number
  revenue: number
  production_companies: ProductionCompany[]
  production_countries: ProductionCountry[]
  spoken_languages: SpokenLanguage[]
  homepage: string
}

export interface ProductionCompany {
  id: number
  name: string
  logo_path: string | null
  origin_country: string
}

export interface ProductionCountry {
  iso_3166_1: string
  name: string
}

export interface SpokenLanguage {
  english_name: string
  iso_639_1: string
  name: string
}

export interface MovieCategory {
  id: string
  name: string
  endpoint: string
  color: string
  font: string
}

export interface WishlistItem {
  movie: Movie
  addedAt: Date
}

export interface ApiResponse<T> {
  page: number
  results: T[]
  total_pages: number
  total_results: number
}

// Category types for better type safety
export type CategoryType = 'popular' | 'top_rated' | 'now_playing'

export interface CategoryConfig {
  fontFamily: string
  buttonText: string
  buttonColor: string
  buttonBg: string
  accentColor: string
}
