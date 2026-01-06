import jwt from 'jsonwebtoken';
import { UserBusiness } from "../business/user.business.js";

export async function autentication(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ erro: 'Token não informado' });
  }
  const token = authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ erro: 'Token inválido ou ausente' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await UserBusiness.buscarPorId(decoded.id);
    if(user)
      req.usuarioId = decoded.id;
    else 
      throw new Error("Usuário não encontrado")
    next();
  } catch (err) {
    console.error('Erro ao verificar token:', err.message);
    return res.status(403).json({ erro: 'Token inválido ou expirado' });
  }
}
