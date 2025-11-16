import express from 'express';
import { UserController } from '../controllers/user.controller.js';

const router = express.Router();

router.post('/', UserController.criar);

export default router;
