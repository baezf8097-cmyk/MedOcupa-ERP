import React, { useState } from 'react';
import { RegistroVacuna, Trabajador } from '../../types/erp';
import { 
  Syringe, Plus, CheckCircle2, Calendar, Search, Filter, ShieldCheck, 
  UserCheck, AlertCircle, Edit3, Trash2, Printer, Download, Eye, X, Check, Clock, FileText, Sparkles
} from 'lucide-react';

interface VacunasModuleProps {
  vacunas: RegistroVacuna[];
  trabajadores: Trabajador[];
  onUpdateVacunas?: (vacunas: RegistroVacuna[]) => void;
}

const VACUNAS_ESTANDAR_MINSA = [
  { nombre: 'Hepatitis B (Recombinante)', dosisSugeridas: [1, 2, 3], desc: 'Obligatoria personal con riesgo biológico' },
  { nombre: 'Tétanos / Td / TdaP (Difteria y Tétanos)', dosisSugeridas: [1, 2, 3], desc: 'Refuerzo cada 5 a 10 años' },
  { nombre: 'Influenza Estacional 2026', dosisSugeridas: [1], desc: 'Anual obligatoria en salud y campo' },
  { nombre: 'Fiebre Amarilla (Antiamarílica)', dosisSugeridas: [1], desc: 'Única dosis / Zonas de riesgo' },
  { nombre: 'Neumococo 23-valente', dosisSugeridas: [1], desc: 'Personal mayor de 50 años o con co-morbilidad' },
  { nombre: 'Hepatitis A', dosisSugeridas: [1, 2], desc: 'Manipuladores de alimentos / Aguas servidas' },
  { nombre: 'Rabia Ocupacional', dosisSugeridas: [1, 2, 3], desc: 'Veterinarios, control de fauna y campo' }
];

export const VacunasModule: React.FC<VacunasModuleProps> = ({ 
  vacunas: initialVacunas, 
  trabajadores,
  onUpdateVacunas
}) => {
  const [listVacunas, setListVacunas] = useState<RegistroVacuna[]>(initialVacunas);
  const [selectedTrabajadorId, setSelectedTrabajadorId] = useState<string>(
    trabajadores.length > 0 ? trabajadores[0].id : ''
  );
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'individual' | 'tabla_general'>('individual');
  
  // Modal states
  const [editingVacuna, setEditingVacuna] = useState<RegistroVacuna | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showPdfModal, setShowPdfModal] = useState(false);

  // New Vacuna State
  const [newVacuna, setNewVacuna] = useState<Partial<RegistroVacuna>>({
    trabajadorId: selectedTrabajadorId,
    vacunaNombre: 'Hepatitis B (Recombinante)',
    dosisNumero: 1,
    fechaAplicacion: new Date().toISOString().split('T')[0],
    lote: '',
    laboratorio: '',
    aplicada: true,
    tieneProximoRefuerzo: false,
    proximaDosisFecha: '',
    observaciones: ''
  });

  const updateVacunasState = (newList: RegistroVacuna[]) => {
    setListVacunas(newList);
    if (onUpdateVacunas) {
      onUpdateVacunas(newList);
    }
  };

  const selectedTrabajador = trabajadores.find(t => t.id === selectedTrabajadorId);

  // Filtered workers list
  const filteredTrabajadores = trabajadores.filter(t => {
    const term = searchTerm.toLowerCase();
    const fullName = `${t.nombres} ${t.apellidoPaterno} ${t.apellidoMaterno}`.toLowerCase();
    return fullName.includes(term) || t.numeroDocumento.includes(term) || t.puestoTrabajo.toLowerCase().includes(term);
  });

  // Vacunas for selected worker
  const vacunasSelectedWorker = listVacunas.filter(v => v.trabajadorId === selectedTrabajadorId);

  // Toggle Check Aplicada inline
  const handleToggleAplicada = (vacId: string) => {
    const updated = listVacunas.map(v => {
      if (v.id === vacId) {
        const nextAplicada = !v.aplicada;
        return {
          ...v,
          aplicada: nextAplicada,
          fechaAplicacion: nextAplicada && !v.fechaAplicacion ? new Date().toISOString().split('T')[0] : v.fechaAplicacion
        };
      }
      return v;
    });
    updateVacunasState(updated);
  };

  // Toggle Próximo Refuerzo inline
  const handleToggleTieneRefuerzo = (vacId: string) => {
    const updated = listVacunas.map(v => {
      if (v.id === vacId) {
        const nextHasRefuerzo = !v.tieneProximoRefuerzo;
        return {
          ...v,
          tieneProximoRefuerzo: nextHasRefuerzo,
          proximaDosisFecha: nextHasRefuerzo ? (v.proximaDosisFecha || new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]) : ''
        };
      }
      return v;
    });
    updateVacunasState(updated);
  };

  // Update Proxima Dosis Fecha inline
  const handleDateRefuerzoChange = (vacId: string, fecha: string) => {
    const updated = listVacunas.map(v => {
      if (v.id === vacId) {
        return {
          ...v,
          proximaDosisFecha: fecha,
          tieneProximoRefuerzo: true
        };
      }
      return v;
    });
    updateVacunasState(updated);
  };

  // Delete Vacuna
  const handleDeleteVacuna = (vacId: string) => {
    if (confirm('¿Desea eliminar este registro de inmunización?')) {
      const updated = listVacunas.filter(v => v.id !== vacId);
      updateVacunasState(updated);
    }
  };

  // Create new Vacuna
  const handleCreateVacuna = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVacuna.trabajadorId || !newVacuna.vacunaNombre) return;

    const created: RegistroVacuna = {
      id: `vac-${Date.now()}`,
      trabajadorId: newVacuna.trabajadorId,
      vacunaNombre: newVacuna.vacunaNombre,
      dosisNumero: Number(newVacuna.dosisNumero) || 1,
      fechaAplicacion: newVacuna.aplicada ? (newVacuna.fechaAplicacion || new Date().toISOString().split('T')[0]) : '',
      lote: newVacuna.lote || 'SIN-LOTE',
      laboratorio: newVacuna.laboratorio || 'MINSA',
      aplicada: !!newVacuna.aplicada,
      tieneProximoRefuerzo: !!newVacuna.tieneProximoRefuerzo,
      proximaDosisFecha: newVacuna.tieneProximoRefuerzo ? newVacuna.proximaDosisFecha : '',
      observaciones: newVacuna.observaciones || ''
    };

    updateVacunasState([created, ...listVacunas]);
    setShowAddModal(false);
    setNewVacuna({
      trabajadorId: selectedTrabajadorId,
      vacunaNombre: 'Hepatitis B (Recombinante)',
      dosisNumero: 1,
      fechaAplicacion: new Date().toISOString().split('T')[0],
      lote: '',
      laboratorio: '',
      aplicada: true,
      tieneProximoRefuerzo: false,
      proximaDosisFecha: '',
      observaciones: ''
    });
  };

  // Save edited Vacuna
  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingVacuna) return;

    const updated = listVacunas.map(v => v.id === editingVacuna.id ? {
      ...editingVacuna,
      fechaAplicacion: editingVacuna.aplicada ? (editingVacuna.fechaAplicacion || new Date().toISOString().split('T')[0]) : '',
      proximaDosisFecha: editingVacuna.tieneProximoRefuerzo ? editingVacuna.proximaDosisFecha : ''
    } : v);

    updateVacunasState(updated);
    setEditingVacuna(null);
  };

  // Quick add standard vaccine dose for selected worker
  const handleAddStandardDose = (vacunaNombre: string, dosisNum: number) => {
    if (!selectedTrabajadorId) return;

    // Check if already exists
    const exists = listVacunas.find(
      v => v.trabajadorId === selectedTrabajadorId && 
           v.vacunaNombre === vacunaNombre && 
           v.dosisNumero === dosisNum
    );

    if (exists) {
      alert(`La dosis ${dosisNum} de ${vacunaNombre} ya está registrada para este trabajador.`);
      return;
    }

    const created: RegistroVacuna = {
      id: `vac-${Date.now()}`,
      trabajadorId: selectedTrabajadorId,
      vacunaNombre,
      dosisNumero: dosisNum,
      fechaAplicacion: new Date().toISOString().split('T')[0],
      lote: 'LOTE-MINSA-2026',
      laboratorio: 'MINSA / DIGEMID',
      aplicada: true,
      tieneProximoRefuerzo: false,
      proximaDosisFecha: '',
      observaciones: 'Registrado desde Carné Digital Ocupacional'
    };

    updateVacunasState([...listVacunas, created]);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-lg">
        <div>
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span className="px-2.5 py-0.5 bg-teal-500/10 text-teal-400 border border-teal-500/20 text-[10px] font-bold uppercase rounded-full">
              R.M. 021-2016-MINSA (Inmunizaciones Ocupacionales)
            </span>
            <span className="px-2.5 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold uppercase rounded-full">
              Edición Rápida con Check & Refuerzos
            </span>
          </div>
          <h2 className="text-xl font-bold text-white font-sans flex items-center gap-2.5">
            <Syringe className="w-6 h-6 text-teal-400" /> Carné Digital de Inmunizaciones Ocupacionales
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-3xl">
            Gestión individualizada por trabajador. Marque dosis aplicadas mediante check (✓), configure si requiere próximos refuerzos y sus fechas correspondientes.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <div className="bg-slate-900 p-1 rounded-xl border border-slate-800 flex items-center">
            <button
              onClick={() => setViewMode('individual')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                viewMode === 'individual'
                  ? 'bg-teal-600 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5" /> Carné por Trabajador
            </button>

            <button
              onClick={() => setViewMode('tabla_general')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                viewMode === 'tabla_general'
                  ? 'bg-teal-600 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <FileText className="w-3.5 h-3.5" /> Consolidado General
            </button>
          </div>

          <button
            onClick={() => {
              setNewVacuna(prev => ({ ...prev, trabajadorId: selectedTrabajadorId }));
              setShowAddModal(true);
            }}
            className="px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-teal-900/40 flex items-center gap-2 transition-all"
          >
            <Plus className="w-4 h-4" /> Registrar Vacuna
          </button>
        </div>
      </div>

      {/* VISTA INDIVIDUAL: CARNÉ DIGITAL POR TRABAJADOR */}
      {viewMode === 'individual' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Panel: Worker List Selection */}
          <div className="lg:col-span-4 bg-slate-900 rounded-2xl border border-slate-800 p-4 space-y-3 flex flex-col h-[750px]">
            <div className="space-y-2">
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                <Search className="w-4 h-4 text-teal-400" /> Seleccionar Trabajador
              </h3>
              <input
                type="text"
                placeholder="Buscar por Nombre, DNI o Puesto..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-teal-500"
              />
            </div>

            <div className="flex-1 overflow-y-auto space-y-2 pr-1">
              {filteredTrabajadores.map(trab => {
                const isSelected = trab.id === selectedTrabajadorId;
                const userVacunas = listVacunas.filter(v => v.trabajadorId === trab.id);
                const aplicadasCount = userVacunas.filter(v => v.aplicada).length;
                const refuerzosPendientes = userVacunas.filter(v => v.tieneProximoRefuerzo && v.proximaDosisFecha).length;

                return (
                  <button
                    key={trab.id}
                    onClick={() => setSelectedTrabajadorId(trab.id)}
                    className={`w-full text-left p-3 rounded-xl border transition-all flex items-center justify-between gap-2 ${
                      isSelected
                        ? 'bg-teal-950/40 border-teal-500/50 text-white shadow-lg'
                        : 'bg-slate-950/60 border-slate-800/80 hover:bg-slate-800/60 text-slate-300'
                    }`}
                  >
                    <div className="truncate">
                      <div className="font-bold text-xs text-white truncate">
                        {trab.apellidoPaterno} {trab.nombres}
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        DNI: {trab.numeroDocumento} · {trab.puestoTrabajo}
                      </div>
                    </div>

                    <div className="flex flex-col items-end shrink-0 gap-1">
                      <span className="px-2 py-0.5 bg-teal-500/10 text-teal-300 border border-teal-500/20 text-[10px] font-bold rounded">
                        {aplicadasCount} Aplicadas
                      </span>
                      {refuerzosPendientes > 0 && (
                        <span className="px-1.5 py-0.5 bg-amber-500/10 text-amber-300 text-[9px] font-bold rounded flex items-center gap-0.5">
                          <Clock className="w-2.5 h-2.5" /> {refuerzosPendientes} Refuerzo(s)
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Panel: Selected Worker Digital Vaccine Card */}
          <div className="lg:col-span-8 space-y-5">
            {selectedTrabajador ? (
              <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 space-y-6 shadow-xl">
                {/* Worker Identity Banner */}
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-teal-600/20 border border-teal-500/40 flex items-center justify-center text-teal-400 font-bold text-lg">
                      {selectedTrabajador.nombres.charAt(0)}{selectedTrabajador.apellidoPaterno.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-bold text-white font-sans">
                          {selectedTrabajador.apellidoPaterno} {selectedTrabajador.apellidoMaterno}, {selectedTrabajador.nombres}
                        </h3>
                        <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold rounded">
                          Carné Habilitado
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 font-mono mt-0.5">
                        DNI: {selectedTrabajador.numeroDocumento} | Cargo: {selectedTrabajador.puestoTrabajo} | Área: {selectedTrabajador.area}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => setShowPdfModal(true)}
                      className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-teal-300 border border-teal-500/30 font-bold text-xs rounded-xl flex items-center gap-2 transition-all"
                    >
                      <Printer className="w-4 h-4 text-teal-400" /> Ver Carné Digital PDF
                    </button>
                  </div>
                </div>

                {/* Quick Add Standard Vaccine Shortcuts */}
                <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800/80 space-y-2">
                  <h4 className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Atajos de Inmunización Rápida (MINSA):
                  </h4>
                  <div className="flex flex-wrap gap-2 text-xs">
                    <button
                      onClick={() => handleAddStandardDose('Hepatitis B (Recombinante)', (vacunasSelectedWorker.filter(v => v.vacunaNombre.includes('Hepatitis B')).length + 1))}
                      className="px-2.5 py-1 bg-teal-950 hover:bg-teal-900 text-teal-300 border border-teal-800 rounded-lg text-[11px] font-semibold transition-all flex items-center gap-1"
                    >
                      + Hepatitis B Dosis #{vacunasSelectedWorker.filter(v => v.vacunaNombre.includes('Hepatitis B')).length + 1}
                    </button>

                    <button
                      onClick={() => handleAddStandardDose('Tétanos / TdaP (Difteria, Tétanos y Pertussis)', 1)}
                      className="px-2.5 py-1 bg-indigo-950 hover:bg-indigo-900 text-indigo-300 border border-indigo-800 rounded-lg text-[11px] font-semibold transition-all flex items-center gap-1"
                    >
                      + Tétanos / TdaP (Refuerzo)
                    </button>

                    <button
                      onClick={() => handleAddStandardDose('Influenza Estacional 2026', 1)}
                      className="px-2.5 py-1 bg-amber-950 hover:bg-amber-900 text-amber-300 border border-amber-800 rounded-lg text-[11px] font-semibold transition-all flex items-center gap-1"
                    >
                      + Influenza 2026
                    </button>
                  </div>
                </div>

                {/* Main Vaccine Records Checklist for Worker */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-teal-400" /> Esquema de Vacunas Registradas ({vacunasSelectedWorker.length})
                    </h4>
                    <span className="text-[11px] text-slate-400 font-medium">
                      Marque con check (✓) las dosis aplicadas y configure refuerzos futuros
                    </span>
                  </div>

                  {vacunasSelectedWorker.length === 0 ? (
                    <div className="p-8 text-center bg-slate-950/40 rounded-xl border border-slate-800/80 space-y-2">
                      <Syringe className="w-8 h-8 text-slate-600 mx-auto" />
                      <p className="text-xs text-slate-400">No hay dosis registradas aún para este trabajador.</p>
                      <button
                        onClick={() => {
                          setNewVacuna(prev => ({ ...prev, trabajadorId: selectedTrabajadorId }));
                          setShowAddModal(true);
                        }}
                        className="px-3 py-1.5 bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs rounded-lg inline-flex items-center gap-1 mt-2"
                      >
                        <Plus className="w-3.5 h-3.5" /> Agregar Primera Dosis
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {vacunasSelectedWorker.map((vac) => (
                        <div
                          key={vac.id}
                          className={`p-4 rounded-xl border transition-all space-y-3 ${
                            vac.aplicada
                              ? 'bg-slate-950/80 border-slate-800'
                              : 'bg-slate-950/40 border-amber-500/30'
                          }`}
                        >
                          {/* Row Top: Checkbox, Name, Dosis Number, Actions */}
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex items-center gap-3">
                              {/* CHECKBOX APLICADA */}
                              <button
                                type="button"
                                onClick={() => handleToggleAplicada(vac.id)}
                                className={`w-6 h-6 rounded-lg border flex items-center justify-center transition-all shrink-0 ${
                                  vac.aplicada
                                    ? 'bg-emerald-500 border-emerald-400 text-slate-950 shadow-md shadow-emerald-950'
                                    : 'bg-slate-900 border-slate-700 hover:border-teal-500 text-transparent'
                                }`}
                                title={vac.aplicada ? 'Marcar como No Aplicada' : 'Marcar como Aplicada (Check ✓)'}
                              >
                                <Check className="w-4 h-4 stroke-[3]" />
                              </button>

                              <div>
                                <div className="flex items-center gap-2">
                                  <h5 className={`text-sm font-bold font-sans ${vac.aplicada ? 'text-white' : 'text-slate-400'}`}>
                                    {vac.vacunaNombre}
                                  </h5>
                                  <span className="px-2 py-0.5 rounded bg-teal-950 text-teal-300 font-bold border border-teal-800 text-[10px]">
                                    Dosis {vac.dosisNumero}
                                  </span>
                                  {vac.aplicada ? (
                                    <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold rounded">
                                      ✓ APLICADA
                                    </span>
                                  ) : (
                                    <span className="px-2 py-0.5 bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[10px] font-bold rounded">
                                      PENDIENTE
                                    </span>
                                  )}
                                </div>
                                <p className="text-[11px] text-slate-400 mt-0.5 font-mono">
                                  Lote: {vac.lote || 'N/A'} | Lab: {vac.laboratorio || 'N/A'}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center gap-1 shrink-0">
                              <button
                                type="button"
                                onClick={() => setEditingVacuna(JSON.parse(JSON.stringify(vac)))}
                                className="p-1.5 bg-slate-800 hover:bg-slate-700 text-indigo-300 rounded-lg border border-slate-700 transition-all"
                                title="Editar detalles de dosis"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>

                              <button
                                type="button"
                                onClick={() => handleDeleteVacuna(vac.id)}
                                className="p-1.5 bg-slate-800 hover:bg-rose-900/40 text-slate-400 hover:text-rose-400 rounded-lg border border-slate-700 transition-all"
                                title="Eliminar dosis"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>

                          {/* Row Bottom: Fechas & Configuración de Próximos Refuerzos */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-slate-800/80 text-xs">
                            {/* Fecha de Aplicación */}
                            <div className="flex items-center gap-2">
                              <span className="text-slate-400 font-medium text-[11px] shrink-0">Fecha Aplicación:</span>
                              <input
                                type="date"
                                value={vac.fechaAplicacion}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  const updated = listVacunas.map(v => v.id === vac.id ? { ...v, fechaAplicacion: val, aplicada: true } : v);
                                  updateVacunasState(updated);
                                }}
                                className="bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-slate-200 text-xs focus:outline-none focus:border-teal-500"
                              />
                            </div>

                            {/* Próximo Refuerzo Toggle y Fecha */}
                            <div className="flex items-center gap-2">
                              <label className="flex items-center gap-1.5 cursor-pointer text-[11px] text-slate-300 font-semibold shrink-0">
                                <input
                                  type="checkbox"
                                  checked={!!vac.tieneProximoRefuerzo}
                                  onChange={() => handleToggleTieneRefuerzo(vac.id)}
                                  className="rounded bg-slate-900 border-slate-700 text-teal-500 focus:ring-teal-500 w-3.5 h-3.5"
                                />
                                <span>Próximo Refuerzo:</span>
                              </label>

                              {vac.tieneProximoRefuerzo ? (
                                <input
                                  type="date"
                                  value={vac.proximaDosisFecha || ''}
                                  onChange={(e) => handleDateRefuerzoChange(vac.id, e.target.value)}
                                  className="bg-slate-900 border border-amber-500/40 rounded-lg px-2 py-1 text-amber-300 font-semibold text-xs focus:outline-none focus:border-amber-400"
                                />
                              ) : (
                                <span className="text-[11px] text-slate-500 italic">No requiere refuerzo</span>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-slate-900 rounded-2xl border border-slate-800 p-12 text-center text-slate-400">
                Seleccione un trabajador para visualizar y editar su Carné Digital.
              </div>
            )}
          </div>
        </div>
      )}

      {/* VISTA CONSOLIDADA GENERAL (TABLA COMPLETA) */}
      {viewMode === 'tabla_general' && (
        <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden shadow-xl space-y-4 p-4">
          <div className="flex items-center justify-between pb-2">
            <h3 className="text-sm font-bold text-white font-sans flex items-center gap-2">
              <FileText className="w-4 h-4 text-teal-400" /> Registro Consolidado de Inmunizaciones Ocupacionales
            </h3>
            <span className="text-xs text-slate-400 font-mono">
              Total Registros: {listVacunas.length}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] font-bold tracking-wider border-b border-slate-800">
                <tr>
                  <th className="px-3 py-3 text-center">Aplicada (Check)</th>
                  <th className="px-4 py-3">Trabajador</th>
                  <th className="px-4 py-3">Vacuna / Inmunógeno</th>
                  <th className="px-4 py-3">Dosis</th>
                  <th className="px-4 py-3">Fecha Aplicación / Lote</th>
                  <th className="px-4 py-3">Próximo Refuerzo</th>
                  <th className="px-4 py-3 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {listVacunas.map((vac) => {
                  const t = trabajadores.find(x => x.id === vac.trabajadorId);
                  const nombreTrab = t ? `${t.apellidoPaterno} ${t.nombres}` : 'Trabajador';
                  const dniTrab = t ? t.numeroDocumento : '';

                  return (
                    <tr key={vac.id} className="hover:bg-slate-800/50 transition-colors">
                      {/* Check Application */}
                      <td className="px-3 py-3 text-center">
                        <button
                          type="button"
                          onClick={() => handleToggleAplicada(vac.id)}
                          className={`w-5 h-5 mx-auto rounded border flex items-center justify-center transition-all ${
                            vac.aplicada
                              ? 'bg-emerald-500 border-emerald-400 text-slate-950'
                              : 'bg-slate-900 border-slate-700 text-transparent hover:border-teal-500'
                          }`}
                        >
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </button>
                      </td>

                      {/* Trabajador */}
                      <td className="px-4 py-3">
                        <div className="font-bold text-white text-xs">{nombreTrab}</div>
                        <div className="text-[10px] text-slate-400 font-mono">DNI: {dniTrab}</div>
                      </td>

                      {/* Vacuna */}
                      <td className="px-4 py-3">
                        <span className="font-bold text-teal-300">{vac.vacunaNombre}</span>
                        <div className="text-[10px] text-slate-400 font-mono">Lab: {vac.laboratorio || 'N/A'}</div>
                      </td>

                      {/* Dosis */}
                      <td className="px-4 py-3">
                        <span className="px-2 py-0.5 rounded bg-teal-950 text-teal-300 font-bold border border-teal-800 text-[10px]">
                          Dosis {vac.dosisNumero}
                        </span>
                      </td>

                      {/* Fecha Aplicación */}
                      <td className="px-4 py-3">
                        <div className="text-slate-200 font-medium">{vac.fechaAplicacion || 'No aplicada'}</div>
                        <div className="text-[10px] font-mono text-slate-400">Lote: {vac.lote || 'N/A'}</div>
                      </td>

                      {/* Próximo Refuerzo */}
                      <td className="px-4 py-3">
                        {vac.tieneProximoRefuerzo && vac.proximaDosisFecha ? (
                          <div className="flex items-center gap-1.5">
                            <span className="text-amber-300 font-bold">{vac.proximaDosisFecha}</span>
                          </div>
                        ) : (
                          <span className="text-slate-500 italic text-[11px]">Sin refuerzo programado</span>
                        )}
                      </td>

                      {/* Acciones */}
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            type="button"
                            onClick={() => setEditingVacuna(JSON.parse(JSON.stringify(vac)))}
                            className="p-1.5 bg-slate-800 hover:bg-slate-700 text-indigo-300 rounded border border-slate-700"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteVacuna(vac.id)}
                            className="p-1.5 bg-slate-800 hover:bg-rose-900/40 text-slate-400 hover:text-rose-400 rounded border border-slate-700"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL REGISTRAR NUEVA VACUNA */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-hidden">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg max-h-[90vh] flex flex-col shadow-2xl text-slate-100 overflow-hidden my-auto">
            <div className="p-4 sm:p-5 border-b border-slate-800 shrink-0 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-teal-500/10 text-teal-400 rounded-xl border border-teal-500/20">
                  <Syringe className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white font-sans">
                    Registrar Dosis / Vacuna Ocupacional
                  </h3>
                  <p className="text-xs text-slate-400">
                    Añada un nuevo registro de inmunización según R.M. 021-2016-MINSA.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="p-1.5 bg-slate-800 text-slate-400 hover:text-white rounded-lg border border-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateVacuna} className="flex flex-col flex-1 overflow-hidden min-h-0 text-xs">
              <div className="p-4 sm:p-5 overflow-y-auto space-y-4 flex-1">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Trabajador Afectado:*</label>
                  <select
                    required
                    value={newVacuna.trabajadorId}
                    onChange={(e) => setNewVacuna({ ...newVacuna, trabajadorId: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white font-semibold focus:outline-none focus:border-teal-500"
                  >
                    {trabajadores.map(t => (
                      <option key={t.id} value={t.id}>
                        {t.apellidoPaterno} {t.nombres} (DNI: {t.numeroDocumento})
                      </option>
                    ))}
                  </select>
                </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-slate-300 font-semibold mb-1">Vacuna / Inmunógeno:*</label>
                  <select
                    value={newVacuna.vacunaNombre}
                    onChange={(e) => setNewVacuna({ ...newVacuna, vacunaNombre: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white font-semibold focus:outline-none focus:border-teal-500"
                  >
                    {VACUNAS_ESTANDAR_MINSA.map(v => (
                      <option key={v.nombre} value={v.nombre}>{v.nombre}</option>
                    ))}
                    <option value="Otra Vacuna Ocupacional">Otra Vacuna Ocupacional</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Dosis N°:*</label>
                  <input
                    type="number"
                    min={1}
                    max={10}
                    required
                    value={newVacuna.dosisNumero}
                    onChange={(e) => setNewVacuna({ ...newVacuna, dosisNumero: Number(e.target.value) })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white font-semibold focus:outline-none focus:border-teal-500"
                  />
                </div>
              </div>

              {/* Checkbox Aplicada */}
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-3">
                <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-200">
                  <input
                    type="checkbox"
                    checked={!!newVacuna.aplicada}
                    onChange={(e) => setNewVacuna({ ...newVacuna, aplicada: e.target.checked })}
                    className="w-4 h-4 text-teal-500 rounded bg-slate-900 border-slate-700 focus:ring-teal-500"
                  />
                  <span>Vacuna Aplicada con éxito (Check ✓)</span>
                </label>

                {newVacuna.aplicada && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-800">
                    <div>
                      <label className="block text-slate-400 font-medium mb-1">Fecha Aplicación:</label>
                      <input
                        type="date"
                        value={newVacuna.fechaAplicacion}
                        onChange={(e) => setNewVacuna({ ...newVacuna, fechaAplicacion: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg p-1.5 text-white focus:outline-none focus:border-teal-500"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-400 font-medium mb-1">Lote:</label>
                      <input
                        type="text"
                        value={newVacuna.lote}
                        onChange={(e) => setNewVacuna({ ...newVacuna, lote: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg p-1.5 text-white focus:outline-none focus:border-teal-500 font-mono"
                        placeholder="Ej: HEP-2026-X01"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-400 font-medium mb-1">Laboratorio:</label>
                      <input
                        type="text"
                        value={newVacuna.laboratorio}
                        onChange={(e) => setNewVacuna({ ...newVacuna, laboratorio: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg p-1.5 text-white focus:outline-none focus:border-teal-500"
                        placeholder="Ej: GSK / Sanofi"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Checkbox Próximos Refuerzos */}
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-3">
                <label className="flex items-center gap-2 cursor-pointer font-bold text-amber-300">
                  <input
                    type="checkbox"
                    checked={!!newVacuna.tieneProximoRefuerzo}
                    onChange={(e) => setNewVacuna({ ...newVacuna, tieneProximoRefuerzo: e.target.checked })}
                    className="w-4 h-4 text-amber-500 rounded bg-slate-900 border-slate-700 focus:ring-amber-500"
                  />
                  <span>¿Requiere Próximos Refuerzos?</span>
                </label>

                {newVacuna.tieneProximoRefuerzo && (
                  <div className="pt-2 border-t border-slate-800">
                    <label className="block text-slate-300 font-semibold mb-1">Fecha del Próximo Refuerzo:*</label>
                    <input
                      type="date"
                      required
                      value={newVacuna.proximaDosisFecha || ''}
                      onChange={(e) => setNewVacuna({ ...newVacuna, proximaDosisFecha: e.target.value })}
                      className="w-full bg-slate-900 border border-amber-500/40 rounded-lg p-2 text-amber-300 font-semibold focus:outline-none focus:border-amber-400"
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Observaciones (Opcional):</label>
                <input
                  type="text"
                  value={newVacuna.observaciones || ''}
                  onChange={(e) => setNewVacuna({ ...newVacuna, observaciones: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white focus:outline-none focus:border-teal-500"
                  placeholder="Ej: Sin reacciones adversas tras 15 minutos de observación..."
                />
              </div>
              </div>

              <div className="p-4 sm:p-5 border-t border-slate-800 flex justify-end gap-2 shrink-0 bg-slate-900">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg font-medium hover:bg-slate-700 transition-all"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-lg font-bold flex items-center gap-2 shadow-lg shadow-teal-900/40 transition-all"
                >
                  <Plus className="w-4 h-4" /> Registrar Vacuna
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL EDITAR VACUNA */}
      {editingVacuna && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-hidden">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg max-h-[90vh] flex flex-col shadow-2xl text-slate-100 overflow-hidden my-auto">
            <div className="p-4 sm:p-5 border-b border-slate-800 shrink-0 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-teal-500/10 text-teal-400 rounded-xl border border-teal-500/20">
                  <Edit3 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white font-sans">
                    Editar Dosis de Vacuna Ocupacional
                  </h3>
                  <p className="text-xs text-slate-400">
                    Modifique el estado de aplicación, lote o fechas de refuerzo.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setEditingVacuna(null)}
                className="p-1.5 bg-slate-800 text-slate-400 hover:text-white rounded-lg border border-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="flex flex-col flex-1 overflow-hidden min-h-0 text-xs">
              <div className="p-4 sm:p-5 overflow-y-auto space-y-4 flex-1">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-slate-300 font-semibold mb-1">Vacuna / Inmunógeno:</label>
                  <input
                    type="text"
                    required
                    value={editingVacuna.vacunaNombre}
                    onChange={(e) => setEditingVacuna({ ...editingVacuna, vacunaNombre: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white font-semibold focus:outline-none focus:border-teal-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Dosis N°:</label>
                  <input
                    type="number"
                    required
                    value={editingVacuna.dosisNumero}
                    onChange={(e) => setEditingVacuna({ ...editingVacuna, dosisNumero: Number(e.target.value) })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white font-semibold focus:outline-none focus:border-teal-500"
                  />
                </div>
              </div>

              {/* Checkbox Aplicada */}
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-3">
                <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-200">
                  <input
                    type="checkbox"
                    checked={!!editingVacuna.aplicada}
                    onChange={(e) => setEditingVacuna({ ...editingVacuna, aplicada: e.target.checked })}
                    className="w-4 h-4 text-teal-500 rounded bg-slate-900 border-slate-700 focus:ring-teal-500"
                  />
                  <span>Vacuna Aplicada con éxito (Check ✓)</span>
                </label>

                {editingVacuna.aplicada && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-800">
                    <div>
                      <label className="block text-slate-400 font-medium mb-1">Fecha Aplicación:</label>
                      <input
                        type="date"
                        value={editingVacuna.fechaAplicacion}
                        onChange={(e) => setEditingVacuna({ ...editingVacuna, fechaAplicacion: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg p-1.5 text-white focus:outline-none focus:border-teal-500"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-400 font-medium mb-1">Lote:</label>
                      <input
                        type="text"
                        value={editingVacuna.lote}
                        onChange={(e) => setEditingVacuna({ ...editingVacuna, lote: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg p-1.5 text-white focus:outline-none focus:border-teal-500 font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-400 font-medium mb-1">Laboratorio:</label>
                      <input
                        type="text"
                        value={editingVacuna.laboratorio}
                        onChange={(e) => setEditingVacuna({ ...editingVacuna, laboratorio: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg p-1.5 text-white focus:outline-none focus:border-teal-500"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Checkbox Próximos Refuerzos */}
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-3">
                <label className="flex items-center gap-2 cursor-pointer font-bold text-amber-300">
                  <input
                    type="checkbox"
                    checked={!!editingVacuna.tieneProximoRefuerzo}
                    onChange={(e) => setEditingVacuna({ ...editingVacuna, tieneProximoRefuerzo: e.target.checked })}
                    className="w-4 h-4 text-amber-500 rounded bg-slate-900 border-slate-700 focus:ring-amber-500"
                  />
                  <span>¿Requiere Próximos Refuerzos?</span>
                </label>

                {editingVacuna.tieneProximoRefuerzo && (
                  <div className="pt-2 border-t border-slate-800">
                    <label className="block text-slate-300 font-semibold mb-1">Fecha del Próximo Refuerzo:*</label>
                    <input
                      type="date"
                      required
                      value={editingVacuna.proximaDosisFecha || ''}
                      onChange={(e) => setEditingVacuna({ ...editingVacuna, proximaDosisFecha: e.target.value })}
                      className="w-full bg-slate-900 border border-amber-500/40 rounded-lg p-2 text-amber-300 font-semibold focus:outline-none focus:border-amber-400"
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Observaciones:</label>
                <input
                  type="text"
                  value={editingVacuna.observaciones || ''}
                  onChange={(e) => setEditingVacuna({ ...editingVacuna, observaciones: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white focus:outline-none focus:border-teal-500"
                />
              </div>

              </div>

              <div className="p-4 sm:p-5 border-t border-slate-800 flex justify-end gap-2 shrink-0 bg-slate-900">
                <button
                  type="button"
                  onClick={() => setEditingVacuna(null)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg font-medium hover:bg-slate-700 transition-all"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-lg font-bold flex items-center gap-2 shadow-lg shadow-teal-900/40 transition-all"
                >
                  Guardar Cambios
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL PREVISUALIZADOR PDF CARNÉ DIGITAL */}
      {showPdfModal && selectedTrabajador && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden text-slate-100">
            {/* Modal Header */}
            <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-teal-500/10 text-teal-400 rounded-lg border border-teal-500/20">
                  <Syringe className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white font-sans">
                    Carné Digital de Inmunizaciones Ocupacionales - R.M. 021-2016-MINSA
                  </h3>
                  <p className="text-[10px] text-slate-400">
                    Trabajador: {selectedTrabajador.apellidoPaterno} {selectedTrabajador.nombres} (DNI: {selectedTrabajador.numeroDocumento})
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-3 py-1.5 bg-teal-600 hover:bg-teal-500 text-white font-bold rounded-lg text-xs flex items-center gap-1.5 transition-colors"
                >
                  <Printer className="w-3.5 h-3.5" /> Imprimir / Exportar PDF
                </button>

                <button
                  onClick={() => setShowPdfModal(false)}
                  className="p-1.5 bg-slate-800 text-slate-400 hover:text-white rounded-lg border border-slate-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Printable PDF Layout */}
            <div className="flex-1 bg-slate-950 p-6 overflow-y-auto space-y-6 text-slate-200">
              <div className="bg-white text-slate-900 p-6 rounded-xl border border-slate-300 shadow-xl space-y-6 font-sans">
                {/* Header Official MINSA Logo Mock */}
                <div className="border-b-2 border-teal-800 pb-4 flex items-center justify-between">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                      REPÚBLICA DEL PERÚ · MINISTERIO DE SALUD (MINSA)
                    </span>
                    <h2 className="text-lg font-black text-slate-900 uppercase">
                      CARNÉ DIGITAL DE INMUNIZACIONES OCUPACIONALES
                    </h2>
                    <p className="text-[11px] text-slate-600 font-medium">
                      Conforme a la Ley N° 29783, D.S. 005-2012-TR y R.M. 021-2016-MINSA
                    </p>
                  </div>

                  <div className="text-right border-l-2 border-slate-200 pl-4">
                    <div className="w-16 h-16 bg-slate-100 border border-slate-300 rounded flex items-center justify-center text-[10px] text-slate-500 font-mono text-center">
                      QR VERIFICACIÓN DIGITAL
                    </div>
                  </div>
                </div>

                {/* Worker Bio Data Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-500 font-bold block">TRABAJADOR:</span>
                    <strong className="text-slate-900">{selectedTrabajador.apellidoPaterno} {selectedTrabajador.nombres}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 font-bold block">DNI / CE:</span>
                    <strong className="text-slate-900">{selectedTrabajador.numeroDocumento}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 font-bold block">PUESTO TRABAJO:</span>
                    <strong className="text-slate-900">{selectedTrabajador.puestoTrabajo}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 font-bold block">ÁREA / SEDE:</span>
                    <strong className="text-slate-900">{selectedTrabajador.area}</strong>
                  </div>
                </div>

                {/* Vaccines Checklist Table */}
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-teal-800 text-white uppercase text-[10px] font-bold">
                      <th className="p-2 border border-teal-900 text-center">Estado (✓)</th>
                      <th className="p-2 border border-teal-900">Vacuna / Inmunógeno</th>
                      <th className="p-2 border border-teal-900">Dosis</th>
                      <th className="p-2 border border-teal-900">Fecha Aplicación</th>
                      <th className="p-2 border border-teal-900">Lote & Lab</th>
                      <th className="p-2 border border-teal-900">Próximo Refuerzo</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {vacunasSelectedWorker.map((vac) => (
                      <tr key={vac.id}>
                        <td className="p-2 border border-slate-200 text-center">
                          {vac.aplicada ? (
                            <span className="text-emerald-700 font-black text-sm">✓</span>
                          ) : (
                            <span className="text-amber-600 font-bold text-xs">PENDIENTE</span>
                          )}
                        </td>
                        <td className="p-2 border border-slate-200 font-bold text-slate-900">
                          {vac.vacunaNombre}
                        </td>
                        <td className="p-2 border border-slate-200 text-center font-semibold">
                          Dosis #{vac.dosisNumero}
                        </td>
                        <td className="p-2 border border-slate-200 font-mono">
                          {vac.fechaAplicacion || '-'}
                        </td>
                        <td className="p-2 border border-slate-200 font-mono text-[11px]">
                          Lote: {vac.lote || 'N/A'}<br />
                          Lab: {vac.laboratorio || 'MINSA'}
                        </td>
                        <td className="p-2 border border-slate-200 font-semibold text-amber-800">
                          {vac.tieneProximoRefuerzo && vac.proximaDosisFecha ? vac.proximaDosisFecha : 'Esquema Vigente'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Footer Validation */}
                <div className="pt-6 border-t border-slate-300 flex justify-between items-end text-xs">
                  <div>
                    <p className="text-[10px] text-slate-500">Documento Oficial de Vigilancia Médico Ocupacional</p>
                    <p className="text-[10px] text-slate-500 font-mono">Generado el: {new Date().toLocaleDateString()}</p>
                  </div>

                  <div className="text-center border-t border-slate-400 pt-1 w-48">
                    <p className="font-bold text-slate-800 text-[11px]">Servicio de Salud Ocupacional</p>
                    <p className="text-[10px] text-slate-500">Firma / Sello Médico Ocupacional</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
