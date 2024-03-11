const Sequelize = require("sequelize");
const sequelize = require("../util/database");

const Ordin = sequelize.define(
  "ordin",
  {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    numar: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    descriere: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    nume_fisier: {
      type: Sequelize.STRING,
      allowNullL: true,
    }
  },
  {
    charset: "utf8",
    collate: "utf8_unicode_ci",
  }
);

module.exports = Ordin;
