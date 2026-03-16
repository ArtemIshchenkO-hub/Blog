import { $authHost } from './http.js'

export const getMe = async () => {
  const { data } = await $authHost.get('/auth/me')
  return data
}
