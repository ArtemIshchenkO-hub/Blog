import { makeAutoObservable } from 'mobx'
import {
  login as loginRequest,
  register as registerRequest,
  logout as logoutRequest,
} from '../api/userAPI'
import { getMe } from '../api/authAPI'

export default class UserStore {
  user = null
  isAuth = false
  authChecked = false
  loading = false
  error = null

  constructor(rootStore) {
    this.rootStore = rootStore
    makeAutoObservable(this, {}, { autoBind: true })
  }

  _startRequest() {
    this.clearError()
    this.setLoading(true)
  }

  _finishRequest() {
    this.setLoading(false)
  }

  _setRequestError(error) {
    const message =
      error?.response?.data?.message || error?.message || 'Помилка'
    this.setError(message)
  }

  async _fetchAndSetMe() {
    const me = await getMe()
    this.setUser(me)
    return me
  }

  async _auth(request) {
    this._startRequest()

    try {
      await request()
      return await this._fetchAndSetMe()
    } catch (error) {
      this._setRequestError(error)
      throw error
    } finally {
      this._finishRequest()
    }
  }

  setUser(user) {
    this.user = user
    this.isAuth = !!user
  }

  setLoading(value) {
    this.loading = value
  }

  setError(message) {
    this.error = message
  }

  clearError() {
    this.error = null
  }

  setAuthChecked(value) {
    this.authChecked = value
  }

  async login(email, password) {
    return this._auth(() => loginRequest(email, password))
  }

  async register(email, password) {
    return this._auth(() => registerRequest(email, password))
  }

  async checkAuth() {
    this._startRequest()

    try {
      const token = localStorage.getItem('accessToken')

      if (!token) {
        this.setUser(null)
        return null
      }

      return await this._fetchAndSetMe()
    } catch (error) {
      localStorage.removeItem('accessToken')
      this.setUser(null)
      return null
    } finally {
      this._finishRequest()
      this.setAuthChecked(true)
    }
  }

  async logout() {
    this._startRequest()

    try {
      await logoutRequest()
    } catch (error) {
      this._setRequestError(error)
      throw error
    } finally {
      localStorage.removeItem('accessToken')
      this.setUser(null)
      this._finishRequest()
    }
  }
}
