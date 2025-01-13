const Sequelize = require("sequelize");
const sequelize = require("../util/database");

const Litera = sequelize.define("litere", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  nume: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  id_infractiune: {
    type: Sequelize.INTEGER,
    allowNull: true
  },
  id_alineat: {
    type: Sequelize.INTEGER,
    allowNull: true
  },
  descriere: {
    type: Sequelize.INTEGER,
    allowNull: true
  }
},{
  timestamps: false
},   {
  charset: "utf8",
  collate: "utf8_unicode_ci",
});

module.exports = Litera;
  