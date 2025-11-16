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
    return await UsuarioRepository.criar(usuarioParaSalvar);
  }
}