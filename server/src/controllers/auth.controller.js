import { AppError } from '../utils/AppError.js'

export class AuthController {
  constructor(authService) {
    this.authService = authService

    this.register = this.register.bind(this)
    this.login = this.login.bind(this)
    this.refresh = this.refresh.bind(this)
    this.logout = this.logout.bind(this)
  }

  _setRefreshCookie(res, refreshToken) {
    const isProd = process.env.NODE_ENV === 'production'

    res.cookie('refreshToken', refreshToken, {
      maxAge: 30 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      sameSite: isProd ? 'none' : 'lax',
      secure: isProd,
    })
  }

  async register(req, res, next) {
    try {
      const { email, password } = req.body
      const userData = await this.authService.register(email, password)

      this._setRefreshCookie(res, userData.refreshToken)
      return res
        .status(200)
        .json({ email: userData.email, accessToken: userData.accessToken })
    } catch (error) {
      return next(error)
    }
  }

  async login(req, res, next) {
    try {
      const { email, password } = req.body
      const userData = await this.authService.login(email, password)
      this._setRefreshCookie(res, userData.refreshToken)
      return res
        .status(200)
        .json({ email: userData.email, accessToken: userData.accessToken })
    } catch (error) {
      return next(error)
    }
  }

  async refresh(req, res, next) {
    try {
      const refreshToken = req.cookies?.refreshToken
      if (!refreshToken) {
        throw AppError.unauthorized()
      }
      const userData = await this.authService.refresh(refreshToken)
      this._setRefreshCookie(res, userData.refreshToken)
      return res
        .status(200)
        .json({ email: userData.email, accessToken: userData.accessToken })
    } catch (error) {
      return next(error)
    }
  }

  async logout(req, res, next) {
    try {
      const refreshToken = req.cookies?.refreshToken
      await this.authService.logout(refreshToken)

      const isProd = process.env.NODE_ENV === 'production'

      res.clearCookie('refreshToken', {
        httpOnly: true,
        sameSite: isProd ? 'none' : 'lax',
        secure: isProd,
      })

      return res.json({ ok: true })
    } catch (error) {
      return next(error)
    }
  }
}
