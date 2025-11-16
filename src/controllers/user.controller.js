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
  },
  async uploadAvatar(req, res) {
    try {
      const userid = req.usuarioId;
      const file = req.file;

      if (!user.nome || !user.senha) {
        return res.status(400).json({ erro: 'Nome e senha são obrigatórios' });
      }

      const resultado = await UserBusiness.uploadAvatar(userid, file);
      res.status(200).json(resultado);
    } catch (error) {
      res.status(401).json({ erro: error.message });
    } 
  },
  async getAvatar(req, res) {
    try {
      const userid = req.usuarioId;
      if (userid != req.params.id) {
        throw new Error("Você não pode acessar essa informação");
      }
      const resultado = await UserBusiness.getAvatar(userid);
      res.status(200).json(resultado);
    } catch (error) {
      res.status(401).json({ erro: error.message });
    } 
  }

}
