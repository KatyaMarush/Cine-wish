import { Component } from 'react'
import type { ErrorInfo, ReactNode } from 'react'
import { getErrorMessage } from '@utils/errorHandling'
import './ErrorBoundary.scss'

interface Props {
  children: ReactNode
  fallback?: ReactNode
  onError?: (error: Error, errorInfo: ErrorInfo) => void
}

interface State {
  hasError: boolean
  error?: Error
  errorInfo?: ErrorInfo
  retryCount: number
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, retryCount: 0 }
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error to console or error reporting service
    console.error('ErrorBoundary caught an error:', error, errorInfo)
    
    // Call custom error handler if provided
    this.props.onError?.(error, errorInfo)
    
    // Update state with error info
    this.setState({ errorInfo })
  }

  handleRetry = () => {
    this.setState((prevState) => ({
      hasError: false,
      error: undefined,
      errorInfo: undefined,
      retryCount: prevState.retryCount + 1,
    }))
  }

  handleReload = () => {
    window.location.reload()
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback
      }

      const errorMessage = this.state.error 
        ? getErrorMessage({ message: this.state.error.message })
        : 'An unexpected error occurred'

      return (
        <div className="error-boundary">
          <div className="error-boundary__container">
            <div className="error-boundary__content">
              <div className="error-boundary__icon">⚠️</div>
              <h1 className="error-boundary__title">Something went wrong</h1>
              <p className="error-boundary__message">{errorMessage}</p>
              
              <div className="error-boundary__actions">
                <button 
                  onClick={this.handleRetry} 
                  className="error-boundary__button error-boundary__button--primary"
                >
                  Try Again
                </button>
                <button 
                  onClick={this.handleReload} 
                  className="error-boundary__button error-boundary__button--secondary"
                >
                  Refresh Page
                </button>
              </div>

              {this.state.error && (
                <details className="error-boundary__details">
                  <summary>Error Details</summary>
                  <div className="error-boundary__error-info">
                    <p><strong>Error:</strong> {this.state.error.message}</p>
                    {this.state.errorInfo && (
                      <p><strong>Component Stack:</strong></p>
                    )}
                    <pre className="error-boundary__error">
                      {this.state.errorInfo?.componentStack || this.state.error.stack}
                    </pre>
                  </div>
                </details>
              )}
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
