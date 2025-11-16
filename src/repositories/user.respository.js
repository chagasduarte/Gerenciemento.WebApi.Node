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
  },
  async update(userid, avatar) {
    const query = `UPDATE usuarios set avatar = $1 where id = $2`
    return await pool.query(query, [avatar, userid]);
  },
  async buscaAvatar(userid) {
    const result = await pool.query(
      `SELECT avatar FROM usuarios WHERE id = $1 LIMIT 1`,
      [userid]
    );
    console.log(userid);
    return result.rows[0];
  },
};
