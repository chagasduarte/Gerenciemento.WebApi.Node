export function unirAgrupamentos(semCartao, comCartao) {
  const mapa = new Map();

  // Adiciona agrupamentos sem cartão
  semCartao.forEach(item => {
    const categoria = item.categoria;
    const valor = Number(item.total_tipo);

    mapa.set(categoria, (mapa.get(categoria) || 0) + valor);
  });

  // Soma agrupamentos com cartão
  comCartao.forEach(item => {
    const categoria = item.categoria;
    const valor = Number(item.total_tipo);

    mapa.set(categoria, (mapa.get(categoria) || 0) + valor);
  });

  // Converte de volta para array no formato original
  return Array.from(mapa.entries()).map(([categoria, valor]) => ({
    categoria,
    total_tipo: valor.toFixed(2)
  }));
}
