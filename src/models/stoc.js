const Sequelize = require("sequelize");
const sequelize = require("../util/database");

const Stoc = sequelize.define(
  "stoc",
  {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    in_lucru: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    inregistrate_an_curent: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    solutionate_an_curent: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  },
  {
    charset: "utf8",
    collate: "utf8_unicode_ci",
  }
);

module.exports = Stoc;