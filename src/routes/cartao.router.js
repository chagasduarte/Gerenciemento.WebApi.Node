import express from "express";
import { CartaoController } from "../controllers/cartoes.controller.js";


const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Cartões
 *   description: Gerenciamento de cartões de crédito
 */

/**
 * @swagger
 * /cartao:
 *   get:
 *     summary: Lista todos os cartões
 *     tags: [Cartões]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de cartões
 *   post:
 *     summary: Cria um novo cartão
 *     tags: [Cartões]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Cartão criado
 */
router.get("/", CartaoController.listar);
router.post("/", CartaoController.criar);

export default router;
