import express from 'express'

import {
    getAllParcelas,
    getAllParcelasByMes,
    getAllParcelasByDespesa,
    getAllParcelasByAno,
    getParcelaById,
    createParcelas,
    deleteParcela,
    putParcela
} from '../controllers/parcelaController.js';

const router = express.Router();

router.get('/', getAllParcelas);
router.get('/Despesa/:id', getAllParcelasByDespesa);
router.get('/Mes',getAllParcelasByMes);
router.get('/Ano', getAllParcelasByAno);
router.get('/:id', getParcelaById);
router.post('/', createParcelas);
router.delete('/Despesa/:id', deleteParcela);
router.put('/:id', putParcela);

export default router;