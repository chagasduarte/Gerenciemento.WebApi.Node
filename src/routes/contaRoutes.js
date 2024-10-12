import express from 'express'
import {
    getAllContas,
    getContaById,
    createConta,
    getContasByMesEAno,
    putConta,
    deleteConta
} from '../controllers/contaController.js'
    

const router = express.Router();

router.get('/', getAllContas);
router.get('/mes', getContasByMesEAno);
router.get('/:id', getContaById);
router.post('/', createConta);
router.put('/:id', putConta);
router.delete('/:id', deleteConta);

export default router;