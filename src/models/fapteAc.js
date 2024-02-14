const Sequelize = require("sequelize");
const sequelize = require("../util/database");

const DoingAc = sequelize.define(
  "doingAc",
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
    nume_infractiune: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    data_savarsirii: {
      type: Sequelize.DATE,
      allowNullL: true,
    },
    nume_temei: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    situatie: {
      type: Sequelize.STRING,
      allowNull: true
    }
  },
  {
    charset: "utf8",
    collate: "utf8_unicode_ci",
  }
);

module.exports = DoingAc;