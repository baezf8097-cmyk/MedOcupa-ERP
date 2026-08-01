import React, { useState, useEffect } from 'react';
import { Role, UserRole, SystemModuleKey } from '../../types/erp';
import { SERVER_PERMISSIONS_MATRIX } from '../../backend/middleware/authRole.middleware';
import { 
  getCustomPermissionsMatrix, 
  saveCustomPermissionsMatrix, 
  resetPermissionsToDefault,
  PermissionsMatrix 
} from '../../utils/permissions';
import { 
  ShieldCheck, 
  Lock, 
  UserCheck, 
  Check, 
  X, 
  FileText, 
  Stethoscope, 
  ShieldAlert, 
  Key, 
  BookOpen, 
  Scale, 
  Cpu, 
  CheckCircle2, 
  Info,
  Code2,
  Copy,
  Edit3,
  RotateCcw,
  SlidersHorizontal,
  Sparkles,
  CheckSquare,
  Square
} from 'lucide-react';

interface PerfilesYPermisosViewProps {
  currentRole: Role;
  onRoleChange: (role: Role) => void;
  onOpenEditProfile?: () => void;
}

export const PerfilesYPermisosView: React.FC<PerfilesYPermisosViewProps> = ({
  currentRole,
  onRoleChange,
  onOpenEditProfile
}) => {
  const [activeTab, setActiveTab] = useState<'editor' | 'matriz' | 'procedimientos' | 'restricciones' | 'implementacion'>('editor');
  const [copiedSnippet, setCopiedSnippet] = useState<string | null>(null);
  
  // Selected role to customize in the Editor view
  const [editorRole, setEditorRole] = useState<Role>(currentRole);

  // Sync editorRole when currentRole prop changes
  useEffect(() => {
    setEditorRole(currentRole);
  }, [currentRole]);

  // Editable permissions matrix state persisted in localStorage
  const [permissionsMatrix, setPermissionsMatrix] = useState<PermissionsMatrix>(() => {
    return getCustomPermissionsMatrix();
  });

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const isAdmin = currentRole === UserRole.ADMINISTRADOR;

  const getRoleTitle = (role: Role) => {
    switch (role) {
      case UserRole.MEDICO_OCUPACIONAL: return '1. Médico Ocupacional';
      case UserRole.ENFERMERA_OCUPACIONAL: return '2. Enfermera Ocupacional';
      case UserRole.ESPECIALISTA_SST: return '3. Especialista SST';
      case UserRole.ADMINISTRADOR: return '4. Administrador del Sistema';
      default: return role;
    }
  };

  const togglePermission = (role: Role, moduleKey: SystemModuleKey, action: 'crear' | 'leer' | 'editar' | 'eliminar' | 'exportar') => {
    if (!isAdmin) {
      showToast('Acceso Restringido: Solo el Administrador del Sistema puede modificar la matriz de permisos.');
      return;
    }
    setPermissionsMatrix((prev) => {
      const updated: PermissionsMatrix = {
        ...prev,
        [role]: {
          ...prev[role],
          [moduleKey]: {
            ...prev[role][moduleKey],
            [action]: !prev[role][moduleKey]?.[action]
          }
        }
      };
      saveCustomPermissionsMatrix(updated);
      return updated;
    });
    showToast(`Permiso [${action.toUpperCase()}] actualizado para el rol ${role}`);
  };

  const handleResetMatrix = () => {
    if (!isAdmin) {
      showToast('Acceso Restringido: Solo el Administrador del Sistema puede restablecer la matriz de permisos.');
      return;
    }
    const defaultMatrix = resetPermissionsToDefault();
    setPermissionsMatrix(defaultMatrix);
    showToast('Todos los permisos han sido restablecidos a la configuración por defecto');
  };

  const handleToggleAllForRole = (role: Role, enableAll: boolean) => {
    if (!isAdmin) {
      showToast('Acceso Restringido: Solo el Administrador del Sistema puede modificar permisos.');
      return;
    }
    setPermissionsMatrix((prev) => {
      const updated = { ...prev };
      const roleModules = { ...updated[role] };
      for (const modKey in roleModules) {
        const k = modKey as SystemModuleKey;
        roleModules[k] = {
          crear: enableAll,
          leer: enableAll,
          editar: enableAll,
          eliminar: enableAll,
          exportar: enableAll
        };
      }
      updated[role] = roleModules;
      saveCustomPermissionsMatrix(updated);
      return updated;
    });
    showToast(enableAll ? `Habilitados todos los permisos para ${role}` : `Deshabilitados todos los permisos para ${role}`);
  };

  const handleSetReadOnlyForRole = (role: Role) => {
    if (!isAdmin) {
      showToast('Acceso Restringido: Solo el Administrador del Sistema puede modificar permisos.');
      return;
    }
    setPermissionsMatrix((prev) => {
      const updated = { ...prev };
      const roleModules = { ...updated[role] };
      for (const modKey in roleModules) {
        const k = modKey as SystemModuleKey;
        roleModules[k] = {
          crear: false,
          leer: true,
          editar: false,
          eliminar: false,
          exportar: true
        };
      }
      updated[role] = roleModules;
      saveCustomPermissionsMatrix(updated);
      return updated;
    });
    showToast(`Configurado modo Solo Lectura para ${role}`);
  };

  const modulesList: { key: SystemModuleKey; label: string; desc: string }[] = [
    { key: 'empresas', label: 'Empresas & Sedes', desc: 'Gestión RUC, CIIU y sedes SCTR' },
    { key: 'trabajadores', label: 'Trabajadores & IPERC', desc: 'Fichas de personal y matriz de riesgos' },
    { key: 'historia_clinica', label: 'Historia Clínica Ocupacional (HCO)', desc: 'Anamnesis, diagnósticos CIE-10 y hallazgos' },
    { key: 'emo', label: 'Evaluaciones EMO (RM 312)', desc: 'Programación, triaje, laboratorio y clínica' },
    { key: 'aptitud', label: 'Certificados de Aptitud', desc: 'Dictamen médico (Apto, Con Restricciones, No Apto)' },
    { key: 'accidentes', label: 'Accidentes & Incidentes (SAT 24h)', desc: 'Notificación de eventos y reportes MTPE' },
    { key: 'vacunas', label: 'Carné Inmunizaciones', desc: 'Registro de vacunas (Hepatitis B, Tétanos, etc.)' },
    { key: 'ausentismo', label: 'Ausentismo & Descansos Médicos', desc: 'Registro CITT, incapacidades y días perdidos' },
    { key: 'vigilancia', label: 'Vigilancia Epidemiológica', desc: 'Programas específicos por factor de riesgo' },
    { key: 'reportes_minsa', label: 'Reportes MINSA / MTPE', desc: 'Anexos, estadísticas e indicadores SST' },
    { key: 'protocolos', label: 'Protocolos de Examen Médico', desc: 'Baterías EMO según puesto y norma legal' },
  ];

  const rolesInfo: { role: Role; title: string; color: string; desc: string; icon: any }[] = [
    { 
      role: UserRole.MEDICO_OCUPACIONAL, 
      title: '1. MÉDICO OCUPACIONAL', 
      color: 'emerald', 
      desc: 'Máxima autoridad médica y técnica en el ERP. Acceso total e ilimitado a todos los módulos del sistema.',
      icon: Stethoscope
    },
    { 
      role: UserRole.ENFERMERA_OCUPACIONAL, 
      title: '2. ENFERMERA OCUPACIONAL', 
      color: 'teal', 
      desc: 'Triaje, inmunizaciones, apoyos en EMOs y gestión de ausentismo médico.',
      icon: UserCheck
    },
    { 
      role: UserRole.ESPECIALISTA_SST, 
      title: '3. ESPECIALISTA SST', 
      color: 'amber', 
      desc: 'Gestión técnica e industrial: investigación de accidentes SAT 24h, programas de vigilancia y matrices IPERC.',
      icon: ShieldCheck
    },
    { 
      role: UserRole.ADMINISTRADOR, 
      title: '4. ADMINISTRADOR DEL SISTEMA', 
      color: 'indigo', 
      desc: 'Gestión técnica y de configuración: usuarios, empresas cliente y parámetros globales del ERP.',
      icon: Key
    },
  ];

  const copyToClipboard = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedSnippet(id);
    setTimeout(() => setCopiedSnippet(null), 2500);
  };

  return (
    <div className="space-y-6 relative">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-emerald-600 text-white px-4 py-3 rounded-xl shadow-2xl border border-emerald-400/50 flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span className="text-xs font-bold">{toastMessage}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden bg-gradient-to-r from-slate-900 via-indigo-950/30 to-slate-900">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 rounded-2xl shrink-0 mt-1">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2.5 py-0.5 bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded-full text-[11px] font-bold uppercase tracking-wider">
                  Módulo de Seguridad ERP
                </span>
                <span className="text-xs text-slate-400">Ley 29783 • Ley 29733 (Protección Datos Salud)</span>
              </div>
              <h2 className="text-xl font-bold text-white mt-1">
                Perfiles de Usuario, Permisos y Configuración Personalizada
              </h2>
              <p className="text-xs text-slate-300 mt-1 max-w-2xl">
                Selecciona y personaliza manualmente los permisos exactos (Crear, Leer, Editar, Eliminar, Exportar) para cada rol y módulo del sistema.
              </p>
            </div>
          </div>

          {/* Active Session Role Display (Read-only) */}
          <div className="bg-slate-950 border border-slate-800 p-3 rounded-xl shrink-0 flex flex-col gap-2 min-w-[220px]">
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block mb-1">
                Rol Activo en la Sesión:
              </span>
              <div className="w-full bg-slate-900 border border-indigo-500/30 text-white font-bold text-xs rounded-lg px-3 py-2 flex items-center justify-between gap-2 shadow-inner">
                <div className="flex items-center gap-2 truncate">
                  {isAdmin ? (
                    <Key className="w-4 h-4 text-indigo-400 shrink-0" />
                  ) : currentRole === UserRole.MEDICO_OCUPACIONAL ? (
                    <Stethoscope className="w-4 h-4 text-emerald-400 shrink-0" />
                  ) : currentRole === UserRole.ENFERMERA_OCUPACIONAL ? (
                    <UserCheck className="w-4 h-4 text-teal-400 shrink-0" />
                  ) : (
                    <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
                  )}
                  <span className="truncate">{getRoleTitle(currentRole)}</span>
                </div>
                <span className={`px-1.5 py-0.5 rounded text-[9px] font-extrabold uppercase shrink-0 border ${
                  isAdmin ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30' :
                  currentRole === UserRole.MEDICO_OCUPACIONAL ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' :
                  currentRole === UserRole.ENFERMERA_OCUPACIONAL ? 'bg-teal-500/20 text-teal-300 border-teal-500/30' :
                  'bg-amber-500/20 text-amber-300 border-amber-500/30'
                }`}>
                  SESIÓN
                </span>
              </div>
            </div>

            {onOpenEditProfile && (
              <button
                onClick={onOpenEditProfile}
                className="w-full px-3 py-1.5 bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-200 border border-indigo-500/40 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Editar Ficha Usuario</span>
              </button>
            )}
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 mt-6 pt-4 border-t border-slate-800">
          <button
            onClick={() => setActiveTab('editor')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'editor' ? 'bg-indigo-600 text-white shadow-lg ring-2 ring-indigo-400' : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <SlidersHorizontal className="w-4 h-4 text-emerald-400" /> 1. Selector Manual de Permisos (Checkboxes)
          </button>

          <button
            onClick={() => setActiveTab('matriz')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'matriz' ? 'bg-indigo-600 text-white shadow-lg ring-2 ring-indigo-400' : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <ShieldCheck className="w-4 h-4" /> 2. Matriz Comparativa General
          </button>

          <button
            onClick={() => setActiveTab('procedimientos')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'procedimientos' ? 'bg-indigo-600 text-white shadow-lg ring-2 ring-indigo-400' : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <BookOpen className="w-4 h-4" /> 3. Procedimientos de Acceso
          </button>

          <button
            onClick={() => setActiveTab('restricciones')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'restricciones' ? 'bg-indigo-600 text-white shadow-lg ring-2 ring-indigo-400' : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <Lock className="w-4 h-4" /> 4. Restricciones Ley 29733
          </button>

          <button
            onClick={() => setActiveTab('implementacion')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'implementacion' ? 'bg-indigo-600 text-white shadow-lg ring-2 ring-indigo-400' : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <Code2 className="w-4 h-4" /> 5. Código Técnico RBAC
          </button>
        </div>
      </div>

      {/* TAB 1: SELECTOR MANUAL DE PERMISOS POR ROL */}
      {activeTab === 'editor' && (
        <div className="space-y-6">
          {/* Admin restriction notification banner */}
          {!isAdmin ? (
            <div className="bg-amber-950/60 border border-amber-500/50 p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-amber-200 shadow-xl">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-500/20 text-amber-400 rounded-xl shrink-0">
                  <Lock className="w-5 h-5" />
                </div>
                <div>
                  <span className="font-bold text-amber-300 block text-sm">Modo Consulta (Solo Lectura)</span>
                  <span>Solo el <strong>Administrador del Sistema</strong> está autorizado para marcar, editar o desmarcar permisos en el ERP. Tu rol activo en sesión es <strong>{getRoleTitle(currentRole)}</strong>.</span>
                </div>
              </div>
              <div className="px-3.5 py-1.5 bg-amber-900/50 text-amber-300 border border-amber-500/40 rounded-xl text-xs font-semibold shrink-0 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5" />
                <span>Acceso Restringido</span>
              </div>
            </div>
          ) : (
            <div className="bg-emerald-950/50 border border-emerald-500/40 p-3.5 rounded-2xl flex items-center gap-3 text-xs text-emerald-200 shadow-lg">
              <div className="p-1.5 bg-emerald-500/20 text-emerald-400 rounded-lg shrink-0">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div>
                <span className="font-bold text-emerald-300">Modo Administrador Habilitado:</span> Tienes privilegios para marcar o desmarcar permisos en tiempo real. Los cambios se guardan automáticamente.
              </div>
            </div>
          )}

          {/* Role selector panel for editor */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-800">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <SlidersHorizontal className="w-5 h-5 text-indigo-400" /> Configuración de Permisos por Rol
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Selecciona el rol que deseas personalizar y marca/desmarca las casillas según las necesidades operativas de tu clínica o empresa.
                </p>
              </div>

              {/* Action Toolbar */}
              <div className="flex items-center gap-2 flex-wrap shrink-0">
                <button
                  onClick={() => handleToggleAllForRole(editorRole, true)}
                  disabled={!isAdmin}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                    isAdmin
                      ? 'bg-emerald-900/40 hover:bg-emerald-800/60 text-emerald-300 border border-emerald-700/50 cursor-pointer'
                      : 'bg-slate-800/40 text-slate-500 border border-slate-800 cursor-not-allowed opacity-60'
                  }`}
                  title={!isAdmin ? 'Solo el Administrador puede modificar los permisos' : 'Activar todos los permisos para este rol'}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Activar Todo</span>
                </button>

                <button
                  onClick={() => handleSetReadOnlyForRole(editorRole)}
                  disabled={!isAdmin}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                    isAdmin
                      ? 'bg-blue-900/40 hover:bg-blue-800/60 text-blue-300 border border-blue-700/50 cursor-pointer'
                      : 'bg-slate-800/40 text-slate-500 border border-slate-800 cursor-not-allowed opacity-60'
                  }`}
                  title={!isAdmin ? 'Solo el Administrador puede modificar los permisos' : 'Configurar en modo solo lectura'}
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Solo Lectura</span>
                </button>

                <button
                  onClick={() => handleToggleAllForRole(editorRole, false)}
                  disabled={!isAdmin}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                    isAdmin
                      ? 'bg-rose-900/40 hover:bg-rose-800/60 text-rose-300 border border-rose-700/50 cursor-pointer'
                      : 'bg-slate-800/40 text-slate-500 border border-slate-800 cursor-not-allowed opacity-60'
                  }`}
                  title={!isAdmin ? 'Solo el Administrador puede modificar los permisos' : 'Desactivar todos los permisos'}
                >
                  <X className="w-3.5 h-3.5" />
                  <span>Desactivar Todo</span>
                </button>

                <button
                  onClick={handleResetMatrix}
                  disabled={!isAdmin}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                    isAdmin
                      ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 cursor-pointer'
                      : 'bg-slate-800/40 text-slate-500 border border-slate-800 cursor-not-allowed opacity-60'
                  }`}
                  title={!isAdmin ? 'Solo el Administrador puede restablecer los permisos' : 'Restablecer permisos por defecto legal'}
                >
                  <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
                  <span>Defectos Legal</span>
                </button>
              </div>
            </div>

            {/* Role Tabs for Editor */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 mt-4">
              {rolesInfo.map((r) => {
                const isSelected = editorRole === r.role;
                const Icon = r.icon;

                let borderStyle = 'border-slate-800 bg-slate-950/60 hover:bg-slate-900';
                if (isSelected) {
                  if (r.role === UserRole.MEDICO_OCUPACIONAL) borderStyle = 'border-emerald-500 bg-emerald-950/40 text-emerald-300 ring-2 ring-emerald-500/40';
                  else if (r.role === UserRole.ENFERMERA_OCUPACIONAL) borderStyle = 'border-teal-500 bg-teal-950/40 text-teal-300 ring-2 ring-teal-500/40';
                  else if (r.role === UserRole.ESPECIALISTA_SST) borderStyle = 'border-amber-500 bg-amber-950/40 text-amber-300 ring-2 ring-amber-500/40';
                  else borderStyle = 'border-indigo-500 bg-indigo-950/40 text-indigo-300 ring-2 ring-indigo-500/40';
                }

                return (
                  <button
                    key={r.role}
                    type="button"
                    onClick={() => setEditorRole(r.role)}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${borderStyle}`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <Icon className="w-4 h-4" />
                      {isSelected && <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-white/10">CONFIGURANDO</span>}
                    </div>
                    <span className="text-xs font-bold text-white block truncate">{r.title}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Module Cards with Checkboxes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {modulesList.map((mod) => {
              const perms = permissionsMatrix[editorRole]?.[mod.key] || {
                crear: false,
                leer: false,
                editar: false,
                eliminar: false,
                exportar: false
              };

              const actions: { key: 'crear' | 'leer' | 'editar' | 'eliminar' | 'exportar'; label: string; tag: string; color: string; checkedBg: string }[] = [
                { key: 'crear', label: 'Crear', tag: 'C', color: 'text-emerald-400', checkedBg: 'bg-emerald-950/80 border-emerald-500 text-emerald-200' },
                { key: 'leer', label: 'Leer (Ver)', tag: 'L', color: 'text-blue-400', checkedBg: 'bg-blue-950/80 border-blue-500 text-blue-200' },
                { key: 'editar', label: 'Editar', tag: 'E', color: 'text-amber-400', checkedBg: 'bg-amber-950/80 border-amber-500 text-amber-200' },
                { key: 'eliminar', label: 'Eliminar', tag: 'X', color: 'text-rose-400', checkedBg: 'bg-rose-950/80 border-rose-500 text-rose-200' },
                { key: 'exportar', label: 'Exportar PDF/Excel', tag: 'EXP', color: 'text-purple-400', checkedBg: 'bg-purple-950/80 border-purple-500 text-purple-200' },
              ];

              return (
                <div key={mod.key} className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-4 shadow-xl space-y-3">
                  <div>
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold text-white">{mod.label}</h4>
                      <span className="text-[10px] text-slate-500 font-mono uppercase bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                        {mod.key}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">{mod.desc}</p>
                  </div>

                  {/* Interactive Checkbox Row */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1 border-t border-slate-800/80">
                    {actions.map((act) => {
                      const isChecked = perms[act.key];

                      return (
                        <label
                          key={act.key}
                          onClick={() => togglePermission(editorRole, mod.key, act.key)}
                          className={`flex items-center justify-between p-2 rounded-xl border text-xs font-semibold select-none transition-all ${
                            !isAdmin ? 'cursor-not-allowed opacity-75' : 'cursor-pointer'
                          } ${
                            isChecked
                              ? act.checkedBg + ' shadow-md'
                              : 'bg-slate-950/60 border-slate-800/80 text-slate-500 hover:text-slate-300 hover:border-slate-700'
                          }`}
                          title={!isAdmin ? 'Solo el Administrador del Sistema puede modificar permisos' : `Marcar o desmarcar ${act.label}`}
                        >
                          <div className="flex items-center gap-2">
                            {isChecked ? (
                              <CheckSquare className={`w-4 h-4 shrink-0 ${act.color}`} />
                            ) : (
                              <Square className="w-4 h-4 shrink-0 text-slate-600" />
                            )}
                            <span className="text-[11px]">{act.label}</span>
                          </div>
                          <span className={`text-[9px] font-mono font-bold px-1 py-0.2 rounded ${isChecked ? 'bg-black/30' : 'bg-slate-800 text-slate-500'}`}>
                            {act.tag}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: MATRIZ GENERAL RBAC DE 4 ROLES */}
      {activeTab === 'matriz' && (
        <div className="space-y-6">
          {/* Admin restriction notification banner */}
          {!isAdmin ? (
            <div className="bg-amber-950/60 border border-amber-500/50 p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-amber-200 shadow-xl">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-500/20 text-amber-400 rounded-xl shrink-0">
                  <Lock className="w-5 h-5" />
                </div>
                <div>
                  <span className="font-bold text-amber-300 block text-sm">Modo Consulta (Solo Lectura)</span>
                  <span>Solo el <strong>Administrador del Sistema</strong> está autorizado para marcar o editar los permisos en esta matriz. Tu rol activo en sesión es <strong>{getRoleTitle(currentRole)}</strong>.</span>
                </div>
              </div>
              <div className="px-3.5 py-1.5 bg-amber-900/50 text-amber-300 border border-amber-500/40 rounded-xl text-xs font-semibold shrink-0 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5" />
                <span>Acceso Restringido</span>
              </div>
            </div>
          ) : (
            <div className="bg-emerald-950/50 border border-emerald-500/40 p-3.5 rounded-2xl flex items-center gap-3 text-xs text-emerald-200 shadow-lg">
              <div className="p-1.5 bg-emerald-500/20 text-emerald-400 rounded-lg shrink-0">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div>
                <span className="font-bold text-emerald-300">Modo Administrador Habilitado:</span> Haz clic en las etiquetas de permisos para activarlos o desactivarlos en tiempo real.
              </div>
            </div>
          )}

          {/* Quick Role Cards Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {rolesInfo.map((r) => {
              const isCurrent = currentRole === r.role;
              const Icon = r.icon;
              let roleActiveStyle = 'bg-slate-900/60 border-slate-800 hover:border-slate-700';
              if (isCurrent) {
                if (r.role === UserRole.MEDICO_OCUPACIONAL) {
                  roleActiveStyle = 'bg-emerald-950/40 border-emerald-500/80 ring-2 ring-emerald-500/40 shadow-lg';
                } else if (r.role === UserRole.ENFERMERA_OCUPACIONAL) {
                  roleActiveStyle = 'bg-teal-950/40 border-teal-500/80 ring-2 ring-teal-500/40 shadow-lg';
                } else if (r.role === UserRole.ESPECIALISTA_SST) {
                  roleActiveStyle = 'bg-amber-950/40 border-amber-500/80 ring-2 ring-amber-500/40 shadow-lg';
                } else {
                  roleActiveStyle = 'bg-indigo-950/40 border-indigo-500/80 ring-2 ring-indigo-500/40 shadow-lg';
                }
              }

              return (
                <div
                  key={r.role}
                  onClick={() => {
                    setEditorRole(r.role);
                    setActiveTab('editor');
                  }}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${roleActiveStyle}`}
                  title="Haz clic para inspeccionar o personalizar permisos de este rol"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${isCurrent ? 'bg-indigo-500 text-white' : 'bg-slate-800 text-slate-400'}`}>
                      {isCurrent ? 'ROL EN SESIÓN' : 'VER CONFIGURACIÓN'}
                    </span>
                    <Icon className="w-5 h-5 text-indigo-400" />
                  </div>
                  <h4 className="text-sm font-bold text-white mb-1">{r.title}</h4>
                  <p className="text-[11px] text-slate-400 leading-relaxed">{r.desc}</p>
                </div>
              );
            })}
          </div>

          {/* Detailed Matrix Table */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-400" /> Matriz Comparativa de Permisos por Módulo
                </h3>
                <p className="text-xs text-slate-400">
                  Haz clic en cualquier botón de permiso (<strong>C</strong>, <strong>L</strong>, <strong>E</strong>, <strong>X</strong>, <strong>EXP</strong>) para activarlo o desactivarlo.
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={handleResetMatrix}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5"
                  title="Restablecer todos los permisos a la configuración legal por defecto"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
                  <span>Restablecer Defecto</span>
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-950 text-slate-300 border-b border-slate-800">
                    <th className="p-3 font-bold w-1/4">Módulo del ERP</th>
                    <th className="p-3 font-bold text-center text-emerald-400 border-l border-slate-800">
                      <div>1. Médico Ocupacional</div>
                      <div className="flex items-center justify-center gap-1 mt-1 font-normal text-[10px]">
                        <button
                          onClick={() => handleToggleAllForRole(UserRole.MEDICO_OCUPACIONAL, true)}
                          className="hover:underline text-emerald-400 cursor-pointer"
                        >
                          + Todo
                        </button>
                        <span>/</span>
                        <button
                          onClick={() => handleToggleAllForRole(UserRole.MEDICO_OCUPACIONAL, false)}
                          className="hover:underline text-slate-400 cursor-pointer"
                        >
                          - Nada
                        </button>
                      </div>
                    </th>
                    <th className="p-3 font-bold text-center text-teal-400 border-l border-slate-800">
                      <div>2. Enfermera Ocupacional</div>
                      <div className="flex items-center justify-center gap-1 mt-1 font-normal text-[10px]">
                        <button
                          onClick={() => handleToggleAllForRole(UserRole.ENFERMERA_OCUPACIONAL, true)}
                          className="hover:underline text-teal-400 cursor-pointer"
                        >
                          + Todo
                        </button>
                        <span>/</span>
                        <button
                          onClick={() => handleToggleAllForRole(UserRole.ENFERMERA_OCUPACIONAL, false)}
                          className="hover:underline text-slate-400 cursor-pointer"
                        >
                          - Nada
                        </button>
                      </div>
                    </th>
                    <th className="p-3 font-bold text-center text-amber-400 border-l border-slate-800">
                      <div>3. Especialista SST</div>
                      <div className="flex items-center justify-center gap-1 mt-1 font-normal text-[10px]">
                        <button
                          onClick={() => handleToggleAllForRole(UserRole.ESPECIALISTA_SST, true)}
                          className="hover:underline text-amber-400 cursor-pointer"
                        >
                          + Todo
                        </button>
                        <span>/</span>
                        <button
                          onClick={() => handleToggleAllForRole(UserRole.ESPECIALISTA_SST, false)}
                          className="hover:underline text-slate-400 cursor-pointer"
                        >
                          - Nada
                        </button>
                      </div>
                    </th>
                    <th className="p-3 font-bold text-center text-indigo-400 border-l border-slate-800">
                      <div>4. Administrador</div>
                      <div className="flex items-center justify-center gap-1 mt-1 font-normal text-[10px]">
                        <button
                          onClick={() => handleToggleAllForRole(UserRole.ADMINISTRADOR, true)}
                          className="hover:underline text-indigo-400 cursor-pointer"
                        >
                          + Todo
                        </button>
                        <span>/</span>
                        <button
                          onClick={() => handleToggleAllForRole(UserRole.ADMINISTRADOR, false)}
                          className="hover:underline text-slate-400 cursor-pointer"
                        >
                          - Nada
                        </button>
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-200">
                  {modulesList.map((mod) => {
                    const renderCellBadges = (role: Role) => {
                      const p = permissionsMatrix[role]?.[mod.key] || {
                        crear: false,
                        leer: false,
                        editar: false,
                        eliminar: false,
                        exportar: false
                      };

                      return (
                        <div className="flex items-center justify-center gap-1 flex-wrap">
                          <button
                            type="button"
                            onClick={() => togglePermission(role, mod.key, 'crear')}
                            disabled={!isAdmin}
                            className={`px-1.5 py-0.5 text-[10px] rounded font-mono font-bold transition-all ${
                              !isAdmin ? 'cursor-not-allowed opacity-75' : 'cursor-pointer'
                            } ${
                              p.crear
                                ? 'bg-emerald-600 text-white shadow-sm ring-1 ring-emerald-400'
                                : 'bg-slate-800/80 text-slate-500 border border-slate-700/60 hover:text-slate-300 hover:border-slate-500'
                            }`}
                            title={!isAdmin ? 'Solo el Administrador del Sistema puede modificar permisos' : `Haz clic para ${p.crear ? 'DESACTIVAR' : 'ACTIVAR'} Crear (C)`}
                          >
                            C
                          </button>

                          <button
                            type="button"
                            onClick={() => togglePermission(role, mod.key, 'leer')}
                            disabled={!isAdmin}
                            className={`px-1.5 py-0.5 text-[10px] rounded font-mono font-bold transition-all ${
                              !isAdmin ? 'cursor-not-allowed opacity-75' : 'cursor-pointer'
                            } ${
                              p.leer
                                ? 'bg-blue-600 text-white shadow-sm ring-1 ring-blue-400'
                                : 'bg-slate-800/80 text-slate-500 border border-slate-700/60 hover:text-slate-300 hover:border-slate-500'
                            }`}
                            title={!isAdmin ? 'Solo el Administrador del Sistema puede modificar permisos' : `Haz clic para ${p.leer ? 'DESACTIVAR' : 'ACTIVAR'} Leer (L)`}
                          >
                            L
                          </button>

                          <button
                            type="button"
                            onClick={() => togglePermission(role, mod.key, 'editar')}
                            disabled={!isAdmin}
                            className={`px-1.5 py-0.5 text-[10px] rounded font-mono font-bold transition-all ${
                              !isAdmin ? 'cursor-not-allowed opacity-75' : 'cursor-pointer'
                            } ${
                              p.editar
                                ? 'bg-amber-600 text-white shadow-sm ring-1 ring-amber-400'
                                : 'bg-slate-800/80 text-slate-500 border border-slate-700/60 hover:text-slate-300 hover:border-slate-500'
                            }`}
                            title={!isAdmin ? 'Solo el Administrador del Sistema puede modificar permisos' : `Haz clic para ${p.editar ? 'DESACTIVAR' : 'ACTIVAR'} Editar (E)`}
                          >
                            E
                          </button>

                          <button
                            type="button"
                            onClick={() => togglePermission(role, mod.key, 'eliminar')}
                            disabled={!isAdmin}
                            className={`px-1.5 py-0.5 text-[10px] rounded font-mono font-bold transition-all ${
                              !isAdmin ? 'cursor-not-allowed opacity-75' : 'cursor-pointer'
                            } ${
                              p.eliminar
                                ? 'bg-rose-600 text-white shadow-sm ring-1 ring-rose-400'
                                : 'bg-slate-800/80 text-slate-500 border border-slate-700/60 hover:text-slate-300 hover:border-slate-500'
                            }`}
                            title={!isAdmin ? 'Solo el Administrador del Sistema puede modificar permisos' : `Haz clic para ${p.eliminar ? 'DESACTIVAR' : 'ACTIVAR'} Eliminar (X)`}
                          >
                            X
                          </button>

                          <button
                            type="button"
                            onClick={() => togglePermission(role, mod.key, 'exportar')}
                            disabled={!isAdmin}
                            className={`px-1.5 py-0.5 text-[10px] rounded font-mono font-bold transition-all ${
                              !isAdmin ? 'cursor-not-allowed opacity-75' : 'cursor-pointer'
                            } ${
                              p.exportar
                                ? 'bg-purple-600 text-white shadow-sm ring-1 ring-purple-400'
                                : 'bg-slate-800/80 text-slate-500 border border-slate-700/60 hover:text-slate-300 hover:border-slate-500'
                            }`}
                            title={!isAdmin ? 'Solo el Administrador del Sistema puede modificar permisos' : `Haz clic para ${p.exportar ? 'DESACTIVAR' : 'ACTIVAR'} Exportar (EXP)`}
                          >
                            EXP
                          </button>
                        </div>
                      );
                    };

                    return (
                      <tr key={mod.key} className="hover:bg-slate-800/40 transition-colors">
                        <td className="p-3">
                          <span className="font-bold text-white block">{mod.label}</span>
                          <span className="text-[11px] text-slate-400">{mod.desc}</span>
                        </td>
                        <td className="p-3 text-center border-l border-slate-800/60 bg-emerald-950/10">
                          {renderCellBadges(UserRole.MEDICO_OCUPACIONAL)}
                        </td>
                        <td className="p-3 text-center border-l border-slate-800/60 bg-teal-950/10">
                          {renderCellBadges(UserRole.ENFERMERA_OCUPACIONAL)}
                        </td>
                        <td className="p-3 text-center border-l border-slate-800/60 bg-amber-950/10">
                          {renderCellBadges(UserRole.ESPECIALISTA_SST)}
                        </td>
                        <td className="p-3 text-center border-l border-slate-800/60 bg-indigo-950/10">
                          {renderCellBadges(UserRole.ADMINISTRADOR)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800 flex flex-wrap items-center gap-4 text-[11px] text-slate-400">
              <span className="font-bold text-slate-300">Leyenda:</span>
              <span className="flex items-center gap-1"><strong className="px-1.5 py-0.5 bg-emerald-900/60 text-emerald-300 rounded font-mono">C</strong> Crear</span>
              <span className="flex items-center gap-1"><strong className="px-1.5 py-0.5 bg-blue-900/60 text-blue-300 rounded font-mono">L</strong> Leer</span>
              <span className="flex items-center gap-1"><strong className="px-1.5 py-0.5 bg-amber-900/60 text-amber-300 rounded font-mono">E</strong> Editar</span>
              <span className="flex items-center gap-1"><strong className="px-1.5 py-0.5 bg-rose-900/60 text-rose-300 rounded font-mono">X</strong> Eliminar</span>
              <span className="flex items-center gap-1"><strong className="px-1.5 py-0.5 bg-purple-900/60 text-purple-300 rounded font-mono">EXP</strong> Exportar PDF/Excel</span>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: PROCEDIMIENTOS DE ACCESO Y USO */}
      {activeTab === 'procedimientos' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 1. Médico Ocupacional */}
            <div className="bg-slate-900 border border-emerald-800/50 rounded-2xl p-5 shadow-xl space-y-3">
              <div className="flex items-center gap-3 pb-3 border-b border-slate-800">
                <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-xl">
                  <Stethoscope className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-base">1. Procedimiento: Médico Ocupacional</h3>
                  <span className="text-xs text-emerald-400">Registro de Dictamen y Firma de Certificados</span>
                </div>
              </div>
              <ol className="space-y-2.5 text-xs text-slate-300 list-decimal list-inside">
                <li className="pl-1"><strong>Autenticación y Selección de Empresa:</strong> Inicia sesión e ingresa su código CMP y Registro Nacional de Médico Ocupacional (RNM).</li>
                <li className="pl-1"><strong>Revisión de Triaje y Pruebas Auxilares:</strong> Accede al módulo "Evaluaciones EMO" para auditar los resultados de laboratorio, espirometría, audiometría y triaje.</li>
                <li className="pl-1"><strong>Apertura y Llenado de Historia Clínica (HCO):</strong> Ingresa anamnesis, antecedentes patológicos, evaluación física por sistemas y codificación CIE-10.</li>
                <li className="pl-1"><strong>Emisión de Dictamen de Aptitud:</strong> Determina la aptitud médica laboral (Apto, Apto con Restricciones, No Apto) y consigna las restricciones específicas.</li>
                <li className="pl-1"><strong>Firma Digital de Certificado:</strong> Valida el certificado de aptitud EMO para su transmisión al trabajador y especialista SST.</li>
              </ol>
            </div>

            {/* 2. Enfermera Ocupacional */}
            <div className="bg-slate-900 border border-teal-800/50 rounded-2xl p-5 shadow-xl space-y-3">
              <div className="flex items-center gap-3 pb-3 border-b border-slate-800">
                <div className="p-2 bg-teal-500/20 text-teal-400 rounded-xl">
                  <UserCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-base">2. Procedimiento: Enfermera Ocupacional</h3>
                  <span className="text-xs text-teal-400">Triaje, Inmunizaciones y Apoyo Operativo</span>
                </div>
              </div>
              <ol className="space-y-2.5 text-xs text-slate-300 list-decimal list-inside">
                <li className="pl-1"><strong>Registro de Triaje Ocupacional:</strong> Ingresa en "Evaluaciones EMO" las funciones vitales (Presión Arterial, FC, FR, IMC, Agudeza Visual, SatO2).</li>
                <li className="pl-1"><strong>Carné de Inmunizaciones:</strong> Registra la administración de dosis de vacunas (Hepatitis B, Tétanos, Influenza, Fiebre Amarilla) en el módulo Vacunas.</li>
                <li className="pl-1"><strong>Registro de Ausentismo y CITT:</strong> Digita certificados de incapacidad temporal para el trabajo sin acceder al diagnóstico detallado del médico.</li>
                <li className="pl-1"><strong>Atención de Primeros Auxilios:</strong> Registra la atención inmediata de incidentes de salud para posterior derivación médica.</li>
                <li className="pl-1"><strong>Seguimiento de Observados:</strong> Monitorea a los trabajadores citados para subsanación de evaluaciones observadas.</li>
              </ol>
            </div>

            {/* 3. Especialista SST */}
            <div className="bg-slate-900 border border-amber-800/50 rounded-2xl p-5 shadow-xl space-y-3">
              <div className="flex items-center gap-3 pb-3 border-b border-slate-800">
                <div className="p-2 bg-amber-500/20 text-amber-400 rounded-xl">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-base">3. Procedimiento: Especialista SST</h3>
                  <span className="text-xs text-amber-400">Gestión de Accidentes, IPERC y Reportes MTPE</span>
                </div>
              </div>
              <ol className="space-y-2.5 text-xs text-slate-300 list-decimal list-inside">
                <li className="pl-1"><strong>Notificación de Accidentes (SAT 24h):</strong> Digita la investigación de accidentes/incidentes peligrosos para comunicación obligatoria al MTPE.</li>
                <li className="pl-1"><strong>Revisión de Aptitudes Laborales:</strong> Accede al módulo Aptitud para verificar restricciones operativas y readecuar puestos sin ver diagnósticos médicos.</li>
                <li className="pl-1"><strong>Programas de Vigilancia Ergonómica y SST:</strong> Define programas preventivos e indicadores de ausentismo por días perdidos.</li>
                <li className="pl-1"><strong>Definición de Protocolos EMO:</strong> Configura la matriz de baterías de exámenes según factores de riesgo identificados en la matriz IPERC.</li>
                <li className="pl-1"><strong>Generación de Reportes Anuales:</strong> Exporta estadísticas consolidadas e indicadores IGSO para auditorías SUNAFIL.</li>
              </ol>
            </div>

            {/* 4. Administrador del Sistema */}
            <div className="bg-slate-900 border border-indigo-800/50 rounded-2xl p-5 shadow-xl space-y-3">
              <div className="flex items-center gap-3 pb-3 border-b border-slate-800">
                <div className="p-2 bg-indigo-500/20 text-indigo-400 rounded-xl">
                  <Key className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-base">4. Procedimiento: Administrador</h3>
                  <span className="text-xs text-indigo-400">Gestión de Usuarios, Empresas y Parámetros ERP</span>
                </div>
              </div>
              <ol className="space-y-2.5 text-xs text-slate-300 list-decimal list-inside">
                <li className="pl-1"><strong>Alta y Mantenimiento de Empresas Clientes:</strong> Configura RUC, Razón Social, CIIU y sedes con niveles de riesgo SCTR.</li>
                <li className="pl-1"><strong>Gestión de Cuentas y Asignación de Roles:</strong> Crea credenciales para Médicos, Enfermeras y Especialistas SST asignando privilegios RBAC.</li>
                <li className="pl-1"><strong>Auditoría de Accesos (Trazabilidad Ley 29733):</strong> Revisa los logs del sistema para auditar quién accedió a cada módulo y verificar no vulneración médica.</li>
                <li className="pl-1"><strong>Carga Masiva de Trabajadores:</strong> Importa padrones de empleados desde plantillas Excel organizados por puesto y empresa.</li>
                <li className="pl-1"><strong>Mantenimiento Preventivo del ERP:</strong> Administra copias de seguridad de la base de datos y parámetros del sistema.</li>
              </ol>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: RESTRICCIONES CLÍNICAS Y LEGALES */}
      {activeTab === 'restricciones' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-rose-900/60 rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex items-center gap-3">
              <ShieldAlert className="w-7 h-7 text-rose-400 shrink-0" />
              <div>
                <h3 className="text-lg font-bold text-white">Marco Normativo de Confidencialidad en Salud Ocupacional</h3>
                <p className="text-xs text-slate-300">
                  Cumplimiento estricto de la <strong>Ley 29783 (Ley de Seguridad y Salud en el Trabajo)</strong> y <strong>Ley 29733 (Ley de Protección de Datos Personales)</strong>.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="p-4 bg-slate-950 rounded-xl border border-rose-800/40 space-y-2">
                <h4 className="text-xs font-bold text-rose-300 flex items-center gap-2">
                  <Lock className="w-4 h-4 text-rose-400" /> Información Exclusiva del Médico Ocupacional (CMP)
                </h4>
                <ul className="space-y-1.5 text-xs text-slate-300 list-disc list-inside">
                  <li><strong>Diagnósticos CIE-10 Específicos:</strong> Códigos de patologías, enfermedades crónicas o infecciosas.</li>
                  <li><strong>Historia Clínica Ocupacional Completa:</strong> Anamnesis, hábitos nocivos y filiación médica profunda.</li>
                  <li><strong>Informes y Hallazgos Auxiliares:</strong> Placas radiográficas, espirometrías, trazados EKG y audiogramas.</li>
                  <li><strong>Evoluciones de Exámenes Clínicos:</strong> Notas médicas de interconsultas y tratamiento.</li>
                </ul>
              </div>

              <div className="p-4 bg-slate-950 rounded-xl border border-amber-800/40 space-y-2">
                <h4 className="text-xs font-bold text-amber-300 flex items-center gap-2">
                  <Info className="w-4 h-4 text-amber-400" /> Campos Ocultos o Resumidos para Otros Roles
                </h4>
                <ul className="space-y-1.5 text-xs text-slate-300 list-disc list-inside">
                  <li><strong>Especialista SST y Administrador:</strong> Únicamente ven la condición de <em>APTITUD MÉDICA</em> y las <em>RESTRICCIONES OPERATIVAS</em> requeridas para el puesto (ej. "Uso de Lentes Correctores").</li>
                  <li><strong>Ausentismo Laboral:</strong> Se muestra el total de días perdidos e incapacidades, pero el código CIE-10 queda enmascarado.</li>
                  <li><strong>Enfermera Ocupacional:</strong> Accede a constantes de triaje e inmunizaciones, sin potestad para emitir el certificado de aptitud.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: CÓDIGO TÉCNICO TYPESCRIPT / EXPRESS / REACT */}
      {activeTab === 'implementacion' && (
        <div className="space-y-6">
          {/* TypeScript Role Enum & Schema */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Code2 className="w-4 h-4 text-emerald-400" /> 1. Esquema de Roles TypeScript (`src/types/erp.ts`)
              </h3>
              <button
                onClick={() => copyToClipboard(`export enum UserRole {
  MEDICO_OCUPACIONAL = 'MEDICO_OCUPACIONAL',
  ENFERMERA_OCUPACIONAL = 'ENFERMERA_OCUPACIONAL',
  ESPECIALISTA_SST = 'ESPECIALISTA_SST',
  ADMINISTRADOR = 'ADMINISTRADOR',
}

export type Role = 'MEDICO_OCUPACIONAL' | 'ENFERMERA_OCUPACIONAL' | 'ESPECIALISTA_SST' | 'ADMINISTRADOR';`, 'ts-roles')}
                className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-xs flex items-center gap-1 font-medium"
              >
                {copiedSnippet === 'ts-roles' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedSnippet === 'ts-roles' ? 'Copiado' : 'Copiar'}
              </button>
            </div>
            <pre className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs font-mono text-slate-200 overflow-x-auto">
{`export enum UserRole {
  MEDICO_OCUPACIONAL = 'MEDICO_OCUPACIONAL',
  ENFERMERA_OCUPACIONAL = 'ENFERMERA_OCUPACIONAL',
  ESPECIALISTA_SST = 'ESPECIALISTA_SST',
  ADMINISTRADOR = 'ADMINISTRADOR',
}

export type Role = 'MEDICO_OCUPACIONAL' | 'ENFERMERA_OCUPACIONAL' | 'ESPECIALISTA_SST' | 'ADMINISTRADOR';`}
            </pre>
          </div>

          {/* Express Authorization Middleware */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Cpu className="w-4 h-4 text-amber-400" /> 2. Middleware de Autorización Express (`src/backend/middleware/authRole.middleware.ts`)
              </h3>
              <button
                onClick={() => copyToClipboard(`import { Request, Response, NextFunction } from 'express';
import { UserRole, Role, SystemModuleKey } from '../../types/erp';

export function authorize(moduleKey: SystemModuleKey, action: 'crear' | 'leer' | 'editar' | 'eliminar' | 'exportar') {
  return (req: Request, res: Response, next: NextFunction) => {
    const roleHeader = (req.headers['x-user-role'] as Role) || UserRole.MEDICO_OCUPACIONAL;
    const rolePermissions = SERVER_PERMISSIONS_MATRIX[roleHeader];
    const modulePerms = rolePermissions?.[moduleKey];

    if (!modulePerms || !modulePerms[action]) {
      return res.status(403).json({
        error: 'Acceso Denegado',
        message: \`El rol '\${roleHeader}' no posee permisos de [\${action}] para '\${moduleKey}'.\`
      });
    }
    next();
  };
}`, 'express-mw')}
                className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-xs flex items-center gap-1 font-medium"
              >
                {copiedSnippet === 'express-mw' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedSnippet === 'express-mw' ? 'Copiado' : 'Copiar'}
              </button>
            </div>
            <pre className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs font-mono text-slate-200 overflow-x-auto">
{`import { Request, Response, NextFunction } from 'express';
import { UserRole, Role, SystemModuleKey } from '../../types/erp';

export function authorize(moduleKey: SystemModuleKey, action: 'crear' | 'leer' | 'editar' | 'eliminar' | 'exportar') {
  return (req: Request, res: Response, next: NextFunction) => {
    const roleHeader = (req.headers['x-user-role'] as Role) || UserRole.MEDICO_OCUPACIONAL;
    const rolePermissions = SERVER_PERMISSIONS_MATRIX[roleHeader];
    const modulePerms = rolePermissions?.[moduleKey];

    if (!modulePerms || !modulePerms[action]) {
      return res.status(403).json({
        error: 'Acceso Denegado',
        message: \`El rol '\${roleHeader}' no posee permisos de [\${action}] en el módulo '\${moduleKey}'.\`
      });
    }
    next();
  };
}`}
            </pre>
          </div>

          {/* React Authorization Guard Component */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-indigo-400" /> 3. Componente de Control de Acceso React ({'<RequireRole>'})
              </h3>
            </div>
            <pre className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs font-mono text-slate-200 overflow-x-auto">
{`export const RequireRole: React.FC<RequireRoleProps> = ({ currentRole, moduleKey, action = 'leer', children }) => {
  const hasAccess = checkModulePermission(currentRole, moduleKey, action);

  if (!hasAccess) {
    return (
      <div className="p-4 rounded-xl bg-slate-900 border border-rose-900 text-center text-slate-300">
        <p className="text-xs font-bold text-rose-300">Acceso Denegado por Rol (Ley 29733 / Ley 29783)</p>
      </div>
    );
  }

  return <>{children}</>;
};`}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};
