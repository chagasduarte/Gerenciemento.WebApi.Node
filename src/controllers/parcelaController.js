import pool from '../database/db.js';
import insereParcelas from '../query/insereParcelas.js';

// Buscar todas as Parcelas
export const getAllParcelas = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM "Parcelas"');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send('Erro ao buscar Parcelas');
    }
};

// Buscar todas as Parcelas by Mes
export const getAllParcelasByMes = async (req, res) => {
    const {mes, ano} = req.query;
    try {
        const result = await pool.query('SELECT * FROM "Parcelas" WHERE EXTRACT(YEAR FROM "DataVencimento") = $1 AND EXTRACT(MONTH FROM "DataVencimento") = $2',[ano, mes]);
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send('Erro ao buscar Parcelas');
    }
};


// Buscar todas as Parcelas by Despesa
export const getAllParcelasByDespesa = async (req, res) => {
    const {id} = req.params;
    try {
        const result = await pool.query('SELECT * FROM "Parcelas" WHERE "DespesaId" = $1',[id]);
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send('Erro ao buscar Parcelas');
    }
};
// Buscar uma Parcela específica pelo ID
export const getParcelaById = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('SELECT * FROM "Parcelas" WHERE "Id" = $1', [id]);
        if (result.rows.length === 0) {
            return res.status(404).send('Parcela não encontrada');
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).send('Erro ao buscar a Parcela');
    }
};

// Criar uma nova Parcela
export const createParcela = async (req, res) => {
    const { DespesaId, Valor, DataVencimento, IsPaga } = req.body;

    // Validação simples
    if (DespesaId === undefined || Valor === undefined || !DataVencimento, IsPaga === undefined) {
        return res.status(400).send('Todos os campos obrigatórios devem ser preenchidos');
    }
    try {
        const result = await pool.query('INSERT INTO "Parcelas" (DespesaId, Valor, DataVencimento, IsPaga) VALUES ($1, $2, $3, $4) RETURNING *', [DespesaId, Valor, DataVencimento, IsPaga]);
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).send('Erro ao criar Parcela');
    }
};

// Criar uma nova Parcela
export const createParcelas = async (req, res) => {
    const { DataCompra, IdDespesa, QtdParcelas, Valor } = req.body;

    // Validação simples
    if ( Valor === undefined || !QtdParcelas || !IdDespesa || !DataCompra) {
        return res.status(400).send('Todos os campos obrigatórios devem ser preenchidos');
    }
    
    try {
        const result = await pool.query(insereParcelas(DataCompra, IdDespesa, QtdParcelas, Valor));
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).send(err);
    }
};

export const deleteParcela = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('DELETE FROM "Parcelas" WHERE "Id" = $1', [id]);
        if (result.rowCount === 0) {
            return res.status(404).json({ mensagem: 'Parcela não encontrada' });
        }
        res.status(204).send();
    } catch (err) {
        console.error(err);
        res.status(500).send('Erro ao deletar Despesa');
    }
}

