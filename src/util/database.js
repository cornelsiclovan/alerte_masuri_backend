const Sequelize = require('sequelize');

const sequelize = new Sequelize("alert_ar_sech_cj", "root", "", {
    dialect: "mysql",
    host: "localhost"
});

module.exports = sequelize;