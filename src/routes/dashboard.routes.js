import express from "express";
import { DashboardController } from "../controllers/dashboard.controller.js";

const router = express.Router();

router.get("/resumo", DashboardController.getResumo);
router.get("/transacoes", DashboardController.getTransacoesFiltradas);
router.get("/projecao", DashboardController.buscaProjecao);
router.get("/agrupamento", DashboardController.buscaAgrupamentoCategoria);

export default router;
