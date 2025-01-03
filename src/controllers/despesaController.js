import pool from '../database/db.js';

// Buscar todas as despesas
export const getAllDespesas = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM "Despesas"');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send('Erro ao buscar despesas');
    }
};


// Buscar uma despesas pelo ano
export const getDespesasByAno = async (req, res) => {
    const { ano } = req.params;
    try {
        const result = await pool.query('SELECT * FROM "Despesas" WHERE EXTRACT(YEAR FROM "DataCompra") = $1', [ano]);
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send('Erro ao buscar a despesa');
    }
};

// Buscar uma despesa parceladas
export const getDespesasParceladasNaoPagas = async (req, res) => {
    const { mes, ano } = req.query;
    try {
        const result = await pool.query(`SELECT 
                                            d."Id",
                                            d."Nome",
                                            d."Descricao",
                                            d."TipoDespesa",
                                            d."IsParcelada",
                                            d."ValorTotal",
                                            d."DataCompra",
                                            d."IsPaga",
                                            d."ValorPago",
                                            COUNT(pa."Id") AS "Parcelas",
                                            COUNT(CASE WHEN pa."IsPaga" = 1 THEN 1 END) AS "ParcelasPagas"
                                        FROM "Despesas" d
                                        INNER JOIN "Parcelas" p 
                                        ON p."DespesaId" = d."Id"
                                        AND EXTRACT(MONTH FROM p."DataVencimento") = $2
                                        AND EXTRACT(YEAR FROM p."DataVencimento") = $1
                                        AND (p."IsPaga" = 0 OR p."IsPaga" = 3)
                                        LEFT JOIN "Parcelas" pa ON pa."DespesaId" = d."Id" 
                                        GROUP BY 
                                            d."Id"`, [ano, mes]);

        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send('Erro ao buscar a despesa');
    }
};


// Buscar uma despesa parceladas
export const getDespesasParceladasTodas = async (req, res) => {
    const { mes, ano } = req.query;
    try {
        const result = await pool.query(`SELECT distinct d.* FROM "Despesas" d
                                         INNER JOIN "Parcelas" p 
                                            ON p."DespesaId" = d."Id"
                                            AND EXTRACT(MONTH FROM p."DataVencimento") = $2
                                         WHERE EXTRACT(YEAR FROM p."DataVencimento") = $1`, [ano, mes]);
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send('Erro ao buscar a despesa');
    }
};

// Buscar uma despesa Adicionais
export const getDespesasAdicionais = async (req, res) => {
    const { ano } = req.query;
    try {
        const result = await pool.query('SELECT * FROM "Despesas" WHERE NOT "IsParcelada" and EXTRACT(YEAR FROM "DataCompra") = $1', [ano]);
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send('Erro ao buscar a despesa');
    }
};


// Buscar uma despesa Adicionais
export const getDespesasByMes = async (req, res) => {
    const { mes, ano } = req.query;
    try {
        const result = await pool.query('SELECT * FROM "Despesas" WHERE NOT "IsParcelada" and EXTRACT(YEAR FROM "DataCompra") = $1 and EXTRACT(MONTH FROM "DataCompra") = $2', [ano, mes]);

        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send('Erro ao buscar a despesa');
    }
};


// Buscar uma despesa específica pelo ID
export const getDespesaById = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('SELECT * FROM "Despesas" WHERE "Id" = $1', [id]);
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).send('Erro ao buscar a despesa');
    }
};

// Criar uma nova despesa
export const createDespesa = async (req, res) => {
    const { nome, descricao, tipoDespesa, isParcelada, valorTotal, valorPago, dataCompra } = req.body;
    const IsParcelada = isParcelada === undefined? false : isParcelada;
    const IsPaga = false;
    const ValorPago = valorPago === undefined? 0 : valorPago;
    // Validação simples
    if (!nome || !descricao || valorTotal === undefined || !dataCompra) {
        return res.status(400).send('Todos os campos obrigatórios devem ser preenchidos');
    }

    try {
        const result = await pool.query(
            'INSERT INTO "Despesas" ("Nome", "Descricao", "TipoDespesa", "IsParcelada", "ValorTotal", "ValorPago", "DataCompra", "IsPaga") VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
            [nome, descricao, tipoDespesa, IsParcelada, valorTotal, ValorPago, new Date(dataCompra), IsPaga]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).send('Erro ao criar despesa');
    }
};


// Atualizar uma nova despesa
export const updateDespesa = async (req, res) => {
    const { id } = req.params;
    const { Id, Nome, Descricao, TipoDespesa, IsParcelada, ValorTotal, ValorPago, DataCompra, IsPaga } = req.body;

    // Validação simples
    if (!Nome || !Descricao || ValorTotal === undefined || ValorPago === undefined || !DataCompra) {
        return res.status(400).send('Todos os campos obrigatórios devem ser preenchidos');
    }

    try {
        const result = await pool.query(
           `UPDATE "Despesas" 
            SET "Nome" = $2, 
                "Descricao" = $3, 
                "TipoDespesa" = $4, 
                "IsParcelada" = $5, 
                "ValorTotal" = $6, 
                "ValorPago" = $7, 
                "DataCompra" = $8, 
                "IsPaga" = $9 
            WHERE "Id" = $1`,
            [id, Nome, Descricao, TipoDespesa, IsParcelada, ValorTotal, ValorPago, new Date(DataCompra), IsPaga]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).send('Erro ao criar despesa');
    }
};

export const deleteDespesa = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('DELETE FROM "Despesas" WHERE "Id" = $1', [id]);
        if (result.rowCount === 0) {
            return res.status(404).json({ mensagem: 'Despesa não encontrada' });
        }
        res.status(204).send();
    } catch (err) {
        console.error(err);
        res.status(500).send('Erro ao deletar Despesa');
    }
}
