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
    const { Nome, Valor, ContaId, DataDebito, Status, IsFixo } = req.body;

    // Validação simples
    if (!Nome || Valor === undefined || !ContaId || !DataDebito) {
        return res.status(400).send('Todos os campos obrigatórios devem ser preenchidos');
    }

    try {
        const result = await pool.query(
            'INSERT INTO "Entradas" (Nome, Valor, ContaId, DataDebito, Status, IsFixo) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
            [Nome, Valor, ContaId, new Date(DataDebito), Status, IsFixo]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).send('Erro ao criar Parcela');
    }
};

// PUT: /api/Entradas/:id
export const updateEntrada = async (req, res) => {
    const { DespesaId, Valor, DataVencimento, IsPaga } = req.body;

    if (!DespesaId || !Valor || !DataVencimento || IsPaga === undefined) {
        return res.status(400).json({ message: 'Dados inválidos' });
    }

    try {
        const EntradaAtualizada = await Entrada.findByIdAndUpdate(
            req.params.id,
            { DespesaId, Valor, DataVencimento, IsPaga },
            { new: true, runValidators: true }
        );

        if (!EntradaAtualizada) {
            return res.status(404).json({ message: 'Entrada não encontrada' });
        }

        res.status(200).json(EntradaAtualizada);
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
