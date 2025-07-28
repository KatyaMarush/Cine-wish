import type { Movie } from '@types'
import type { MovieDetails } from '@types'
import { apiCall } from './apiWrapper'

export async function getMoviesByCategory(endpoint: string): Promise<Movie[]> {
  const data = await apiCall<{ results: Movie[] }>(endpoint, { page: '1' })
  return data.results
}

export async function getMovieDetails(movieId: number): Promise<MovieDetails> {
  return await apiCall<MovieDetails>(`movie/${movieId}`)
}
