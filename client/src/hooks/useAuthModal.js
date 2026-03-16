import { useStore } from './useStore'

export const useAuthModal = () => {
  const { uiStore } = useStore()
  return uiStore
}
