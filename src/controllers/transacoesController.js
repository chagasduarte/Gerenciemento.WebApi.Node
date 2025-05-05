import pool from '../database/db.js';

// Buscar todas as contas
export const getAllTransacoes = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM transacoes');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send('Erro ao buscar contas');
    }
};

export const getAllEntradas = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM transacoes where  tipo = "entrada"');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send('Erro ao buscar contas');
    }
};

export const getAllSaidas = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM transacoes where  tipo = "saida"');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send('Erro ao buscar contas');
    }
};

export const getTransacaoById = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('SELECT * FROM transacoes WHERE id = $1', [id]);
        if (result.rows.length === 0) {
            return res.status(404).send('Conta não encontrada');
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).send('Erro ao buscar a conta');
    }
};

export const createTransacao = async (req, res) => {
    const { conta_id, tipo, nome, descricao, valor, data, status } = req.body;

    if (conta_id == undefined|| !tipo || !nome || !descricao || valor == undefined || data == undefined || !status) {
        return res.status(400).send(req.body);
    }

    try {
        const result = await pool.query(
            'INSERT INTO transacoes (conta_id, tipo, nome, descricao, valor, data, status) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
            [conta_id, tipo, nome, descricao, valor, data, status]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).send('Erro ao criar conta');
    }
};


export const putTransacao = async (req, res) => {
    const { id } = req.params;
    const { conta_id, tipo, nome, descricao, valor, data, status} = req.body;
    try {
        const result = await pool.query('UPDATE transacoes SET conta_id = $2, tipo = $3, nome = $4, descricao = $5, valor = $6, data = $7, status = $8 WHERE id = $1', [id, conta_id, tipo, nome, descricao, valor, data, status]);
        if (result.rowCount === 0) {
            return res.status(404).json({ mensagem: 'Conta não encontrada' });
        }
        res.status(204).send();
    } catch (err) {
        console.error(err);
        res.status(500).send('Erro ao deletar tarefa');
    }
};