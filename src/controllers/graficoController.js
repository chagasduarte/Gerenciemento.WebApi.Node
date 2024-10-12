import pool from '../database/db.js';
import query from '../query/consultaInfoGraficos.js'

// Buscar todas as Parcelas
export const getAllDados = async (req, res) => {
    const ano = req.query;
    
    try {
        const result = await pool.query(query(ano.ano));
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send(ano);
    }
};

