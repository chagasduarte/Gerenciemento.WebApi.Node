import { TransacaoRepository } from "../repositories/transacao.repository.js";

export const TransacaoBusiness = {
  async criar(transacao) {
    if (!['entrada', 'saida'].includes(transacao.tipo)) {
      throw new Error("Tipo deve ser 'entrada' ou 'saida'.");
    }
    if (!transacao.descricao || transacao.valor == null) {
      throw new Error("Descrição e valor são obrigatórios.");
    }
    return await TransacaoRepository.criar(transacao);
  },

  async listar(mes, ano) {
    const parceladas = await TransacaoRepository.listaParceladas(mes, ano);
    const adicionais = await TransacaoRepository.listaAdicionais(mes, ano);
    const pagos = await TransacaoRepository.listaTransacoes('saida', 'pago', mes, ano);
    
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
  
  async somar(tipo, status, mes, ano) {
    return await TransacaoRepository.somaTransacoes(tipo,status, mes, ano);
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

  async listaDespesasParceladas(mes, ano) {
    const parcelas = await TransacaoRepository.listaDespesasParceladas(mes, ano);
    const mensal = parcelas.reduce((acc, p) => ({
      pendente: acc.pendente + parseFloat(p.valor_pendente_mes)
    }), { pendente: 0  });

    return { parcelas, mensal };
  },

  async agrupamentoTipo(mes, ano) {
    const agrupamento = await TransacaoRepository.agrupamentoTipo(mes, ano);
    const soma = agrupamento.reduce((acc, p) => ({
       soma: acc.soma + parseFloat(p.total_tipo)
    }), {soma: 0})

    return { soma, agrupamento}
  }

};
