const Sequelize = require("sequelize");
const sequelize = require("../util/database");

const User = sequelize.define(
  "user",
  {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    email: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    isAdmin: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    },
    isProcuror: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    },
    isGrefier: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    },
    initial_login: {
      type: Sequelize.STRING,
      defaultValue: 1
    }
  },
  {
    charset: "utf8",
    collate: "utf8_unicode_ci",
  }
);

module.exports = User;
