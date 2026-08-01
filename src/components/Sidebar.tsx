import React, { useState, useEffect } from 'react';
import { Role, UserRole } from '../types/erp';
import { checkModulePermission, PERMISSIONS_UPDATED_EVENT } from '../utils/permissions';
import { 
  LayoutDashboard, 
  Building2, 
  Users, 
  FileSpreadsheet, 
  Stethoscope, 
  Award, 
  AlertTriangle, 
  Clock, 
  Activity, 
  Syringe, 
  FileCheck, 
  FileText, 
  BookOpen, 
  Scale, 
  Cpu, 
  Database, 
  Palette, 
  Map, 
  CheckSquare, 
  Package, 
  ShieldAlert,
  ShieldCheck,
  ClipboardList,
  Lock
} from 'lucide-react';

export type ActiveTab = 
  | 'dashboard'
  | 'empresas'
  | 'trabajadores'
  | 'historia_clinica'
  | 'emo_examenes'
  | 'protocolos_medicos'
  | 'aptitudes'
  | 'accidentes'
  | 'ausentismo'
  | 'vigilancia'
  | 'vacunas'
  | 'reportes_minsa'
  | 'guia_maestra'
  | 'perfiles_permisos'
  // Documentation Tabs (Indications 1 to 11)
  | 'doc_definicion'
  | 'doc_srs_ieee'
  | 'doc_reglas_negocio'
  | 'doc_arquitectura'
  | 'doc_base_datos'
  | 'doc_uxui'
  | 'doc_roadmap'
  | 'doc_qa_testing'
  | 'doc_produccion_docker';

interface SidebarProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  currentRole?: Role;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, onTabChange, currentRole = UserRole.MEDICO_OCUPACIONAL }) => {
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
  // Mapping of sidebar tab IDs to SystemModuleKey in permissions matrix
  const tabToModuleKey: Record<string, any> = {
    empresas: 'empresas',
    trabajadores: 'trabajadores',
    historia_clinica: 'historia_clinica',
    emo_examenes: 'emo',
    protocolos_medicos: 'protocolos',
    aptitudes: 'aptitud',
    accidentes: 'accidentes',
    ausentismo: 'ausentismo',
    vigilancia: 'vigilancia',
    vacunas: 'vacunas',
    reportes_minsa: 'reportes_minsa',
  };

  const moduloOperativoItems = [
    { id: 'dashboard', label: 'Dashboard & IGSO', icon: LayoutDashboard, badge: 'Ley 29783' },
    { id: 'empresas', label: 'Empresas & Sedes', icon: Building2 },
    { id: 'trabajadores', label: 'Trabajadores & IPERC', icon: Users },
    { id: 'historia_clinica', label: 'Historia Clínica (HCO)', icon: FileSpreadsheet },
    { id: 'emo_examenes', label: 'Evaluaciones EMO', icon: Stethoscope, badge: 'RM 312' },
    { id: 'protocolos_medicos', label: 'Protocolos EMO (PDF/Excel)', icon: ClipboardList, badge: 'Matrices' },
    { id: 'aptitudes', label: 'Certificados Aptitud', icon: Award },
    { id: 'accidentes', label: 'Accidentes & Incidentes', icon: AlertTriangle, badge: 'SAT 24h' },
    { id: 'ausentismo', label: 'Ausentismo & CIE-10', icon: Clock },
    { id: 'vigilancia', label: 'Vigilancia Epidemiológica', icon: Activity },
    { id: 'vacunas', label: 'Carné de Inmunizaciones', icon: Syringe },
    { id: 'reportes_minsa', label: 'Reportes MINSA / MTPE', icon: FileCheck },
    { id: 'guia_maestra', label: 'Guía Maestra (10 Pilares)', icon: ShieldCheck, badge: 'SUNAFIL' },
    { id: 'perfiles_permisos', label: 'Perfiles & Permisos RBAC', icon: ShieldAlert, badge: 'Roles' }
  ];

  const moduloTecnicoItems = [
    { id: 'doc_definicion', label: 'Ind 1-2: Definición Proyecto', icon: FileText },
    { id: 'doc_srs_ieee', label: 'Ind 3: Especificación IEEE SRS', icon: BookOpen },
    { id: 'doc_reglas_negocio', label: 'Ind 4: Catálogo Reglas (30+)', icon: Scale, badge: 'Normas' },
    { id: 'doc_arquitectura', label: 'Ind 5: Arquitectura & Specs', icon: Cpu },
    { id: 'doc_base_datos', label: 'Ind 6: Modelo ER & DDL BD', icon: Database },
    { id: 'doc_uxui', label: 'Ind 7: Sistema Diseño UX/UI', icon: Palette },
    { id: 'doc_roadmap', label: 'Ind 8: Roadmap & Sprints', icon: Map },
    { id: 'doc_qa_testing', label: 'Ind 10: Suite Pruebas QA', icon: CheckSquare },
    { id: 'doc_produccion_docker', label: 'Ind 11: Despliegue & Docker', icon: Package }
  ];

  return (
    <aside className="w-56 bg-slate-950 border-r border-slate-800 flex flex-col shrink-0 text-slate-300">
      <div className="p-3 flex-1 space-y-5 overflow-y-auto custom-scrollbar">
        {/* OPERACIONAL */}
        <div>
          <div className="px-2 mb-2 text-[11px] font-semibold text-slate-500 uppercase tracking-wider flex items-center justify-between">
            <span>Operaciones SST</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          </div>
          <nav className="space-y-1">
            {moduloOperativoItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              const moduleKey = tabToModuleKey[item.id];
              const hasAccess = moduleKey ? checkModulePermission(currentRole, moduleKey, 'leer') : true;

              return (
                <button
                  key={item.id}
                  onClick={() => onTabChange(item.id as ActiveTab)}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30'
                      : !hasAccess
                      ? 'text-slate-500 hover:bg-slate-900/60 hover:text-slate-400'
                      : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
                  }`}
                  title={!hasAccess ? `Acceso a datos médicos confidenciales restringido para ${currentRole} (Ley 29733)` : undefined}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : !hasAccess ? 'text-slate-600' : 'text-slate-400'}`} />
                    <span className="truncate">{item.label}</span>
                  </div>
                  {!hasAccess ? (
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-rose-950/60 text-rose-400 border border-rose-900/50 flex items-center gap-0.5">
                      <Lock className="w-2.5 h-2.5" /> Médico
                    </span>
                  ) : item.badge ? (
                    <span
                      className={`text-[9px] font-medium px-1.5 py-0.5 rounded ${
                        isActive
                          ? 'bg-indigo-700 text-indigo-100'
                          : 'bg-slate-900 text-slate-500 border border-slate-800'
                      }`}
                    >
                      {item.badge}
                    </span>
                  ) : null}
                </button>
              );
            })}
          </nav>
        </div>

        {/* DOCUMENTACION TECNICA (INDICACIONES 1 A 11) */}
        <div>
          <div className="px-2 mb-2 text-[11px] font-semibold text-slate-500 uppercase tracking-wider flex items-center justify-between">
            <span>Especificaciones</span>
            <span className="text-[9px] px-1 bg-slate-900 text-slate-400 rounded border border-slate-800 font-normal">Docs</span>
          </div>
          <nav className="space-y-1">
            {moduloTecnicoItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onTabChange(item.id as ActiveTab)}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30'
                      : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                    <span className="truncate">{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="text-[9px] font-medium px-1.5 py-0.5 bg-slate-900 text-slate-500 rounded border border-slate-800">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* FOOTER METADATA */}
      <div className="p-3 border-t border-slate-800 text-[11px] text-slate-500 space-y-1">
        <div className="flex items-center justify-between font-medium text-slate-300">
          <span>MedOcupa ERP</span>
          <span className="text-[10px] text-emerald-400">PostgreSQL</span>
        </div>
        <p className="text-[10px] text-slate-500">Cumplimiento Legal MINSA/MTPE 2026</p>
      </div>
    </aside>
  );
};
