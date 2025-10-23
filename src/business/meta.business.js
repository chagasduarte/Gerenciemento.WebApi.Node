import { DashboardRepository } from "../repositories/dashboard.repository.js";

export const MetasBusiness = {
  // valorMeta = preço do item
  async calcularMetas(valorMeta) {
    // pegar sobra acumulada incluindo pendentes (projeção futura)
    const sobraAcumulada = await DashboardRepository.getSobraAcumulada();

    let mesAlvo = null;
    for (const mes of sobraAcumulada) {
      if (mes.sobra_acumulada >= valorMeta) {
        mesAlvo = mes.mes;
        break;
      }
    }

    return {
      valorMeta,
      mesAlvo: mesAlvo ? new Date(mesAlvo).toISOString().slice(0, 7) : "Ainda não alcançada"
    };
  }
};
