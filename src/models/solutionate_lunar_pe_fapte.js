const Sequelize = require("sequelize");
const sequelize = require("../util/database");

const SolutionateLunarPeFapte = sequelize.define(
    "solutionate_lunar_pe_fapte",
    {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true,
        },
        numar_solutii: {
            type: Sequelize.INTEGER,
            allowNull: false,
        },
        an_solutie: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        luna_solutie: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        procurorId: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        nume_solutie: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        nume_pe_scurt_solutie: {
            type: Sequelize.STRING,
            allowNull: true,
        },
        fapta: {
            type: Sequelize.STRING,
            allowNull: true
        }
    },
    {
        charset: "utf8",
        collate: "utf8_unicode_ci",
    }
);

module.exports = SolutionateLunarPeFapte;