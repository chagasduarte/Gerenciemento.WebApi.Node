import pool from '../database/db.js';
import query from '../query/consultaInfoGraficos.js'
import queryPizza from '../query/consultaInfoGraficosPizza.js'

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

export const getAllDadosPizza = async (req, res) => {
    const ano = req.query;
    
    try {
        const result = await pool.query(queryPizza(ano.ano));
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send(ano);
    }
};
