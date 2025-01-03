import express from 'express'

import {
    getAllObjetivos,
    createObjetivo,
    getObjetivoById,
    updateDespesa
} from '../controllers/objetivoController.js';

const router = express.Router();

router.get('/', getAllObjetivos);
router.get('/Despesa/:id', getObjetivoById);
router.post('/', createObjetivo);
router.delete('/Despesa/:id', updateDespesa);

export default router;