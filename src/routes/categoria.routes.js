import express from "express";
import { CategoriaController } from "../controllers/categoria.controller.js";

const router = express.Router();

router.get("/", CategoriaController.listar);
router.post("/", CategoriaController.criar);
router.get("/:id", CategoriaController.buscar);
router.delete("/:id", CategoriaController.deletar);

export default router;
