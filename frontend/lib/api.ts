import axios from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
})

// Helper function to get full image URL
export const getImageUrl = (imagePath: string | null | undefined): string | null => {
  if (!imagePath) return null
  if (imagePath.startsWith('http')) return imagePath
  return `${API_URL}${imagePath.startsWith('/') ? '' : '/'}${imagePath}`
}

// Request interceptor
api.interceptors.request.use(
  (config) => {
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized
      if (typeof window !== 'undefined') {
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

export default api

// API endpoints
export const bookAPI = {
  list: (params?: any) => api.get('/books/', { params }),
  detail: (id: number) => api.get(`/books/${id}/`),
  create: (data: any) => api.post('/books/create/', data),
  update: (id: number, data: any) => api.put(`/books/${id}/update/`, data),
  delete: (id: number) => api.delete(`/books/${id}/delete/`),
  purchase: (id: number) => api.post(`/books/${id}/purchase/`),
}

export const categoryAPI = {
  list: () => api.get('/categories/'),
  detail: (id: number) => api.get(`/categories/${id}/`),
  books: (id: number, params?: any) => api.get(`/categories/${id}/books/`, { params }),
}

export const borrowAPI = {
  list: (params?: any) => api.get('/borrows/', { params }),
  detail: (id: number) => api.get(`/borrows/${id}/`),
  create: (data: any) => api.post('/borrows/create/', data),
  return: (id: number) => api.post(`/borrows/${id}/return/`),
  myActive: () => api.get('/borrows/my-active/'),
}

export const authAPI = {
  register: (data: any) => api.post('/accounts/register/', data),
  login: (data: any) => api.post('/accounts/login/', data),
  logout: () => api.post('/accounts/logout/'),
  me: () => api.get('/accounts/me/'),
}

export const profileAPI = {
  get: () => api.get('/accounts/profile/'),
  update: (data: any) => api.put('/accounts/profile/update/', data),
}

export const statsAPI = {
  user: () => api.get('/stats/'),
  library: () => api.get('/stats/admin/'),
}

export const homeAPI = {
  get: () => api.get('/'),
}