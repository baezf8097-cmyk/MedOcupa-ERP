import React, { useState, useEffect } from 'react';
import { Role, SystemModuleKey, ModulePermissions } from '../../types/erp';
import { checkModulePermission, PERMISSIONS_UPDATED_EVENT } from '../../utils/permissions';
import { ShieldAlert, Lock } from 'lucide-react';

interface RequireRoleProps {
  currentRole: Role;
  allowedRoles?: Role[];
  moduleKey?: SystemModuleKey;
  action?: keyof ModulePermissions;
  fallback?: React.ReactNode;
  children: React.ReactNode;
}

export const RequireRole: React.FC<RequireRoleProps> = ({
  currentRole,
  allowedRoles,
  moduleKey,
  action = 'leer',
  fallback,
  children
}) => {
  const [, setPermissionsTick] = useState(0);

  useEffect(() => {
    const handlePermissionsUpdated = () => {
      setPermissionsTick((prev) => prev + 1);
    };
    window.addEventListener(PERMISSIONS_UPDATED_EVENT, handlePermissionsUpdated);
    window.addEventListener('storage', handlePermissionsUpdated);
    return () => {
      window.removeEventListener(PERMISSIONS_UPDATED_EVENT, handlePermissionsUpdated);
      window.removeEventListener('storage', handlePermissionsUpdated);
    };
  }, []);

  // 1. Validar por lista de roles directa
  if (allowedRoles && allowedRoles.length > 0) {
    if (!allowedRoles.includes(currentRole)) {
      if (fallback) return <>{fallback}</>;
      return (
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-center text-slate-400 my-2">
          <Lock className="w-5 h-5 text-amber-500 mx-auto mb-1 opacity-80" />
          <p className="text-xs font-semibold text-slate-300">Acceso Restringido por Rol</p>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Su rol actual ({currentRole}) no tiene los privilegios requeridos para visualizar esta sección.
          </p>
        </div>
      );
    }
  }

  // 2. Validar por Módulo + Acción según Matriz Dinámica de Permisos
  if (moduleKey) {
    const hasAccess = checkModulePermission(currentRole, moduleKey, action);

    if (!hasAccess) {
      if (fallback) return <>{fallback}</>;
      return (
        <div className="p-4 rounded-xl bg-slate-900 border border-rose-900/40 text-center text-slate-300 my-2">
          <ShieldAlert className="w-6 h-6 text-rose-400 mx-auto mb-1.5 animate-pulse" />
          <p className="text-xs font-bold text-rose-300">Confidencialidad & Restricción Legal (Ley 29733 / 29783)</p>
          <p className="text-[11px] text-slate-400 mt-1 max-w-md mx-auto">
            Acceso denegado al módulo <strong>[{moduleKey.toUpperCase()}]</strong> para la acción <strong>[{action.toUpperCase()}]</strong> con rol <strong>{currentRole}</strong>.
          </p>
        </div>
      );
    }
  }

  return <>{children}</>;
};
