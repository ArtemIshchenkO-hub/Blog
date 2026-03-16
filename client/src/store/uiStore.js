import { makeAutoObservable } from 'mobx'

export default class UiStore {
  isAuthModalOpen = false
  authMode = 'login'

  constructor(rootStore) {
    this.rootStore = rootStore
    makeAutoObservable(this, {}, { autoBind: true })
  }

  openAuthModal(mode = 'login') {
    this.setAuthMode(mode)
    this.isAuthModalOpen = true
  }

  openLogin() {
    this.openAuthModal('login')
  }

  openRegister() {
    this.openAuthModal('register')
  }

  closeAuthModal() {
    this.isAuthModalOpen = false
  }

  setAuthMode(mode) {
    this.authMode = mode === 'register' ? 'register' : 'login'
  }
}
