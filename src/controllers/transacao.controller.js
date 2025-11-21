import { TransacaoBusiness } from "../business/transacao.business.js";

export const TransacaoController = {
  async criar(req, res) {
    try {
      const userid = req.usuarioId;

      const transacao = await TransacaoBusiness.criar(req.body, userid);
      res.status(201).json(transacao);
    } catch (error) {
      res.status(400).json({ erro: error.message });
    }
  },
  async criarParcelada(req, res) {
    try {
      const userid = req.usuarioId;

      const transacao = await TransacaoBusiness.criarParcelada(req.body, userid);
      res.status(201).json(transacao);
    } catch (error) {
      res.status(400).json({ erro: error.message });
    }
  },
  async listar(req, res) {
    try {
      // Recebe filtros via query string
      const { mes, ano } = req.query;
      const userid = req.usuarioId;

      // Converte mês/ano para números
      const mesNum = mes ? parseInt(mes) : null;
      const anoNum = ano ? parseInt(ano) : null;

      const transacoes = await TransacaoBusiness.listar(mesNum, anoNum, userid);

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
      const userid = req.usuarioId;

      // Converte mês/ano para números
      const mesNum = mes ? parseInt(mes) : null;
      const anoNum = ano ? parseInt(ano) : null;

      const transacoes = await TransacaoBusiness.listarEntradas(mesNum, anoNum, userid);

      res.json(transacoes);
    } catch (err) {
      console.error(err);
      res.status(500).json({ erro: "Erro ao listar transações" });
    }
  },
  async buscar(req, res) {
    try {
      const userid = req.usuarioId;

      const transacao = await TransacaoBusiness.buscarPorId(req.params.id, userid);
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
      const userid = req.usuarioId;

      // Converte mês/ano para números
      const mesNum = mes ? parseInt(mes) : null;
      const anoNum = ano ? parseInt(ano) : null;
      const despesas = await TransacaoBusiness.listaDespesasParceladas(mesNum, anoNum, userid);
      res.json(despesas);
    } catch (error) {
      res.status(404).json({ erro: error.message });
    }
  },
  async agrupamentoTipo(req, res) {
    try {
      // Recebe filtros via query string
      const { mes, ano } = req.query;
      const userid = req.usuarioId;

      // Converte mês/ano para números
      const mesNum = mes ? parseInt(mes) : null;
      const anoNum = ano ? parseInt(ano) : null;
      const agrupamentoTipo = await TransacaoBusiness.agrupamentoTipo(mesNum, anoNum, userid);
      res.json(agrupamentoTipo);
    } catch (error) {
      res.status(404).json({ erro: error.message });
    }
  },
  async receber(req, res) {
    try {
      const id = req.params.id
      await TransacaoBusiness.uptopago(id);
      res.status(200).json("ok");
    } catch (error) {
      res.status(404).json({ erro: error.message });
    }
  },
  async listaDespesa(req, res) {
    try {
      const {descricao} = req.query
      const result = await TransacaoBusiness.listaDespesa(descricao);
      res.json(result);
    } catch (error) {
      res.status(404).json({ erro: error.message });
    }
  },
  async linhaTemporal(req, res) {

    try {
      const { ano } = req.query;
      const userid = req.usuarioId;

      const result = await TransacaoBusiness.linhaTemporal(ano, userid);
      res.json(result);
    } catch (error) {
      res.status(404).json({ erro: error.message });
    }
  },

  async buscaPorDia(req, res) {

    try {
      const { dia, mes, ano } = req.query;
      const userid = req.usuarioId;
      const result = await TransacaoBusiness.buscaPorDia(dia, mes, ano, userid);
      res.json(result);
    } catch (error) {
      res.status(404).json({ erro: error.message });
    }
  },
  
  async saveNewUser(req, res) {
    try {
      const { entradas, saidas } = req.body;
      const userid = req.usuarioId;
      const result = await TransacaoBusiness.saveNewuser({entradas, saidas}, userid);
      res.json(result);
    } catch (error) {
      res.status(404).json({ erro: error.message });
    }
  }
};
