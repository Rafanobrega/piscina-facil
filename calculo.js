// Parâmetros ajustáveis (troque pelos custos reais do piscineiro)
const PADRAO = {
  consumo: 10,            // km por litro do carro
  desgaste: 1.5,          // fator: combustível + desgaste do carro
  maoDeObra: 80,          // R$ fixo por visita
  produtoPorMilLitros: 5, // R$ de produtos a cada 1000 L
  margem: 0.2,            // 20% de lucro
  minimo: 100,            // R$ mínimo por visita
};

// km: distância até o cliente (só ida)
// gasolina: preço do litro (R$)
// volumeL: volume da piscina em litros
function calcularPreco(km, gasolina, volumeL, opcoes = {}) {
  const p = { ...PADRAO, ...opcoes };
  const deslocamento = ((km * 2) / p.consumo) * gasolina * p.desgaste; // ida e volta
  const servico = p.maoDeObra + (volumeL / 1000) * p.produtoPorMilLitros;
  const total = (deslocamento + servico) * (1 + p.margem);
  return Math.max(total, p.minimo);
}

module.exports = { calcularPreco, PADRAO };