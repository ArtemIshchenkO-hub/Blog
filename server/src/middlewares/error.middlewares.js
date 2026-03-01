import { AppError } from '../utils/AppError.js'

export function errorMiddleware(err, _req, res, next) {
  if (res.headersSent) return next(err)
  if (err instanceof AppError) {
    return res
      .status(err.status)
      .json({ message: err.message, errors: err.errors })
  }

  return res.status(500).json({ message: 'Непередбачувана помилка' })
}

export function notFoundMiddleware(_req, _res, next) {
  return next(AppError.notFound('Сторінку не знайдено'))
}
