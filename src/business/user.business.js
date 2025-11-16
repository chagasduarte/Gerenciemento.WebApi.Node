import { UsuarioRepository } from "../repositories/user.respository.js";
import bcrypt from 'bcrypt';

export const UserBusiness = { 
  async criar(usuario) {

    // validações
    if (!usuario.nome || !usuario.senha) {
      throw new Error("Email e senha são obrigatórios");
    }

    // gerar hash
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(usuario.senha, salt);

    const usuarioParaSalvar = {
      ...usuario,
      senha: hash  // substitui a senha original
    };

    // salvar
    const user =  await UsuarioRepository.criar(usuarioParaSalvar);

    await this.uploadAvatar(user.id, usuario.avatar);
    return user;
  },

  async uploadAvatar(userid, file) {
    if(!file) throw new Error("Arquivo não recebido");

    const filePath = `uploads/${file.filename}`;
    const userUpdated = await UsuarioRepository.update(userid, filePath);

    if(!userUpdated) throw new Error("Usuário não encontrado");

  },
  async getAvatar(userid) {
    const avatar = await UsuarioRepository.buscaAvatar(userid);
      console.log(avatar)
    return avatar;
  }
}