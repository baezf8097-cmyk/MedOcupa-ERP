import React, { useState } from 'react';
import { Empresa, Sede } from '../../types/erp';
import { 
  Building2, Plus, Shield, MapPin, Phone, Mail, CheckCircle2, AlertTriangle, 
  Users, Trash2, Edit3, Power, Layers, Search, Filter, AlertCircle, X, Check, Save
} from 'lucide-react';

interface EmpresasModuleProps {
  empresas: Empresa[];
  onAddEmpresa: (empresa: Empresa) => void;
  onUpdateEmpresa?: (empresa: Empresa) => void;
  onDeleteEmpresa?: (empresaId: string) => void;
}

export const EmpresasModule: React.FC<EmpresasModuleProps> = ({ 
  empresas, 
  onAddEmpresa,
  onUpdateEmpresa,
  onDeleteEmpresa
}) => {
  // Search and Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [filterEstado, setFilterEstado] = useState<'TODOS' | 'ACTIVA' | 'INACTIVA'>('TODOS');

  // Modal State for New/Edit Empresa
  const [showEmpresaModal, setShowEmpresaModal] = useState(false);
  const [editingEmpresaId, setEditingEmpresaId] = useState<string | null>(null);

  // Form data for Empresa
  const [empFormData, setEmpFormData] = useState<Partial<Empresa>>({
    ruc: '',
    razonSocial: '',
    nombreComercial: '',
    ciiu: '0710',
    actividadEconomica: '',
    direccion: '',
    departamento: 'Lima',
    provincia: 'Lima',
    distrito: 'San Isidro',
    nivelRiesgoSCTR: 'ALTO',
    totalTrabajadores: 100,
    contactoNombre: '',
    contactoEmail: '',
    contactoTelefono: '',
    estado: 'ACTIVA'
  });

  // Sedes Management Modal State
  const [managingSedesEmpresa, setManagingSedesEmpresa] = useState<Empresa | null>(null);
  const [showAddSedeForm, setShowAddSedeForm] = useState(false);
  const [editingSedeId, setEditingSedeId] = useState<string | null>(null);
  const [sedeFormData, setSedeFormData] = useState<{
    nombre: string;
    direccion: string;
    trabajadoresCount: number;
    estado: 'ACTIVA' | 'INACTIVA';
  }>({
    nombre: '',
    direccion: '',
    trabajadoresCount: 50,
    estado: 'ACTIVA'
  });

  // Delete Confirmation Modal State
  const [empresaToDelete, setEmpresaToDelete] = useState<Empresa | null>(null);

  // Open Create Empresa Modal
  const handleOpenCreateModal = () => {
    setEditingEmpresaId(null);
    setEmpFormData({
      ruc: '',
      razonSocial: '',
      nombreComercial: '',
      ciiu: '0710',
      actividadEconomica: '',
      direccion: '',
      departamento: 'Lima',
      provincia: 'Lima',
      distrito: 'San Isidro',
      nivelRiesgoSCTR: 'ALTO',
      totalTrabajadores: 100,
      contactoNombre: '',
      contactoEmail: '',
      contactoTelefono: '',
      estado: 'ACTIVA'
    });
    setShowEmpresaModal(true);
  };

  // Open Edit Empresa Modal
  const handleOpenEditModal = (emp: Empresa) => {
    setEditingEmpresaId(emp.id);
    setEmpFormData({ ...emp });
    setShowEmpresaModal(true);
  };

  // Handle Save (Create or Update) Empresa
  const handleEmpresaSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!empFormData.ruc || empFormData.ruc.length !== 11) {
      alert('Error: El RUC debe poseer exactamente 11 dígitos numéricos.');
      return;
    }

    if (editingEmpresaId && onUpdateEmpresa) {
      // Update existing company
      const currentEmp = empresas.find(e => e.id === editingEmpresaId);
      const updatedEmp: Empresa = {
        ...currentEmp!,
        ruc: empFormData.ruc!,
        razonSocial: empFormData.razonSocial!,
        nombreComercial: empFormData.nombreComercial || empFormData.razonSocial!,
        ciiu: empFormData.ciiu!,
        actividadEconomica: empFormData.actividadEconomica!,
        direccion: empFormData.direccion!,
        departamento: empFormData.departamento!,
        provincia: empFormData.provincia!,
        distrito: empFormData.distrito!,
        nivelRiesgoSCTR: empFormData.nivelRiesgoSCTR as any,
        totalTrabajadores: Number(empFormData.totalTrabajadores),
        contactoNombre: empFormData.contactoNombre!,
        contactoEmail: empFormData.contactoEmail!,
        contactoTelefono: empFormData.contactoTelefono!,
        estado: empFormData.estado as any || 'ACTIVA'
      };
      onUpdateEmpresa(updatedEmp);
    } else {
      // Create new company
      const newEmp: Empresa = {
        id: `emp-${Date.now()}`,
        ruc: empFormData.ruc!,
        razonSocial: empFormData.razonSocial!,
        nombreComercial: empFormData.nombreComercial || empFormData.razonSocial!,
        ciiu: empFormData.ciiu!,
        actividadEconomica: empFormData.actividadEconomica!,
        direccion: empFormData.direccion!,
        departamento: empFormData.departamento!,
        provincia: empFormData.provincia!,
        distrito: empFormData.distrito!,
        nivelRiesgoSCTR: empFormData.nivelRiesgoSCTR as any,
        totalTrabajadores: Number(empFormData.totalTrabajadores),
        contactoNombre: empFormData.contactoNombre!,
        contactoEmail: empFormData.contactoEmail!,
        contactoTelefono: empFormData.contactoTelefono!,
        estado: empFormData.estado as any || 'ACTIVA',
        sedes: [
          { 
            id: `sed-${Date.now()}`, 
            nombre: 'Sede Principal', 
            direccion: empFormData.direccion!, 
            trabajadoresCount: Number(empFormData.totalTrabajadores),
            estado: 'ACTIVA'
          }
        ]
      };
      onAddEmpresa(newEmp);
    }

    setShowEmpresaModal(false);
  };

  // Toggle Empresa State (ACTIVA / INACTIVA)
  const handleToggleEmpresaEstado = (emp: Empresa) => {
    if (!onUpdateEmpresa) return;
    const newEstado = emp.estado === 'ACTIVA' ? 'INACTIVA' : 'ACTIVA';
    const updated = { ...emp, estado: newEstado as any };
    onUpdateEmpresa(updated);
  };

  // Confirm Delete Empresa
  const handleConfirmDeleteEmpresa = () => {
    if (empresaToDelete && onDeleteEmpresa) {
      onDeleteEmpresa(empresaToDelete.id);
      setEmpresaToDelete(null);
    }
  };

  // Sede Management Handlers
  const handleToggleSedeEstado = (sedeId: string) => {
    if (!managingSedesEmpresa || !onUpdateEmpresa) return;
    const updatedSedes = managingSedesEmpresa.sedes.map(s => {
      if (s.id === sedeId) {
        const currentEstado = s.estado || 'ACTIVA';
        return { ...s, estado: (currentEstado === 'ACTIVA' ? 'INACTIVA' : 'ACTIVA') as any };
      }
      return s;
    });

    const updatedEmpresa = { ...managingSedesEmpresa, sedes: updatedSedes };
    onUpdateEmpresa(updatedEmpresa);
    setManagingSedesEmpresa(updatedEmpresa);
  };

  const handleAddSedeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!managingSedesEmpresa || !onUpdateEmpresa) return;
    if (!sedeFormData.nombre || !sedeFormData.direccion) {
      alert('Por favor complete el nombre y dirección de la sede.');
      return;
    }

    if (editingSedeId) {
      // Edit existing sede
      const updatedSedes = managingSedesEmpresa.sedes.map(s => {
        if (s.id === editingSedeId) {
          return {
            ...s,
            nombre: sedeFormData.nombre,
            direccion: sedeFormData.direccion,
            trabajadoresCount: Number(sedeFormData.trabajadoresCount),
            estado: sedeFormData.estado
          };
        }
        return s;
      });
      const updatedEmpresa = { ...managingSedesEmpresa, sedes: updatedSedes };
      onUpdateEmpresa(updatedEmpresa);
      setManagingSedesEmpresa(updatedEmpresa);
    } else {
      // Create new sede
      const newSede: Sede = {
        id: `sed-${Date.now()}`,
        nombre: sedeFormData.nombre,
        direccion: sedeFormData.direccion,
        trabajadoresCount: Number(sedeFormData.trabajadoresCount),
        estado: sedeFormData.estado
      };
      const updatedEmpresa = {
        ...managingSedesEmpresa,
        sedes: [...managingSedesEmpresa.sedes, newSede]
      };
      onUpdateEmpresa(updatedEmpresa);
      setManagingSedesEmpresa(updatedEmpresa);
    }

    setEditingSedeId(null);
    setShowAddSedeForm(false);
    setSedeFormData({ nombre: '', direccion: '', trabajadoresCount: 50, estado: 'ACTIVA' });
  };

  const handleEditSede = (sede: Sede) => {
    setEditingSedeId(sede.id);
    setSedeFormData({
      nombre: sede.nombre,
      direccion: sede.direccion,
      trabajadoresCount: sede.trabajadoresCount,
      estado: sede.estado || 'ACTIVA'
    });
    setShowAddSedeForm(true);
  };

  const handleDeleteSede = (sedeId: string) => {
    if (!managingSedesEmpresa || !onUpdateEmpresa) return;
    if (managingSedesEmpresa.sedes.length <= 1) {
      alert('La empresa debe mantener al menos una sede registrada.');
      return;
    }

    if (confirm('¿Está seguro de eliminar esta sede operativa?')) {
      const updatedSedes = managingSedesEmpresa.sedes.filter(s => s.id !== sedeId);
      const updatedEmpresa = { ...managingSedesEmpresa, sedes: updatedSedes };
      onUpdateEmpresa(updatedEmpresa);
      setManagingSedesEmpresa(updatedEmpresa);
    }
  };

  // Filtered empresas list
  const filteredEmpresas = empresas.filter(emp => {
    const searchMatch = emp.razonSocial.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        emp.ruc.includes(searchTerm) ||
                        emp.ciiu.includes(searchTerm) ||
                        emp.actividadEconomica.toLowerCase().includes(searchTerm.toLowerCase());
    const estadoMatch = filterEstado === 'TODOS' || emp.estado === filterEstado;
    return searchMatch && estadoMatch;
  });

  return (
    <div className="space-y-6">
      {/* Header & Main Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 p-5 rounded-2xl border border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold uppercase rounded tracking-wider">
              Módulo de Empresas Clientes y Sedes Operativas
            </span>
          </div>
          <h2 className="text-xl font-bold text-white font-display flex items-center gap-2">
            <Building2 className="w-6 h-6 text-emerald-400" /> Gestión de Empresas y Sedes
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Administración de empresas clientes, clasificación de riesgo SCTR, alta/baja de razones sociales y control de sedes activas/inactivas.
          </p>
        </div>

        <button
          onClick={handleOpenCreateModal}
          className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg shadow-emerald-950/80 border border-emerald-400/30 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" /> Registrar Empresa
        </button>
      </div>

      {/* Filters & Search Bar */}
      <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 flex flex-col md:flex-row gap-3 justify-between items-center">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por Razón Social, RUC o CIIU..."
            className="w-full bg-slate-800 border border-slate-700/80 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500"
          />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-end">
          <div className="flex items-center gap-1.5 text-xs text-slate-300">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span className="font-semibold text-[11px]">Estado Empresa:</span>
            <select
              value={filterEstado}
              onChange={(e) => setFilterEstado(e.target.value as any)}
              className="bg-slate-800 border border-slate-700/80 rounded-lg px-2.5 py-1 text-xs text-white focus:outline-none focus:border-emerald-500"
            >
              <option value="TODOS">Todas ({empresas.length})</option>
              <option value="ACTIVA">Activas ({empresas.filter(e => e.estado === 'ACTIVA').length})</option>
              <option value="INACTIVA">Inactivas ({empresas.filter(e => e.estado === 'INACTIVA').length})</option>
            </select>
          </div>
        </div>
      </div>

      {/* Grid of Companies */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEmpresas.length === 0 ? (
          <div className="col-span-full bg-slate-900 p-8 rounded-2xl border border-slate-800 text-center text-slate-500">
            <Building2 className="w-10 h-10 mx-auto text-slate-600 mb-2" />
            <p className="text-sm font-medium">No se encontraron empresas con el criterio especificado.</p>
          </div>
        ) : (
          filteredEmpresas.map((emp) => {
            const activeSedesCount = emp.sedes.filter(s => s.estado !== 'INACTIVA').length;
            const inactiveSedesCount = emp.sedes.filter(s => s.estado === 'INACTIVA').length;

            return (
              <div 
                key={emp.id} 
                className={`bg-slate-900 rounded-2xl border ${
                  emp.estado === 'INACTIVA' ? 'border-rose-900/50 bg-slate-950/40 opacity-80' : 'border-slate-800'
                } p-5 shadow-lg flex flex-col justify-between hover:border-slate-700 transition-all relative group`}
              >
                <div>
                  {/* Top Badges & Actions */}
                  <div className="flex items-center justify-between mb-3 gap-2">
                    <span className="text-[11px] font-mono px-2.5 py-1 bg-slate-800 text-slate-300 rounded-md border border-slate-700 font-semibold">
                      RUC: {emp.ruc}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase ${
                        emp.nivelRiesgoSCTR === 'ALTO'
                          ? 'bg-rose-950/80 text-rose-300 border-rose-800'
                          : emp.nivelRiesgoSCTR === 'MEDIO'
                          ? 'bg-amber-950/80 text-amber-300 border-amber-800'
                          : 'bg-emerald-950/80 text-emerald-300 border-emerald-800'
                      }`}>
                        SCTR: {emp.nivelRiesgoSCTR}
                      </span>

                      {/* Company Status Toggle */}
                      <button
                        onClick={() => handleToggleEmpresaEstado(emp)}
                        className={`text-[10px] font-bold px-2 py-0.5 rounded border flex items-center gap-1 transition-all ${
                          emp.estado === 'ACTIVA'
                            ? 'bg-emerald-950 text-emerald-300 border-emerald-700 hover:bg-rose-950 hover:text-rose-300 hover:border-rose-700'
                            : 'bg-rose-950 text-rose-300 border-rose-700 hover:bg-emerald-950 hover:text-emerald-300 hover:border-emerald-700'
                        }`}
                        title={emp.estado === 'ACTIVA' ? 'Desactivar Empresa' : 'Activar Empresa'}
                      >
                        <Power className="w-3 h-3" />
                        {emp.estado}
                      </button>
                    </div>
                  </div>

                  {/* Company Title */}
                  <h3 className="text-base font-bold text-white mb-1 flex items-center justify-between">
                    <span className="truncate">{emp.razonSocial}</span>
                  </h3>
                  <p className="text-xs text-slate-400 mb-3 flex items-center gap-1">
                    <Building2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> CIIU {emp.ciiu} • {emp.actividadEconomica}
                  </p>

                  {/* Details Card */}
                  <div className="space-y-2 text-xs text-slate-300 bg-slate-800/60 p-3 rounded-xl border border-slate-800/80 mb-4">
                    <div className="flex items-center gap-2 text-slate-300">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{emp.direccion}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1 text-slate-400">
                        <Users className="w-3.5 h-3.5 text-slate-400" /> Total Trabajadores:
                      </span>
                      <span className="font-bold text-white">{emp.totalTrabajadores}</span>
                    </div>

                    {/* Sedes Count & Status Breakdown */}
                    <div className="pt-2 border-t border-slate-700/60 flex items-center justify-between">
                      <span className="flex items-center gap-1 text-slate-300 font-semibold">
                        <Layers className="w-3.5 h-3.5 text-emerald-400" /> Sedes Operativas:
                      </span>
                      <div className="flex items-center gap-1.5 text-[10px] font-bold">
                        <span className="px-2 py-0.5 bg-emerald-950 text-emerald-300 border border-emerald-800 rounded">
                          {activeSedesCount} Activa{activeSedesCount !== 1 ? 's' : ''}
                        </span>
                        {inactiveSedesCount > 0 && (
                          <span className="px-2 py-0.5 bg-slate-800 text-slate-400 border border-slate-700 rounded">
                            {inactiveSedesCount} Inactiva{inactiveSedesCount !== 1 ? 's' : ''}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer Controls & Actions */}
                <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
                  <div className="text-[11px] text-slate-400 truncate">
                    <div className="font-medium text-slate-200 truncate">{emp.contactoNombre}</div>
                    <div className="text-[10px] text-slate-400 truncate">{emp.contactoEmail}</div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    {/* Manage Sedes Button */}
                    <button
                      onClick={() => setManagingSedesEmpresa(emp)}
                      className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-slate-700 rounded-lg text-[11px] font-bold flex items-center gap-1 transition-all"
                      title="Gestionar Sedes y su Estado (Activas / Inactivas)"
                    >
                      <Layers className="w-3.5 h-3.5" /> Sedes
                    </button>

                    {/* Edit Empresa Button */}
                    <button
                      onClick={() => handleOpenEditModal(emp)}
                      className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs"
                      title="Editar Empresa"
                    >
                      <Edit3 className="w-3.5 h-3.5 text-sky-400" />
                    </button>

                    {/* Delete Empresa Button */}
                    {onDeleteEmpresa && (
                      <button
                        onClick={() => setEmpresaToDelete(emp)}
                        className="p-1.5 bg-rose-950/60 hover:bg-rose-900 text-rose-300 border border-rose-800/80 rounded-lg text-xs transition-all"
                        title="Eliminar Empresa"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* MODAL 1: CREATE / EDIT EMPRESA */}
      {showModalEmpresaOrEdit(showEmpresaModal, setShowEmpresaModal, editingEmpresaId, empFormData, setEmpFormData, handleEmpresaSubmit)}

      {/* MODAL 2: GESTIONAR SEDES DE EMPRESA */}
      {managingSedesEmpresa && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl p-6 shadow-2xl text-slate-100 my-8 space-y-5">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div>
                <h3 className="text-lg font-bold font-display text-white flex items-center gap-2">
                  <Layers className="w-5 h-5 text-emerald-400" /> Sedes Operativas de {managingSedesEmpresa.razonSocial}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  RUC: {managingSedesEmpresa.ruc} • Configura sedes activas, inactivas y nuevos centros de trabajo.
                </p>
              </div>
              <button 
                onClick={() => {
                  setManagingSedesEmpresa(null);
                  setShowAddSedeForm(false);
                }} 
                className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Sede List */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Sedes Registradas ({managingSedesEmpresa.sedes.length})
                </span>
                {!showAddSedeForm && (
                  <button
                    onClick={() => {
                      setEditingSedeId(null);
                      setSedeFormData({ nombre: '', direccion: '', trabajadoresCount: 50, estado: 'ACTIVA' });
                      setShowAddSedeForm(true);
                    }}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all shadow-md"
                  >
                    <Plus className="w-3.5 h-3.5" /> Agregar Nueva Sede
                  </button>
                )}
              </div>

              {/* Form to Add or Edit Sede */}
              {showAddSedeForm && (
                <form onSubmit={handleAddSedeSubmit} className="bg-slate-800/80 p-4 rounded-xl border border-emerald-500/40 space-y-3 text-xs">
                  <div className="flex items-center justify-between border-b border-slate-700 pb-2">
                    <span className="font-bold text-emerald-400 flex items-center gap-1.5">
                      {editingSedeId ? <Edit3 className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                      {editingSedeId ? 'Editar Sede Operativa' : 'Nueva Sede Operativa'}
                    </span>
                    <button
                      type="button"
                      onClick={() => setShowAddSedeForm(false)}
                      className="text-slate-400 hover:text-white"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-300 font-medium mb-1">Nombre de la Sede</label>
                      <input
                        type="text"
                        required
                        value={sedeFormData.nombre}
                        onChange={(e) => setSedeFormData({ ...sedeFormData, nombre: e.target.value })}
                        placeholder="Ej: Planta Sur Pasco / Sede Central"
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white focus:outline-none focus:border-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-300 font-medium mb-1">Trabajadores Estimados</label>
                      <input
                        type="number"
                        min={1}
                        required
                        value={sedeFormData.trabajadoresCount}
                        onChange={(e) => setSedeFormData({ ...sedeFormData, trabajadoresCount: Number(e.target.value) })}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-300 font-medium mb-1">Dirección de la Sede</label>
                    <input
                      type="text"
                      required
                      value={sedeFormData.direccion}
                      onChange={(e) => setSedeFormData({ ...sedeFormData, direccion: e.target.value })}
                      placeholder="Ej: Av. Industrial 450, Mza B Lote 3"
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-medium mb-1">Estado de la Sede</label>
                    <select
                      value={sedeFormData.estado}
                      onChange={(e) => setSedeFormData({ ...sedeFormData, estado: e.target.value as any })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white focus:outline-none focus:border-emerald-500"
                    >
                      <option value="ACTIVA">ACTIVA (Sede en operación)</option>
                      <option value="INACTIVA">INACTIVA (Sede cerrada / Suspendida)</option>
                    </select>
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowAddSedeForm(false)}
                      className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-lg"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg flex items-center gap-1"
                    >
                      <Save className="w-3.5 h-3.5" /> Guardar Sede
                    </button>
                  </div>
                </form>
              )}

              {/* Existing Sedes Cards */}
              <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
                {managingSedesEmpresa.sedes.map((sede) => {
                  const isActiva = (sede.estado || 'ACTIVA') === 'ACTIVA';

                  return (
                    <div 
                      key={sede.id} 
                      className={`p-3.5 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-all ${
                        isActiva 
                          ? 'bg-slate-800/80 border-slate-700/80' 
                          : 'bg-slate-950/60 border-rose-900/40 opacity-75'
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white text-xs">{sede.nombre}</span>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${
                            isActiva 
                              ? 'bg-emerald-950/90 text-emerald-300 border-emerald-700' 
                              : 'bg-slate-800 text-slate-400 border-slate-700'
                          }`}>
                            {isActiva ? 'SEDE ACTIVA' : 'SEDE INACTIVA'}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-300 flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                          <span>{sede.direccion}</span>
                        </div>
                        <div className="text-[10px] text-slate-400">
                          Trabajadores asignados: <strong className="text-slate-200">{sede.trabajadoresCount}</strong>
                        </div>
                      </div>

                      {/* Sede Actions */}
                      <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                        {/* Toggle Active / Inactive */}
                        <button
                          type="button"
                          onClick={() => handleToggleSedeEstado(sede.id)}
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border flex items-center gap-1 transition-all ${
                            isActiva
                              ? 'bg-slate-800 text-amber-300 border-amber-700/60 hover:bg-amber-950'
                              : 'bg-emerald-950 text-emerald-300 border-emerald-700 hover:bg-emerald-900'
                          }`}
                          title={isActiva ? 'Marcar Sede como Inactiva' : 'Marcar Sede como Activa'}
                        >
                          <Power className="w-3 h-3" />
                          {isActiva ? 'Desactivar' : 'Activar'}
                        </button>

                        {/* Edit Sede */}
                        <button
                          type="button"
                          onClick={() => handleEditSede(sede)}
                          className="p-1.5 bg-slate-800 hover:bg-slate-700 text-sky-400 border border-slate-700 rounded-lg"
                          title="Editar Sede"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>

                        {/* Delete Sede */}
                        <button
                          type="button"
                          onClick={() => handleDeleteSede(sede.id)}
                          className="p-1.5 bg-rose-950/60 hover:bg-rose-900 text-rose-300 border border-rose-800/80 rounded-lg"
                          title="Eliminar Sede"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="pt-3 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => {
                  setManagingSedesEmpresa(null);
                  setShowAddSedeForm(false);
                }}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold"
              >
                Cerrar Ventana
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: DELETE CONFIRMATION EMPRESA */}
      {empresaToDelete && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-rose-900/80 rounded-2xl w-full max-w-md p-6 shadow-2xl text-slate-100 space-y-4">
            <div className="flex items-center gap-3 text-rose-400">
              <div className="w-10 h-10 rounded-full bg-rose-950/80 border border-rose-800 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5 text-rose-400" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">¿Eliminar Empresa Cliente?</h3>
                <p className="text-xs text-rose-300 font-mono mt-0.5">RUC: {empresaToDelete.ruc}</p>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Está a punto de eliminar la empresa <strong className="text-white">{empresaToDelete.razonSocial}</strong> y sus {empresaToDelete.sedes.length} sedes registradas del sistema.
            </p>

            <div className="bg-rose-950/40 p-3 rounded-xl border border-rose-800/50 text-[11px] text-rose-200">
              <strong>Nota:</strong> Esta acción removerá el registro de la razón social.
            </div>

            <div className="pt-2 flex justify-end gap-3">
              <button
                onClick={() => setEmpresaToDelete(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmDeleteEmpresa}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-rose-950"
              >
                <Trash2 className="w-4 h-4" /> Sí, Eliminar Empresa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Helper for render Empresa Form Modal
function showModalEmpresaOrEdit(
  showModal: boolean,
  setShowModal: (val: boolean) => void,
  editingId: string | null,
  formData: Partial<Empresa>,
  setFormData: React.Dispatch<React.SetStateAction<Partial<Empresa>>>,
  handleSubmit: (e: React.FormEvent) => void
) {
  if (!showModal) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-xl p-6 shadow-2xl text-slate-100 my-8">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
          <h3 className="text-lg font-bold font-display text-white flex items-center gap-2">
            <Building2 className="w-5 h-5 text-emerald-400" /> 
            {editingId ? 'Editar Empresa Cliente' : 'Registrar Nueva Empresa Cliente'}
          </h3>
          <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white text-sm">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-medium mb-1">RUC (11 dígitos)</label>
              <input
                type="text"
                maxLength={11}
                required
                value={formData.ruc || ''}
                onChange={(e) => setFormData({ ...formData, ruc: e.target.value })}
                placeholder="20123456789"
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white focus:outline-none focus:border-emerald-500 font-mono"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-medium mb-1">CIIU Principal</label>
              <input
                type="text"
                required
                value={formData.ciiu || ''}
                onChange={(e) => setFormData({ ...formData, ciiu: e.target.value })}
                placeholder="0710"
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white focus:outline-none focus:border-emerald-500 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">Razón Social</label>
            <input
              type="text"
              required
              value={formData.razonSocial || ''}
              onChange={(e) => setFormData({ ...formData, razonSocial: e.target.value })}
              placeholder="MINERA DEL SUR S.A.C."
              className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white focus:outline-none focus:border-emerald-500 font-bold"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-medium mb-1">Nivel Riesgo SCTR</label>
              <select
                value={formData.nivelRiesgoSCTR || 'ALTO'}
                onChange={(e) => setFormData({ ...formData, nivelRiesgoSCTR: e.target.value as any })}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white focus:outline-none focus:border-emerald-500 font-semibold"
              >
                <option value="ALTO">ALTO (Anexo 5 DS 009-97-SA)</option>
                <option value="MEDIO">MEDIO</option>
                <option value="BAJO">BAJO</option>
              </select>
            </div>
            <div>
              <label className="block text-slate-300 font-medium mb-1">Estado de Empresa</label>
              <select
                value={formData.estado || 'ACTIVA'}
                onChange={(e) => setFormData({ ...formData, estado: e.target.value as any })}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white focus:outline-none focus:border-emerald-500 font-semibold"
              >
                <option value="ACTIVA">ACTIVA</option>
                <option value="INACTIVA">INACTIVA</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">Actividad Económica Detallada</label>
            <input
              type="text"
              required
              value={formData.actividadEconomica || ''}
              onChange={(e) => setFormData({ ...formData, actividadEconomica: e.target.value })}
              placeholder="Extracción subterránea de minerales metalíferos"
              className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">Dirección Fiscal / Sede Principal</label>
            <input
              type="text"
              required
              value={formData.direccion || ''}
              onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
              placeholder="Av. Principal 123"
              className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="block text-slate-300 font-medium mb-1">Contacto Nombre</label>
              <input
                type="text"
                required
                value={formData.contactoNombre || ''}
                onChange={(e) => setFormData({ ...formData, contactoNombre: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-medium mb-1">Email</label>
              <input
                type="email"
                required
                value={formData.contactoEmail || ''}
                onChange={(e) => setFormData({ ...formData, contactoEmail: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-medium mb-1">Teléfono</label>
              <input
                type="text"
                required
                value={formData.contactoTelefono || ''}
                onChange={(e) => setFormData({ ...formData, contactoTelefono: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-medium"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-semibold shadow-lg shadow-emerald-900/30"
            >
              {editingId ? 'Actualizar Empresa' : 'Guardar Empresa'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
