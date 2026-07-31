import { useState, useEffect } from 'react';
import { Role, UserRole, SystemModuleKey, ModulePermissions } from '../types/erp';
import { SERVER_PERMISSIONS_MATRIX } from '../backend/middleware/authRole.middleware';

export interface RoleInfo {
  role: Role;
  roleName: string;
  badgeColor: string;
  isMedico: boolean;
  isEnfermera: boolean;
  isEspecialistaSST: boolean;
  isAdmin: boolean;
  canViewDiagnosticoCIE10: boolean;
  canViewHistoriaClinicaCompleta: boolean;
  canSignCertificadoAptitud: boolean;
}

export function useRole(currentRole: Role) {
  const isMedico = currentRole === UserRole.MEDICO_OCUPACIONAL;
  const isEnfermera = currentRole === UserRole.ENFERMERA_OCUPACIONAL;
  const isEspecialistaSST = currentRole === UserRole.ESPECIALISTA_SST;
  const isAdmin = currentRole === UserRole.ADMINISTRADOR;

  // Restricciones de permisos (Acceso Completo para Médico y Enfermera Ocupacional)
  const canViewDiagnosticoCIE10 = isMedico || isEnfermera;
  const canViewHistoriaClinicaCompleta = isMedico || isEnfermera;
  const canSignCertificadoAptitud = isMedico || isEnfermera;

  const hasPermission = (moduleKey: SystemModuleKey, action: keyof ModulePermissions): boolean => {
    const roleMatrix = SERVER_PERMISSIONS_MATRIX[currentRole];
    if (!roleMatrix || !roleMatrix[moduleKey]) return false;
    return roleMatrix[moduleKey][action];
  };

  const getRoleInfo = (): RoleInfo => {
    switch (currentRole) {
      case UserRole.MEDICO_OCUPACIONAL:
        return {
          role: currentRole,
          roleName: 'Médico Ocupacional (CMP / RNM)',
          badgeColor: 'bg-emerald-900/40 text-emerald-300 border-emerald-700/50',
          isMedico: true,
          isEnfermera: false,
          isEspecialistaSST: false,
          isAdmin: false,
          canViewDiagnosticoCIE10: true,
          canViewHistoriaClinicaCompleta: true,
          canSignCertificadoAptitud: true,
        };
      case UserRole.ENFERMERA_OCUPACIONAL:
        return {
          role: currentRole,
          roleName: 'Enfermera Ocupacional (CEP)',
          badgeColor: 'bg-teal-900/40 text-teal-300 border-teal-700/50',
          isMedico: false,
          isEnfermera: true,
          isEspecialistaSST: false,
          isAdmin: false,
          canViewDiagnosticoCIE10: true,
          canViewHistoriaClinicaCompleta: true,
          canSignCertificadoAptitud: true,
        };
      case UserRole.ESPECIALISTA_SST:
        return {
          role: currentRole,
          roleName: 'Especialista SST (Ing. Seguridad / Ley 29783)',
          badgeColor: 'bg-amber-900/40 text-amber-300 border-amber-700/50',
          isMedico: false,
          isEnfermera: false,
          isEspecialistaSST: true,
          isAdmin: false,
          canViewDiagnosticoCIE10: false,
          canViewHistoriaClinicaCompleta: false,
          canSignCertificadoAptitud: false,
        };
      case UserRole.ADMINISTRADOR:
        return {
          role: currentRole,
          roleName: 'Administrador del Sistema ERP',
          badgeColor: 'bg-indigo-900/40 text-indigo-300 border-indigo-700/50',
          isMedico: false,
          isEnfermera: false,
          isEspecialistaSST: false,
          isAdmin: true,
          canViewDiagnosticoCIE10: false,
          canViewHistoriaClinicaCompleta: false,
          canSignCertificadoAptitud: false,
        };
    }
  };

  return {
    currentRole,
    roleInfo: getRoleInfo(),
    hasPermission,
    isMedico,
    isEnfermera,
    isEspecialistaSST,
    isAdmin,
    canViewDiagnosticoCIE10,
    canViewHistoriaClinicaCompleta,
    canSignCertificadoAptitud
  };
}
