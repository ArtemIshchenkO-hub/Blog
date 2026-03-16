import axios from 'axios'

export const $host = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  withCredentials: true,
})

export const $authHost = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  withCredentials: true,
})

const authInterceptor = (config) => {
  const token = localStorage.getItem('accessToken')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
}

$authHost.interceptors.request.use(authInterceptor)
