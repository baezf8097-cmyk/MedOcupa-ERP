import { Response, NextFunction } from 'express';
import { UserRole, Role, SystemModuleKey } from '../../types/erp';
import { AuthenticatedRequest } from './auth.middleware';

// Matriz de Permisos del Servidor (Centralizada en Backend)
export const SERVER_PERMISSIONS_MATRIX: Record<Role, Record<SystemModuleKey, { crear: boolean; leer: boolean; editar: boolean; eliminar: boolean; exportar: boolean }>> = {
  [UserRole.MEDICO_OCUPACIONAL]: {
    empresas:        { crear: true,  leer: true,  editar: true,  eliminar: true,  exportar: true },
    trabajadores:    { crear: true,  leer: true,  editar: true,  eliminar: true,  exportar: true },
    historia_clinica:{ crear: true,  leer: true,  editar: true,  eliminar: true,  exportar: true },
    emo:             { crear: true,  leer: true,  editar: true,  eliminar: true,  exportar: true },
    aptitud:         { crear: true,  leer: true,  editar: true,  eliminar: true,  exportar: true },
    accidentes:      { crear: true,  leer: true,  editar: true,  eliminar: true,  exportar: true },
    vacunas:         { crear: true,  leer: true,  editar: true,  eliminar: true,  exportar: true },
    ausentismo:      { crear: true,  leer: true,  editar: true,  eliminar: true,  exportar: true },
    vigilancia:      { crear: true,  leer: true,  editar: true,  eliminar: true,  exportar: true },
    reportes_minsa:  { crear: true,  leer: true,  editar: true,  eliminar: true,  exportar: true },
    protocolos:      { crear: true,  leer: true,  editar: true,  eliminar: true,  exportar: true },
  },
  [UserRole.ENFERMERA_OCUPACIONAL]: {
    empresas:        { crear: true,  leer: true,  editar: true,  eliminar: true,  exportar: true },
    trabajadores:    { crear: true,  leer: true,  editar: true,  eliminar: true,  exportar: true },
    historia_clinica:{ crear: true,  leer: true,  editar: true,  eliminar: true,  exportar: true },
    emo:             { crear: true,  leer: true,  editar: true,  eliminar: true,  exportar: true },
    aptitud:         { crear: true,  leer: true,  editar: true,  eliminar: true,  exportar: true },
    accidentes:      { crear: true,  leer: true,  editar: true,  eliminar: true,  exportar: true },
    vacunas:         { crear: true,  leer: true,  editar: true,  eliminar: true,  exportar: true },
    ausentismo:      { crear: true,  leer: true,  editar: true,  eliminar: true,  exportar: true },
    vigilancia:      { crear: true,  leer: true,  editar: true,  eliminar: true,  exportar: true },
    reportes_minsa:  { crear: true,  leer: true,  editar: true,  eliminar: true,  exportar: true },
    protocolos:      { crear: true,  leer: true,  editar: true,  eliminar: true,  exportar: true },
  },
  [UserRole.ESPECIALISTA_SST]: {
    empresas:        { crear: false, leer: true,  editar: false, eliminar: false, exportar: true },
    trabajadores:    { crear: false, leer: true,  editar: false, eliminar: false, exportar: true },
    historia_clinica:{ crear: false, leer: false, editar: false, eliminar: false, exportar: false },
    emo:             { crear: false, leer: false, editar: false, eliminar: false, exportar: false },
    aptitud:         { crear: false, leer: true,  editar: false, eliminar: false, exportar: true },
    accidentes:      { crear: true,  leer: true,  editar: true,  eliminar: false, exportar: true },
    vacunas:         { crear: false, leer: true,  editar: false, eliminar: false, exportar: true },
    ausentismo:      { crear: false, leer: true,  editar: false, eliminar: false, exportar: true },
    vigilancia:      { crear: true,  leer: true,  editar: true,  eliminar: false, exportar: true },
    reportes_minsa:  { crear: true,  leer: true,  editar: true,  eliminar: false, exportar: true },
    protocolos:      { crear: true,  leer: true,  editar: true,  eliminar: false, exportar: true },
  },
  [UserRole.ADMINISTRADOR]: {
    empresas:        { crear: true,  leer: true,  editar: true,  eliminar: true,  exportar: true },
    trabajadores:    { crear: true,  leer: true,  editar: true,  eliminar: true,  exportar: true },
    historia_clinica:{ crear: false, leer: false, editar: false, eliminar: false, exportar: false },
    emo:             { crear: false, leer: false, editar: false, eliminar: false, exportar: false },
    aptitud:         { crear: false, leer: true,  editar: false, eliminar: false, exportar: true },
    accidentes:      { crear: true,  leer: true,  editar: true,  eliminar: true,  exportar: true },
    vacunas:         { crear: true,  leer: true,  editar: true,  eliminar: true,  exportar: true },
    ausentismo:      { crear: true,  leer: true,  editar: true,  eliminar: true,  exportar: true },
    vigilancia:      { crear: true,  leer: true,  editar: true,  eliminar: true,  exportar: true },
    reportes_minsa:  { crear: true,  leer: true,  editar: true,  eliminar: true,  exportar: true },
    protocolos:      { crear: true,  leer: true,  editar: true,  eliminar: true,  exportar: true },
  },
};

/**
 * Middleware de autorización por Rol y Módulo.
 * Revalida la petición contra la matriz de permisos de salud ocupacional.
 */
export function authorize(moduleKey: SystemModuleKey, action: 'crear' | 'leer' | 'editar' | 'eliminar' | 'exportar') {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    // Extraer el rol verificado desde req.user (extraído del token JWT por authenticateToken)
    const userRole = req.user?.role;

    if (!userRole || !Object.values(UserRole).includes(userRole as UserRole)) {
      return res.status(401).json({
        success: false,
        error: 'No Autorizado',
        message: 'Rol de usuario inválido o ausente en la sesión. Inicie sesión.'
      });
    }

    // Validar permisos en la matriz
    const rolePermissions = SERVER_PERMISSIONS_MATRIX[userRole as Role];
    const modulePerms = rolePermissions?.[moduleKey];

    if (!modulePerms || !modulePerms[action]) {
      console.warn(`[SECURITY AUDIT] Intento de acceso denegado. Rol: ${userRole}, Módulo: ${moduleKey}, Acción: ${action}`);

      return res.status(403).json({
        success: false,
        error: 'Acceso Denegado',
        message: `El rol '${userRole}' no posee permisos de [${action.toUpperCase()}] para el módulo '${moduleKey}'. Cumplimiento Ley 29783 / Ley 29733.`
      });
    }

    next();
  };
}
