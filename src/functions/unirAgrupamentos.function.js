export function unirAgrupamentos(semCartao, comCartao) {
  const mapa = new Map();

  // Sem cartão
  semCartao.forEach(item => {
    const categoria = item.categoria;
    const valor = Number(item.total_tipo);
    const idcategoria = Number(item.idcategoria);

    if (!mapa.has(categoria)) {
      mapa.set(categoria, {
        total: valor,
        idcategoria
      });
    } else {
      mapa.get(categoria).total += valor;
    }
  });

  // Com cartão
  comCartao.forEach(item => {
    const categoria = item.categoria;
    const valor = Number(item.total_tipo);
    const idcategoria = Number(item.idcategoria);

    if (!mapa.has(categoria)) {
      mapa.set(categoria, {
        total: valor,
        idcategoria
      });
    } else {
      mapa.get(categoria).total += valor;
    }
  });

  // Converte para array
  return Array.from(mapa.entries()).map(([categoria, data]) => ({
    categoria,
    total_tipo: data.total.toFixed(2),
    idcategoria: data.idcategoria
  }));
}
