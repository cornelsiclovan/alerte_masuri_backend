const Sequelize = require("sequelize");
const sequelize = require("../util/database");

const Infractiuni = sequelize.define("infractiuni", {
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
  copil: {
    type: Sequelize.INTEGER,
    allowNull: true
  }
},{
  timestamps: false
},   {
  charset: "utf8",
  collate: "utf8_unicode_ci",
});

module.exports = Infractiuni;
  