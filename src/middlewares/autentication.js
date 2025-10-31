import jwt from 'jsonwebtoken';

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
    req.usuarioId = decoded.id;
    next();
  } catch (err) {
    console.error('Erro ao verificar token:', err.message);
    return res.status(403).json({ erro: 'Token inválido ou expirado' });
  }
}
