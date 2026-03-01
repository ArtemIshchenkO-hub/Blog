import { Router } from 'express'
import { AuthController } from '../controllers/auth.controller.js'
import { makeValidator } from '../middlewares/auth.validation.middleware.js'
import { authValidator } from '../utils/validators/auth.validators.js'
import { AuthService } from '../services/auth.service.js'
import { TokenService } from '../services/token.service.js'
import { createAuthMiddleware } from '../middlewares/auth.middleware.js'

const tokens = new TokenService()
const service = new AuthService(tokens)
const controller = new AuthController(service)
const authMiddleware = createAuthMiddleware(tokens)

const router = new Router()

router.post(
  '/registration',
  ...makeValidator(authValidator),
  controller.register,
)
router.post('/login', ...makeValidator(authValidator), controller.login)
router.post('/refresh', controller.refresh)
router.post('/logout', controller.logout)

router.get('/me', authMiddleware, (req, res) => {
  res.json(req.user)
})

export default router
