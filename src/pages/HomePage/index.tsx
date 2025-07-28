import React, { Suspense } from 'react'
import { useMovies } from '@hooks/useMovies'
import Loading from '@components/Loading'
import ErrorPage from '@components/ErrorPage'
import './HomePage.scss'

// Lazy load Carousel component
const Carousel = React.lazy(() => import('@components/Carousel'))

const HomePage: React.FC = () => {
  const { moviesByCategory, loading, error, retry } = useMovies()

  if (error) {
    return (
      <ErrorPage
        title="Failed to Load Movies"
        error={error}
        showRetryButton={true}
        onRetry={retry}
        retryLabel="Retry Loading Movies"
        showHomeButton={false}
      />
    )
  }

  return (
    <main className="home-page">
      <div className="home-page__hero">
        <h1 className="home-page__title">Discover Amazing Movies</h1>
        <p className="home-page__subtitle">
          Explore the latest and greatest films across different categories.
          Add your favorites to your wishlist and never miss a great movie.
        </p>
      </div>

      <div className="home-page__categories">
        {loading ? (
          <Loading size="large" message="Loading movies..." />
        ) : (
          <Suspense fallback={<Loading size="large" message="Loading carousels..." />}>
            <Carousel
              title="Popular Movies"
              description="Trending movies that are currently popular"
              movies={moviesByCategory.popular}
            />

            <Carousel
              title="Top Rated Movies"
              description="Highest rated movies of all time"
              movies={moviesByCategory.top_rated}
            />

            <Carousel
              title="Now Playing"
              description="Movies currently in theaters"
              movies={moviesByCategory.now_playing}
            />
          </Suspense>
        )}
      </div>
    </main>
  )
}

export default HomePage
