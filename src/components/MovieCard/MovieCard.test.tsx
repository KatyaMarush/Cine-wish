import React from 'react'
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import MovieCard from './index'
import { mockMovie } from '@test/utils'

// Mock react-router-dom
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    Link: ({
      children,
      to,
      ...props
    }: {
      children: React.ReactNode
      to: string
      [key: string]: any
    }) => (
      <a href={to} {...props}>
        {children}
      </a>
    ),
  }
})

describe('MovieCard', () => {
  it('renders movie information correctly', () => {
    render(<MovieCard movie={mockMovie} />)

    // Check if movie title is displayed
    expect(screen.getByText('Test Movie')).toBeInTheDocument()

    // Check if release date is displayed
    expect(screen.getByText(/Released/)).toBeInTheDocument()

    // Check if rating is displayed
    expect(screen.getByText('8.5')).toBeInTheDocument()

    // Check if poster image is rendered
    const posterImage = screen.getByAltText('Poster for Test Movie')
    expect(posterImage).toBeInTheDocument()
    expect(posterImage).toHaveAttribute('src', 'https://image.tmdb.org/t/p/w300/test-poster.jpg')
  })

  it('has proper accessibility attributes', () => {
    render(<MovieCard movie={mockMovie} />)

    // Check if the card is wrapped in an article element
    const article = screen.getByRole('article')
    expect(article).toBeInTheDocument()

    // Check if the link has proper aria-label
    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('aria-label', 'View details for Test Movie')

    // Check if the image has proper alt text
    const image = screen.getByAltText('Poster for Test Movie')
    expect(image).toBeInTheDocument()

    // Check if rating has proper aria-label
    const rating = screen.getByLabelText('Rating: 8.5 out of 10')
    expect(rating).toBeInTheDocument()
  })

  it('links to the correct movie details page', () => {
    render(<MovieCard movie={mockMovie} />)

    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('href', '/movie/1?category=popular')
  })

  it('displays formatted release date correctly', () => {
    const movieWithDifferentDate = {
      ...mockMovie,
      release_date: '2023-12-25',
    }

    render(<MovieCard movie={movieWithDifferentDate} />)

    // Should display formatted date
    expect(screen.getByText(/Dec 25, 2023/)).toBeInTheDocument()
  })

  it('handles movies with different ratings', () => {
    const movieWithLowRating = {
      ...mockMovie,
      vote_average: 3.2,
    }

    render(<MovieCard movie={movieWithLowRating} />)

    expect(screen.getByText('3.2')).toBeInTheDocument()
    expect(screen.getByLabelText('Rating: 3.2 out of 10')).toBeInTheDocument()
  })

  it('renders without crashing when movie has minimal data', () => {
    const minimalMovie = {
      id: 999,
      title: 'Minimal Movie',
      overview: '',
      poster_path: '/minimal-poster.jpg',
      backdrop_path: '/minimal-backdrop.jpg',
      release_date: '2023-01-01',
      vote_average: 0,
      vote_count: 0,
      genre_ids: [],
      adult: false,
      original_language: 'en',
      original_title: 'Minimal Movie',
      popularity: 0,
      video: false,
    }

    render(<MovieCard movie={minimalMovie} />)

    expect(screen.getByText('Minimal Movie')).toBeInTheDocument()
    expect(screen.getByText('0.0')).toBeInTheDocument()
  })

  it('includes category parameter in link when provided', () => {
    render(<MovieCard movie={mockMovie} category="top_rated" />)

    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('href', '/movie/1?category=top_rated')
  })
})
