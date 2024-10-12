import express from 'express'
import {
    getAllEntradas,
    getEntradaById,
    createEntrada,
    deleteEntrada
} from '../controllers/entradaController.js';

const router = express.Router();

router.get('/', getAllEntradas);
router.get('/:id', getEntradaById);
router.post('/', createEntrada);
router.delete('/', deleteEntrada);

export default router;