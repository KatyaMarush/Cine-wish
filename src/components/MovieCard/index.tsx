import React from 'react'
import { Link } from 'react-router-dom'
import type { Movie } from '@types'
import { formatDate } from '@utils/dateUtils'
import { getPosterUrl } from '@utils/imageUtils'
import './MovieCard.scss'

interface Props {
  movie: Movie
  showDeleteButton?: boolean
  onDelete?: (_movieId: number) => void
  category?: 'popular' | 'top_rated' | 'now_playing'
}

const MovieCard: React.FC<Props> = ({
  movie,
  showDeleteButton = false,
  onDelete,
  category = 'popular',
}) => {
  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    onDelete?.(movie.id)
  }

  return (
    <article className="movie-card">
      <Link
        to={`/movie/${movie.id}?category=${category}`}
        className="movie-card__link"
        aria-label={`View details for ${movie.title}`}
      >
        <div className="movie-card__image-container">
          <img
            src={getPosterUrl(movie.poster_path)}
            alt={`Poster for ${movie.title}`}
            className="movie-card__image"
            loading="lazy"
          />
          <div className="movie-card__overlay">
            <div
              className="movie-card__rating"
              aria-label={`Rating: ${movie.vote_average.toFixed(1)} out of 10`}
            >
              <span className="movie-card__rating-icon" aria-hidden="true">
                ⭐
              </span>
              <span className="movie-card__rating-score">{movie.vote_average.toFixed(1)}</span>
            </div>
          </div>
        </div>

        <div className="movie-card__content">
          <h3 className="movie-card__title">{movie.title}</h3>

          <div className="movie-card__details">
            <div className="movie-card__release-date">
              <span aria-hidden="true">📅</span>
              <span>Released {formatDate(movie.release_date)}</span>
            </div>
          </div>
        </div>
      </Link>

      {showDeleteButton && (
        <button
          onClick={handleDelete}
          className="movie-card__delete-button"
          aria-label={`Remove ${movie.title} from wishlist`}
          title="Remove from wishlist"
        >
          🗑️ Remove from Wishlist
        </button>
      )}
    </article>
  )
}

export default React.memo(MovieCard)
