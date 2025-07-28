import React, { useRef, useCallback, useMemo } from 'react'
import type { Movie } from '@types'
import MovieCard from '@components/MovieCard'
import './Carousel.scss'

interface CarouselProps {
  title: string
  description?: string
  movies: Movie[]
}

const Carousel: React.FC<CarouselProps> = ({ title, description, movies }) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  // Determine category based on title
  const category = useMemo(() => {
    if (title.toLowerCase().includes('popular')) return 'popular'
    if (title.toLowerCase().includes('top rated')) return 'top_rated'
    if (title.toLowerCase().includes('now playing')) return 'now_playing'
    return 'popular' // default fallback
  }, [title])

  const scrollLeft = useCallback(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: -300,
        behavior: 'smooth',
      })
    }
  }, [])

  const scrollRight = useCallback(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: 300,
        behavior: 'smooth',
      })
    }
  }, [])

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key === 'ArrowLeft') {
        event.preventDefault()
        scrollLeft()
      } else if (event.key === 'ArrowRight') {
        event.preventDefault()
        scrollRight()
      }
    },
    [scrollLeft, scrollRight],
  )

  const carouselId = `carousel-${title.toLowerCase().replace(/\s+/g, '-')}`

  return (
    <section className="carousel" aria-labelledby={`${carouselId}-title`}>
      <h2 id={`${carouselId}-title`}>{title}</h2>
      {description && <p>{description}</p>}

      <div className="carousel__container">
        <button
          className="carousel__nav-button carousel__nav-button--left"
          onClick={scrollLeft}
          onKeyDown={handleKeyDown}
          aria-label={`Scroll left in ${title} carousel`}
          aria-describedby={`${carouselId}-description`}
        >
          <span aria-hidden="true">‹</span>
        </button>

        <div
          className="carousel__movies"
          ref={scrollContainerRef}
          role="region"
          aria-label={`${title} movies`}
          tabIndex={0}
          onKeyDown={handleKeyDown}
        >
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} category={category} />
          ))}
        </div>

        <button
          className="carousel__nav-button carousel__nav-button--right"
          onClick={scrollRight}
          onKeyDown={handleKeyDown}
          aria-label={`Scroll right in ${title} carousel`}
          aria-describedby={`${carouselId}-description`}
        >
          <span aria-hidden="true">›</span>
        </button>
      </div>

      <div id={`${carouselId}-description`} className="sr-only">
        {description || `${title} carousel with ${movies.length} movies`}
      </div>
    </section>
  )
}

export default React.memo(Carousel)
