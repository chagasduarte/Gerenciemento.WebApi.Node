import { pool } from "../config/database.js";

export const ObjetivosRepository = {
  async criar(objetivo, userid) {
    const { nome,
            tipo,
            valor_objetivo,
            valor_mensal,
            data_final } = objetivo;
    const result = await pool.query(
      `INSERT INTO objetivos (
            usuario_id,
            nome,
            tipo,
            valor_objetivo,
            valor_mensal,
            data_final
        ) 
       VALUES ($1, $2, $3, $4, $5, $6 )
       RETURNING *`,
      [userid,
        nome,
        tipo,
        valor_objetivo,
        valor_mensal,
        data_final]
    );
    return result.rows[0];
  },
  async listar(userid) {
    const result = await pool.query(`
        SELECT * FROM objetivos where userid = $1
        `, [userid]);

    return result.rows;
  },
  async buscar(objetivoid) {
    const result = await pool.query(`
        SELECT * FROM objetivos where id = $1
        `, [objetivoid]);

    return result.rows[0];
  }
}
