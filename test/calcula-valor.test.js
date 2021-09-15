const calculaValor = require("../src/calcula-valor");

describe("Calcular montante", () => {
  test("Com uma prestação, o montante é igual ao capital", () => {
    //Operação
    const montante = calculaValor.calcularMontante(100, 0.0175, 1);

    //Resultado ou comportamento esperado
    expect(montante).toBe(100);
  });

  test("Com 4 prestações, o montanto é acrescido de juros", () => {
    //Operação
    const montante = calculaValor.calcularMontante(500, 0.025, 4);

    //Resultado ou comportamento esperado
    expect(montante).toBe(538.45);
  });
});

describe("Arredondar", () => {
  test("Arredondar em duas casas decimais", () => {
    const resultado = calculaValor.arredondar(538.4453124999998);
    expect(resultado).toBe(538.45);
  });

  //Bug 1.005 -> Esperado: 1.01, 1.00
  test("1.005 deve retornar 1.01", () => {
    const resultado = calculaValor.arredondar(1.005);

    expect(resultado).toBe(1.01);
  });
});
