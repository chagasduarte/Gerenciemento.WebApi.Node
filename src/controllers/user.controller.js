import { UserBusiness } from "../business/user.business.js";

export const UserController = { 
  async criar (req, res) {
    try {
      const user = req.body;
      if (!user.nome || !user.senha) {
        return res.status(400).json({ erro: 'Nome e senha são obrigatórios' });
      }
      const resultado = await UserBusiness.criar(user, req.file);      
      res.status(200).json(resultado);
    } catch (error) {
      res.status(401).json({ erro: error.message });
    }
  },
  
  async uploadAvatar(req, res) {
    try {
      const userid = req.usuarioId;
      if (!file) {
        return res.status(400).json({ erro: 'Nenhum arquivo enviado' });
      }
      const file = req.file;
      
      const resultado = await UserBusiness.uploadAvatar(userid, file);
      res.status(200).json(resultado);
    } catch (error) {
      res.status(401).json({ erro: error.message });
    } 
  },
  async getAvatar(req, res) {
    try {
      if(req.usuarioId == undefined) {
        const response = {avatarUrl: `${process.env.BASE_URL}/uploads/noImage.png`}
        res.status(200).json(response);
      }
      else {
        const userid = req.usuarioId;
        if (userid != req.params.id) {
          throw new Error("Você não pode acessar essa informação");
        }
        const resultado = await UserBusiness.getAvatar(userid);
        const response = {avatarUrl: `${process.env.BASE_URL}/uploads/${resultado.avatar}`}
        res.status(200).json(response);
      }
    } catch (error) {
      res.status(401).json({ erro: error.message });
    } 
  }

}
