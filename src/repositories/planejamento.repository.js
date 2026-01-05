import { pool } from "../config/database.js";

export const PlanejamentoRepository = {

  async criar(planejamento, userid) {
    const { categoria, subcategoria, valor, tipo, categoriaid, subcategoriaid, data } = planejamento;

    const result = await pool.query(
      `INSERT INTO planejamento (categoria, subcategoria, valor, tipo, categoriaid, subcategoriaid, data, userid)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [categoria, subcategoria, valor, tipo, categoriaid, subcategoriaid, data, userid]
    );

    return result.rows[0];
  },

  async atualizar(id, planejamento, userid) {
    const { categoria, subcategoria, valor, tipo, categoriaid, subcategoriaid } = planejamento;

    const result = await pool.query(
      `UPDATE planejamento
         SET categoria = $1,
             subcategoria = $2,
             valor = $3,
             tipo = $4,
             categoriaid = $5,
             subcategoriaid = $6
       WHERE id = $7 AND userid = $8
       RETURNING *`,
      [categoria, subcategoria, valor, tipo, categoriaid, subcategoriaid, id, userid]
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
  async listarComCategoria(userid) {
    const result = await pool.query(`
        SELECT
        *
        FROM planejamento p
        WHERE p.userid = $1
    `, [userid]);

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
