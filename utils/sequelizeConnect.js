const Sequelize = require("sequelize")
const mysqlDbConfig = require('../config/db.config')

const sequelize = new Sequelize(
    mysqlDbConfig.DB,
    mysqlDbConfig.USER,
    mysqlDbConfig.PASSWORD,
    {
        dialect: mysqlDbConfig.dialect,
        host: mysqlDbConfig.HOST,
        port: parseInt(mysqlDbConfig.PORT),
        operatorsAliases: 0,
        pool: {
            max: mysqlDbConfig.pool.max,
            min: mysqlDbConfig.pool.min,
            acquire: mysqlDbConfig.pool.acquire,
            idle: mysqlDbConfig.pool.idle
        }
    }
)

sequelize.authenticate().then(() => {
    console.log('Connection has been established successfully.');
}).catch((error) => {
    console.error('Unable to connect to the database: ', error)
})

module.exports = sequelize