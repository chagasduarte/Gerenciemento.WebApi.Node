import { pool } from "../config/database.js";

export const CategoriaRepository = {

  async criar(categoria) {
    const { idcategoria, nome, icone } = categoria;
    const result = await pool.query(
      `INSERT INTO categoria ( nome, icone)
       VALUES ($1, $2, $3 )
       RETURNING *`,
      [idcategoria, nome, icone]
    );
    return result.rows[0];
  },

  async listar() {
    const result = await pool.query(`
        SELECT * FROM categoria
        `);

    return result.rows;
  },

  async buscar(categoria) {
    const result = await pool.query(`
        SELECT * FROM categoria where id = $1
        `, [categoria]);

    return result.rows[0];
  },
  async deletar(categoriaId) {
    const result = await pool.query(`
        DELETE FROM categoria where id = $1
        `, [categoriaId]);

    return result.rows[0];
  }

}
