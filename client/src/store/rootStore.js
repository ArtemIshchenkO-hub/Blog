import UserStore from './userStore'
import UiStore from './uiStore'

export default class RootStore {
  constructor() {
    this.userStore = new UserStore(this)
    this.uiStore = new UiStore(this)
  }
}
