const { distanciaKm } = require('./distancia');

test('calcula a distância em km a partir de dois endereços', async () => {
  global.fetch = jest
    .fn()
    .mockResolvedValueOnce({ ok: true, json: async () => [{ lat: '-22.90', lon: '-43.20' }] })
    .mockResolvedValueOnce({ ok: true, json: async () => [{ lat: '-22.95', lon: '-43.25' }] })
    .mockResolvedValueOnce({
      ok: true,
      json: async () => ({ code: 'Ok', routes: [{ distance: 12345 }] }),
    });

  const km = await distanciaKm('Rua A, Rio', 'Rua B, Rio', 0);

  expect(km).toBeCloseTo(12.345, 3);
  expect(global.fetch).toHaveBeenCalledTimes(3);
});

test('avisa quando o endereço não é encontrado', async () => {
  global.fetch = jest.fn().mockResolvedValue({ ok: true, json: async () => [] });

  await expect(distanciaKm('x', 'y', 0)).rejects.toThrow('não encontrado');
});