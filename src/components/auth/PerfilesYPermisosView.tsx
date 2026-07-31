import React, { useState } from 'react';
import { Role, UserRole, SystemModuleKey } from '../../types/erp';
import { SERVER_PERMISSIONS_MATRIX } from '../../backend/middleware/authRole.middleware';
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
  Copy
} from 'lucide-react';

interface PerfilesYPermisosViewProps {
  currentRole: Role;
  onRoleChange: (role: Role) => void;
}

export const PerfilesYPermisosView: React.FC<PerfilesYPermisosViewProps> = ({
  currentRole,
  onRoleChange
}) => {
  const [activeTab, setActiveTab] = useState<'matriz' | 'procedimientos' | 'restricciones' | 'implementacion'>('matriz');
  const [copiedSnippet, setCopiedSnippet] = useState<string | null>(null);

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
      desc: 'Máxima autoridad médica y técnica en el ERP. Acceso total e ilimitado a todos los módulos del sistema (Empresas, Trabajadores, Historias Clínicas, EMOs, Aptitudes, Accidentes, Vacunas, Ausentismo, Vigilancia, Reportes y Protocolos).',
      icon: Stethoscope
    },
    { 
      role: UserRole.ENFERMERA_OCUPACIONAL, 
      title: '2. ENFERMERA OCUPACIONAL', 
      color: 'teal', 
      desc: 'Acceso total e ilimitado a todos los módulos del ERP (Empresas, Trabajadores, Historias Clínicas, EMOs, Aptitudes, Accidentes, Vacunas, Ausentismo, Vigilancia, Reportes y Protocolos).',
      icon: UserCheck
    },
    { 
      role: UserRole.ESPECIALISTA_SST, 
      title: '3. ESPECIALISTA SST', 
      color: 'amber', 
      desc: 'Gestión técnica e industrial: investigación de accidentes SAT 24h, programas de vigilancia ambiental, matrices IPERC e indicadores de ausentismo.',
      icon: ShieldCheck
    },
    { 
      role: UserRole.ADMINISTRADOR, 
      title: '4. ADMINISTRADOR DEL SISTEMA', 
      color: 'indigo', 
      desc: 'Gestión técnica y de configuración: creación de usuarios, roles, empresas cliente y parámetros globales del sistema ERP. Sin acceso a datos clínicos.',
      icon: Key
    },
  ];

  const copyToClipboard = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedSnippet(id);
    setTimeout(() => setCopiedSnippet(null), 2500);
  };

  return (
    <div className="space-y-6">
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
                Perfiles de Usuario, Permisos y Procedimientos de Acceso
              </h2>
              <p className="text-xs text-slate-300 mt-1 max-w-2xl">
                Matriz de control de acceso basada en roles (RBAC) restringida exactamente a los 4 roles normativos de la Salud Ocupacional en el Perú.
              </p>
            </div>
          </div>

          {/* Role Switcher Sandbox */}
          <div className="bg-slate-950 border border-slate-800 p-3 rounded-xl shrink-0">
            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block mb-1">
              Rol Activo de Pruebas:
            </span>
            <select
              value={currentRole}
              onChange={(e) => onRoleChange(e.target.value as Role)}
              className="bg-slate-900 border border-indigo-500/50 text-white font-bold text-xs rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
            >
              <option value="MEDICO_OCUPACIONAL">1. Médico Ocupacional</option>
              <option value="ENFERMERA_OCUPACIONAL">2. Enfermera Ocupacional</option>
              <option value="ESPECIALISTA_SST">3. Especialista SST</option>
              <option value="ADMINISTRADOR">4. Administrador</option>
            </select>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 mt-6 pt-4 border-t border-slate-800">
          <button
            onClick={() => setActiveTab('matriz')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${activeTab === 'matriz' ? 'bg-indigo-600 text-white shadow-lg' : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800'}`}
          >
            <ShieldCheck className="w-4 h-4" /> 1. Matriz de Permisos por Rol
          </button>
          <button
            onClick={() => setActiveTab('procedimientos')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${activeTab === 'procedimientos' ? 'bg-indigo-600 text-white shadow-lg' : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800'}`}
          >
            <BookOpen className="w-4 h-4" /> 2. Procedimientos de Acceso y Uso
          </button>
          <button
            onClick={() => setActiveTab('restricciones')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${activeTab === 'restricciones' ? 'bg-indigo-600 text-white shadow-lg' : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800'}`}
          >
            <Lock className="w-4 h-4" /> 3. Restricciones Clínicas y Legales
          </button>
          <button
            onClick={() => setActiveTab('implementacion')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${activeTab === 'implementacion' ? 'bg-indigo-600 text-white shadow-lg' : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800'}`}
          >
            <Code2 className="w-4 h-4" /> 4. Código Técnico TypeScript / Express
          </button>
        </div>
      </div>

      {/* TAB 1: MATRIZ DE PERMISOS */}
      {activeTab === 'matriz' && (
        <div className="space-y-6">
          {/* Quick Role Cards Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {rolesInfo.map((r) => {
              const isCurrent = currentRole === r.role;
              const Icon = r.icon;
              return (
                <div
                  key={r.role}
                  onClick={() => onRoleChange(r.role)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    isCurrent
                      ? `bg-${r.color}-950/40 border-${r.color}-500/80 ring-2 ring-${r.color}-500/40 shadow-lg`
                      : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${isCurrent ? 'bg-indigo-500 text-white' : 'bg-slate-800 text-slate-400'}`}>
                      {isCurrent ? 'ROL ACTIVO' : 'CLIC PARA PROBAR'}
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
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-400" /> Matriz de Permisos por Módulo y Rol
                </h3>
                <p className="text-xs text-slate-400">
                  Especificación de acciones: Crear (C), Leer (L), Editar (E), Eliminar (X), Exportar (EXP).
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-950 text-slate-300 border-b border-slate-800">
                    <th className="p-3 font-bold w-1/4">Módulo del ERP</th>
                    <th className="p-3 font-bold text-center text-emerald-400 border-l border-slate-800">
                      1. Médico Ocupacional
                    </th>
                    <th className="p-3 font-bold text-center text-teal-400 border-l border-slate-800">
                      2. Enfermera Ocupacional
                    </th>
                    <th className="p-3 font-bold text-center text-amber-400 border-l border-slate-800">
                      3. Especialista SST
                    </th>
                    <th className="p-3 font-bold text-center text-indigo-400 border-l border-slate-800">
                      4. Administrador
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-200">
                  {modulesList.map((mod) => {
                    const med = SERVER_PERMISSIONS_MATRIX[UserRole.MEDICO_OCUPACIONAL][mod.key];
                    const enf = SERVER_PERMISSIONS_MATRIX[UserRole.ENFERMERA_OCUPACIONAL][mod.key];
                    const sst = SERVER_PERMISSIONS_MATRIX[UserRole.ESPECIALISTA_SST][mod.key];
                    const adm = SERVER_PERMISSIONS_MATRIX[UserRole.ADMINISTRADOR][mod.key];

                    const renderBadges = (p: typeof med) => {
                      if (!p.leer && !p.crear && !p.editar && !p.eliminar) {
                        return <span className="px-2 py-0.5 bg-rose-950/60 text-rose-400 border border-rose-800/60 rounded text-[10px] font-bold">NINGUNO</span>;
                      }
                      return (
                        <div className="flex items-center justify-center gap-1 flex-wrap">
                          {p.crear && <span className="px-1.5 py-0.5 bg-emerald-900/60 text-emerald-300 text-[10px] rounded font-mono font-bold" title="Crear">C</span>}
                          {p.leer && <span className="px-1.5 py-0.5 bg-blue-900/60 text-blue-300 text-[10px] rounded font-mono font-bold" title="Leer">L</span>}
                          {p.editar && <span className="px-1.5 py-0.5 bg-amber-900/60 text-amber-300 text-[10px] rounded font-mono font-bold" title="Editar">E</span>}
                          {p.eliminar && <span className="px-1.5 py-0.5 bg-rose-900/60 text-rose-300 text-[10px] rounded font-mono font-bold" title="Eliminar">X</span>}
                          {p.exportar && <span className="px-1.5 py-0.5 bg-purple-900/60 text-purple-300 text-[10px] rounded font-mono font-bold" title="Exportar">EXP</span>}
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
                          {renderBadges(med)}
                        </td>
                        <td className="p-3 text-center border-l border-slate-800/60 bg-teal-950/10">
                          {renderBadges(enf)}
                        </td>
                        <td className="p-3 text-center border-l border-slate-800/60 bg-amber-950/10">
                          {renderBadges(sst)}
                        </td>
                        <td className="p-3 text-center border-l border-slate-800/60 bg-indigo-950/10">
                          {renderBadges(adm)}
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

      {/* TAB 2: PROCEDIMIENTOS DE ACCESO Y USO */}
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

      {/* TAB 3: RESTRICCIONES CLÍNICAS Y LEGALES */}
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

      {/* TAB 4: CÓDIGO TÉCNICO TYPESCRIPT / EXPRESS / REACT */}
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
                <ShieldCheck className="w-4 h-4 text-indigo-400" /> 3. Componente de Control de Acceso React ({`<RequireRole>`})
              </h3>
            </div>
            <pre className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs font-mono text-slate-200 overflow-x-auto">
{`export const RequireRole: React.FC<RequireRoleProps> = ({ currentRole, moduleKey, action = 'leer', children }) => {
  const roleMatrix = SERVER_PERMISSIONS_MATRIX[currentRole];
  const hasAccess = roleMatrix && roleMatrix[moduleKey] && roleMatrix[moduleKey][action];

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
