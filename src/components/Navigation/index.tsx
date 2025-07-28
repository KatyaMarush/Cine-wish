import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import './Navigation.scss'

export const Navigation: React.FC = () => {
  const location = useLocation()

  return (
    <nav className="navigation">
      <div className="navigation__container">
        <Link to="/" className="navigation__logo">
          🎬 Cine-Wish
        </Link>

        <div className="navigation__links">
          <Link
            to="/"
            className={`navigation__link ${location.pathname === '/' ? 'navigation__link--active' : ''}`}
          >
            Home
          </Link>
          <Link
            to="/wishlist"
            className={`navigation__link ${location.pathname === '/wishlist' ? 'navigation__link--active' : ''}`}
          >
            Wishlist
          </Link>
        </div>
      </div>
    </nav>
  )
}
