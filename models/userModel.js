const userSchema = (sequelize, Sequelize) => {
  const User = sequelize.define(
    "User",
    {
      _id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      username: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      details: { type: Sequelize.JSON },
    },
    { timestamps: true }
  );

  return User;
};

module.exports = userSchema;
