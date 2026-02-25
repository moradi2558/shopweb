export function getImageUrl(path: string | undefined | null): string {
  if (!path) return ''
  
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path
  }
  
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
  
  if (path.startsWith('/media/')) {
    return `${baseUrl}${path}`
  }
  
  if (path.startsWith('media/')) {
    return `${baseUrl}/${path}`
  }
  
  return `${baseUrl}/media/${path}`
}

export function formatPrice(price: number): string {
  return price.toLocaleString('fa-IR') + ' تومان'
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str
  return str.slice(0, length) + '...'
}
