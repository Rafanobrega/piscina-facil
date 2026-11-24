const { calcularPreco } = require('./calculo');

test('10 km, gasolina R$ 6, piscina de 10000 L', () => {
  // deslocamento: (10*2/10)*6 = 12  |  limpeza: 10000*0.02 = 200
  expect(calcularPreco(10, 6, 10000)).toBeCloseTo(212, 2);
});

test('com 0 km cobra só a limpeza', () => {
  expect(calcularPreco(0, 6, 5000)).toBeCloseTo(100, 2);
});

test('distância maior deixa o preço maior', () => {
  const perto = calcularPreco(5, 6, 10000);
  const longe = calcularPreco(30, 6, 10000);
  expect(longe).toBeGreaterThan(perto);
});