import { Response } from 'express';
import { AuthenticatedRequest } from '../../middleware/auth.middleware';
import { getStore, saveStore } from '../../data/dbStore';
import { AuditLog } from '../../../types/erp';

export const getAuditLogs = (req: AuthenticatedRequest, res: Response): void => {
  try {
    const store = getStore();
    res.json({ success: true, data: store.auditLogs || [] });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Error al obtener registros de auditoría' });
  }
};

export const createAuditLog = (req: AuthenticatedRequest, res: Response): void => {
  try {
    const store = getStore();
    const { accion, recurso, detalles } = req.body;

    const newLog: AuditLog = {
      id: `aud-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC',
      usuario: req.user ? `${req.user.email} (${req.user.nombre || 'Usuario'})` : 'Usuario Operativo',
      rol: req.user?.role || 'MEDICO_OCUPACIONAL',
      accion: accion || 'ACCION_SISTEMA',
      recurso: recurso || 'General',
      ip: req.ip || '127.0.0.1',
      resultado: 'EXITO',
      detalles: detalles || recurso || ''
    };

    store.auditLogs = [newLog, ...(store.auditLogs || [])];
    saveStore(store);

    res.status(201).json({ success: true, data: newLog });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Error al registrar auditoría' });
  }
};
