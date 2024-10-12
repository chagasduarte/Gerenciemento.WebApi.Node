import express from 'express'

import {
    getAllDados
} from '../controllers/graficoController.js';

const router = express.Router();

router.get('/', getAllDados);

export default router;