import { pool } from "../config/database.js";

export const CartaoCreditoRepository = {
  async criar(transacao) {
    const { 
      cartao_id, 
      descricao, 
      valor, 
      data_compra, 
      data_fatura, 
      status = 'pendente', 
      parcelas_total = 1, 
      parcela_atual = 1 
    } = transacao;

    const result = await pool.query(
      `INSERT INTO cartao_transacoes 
        (cartao_id, descricao, valor, data_compra, data_fatura, status, parcelas_total, parcela_atual, criado_em)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW())
       RETURNING *`,
      [cartao_id, descricao, valor, data_compra, data_fatura, status, parcelas_total, parcela_atual]
    );

    return result.rows[0];
  },

  async buscarPorId(id) {
    const result = await pool.query(
      `SELECT * FROM cartao_transacoes WHERE id = $1`,
      [id]
    );
    return result.rows[0];
  },

  async listarPorCartao(cartao_id) {
    const result = await pool.query(
      `SELECT * FROM cartao_transacoes WHERE cartao_id = $1 ORDER BY data_fatura ASC`,
      [cartao_id]
    );
    return result.rows;
  },

  async listarPorMes(cartao_id, mes, ano) {
    const result = await pool.query(
      `SELECT * FROM cartao_transacoes 
        WHERE cartao_id = $1 
        AND EXTRACT(MONTH FROM data_fatura) = $2
        AND EXTRACT(YEAR FROM data_fatura) = $3
        ORDER BY data_fatura ASC`,
      [cartao_id, mes, ano]
    );
    return result.rows;
  },

  async atualizar(id, transacao) {
    const { 
      descricao, 
      valor, 
      data_compra, 
      data_fatura, 
      status, 
      parcelas_total, 
      parcela_atual 
    } = transacao;

    const result = await pool.query(
      `UPDATE cartao_transacoes
       SET descricao=$1, valor=$2, data_compra=$3, data_fatura=$4, status=$5, parcelas_total=$6, parcela_atual=$7
       WHERE id=$8
       RETURNING *`,
      [descricao, valor, data_compra, data_fatura, status, parcelas_total, parcela_atual, id]
    );

    return result.rows[0];
  },

  async excluir(id) {
    await pool.query(`DELETE FROM cartao_transacoes WHERE id=$1`, [id]);
    return true;
  },

  async somarPorFatura(cartao_id, mes, ano) {
    const result = await pool.query(
      `SELECT 
          SUM(valor) AS total_fatura,
          SUM(CASE WHEN status = 'pago' THEN valor ELSE 0 END) AS total_pago,
          SUM(CASE WHEN status = 'pendente' THEN valor ELSE 0 END) AS total_pendente
        FROM cartao_transacoes
        WHERE cartao_id = $1
          AND EXTRACT(MONTH FROM data_fatura) = $2
          AND EXTRACT(YEAR FROM data_fatura) = $3`,
      [cartao_id, mes, ano]
    );

    return result.rows[0];
  }
};
