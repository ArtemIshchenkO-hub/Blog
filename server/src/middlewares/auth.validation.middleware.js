import { validationResult } from 'express-validator'
import { AppError } from '../utils/AppError.js'

export const makeValidator = (rules) => [
  ...rules,
  (req, _res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return next(AppError.badRequest('Не валідні данні', errors.array()))
    }
    return next()
  },
]
