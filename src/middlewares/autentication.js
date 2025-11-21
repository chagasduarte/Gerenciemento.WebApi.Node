import jwt from 'jsonwebtoken';
import { UserBusiness } from "../business/user.business.js";

export function autentication(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ erro: 'Token não informado' });
  }
  console.log("autenticou")
  const token = authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ erro: 'Token inválido ou ausente' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = UserBusiness.buscarPorId(decoded.id);
    if(user)
      req.usuarioId = decoded.id;
    else 
      res.status(404).json({error: 'Usuário não encontrado'})
    next();
  } catch (err) {
    console.error('Erro ao verificar token:', err.message);
    return res.status(403).json({ erro: 'Token inválido ou expirado' });
  }
}
