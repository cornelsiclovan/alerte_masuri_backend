const Sequelize = require("sequelize");
const sequelize = require("../util/database");

const Participare = sequelize.define(
  "participare",
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
    nr_part_sed: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    nr_part_cauze: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    nr_hot_vf: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    nr_part_sed_copil: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    nr_part_copil: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    nr_hot_vf_copil: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    tip_sedinta: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    data: {
      type: Sequelize.DATE,
      allowNull: false,
    },
    luna: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    an: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
  },
  {
    charset: "utf8",
    collate: "utf8_unicode_ci",
  }
);

module.exports = Participare;
