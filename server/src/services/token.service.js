import jwt from 'jsonwebtoken'
import { Token } from '../models/Token.js'

export class TokenService {
  generateTokens(payload) {
    const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {
      expiresIn: process.env.JWT_ACCESS_EXPIRES || '15m',
    })

    const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
      expiresIn: process.env.JWT_REFRESH_EXPIRES || '30d',
    })

    return { accessToken, refreshToken }
  }

  validateAccessToken(token) {
    try {
      const userData = jwt.verify(token, process.env.JWT_ACCESS_SECRET)
      return userData
    } catch (error) {
      return null
    }
  }

  validateRefreshToken(token) {
    try {
      const userData = jwt.verify(token, process.env.JWT_REFRESH_SECRET)
      return userData
    } catch (error) {
      return null
    }
  }

  async saveRefreshToken(userId, refreshToken, expiresAt) {
    return Token.create({
      user_id: userId,
      refresh_token: refreshToken,
      expires_at: expiresAt,
    })
  }

  async hasRefreshToken(refreshToken) {
    const tokenData = await Token.findOne({
      where: { refresh_token: refreshToken },
    })
    return tokenData
  }

  async removeRefreshToken(refreshToken) {
    const tokenData = await Token.destroy({
      where: { refresh_token: refreshToken },
    })
    return tokenData
  }
}
