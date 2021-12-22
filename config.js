// require('dotenv').config();
// const dotenv = require('dotenv').config();
// dotenv.config();

module.exports = {
  dbHost: process.env.DB_HOST,
  dbName: process.env.DB_NAME,
  dbUser: process.env.DB_USER,
  dbPassWord: process.env.DB_PASSWORD,
  port: process.env.PORT,
};
