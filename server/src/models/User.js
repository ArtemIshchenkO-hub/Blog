import { dbConfig } from '../config/db.js'
import { DataTypes } from 'sequelize'

export const User = dbConfig.define('User', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    unique: true,
    primaryKey: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password_hash: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  role: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'USER',
  },
  is_activated: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
})
