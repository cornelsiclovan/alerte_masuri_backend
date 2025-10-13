const Sequelize = require("sequelize");
const sequelize = require("../util/database");

const Stats = sequelize.define(
  "stat",
  {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    month: {
        type: Sequelize.INTEGER,
        allowNull: true,
    },
    user_id: {
      type: Sequelize.INTEGER,
      allowNull: true,
    },
    login_count: {
      type: Sequelize.INTEGER,
      allowNull: true,
    },
    file_count: {
        type: Sequelize.INTEGER,
        allowNull: true
    },
    note_indrumare_count: {
        type: Sequelize.INTEGER,
        allowNull: true
    },
    year: {
        type: Sequelize.INTEGER,
        allowNull: true
    }
  },
  {
    charset: "utf8",
    collate: "utf8_unicode_ci",
  }
);

module.exports = Stats;