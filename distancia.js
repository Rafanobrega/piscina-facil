const NOMINATIM = 'https://nominatim.openstreetmap.org/search';
const OSRM = 'https://router.project-osrm.org/route/v1/driving';

// Transforma um endereço em coordenadas (latitude e longitude)
async function geocodificar(endereco, rotulo) {
  const url =
    NOMINATIM +
    '?format=json&limit=1&countrycodes=br&q=' +
    encodeURIComponent(endereco);

  const resp = await fetch(url, {
    headers: {
      Accept: 'application/json',
      'User-Agent': 'PiscinaFacil-trabalho-faculdade',
    },
  });
  if (!resp.ok) throw new Error('Falha ao buscar o endereço.');

  const dados = await resp.json();
  if (!dados || dados.length === 0) throw new Error(rotulo + ' não encontrado.');

  return { lat: parseFloat(dados[0].lat), lon: parseFloat(dados[0].lon) };
}

// Distância de carro, em km, entre dois endereços (só ida)
async function distanciaKm(origem, destino, pausaMs = 1100) {
  const a = await geocodificar(origem, 'Seu endereço base');
  if (pausaMs > 0) await new Promise((r) => setTimeout(r, pausaMs)); // limite de 1 consulta/s
  const b = await geocodificar(destino, 'Endereço do cliente');

  const url =
    OSRM + '/' + a.lon + ',' + a.lat + ';' + b.lon + ',' + b.lat + '?overview=false';
  const resp = await fetch(url);
  if (!resp.ok) throw new Error('Falha ao calcular a rota.');

  const dados = await resp.json();
  if (dados.code !== 'Ok' || !dados.routes || dados.routes.length === 0) {
    throw new Error('Não foi possível traçar a rota.');
  }
  return dados.routes[0].distance / 1000; // metros para km
}

module.exports = { geocodificar, distanciaKm };