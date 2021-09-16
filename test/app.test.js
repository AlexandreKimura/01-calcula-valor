const request = require("supertest");
const app = require("../src/app");
const db = require("../src/db");

describe("Testes de Integração", () => {
  beforeEach(async () => {
    await db.cliente.destroy({ where: {} });
    await db.consulta.destroy({ where: {} });
  });

  afterAll(async () => await db.sequelize.close());

  const clienteAlexandre = {
    nome: "Alexandre Fukano",
    cpf: "000.000.000-00",
  };

  const resultadoEsperado = {
    montante: 106.9,
    juros: 0.025,
    parcelas: 3,
    primeiraPrestacao: 35.64,
    prestacoes: [35.64, 35.63, 35.63],
  };

  const payloadRequest = {
    nome: clienteAlexandre.nome,
    cpf: clienteAlexandre.cpf,
    valor: 101.75,
    parcelas: 3,
  };

  describe("Testes", () => {
    test("Responder http 200 na raiz", async () => {
      return request(app)
        .get("/")
        .then((res) => expect(res.status).toBe(200));
    });

    test("Responder http 200 na raiz", async () => {
      const res = await request(app).get("/");
      expect(res.status).toBe(200);
    });

    test("Cenário 1", async () => {
      const res = await request(app)
        .post("/consulta-credito")
        .send(payloadRequest);

      //Resultado é obtido com sucesso
      expect(res.body.erro).toBeUndefined();
      expect(res.body.montante).toBe(106.9);
      expect(res.status).toBe(201);
      expect(res.body).toMatchSnapshot(resultadoEsperado);
      expect(res.body).toMatchObject(resultadoEsperado);

      //Cliente foi armazenado
      const cliente = await db.cliente.findOne({
        where: { cpf: clienteAlexandre.cpf },
      });

      expect(cliente.cpf).toBe(clienteAlexandre.cpf);

      const consulta = await db.consulta.findOne({
        where: { ClienteCpf: clienteAlexandre.cpf },
      });

      expect(consulta.valor).toBe(101.75);
    });

    test("Cenário 2", async () => {
      db.cliente.create(clienteAlexandre);
      db.consulta.create({
        valor: 1,
        numPrestacoes: 2,
        juros: 0.5,
        prestacoes: "1, 1",
        ClienteCpf: clienteAlexandre.cpf,
        montante: 2,
        createdAt: "2020-09-16 01:27:01-07",
      });

      const res = await request(app)
        .post("/consulta-credito")
        .send(payloadRequest);

      expect(res.body).toMatchSnapshot(resultadoEsperado);
      expect(res.status).toBe(201);

      const count = await db.consulta.count({
        where: { ClienteCpf: clienteAlexandre.cpf },
      });
      expect(count).toBe(2);
    });

    test("Cenário 3", async () => {
      const res1 = await request(app)
        .post("/consulta-credito")
        .send(payloadRequest);

      expect(res1.body).toMatchSnapshot(resultadoEsperado);

      const res2 = await request(app)
        .post("/consulta-credito")
        .send(payloadRequest);

      expect(res2.body.erro).toBeDefined();
      expect(res2.status).toBe(405);
    });

    test("Cenário 4", async () => {
      const res = await request(app).post("/consulta-credito").send({});
      expect(res.body.erro).toBeDefined();
      expect(res.status).toBe(400);
    });
  });
});
