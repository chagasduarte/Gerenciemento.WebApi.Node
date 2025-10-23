import { TransacaoBusiness } from "../business/transacao.business.js";

export const TransacaoController = {
  async criar(req, res) {
    try {
      const transacao = await TransacaoBusiness.criar(req.body);
      res.status(201).json(transacao);
    } catch (error) {
      res.status(400).json({ erro: error.message });
    }
  },

  async listar(req, res) {
    try {
      // Recebe filtros via query string
      const { mes, ano } = req.query;

      // Converte mês/ano para números
      const mesNum = mes ? parseInt(mes) : null;
      const anoNum = ano ? parseInt(ano) : null;

      const transacoes = await TransacaoBusiness.listar(mesNum, anoNum);

      res.json(transacoes);
    } catch (err) {
      console.error(err);
      res.status(500).json({ erro: "Erro ao listar transações" });
    }
  },
  async listarEntradas(req, res) {
    try {
      // Recebe filtros via query string
      const { mes, ano } = req.query;

      // Converte mês/ano para números
      const mesNum = mes ? parseInt(mes) : null;
      const anoNum = ano ? parseInt(ano) : null;

      const transacoes = await TransacaoBusiness.listarEntradas(mesNum, anoNum);

      res.json(transacoes);
    } catch (err) {
      console.error(err);
      res.status(500).json({ erro: "Erro ao listar transações" });
    }
  },
  async buscar(req, res) {
    try {
      const transacao = await TransacaoBusiness.buscarPorId(req.params.id);
      res.json(transacao);
    } catch (error) {
      res.status(404).json({ erro: error.message });
    }
  },

  async atualizar(req, res) {
    try {
      const transacao = await TransacaoBusiness.atualizar(req.params.id, req.body);
      res.json(transacao);
    } catch (error) {
      res.status(400).json({ erro: error.message });
    }
  },

  async excluir(req, res) {
    try {
      await TransacaoBusiness.excluir(req.params.id);
      res.status(204).send();
    } catch (error) {
      res.status(404).json({ erro: error.message });
    }
  },

  async listaDespesasParceladas(req, res) {
    try {
      // Recebe filtros via query string
      const { mes, ano } = req.query;

      // Converte mês/ano para números
      const mesNum = mes ? parseInt(mes) : null;
      const anoNum = ano ? parseInt(ano) : null;
      const despesas = await TransacaoBusiness.listaDespesasParceladas(mesNum, anoNum);
      res.json(despesas);
    } catch (error) {
      res.status(404).json({ erro: error.message });
    }
  },
  async agrupamentoTipo(req, res) {
    try {
      // Recebe filtros via query string
      const { mes, ano } = req.query;

      // Converte mês/ano para números
      const mesNum = mes ? parseInt(mes) : null;
      const anoNum = ano ? parseInt(ano) : null;
      const agrupamentoTipo = await TransacaoBusiness.agrupamentoTipo(mesNum, anoNum);
      res.json(agrupamentoTipo);
    } catch (error) {
      res.status(404).json({ erro: error.message });
    }
  }
};
