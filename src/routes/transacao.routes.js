import express from "express";
import { TransacaoController } from "../controllers/transacao.controller.js";

const router = express.Router();

router.get("/parceladas", TransacaoController.listaDespesasParceladas);
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
