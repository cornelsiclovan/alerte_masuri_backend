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
    adresa: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    tara: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    judet: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    localitate: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    strada: {
      type:Sequelize.STRING,
      allowNull: true,
    },
    sector: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    numar: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    bloc: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    scara: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    etaj: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    apartament: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    cnp: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    numar2: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    serie_buletin: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    numar_buletin: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    tata: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    mama: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    data_nasterii: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    locul_nasterii: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    stare_civila: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    studii: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    ocupatie: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    judet_nastere: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    minor: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    calitate: {
      type: Sequelize.STRING,
      allowNull: true
    }
  },
  {
    charset: "utf8",
    collate: "utf8_unicode_ci",
  }
);

module.exports = Part;
