import express from 'express'

import {
    getAllDespesas,
    getDespesaById,
    createDespesa,
    getDespesasByAno,
    getDespesasByMes,
    getDespesasParceladas,
    getDespesasAdicionais,
    updateDespesa,
    deleteDespesa
} from '../controllers/despesaController.js';

const router = express.Router();

router.get('/', getAllDespesas);
router.get('/Mes', getDespesasByMes);
router.get('/Ano', getDespesasByAno);
router.get('/Parceladas', getDespesasParceladas);
router.get('/Adicionais', getDespesasAdicionais);
router.get('/:id', getDespesaById);
router.post('/', createDespesa);
router.put('/:id', updateDespesa);
router.delete('/:id', deleteDespesa);

export default router;