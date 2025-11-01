import { DashboardRepository } from "../repositories/dashboard.repository.js";
import { TransacaoRepository } from "../repositories/transacao.repository.js";

export const DashboardBusiness = {
  async calcularResumoFinanceiro(mes, ano, userid) {

    const dataAtual = new Date();

    // Pega o mês atual (0 = janeiro, 11 = dezembro)
    const mesAtual = dataAtual.getMonth() + 1; // soma 1 para ficar de 1 a 12
    const anoAtual = dataAtual.getFullYear();

    const saldo_atual = await DashboardRepository.getSaldoAtual(mesAtual, anoAtual, userid);
    const gastos_mensal = await TransacaoRepository.somaTransacoes('saida', '', mes, ano, userid);
    const receita_mensal = await TransacaoRepository.somaTransacoes('entrada', '', mes, ano, userid);
    const gastos_mensal_pendente = await TransacaoRepository.somaTransacoes('saida', 'pendente', mes, ano, userid);
    const receita_mensal_pendente = await TransacaoRepository.somaTransacoes('entrada', 'pendente', mes, ano, userid);
    const saldo_acumuldado = await DashboardRepository.getSaldoAcumulado(mes, ano, userid);

    return {
      saldo_atual,
      gastos_mensal,
      receita_mensal,
      gastos_mensal_pendente,
      receita_mensal_pendente,
      saldo_acumuldado
    };
  },

  // filtra entradas/saídas pagas ou pendentes
  async filtrarTransacoes(tipo, status) {
    return await DashboardRepository.getTransacoes({ tipo, status });
  },
  async buscaProjecao(ano){
    return await DashboardRepository.getProjecaoMensal(ano);
  },
  async getAgrupamentoCategorias(ano, userid) {
    return await DashboardRepository.getAgrupamentoCategoria(ano, userid);
  }
};
