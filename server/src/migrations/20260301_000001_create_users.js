export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable('Users', {
    id: {
      type: Sequelize.DataTypes.UUID,
      defaultValue: Sequelize.DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    email: {
      type: Sequelize.DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password_hash: {
      type: Sequelize.DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: Sequelize.DataTypes.STRING,
      allowNull: false,
      defaultValue: 'USER',
    },
    is_activated: {
      type: Sequelize.DataTypes.BOOLEAN,
      defaultValue: false,
    },
    createdAt: { type: Sequelize.DataTypes.DATE, allowNull: false },
    updatedAt: { type: Sequelize.DataTypes.DATE, allowNull: false },
  })

  await queryInterface.createTable('Tokens', {
    id: {
      type: Sequelize.DataTypes.UUID,
      defaultValue: Sequelize.DataTypes.UUIDV4,
      unique: true,
      primaryKey: true,
    },
    refresh_token: {
      type: Sequelize.DataTypes.STRING,
      allowNull: false,
    },
    expires_at: {
      type: Sequelize.DataTypes.DATE,
      allowNull: false,
    },
    user_id: {
      type: Sequelize.DataTypes.UUID,
      allowNull: false,
      references: { model: 'Users', key: 'id' },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
    createdAt: { type: Sequelize.DataTypes.DATE, allowNull: false },
    updatedAt: { type: Sequelize.DataTypes.DATE, allowNull: false },
  })
}

export async function down(queryInterface) {
  await queryInterface.dropTable('Tokens')
  await queryInterface.dropTable('Users')
}
