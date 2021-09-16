const calculaValor = require("./calcula-valor");

const db = require("./db");

const juros = 0.025;

const consultar = async (nome, cpf, valor, parcelas) => {
  let cliente = await db.cliente.findOne({
    where: { cpf },
  });

  if (cliente === null) {
    cliente = await db.cliente.create({
      nome,
      cpf,
    });
  }

  const ultimaConsulta = await db.consulta.findOne({
    where: { ClienteCpf: cpf },
    order: [[db.sequelize.col("createdAt"), "DESC"]],
  });

  if (ultimaConsulta) {
    const diferenca = Math.abs(
      ultimaConsulta.createdAt.getTime() - new Date().getTime()
    );
    const diferencaDias = Math.round(diferenca / (1000 * 60 * 60 * 24));

    if (diferencaDias <= 30) {
      throw new Error(`última consulta realizada há ${diferencaDias} dias`);
    }
  }

  const montante = calculaValor.calcularMontante(valor, juros, parcelas);
  const prestacoes = calculaValor.calcularPrestacoes(montante, parcelas);

  const novaConsulta = {
    valor,
    numPrestacoes: parcelas,
    juros,
    prestacoes: prestacoes.join(", "),
    ClienteCpf: cliente.cpf,
    montante,
  };

  await db.consulta.create(novaConsulta);

  return {
    montante: montante,
    juros: juros,
    parcelas: prestacoes.length,
    primeiraPrestacao: prestacoes[0],
    prestacoes: prestacoes,
  };
};

module.exports = {
  consultar,
};
