import { DashboardBusiness } from "../business/dashboard.business.js";

export const DashboardController = {
  async getResumo(req, res) {
    try {
      const {mes, ano} = req.query;
      const userid = req.usuarioId;

      const dados = await DashboardBusiness.calcularResumoFinanceiro(mes, ano, userid);
      if(dados.hasSome)
        res.json(dados);
      else 
        res.status(405).json({ error: "Usuário ainda não preencheu nenhuma informação", dados })
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Erro ao obter dados do dashboard" });
    }
  },

  async getTransacoesFiltradas(req, res) {
    try {
      const { tipo, status } = req.query; // ex: ?tipo=saida&status=pendente 
      const userid = req.usuarioId;
      const transacoes = await DashboardBusiness.filtrarTransacoes(tipo, status, userid);
      res.json(transacoes);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Erro ao filtrar transações" });
    }
  },
  async buscaProjecao(req, res) {
    try {
      const { ano } = req.query;
      const userid = req.usuarioId;

      const projecao = await DashboardBusiness.buscaProjecao(ano, userid);
      res.json(projecao);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Erro ao buscar projecao" });
    }
  },
  async buscaAgrupamentoCategoria(req, res) {
    try {
      const { ano } = req.query;
      const userid = req.usuarioId;


      const agrupamento = await DashboardBusiness.getAgrupamentoCategorias(ano, userid);
      res.json(agrupamento);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Erro ao buscar projecao" });
    }
  }
};
