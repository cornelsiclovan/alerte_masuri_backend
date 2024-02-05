const Sequelize = require("sequelize");
const sequelize = require("../util/database");

const Incarcatura  = sequelize.define(
  "incarcatura",
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
    number_dos_cu_ac: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    number_dos_cu_an: {
        type: Sequelize.STRING,
        allowNull: false,
    },
  },
  {
    charset: "utf8",
    collate: "utf8_unicode_ci",
  }
);

module.exports = Incarcatura;