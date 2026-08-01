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

export const updateProfile = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'No autenticado' });
    }

    const { nombre, cmp_rnm, cep, email } = req.body;
    const store = getStore();
    const userIndex = store.users.findIndex(u => u.id === req.user?.id);

    if (userIndex === -1) {
      return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
    }

    if (nombre !== undefined) store.users[userIndex].nombre = nombre;
    if (cmp_rnm !== undefined) store.users[userIndex].cmp_rnm = cmp_rnm;
    if (cep !== undefined) store.users[userIndex].cep = cep;
    if (email !== undefined) store.users[userIndex].email = email;

    const saveResult = store;
    const { saveStore } = await import('../../data/dbStore');
    saveStore(saveResult);

    const updatedUser = store.users[userIndex];
    const userPayload = {
      id: updatedUser.id,
      nombre: updatedUser.nombre,
      email: updatedUser.email,
      role: updatedUser.rol,
      cmp_rnm: updatedUser.cmp_rnm,
      cep: updatedUser.cep,
      empresaId: updatedUser.empresaId,
      avatar: updatedUser.avatar
    };

    return res.status(200).json({
      success: true,
      message: 'Perfil actualizado exitosamente',
      user: userPayload
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: 'Error al actualizar perfil',
      error: error.message || String(error)
    });
  }
};

export const getAllUsers = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const store = getStore();
    const safeUsers = store.users.map(u => ({
      id: u.id,
      nombre: u.nombre,
      email: u.email,
      rol: u.rol,
      cmp_rnm: u.cmp_rnm,
      cep: u.cep,
      empresaId: u.empresaId,
      avatar: u.avatar
    }));

    return res.status(200).json({
      success: true,
      users: safeUsers
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: 'Error al obtener usuarios',
      error: error.message || String(error)
    });
  }
};

export const updateUserById = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { nombre, cmp_rnm, cep, email } = req.body;
    const store = getStore();
    const userIndex = store.users.findIndex(u => u.id === id);

    if (userIndex === -1) {
      return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
    }

    if (nombre !== undefined) store.users[userIndex].nombre = nombre;
    if (cmp_rnm !== undefined) store.users[userIndex].cmp_rnm = cmp_rnm;
    if (cep !== undefined) store.users[userIndex].cep = cep;
    if (email !== undefined) store.users[userIndex].email = email;

    const { saveStore } = await import('../../data/dbStore');
    saveStore(store);

    const updatedUser = store.users[userIndex];
    return res.status(200).json({
      success: true,
      message: 'Usuario actualizado exitosamente',
      user: {
        id: updatedUser.id,
        nombre: updatedUser.nombre,
        email: updatedUser.email,
        rol: updatedUser.rol,
        cmp_rnm: updatedUser.cmp_rnm,
        cep: updatedUser.cep,
        empresaId: updatedUser.empresaId,
        avatar: updatedUser.avatar
      }
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: 'Error al actualizar usuario',
      error: error.message || String(error)
    });
  }
};
