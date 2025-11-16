import { pool } from "../config/database.js";

export const UsuarioRepository = {
  async buscaPorNome(user) {
    const result = await pool.query(
      `SELECT * FROM usuarios WHERE nome = $1 LIMIT 1`,
      [user]
    );
    return result.rows[0];
  },
  async criar(user) {
    const {nome, senha, avatar } = user;
    const query = `INSERT INTO usuarios (nome, senha_hash, avatar) values ($1, $2, $3)`;
    const result = await pool.query(query, [nome, senha, avatar]);
    return result.rows[0];
  }
};
