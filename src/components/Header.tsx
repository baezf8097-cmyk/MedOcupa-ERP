import React from 'react';
import { Role, User } from '../types/erp';
import { Stethoscope, Search, Building2, LogOut, UserCheck, ShieldCheck, Edit3 } from 'lucide-react';

interface HeaderProps {
  currentUser: User | null;
  selectedEmpresaId: string;
  onEmpresaChange: (empresaId: string) => void;
  empresas: { id: string; razonSocial: string }[];
  onOpenAuditLog: () => void;
  onOpenEditProfile?: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentUser,
  selectedEmpresaId,
  onEmpresaChange,
  empresas,
  onOpenAuditLog,
  onOpenEditProfile,
  searchQuery,
  onSearchChange,
  onLogout
}) => {
  const getRoleLabel = (role?: Role) => {
    switch (role) {
      case 'MEDICO_OCUPACIONAL': return 'Médico Ocupacional';
      case 'ENFERMERA_OCUPACIONAL': return 'Enfermera Ocupacional';
      case 'ESPECIALISTA_SST': return 'Especialista SST';
      case 'ADMINISTRADOR': return 'Administrador';
      default: return 'Usuario MedOcupa';
    }
  };

  const getRoleBadgeColor = (role?: Role) => {
    switch (role) {
      case 'MEDICO_OCUPACIONAL': return 'bg-emerald-900/40 text-emerald-300 border-emerald-700/50';
      case 'ENFERMERA_OCUPACIONAL': return 'bg-teal-900/40 text-teal-300 border-teal-700/50';
      case 'ESPECIALISTA_SST': return 'bg-amber-900/40 text-amber-300 border-amber-700/50';
      case 'ADMINISTRADOR': return 'bg-indigo-900/40 text-indigo-300 border-indigo-700/50';
      default: return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  return (
    <header className="sticky top-0 z-30 h-14 bg-slate-950 border-b border-slate-800 text-slate-100 shadow-sm shrink-0">
      <div className="h-full px-4 flex items-center justify-between gap-4">
        {/* Brand Logo & Name */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-md shadow-indigo-500/20">
            <Stethoscope className="w-5 h-5" />
          </div>
          <div className="flex items-center gap-2">
            <h1 className="font-semibold text-sm tracking-wide text-slate-100 font-sans">MedOcupa ERP</h1>
            <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Ley 29783 & RM 312
            </span>
          </div>
        </div>

        {/* Global Search Bar */}
        <div className="hidden md:flex flex-1 max-w-sm items-center relative">
          <Search className="w-4 h-4 absolute left-3 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Buscar por Trabajador (DNI), EMO, Empresa..."
            className="w-full bg-slate-900 border border-slate-800 rounded-md pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
          />
        </div>

        {/* Controls: Company Filter & User Session Info */}
        <div className="flex items-center gap-2.5 text-xs">
          {/* Company Filter Selector */}
          <div className="hidden lg:flex items-center gap-1.5 bg-slate-900 border border-slate-800 rounded-md px-2.5 py-1 text-slate-300">
            <Building2 className="w-3.5 h-3.5 text-indigo-400" />
            <select
              value={selectedEmpresaId}
              onChange={(e) => onEmpresaChange(e.target.value)}
              className="bg-transparent text-xs text-slate-200 font-medium focus:outline-none cursor-pointer"
            >
              <option value="TODAS" className="bg-slate-950 text-slate-200">Todas las Empresas Clientes</option>
              {empresas.map((emp) => (
                <option key={emp.id} value={emp.id} className="bg-slate-950 text-slate-200">
                  {emp.razonSocial}
                </option>
              ))}
            </select>
          </div>

          {/* User Logged Info */}
          {currentUser && (
            <div className={`hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-md border text-xs ${getRoleBadgeColor(currentUser.rol)}`}>
              <button
                onClick={onOpenEditProfile}
                className="flex items-center gap-2 hover:opacity-80 transition-opacity cursor-pointer text-left"
                title="Haz clic para editar nombre, CMP, RNM o CEP del profesional"
              >
                <UserCheck className="w-3.5 h-3.5 shrink-0" />
                <div className="flex flex-col text-[11px] leading-tight">
                  <span className="font-semibold flex items-center gap-1">
                    {currentUser.nombre}
                    <Edit3 className="w-3 h-3 opacity-60 hover:opacity-100" />
                  </span>
                  <span className="opacity-80 text-[10px]">{getRoleLabel(currentUser.rol)} {currentUser.cmp_rnm || currentUser.cep || ''}</span>
                </div>
              </button>
            </div>
          )}

          {/* Audit Logs button */}
          <button
            onClick={onOpenAuditLog}
            className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 hover:border-slate-700 px-2.5 py-1.5 rounded-md text-slate-300 transition-colors cursor-pointer"
            title="Ver trazabilidad de auditoría"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden md:inline text-xs font-medium">Auditoría</span>
          </button>

          {/* Logout Button */}
          <button
            onClick={onLogout}
            className="flex items-center gap-1.5 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-300 px-2.5 py-1.5 rounded-md transition-colors cursor-pointer"
            title="Cerrar Sesión"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden md:inline text-xs font-medium">Salir</span>
          </button>
        </div>
      </div>
    </header>
  );
};
