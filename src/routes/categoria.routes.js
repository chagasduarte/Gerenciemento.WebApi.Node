import express from "express";
import { CategoriaController } from "../controllers/categoria.controller.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Categorias
 *   description: Gerenciamento de categorias de transações
 */

/**
 * @swagger
 * /categorias:
 *   get:
 *     summary: Lista todas as categorias
 *     tags: [Categorias]
 *     responses:
 *       200:
 *         description: Lista de categorias
 *   post:
 *     summary: Cria uma nova categoria
 *     tags: [Categorias]
 *     responses:
 *       201:
 *         description: Categoria criada
 * 
 * /categorias/{id}:
 *   get:
 *     summary: Busca uma categoria pelo ID
 *     tags: [Categorias]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Categoria encontrada
 *   delete:
 *     summary: Exclui uma categoria pelo ID
 *     tags: [Categorias]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Categoria excluída
 */
router.get("/", CategoriaController.listar);
router.post("/", CategoriaController.criar);
router.get("/:id", CategoriaController.buscar);
router.delete("/:id", CategoriaController.deletar);

export default router;
