import express from 'express'


import {
  getAllLogs,
  postLog
} from "../controllers/logMensalController.js";

const router = express.Router();

router.get('/', getAllLogs);
router.post('/', postLog);

export default router;