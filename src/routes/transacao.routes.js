import express from "express";
import { TransacaoController } from "../controllers/transacao.controller.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Transações
 *   description: Gerenciamento de transações financeiras
 */

/**
 * @swagger
 * /transacoes/parceladas:
 *   get:
 *     summary: Lista despesas parceladas
 *     tags: [Transações]
 *     responses:
 *       200:
 *         description: Lista de despesas parceladas
 *   post:
 *     summary: Cria uma nova despesa parcelada
 *     tags: [Transações]
 *     responses:
 *       201:
 *         description: Despesa parcelada criada
 * 
 * /transacoes/extrato:
 *   get:
 *     summary: Obtém o extrato de transações
 *     tags: [Transações]
 *     responses:
 *       200:
 *         description: Extrato retornado
 * 
 * /transacoes/agrupadaPorTipos:
 *   get:
 *     summary: Obtém transações agrupadas por tipo
 *     tags: [Transações]
 *     responses:
 *       200:
 *         description: Agrupamento retornado
 * 
 * /transacoes/entradas:
 *   get:
 *     summary: Lista apenas as entradas
 *     tags: [Transações]
 *     responses:
 *       200:
 *         description: Lista de entradas
 * 
 * /transacoes/despesa:
 *   get:
 *     summary: Lista apenas as despesas
 *     tags: [Transações]
 *     responses:
 *       200:
 *         description: Lista de despesas
 * 
 * /transacoes/linhatemporal:
 *   get:
 *     summary: Obtém a linha temporal das transações
 *     tags: [Transações]
 *     responses:
 *       200:
 *         description: Linha temporal retornada
 * 
 * /transacoes/pordia:
 *   get:
 *     summary: Busca transações por dia
 *     tags: [Transações]
 *     responses:
 *       200:
 *         description: Transações por dia
 * 
 * /transacoes:
 *   get:
 *     summary: Lista todas as transações
 *     tags: [Transações]
 *     responses:
 *       200:
 *         description: Lista de transações
 *   post:
 *     summary: Cria uma nova transação
 *     tags: [Transações]
 *     responses:
 *       201:
 *         description: Transação criada
 * 
 * /transacoes/{id}:
 *   get:
 *     summary: Busca uma transação pelo ID
 *     tags: [Transações]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Transação encontrada
 *   put:
 *     summary: Atualiza uma transação pelo ID
 *     tags: [Transações]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Transação atualizada
 *   delete:
 *     summary: Exclui uma transação pelo ID
 *     tags: [Transações]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Transação excluída
 * 
 * /transacoes/topago/{id}:
 *   get:
 *     summary: Marca uma transação como paga/recebida
 *     tags: [Transações]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Status atualizado
 */
router.get("/parceladas", TransacaoController.listaDespesasParceladas);
router.get("/extrato", TransacaoController.extrato);
router.post("/save", TransacaoController.saveNewUser);
router.post("/parceladas", TransacaoController.criarParcelada);
router.get("/agrupadaPorTipos", TransacaoController.agrupamentoTipo);
router.get("/entradas", TransacaoController.listarEntradas);
router.get("/topago/:id", TransacaoController.receber);
router.get("/despesa", TransacaoController.listaDespesa);
router.get("/linhatemporal", TransacaoController.linhaTemporal);
router.get('/pordia', TransacaoController.buscaPorDia);
router.get("/", TransacaoController.listar);
router.get("/:id", TransacaoController.buscar);
router.post("/", TransacaoController.criar);
router.put("/:id", TransacaoController.atualizar);
router.delete("/:id", TransacaoController.excluir);

export default router;
