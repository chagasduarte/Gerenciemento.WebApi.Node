import { DashboardRepository } from "../repositories/dashboard.repository.js";
import { TransacaoRepository } from "../repositories/transacao.repository.js";
import { CartaoCreditoRepository } from "../repositories/transacao.credito.repository.js";

export const DashboardBusiness = {
  async calcularResumoFinanceiro(mes, ano) {

    const dataAtual = new Date();

    // Pega o mês atual (0 = janeiro, 11 = dezembro)
    const mesAtual = dataAtual.getMonth() + 1; // soma 1 para ficar de 1 a 12
    const anoAtual = dataAtual.getFullYear();

    const saldo_atual = await DashboardRepository.getSaldoAtual(mesAtual, anoAtual);
    const gastos_mensal = await TransacaoRepository.somaTransacoes('saida', '', mes, ano);
    const receita_mensal = await TransacaoRepository.somaTransacoes('entrada', '', mes, ano);
    const gastos_mensal_pendente = await TransacaoRepository.somaTransacoes('saida', 'pendente', mes, ano);
    const receita_mensal_pendente = await TransacaoRepository.somaTransacoes('entrada', 'pendente', mes, ano);
    const saldo_acumuldado = await DashboardRepository.getSaldoAcumulado(mes, ano)
    const credito = await CartaoCreditoRepository.listarPorMes(1, mes, ano)

    return {
      saldo_atual,
      gastos_mensal,
      receita_mensal,
      gastos_mensal_pendente,
      receita_mensal_pendente,
      saldo_acumuldado,
      saldo_cartao
    };
  },

  // filtra entradas/saídas pagas ou pendentes
  async filtrarTransacoes(tipo, status) {
    return await DashboardRepository.getTransacoes({ tipo, status });
  },
  async buscaProjecao(ano){
    return await DashboardRepository.getProjecaoMensal(ano);
  },
  async getAgrupamentoCategorias(ano) {
    return await DashboardRepository.getAgrupamentoCategoria(ano);
  }
};
