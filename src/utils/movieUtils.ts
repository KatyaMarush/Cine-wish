import type { Movie, MovieDetails } from '@types'

export const convertMovieDetailsToMovie = (movieDetails: MovieDetails): Movie => {
  return {
    id: movieDetails.id,
    title: movieDetails.title,
    overview: movieDetails.overview,
    poster_path: movieDetails.poster_path,
    backdrop_path: movieDetails.backdrop_path,
    release_date: movieDetails.release_date,
    vote_average: movieDetails.vote_average,
    vote_count: movieDetails.vote_count,
    genre_ids: movieDetails.genres?.map((g) => g.id) || [],
    adult: movieDetails.adult,
    original_language: movieDetails.original_language,
    original_title: movieDetails.original_title,
    popularity: movieDetails.popularity,
    video: movieDetails.video,
  }
}
