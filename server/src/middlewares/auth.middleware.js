import { AppError } from '../utils/AppError.js'

export function createAuthMiddleware(tokenService) {
  return function authMiddleware(req, res, next) {
    try {
      if (req.method === 'OPTIONS') {
        return next()
      }

      const authHeader = req.headers.authorization
      if (!authHeader) {
        return next(AppError.unauthorized())
      }

      const accessToken = authHeader.split(' ')[1]
      if (!accessToken) {
        return next(AppError.unauthorized())
      }

      const userData = tokenService.validateAccessToken(accessToken)
      if (!userData) {
        return next(AppError.unauthorized())
      }

      req.user = userData
      return next()
    } catch (error) {
      return next(AppError.unauthorized())
    }
  }
}
