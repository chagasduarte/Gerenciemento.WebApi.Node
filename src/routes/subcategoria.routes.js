import express from "express";
import { SubcategoriaController } from "../controllers/subcategoria.controller.js";

const router = express.Router();

router.get("/", SubcategoriaController.listar);
router.post("/", SubcategoriaController.criar);
router.get("/categoria/:idcategoria", SubcategoriaController.listarPorCategoria);
router.get("/:id", SubcategoriaController.buscar);
router.delete("/:id", SubcategoriaController.deletar);

export default router;
