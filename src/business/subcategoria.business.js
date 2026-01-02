import { SubcategoriaRepository } from "../repositories/subcategoria.repository.js";

export const SubcategoriaBusiness = {

  async criar(subcategoria) {
    return await SubcategoriaRepository.criar(subcategoria);
  },

  async listar() {
    return await SubcategoriaRepository.listar();
  },

  async listarPorCategoria(idcategoria) {
    return await SubcategoriaRepository.listarPorCategoria(idcategoria);
  },

  async buscar(subcategoriaId) {
    return await SubcategoriaRepository.buscar(subcategoriaId);
  },

  async deletar(subcategoriaId) {
    return await SubcategoriaRepository.deletar(subcategoriaId);
  }

};
