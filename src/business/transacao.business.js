import { TransacaoRepository } from "../repositories/transacao.repository.js";

export const TransacaoBusiness = {
  async criar(transacao, userid) {
    if (!['entrada', 'saida', 'cartao'].includes(transacao.tipo)) {
      throw new Error("Tipo deve ser 'entrada' ou 'saida'.");
    }
    if (!transacao.descricao || transacao.valor == null) {
      throw new Error("Descrição e valor são obrigatórios.");
    }
    return await TransacaoRepository.criar(transacao, userid);
  },

  async listar(mes, ano, userid) {
    const parceladas = await TransacaoRepository.listaParceladas(mes, ano, userid);
    const adicionais = await TransacaoRepository.listaAdicionais(mes, ano, userid);
    const pagos = await TransacaoRepository.listaTransacoes('saida', 'pago', mes, ano, userid);
    
    const soma_parcelados = parceladas.reduce((acc, p) => ({
      soma: acc.soma + parseFloat(p.valor)
    }), { soma: 0  }).soma;

    const soma_adicionais = adicionais.reduce((acc, p) => ({
      soma: acc.soma + parseFloat(p.valor)
    }), { soma: 0  }).soma;

    const soma_pagos = pagos.reduce((acc, p) => ({
      soma: acc.soma + parseFloat(p.valor)
    }), { soma: 0  }).soma;

    return {
      soma_parcelados,
      soma_adicionais,
      soma_pagos,
      parceladas,
      adicionais, 
      pagos
    }
  },
  async listarEntradas(mes, ano, userid) {
    const entradas_receber = await TransacaoRepository.listaTransacoes('entrada', 'pendente', mes, ano, userid);
    const entradas_recebidas = await TransacaoRepository.listaTransacoes('entrada', 'pago', mes, ano, userid);
    
    const soma_receber = entradas_receber.reduce((acc, p) => ({
      soma: acc.soma + parseFloat(p.valor)
    }), { soma: 0  }).soma;

    const soma_recebidos = entradas_recebidas.reduce((acc, p) => ({
      soma: acc.soma + parseFloat(p.valor)
    }), { soma: 0  }).soma;

    return {
      soma_receber,
      soma_recebidos,
      entradas_receber,
      entradas_recebidas
    }
  },
  async somar(tipo, status, mes, ano, userid) {
    return await TransacaoRepository.somaTransacoes(tipo,status, mes, ano, userid);
  },

  async buscarPorId(id) {
    const t = await TransacaoRepository.buscarPorId(id);
    if (!t) throw new Error("Transação não encontrada.");
    return t;
  },

  async atualizar(id, dados) {
    await this.buscarPorId(id); // garante que existe
    return await TransacaoRepository.atualizar(id, dados);
  },

  async excluir(id) {
    await this.buscarPorId(id); // garante que existe
    return await TransacaoRepository.excluir(id);
  },

  async listaDespesasParceladas(mes, ano, userid) {
    const parcelas = await TransacaoRepository.listaDespesasParceladas(mes, ano, userid);
    const mensal = parcelas.reduce((acc, p) => ({
      pendente: acc.pendente + parseFloat(p.valor_pendente_mes)
    }), { pendente: 0  });

    return { parcelas, mensal };
  },

  async agrupamentoTipo(mes, ano, userid) {
    const agrupamento = await TransacaoRepository.agrupamentoTipo(mes, ano, userid);
    const soma = agrupamento.reduce((acc, p) => ({
       soma: acc.soma + parseFloat(p.total_tipo)
    }), {soma: 0})

    return { soma, agrupamento}
  },
  
  async uptopago(id) {
    return await TransacaoRepository.uptopago(id);
  },

  async listaDespesa(descricao) {
    return await TransacaoRepository.listaDespesa(descricao);
  },

  async linhaTemporal(ano, userid) {
    return await TransacaoRepository.linhaTemporal(ano, userid);
  }

};
