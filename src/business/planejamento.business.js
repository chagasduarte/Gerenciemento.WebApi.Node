import { PlanejamentoRepository } from "../repositories/planejamento.repository.js";

export const PlanejamentoBusiness = {

  async criar(dados, userid) {
    if (!dados.categoria || !dados.valor || !dados.tipo) {
      throw new Error("Campos obrigatórios não informados");
    }

    return PlanejamentoRepository.criar(dados, userid);
  },

  async atualizar(id, dados, userid) {
    const planejamento = await PlanejamentoRepository.buscar(id, userid);

    if (!planejamento) {
      throw new Error("Planejamento não encontrado");
    }

    return PlanejamentoRepository.atualizar(id, dados, userid);
  },

  async deletar(id, userid) {
    const planejamento = await PlanejamentoRepository.buscar(id, userid);

    if (!planejamento) {
      throw new Error("Planejamento não encontrado");
    }

    await PlanejamentoRepository.deletar(id, userid);
  },

  async listar(userid) {
    return PlanejamentoRepository.listar(userid);
  },

  async buscar(id, userid) {
    const planejamento = await PlanejamentoRepository.buscar(id, userid);

    if (!planejamento) {
      throw new Error("Planejamento não encontrado");
    }

    return planejamento;
  }

};
