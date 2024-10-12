import pool from '../database/db.js';
import queryGraficos from '../query/consultaInfoGraficos.js'

// Buscar todas as Parcelas
export const getAllDados = async (req, res) => {
    try {
        const ano = req.query;
        const result = await pool.query(queryGraficos);
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send('Erro ao buscar Parcelas');
    }
};

