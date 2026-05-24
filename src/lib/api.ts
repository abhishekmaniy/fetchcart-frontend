import axios, {
  AxiosError,
  type AxiosInstance,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from 'axios'
import { refreshUser } from '@/api/auth.api'

const BASE_URL = import.meta.env.VITE_BACKEND_URL

if (!BASE_URL) {
  throw new Error('VITE_BACKEND_URL is missing in environment variables')
}

export type ApiErrorResponse = {
  message?: string
  error?: string
  errors?: Record<string, string[]>
}

type RetryAxiosRequestConfig = InternalAxiosRequestConfig & {
  _retry?: boolean
  _skipAuthRefresh?: boolean
}

const ACCESS_TOKEN_KEY = 'accessToken'

export const getAccessToken = () => localStorage.getItem(ACCESS_TOKEN_KEY)

export const setAccessToken = (token: string) => {
  localStorage.setItem(ACCESS_TOKEN_KEY, token)
}

export const removeAccessToken = () => {
  localStorage.removeItem(ACCESS_TOKEN_KEY)
}

export const api: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: false,
  timeout: 30_000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
})

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    config.headers['X-Requested-With'] = 'XMLHttpRequest'

    const accessToken = getAccessToken()

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`
    }

    return config
  },
  (error: AxiosError) => Promise.reject(error)
)

let refreshPromise: Promise<string> | null = null

const getFreshAccessToken = async () => {
  if (!refreshPromise) {
    refreshPromise = refreshUser()
      .then((data) => {
        if (!data.accessToken) {
          throw new Error('Refresh response missing access token')
        }

        setAccessToken(data.accessToken)
        return data.accessToken
      })
      .finally(() => {
        refreshPromise = null
      })
  }

  return refreshPromise
}

api.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError<ApiErrorResponse>) => {
    const originalRequest = error.config as RetryAxiosRequestConfig | undefined
    const status = error.response?.status

    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      'Something went wrong'

    if (!error.response) {
      window.dispatchEvent(
        new CustomEvent('network:offline', {
          detail: {
            message: 'Network error. Please check your internet connection.',
          },
        })
      )

      return Promise.reject(error)
    }

    if (
      status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      !originalRequest._skipAuthRefresh
    ) {
      originalRequest._retry = true

      try {
        const newAccessToken = await getFreshAccessToken()

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`

        return api(originalRequest)
      } catch (refreshError) {
        removeAccessToken()

        window.dispatchEvent(
          new CustomEvent('auth:unauthorized', {
            detail: {
              message: 'Session expired. Please login again.',
            },
          })
        )

        return Promise.reject(refreshError)
      }
    }

    if (status === 403) {
      window.dispatchEvent(
        new CustomEvent('auth:forbidden', {
          detail: { message },
        })
      )
    }

    return Promise.reject(error)
  }
)