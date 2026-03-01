import { User } from '../models/User.js'
import { AppError } from '../utils/AppError.js'
import bcrypt from 'bcrypt'
import { UserDto } from '../dtos/user.dto.js'

export class AuthService {
  constructor(tokenService) {
    this.tokenService = tokenService
  }

  _expiresAt() {
    return new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
  }

  _buildPayload(user) {
    return { id: user.id, email: user.email, role: user.role }
  }

  async _issueTokensForUser(user) {
    const payload = this._buildPayload(user)
    const tokens = this.tokenService.generateTokens(payload)

    await this.tokenService.saveRefreshToken(
      user.id,
      tokens.refreshToken,
      this._expiresAt(),
    )

    return tokens
  }

  async register(email, password) {
    const existed = await User.findOne({ where: { email } })
    if (existed) throw AppError.badRequest('Користувач вже існує')

    const passwordHash = await bcrypt.hash(password, 7)
    const user = await User.create({ email, password_hash: passwordHash })

    const tokens = await this._issueTokensForUser(user)
    return { user: new UserDto(user), ...tokens }
  }

  async login(email, password) {
    const user = await User.findOne({ where: { email } })
    if (!user) throw AppError.badRequest('Невірний email або пароль')

    const ok = await bcrypt.compare(password, user.password_hash)
    if (!ok) throw AppError.badRequest('Невірний email або пароль')

    const tokens = await this._issueTokensForUser(user)
    return { user: new UserDto(user), ...tokens }
  }

  async refresh(refreshToken) {
    if (!refreshToken) throw AppError.unauthorized()

    const payload = this.tokenService.validateRefreshToken(refreshToken)
    if (!payload) throw AppError.unauthorized()

    const tokenRow = await this.tokenService.hasRefreshToken(refreshToken)
    if (!tokenRow) throw AppError.unauthorized()

    await this.tokenService.removeRefreshToken(refreshToken)

    const user = await User.findOne({ where: { id: payload.id } })
    if (!user) throw AppError.unauthorized()

    const tokens = await this._issueTokensForUser(user)
    return { user: new UserDto(user), ...tokens }
  }

  async logout(refreshToken) {
    if (!refreshToken) return
    await this.tokenService.removeRefreshToken(refreshToken)
  }
}
