const Sequelize = require("sequelize");
const sequelize = require("../util/database");

const File = sequelize.define(
  "File",
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
    tip_document: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    procuror: {
      type: Sequelize.STRING,
      allowNull: true,
    },
  },
  {
    charset: "utf8",
    collate: "utf8_unicode_ci",
  }
);

module.exports = File;
