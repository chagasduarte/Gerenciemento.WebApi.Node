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
  async getSaldoAcumulado(data_inicio, data_fim, userid) {

  // 1 — SALDO ACUMULADO DE TRANSACOES NORMAIS (SEM CARTÃO)
  const querySemCartao = `
    SELECT COALESCE(SUM(
      CASE 
        WHEN tipo = 'entrada' THEN valor
        WHEN tipo = 'saida' THEN -valor
        ELSE 0
      END
    ), 0) AS total
    FROM transacoes
    WHERE userid = $1
      AND cartaoid IS NULL
      AND data::date >= $2::date
      AND data::date <= $3::date;
  `;

  const { rows: semCartaoRows } = await pool.query(querySemCartao, [
    userid,
    data_inicio,
    data_fim
  ]);

  let saldoSemCartao = semCartaoRows[0].total || 0;


  // 2 — BUSCAR OS CARTÕES DO USUÁRIO
  const cartoes = await pool.query(`
    SELECT id, dia_fatura
    FROM cartoes
    WHERE userid = $1
  `, [userid]);


  let saldoCartoes = 0;

  // 3 — PARA CADA CARTÃO, CALCULAR SALDO PAGO NO PERÍODO DA FATURA
  for (const cartao of cartoes.rows) {

    const cartaoId = cartao.id;
    const diaFatura = cartao.dia_fatura; // agora é INTEGER

    // Converter datas
    const inicioDate = new Date(data_inicio);
    const fimDate = new Date(data_fim);

    // Gerar período baseado na fatura
    // Exemplo: fatura dia 28 => período 28 do mês anterior até 27 do mês atual

    const inicioCartao = new Date(inicioDate);
    inicioCartao.setDate(diaFatura - 1);
    inicioCartao.setMonth(inicioDate.getMonth() - 1);

    const fimCartao = new Date(inicioCartao);
    fimCartao.setMonth(inicioCartao.getMonth() + 1);
    fimCartao.setDate(diaFatura - 1);

    const periodo_inicio = inicioCartao.toISOString().split("T")[0];
    const periodo_fim = fimCartao.toISOString().split("T")[0];

    // 4 — Soma das transações do cartão no período da fatura
    const queryCartao = `
      SELECT COALESCE(SUM(
        CASE 
          WHEN tipo = 'entrada' THEN valor
          WHEN tipo = 'saida' THEN -valor
          ELSE 0
        END
      ), 0) AS total
      FROM transacoes
      WHERE userid = $1
        AND cartaoid = $2
        AND data::date >= $3::date
        AND data::date <= $4::date;
    `;

    const { rows } = await pool.query(queryCartao, [
      userid,
      cartaoId,
      periodo_inicio,
      periodo_fim
    ]);

    saldoCartoes += rows[0].total || 0;
  }


  // 5 — Retorno final
  return Number(saldoSemCartao | 0) + Number(saldoCartoes | 0);
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
