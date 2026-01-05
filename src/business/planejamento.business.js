import { PlanejamentoRepository } from "../repositories/planejamento.repository.js";

export const PlanejamentoBusiness = {

  async criar(dados, userid) {
    if (!dados.categoriaid || !dados.valor || !dados.tipo) {
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
    const rows = await PlanejamentoRepository.listarComCategoria(userid);

    const resultado = [];

    for (const row of rows) {

      // 🔹 Tipo
      let tipoObj = resultado.find(t => t.tipo === row.tipo);
      if (!tipoObj) {
        tipoObj = {
          tipo: row.tipo,
          soma: 0,
          agrupamentoTipo: []
        };
        resultado.push(tipoObj);
      }

      tipoObj.soma += Number(row.valor);

      // 🔹 Categoria dentro do tipo
      let categoriaObj = tipoObj.agrupamentoTipo.find(
        c => c.categoria === row.categoria
      );

      if (!categoriaObj) {
        categoriaObj = {
          categoria: row.categoria,
          soma: 0,
          planejamento: []
        };
        tipoObj.agrupamentoTipo.push(categoriaObj);
      }

      categoriaObj.soma += Number(row.valor);
      categoriaObj.planejamento.push(row);
    }
    return resultado;
  },

  async buscar(id, userid) {
    const planejamento = await PlanejamentoRepository.buscar(id, userid);

    if (!planejamento) {
      throw new Error("Planejamento não encontrado");
    }

    return planejamento;
  }

};
