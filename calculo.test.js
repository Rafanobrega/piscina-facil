const { calcularPreco } = require('./calculo');

test('10 km, gasolina R$ 5,20, piscina de 20000 L', () => {
  // deslocamento: (20/10)*5.2*1.5 = 15.6 | serviço: 80 + 20*5 = 180
  // total: (15.6 + 180) * 1.2 = 234.72
  expect(calcularPreco(10, 5.2, 20000)).toBeCloseTo(234.72, 2);
});

test('0 km, piscina de 5000 L cobra só o serviço', () => {
  // (0 + 80 + 25) * 1.2 = 126
  expect(calcularPreco(0, 6, 5000)).toBeCloseTo(126, 2);
});

test('nunca cobra menos que o valor mínimo', () => {
  expect(calcularPreco(0, 6, 0)).toBeCloseTo(100, 2);
});

test('distância maior deixa o preço maior', () => {
  expect(calcularPreco(30, 6, 10000)).toBeGreaterThan(calcularPreco(5, 6, 10000));
});

test('gasolina mais cara deixa o preço maior', () => {
  expect(calcularPreco(20, 8, 10000)).toBeGreaterThan(calcularPreco(20, 5, 10000));
});

test('piscina maior deixa o preço maior', () => {
  expect(calcularPreco(10, 6, 40000)).toBeGreaterThan(calcularPreco(10, 6, 10000));
});