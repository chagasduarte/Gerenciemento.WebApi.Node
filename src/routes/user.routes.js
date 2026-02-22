import express from 'express';
import { UserController } from '../controllers/user.controller.js';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { autentication } from '../middlewares/autentication.js';

// Correção do __dirname no ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const router = express.Router();

// Cria pasta 'uploads' se não existir
const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
// Configuração do Multer (armazenamento em disco)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});
const upload = multer({ storage });

/**
 * @swagger
 * /user:
 *   post:
 *     summary: Cria um novo usuário
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *               email:
 *                 type: string
 *               senha:
 *                 type: string
 *               avatar:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Usuário criado com sucesso
 * 
 * /user/avatar:
 *   get:
 *     summary: Obtém o avatar do usuário logado
 *     tags: [User]
 *     responses:
 *       200:
 *         description: Avatar retornado
 * 
 * /user/{id}/avatar:
 *   post:
 *     summary: Faz upload de um avatar para um usuário específico
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               avatar:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Avatar enviado com sucesso
 *   get:
 *     summary: Obtém o avatar de um usuário específico
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Avatar retornado
 */
router.post('/', upload.single("avatar"), UserController.criar);
router.get('/avatar', UserController.getAvatar);
router.post('/:id/avatar', upload.single('avatar'), UserController.uploadAvatar);
router.get('/:id/avatar', await autentication, UserController.getAvatar);

export default router;
