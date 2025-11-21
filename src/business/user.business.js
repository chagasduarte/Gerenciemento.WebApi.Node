import { UsuarioRepository } from "../repositories/user.respository.js";
import bcrypt from 'bcrypt';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const UserBusiness = { 
  async criar(usuario, file) {
    // gerar hash
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(usuario.senha, salt);

    const usuarioParaSalvar = {
      ...usuario,
      senha: hash  // substitui a senha original
    };

    // salvar
    const user =  await UsuarioRepository.criar(usuarioParaSalvar);

    if(file) {
      await this.uploadAvatar(user.id, file);
    }
    return user;
  },

  async uploadAvatar(userid, file) {
    if(!file) throw new Error("Arquivo não recebido");
    const avatar = await UsuarioRepository.buscaAvatar(userid).avatar;
    console.log(avatar)
    if(avatar != null) {
      const oldPath = path.join(__dirname, '..', '..', 'public', avatar);
      if (fs.existsSync(oldPath)) {
        fs.unlinkSync(oldPath);
      }
    }
    const filePath = `uploads/${file.filename}`;
    console.log(file, userid, filePath)
    const userUpdated = await UsuarioRepository.update(userid, filePath);
    if(!userUpdated) throw new Error("Usuário não encontrado");

  },

  async getAvatar(userid) {
    const avatar = await UsuarioRepository.buscaAvatar(userid);
    return avatar;
  },
  async buscarPorId(userid) {
    return await UsuarioRepository.buscaPorId(userid);
  }
}