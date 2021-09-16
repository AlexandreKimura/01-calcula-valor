const supertest = require("supertest");

const request = supertest("http://localhost:3000");

test("Servidor na porta 3000", async () => {
  const response = await request.get("/");
  expect(response.status).toBe(200);
});
