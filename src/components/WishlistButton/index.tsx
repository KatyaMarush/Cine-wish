import React from 'react'
import { useWishlist } from '@context/WishlistContext'
import type { Movie } from '@types'
import './WishlistButton.scss'

interface WishlistButtonProps {
  movie: Movie
  variant?: 'primary' | 'secondary'
  size?: 'small' | 'medium' | 'large'
  className?: string
}

export const WishlistButton: React.FC<WishlistButtonProps> = ({
  movie,
  variant = 'primary',
  size = 'medium',
  className = '',
}) => {
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist()
  const isInWishlistState = isInWishlist(movie.id)

  const handleClick = () => {
    if (isInWishlistState) {
      removeFromWishlist(movie.id)
    } else {
      addToWishlist(movie)
    }
  }

  return (
    <button
      className={`wishlist-button wishlist-button--${variant} wishlist-button--${size} ${className}`}
      onClick={handleClick}
      aria-label={isInWishlistState ? 'Remove from wishlist' : 'Add to wishlist'}
    >
      <span className="wishlist-button__icon">{isInWishlistState ? '❤️' : '🤍'}</span>
      <span className="wishlist-button__text">
        {isInWishlistState ? 'Remove from Wishlist' : 'Add to Wishlist'}
      </span>
    </button>
  )
}
