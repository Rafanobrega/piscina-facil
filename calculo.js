// Calcula o preço da limpeza da piscina.
// km: distância da casa do piscineiro até o cliente (só ida)
// gasolina: preço do litro da gasolina (R$)
// volumeL: volume da piscina em litros
// consumo: quantos km o carro faz por litro
// valorPorLitro: quanto cobra por litro de água da piscina (R$)
function calcularPreco(km, gasolina, volumeL, consumo = 10, valorPorLitro = 0.02) {
  const deslocamento = ((km * 2) / consumo) * gasolina; // ida e volta
  const limpeza = volumeL * valorPorLitro;
  return deslocamento + limpeza;
}

module.exports = { calcularPreco };