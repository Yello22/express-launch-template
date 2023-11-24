const dotenv = require('dotenv');

dotenv.config({ path: '.env' });

const config = {
  HOST: process.env.MYSQL_DB_HOST,
  USER: process.env.MYSQL_DB_USER,
  PORT: process.env.MYSQL_DB_PORT,
  PASSWORD: process.env.MYSQL_DB_PASSWORD,
  DB: process.env.MYSQL_DB_NAME,
  dialect: 'mysql',
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
};

module.exports = config;
