import express from "express";
import { ObjetivosController } from "../controllers/objetivos.controller.js";


const router = express.Router();

router.get("/", ObjetivosController.listar);
router.post("/", ObjetivosController.criar);

export default router;
