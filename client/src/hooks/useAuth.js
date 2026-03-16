import { useStore } from './useStore'

export const useAuth = () => {
  const { userStore } = useStore()
  return userStore
}
