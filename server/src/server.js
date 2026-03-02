import 'dotenv/config'
import { App } from './app.js'
import './models/index.js'
import { dbConfig } from './config/db.js'

const appInstance = new App()
const PORT = process.env.PORT || 5000

const start = async () => {
  try {
    await dbConfig.authenticate()
    console.log('DB connected')

    appInstance.app.listen(PORT, () =>
      console.log(`Server started on Port: ${PORT}`),
    )
  } catch (error) {
    console.log(error)
  }
}

start()
