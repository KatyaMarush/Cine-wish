export const formatDate = (dateString: string, format: 'short' | 'long' = 'short'): string => {
  const date = new Date(dateString)
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    day: 'numeric',
    month: format === 'short' ? 'short' : 'long',
  }
  return date.toLocaleDateString('en-US', options)
}

export const formatReleaseDate = (dateString: string): string => {
  return formatDate(dateString, 'long')
}
