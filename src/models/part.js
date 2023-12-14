const Sequelize = require("sequelize");
const sequelize = require("../util/database");

const Part = sequelize.define(
  "part",
  {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    numar_dosar: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    nume: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    ordine: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    tip_solutie_propusa: {
      type: Sequelize.STRING,
      allowNull: true,
    },
  },
  {
    charset: "utf8",
    collate: "utf8_unicode_ci",
  }
);

module.exports = Part;
