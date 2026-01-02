import { pool } from "../config/database.js";

export const SubcategoriaRepository = {

  async criar(subcategoria) {
    const { idcategoria, nome, icone } = subcategoria;

    const result = await pool.query(
      `INSERT INTO subcategoria (idcategoria, nome, icone)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [idcategoria, nome, icone]
    );

    return result.rows[0];
  },

  async listar() {
    const result = await pool.query(`
      SELECT * FROM subcategoria
    `);

    return result.rows;
  },

  async listarPorCategoria(idcategoria) {
    const result = await pool.query(
      `
      SELECT * 
      FROM subcategoria
      WHERE idcategoria = $1
      ORDER BY nome
      `,
      [idcategoria]
    );

    return result.rows;
  },

  async buscar(subcategoriaId) {
    const result = await pool.query(
      `
      SELECT * 
      FROM subcategoria 
      WHERE id = $1
      `,
      [subcategoriaId]
    );

    return result.rows[0];
  },

  async deletar(subcategoriaId) {
    const result = await pool.query(
      `
      DELETE FROM subcategoria 
      WHERE id = $1
      RETURNING *
      `,
      [subcategoriaId]
    );

    return result.rows[0];
  }

};
