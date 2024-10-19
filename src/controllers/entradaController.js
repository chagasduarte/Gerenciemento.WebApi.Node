import pool from '../database/db.js';

// GET: /api/Entradas
export const getAllEntradas = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM "Entradas"');
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar Entradas', error });
    }
};

// GET: /api/Entradas/:id
export const getEntradaById = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('SELECT * FROM "Entradas" WHERE "Id" = $1', [id]);
        if (result.rows.length === 0) {
            return res.status(404).send('Entrada não encontrada');
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).send('Erro ao buscar a Entrada');
    }
};

// POST: /api/Entradas
export const createEntrada = async (req, res) => {
    const { nome, valor, contaId, dataDebito, status, isFixo } = req.body;

    // Validação simples
    if (!nome || valor === undefined || !contaId || !dataDebito) {
        return res.status(400).send('Todos os campos obrigatórios devem ser preenchidos');
    }

    try {
        const result = await pool.query(
            'INSERT INTO "Entradas" ("Nome", "Valor", "ContaId", "DataDebito", "Status", "IsFixo") VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
            [nome, valor, contaId, new Date(dataDebito), status, isFixo]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).send('Erro ao criar Parcela');
    }
};

// PUT: /api/Entradas/:id
export const updateEntrada = async (req, res) => {
    const {id} = req.params
    const { Nome , Valor , Status , IsFixo , DataDebito , ContaId } = req.body;

    if (!Nome || !Valor || !DataDebito || IsFixo === undefined || !ContaId || Status === undefined) {
        return res.status(400).json({ message: 'Dados inválidos' });
    }

    try {
        const result = await pool.query('UPDATE "Entradas" SET "Nome" = $2, "Valor" = $3, "Status" = $4, "IsFixo" = $5, "DataDebito" = $6, "ContaId" = $7 WHERE "Id" = $1', 
            [id, Nome , Valor , Status , IsFixo , DataDebito , ContaId]);


        if (!result) {
            return res.status(404).json({ message: 'Entrada não encontrada' });
        }

        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao atualizar Entrada', error });
    }
};

// DELETE: /api/Entradas/:id
export const deleteEntrada = async (req, res) => {
    try {
        const Entrada = await Entrada.findByIdAndDelete(req.params.id);
        if (!Entrada) {
            return res.status(404).json({ message: 'Entrada não encontrada' });
        }
        res.status(200).json({ message: 'Entrada removida com sucesso' });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao deletar Entrada', error });
    }
};
