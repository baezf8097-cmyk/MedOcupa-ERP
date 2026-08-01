import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { Role } from '../../types/erp';

export const JWT_SECRET = process.env.JWT_SECRET || 'medocupa-secret-key-2026-rsa';

export interface UserPayload {
  id: string;
  nombre: string;
  email: string;
  role: Role;
  cmp_rnm?: string;
  cep?: string;
  empresaId?: string;
  avatar?: string;
}

export interface AuthenticatedRequest extends Request {
  user?: UserPayload;
}

export function authenticateToken(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

  if (!token) {
    return res.status(401).json({
      success: false,
      error: 'No Autorizado',
      message: 'Token de acceso no proporcionado. Debe iniciar sesión.'
    });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as UserPayload;
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      error: 'Token Inválido',
      message: 'El token de sesión es inválido o ha expirado. Por favor, vuelva a iniciar sesión.'
    });
  }
}
