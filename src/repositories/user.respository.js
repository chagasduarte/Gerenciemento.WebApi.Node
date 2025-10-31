import { pool } from "../config/database.js";

export const UsuarioRepository = {
  async buscaPorNome(user) {
    const result = await pool.query(
      `SELECT * FROM usuarios WHERE nome = $1 LIMIT 1`,
      [user]
    );
    return result.rows[0];
  }
};
