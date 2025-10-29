const Sequelize = require("sequelize");
const dotenv = require("dotenv");
dotenv.config();
//test
const sequelize = new Sequelize(
  "alert_ar_sech_cj",
  "root",
  process.env.MYSQL_PASSWORD,    
  { 
    dialect: "mysql",
    host: "localhost",
    timezone: "+00:00",
    logging: false
  },
  {
    charset: "utf8",
    collate: "utf8_unicode_ci",
  },  
);

module.exports = sequelize;
