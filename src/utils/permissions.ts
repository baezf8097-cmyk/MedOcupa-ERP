import { Role, SystemModuleKey, ModulePermissions } from '../types/erp';
import { SERVER_PERMISSIONS_MATRIX } from '../backend/middleware/authRole.middleware';

export const PERMISSIONS_STORAGE_KEY = 'medocupa_custom_permissions';
export const PERMISSIONS_UPDATED_EVENT = 'medocupa_permissions_updated';

export type PermissionsMatrix = Record<Role, Record<SystemModuleKey, ModulePermissions>>;

export function getCustomPermissionsMatrix(): PermissionsMatrix {
  try {
    const saved = localStorage.getItem(PERMISSIONS_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      const defaultMatrix = JSON.parse(JSON.stringify(SERVER_PERMISSIONS_MATRIX));
      return {
        ...defaultMatrix,
        ...parsed,
      };
    }
  } catch (e) {
    console.error('Error loading custom permissions from localStorage:', e);
  }
  return JSON.parse(JSON.stringify(SERVER_PERMISSIONS_MATRIX));
}

export function saveCustomPermissionsMatrix(matrix: PermissionsMatrix): void {
  try {
    localStorage.setItem(PERMISSIONS_STORAGE_KEY, JSON.stringify(matrix));
    window.dispatchEvent(new Event(PERMISSIONS_UPDATED_EVENT));
  } catch (e) {
    console.error('Error saving custom permissions to localStorage:', e);
  }
}

export function resetPermissionsToDefault(): PermissionsMatrix {
  const defaultMatrix = JSON.parse(JSON.stringify(SERVER_PERMISSIONS_MATRIX));
  saveCustomPermissionsMatrix(defaultMatrix);
  return defaultMatrix;
}

export function getEffectiveRolePermissions(role: Role): Record<SystemModuleKey, ModulePermissions> {
  const matrix = getCustomPermissionsMatrix();
  return matrix[role] || SERVER_PERMISSIONS_MATRIX[role];
}

export function checkModulePermission(
  role: Role,
  moduleKey: SystemModuleKey,
  action: keyof ModulePermissions = 'leer'
): boolean {
  const rolePermissions = getEffectiveRolePermissions(role);
  if (!rolePermissions || !rolePermissions[moduleKey]) return false;
  return Boolean(rolePermissions[moduleKey][action]);
}
