import React, { useState } from 'react';
import { Trabajador, Empresa, FactorRiesgo } from '../../types/erp';
import {
  Users,
  Plus,
  ShieldAlert,
  UserCheck,
  Search,
  Filter,
  Briefcase,
  FileText,
  CheckCircle2,
  Edit3,
  Trash2,
  PlusCircle,
  X,
  Save,
  AlertTriangle,
  Building2,
  Calendar,
  Phone,
  Mail,
  Shield
} from 'lucide-react';

interface TrabajadoresModuleProps {
  trabajadores: Trabajador[];
  empresas: Empresa[];
  selectedEmpresaId: string;
  onAddTrabajador: (trabajador: Trabajador) => void;
  onUpdateTrabajador?: (trabajador: Trabajador) => void;
  onDeleteTrabajador?: (trabajadorId: string) => void;
  onSelectTrabajadorForHCO: (trabajadorId: string) => void;
}

export const calculateAge = (birthDateString?: string): number | string => {
  if (!birthDateString) return '--';
  const birth = new Date(birthDateString);
  if (isNaN(birth.getTime())) return '--';
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age >= 0 ? age : 0;
};

export const TrabajadoresModule: React.FC<TrabajadoresModuleProps> = ({
  trabajadores,
  empresas,
  selectedEmpresaId,
  onAddTrabajador,
  onUpdateTrabajador,
  onDeleteTrabajador,
  onSelectTrabajadorForHCO
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingTrabajador, setEditingTrabajador] = useState<Trabajador | null>(null);
  const [deletingTrabajador, setDeletingTrabajador] = useState<Trabajador | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'TODOS' | 'ACTIVO' | 'INACTIVO' | 'LICENCIA'>('TODOS');

  // Form state for creating a new worker
  const [newTrabData, setNewTrabData] = useState<Partial<Trabajador>>({
    tipoDocumento: 'DNI',
    numeroDocumento: '',
    nombres: '',
    apellidoPaterno: '',
    apellidoMaterno: '',
    fechaNacimiento: '1992-05-10',
    sexo: 'M',
    telefono: '987654321',
    email: '',
    puestoTrabajo: 'Operador de Planta',
    area: 'Operaciones',
    grupoOcupacional: 'OPERATIVO',
    fechaIngreso: new Date().toISOString().split('T')[0],
    empresaId: empresas[0]?.id || 'emp-1',
    estado: 'ACTIVO',
    factoresRiesgo: [
      { tipo: 'FISICO', descripcion: 'Ruido laboral continuo >85dB(A)', intensidadNivel: 'ALTO' },
      { tipo: 'ERGONOMICO', descripcion: 'Posturas forzadas y levantamiento de cargas', intensidadNivel: 'MEDIO' }
    ]
  });

  // State for adding a risk factor inside the editor modal
  const [newRiskType, setNewRiskType] = useState<FactorRiesgo['tipo']>('FISICO');
  const [newRiskDesc, setNewRiskDesc] = useState('');
  const [newRiskLevel, setNewRiskLevel] = useState<FactorRiesgo['intensidadNivel']>('MEDIO');

  // Quick risk factor preset suggestions
  const RISK_PRESETS = [
    { tipo: 'FISICO' as const, desc: 'Ruido continuo >85dB(A)', nivel: 'ALTO' as const },
    { tipo: 'FISICO' as const, desc: 'Vibración de cuerpo entero o segmento mano-brazo', nivel: 'MEDIO' as const },
    { tipo: 'QUIMICO' as const, desc: 'Exposición a polvo de sílice respirable', nivel: 'CRITICO' as const },
    { tipo: 'QUIMICO' as const, desc: 'Inhalación de vapores orgánicos y solventes', nivel: 'ALTO' as const },
    { tipo: 'BIOLOGICO' as const, desc: 'Riesgo biológico por manipulación de fluidos/agentes', nivel: 'MEDIO' as const },
    { tipo: 'ERGONOMICO' as const, desc: 'Posturas forzadas y movimientos repetitivos', nivel: 'MEDIO' as const },
    { tipo: 'ERGONOMICO' as const, desc: 'Manipulación manual de cargas >25kg', nivel: 'ALTO' as const },
    { tipo: 'PSICOSOCIAL' as const, desc: 'Carga mental y trabajo en turnos rotativos nocturnos', nivel: 'BAJO' as const }
  ];

  // Filtering workers
  const filteredTrabajadores = trabajadores.filter((t) => {
    const matchesEmpresa = selectedEmpresaId === 'TODAS' || t.empresaId === selectedEmpresaId;
    const matchesStatus = statusFilter === 'TODOS' || t.estado === statusFilter;
    const query = searchTerm.toLowerCase();
    const matchesQuery =
      t.nombres.toLowerCase().includes(query) ||
      t.apellidoPaterno.toLowerCase().includes(query) ||
      t.apellidoMaterno.toLowerCase().includes(query) ||
      t.numeroDocumento.includes(query) ||
      t.puestoTrabajo.toLowerCase().includes(query) ||
      t.area.toLowerCase().includes(query);

    return matchesEmpresa && matchesStatus && matchesQuery;
  });

  const getEmpresaNombre = (empresaId: string) => {
    const emp = empresas.find(e => e.id === empresaId);
    return emp ? emp.nombreComercial : 'Empresa Externa';
  };

  // Quick IPERC Risk Editor modal state
  const [ipercModalTrabajador, setIpercModalTrabajador] = useState<Trabajador | null>(null);

  // Submit Quick IPERC update
  const handleSaveIpercModal = () => {
    if (ipercModalTrabajador && onUpdateTrabajador) {
      onUpdateTrabajador(ipercModalTrabajador);
      setIpercModalTrabajador(null);
    }
  };

  // Quick Status Toggle directly in Table
  const handleQuickStatusChange = (trabajador: Trabajador, newStatus: Trabajador['estado']) => {
    if (onUpdateTrabajador) {
      onUpdateTrabajador({
        ...trabajador,
        estado: newStatus
      });
    }
  };
  // Submit New Worker
  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTrabData.numeroDocumento || newTrabData.numeroDocumento.length < 8) {
      alert('Error: Documento debe poseer mínimo 8 dígitos (DNI o CE).');
      return;
    }

    const newTrab: Trabajador = {
      id: `trab-${Date.now()}`,
      empresaId: newTrabData.empresaId!,
      sedeId: 'sed-1',
      tipoDocumento: newTrabData.tipoDocumento as any,
      numeroDocumento: newTrabData.numeroDocumento!,
      nombres: newTrabData.nombres!,
      apellidoPaterno: newTrabData.apellidoPaterno!,
      apellidoMaterno: newTrabData.apellidoMaterno!,
      fechaNacimiento: newTrabData.fechaNacimiento!,
      sexo: newTrabData.sexo as any,
      telefono: newTrabData.telefono!,
      email: newTrabData.email || `${newTrabData.nombres?.toLowerCase()}@empresa.com`,
      puestoTrabajo: newTrabData.puestoTrabajo!,
      area: newTrabData.area!,
      grupoOcupacional: newTrabData.grupoOcupacional || 'OPERATIVO',
      fechaIngreso: newTrabData.fechaIngreso!,
      factoresRiesgo: newTrabData.factoresRiesgo || [],
      estado: newTrabData.estado || 'ACTIVO'
    };

    onAddTrabajador(newTrab);
    setShowAddModal(false);
  };

  // Open Edit Worker Modal
  const handleOpenEdit = (t: Trabajador) => {
    setEditingTrabajador(JSON.parse(JSON.stringify(t)));
    setNewRiskDesc('');
  };

  // Save Edit Worker
  const handleSaveEdit = () => {
    if (editingTrabajador && onUpdateTrabajador) {
      onUpdateTrabajador(editingTrabajador);
      setEditingTrabajador(null);
    }
  };

  // Add risk factor to editingTrabajador
  const handleAddRiskFactorToEdit = () => {
    if (!newRiskDesc.trim()) {
      alert('Por favor ingrese una descripción para el factor de riesgo.');
      return;
    }
    if (!editingTrabajador) return;

    const newRisk: FactorRiesgo = {
      tipo: newRiskType,
      descripcion: newRiskDesc.trim(),
      intensidadNivel: newRiskLevel
    };

    setEditingTrabajador({
      ...editingTrabajador,
      factoresRiesgo: [...editingTrabajador.factoresRiesgo, newRisk]
    });

    setNewRiskDesc('');
  };

  // Remove risk factor from editingTrabajador
  const handleRemoveRiskFactorFromEdit = (index: number) => {
    if (!editingTrabajador) return;
    const updated = editingTrabajador.factoresRiesgo.filter((_, idx) => idx !== index);
    setEditingTrabajador({
      ...editingTrabajador,
      factoresRiesgo: updated
    });
  };

  // Helper badge styles for risk factors
  const getRiskBadgeStyle = (nivel: FactorRiesgo['intensidadNivel']) => {
    switch (nivel) {
      case 'CRITICO':
        return 'bg-rose-950/80 text-rose-300 border-rose-800';
      case 'ALTO':
        return 'bg-amber-950/80 text-amber-300 border-amber-800';
      case 'MEDIO':
        return 'bg-yellow-950/80 text-yellow-300 border-yellow-800';
      case 'BAJO':
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  // Helper badge styles for worker status
  const getStatusBadgeStyle = (estado: Trabajador['estado']) => {
    switch (estado) {
      case 'ACTIVO':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
      case 'INACTIVO':
        return 'bg-rose-500/20 text-rose-300 border-rose-500/40';
      case 'LICENCIA':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 p-5 rounded-2xl border border-slate-800 shadow-xl">
        <div>
          <h2 className="text-xl font-bold text-white font-display flex items-center gap-2">
            <Users className="w-6 h-6 text-emerald-400" /> Nómina de Trabajadores & Matriz IPERC
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Gestión completa de trabajadores, edición de estado laboral y matriz de exposición a Factores de Riesgo Ocupacional.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Status Filter */}
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
            {(['TODOS', 'ACTIVO', 'INACTIVO', 'LICENCIA'] as const).map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-2.5 py-1 rounded text-xs font-semibold transition-all ${
                  statusFilter === st
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por DNI, Nombres o Puesto..."
              className="bg-slate-800 border border-slate-700/80 rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold flex items-center gap-2 shadow-lg shadow-emerald-900/40 transition-all shrink-0"
          >
            <Plus className="w-4 h-4" /> Nuevo Trabajador
          </button>
        </div>
      </div>

      {/* Workers Table */}
      <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] font-bold tracking-wider border-b border-slate-800">
              <tr>
                <th className="px-4 py-3">Trabajador / Documento</th>
                <th className="px-4 py-3">Empresa Clienta</th>
                <th className="px-4 py-3">Puesto & Área</th>
                <th className="px-4 py-3">Factores de Riesgo (Matriz IPERC)</th>
                <th className="px-4 py-3">Estado</th>
                <th className="px-4 py-3 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filteredTrabajadores.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-slate-500 italic">
                    No se encontraron trabajadores que coincidan con la búsqueda.
                  </td>
                </tr>
              ) : (
                filteredTrabajadores.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-800/50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="font-bold text-white text-sm">
                        {t.apellidoPaterno} {t.apellidoMaterno}, {t.nombres}
                      </div>
                      <div className="text-[11px] text-slate-400 flex items-center gap-1.5 mt-0.5">
                        <span className="font-mono bg-slate-800 px-1.5 py-0.5 rounded text-slate-300 font-semibold border border-slate-700">
                          {t.tipoDocumento}: {t.numeroDocumento}
                        </span>
                        <span>• Sexo: {t.sexo}</span>
                        <span className="text-emerald-400 font-medium">• F. Nac: {t.fechaNacimiento} ({calculateAge(t.fechaNacimiento)} años)</span>
                      </div>
                    </td>

                    <td className="px-4 py-3">
                      <div className="font-medium text-slate-200">{getEmpresaNombre(t.empresaId)}</div>
                      <div className="text-[10px] text-slate-400">Ingreso: {t.fechaIngreso}</div>
                    </td>

                    <td className="px-4 py-3">
                      <div className="font-semibold text-slate-200 flex items-center gap-1">
                        <Briefcase className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> {t.puestoTrabajo}
                      </div>
                      <div className="text-[10px] text-slate-400">Área: {t.area}</div>
                    </td>

                    <td className="px-4 py-3">
                      <div className="flex flex-col gap-1.5 max-w-xs">
                        <div className="flex flex-wrap items-center gap-1">
                          {t.factoresRiesgo && t.factoresRiesgo.length > 0 ? (
                            t.factoresRiesgo.map((r, idx) => (
                              <button
                                key={idx}
                                onClick={() => setIpercModalTrabajador(JSON.parse(JSON.stringify(t)))}
                                className={`text-[9px] font-bold px-2 py-0.5 rounded border transition-transform hover:scale-105 cursor-pointer ${getRiskBadgeStyle(r.intensidadNivel)}`}
                                title={`Clic para editar IPERC: ${r.tipo} - ${r.descripcion} (${r.intensidadNivel})`}
                              >
                                {r.tipo}: {r.intensidadNivel}
                              </button>
                            ))
                          ) : (
                            <span className="text-[10px] text-slate-500 italic">Sin riesgos asignados</span>
                          )}
                        </div>

                        <button
                          type="button"
                          onClick={() => setIpercModalTrabajador(JSON.parse(JSON.stringify(t)))}
                          className="self-start text-[10px] text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1 hover:underline pt-0.5"
                          title="Editar la Matriz de Factores de Riesgo IPERC para este trabajador"
                        >
                          <ShieldAlert className="w-3 h-3 text-amber-400" />
                          <span>+ Editar Riesgos IPERC</span>
                        </button>
                      </div>
                    </td>

                    <td className="px-4 py-3">
                      <select
                        value={t.estado}
                        onChange={(e) => handleQuickStatusChange(t, e.target.value as any)}
                        className={`px-2 py-1 rounded-lg text-[10px] font-bold border focus:outline-none cursor-pointer ${getStatusBadgeStyle(t.estado)}`}
                        title="Cambiar estado ocupacional del trabajador"
                      >
                        <option value="ACTIVO" className="bg-slate-900 text-emerald-400 font-bold">ACTIVO</option>
                        <option value="INACTIVO" className="bg-slate-900 text-rose-400 font-bold">INACTIVO</option>
                        <option value="LICENCIA" className="bg-slate-900 text-amber-400 font-bold">LICENCIA</option>
                      </select>
                    </td>

                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenEdit(t)}
                          className="px-2.5 py-1 bg-indigo-600/30 hover:bg-indigo-600 text-indigo-300 hover:text-white rounded border border-indigo-500/30 font-semibold text-[11px] inline-flex items-center gap-1 transition-all"
                          title="Editar información, estado y factores de riesgo"
                        >
                          <Edit3 className="w-3.5 h-3.5 text-indigo-400" /> Editar
                        </button>

                        <button
                          onClick={() => onSelectTrabajadorForHCO(t.id)}
                          className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded border border-slate-700 font-medium text-[11px] inline-flex items-center gap-1 transition-colors"
                          title="Abrir Historia Clínica Ocupacional"
                        >
                          <FileText className="w-3.5 h-3.5 text-emerald-400" /> Abrir HCO
                        </button>

                        {onDeleteTrabajador && (
                          <button
                            onClick={() => setDeletingTrabajador(t)}
                            className="p-1.5 bg-rose-500/10 hover:bg-rose-500 text-rose-400 hover:text-white rounded border border-rose-500/20 text-[11px] transition-colors"
                            title="Eliminar este trabajador de la nómina"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* EDIT WORKER MODAL (EDITAR FACTORES DE RIESGO Y ESTADO) */}
      {editingTrabajador && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-hidden">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl text-slate-100 overflow-hidden my-auto">
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-slate-800 shrink-0 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-indigo-500/10 text-indigo-400 rounded-xl border border-indigo-500/20">
                  <Edit3 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">
                    Editar Trabajador & Matriz IPERC
                  </h3>
                  <p className="text-xs text-slate-400">
                    {editingTrabajador.apellidoPaterno} {editingTrabajador.apellidoMaterno}, {editingTrabajador.nombres} ({editingTrabajador.numeroDocumento})
                  </p>
                </div>
              </div>

              <button
                onClick={() => setEditingTrabajador(null)}
                className="p-1.5 bg-slate-800 text-slate-400 hover:text-white rounded-lg border border-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Scrollable Body */}
            <div className="p-4 sm:p-5 flex-1 overflow-y-auto space-y-6 text-xs">
              {/* Section 1: Estado y Datos Laborales */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-4">
                <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-2">
                  <UserCheck className="w-4 h-4" /> 1. Estado Laboral y Puesto de Trabajo
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">
                      Estado Ocupacional:
                    </label>
                    <select
                      value={editingTrabajador.estado}
                      onChange={(e) => setEditingTrabajador({
                        ...editingTrabajador,
                        estado: e.target.value as any
                      })}
                      className="w-full bg-slate-900 border border-indigo-500/50 rounded-lg p-2 text-white font-bold focus:outline-none focus:border-indigo-400"
                    >
                      <option value="ACTIVO">ACTIVO (Laborando)</option>
                      <option value="INACTIVO">INACTIVO (Cese / Baja)</option>
                      <option value="LICENCIA">LICENCIA (Descanso Medico)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-300 font-medium mb-1">Puesto de Trabajo</label>
                    <input
                      type="text"
                      value={editingTrabajador.puestoTrabajo}
                      onChange={(e) => setEditingTrabajador({ ...editingTrabajador, puestoTrabajo: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white focus:outline-none focus:border-indigo-500 font-semibold"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-medium mb-1">Área / Sección</label>
                    <input
                      type="text"
                      value={editingTrabajador.area}
                      onChange={(e) => setEditingTrabajador({ ...editingTrabajador, area: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                  <div>
                    <label className="block text-slate-400 font-medium mb-1">Nombres</label>
                    <input
                      type="text"
                      value={editingTrabajador.nombres}
                      onChange={(e) => setEditingTrabajador({ ...editingTrabajador, nombres: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 font-medium mb-1">Apellido Paterno</label>
                    <input
                      type="text"
                      value={editingTrabajador.apellidoPaterno}
                      onChange={(e) => setEditingTrabajador({ ...editingTrabajador, apellidoPaterno: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 font-medium mb-1">Apellido Materno</label>
                    <input
                      type="text"
                      value={editingTrabajador.apellidoMaterno}
                      onChange={(e) => setEditingTrabajador({ ...editingTrabajador, apellidoMaterno: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-800/80">
                  <div>
                    <label className="block text-slate-300 font-medium mb-1">Fecha de Nacimiento</label>
                    <input
                      type="date"
                      value={editingTrabajador.fechaNacimiento || ''}
                      onChange={(e) => setEditingTrabajador({ ...editingTrabajador, fechaNacimiento: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white focus:outline-none focus:border-indigo-500 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 font-medium mb-1">Edad Calculada</label>
                    <div className="bg-slate-900 border border-indigo-500/30 rounded-lg p-2 text-center text-indigo-300 font-bold font-mono text-xs flex items-center justify-center gap-1 h-[38px]">
                      <span className="text-sm">{calculateAge(editingTrabajador.fechaNacimiento)}</span>
                      <span className="text-[10px] text-indigo-300/80 font-sans">años</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-slate-300 font-medium mb-1">Sexo</label>
                    <select
                      value={editingTrabajador.sexo || 'M'}
                      onChange={(e) => setEditingTrabajador({ ...editingTrabajador, sexo: e.target.value as any })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white focus:outline-none focus:border-indigo-500 font-semibold"
                    >
                      <option value="M">Masculino (M)</option>
                      <option value="F">Femenino (F)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Section 2: Factores de Riesgo (IPERC) */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4" /> 2. Factores de Riesgo Ocupacional (IPERC)
                  </h4>
                  <span className="text-[10px] text-slate-400">
                    {editingTrabajador.factoresRiesgo.length} Riesgos Asignados
                  </span>
                </div>

                {/* List of currently assigned Risk Factors */}
                {editingTrabajador.factoresRiesgo.length > 0 ? (
                  <div className="space-y-2">
                    {editingTrabajador.factoresRiesgo.map((rf, idx) => (
                      <div
                        key={idx}
                        className="p-3 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-between gap-3"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold border shrink-0 ${getRiskBadgeStyle(rf.intensidadNivel)}`}>
                            {rf.tipo} • {rf.intensidadNivel}
                          </span>
                          <span className="text-slate-200 font-medium truncate" title={rf.descripcion}>
                            {rf.descripcion}
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleRemoveRiskFactorFromEdit(idx)}
                          className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded transition-all shrink-0"
                          title="Eliminar este factor de riesgo"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 bg-slate-900 border border-slate-800/80 rounded-xl text-center text-slate-500 italic">
                    No tiene factores de riesgo asignados.
                  </div>
                )}

                {/* Add New Risk Factor Form */}
                <div className="p-3.5 bg-slate-900 border border-slate-800 rounded-xl space-y-3">
                  <div className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                    <PlusCircle className="w-4 h-4 text-emerald-400" />
                    Agregar Nuevo Factor de Riesgo:
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <div>
                      <label className="text-[10px] text-slate-400 mb-1 block">Tipo de Riesgo:</label>
                      <select
                        value={newRiskType}
                        onChange={(e) => setNewRiskType(e.target.value as any)}
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg p-1.5 text-white font-semibold focus:outline-none focus:border-indigo-500"
                      >
                        <option value="FISICO">FÍSICO (Ruido, Temp., Vibración)</option>
                        <option value="QUIMICO">QUÍMICO (Polvo, Vapores, Gases)</option>
                        <option value="BIOLOGICO">BIOLÓGICO (Virus, Bacterias)</option>
                        <option value="ERGONOMICO">ERGONÓMICO (Cargas, Posturas)</option>
                        <option value="PSICOSOCIAL">PSICOSOCIAL (Estrés, Turnos)</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[10px] text-slate-400 mb-1 block">Nivel de Intensidad:</label>
                      <select
                        value={newRiskLevel}
                        onChange={(e) => setNewRiskLevel(e.target.value as any)}
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg p-1.5 text-white font-semibold focus:outline-none focus:border-indigo-500"
                      >
                        <option value="BAJO">BAJO</option>
                        <option value="MEDIO">MEDIO</option>
                        <option value="ALTO">ALTO</option>
                        <option value="CRITICO">CRÍTICO</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[10px] text-slate-400 mb-1 block">Acción rápida:</label>
                      <button
                        type="button"
                        onClick={handleAddRiskFactorToEdit}
                        className="w-full py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold flex items-center justify-center gap-1 shadow-md shadow-emerald-900/30 transition-all"
                      >
                        <Plus className="w-4 h-4" /> Asignar Riesgo
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] text-slate-400 mb-1 block">Descripción del Riesgo Ocupacional:</label>
                    <input
                      type="text"
                      value={newRiskDesc}
                      onChange={(e) => setNewRiskDesc(e.target.value)}
                      placeholder="Ej. Exposición a ruido continuo >85dB(A) en área de molienda"
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  {/* Preset Buttons */}
                  <div>
                    <span className="text-[10px] text-slate-400 mb-1 block">Sugerencias rápidas IPERC:</span>
                    <div className="flex flex-wrap gap-1">
                      {RISK_PRESETS.map((p, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => {
                            setNewRiskType(p.tipo);
                            setNewRiskDesc(p.desc);
                            setNewRiskLevel(p.nivel);
                          }}
                          className="px-2 py-0.5 bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800 rounded text-[10px] transition-all"
                        >
                          + {p.tipo}: {p.desc}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 sm:p-5 border-t border-slate-800 flex justify-end gap-3 shrink-0 bg-slate-900">
              <button
                type="button"
                onClick={() => setEditingTrabajador(null)}
                className="px-4 py-2 bg-slate-800 text-slate-300 hover:bg-slate-700 rounded-lg font-medium transition-all"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleSaveEdit}
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-bold flex items-center gap-2 shadow-lg shadow-indigo-900/40 transition-all"
              >
                <Save className="w-4 h-4" /> Guardar Cambios en Trabajador
              </button>
            </div>
          </div>
        </div>
      )}

      {/* NEW WORKER MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-hidden">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-xl max-h-[90vh] flex flex-col shadow-2xl text-slate-100 overflow-hidden my-auto">
            <div className="p-4 sm:p-5 border-b border-slate-800 shrink-0 flex items-center justify-between">
              <h3 className="text-lg font-bold font-display text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-emerald-400" /> Dar de Alta Trabajador
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800">✕</button>
            </div>

            <form onSubmit={handleAddSubmit} className="flex flex-col flex-1 overflow-hidden min-h-0 text-xs">
              <div className="p-4 sm:p-5 overflow-y-auto space-y-4 flex-1">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Empresa Cliente</label>
                  <select
                    value={newTrabData.empresaId}
                    onChange={(e) => setNewTrabData({ ...newTrabData, empresaId: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white focus:outline-none focus:border-emerald-500 font-semibold"
                  >
                    {empresas.map((emp) => (
                      <option key={emp.id} value={emp.id}>{emp.razonSocial}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Estado Inicial</label>
                  <select
                    value={newTrabData.estado}
                    onChange={(e) => setNewTrabData({ ...newTrabData, estado: e.target.value as any })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white focus:outline-none focus:border-emerald-500 font-semibold"
                  >
                    <option value="ACTIVO">ACTIVO</option>
                    <option value="INACTIVO">INACTIVO</option>
                    <option value="LICENCIA">LICENCIA</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Tipo Doc.</label>
                  <select
                    value={newTrabData.tipoDocumento}
                    onChange={(e) => setNewTrabData({ ...newTrabData, tipoDocumento: e.target.value as any })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="DNI">DNI (8 dts)</option>
                    <option value="CE">CE (9 dts)</option>
                    <option value="PASAPORTE">Pasaporte</option>
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="block text-slate-300 font-medium mb-1">Número de Documento</label>
                  <input
                    type="text"
                    required
                    value={newTrabData.numeroDocumento}
                    onChange={(e) => setNewTrabData({ ...newTrabData, numeroDocumento: e.target.value })}
                    placeholder="45891234"
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white focus:outline-none focus:border-emerald-500 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Nombres</label>
                  <input
                    type="text"
                    required
                    value={newTrabData.nombres}
                    onChange={(e) => setNewTrabData({ ...newTrabData, nombres: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">A. Paterno</label>
                  <input
                    type="text"
                    required
                    value={newTrabData.apellidoPaterno}
                    onChange={(e) => setNewTrabData({ ...newTrabData, apellidoPaterno: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">A. Materno</label>
                  <input
                    type="text"
                    required
                    value={newTrabData.apellidoMaterno}
                    onChange={(e) => setNewTrabData({ ...newTrabData, apellidoMaterno: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Fecha de Nacimiento & Edad Section */}
              <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800 space-y-2">
                <div className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-emerald-400" /> Fecha de Nacimiento & Edad
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <div className="sm:col-span-2">
                    <label className="block text-slate-300 font-medium mb-1">Fecha de Nacimiento:*</label>
                    <input
                      type="date"
                      required
                      value={newTrabData.fechaNacimiento || ''}
                      onChange={(e) => setNewTrabData({ ...newTrabData, fechaNacimiento: e.target.value })}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white focus:outline-none focus:border-emerald-500 font-mono font-semibold"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 font-medium mb-1">Edad Calculada</label>
                    <div className="bg-slate-900 border border-emerald-500/40 rounded-lg p-2 text-center text-emerald-400 font-bold font-mono text-xs flex items-center justify-center gap-1 h-[38px]">
                      <span className="text-sm">{calculateAge(newTrabData.fechaNacimiento)}</span>
                      <span className="text-[10px] text-emerald-300/80 font-sans">años</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Puesto de Trabajo</label>
                  <input
                    type="text"
                    required
                    value={newTrabData.puestoTrabajo}
                    onChange={(e) => setNewTrabData({ ...newTrabData, puestoTrabajo: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Área / Sección</label>
                  <input
                    type="text"
                    required
                    value={newTrabData.area}
                    onChange={(e) => setNewTrabData({ ...newTrabData, area: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
              </div>

              <div className="p-4 sm:p-5 border-t border-slate-800 flex justify-end gap-3 shrink-0 bg-slate-900">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg font-medium"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-semibold shadow-lg shadow-emerald-900/30"
                >
                  Registrar Trabajador
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* QUICK IPERC RISK FACTOR EDITOR MODAL */}
      {ipercModalTrabajador && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-hidden">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl text-slate-100 overflow-hidden my-auto">
            <div className="p-4 sm:p-5 border-b border-slate-800 shrink-0 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-amber-500/10 text-amber-400 rounded-xl border border-amber-500/20">
                  <ShieldAlert className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">
                    Gestión Directa de Factores de Riesgo (IPERC)
                  </h3>
                  <p className="text-xs text-slate-400">
                    Trabajador: <strong className="text-slate-200">{ipercModalTrabajador.apellidoPaterno} {ipercModalTrabajador.apellidoMaterno}, {ipercModalTrabajador.nombres}</strong> ({ipercModalTrabajador.puestoTrabajo})
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIpercModalTrabajador(null)}
                className="p-1.5 bg-slate-800 text-slate-400 hover:text-white rounded-lg border border-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 sm:p-5 flex-1 overflow-y-auto space-y-5 text-xs">
              {/* Assigned Risks List */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-amber-400 text-xs uppercase tracking-wider">
                    Factores de Riesgo Asignados ({ipercModalTrabajador.factoresRiesgo.length})
                  </h4>
                  <span className="text-[10px] text-slate-500">
                    Edición directa e in situ
                  </span>
                </div>

                {ipercModalTrabajador.factoresRiesgo.length > 0 ? (
                  <div className="space-y-2">
                    {ipercModalTrabajador.factoresRiesgo.map((rf, idx) => (
                      <div
                        key={idx}
                        className="p-3 bg-slate-950 border border-slate-800 rounded-xl grid grid-cols-1 sm:grid-cols-12 gap-2 items-center"
                      >
                        <div className="sm:col-span-3">
                          <select
                            value={rf.tipo}
                            onChange={(e) => {
                              const updated = [...ipercModalTrabajador.factoresRiesgo];
                              updated[idx].tipo = e.target.value as any;
                              setIpercModalTrabajador({ ...ipercModalTrabajador, factoresRiesgo: updated });
                            }}
                            className="w-full bg-slate-900 border border-slate-700 rounded-lg p-1.5 text-white font-bold text-[11px] focus:outline-none focus:border-amber-500"
                          >
                            <option value="FISICO">FÍSICO</option>
                            <option value="QUIMICO">QUÍMICO</option>
                            <option value="BIOLOGICO">BIOLÓGICO</option>
                            <option value="ERGONOMICO">ERGONÓMICO</option>
                            <option value="PSICOSOCIAL">PSICOSOCIAL</option>
                          </select>
                        </div>

                        <div className="sm:col-span-5">
                          <input
                            type="text"
                            value={rf.descripcion}
                            onChange={(e) => {
                              const updated = [...ipercModalTrabajador.factoresRiesgo];
                              updated[idx].descripcion = e.target.value;
                              setIpercModalTrabajador({ ...ipercModalTrabajador, factoresRiesgo: updated });
                            }}
                            placeholder="Descripción del riesgo..."
                            className="w-full bg-slate-900 border border-slate-700 rounded-lg p-1.5 text-slate-200 text-[11px] focus:outline-none focus:border-amber-500"
                          />
                        </div>

                        <div className="sm:col-span-3">
                          <select
                            value={rf.intensidadNivel}
                            onChange={(e) => {
                              const updated = [...ipercModalTrabajador.factoresRiesgo];
                              updated[idx].intensidadNivel = e.target.value as any;
                              setIpercModalTrabajador({ ...ipercModalTrabajador, factoresRiesgo: updated });
                            }}
                            className={`w-full bg-slate-900 border rounded-lg p-1.5 font-bold text-[11px] focus:outline-none ${getRiskBadgeStyle(rf.intensidadNivel)}`}
                          >
                            <option value="BAJO" className="bg-slate-900 text-slate-300">BAJO</option>
                            <option value="MEDIO" className="bg-slate-900 text-yellow-300">MEDIO</option>
                            <option value="ALTO" className="bg-slate-900 text-amber-300">ALTO</option>
                            <option value="CRITICO" className="bg-slate-900 text-rose-300">CRÍTICO</option>
                          </select>
                        </div>

                        <div className="sm:col-span-1 flex justify-end">
                          <button
                            type="button"
                            onClick={() => {
                              const updated = ipercModalTrabajador.factoresRiesgo.filter((_, i) => i !== idx);
                              setIpercModalTrabajador({ ...ipercModalTrabajador, factoresRiesgo: updated });
                            }}
                            className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded transition-all"
                            title="Eliminar este factor de riesgo"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl text-center text-slate-500 italic">
                    Sin factores de riesgo registrados. Utiliza el formulario abajo para agregar uno.
                  </div>
                )}
              </div>

              {/* Add New Risk Form inside Quick Modal */}
              <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-3">
                <h4 className="font-bold text-white text-xs flex items-center gap-1.5">
                  <PlusCircle className="w-4 h-4 text-emerald-400" />
                  Agregar Nuevo Factor de Riesgo IPERC
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1">Tipo de Riesgo:</label>
                    <select
                      value={newRiskType}
                      onChange={(e) => setNewRiskType(e.target.value as any)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg p-1.5 text-white font-semibold focus:outline-none focus:border-amber-500"
                    >
                      <option value="FISICO">FÍSICO (Ruido, Temp, Vibración)</option>
                      <option value="QUIMICO">QUÍMICO (Polvo, Vapores, Gases)</option>
                      <option value="BIOLOGICO">BIOLÓGICO (Virus, Bacterias)</option>
                      <option value="ERGONOMICO">ERGONÓMICO (Cargas, Posturas)</option>
                      <option value="PSICOSOCIAL">PSICOSOCIAL (Estrés, Turnos)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1">Intensidad / Nivel:</label>
                    <select
                      value={newRiskLevel}
                      onChange={(e) => setNewRiskLevel(e.target.value as any)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg p-1.5 text-white font-semibold focus:outline-none focus:border-amber-500"
                    >
                      <option value="BAJO">BAJO</option>
                      <option value="MEDIO">MEDIO</option>
                      <option value="ALTO">ALTO</option>
                      <option value="CRITICO">CRÍTICO</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1">Acción:</label>
                    <button
                      type="button"
                      onClick={() => {
                        if (!newRiskDesc.trim()) {
                          alert('Ingresa una descripción para el riesgo.');
                          return;
                        }
                        setIpercModalTrabajador({
                          ...ipercModalTrabajador,
                          factoresRiesgo: [
                            ...ipercModalTrabajador.factoresRiesgo,
                            { tipo: newRiskType, descripcion: newRiskDesc.trim(), intensidadNivel: newRiskLevel }
                          ]
                        });
                        setNewRiskDesc('');
                      }}
                      className="w-full py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold flex items-center justify-center gap-1 shadow-md shadow-emerald-900/30 transition-all"
                    >
                      <Plus className="w-4 h-4" /> Agregar Riesgo
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">Descripción Detallada:</label>
                  <input
                    type="text"
                    value={newRiskDesc}
                    onChange={(e) => setNewRiskDesc(e.target.value)}
                    placeholder="Ej. Posturas forzadas en estación de ensamble"
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                {/* Quick Presets */}
                <div>
                  <span className="text-[10px] text-slate-400 mb-1 block">Plantillas IPERC frecuentes:</span>
                  <div className="flex flex-wrap gap-1">
                    {RISK_PRESETS.map((p, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          setIpercModalTrabajador({
                            ...ipercModalTrabajador,
                            factoresRiesgo: [
                              ...ipercModalTrabajador.factoresRiesgo,
                              { tipo: p.tipo, descripcion: p.desc, intensidadNivel: p.nivel }
                            ]
                          });
                        }}
                        className="px-2 py-0.5 bg-slate-900 hover:bg-amber-950/40 text-amber-300 border border-slate-800 hover:border-amber-700/50 rounded text-[10px] transition-all"
                      >
                        + {p.tipo}: {p.desc} ({p.nivel})
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 sm:p-5 border-t border-slate-800 flex justify-end gap-3 shrink-0 bg-slate-900">
              <button
                type="button"
                onClick={() => setIpercModalTrabajador(null)}
                className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg font-medium hover:bg-slate-700 transition-all"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleSaveIpercModal}
                className="px-5 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-lg font-bold flex items-center gap-2 shadow-lg shadow-amber-900/40 transition-all"
              >
                <Save className="w-4 h-4" /> Guardar Factores IPERC
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL CONFIRM DELETE WORKER */}
      {deletingTrabajador && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl text-slate-100">
            <div className="flex items-start justify-between pb-3 border-b border-slate-800 mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-rose-500/10 text-rose-400 border border-rose-500/30 rounded-xl">
                  <Trash2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Eliminar Trabajador</h3>
                  <p className="text-[11px] text-slate-400">Esta acción removerá al trabajador y sus registros EMO.</p>
                </div>
              </div>
              <button
                onClick={() => setDeletingTrabajador(null)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                <div className="font-bold text-white text-sm">
                  {deletingTrabajador.apellidoPaterno} {deletingTrabajador.apellidoMaterno}, {deletingTrabajador.nombres}
                </div>
                <div className="text-slate-400 text-[11px]">
                  Documento: <span className="font-mono text-slate-200">{deletingTrabajador.tipoDocumento}: {deletingTrabajador.numeroDocumento}</span>
                </div>
                <div className="text-slate-400 text-[11px]">
                  Puesto: <span className="text-slate-200">{deletingTrabajador.puestoTrabajo}</span> | Área: <span className="text-slate-200">{deletingTrabajador.area}</span>
                </div>
              </div>

              <p className="text-slate-300 leading-relaxed">
                ¿Está seguro de que desea eliminar a este trabajador de la nómina del sistema?
              </p>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setDeletingTrabajador(null)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (onDeleteTrabajador && deletingTrabajador) {
                      onDeleteTrabajador(deletingTrabajador.id);
                    }
                    setDeletingTrabajador(null);
                  }}
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-semibold flex items-center gap-2 shadow-lg shadow-rose-950 transition-all"
                >
                  <Trash2 className="w-4 h-4" /> Confirmar Eliminación
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
