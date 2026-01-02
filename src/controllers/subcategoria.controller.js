import { SubcategoriaBusiness } from "../business/subcategoria.business.js";

export const SubcategoriaController = {

  async criar(req, res) {
    try {
      const subcategoria = req.body;

      const response = await SubcategoriaBusiness.criar(subcategoria);

      res.status(201).json(response);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  async listar(req, res) {
    try {
      const response = await SubcategoriaBusiness.listar();

      res.status(200).json(response);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  async listarPorCategoria(req, res) {
    try {
      const { idcategoria } = req.params;

      const response = await SubcategoriaBusiness.listarPorCategoria(idcategoria);

      res.status(200).json(response);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  async buscar(req, res) {
    try {
      const { id } = req.params;

      const response = await SubcategoriaBusiness.buscar(id);

      if (!response) {
        return res.status(404).json({ error: "Subcategoria não encontrada" });
      }

      res.status(200).json(response);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  async deletar(req, res) {
    try {
      const { id } = req.params;

      const response = await SubcategoriaBusiness.deletar(id);

      if (!response) {
        return res.status(404).json({ error: "Subcategoria não encontrada" });
      }

      res.status(200).json(response);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

};
