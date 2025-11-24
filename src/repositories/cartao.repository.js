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
    return await pool.query(`
        SELECT * FROM cartoes where userid = $1
        `, [userid]);
  }
}
