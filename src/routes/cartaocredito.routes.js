import express from 'express';
import { CartaoCreditoController } from '../controllers/cartaocredito.controller.js';

const router = express.Router();

// Criar novo cartão
router.get('/pormes', CartaoCreditoController.listarPosMes);
router.post('/', CartaoCreditoController.criar);

// Listar todos os cartões
router.get('/', CartaoCreditoController.listarTodos);
// Buscar cartão por ID
router.get('/:id', CartaoCreditoController.buscarPorId);

// Atualizar cartão
router.put('/:id', CartaoCreditoController.atualizar);

// Excluir cartão
router.delete('/:id', CartaoCreditoController.excluir);

export default router;
