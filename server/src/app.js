import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import router from './routes/index.js'
import {
  notFoundMiddleware,
  errorMiddleware,
} from './middlewares/error.middlewares.js'

export class App {
  constructor() {
    this.app = express()
    this.#initializeMiddlewares()
    this.#initializeRoutes()
    this.#initializeErrorHandlers()
  }

  #initializeMiddlewares() {
    this.app.use(express.json())
    this.app.use(cors({ origin: process.env.API_URL, credentials: true }))
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
