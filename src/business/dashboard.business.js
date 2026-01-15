import { DashboardRepository } from "../repositories/dashboard.repository.js";
import { TransacaoRepository } from "../repositories/transacao.repository.js";
import { CartaoRepository } from "../repositories/cartao.repository.js";
import { getPeriodoFatura } from "../functions/getPeriodoFatura.function.js"

export const DashboardBusiness = {
  async calcularResumoFinanceiro(mes, ano, userid) {

    let cartoes = await CartaoRepository.listar(userid);

    const mm = String(mes).padStart(2, '0');
    const data_inicio = `${ano}-${mm}-01`;
    const ultimoDia = new Date(ano, mes, 0).getDate(); // passar mes como número normal (1-12)
    let data_fim = `${ano}-${mm}-${String(ultimoDia).padStart(2, '0')}`;

    
    const dataAtual = new Date();
    const mesAtual = dataAtual.getMonth() + 1;
    const anoAtual = dataAtual.getFullYear();
    const saldo_atual = await DashboardRepository.getSaldoAtual(mesAtual, anoAtual, userid);

    // 🟦 RESULTADOS INICIAIS (SEM CARTÃO)
    let gastos_mensal = await TransacaoRepository.somaTransacoes('saida', '', mes, ano, userid);
    let receita_mensal = await TransacaoRepository.somaTransacoes('entrada', '', mes, ano, userid);
    let gastos_mensal_pendente = await TransacaoRepository.somaTransacoes('saida', 'pendente', mes, ano, userid);
    let receita_mensal_pendente = await TransacaoRepository.somaTransacoes('entrada', 'pendente', mes, ano, userid);

    let gastos_cartao = 0;
    let saldo_acumulado = await DashboardRepository.getSaldoAcumulado(data_fim, userid);

    // 🟦 Se houver cartões, buscar individualmente
    if (cartoes && cartoes.length > 0) {

      for (const cartao of cartoes) {
        const diaFatura = cartao.dia_fatura;
        const periodo = getPeriodoFatura(diaFatura, mes, ano);
        const gastosDoCartaoPendente = await TransacaoRepository.somaTransacoes('saida', 'pendente',mes, ano, userid, cartao.id);
        
        gastos_cartao += Number(gastosDoCartaoPendente | 0);

      }
    }


    return {
      saldo_atual,
      gastos_mensal,
      receita_mensal,
      gastos_mensal_pendente,
      receita_mensal_pendente,
      saldo_acumulado,
      gastos_cartao,
      hasSome:
        saldo_atual > 0 ||
        gastos_mensal > 0 ||
        receita_mensal > 0 ||
        gastos_mensal_pendente > 0 ||
        receita_mensal_pendente > 0 ||
        saldo_acumulado > 0 ||
        gastos_cartao > 0
    };
  },

  // filtra entradas/saídas pagas ou pendentes
  async filtrarTransacoes(tipo, status) {
    return await DashboardRepository.getTransacoes({ tipo, status });
  },
  async buscaProjecao(ano, userid){
    return await DashboardRepository.getProjecaoMensal(ano, userid);
  },
  async getAgrupamentoCategorias(ano, userid) {
    return await DashboardRepository.getAgrupamentoCategoria(ano, userid);
  },
  
};
