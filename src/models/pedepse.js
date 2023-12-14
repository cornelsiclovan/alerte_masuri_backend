const Sequelize = require("sequelize");
const sequelize = require("../util/database");

const Pedepse = sequelize.define(
  "pedepse",
  {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    id_infractiune: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    nume: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    alineat: {
      type: Sequelize.INTEGER,
      allowNull: true,
    },
    nume_pe_scurt: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  },
  {
    timestamps: false,
  },
  {
    charset: "utf8",
    collate: "utf8_unicode_ci",
  }
);

module.exports = Pedepse;
