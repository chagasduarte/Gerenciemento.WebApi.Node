import express from "express";
import { CartaoController } from "../controllers/cartoes.controller.js";


const router = express.Router();

router.get("/", CartaoController.listar);
router.post("/", CartaoController.criar);

export default router;
