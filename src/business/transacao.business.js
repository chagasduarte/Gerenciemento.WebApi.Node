import { TransacaoRepository } from "../repositories/transacao.repository.js";
import { CartaoRepository } from "../repositories/cartao.repository.js"
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
      if (!payload?.parcelado || !payload?.ispaycart) {
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
      const dataCompra = new Date(payload.data);

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
          ispaycart: payload.ispaycart,
          userId: userId,
          cartaoid: payload.cartaoid
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
  },
  async saveNewuser(payload, userId) {
    try {
      const { entradas, saidas } = payload;

      if (!entradas || !Array.isArray(entradas) || entradas.length === 0) {
        throw new Error("É necessário pelo menos uma ENTRADA fixa.");
      }

      if (!saidas || !Array.isArray(saidas) || saidas.length === 0) {
        throw new Error("É necessário pelo menos uma SAÍDA fixa.");
      }

      // Quantidade de meses a gerar
      const monthsToGenerate = 12;

      // Data de referência para geração
      const hoje = new Date();
      const startYear = hoje.getFullYear();
      const startMonth = hoje.getMonth(); // 0 = janeiro

      const todasTransacoes = [];

      // Função utilitária igual ao business anterior
      const lastDayOfMonth = (year, monthZero) => {
        return new Date(year, monthZero + 1, 0).getDate();
      };

      const safeDay = (year, monthZero, day) => {
        const last = lastDayOfMonth(year, monthZero);
        return Math.min(Math.max(1, day), last);
      };

      // -----------------------------
      // CRIA TODAS AS TRANSAÇÕES
      // -----------------------------
      for (let m = 0; m < monthsToGenerate; m++) {

        const year = startYear + Math.floor((startMonth + m) / 12);
        const month = (startMonth + m) % 12;

        // ========= ENTRADAS =========
        for (const entrada of entradas) {

          const valorEntrada = Number(entrada.value ?? entrada.valor);
          const dia = safeDay(year, month, Number(entrada.day_of_month));

          const data = new Date(year, month, dia);

          const transacao = {
            tipo: "entrada",
            descricao: entrada.description || entrada.descricao || "Entrada fixa",
            valor: Math.abs(valorEntrada),    // garante valor positivo
            categoria: null,                   // opcional
            data: data,
            status: "pendente",
            ispaycart: false,
            userId: userId
          };

          todasTransacoes.push(transacao);
        }

        // ========= SAÍDAS =========
        for (const saida of saidas) {

          const valorSaida = Number(saida.value ?? saida.valor);
          const dia = safeDay(year, month, Number(saida.day_of_month));

          const data = new Date(year, month, dia);

          const transacao = {
            tipo: "saida",
            descricao: (saida.description || saida.descricao || "Despesa fixa") + " - Parcela",
            valor: Math.abs(valorSaida),
            categoria: saida.category ?? saida.categoria ?? null,
            data: data,
            status: "pendente",
            ispaycart: false,
            userId: userId
          };

          todasTransacoes.push(transacao);
        }
      }

      // -----------------------------
      // SALVA TODAS AS TRANSACOES
      // -----------------------------
      const criadas = [];

      for (const tr of todasTransacoes) {
        const criada = await TransacaoRepository.criar(tr, userId);
        criadas.push(criada);
      }

      return {
        ok: true,
        quantidadeCriada: criadas.length,
        transacoes: criadas
      };

    } catch (err) {
      console.error("Erro ao criar transações iniciais do usuário:", err);
      throw err;
    }
  },
  async listar(mes, ano, userid, cardId) {

    let inicio = new Date(`${ano}-${String(mes).padStart(2, "0")}-01`);
    let fim    = new Date(ano, mes, 0);  // último dia do mês automaticamente

    // sempre declara o formatar fora
    const formatar = d => d.toISOString().slice(0, 10);

    // se tiver cartão, ajusta pela data de fatura
    if (cardId) {

      const cartao = await CartaoRepository.buscar(cardId);

      const dataFatura = new Date(cartao.data_fatura);

      if (isNaN(dataFatura)) {
        throw new Error("Data de fatura inválida: " + cartao.data_fatura);
      }

      // início na data de fatura do mês
      inicio.setDate(dataFatura.getDate());

      // fim = início + 1 mês
      fim = new Date(inicio);
      fim.setMonth(fim.getMonth() + 1);
    }

    // converte tudo para YYYY-MM-DD
    inicio = formatar(inicio);
    fim    = formatar(fim);

    const parceladas = await TransacaoRepository.listaParceladas(inicio, fim, userid, cardId);
    const adicionais = await TransacaoRepository.listaAdicionais(inicio, fim, userid, cardId);
    const pagos = await TransacaoRepository.listaTransacoes('saida', 'pago', inicio, fim, userid, cardId);
    
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

  async listaDespesa(descricao, userid) {
    const despesa = await TransacaoRepository.listaDespesa(descricao, userid);

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
