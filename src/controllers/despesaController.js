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
        if (result.rows.length === 0) {
            return res.status(404).send('Despesa não encontrada');
        }
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send('Erro ao buscar a despesa');
    }
};

// Buscar uma despesa parceladas
export const getDespesasParceladas = async (req, res) => {
    const { ano } = req.query;
    try {
        const result = await pool.query('SELECT * FROM "Despesas" WHERE "IsParcelada" and EXTRACT(YEAR FROM "DataCompra") = $1', [ano]);
        if (result.rows.length === 0) {
            return res.status(404).send('Despesa não encontrada');
        }
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
        if (result.rows.length === 0) {
            return res.status(404).send('Despesa não encontrada');
        }
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
        if (result.rows.length === 0) {
            return res.status(404).send('Despesa não encontrada');
        }
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
        if (result.rows.length === 0) {
            return res.status(404).send('Despesa não encontrada');
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).send('Erro ao buscar a despesa');
    }
};

// Criar uma nova despesa
export const createDespesa = async (req, res) => {
    const { Nome, Descricao, TipoDespesa, IsParcelada, ValorTotal, ValorPago, DataCompra, IsPaga } = req.body;

    // Validação simples
    if (!Nome || !Descricao || ValorTotal === undefined || ValorPago === undefined || !DataCompra) {
        return res.status(400).send('Todos os campos obrigatórios devem ser preenchidos');
    }

    try {
        const result = await pool.query(
            'INSERT INTO "Despesas" (Nome, Descricao, TipoDespesa, IsParcelada, ValorTotal, ValorPago, DataCompra, IsPaga) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
            [Nome, Descricao, TipoDespesa, IsParcelada, ValorTotal, ValorPago, new Date(DataCompra), IsPaga]
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
