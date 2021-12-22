const mysql = require('mysql2/promise');

// call for port
const { dbHost, dbName, dbUser, dbPassWord } = require('../config');

const pool = mysql.createPool({
  host: dbHost,
  database: dbName,
  user: dbUser,
  password: dbPassWord,
});

module.exports = pool;
