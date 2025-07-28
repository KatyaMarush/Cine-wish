export const getImageUrl = (path: string, size: 'w300' | 'w500' = 'w300'): string => {
  return `https://image.tmdb.org/t/p/${size}${path}`
}

export const getPosterUrl = (path: string): string => {
  return getImageUrl(path, 'w300')
}

export const getBackdropUrl = (path: string): string => {
  return getImageUrl(path, 'w500')
}
