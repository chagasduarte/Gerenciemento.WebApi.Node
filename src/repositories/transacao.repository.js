import { pool } from "../config/database.js";

export const TransacaoRepository = {
  async criar(transacao, userid) {
    const { tipo, descricao, valor, categoria, data, status, ispaycart, cartaoid } = transacao;
    const result = await pool.query(
      `INSERT INTO transacoes (tipo, descricao, valor, categoria, data, status, userid, ispaycart, cartaoid)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9 )
       RETURNING *`,
      [tipo, descricao, valor, categoria, data, status, userid, ispaycart, cartaoid]
    );
    return result.rows[0];
  },

  async buscarPorId(id) {
    const result = await pool.query(`SELECT * FROM transacoes WHERE id = $1`, [id]);
    return result.rows[0];
  },

  async atualizar(id, transacao) {
    const { tipo, descricao, valor, categoria, data } = transacao;
    const result = await pool.query(
      `UPDATE transacoes
       SET tipo=$1, descricao=$2, valor=$3, categoria=$4, data=$5
       WHERE id=$6
       RETURNING *`,
      [tipo, descricao, valor, categoria, data, id]
    );
    return result.rows[0];
  },

  async excluir(id) {
    await pool.query(`DELETE FROM transacoes WHERE id=$1`, [id]);
    return true;
  },

  async listaTransacoes(tipo = null, status = null, inicio = null, fim = null, userid, cardId = null ) {
    let query = 'SELECT * FROM transacoes WHERE 1=1';
    const params = [];
    // Filtrar por usuário
    if (userid) {
      params.push(userid);
      query += ` AND userid = $${params.length}`;
    }

    // Filtrar por tipo
    if (tipo) {
      params.push(tipo);
      query += ` AND tipo = $${params.length}`;
    }

    // Filtrar por status
    if (status) {
      params.push(status);
      query += ` AND status = $${params.length}`;
    }

    // Filtrar por mês
    if (inicio && fim) {
      params.push(inicio);
      query += ` AND data::date BETWEEN $${params.length}`;
      params.push(fim);
      query += ` AND $${params.length}`;
    }

    if(cardId){
      params.push(cardId);
      query += ` and cartaoid = $${params.length}`;
    }
    
    // Ordenar por data crescente
    query += ' ORDER BY data ASC';

    const result = await pool.query(query, params);
    return result.rows;
  },

  async somaTransacoes( tipo = null, status = null, mes = null, ano = null, userid, ispaycart = null ) {
    let query = 'SELECT sum(valor) as soma FROM transacoes WHERE 1=1';
    const params = [];

     // Filtrar por usuário
    if (userid) {
      params.push(userid);
      query += ` AND userid = $${params.length}`;
    }
    if (ispaycart) {
      params.push(ispaycart);
      query += ` AND ispaycart = $${params.length}`;
    }

    // Filtrar por tipo
    if (tipo) {
      params.push(tipo);
      query += ` AND tipo = $${params.length}`;
    }

    // Filtrar por status
    if (status) {
      params.push(status);
      query += ` AND status = $${params.length}`;
    }

    // Filtrar por mês
    if (mes) {
      params.push(mes);
      query += ` AND EXTRACT(MONTH FROM data) = $${params.length}`;
    }

    // Filtrar por ano
    if (ano) {
      params.push(ano);
      query += ` AND EXTRACT(YEAR FROM data) = $${params.length}`;
    }
    const result = await pool.query(query, params);
    return result.rows[0].soma | 0;
  },

  async listaDespesasParceladas(mes, ano, userid){
    const query = `SELECT
                    descricao, 
                    SUM(valor) AS total_parcelado,
                    SUM(CASE WHEN status = 'pago' THEN valor ELSE 0 END) AS total_pago,
                    SUM(CASE WHEN status = 'pendente' THEN valor ELSE 0 END) AS total_pendente,
                    COUNT(*) AS qtd_parcelas,
                    SUM(CASE WHEN status = 'pago' THEN 1 ELSE 0 END) AS qtd_parcelas_pagas,
                    -- Soma das parcelas pendentes do mês/ano informado
                    SUM(
                      CASE 
                        WHEN status = 'pendente'
                          AND EXTRACT(MONTH FROM data) = $1
                          AND EXTRACT(YEAR FROM data) = $2
                        THEN valor 
                        ELSE 0 
                      END
                    ) AS valor_pendente_mes,
                    -- Define se todas as parcelas estão pagas ou ainda há alguma pendente
                    CASE 
                      WHEN SUM(
                        CASE 
                          WHEN status = 'pendente'
                            AND EXTRACT(MONTH FROM data) = $1
                            AND EXTRACT(YEAR FROM data) = $2
                          THEN 1 
                          ELSE 0 
                        END
                      ) > 0 
                      THEN 'pendente'
                      ELSE 'pago'
                    END AS status
                  FROM transacoes
                  WHERE tipo = 'saida'
                    AND descricao ILIKE '%- Parcela'
                    AND descricao in (select descricao from transacoes d where  
                                              EXTRACT(MONTH FROM data) = $1
                                              AND EXTRACT(YEAR FROM data) = $2
                                              AND descricao ILIKE '%- Parcela' 
                                              and tipo = 'saida')
                    AND userid = $3
                  GROUP BY descricao
                  ORDER BY descricao;`
    const result = await pool.query(query,[mes, ano, userid]);
    return result.rows;
  },

  async agrupamentoTipo(mes, ano, userid) {
    const query = `SELECT 
        sum(valor) as total_tipo, 
        cast(categoria as integer) as categoria
      FROM public.transacoes t
      where t.tipo = 'saida'
        and EXTRACT(MONTH FROM data) = $1
        and EXTRACT(YEAR FROM data) = $2
        AND userid = $3
        and t.status = 'pago'
        and t.categoria is not null
      group by t.categoria
      order by t.categoria;`;
    const result = await pool.query(query, [mes, ano, userid]);
    return result.rows;
  },

  async listaParceladas(inicio, fim, userid, cardId = null) {
    const params = [];
    params.push(inicio);
    params.push(fim);
    params.push(userid);
    let query = `SELECT id, descricao, tipo, valor, categoria, TO_CHAR(t."data"::date, 'YYYY-MM-DD') AS data, status, ispaycart
              FROM public.transacoes t
              where t.tipo = 'saida'
                and t.status = 'pendente'
                AND t."data"::date BETWEEN $1 AND $2
                and descricao like '%Parcela'
                AND userid = $3 `;
    if(cardId){
      params.push(cardId);
      query += `and cartaoid = $4`;
    }

    const result = await pool.query(query, params);
    return result.rows;
  },

  async listaAdicionais(inicio, fim, userid, cardId = null) {
    const params = [];
    params.push(inicio);
    params.push(fim);
    params.push(userid);
    let query = `SELECT id, descricao, tipo, valor, categoria, TO_CHAR(t."data"::date, 'YYYY-MM-DD') AS data, status, ispaycart
              FROM public.transacoes t
              where t.tipo = 'saida'
                and t.status = 'pendente'
                AND t."data"::date BETWEEN $1 AND $2
                and descricao not like '%Parcela'
                AND userid = $3 `;
    if(cardId){
      params.push(cardId);
      query += `and cartaoid = $4`;
    }
    
    const result = await pool.query(query, params);
    return result.rows;
  },

  async uptopago(id) {
    const query = `UPDATE transacoes set status = 'pago' where id = $1`;
    const result  = await pool.query(query, [id]);
    return true;
  },

  async listaDespesa(descricao, userid) {
    const query = `SELECT id, descricao, tipo, valor, categoria, TO_CHAR(t."data"::date, 'YYYY-MM-DD') AS data, status FROM transacoes t WHERE descricao = $1 and userid = $2`;
    const result = await pool.query(query, [descricao, userid]);
    return result.rows;
  },

  async linhaTemporal(ano, userid) {
    const query = `SELECT 
                      COUNT(*) AS total_parcelas, 
                      MAX(data) AS data_fim, 
                      MIN(data) AS data_inicio,
                      descricao 
                  FROM transacoes t 	
                  WHERE EXTRACT(YEAR FROM data) = $1
                    AND t.userid = $2
                    AND t.descricao LIKE '%- Parcela'
                  GROUP BY descricao
                  ORDER BY 
                      EXTRACT(YEAR FROM MIN(data)) ASC,   
                      EXTRACT(MONTH FROM MIN(data)) ASC,  
                      total_parcelas ASC,                 
                      MAX(data) ASC;`;
    const result = await pool.query(query, [ano, userid]);
    console.log(ano, userid)
    return result.rows;
  },

  async buscaPorDia(dia, mes, ano, userid) {
    const query = `SELECT id, descricao, tipo, valor, categoria, TO_CHAR(t."data"::date, 'YYYY-MM-DD') AS data, status
                    FROM public.transacoes t
                    where t.tipo = 'saida'
                      and t.status = 'pendente'
                      and EXTRACT(DAY FROM data) = $1
                      and EXTRACT(MONTH FROM data) = $2
                      and EXTRACT(YEAR FROM data) = $3
                      and ispaycart = true
                      AND userid = $4`;
    const result = await pool.query(query, [dia, mes, ano, userid]);
    return result.rows;
  }
};
