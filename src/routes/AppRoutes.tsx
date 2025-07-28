import React, { Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import Loading from '@components/Loading'
import ErrorPage from '@components/ErrorPage'
import ErrorBoundary from '@components/ErrorBoundary'

// Lazy load page components
const HomePage = React.lazy(() => import('@pages/HomePage'))
const MovieDetailsPage = React.lazy(() => import('@pages/MovieDetailsPage'))
const WishlistPage = React.lazy(() => import('@pages/WishlistPage'))

export const AppRoutes: React.FC = () => {
  return (
    <ErrorBoundary
      fallback={
        <ErrorPage
          title="Failed to Load Page"
          message="The page you're trying to access couldn't be loaded. Please try refreshing the page."
          showRetryButton={true}
          onRetry={() => window.location.reload()}
          retryLabel="Reload Page"
          showHomeButton={true}
        />
      }
    >
      <Suspense fallback={<Loading size="large" message="Loading page..." />}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/movie/:id" element={<MovieDetailsPage />} />
          <Route path="/wishlist" element={<WishlistPage />} />
        </Routes>
      </Suspense>
    </ErrorBoundary>
  )
}
