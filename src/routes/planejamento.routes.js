import { Router } from "express";
import { PlanejamentoController } from "../controllers/planejamento.controller.js";

const router = Router();

router.post("/", PlanejamentoController.criar);
router.put("/:id", PlanejamentoController.atualizar);
router.delete("/:id", PlanejamentoController.deletar);
router.get("/", PlanejamentoController.listar);
router.get("/:id", PlanejamentoController.buscar);

export default router;
