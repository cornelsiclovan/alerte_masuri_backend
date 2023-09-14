const Sequelize = require("sequelize");

const sequelize = new Sequelize("alert_ar_sech_cj", "root", "", 
{
  dialect: "mysql",
  host: "localhost",
  timezone: '+00:00',
}, {
  charset: 'utf8',
  collate: 'utf8_unicode_ci'
}

);



module.exports = sequelize;
