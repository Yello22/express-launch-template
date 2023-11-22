const mongoose = require("mongoose");
const dotenv = require("dotenv");
const config = require("./config/globalConfig");
const Sequelize = require("sequelize")
const mysqlDbConfig = require('./config/db.config')


process.on("uncaughtException", (err) => {
  console.log("UNCAUGHT EXCEPTION! 💥 Shutting down...");
  console.log(err.name, err.message);
  process.exit(1);
});

dotenv.config({ path: ".env" });

const app = require("./app");

const DB = `mongodb://${config.MONGO_USER}:${config.MONGO_PASSWORD}@${config.MONGO_IP}:${config.MONGO_PORT}/?authSource=admin`;

const connectWithRetry = () => {
  mongoose
    .connect(DB)
    .then(() => console.log("DB connection successful!"))
    .catch((err) => {
      console.log(err);
      setTimeout(connectWithRetry, 5000);
    });
};

connectWithRetry();

const sequelize = new Sequelize(
  mysqlDbConfig.DB,
  mysqlDbConfig.USER,
  mysqlDbConfig.PASSWORD,
  {
    dialect: mysqlDbConfig.dialect,
    host: mysqlDbConfig.HOST,
    port: parseInt(mysqlDbConfig.PORT),
    operationsAliases: false,
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

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

process.on("unhandledRejection", (err) => {
  console.log("UNHANDLED REJECTION! 💥 Shutting down...");
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});

process.on("SIGTERM", () => {
  console.log("👋 SIGTERM RECEIVED. Shutting down gracefully");
  server.close(() => {
    console.log("💥 Process terminated!");
  });
});
