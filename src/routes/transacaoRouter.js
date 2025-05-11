import express from 'express'
import {
   createTransacao,
   getAllSaidas,
   getAllTransacoes,
   getTransacaoById,
   putTransacao
} from '../controllers/transacoesController.js'
import { getAllEntradas } from '../controllers/entradaController.js';
    

const router = express.Router();

router.get('/', getAllTransacoes);
router.get('/Entradas', getAllEntradas);
router.get('/Saidas', getAllSaidas);
router.get('/Entradas/:id', getTransacaoById);
router.get('/Saidas/:id', getTransacaoById);
router.post('/', createTransacao);
router.put('/:id', putTransacao);

export default router;