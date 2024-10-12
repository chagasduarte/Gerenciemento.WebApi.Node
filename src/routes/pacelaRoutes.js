import express from 'express'

import {
    getAllParcelas,
    getAllParcelasByMes,
    getAllParcelasByDespesa,
    getParcelaById,
    createParcela,
    deleteParcela
} from '../controllers/parcelaController.js';

const router = express.Router();

router.get('/', getAllParcelas);
router.get('/Despesa/:id', getAllParcelasByDespesa);
router.get('/Mes',getAllParcelasByMes);
router.get('/:id', getParcelaById);
router.post('/', createParcela);
router.delete('/', deleteParcela);

export default router;