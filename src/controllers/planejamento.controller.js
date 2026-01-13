import { PlanejamentoBusiness } from "../business/planejamento.business.js";

export const PlanejamentoController = {

  async criar(req, res) {
    try {
      const userid = req.usuarioId;
      const planejamento = await PlanejamentoBusiness.criar(req.body, userid);
      return res.status(201).json(planejamento);
    } catch (error) {
      return res.status(400).json({ erro: error.message });
    }
  },

  async atualizar(req, res) {
    try {
      const { id } = req.params;
      const userid = req.usuarioId;

      const planejamento = await PlanejamentoBusiness.atualizar(
        id,
        req.body,
        userid
      );

      return res.json(planejamento);
    } catch (error) {
      return res.status(400).json({ erro: error.message });
    }
  },

  async deletar(req, res) {
    try {
      const { id } = req.params;
      const userid = req.usuarioId;

      await PlanejamentoBusiness.deletar(id, userid);
      return res.status(204).send();
    } catch (error) {
      return res.status(400).json({ erro: error.message });
    }
  },

  async listarAgrupado(req, res) {
    try {
      const userid = req.usuarioId;
      const { mes, ano } = req.query;

      const planejamentos = await PlanejamentoBusiness.listarAgrupado(mes, ano, userid);
      return res.json(planejamentos);
    } catch (error) {
      return res.status(500).json({ erro: error.message });
    }
  },
  async listar(req, res) {
    try {
      const userid = req.usuarioId;
      const { mes, ano } = req.query;

      const planejamentos = await PlanejamentoBusiness.listar(mes, ano, userid);
      return res.json(planejamentos);
    } catch (error) {
      return res.status(500).json({ erro: error.message });
    }
  },
  async buscar(req, res) {
    try {
      const { id } = req.params;
      const userid = req.usuarioId;

      const planejamento = await PlanejamentoBusiness.buscar(id, userid);
      return res.json(planejamento);
    } catch (error) {
      return res.status(404).json({ erro: error.message });
    }
  }

};
