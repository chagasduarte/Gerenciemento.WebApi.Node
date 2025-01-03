import pool from '../database/db.js';

// Buscar todas as despesas
export const getAllObjetivos = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM "objetivos"');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send('Erro ao buscar despesas');
    }
};


// Buscar uma despesa específica pelo ID
export const getObjetivoById = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('SELECT * FROM "objetivos" WHERE "Id" = $1', [id]);
        if (result.rows.length === 0) {
            return res.status(404).send('objetivo não encontrada');
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).send('Erro ao buscar a objetivo');
    }
};


// Criar uma nova despesa
export const createObjetivo = async (req, res) => {
    const { nome, detalhe, valortotal, valorarrecadado } = req.body;

    // Validação simples
    if (!nome || !detalhe || valortotal === undefined || valorarrecadado == undefined) {
        return res.status(400).send('Todos os campos obrigatórios devem ser preenchidos');
    }

    try {
        const result = await pool.query(
            'INSERT INTO objetivos (nome, detalhe, valortotal, valorarrecadado) VALUES ($1, $2, $3, $4); RETURNING *',
            [nome, detalhe, valortotal, valorarrecadado]
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
    const { nome, detalhe, valortotal, valorarrecadado } = req.body;

    // Validação simples
    if (!nome || !detalhe || valortotal === undefined || valorarrecadado == undefined) {
        return res.status(400).send('Todos os campos obrigatórios devem ser preenchidos');
    }

    try {
        const result = await pool.query(
           `UPDATE "objetivos" 
            SET nome = $2, detalhe = $2, valortotal = $3, valorarrecadado = $4
            WHERE "Id" = $1`,
            [id, nome, detalhe, valortotal, valorarrecadado]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).send('Erro ao criar despesa');
    }
};
