import express from 'express'

import {
    getAllParcelas,
    getAllParcelasByMes,
    getAllParcelasByDespesa,
    getParcelaById,
    createParcelas,
    deleteParcela
} from '../controllers/parcelaController.js';

const router = express.Router();

router.get('/', getAllParcelas);
router.get('/Despesa/:id', getAllParcelasByDespesa);
router.get('/Mes',getAllParcelasByMes);
router.get('/:id', getParcelaById);
router.post('/', createParcelas);
router.delete('/Despesa/:id', deleteParcela);

export default router;