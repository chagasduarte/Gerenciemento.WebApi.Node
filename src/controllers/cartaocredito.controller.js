import { CartaoCreditoBusiness } from '../business/cartaocredito.business.js';

export const CartaoCreditoController = {
  async criar(req, res) {
    try {
      const cartao = await CartaoCreditoBusiness.criar(req.body);
      res.status(201).json(cartao);
    } catch (err) {
      res.status(400).json({ erro: err.message });
    }
  },

  async listarTodos(req, res) {
    try {
      const cartoes = await CartaoCreditoBusiness.listarTodos();
      res.json(cartoes);
    } catch (err) {
      res.status(500).json({ erro: err.message });
    }
  },

  async buscarPorId(req, res) {
    try {
      const cartao = await CartaoCreditoBusiness.buscarPorId(req.params.id);
      res.json(cartao);
    } catch (err) {
      res.status(404).json({ erro: err.message });
    }
  },

  async atualizar(req, res) {
    try {
      const cartao = await CartaoCreditoBusiness.atualizar(req.params.id, req.body);
      res.json(cartao);
    } catch (err) {
      res.status(400).json({ erro: err.message });
    }
  },

  async excluir(req, res) {
    try {
      const resultado = await CartaoCreditoBusiness.excluir(req.params.id);
      res.json(resultado);
    } catch (err) {
      res.status(404).json({ erro: err.message });
    }
  }
};
