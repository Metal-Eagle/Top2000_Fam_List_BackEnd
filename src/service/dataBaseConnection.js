const Sequelize = require("sequelize");
const userSettings = {
  userName: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_DB,
  databaseHost: process.env.DATABASE_HOST,
};

let databaseSettings = {
  host: userSettings.databaseHost,
  dialect: "postgres",
  logging: false, //Remove if logging is usefull
};

if (process.env.NODE_ENV === "production") databaseSettings.logging = false;

module.exports = sequelize = new Sequelize(
  userSettings.database,
  userSettings.userName,
  userSettings.password,
  databaseSettings
);

sequelize
  .authenticate()
  .then(() => {
    console.log("Connection has been established successfully.");
  })
  .catch((err) => {
    console.error("Unable to connect to the database:", err);
  });
