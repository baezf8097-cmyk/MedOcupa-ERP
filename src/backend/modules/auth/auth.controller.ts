import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { getStore } from '../../data/dbStore';
import { JWT_SECRET, AuthenticatedRequest } from '../../middleware/auth.middleware';

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Por favor ingrese correo electrónico y contraseña'
      });
    }

    const store = getStore();
    const user = store.users.find(u => u.email.toLowerCase() === email.toLowerCase());

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas (usuario o contraseña incorrectos)'
      });
    }

    const isValidPassword = bcrypt.compareSync(password, user.passwordHash);
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas (usuario o contraseña incorrectos)'
      });
    }

    const tokenPayload = {
      id: user.id,
      nombre: user.nombre,
      email: user.email,
      role: user.rol,
      cmp_rnm: user.cmp_rnm,
      cep: user.cep,
      empresaId: user.empresaId,
      avatar: user.avatar
    };

    const token = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: '24h' });

    return res.status(200).json({
      success: true,
      message: 'Inicio de sesión exitoso',
      token,
      user: tokenPayload
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: 'Error al iniciar sesión',
      error: error.message || String(error)
    });
  }
};

export const getMe = async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'No autenticado'
    });
  }

  return res.status(200).json({
    success: true,
    user: req.user
  });
};
