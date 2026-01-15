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

  async buscar(mes, ano, id = null, tipo = null, categoriaid = null, subcategoriaid = null, userid) {
    const params = [];
    let query = 
    `SELECT * FROM planejamento
     WHERE 1 = 1`;
    

    if(mes){
      params.push(mes)
      query += ` AND extract(month from data) = $${params.length}`;
    }
    if(ano) {
      params.push(ano);
      query += ` AND extract(year from data) = $${params.length}`;

    }
    
    if (id){
      params.push(id);
      query += ` AND id = $${params.length}`
    }
    if (tipo){
      params.push(tipo);
      query += ` AND tipo = $${params.length}`
    }
    if (categoriaid){
      params.push(categoriaid);
      query += ` AND categoriaid = $${params.length}`
    }
    if (subcategoriaid){
      params.push(subcategoriaid);
      query += ` AND subcategoriaid = $${params.length}`
    }

 
    params.push(userid);
    query += ` AND userid = $${params.length}`;
    const result = await pool.query(query, params);
    return result.rows;
  }

};
