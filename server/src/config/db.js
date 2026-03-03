import 'dotenv/config'
import { Sequelize } from 'sequelize'

const isProd = process.env.NODE_ENV === 'production'
const databaseUrl = process.env.DATABASE_URL

export const dbConfig = databaseUrl
  ? new Sequelize(databaseUrl, {
      dialect: 'postgres',
      logging: false,
      dialectOptions: {
        ssl: isProd ? { require: true, rejectUnauthorized: false } : undefined,
      },
    })
  : new Sequelize(
      process.env.DB_NAME,
      process.env.DB_USER,
      process.env.DB_PASSWORD,
      {
        host: process.env.DB_HOST,
        port: Number(process.env.DB_PORT || 5432),
        dialect: 'postgres',
        logging: false,
      },
    )
