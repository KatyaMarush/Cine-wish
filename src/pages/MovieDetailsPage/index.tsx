import React, { useMemo, useCallback } from 'react'
import { useParams, useNavigate, useSearchParams } from 'react-router-dom'

import { getCategoryConfig } from '@constants/categories'
import { useWishlist } from '@context/WishlistContext'
import { useMovieDetails } from '@hooks'
import { formatReleaseDate } from '@utils/dateUtils'
import { getBackdropUrl } from '@utils/imageUtils'
import { convertMovieDetailsToMovie } from '@utils/movieUtils'
import Loading from '@components/Loading'
import ErrorPage from '@components/ErrorPage'
import './MovieDetailsPage.scss'

export default function MovieDetailsPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist()
  const { movie, loading, error, retry } = useMovieDetails(id)

  const handleWishlistToggle = useCallback(() => {
    if (!movie) return

    if (isInWishlist(movie.id)) {
      removeFromWishlist(movie.id)
    } else {
      addToWishlist(convertMovieDetailsToMovie(movie))
    }
  }, [movie, isInWishlist, removeFromWishlist, addToWishlist])

  const handleBackClick = useCallback(() => {
    navigate('/')
  }, [navigate])

  // Get category from URL parameters, default to 'popular' if not provided
  const category = (searchParams.get('category') as 'popular' | 'top_rated' | 'now_playing') || 'popular'
  const config = useMemo(() => getCategoryConfig(category), [category])
  const isWishlisted = useMemo(
    () => (movie ? isInWishlist(movie.id) : false),
    [movie, isInWishlist],
  )

  const formattedReleaseDate = useMemo(() => {
    if (!movie) return ''
    return formatReleaseDate(movie.release_date)
  }, [movie])

  const buttonStyle = useMemo(
    () => ({
      background: isWishlisted ? '#ef4444' : config.buttonBg,
      color: '#fff',
    }),
    [isWishlisted, config.buttonBg],
  )

  const linkStyle = useMemo(
    () => ({
      color: config.accentColor,
    }),
    [config.accentColor],
  )

  if (loading) {
    return (
      <div className="movie-details-page">
        <Loading size="large" message="Loading movie details..." />
      </div>
    )
  }

  if (error || !movie) {
    return (
      <ErrorPage
        title="Movie Not Found"
        error={error || 'The requested movie could not be found'}
        showRetryButton={!!error}
        onRetry={retry}
        retryLabel="Retry Loading Movie"
        showHomeButton={true}
      />
    )
  }

  return (
    <div className="movie-details-page" style={{ fontFamily: config.fontFamily }}>
      <div className="movie-details-page__container">
        <button onClick={handleBackClick} className="back-button">
          ← Back to Home
        </button>

        <div className="movie-details-page__content">
          <div className="movie-details-page__poster">
            <img
              src={getBackdropUrl(movie.poster_path)}
              alt={movie.title}
              className="movie-details-page__image"
            />
            <div className="movie-details-page__rating">
              <span className="rating-icon">⭐</span>
              <span className="rating-score">{movie.vote_average.toFixed(1)}</span>
            </div>
          </div>

          <div className="movie-details-page__info">
            <h1 className="movie-details-page__title">{movie.title}</h1>

            {movie.tagline && <p className="movie-details-page__tagline">{movie.tagline}</p>}

            <div className="movie-details-page__meta">
              <span className="release-date">📅 {formattedReleaseDate}</span>{' '}
              {movie.runtime > 0 && <span className="runtime">⏱️ {movie.runtime} min</span>}
            </div>

            {movie.genres && movie.genres.length > 0 && (
              <div className="movie-details-page__genres">
                {movie.genres.map((genre) => (
                  <span key={genre.id} className="genre-tag">
                    {genre.name}
                  </span>
                ))}
              </div>
            )}

            <p className="movie-details-page__overview">{movie.overview}</p>

            <div className="movie-details-page__actions">
              <button
                onClick={handleWishlistToggle}
                className={`wishlist-button ${isWishlisted ? 'wishlist-button--active' : ''}`}
                style={buttonStyle}
              >
                {isWishlisted ? '❤️ Remove from Wishlist' : `💖 ${config.buttonText}`}
              </button>

              {movie.homepage && (
                <a
                  href={movie.homepage}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="homepage-link"
                  style={linkStyle}
                >
                  🌐 Visit Official Website
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
