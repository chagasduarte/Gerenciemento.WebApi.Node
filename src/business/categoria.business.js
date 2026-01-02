import { CategoriaRepository } from "../repositories/categoria.repository.js";

export const CategoriaBusiness = {

  async criar(categoria) {
    return await CategoriaRepository.criar(categoria);
  },

  async listar() {
    return await CategoriaRepository.listar();
  },

  async buscar(categoriaId) {
    return await CategoriaRepository.buscar(categoriaId);
  },

  async deletar(categoriaId) {
    return await CategoriaRepository.deletar(categoriaId);
  }

};
