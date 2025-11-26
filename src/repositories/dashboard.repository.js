import { pool } from "../config/database.js";

export const DashboardRepository = {
  // saldo atual (considera apenas transações pagas)
  async getSaldoAtual(mes, ano, userid) {
    const query = `
      SELECT
        SUM(CASE 
              WHEN tipo = 'entrada' THEN valor
              WHEN tipo = 'saida' THEN -valor
              ELSE 0
            END) AS saldo_atual
      FROM transacoes
      WHERE status = 'pago'
        AND (
          EXTRACT(YEAR FROM data) < $2
          OR (EXTRACT(YEAR FROM data) = $2 
              AND EXTRACT(MONTH FROM data) <= $1)
        )
        AND userid = $3;`;
    const { rows } = await pool.query(query, [mes, ano, userid]);
    return Number(rows[0].saldo_atual || 0);
  },
  async getSaldoAcumulado(data_fim, userid, cardid = null) {
    let query = `
      SELECT COALESCE(SUM(
        CASE 
          WHEN tipo = 'entrada' THEN valor
          WHEN tipo = 'saida' THEN -valor
          ELSE 0
        END
      ), 0) AS total
      FROM transacoes
      WHERE userid = $1
        AND data <= $2
    `;
    if(cardid){
      query += ` And cartaoid = ${cardid}`;
    }
    else {
      query += ` And cartaoid is null`;
    }

    const total = await pool.query(query, [
      userid,
      data_fim
    ]);
  return Number(total.rows[0].total | 0)
},
  // saldo projetado por mês (considera todas as transações, pagas ou pendentes)
  async getProjecaoMensal(ano, userid) {
    const query = `
      SELECT
        DATE_TRUNC('month', data) AS mes_ano,
        EXTRACT(YEAR FROM data) AS ano,
        EXTRACT(MONTH FROM data) AS mes,
        SUM(CASE WHEN tipo = 'entrada' THEN valor ELSE 0 END) AS soma_entrada,
        SUM(CASE WHEN tipo = 'saida' THEN valor ELSE 0 END) AS soma_saida,
        -- saldo mensal (entradas - saídas)
        SUM(
          CASE 
            WHEN tipo = 'entrada' THEN valor
            WHEN tipo = 'saida' THEN -valor
            ELSE 0 
          END
        ) AS saldo_mensal,
        -- saldo acumulado (progressivo)
        SUM(
          SUM(
            CASE 
              WHEN tipo = 'entrada' THEN valor
              WHEN tipo = 'saida' THEN -valor
              ELSE 0 
            END
          )
        ) OVER (
          ORDER BY DATE_TRUNC('month', data)
          ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
        ) AS saldo_acumulado
      FROM transacoes
      where EXTRACT(YEAR FROM data) = $1 AND userid = $2
      GROUP BY ano, mes_ano, mes
      ORDER BY ano, mes;
    `;
    const { rows } = await pool.query(query, [ano, userid]);
    return rows;
  },

  // sobra acumulada por mês (considera apenas o que será recebido/pago)
  async getAgrupamentoCategoria(ano, userid) {
    const query = `SELECT
                        cast(categoria as integer) categoria,
                        sum(valor) AS media_mensal
                    FROM transacoes
                    where EXTRACT(YEAR FROM data) = $1 and tipo = 'saida' AND userid = $2
                    GROUP BY categoria
                    ORDER BY categoria;
                    `;
    const { rows } = await pool.query(query, [ano, userid]);
    return rows;
  },

  // opcional: transações filtradas por tipo e status
  async getTransacoes( tipo = null, status = null ) {
    let query = 'SELECT * FROM transacoes WHERE 1=1';
    const params = [];
    if (tipo) {
      params.push(tipo);
      query += ` AND tipo=$${params.length}`;
    }
    if (status) {
      params.push(status);
      query += ` AND status=$${params.length}`;
    }
    query += ' ORDER BY data DESC';
    const { rows } = await pool.query(query, params);
    return rows;
  }
};
