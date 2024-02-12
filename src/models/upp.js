const Sequelize = require("sequelize");
const sequelize = require("../util/database");

const Upp = sequelize.define(
  "upp",
  {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    id_procuror: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    upp: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  },
  {
    charset: "utf8",
    collate: "utf8_unicode_ci",
  }
);

module.exports = Upp;
