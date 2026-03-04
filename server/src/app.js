import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import router from './routes/index.js'
import {
  notFoundMiddleware,
  errorMiddleware,
} from './middlewares/error.middlewares.js'

const allowed = (process.env.CLIENT_URLS || '')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean)

export class App {
  constructor() {
    this.app = express()
    this.#initializeMiddlewares()
    this.#initializeRoutes()
    this.#initializeErrorHandlers()
  }

  #initializeMiddlewares() {
    this.app.use(express.json())
    this.app.use(
      cors({
        origin: (origin, cb) => {
          if (!origin) return cb(null, true)
          if (allowed.includes(origin)) return cb(null, true)
          return cb(new Error('Not allowed by CORS'))
        },
        credentials: true,
      }),
    )
    this.app.use(cookieParser())
  }

  #initializeRoutes() {
    this.app.use('/api', router)
  }

  #initializeErrorHandlers() {
    this.app.use(notFoundMiddleware)
    this.app.use(errorMiddleware)
  }
}
