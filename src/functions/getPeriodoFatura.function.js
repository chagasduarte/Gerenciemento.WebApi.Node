export function getPeriodoFatura(diaFatura, mes, ano) {
  let mesAnterior = mes - 1;
  let anoAnterior = ano;

  if (mesAnterior === 0) {
    mesAnterior = 12;
    anoAnterior--;
  }

  const mmAtual = String(mes).padStart(2, '0');
  const mmAnterior = String(mesAnterior).padStart(2, '0');

  const ultimoDiaMesAnterior = new Date(ano, mmAnterior, 0).getDate();
  const ultimoDiaMesAtual = new Date(ano, mes, 0).getDate();

  let inicio, fim;

  if (diaFatura === 1) {
    inicio = `${anoAnterior}-${mmAnterior}-01`;
    fim = `${ano}-${mmAnterior}-${ultimoDiaMesAnterior}`;
  } else {
    inicio = `${anoAnterior}-${mmAnterior}-${String(diaFatura).padStart(2, '0')}`;
    fim = `${ano}-${mmAtual}-${String(diaFatura - 1).padStart(2, '0')}`;
  }

  return { inicio, fim };
}
