const Sequelize = require("sequelize");
const sequelize = require("../util/database");

const Indrumator = sequelize.define("indrumator", {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    id_dosar: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    termen: {
        type: Sequelize.DATEONLY,
        allowNull: false
    },
    finalizata: {
        type: Sequelize.INTEGER,
        allowNull: true
    }
})

module.exports = Indrumator;