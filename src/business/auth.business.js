import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { UsuarioRepository } from '../repositories/user.respository.js';

const JWT_SECRET = process.env.JWT_SECRET || 'chave_secreta_super_segura';

export const AuthBusiness = {
  async login(nome, senha) {
    const usuario = await UsuarioRepository.buscaPorNome(nome);
    if (!usuario) {
      throw new Error('Usuário não encontrado');
    }
    const senhaCorreta = await bcrypt.compare(senha, usuario.senha_hash);
    if (!senhaCorreta) {
      throw new Error('Senha incorreta');
    }

    const token = jwt.sign(
      {
        id: usuario.id,
        nome: usuario.nome
      },
      JWT_SECRET,
      { expiresIn: '8h' }
    );

    return {
      token,
      usuario: {
        id: usuario.id,
        nome: usuario.nome,
        avatar: usuario.avatar
      }
    };
  }
};
