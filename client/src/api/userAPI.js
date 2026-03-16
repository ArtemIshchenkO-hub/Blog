import { $host } from './http.js'

export const check = async () => {
  const { data } = await $host.get('/auth/health')
  return data
}

export const login = async (email, password) => {
  const { data } = await $host.post('/auth/login', { email, password })
  localStorage.setItem('accessToken', data.accessToken)
  return data
}

export const register = async (email, password) => {
  const { data } = await $host.post('/auth/registration', { email, password })
  localStorage.setItem('accessToken', data.accessToken)
  return data
}

export const logout = async () => {
  await $host.post('/auth/logout')
  localStorage.removeItem('accessToken')
}
