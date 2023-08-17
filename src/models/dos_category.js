const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const DosCategory  = sequelize.define('doc_category', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        alowNull: false,
        primaryKey: true,
    },
    title: {
        type: Sequelize.STRING,
        alowNull: false,
    }
});

module.exports = DosCategory;