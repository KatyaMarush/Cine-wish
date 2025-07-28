import React from 'react'
import { Link } from 'react-router-dom'
import { getErrorMessage } from '@utils/errorHandling'
import type { AppError } from '@utils/errorHandling'
import './ErrorPage.scss'

interface ErrorPageProps {
  title?: string
  message?: string
  error?: AppError | Error | string
  showHomeButton?: boolean
  showRetryButton?: boolean
  onRetry?: () => void
  retryLabel?: string
}

const ErrorPage: React.FC<ErrorPageProps> = ({
  title = 'Something went wrong',
  message,
  error,
  showHomeButton = true,
  showRetryButton = false,
  onRetry,
  retryLabel = 'Try Again',
}) => {
  const getErrorDetails = () => {
    if (typeof error === 'string') {
      return error
    }
    
    if (error instanceof Error) {
      return getErrorMessage({ message: error.message })
    }
    
    if (error && typeof error === 'object' && 'message' in error) {
      return getErrorMessage(error as AppError)
    }
    
    return message || 'An unexpected error occurred'
  }

  const errorDetails = getErrorDetails()

  return (
    <div className="error-page">
      <div className="error-page__container">
        <div className="error-page__content">
          <div className="error-page__icon">⚠️</div>
          <h1 className="error-page__title">{title}</h1>
          <p className="error-page__message">{errorDetails}</p>
          
          <div className="error-page__actions">
            {showRetryButton && onRetry && (
              <button onClick={onRetry} className="error-page__button error-page__button--primary">
                {retryLabel}
              </button>
            )}
            
            {showHomeButton && (
              <Link to="/" className="error-page__button error-page__button--secondary">
                Go Home
              </Link>
            )}
          </div>

          {error && typeof error === 'object' && 'status' in error && (
            <details className="error-page__details">
              <summary>Technical Details</summary>
              <div className="error-page__error-info">
                {error.status && <p><strong>Status:</strong> {error.status}</p>}
                {error.endpoint && <p><strong>Endpoint:</strong> {error.endpoint}</p>}
                {error.timestamp && (
                  <p><strong>Time:</strong> {new Date(error.timestamp).toLocaleString()}</p>
                )}
              </div>
            </details>
          )}
        </div>
      </div>
    </div>
  )
}

export default ErrorPage
