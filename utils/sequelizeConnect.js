const Sequelize = require('sequelize');
const mysqlDbConfig = require('../config/db.config');

const Op = Sequelize.Op;
const operatorsAliases = {
  $eq: Op.eq,
  $ne: Op.ne,
  $any: Op.any,
  $all: Op.all,
  $values: Op.values,
  $col: Op.col,
};

const sequelize = new Sequelize(
  mysqlDbConfig.DB,
  mysqlDbConfig.USER,
  mysqlDbConfig.PASSWORD,
  {
    dialect: mysqlDbConfig.dialect,
    host: mysqlDbConfig.HOST,
    port: parseInt(mysqlDbConfig.PORT),
    operatorsAliases,
    pool: {
      idle: 30000,
      min: 20,
      max: 30,
    },
  }
);

sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(error => {
    console.error('Unable to connect to the database: ', error);
  });

module.exports = sequelize;
