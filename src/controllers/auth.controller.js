import { AuthBusiness } from '../business/auth.business.js';

export const AuthController = {
  async login(req, res) {
    try {
      const { nome , senha } = req.body;

      if (!nome || !senha) {
        return res.status(400).json({ erro: 'Email e senha são obrigatórios' });
      }

      const resultado = await AuthBusiness.login(nome, senha);
      res.status(200).json(resultado);
    } catch (error) {
      res.status(401).json({ erro: error.message });
    }
  }
};
