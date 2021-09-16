const app = require("./app");

const db = require("./db");

db.sequelize.sync().then(async () => {
  await console.log("Conectado ao banco de dados!");
});

app.listen(3000, () => {
  console.log("API Started!");
});
