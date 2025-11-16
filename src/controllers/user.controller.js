import { UserBusiness } from "../business/user.business.js";

export const UserController = { 
  async criar (req, res) {
    try {
      const user = req.body;

      if (!user.nome || !user.senha) {
        return res.status(400).json({ erro: 'Nome e senha são obrigatórios' });
      }

      const resultado = await UserBusiness.criar(user);
      res.status(200).json(resultado);
    } catch (error) {
      res.status(401).json({ erro: error.message });
    }
  }

}
