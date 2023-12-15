const Sequelize = require("sequelize");
const sequelize = require("../util/database");

const Dosar = sequelize.define(
  "dosar",
  {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    numar: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    isArest: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },
    isControlJudiciar: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },
    isSechestru: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },
    data: {
      type: Sequelize.DATE,
      allowNull: true,
    },
    data_arest: {
      type: Sequelize.DATE,
      allowNull: true,
    },
    data_cj: {
      type: Sequelize.DATE,
      allowNull: true,
      defaultValue: null,
    },
    data_sechestru: {
      type: Sequelize.DATE,
      allowNull: true,
      defaultValue: null,
    },
    procurorId: {
      type: Sequelize.INTEGER,
      allowNull: true,
      defaultValue: null,
    },
    este_solutionat: {
      type: Sequelize.INTEGER,
      defaultValue: 0,
    },
    isInterceptari: {
      type: Sequelize.BOOLEAN,
      allowNull: true,
      defaultValue: false,
    },
    data_interceptari: {
      type: Sequelize.DATE,
      allowNull: true,
    },
    tip_solutie: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    tip_solutie_propusa: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    days_remaining: {
      type: Sequelize.INTEGER,
      allowNull: true,
    },
    data_inceperii_la_procuror: {
      type: Sequelize.DATE,
      allowNull: true,
    },
    data_primei_sesizari: {
      type: Sequelize.DATE,
      allowNull: true,
    },
    prima_institutie_sesizata: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    institutia_curenta: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    data_solutie_reala: {
      type: Sequelize.DATE,
      allowNull: true,
    },
    parte: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    trimis_masura_la_instanta: 
    { 
      type: Sequelize.INTEGER, 
      allowNull: true 
    },
  },
  {
    charset: "utf8",
    collate: "utf8_unicode_ci",
  }
);

module.exports = Dosar;
