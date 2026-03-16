import { useContext } from 'react'
import { StoreContext } from '../context/StoreCont'

export const useStore = () => {
  const store = useContext(StoreContext)

  if (!store) {
    throw new Error('useStore must be used within StoreContext.Provider')
  }

  return store
}
