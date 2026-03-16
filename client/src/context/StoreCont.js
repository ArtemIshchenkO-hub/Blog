import { createContext } from 'react'
import RootStore from '../store/rootStore'

const rootStore = new RootStore()

export const StoreContext = createContext(rootStore)

export default rootStore
