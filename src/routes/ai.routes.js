import express from 'express';
import { AiController } from '../controllers/ai.controller.js';

const router = express.Router();

// Define a rota de predição via IA (protegida pela autenticação configurada em index.js)
router.post('/chat', AiController.processMessage);

export default router;
