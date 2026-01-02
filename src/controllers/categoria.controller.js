import { CategoriaBusiness } from "../business/categoria.business.js";

export const CategoriaController = {

  async criar(req, res) {
    try {
      const categoria = req.body;

      const response = await CategoriaBusiness.criar(categoria);

      res.status(201).json(response);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  async listar(req, res) {
    try {
      const response = await CategoriaBusiness.listar();

      res.status(200).json(response);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  async buscar(req, res) {
    try {
      const { id } = req.params;

      const response = await CategoriaBusiness.buscar(id);

      if (!response) {
        return res.status(404).json({ error: "Categoria não encontrada" });
      }

      res.status(200).json(response);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  async deletar(req, res) {
    try {
      const { id } = req.params;

      const response = await CategoriaBusiness.deletar(id);

      if (!response) {
        return res.status(404).json({ error: "Categoria não encontrada" });
      }

      res.status(200).json(response);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

};
