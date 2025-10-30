import { CartaoCreditoRepository } from '../repositories/CartaoCreditoRepository.js';

export const CartaoCreditoBusiness = {
  async criar(dados) {
    if (!dados.nome || !dados.limite_total) {
      throw new Error('Nome e limite total são obrigatórios.');
    }

    // Caso queira forçar valor_inicial = limite_total no início
    const valorAtual = dados.valor_utilizado ?? 0;

    const cartao = await CartaoCreditoRepository.criar({
      nome: dados.nome,
      limite_total: dados.limite_total,
      valor_utilizado: valorAtual,
      data_fechamento: dados.data_fechamento,
      data_pagamento: dados.data_pagamento,
      ativa: dados.ativa ?? true
    });

    return cartao;
  },

  async listarTodos() {
    return await CartaoCreditoRepository.listarTodos();
  },

  async buscarPorId(id) {
    const cartao = await CartaoCreditoRepository.buscarPorId(id);
    if (!cartao) throw new Error('Cartão não encontrado.');
    return cartao;
  },

  async atualizar(id, dados) {
    const cartaoExistente = await CartaoCreditoRepository.buscarPorId(id);
    if (!cartaoExistente) throw new Error('Cartão não encontrado.');

    return await CartaoCreditoRepository.atualizar(id, dados);
  },

  async excluir(id) {
    const cartao = await CartaoCreditoRepository.buscarPorId(id);
    if (!cartao) throw new Error('Cartão não encontrado.');

    await CartaoCreditoRepository.excluir(id);
    return { mensagem: 'Cartão removido com sucesso.' };
  }
};
