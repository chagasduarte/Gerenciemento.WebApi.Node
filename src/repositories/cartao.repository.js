import { pool } from "../config/database.js";

export const CartaoRepository = {
  async criar(cartao, userid) {
    const { nome, dia_fatura, limite } = cartao;
    const result = await pool.query(
      `INSERT INTO cartoes (nome, dia_fatura, limite, userid)
       VALUES ($1, $2, $3, $4 )
       RETURNING *`,
      [nome, dia_fatura, limite, userid]
    );
    return result.rows[0];
  },
  async listar(userid) {
    const result = await pool.query(`
        SELECT * FROM cartoes where userid = $1
        `, [userid]);

    return result.rows;
  },
  async buscar(cartaoid) {
    const result = await pool.query(`
        SELECT * FROM cartoes where id = $1
        `, [cartaoid]);

    return result.rows[0];
  }
}
