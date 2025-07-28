import { AppRoutes } from './routes/AppRoutes'
import { WishlistProvider } from '@context/WishlistContext'
import { Navigation } from '@components/Navigation'
import ErrorBoundary from '@components/ErrorBoundary'
import './styles/main.scss'

export default function App() {
  return (
    <ErrorBoundary>
      <WishlistProvider>
        <Navigation />
        <AppRoutes />
      </WishlistProvider>
    </ErrorBoundary>
  )
}
