import { body } from 'express-validator'

export const authValidator = [
  body('email')
    .notEmpty()
    .withMessage('Email обовʼязковий')
    .isEmail()
    .withMessage('Некоректний email')
    .toLowerCase(),
  body('password')
    .notEmpty()
    .withMessage('Пароль обовʼязковий')
    .isLength({ min: 6 })
    .withMessage('Пароль мінімум 6 символів'),
]
