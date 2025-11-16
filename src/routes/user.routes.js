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

router.post('/', UserController.criar);
router.get('/avatar', UserController.getAvatar);
router.post('/:id/avatar', upload.single('avatar'), UserController.uploadAvatar);
router.get('/:id/avatar', autentication, UserController.getAvatar);

export default router;
