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
  
  async criarParcelada(payload, userId) {
    try {
      // --- Validações básicas ---
      if (!payload?.parcelado || !payload?.cartao) {
        throw new Error("Transação não é parcelada ou não é de cartão.");
      }

      if (!payload.parcelas?.QtdParcelas || !payload.parcelas?.Valor) {
        throw new Error("Informações de parcelamento inválidas.");
      }

      const qtdParcelas = Number(payload.parcelas.QtdParcelas);
      const valorParcelaInformado = Number(payload.parcelas.Valor);

      if (qtdParcelas <= 0) {
        throw new Error("Quantidade de parcelas inválida.");
      }

      // --- Cálculo do valor por parcela ---
      const valorCalculado = Number(payload.valor) / qtdParcelas;

      // Confere se o valor da parcela bate (ajuda a evitar manipulação)
      if (valorCalculado != valorParcelaInformado) {
        throw new Error("Valor das parcelas não confere com o valor total.");
      }

      // --- Data inicial da compra ---
      const dataCompra = new Date(payload.dataCompra);

      // --- Criar cada parcela ---
      const parcelasCriadas = [];

      for (let i = 0; i < qtdParcelas; i++) {

        // Data da parcela = mês da compra + i
        let dataParcela = new Date(dataCompra);
        dataParcela.setMonth(dataCompra.getMonth() + i);

        const parcela = {
          tipo: "saida",
          descricao: `${payload.descricao} - Parcela`,
          valor: valorParcelaInformado,
          categoria: payload.categoria,
          data: dataParcela,
          status: "pendente",
          ispaycart: true,
          userId: userId
        };

        // Envia para o Repository
        const criada = await TransacaoRepository.criar(parcela, userId);
        parcelasCriadas.push(criada);
      }

      return parcelasCriadas;
    }
    catch (ex) {
      console.error("Erro ao criar transação parcelada:", ex);
      throw ex;
    }
  }
  ,

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
    const despesa = await TransacaoRepository.listaDespesa(descricao);

    const soma = despesa.reduce((acc, p) => ({
      soma: acc.soma + parseFloat(p.valor)
    }), { soma: 0  }).soma;

    return {soma, despesa}
  },

  async linhaTemporal(ano, userid) {
    return await TransacaoRepository.linhaTemporal(ano, userid);
  },
  async buscaPorDia(dia, mes, ano, userid) {
    const result = await TransacaoRepository.buscaPorDia(dia, mes, ano, userid);
    const soma = result.reduce((acc, p) => ({
       soma: acc.soma + parseFloat(p.valor)
    }), {soma: 0})
    return { soma, result}
  }
};
