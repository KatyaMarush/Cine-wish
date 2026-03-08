# Cine-Wish - Movie Discovery Application

A web application for browsing movies by categories with wishlist functionality. Built with React, TypeScript, and SCSS with server-side rendering support.

## Project Structure

```
cine-wish/
├── src/
│   ├── api/
│   │   ├── apiWrapper.ts          # Centralized API handling with retry logic
│   │   └── tmdb.ts               # TMDB API integration
│   ├── components/
│   │   ├── Carousel/
│   │   │   ├── index.tsx         # Horizontal scrolling movie carousel
│   │   │   ├── Carousel.scss     # Carousel styling
│   │   │   └── Carousel.test.tsx # Carousel component tests
│   │   ├── ErrorBoundary/
│   │   │   └── index.tsx         # React error boundary wrapper
│   │   ├── ErrorPage/
│   │   │   ├── index.tsx         # Error display component
│   │   │   └── ErrorPage.scss    # Error page styling
│   │   ├── Loading/
│   │   │   ├── index.tsx         # Loading spinner component
│   │   │   └── Loading.scss      # Loading animation styles
│   │   ├── MovieCard/
│   │   │   ├── index.tsx         # Reusable movie card component
│   │   │   ├── MovieCard.scss    # Card styling
│   │   │   └── MovieCard.test.tsx # Card component tests
│   │   ├── Navigation/
│   │   │   ├── index.tsx         # Top navigation bar
│   │   │   └── Navigation.scss   # Navigation styling
│   │   └── WishlistButton/
│   │       ├── index.tsx         # Wishlist toggle button
│   │       └── WishlistButton.scss # Button styling
│   ├── constants/
│   │   └── categories.ts         # Category configurations and styling
│   ├── context/
│   │   ├── WishlistContext.tsx   # Global wishlist state management
│   │   └── WishlistContext.test.tsx # Context tests
│   ├── hooks/
│   │   ├── index.ts              # Hook exports
│   │   ├── useErrorHandler.ts    # Centralized error handling
│   │   ├── useMovies.ts          # Movie data fetching hook
│   │   ├── useMovies.test.ts     # Movies hook tests
│   │   ├── useMovieDetails.ts    # Movie details fetching hook
│   │   └── useMovieDetails.test.ts # Details hook tests
│   ├── pages/
│   │   ├── HomePage/
│   │   │   ├── index.tsx         # Main homepage with carousels
│   │   │   └── HomePage.scss     # Homepage styling
│   │   ├── MovieDetailsPage/
│   │   │   ├── index.tsx         # Individual movie details page
│   │   │   └── MovieDetailsPage.scss # Details page styling
│   │   └── WishlistPage/
│   │       ├── index.tsx         # Wishlist management page
│   │       └── WishlistPage.scss # Wishlist page styling
│   ├── routes/
│   │   └── AppRoutes.tsx         # Application routing configuration
│   ├── styles/
│   │   ├── components/           # Component-specific styles
│   │   ├── pages/                # Page-specific styles
│   │   ├── variables/            # SCSS variables
│   │   └── main.scss             # Global styles and utilities
│   ├── test/
│   │   ├── setup.ts              # Test configuration and mocks
│   │   ├── testUtils.tsx         # Test utility functions
│   │   └── utils.tsx             # Test helper components
│   ├── types/
│   │   ├── index.ts              # TypeScript type definitions
│   │   └── server.ts             # Server-side type definitions
│   ├── utils/
│   │   ├── dateUtils.ts          # Date formatting utilities
│   │   ├── errorHandling.ts      # Error handling utilities
│   │   ├── imageUtils.ts         # Image URL utilities
│   │   ├── index.ts              # Utility exports
│   │   └── movieUtils.ts         # Movie data transformation utilities
│   ├── App.tsx                   # Root application component
│   ├── entry-client.tsx          # Client-side entry point
│   ├── entry-server.tsx          # Server-side entry point
│   └── main.tsx                  # Application bootstrap
├── server.ts                     # Express SSR server
├── vite.config.ts                # Vite configuration
├── vitest.config.ts              # Test configuration
├── tsconfig.json                 # TypeScript configuration
├── package.json                  # Dependencies and scripts
└── README.md                     # Project documentation
```

## Functionality

### Core Features

**Homepage with Three Movie Carousels**

- Popular Movies: Trending films with system font styling
- Top Rated Movies: Highest rated films with Georgia serif font
- Now Playing: Current theatrical releases with monospace font
- Horizontal scrolling with keyboard navigation support
- Lazy loading for optimal performance

**Movie Details Page**

- Comprehensive movie information display
- Category-based visual differentiation:
  - Popular: Blue "Add to Wishlist" button
  - Top Rated: Gold "Add to Favorites" button
  - Now Playing: Green "Save for Later" button
- Dynamic font families per category
- Wishlist integration with toggle functionality
- External website links when available

**Wishlist Management**

- Add/remove movies from personal wishlist
- Persistent storage using localStorage
- Bulk clear functionality with confirmation
- Empty state with call-to-action
- Individual movie removal options

**Advanced Features**

- Server-side rendering (SSR) for improved SEO
- Comprehensive error handling with retry logic
- Responsive design with mobile-first approach
- Accessibility features (ARIA labels, keyboard navigation)
- Performance optimizations (lazy loading, memoization)

### Technical Architecture

**State Management**

- Context API with reducer pattern for wishlist
- Custom hooks for data fetching and error handling
- Local storage persistence with error recovery

**API Integration**

- TMDB API integration with retry logic
- Exponential backoff for failed requests
- Request timeout handling (10 seconds)
- Comprehensive error classification

**Performance Optimizations**

- Lazy loading of components and routes
- React.memo for component memoization
- Efficient re-render prevention
- Image lazy loading with proper alt text

**Error Handling**

- Custom error classes (ApiError, NetworkError, ValidationError)
- Error boundaries for component-level error catching
- Graceful degradation with fallback UI
- Comprehensive error logging and user feedback

## Installation Requirements

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn package manager
- Modern web browser with ES6+ support

### Environment Setup

Create a `.env` file in the project root:

```
VITE_TMDB_API_KEY=your_tmdb_api_key_here
```

**Note:** A valid TMDB API key is required for the application to function. Obtain a free API key from [TheMovieDatabase](https://www.themoviedb.org/settings/api).

### Dependencies

**Production Dependencies**

- React 19.1.0 - UI framework
- React Router DOM 6.23.1 - Client-side routing
- Express 4.18.2 - SSR server

**Development Dependencies**

- TypeScript 5.8.3 - Type safety
- Vite 5.4.19 - Build tool and dev server
- Vitest 3.2.4 - Testing framework
- ESLint 9.31.0 - Code linting
- Prettier 3.6.2 - Code formatting
- Sass 1.89.2 - SCSS compilation
- Testing Library - Component testing utilities

## Running the Application

### Development Mode

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at `http://localhost:5173`

### Production Build

```bash
# Create production build
npm run build

# Preview production build
npm run preview
```

### Testing

```bash
# Run all tests
npm run test

# Run tests with UI
npm run test:ui

# Run tests with coverage
npm run test:coverage
```

### Code Quality

```bash
# Lint code
npm run lint

# Format code
npm run format
```

### Available Scripts

- `npm run dev` - Start development server with SSR
- `npm run build` - Create production build
- `npm run start` - Start production server
- `npm run preview` - Preview production build
- `npm run test` - Run test suite
- `npm run test:ui` - Run tests with UI interface
- `npm run test:coverage` - Run tests with coverage report
- `npm run lint` - Run ESLint with auto-fix
- `npm run format` - Format code with Prettier

### Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

### Performance Considerations

- Images are lazy-loaded for optimal performance
- Components are code-split and lazy-loaded
- SSR provides fast initial page loads
- Efficient state management prevents unnecessary re-renders
- Comprehensive caching strategies for API responses
