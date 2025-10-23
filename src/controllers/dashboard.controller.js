import { DashboardBusiness } from "../business/dashboard.business.js";

export const DashboardController = {
  async getResumo(req, res) {
    try {
      const {mes, ano} = req.query;
      const dados = await DashboardBusiness.calcularResumoFinanceiro(mes, ano);
      res.json(dados);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Erro ao obter dados do dashboard" });
    }
  },

  async getTransacoesFiltradas(req, res) {
    try {
      const { tipo, status } = req.query; // ex: ?tipo=saida&status=pendente
      const transacoes = await DashboardBusiness.filtrarTransacoes(tipo, status);
      res.json(transacoes);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Erro ao filtrar transações" });
    }
  },
  async buscaProjecao(req, res) {
    try {
      const { ano } = req.query
      const projecao = await DashboardBusiness.buscaProjecao(ano);
      res.json(projecao);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Erro ao buscar projecao" });
    }
  },
  async buscaAgrupamentoCategoria(req, res) {
    try {
      const { ano } = req.query
      const agrupamento = await DashboardBusiness.getAgrupamentoCategorias(ano);
      res.json(agrupamento);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Erro ao buscar projecao" });
    }
  }
};
