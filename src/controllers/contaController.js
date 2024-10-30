import pool from '../database/db.js';

// Buscar todas as contas
export const getAllContas = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM "Contas"');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send('Erro ao buscar contas');
    }
};

export const getContasByMesEAno = async (req, res) => {
    try {
        const { mes, ano } = req.query; // Recebe dois parâmetros
        const result = await pool.query('SELECT * FROM "Contas" WHERE "Mes" = $1 AND "Ano" = $2', [mes, ano]);
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send('Erro ao buscar contas');
    }
};

// Buscar uma conta específica
export const getContaById = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('SELECT * FROM "Contas" WHERE "Id" = $1', [id]);
        if (result.rows.length === 0) {
            return res.status(404).send('Conta não encontrada');
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).send('Erro ao buscar a conta');
    }
};

// Criar uma nova conta
export const createConta = async (req, res) => {
    const { Nome, Descricao, Credito, Debito, Mes, Ano } = req.body;

    if (!Nome || !Descricao || !Mes || !Ano) {
        return res.status(400).send(req.body);
    }

    try {
        const result = await pool.query(
            'INSERT INTO "Contas" ("Nome", "Descricao", "Credito", "Debito", "Mes", "Ano") VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
            [Nome, Descricao, Credito, Debito, Mes, Ano]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).send('Erro ao criar conta');
    }
};

export const deleteConta = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('DELETE FROM "Contas" WHERE "Id" = $1', [id]);
        if (result.rowCount === 0) {
            return res.status(404).json({ mensagem: 'Conta não encontrada' });
        }
        res.status(204).send();
    } catch (err) {
        console.error(err);
        res.status(500).send('Erro ao deletar tarefa');
    }
};


export const putConta = async (req, res) => {
    const { id } = req.params;
    const { Id, Nome, Descricao, Credito, Debito, Mes, Ano} = req.body;
    try {
        const result = await pool.query('UPDATE "Contas" SET "Nome" = $2, "Descricao" = $3, "Credito" = $4, "Debito" = $5, "Mes" = $6, "Ano" = $7 WHERE "Id" = $1', [id, Nome, Descricao, Credito, Debito, Mes, Ano]);
        if (result.rowCount === 0) {
            return res.status(404).json({ mensagem: 'Conta não encontrada' });
        }
        res.status(204).send();
    } catch (err) {
        console.error(err);
        res.status(500).send('Erro ao deletar tarefa');
    }
};
