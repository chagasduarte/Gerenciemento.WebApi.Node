import express from 'express'

import {
    getAllDados,
    getAllDadosPizza
} from '../controllers/graficoController.js';

const router = express.Router();

router.get('/', getAllDados);
router.get('/Pizza', getAllDadosPizza);

export default router;