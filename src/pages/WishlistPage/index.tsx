import { Link } from 'react-router-dom'
import { useWishlist } from '@context/WishlistContext'
import MovieCard from '@components/MovieCard'
import './WishlistPage.scss'

export default function WishlistPage() {
  const { wishlist, removeFromWishlist, clearWishlist } = useWishlist()

  const handleRemoveFromWishlist = (movieId: number) => {
    removeFromWishlist(movieId)
  }

  const handleClearWishlist = () => {
    if (window.confirm('Are you sure you want to clear your wishlist?')) {
      clearWishlist()
    }
  }

  return (
    <div className="wishlist-page">
      <div className="wishlist-page__container">
        <div className="wishlist-page__header">
          <h1 className="wishlist-page__title">My Wishlist</h1>
          <p className="wishlist-page__subtitle">Your collection of movies you want to watch</p>
        </div>

        {wishlist.length === 0 ? (
          <div className="wishlist-page__empty">
            <div className="empty-state">
              <div className="empty-state__icon">🎬</div>
              <h2 className="empty-state__title">Your wishlist is empty</h2>
              <p className="empty-state__description">
                Start adding movies to your wishlist by browsing our collection
              </p>
              <Link to="/" className="empty-state__button">
                Browse Movies
              </Link>
            </div>
          </div>
        ) : (
          <>
            <div className="wishlist-page__actions">
              <div className="wishlist-page__stats">
                <span className="wishlist-count">
                  {wishlist.length} {wishlist.length === 1 ? 'movie' : 'movies'} in your wishlist
                </span>
              </div>
              <button onClick={handleClearWishlist} className="clear-wishlist-button">
                🗑️ Clear All
              </button>
            </div>

            <div className="wishlist-page__movies">
              {wishlist.map((movie) => (
                <MovieCard
                  key={movie.id}
                  movie={movie}
                  showDeleteButton={true}
                  onDelete={handleRemoveFromWishlist}
                  category="popular"
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
