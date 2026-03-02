import 'dotenv/config'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { Umzug, SequelizeStorage } from 'umzug'
import { Sequelize } from 'sequelize'
import { dbConfig as sequelize } from './config/db.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const migrationsDir = path.join(__dirname, 'migrations')

const umzug = new Umzug({
  migrations: {
    glob: ['*.js', { cwd: migrationsDir }],
    resolve: ({ name, path: migrationPath, context }) => {
      const fullPath = path.isAbsolute(migrationPath)
        ? migrationPath
        : path.join(migrationsDir, migrationPath)

      const url = pathToFileURL(fullPath).href

      return {
        name,
        up: async () => {
          const mod = await import(url)
          return mod.up(context, Sequelize)
        },
        down: async () => {
          const mod = await import(url)
          return mod.down(context, Sequelize)
        },
      }
    },
  },
  context: sequelize.getQueryInterface(),
  storage: new SequelizeStorage({ sequelize }),
  logger: console,
})

const cmd = process.argv[2]

try {
  if (cmd === 'up') {
    await umzug.up()
    console.log('✅ Migrations applied')
  } else if (cmd === 'down') {
    await umzug.down()
    console.log('✅ Last migration reverted')
  } else if (cmd === 'pending') {
    const list = await umzug.pending()
    console.log(list.map((m) => m.name))
  } else if (cmd === 'executed') {
    const list = await umzug.executed()
    console.log(list.map((m) => m.name))
  } else {
    console.log('Usage: node src/migrator.js <up|down|pending|executed>')
    process.exitCode = 1
  }
} finally {
  await sequelize.close()
}
