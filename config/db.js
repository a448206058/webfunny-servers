const sequelizeTemp = require("./local_db");
const Sequelize = require("sequelize");
let db = null;
if (sequelizeTemp) {
  db = sequelizeTemp.sequelize;
} else {
  console.log(111);
  const sequelize = new Sequelize("monitor_db", "username", "password", {
    host: "ip",
    dialect: "mysql",
    operatorsAliases: false,
    dialectOptions: {
      charset: "utf8mb4",
      collate: "utf8mb4_unicode_ci",
      supportBigNumbers: true,
      bigNumberStrings: true,
    },

    pool: {
      max: 30,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
    timezone: "+08:00", //东八时区
  });

  db = sequelize;
}

module.exports = {
  sequelize: db,
};
