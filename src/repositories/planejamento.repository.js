import { pool } from "../config/database.js";

export const PlanejamentoRepository = {

  async criar(planejamento, userid) {
    const { categoria, subcategoria, valor, tipo } = planejamento;

    const result = await pool.query(
      `INSERT INTO planejamento (categoria, subcategoria, valor, tipo, userid)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [categoria, subcategoria, valor, tipo, userid]
    );

    return result.rows[0];
  },

  async atualizar(id, planejamento, userid) {
    const { categoria, subcategoria, valor, tipo } = planejamento;

    const result = await pool.query(
      `UPDATE planejamento
         SET categoria = $1,
             subcategoria = $2,
             valor = $3,
             tipo = $4
       WHERE id = $5 AND userid = $6
       RETURNING *`,
      [categoria, subcategoria, valor, tipo, id, userid]
    );

    return result.rows[0];
  },

  async deletar(id, userid) {
    await pool.query(
      `DELETE FROM planejamento
       WHERE id = $1 AND userid = $2`,
      [id, userid]
    );
  },

  async listar(userid) {
    const result = await pool.query(
      `SELECT *
         FROM planejamento
        WHERE userid = $1
        ORDER BY id DESC`,
      [userid]
    );

    return result.rows;
  },

  async buscar(id, userid) {
    const result = await pool.query(
      `SELECT *
         FROM planejamento
        WHERE id = $1 AND userid = $2`,
      [id, userid]
    );

    return result.rows[0];
  }

};
