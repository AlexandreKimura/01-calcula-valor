const Sequelize = require("sequelize");

const sequelize = new Sequelize({
  dialect: "postgres",
  host: "localhost",
  port: "49153",
  database: "consulta_credito",
  username: "postgres",
  password: "igti",
  logging: false,
});

const clientModel = (sequelize, DataTypes) => {
  const Cliente = sequelize.define("Cliente", {
    cpf: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
      unique: true,
    },
    nome: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  });

  return Cliente;
};

const consultaModel = (sequelize, DataTypes) => {
  const Consulta = sequelize.define("Consulta", {
    valor: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
    numPrestacoes: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    juros: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
    montante: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
    prestacoes: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });

  return Consulta;
};

const cliente = clientModel(sequelize, Sequelize.DataTypes);
const consulta = consultaModel(sequelize, Sequelize.DataTypes);

cliente.hasMany(consulta, { as: "Consultas" });
consulta.belongsTo(cliente);

module.exports = {
  cliente,
  consulta,
  sequelize,
};
