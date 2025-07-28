import React from 'react'
import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import Carousel from './index'
import { mockMovies } from '@test/utils'

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

describe('Carousel', () => {
  const defaultProps = {
    title: 'Test Carousel',
    description: 'Test description',
    movies: mockMovies,
  }

  it('renders carousel with title and description', () => {
    render(<Carousel {...defaultProps} />)

    expect(screen.getByText('Test Carousel')).toBeInTheDocument()
    expect(screen.getByText('Test description', { selector: 'p' })).toBeInTheDocument()
  })

  it('renders all movies in the carousel', () => {
    render(<Carousel {...defaultProps} />)

    expect(screen.getByText('Test Movie')).toBeInTheDocument()
    expect(screen.getByText('Test Movie 2')).toBeInTheDocument()
    expect(screen.getByText('Test Movie 3')).toBeInTheDocument()
  })

  it('renders navigation buttons', () => {
    render(<Carousel {...defaultProps} />)

    const leftButton = screen.getByLabelText('Scroll left in Test Carousel carousel')
    const rightButton = screen.getByLabelText('Scroll right in Test Carousel carousel')

    expect(leftButton).toBeInTheDocument()
    expect(rightButton).toBeInTheDocument()
  })

  it('handles left scroll button click', () => {
    const scrollBySpy = vi.fn()
    Object.defineProperty(window.HTMLElement.prototype, 'scrollBy', {
      value: scrollBySpy,
      writable: true,
    })

    render(<Carousel {...defaultProps} />)

    const leftButton = screen.getByLabelText('Scroll left in Test Carousel carousel')
    fireEvent.click(leftButton)

    expect(scrollBySpy).toHaveBeenCalledWith({
      left: -300,
      behavior: 'smooth',
    })
  })

  it('handles right scroll button click', () => {
    const scrollBySpy = vi.fn()
    Object.defineProperty(window.HTMLElement.prototype, 'scrollBy', {
      value: scrollBySpy,
      writable: true,
    })

    render(<Carousel {...defaultProps} />)

    const rightButton = screen.getByLabelText('Scroll right in Test Carousel carousel')
    fireEvent.click(rightButton)

    expect(scrollBySpy).toHaveBeenCalledWith({
      left: 300,
      behavior: 'smooth',
    })
  })

  it('handles keyboard navigation', () => {
    const scrollBySpy = vi.fn()
    Object.defineProperty(window.HTMLElement.prototype, 'scrollBy', {
      value: scrollBySpy,
      writable: true,
    })

    render(<Carousel {...defaultProps} />)

    const carousel = screen.getByLabelText('Test Carousel movies')

    // Test left arrow key
    fireEvent.keyDown(carousel, { key: 'ArrowLeft' })
    expect(scrollBySpy).toHaveBeenCalledWith({
      left: -300,
      behavior: 'smooth',
    })

    // Reset spy
    scrollBySpy.mockClear()

    // Test right arrow key
    fireEvent.keyDown(carousel, { key: 'ArrowRight' })
    expect(scrollBySpy).toHaveBeenCalledWith({
      left: 300,
      behavior: 'smooth',
    })
  })

  it('renders without description when not provided', () => {
    const propsWithoutDescription = {
      title: 'Test Carousel',
      movies: mockMovies,
    }

    render(<Carousel {...propsWithoutDescription} />)

    expect(screen.getByText('Test Carousel')).toBeInTheDocument()
    expect(screen.queryByText('Test description')).not.toBeInTheDocument()
  })

  it('renders empty carousel when no movies provided', () => {
    const propsWithoutMovies = {
      title: 'Empty Carousel',
      description: 'No movies',
      movies: [],
    }

    render(<Carousel {...propsWithoutMovies} />)

    expect(screen.getByText('Empty Carousel')).toBeInTheDocument()
    expect(screen.getByText('No movies', { selector: 'p' })).toBeInTheDocument()

    // Should still have navigation buttons
    expect(screen.getByLabelText('Scroll left in Empty Carousel carousel')).toBeInTheDocument()
    expect(screen.getByLabelText('Scroll right in Empty Carousel carousel')).toBeInTheDocument()
  })

  it('has proper screen reader description', () => {
    render(<Carousel {...defaultProps} />)

    const description = screen.getByText('Test description', { selector: '.sr-only' })
    expect(description).toHaveClass('sr-only')
  })

  it('generates unique carousel ID based on title', () => {
    render(<Carousel {...defaultProps} />)

    const title = screen.getByRole('heading', { level: 2 })
    expect(title).toHaveAttribute('id', 'carousel-test-carousel-title')

    // Test with different title
    render(<Carousel title="Different Title" movies={mockMovies} />)

    const differentTitle = screen.getByText('Different Title')
    expect(differentTitle).toHaveAttribute('id', 'carousel-different-title-title')
  })
})
