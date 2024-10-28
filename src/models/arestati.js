const Sequelize = require("sequelize");
const sequelize = require("../util/database");

const Arestat = sequelize.define(
  "arestat",
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
    nume_parte: {
      type: Sequelize.STRING,
      allowNullL: true,
    },
    data: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    durata: {
      type: Sequelize.STRING,
      allowNull: true
    },
    isCj: {
        type: Sequelize.INTEGER,
        allowNull: true
    }
  },
  {
    charset: "utf8",
    collate: "utf8_unicode_ci",
  }
);

module.exports = Arestat;
