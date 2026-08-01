import React, { useState } from 'react';
import { EMOExam, Trabajador, Empresa } from '../../types/erp';
import { 
  Stethoscope, Plus, CheckCircle2, Clock, AlertCircle, Award, FileCheck, Search, Filter, 
  Edit3, Save, X, User, FileSpreadsheet, Trash2, UserMinus 
} from 'lucide-react';
import { exportProgramacionesEMOExcel } from '../../utils/excelExporter';

interface EMOModuleProps {
  emos: EMOExam[];
  trabajadores: Trabajador[];
  empresas: Empresa[];
  onAddEMO: (emo: EMOExam) => void;
  onUpdateEMO?: (emo: EMOExam) => void;
  onDeleteEMO?: (emoId: string) => void;
  onDeleteTrabajador?: (trabajadorId: string) => void;
  onOpenAptitudModal: (emo: EMOExam) => void;
}

export const EMOModule: React.FC<EMOModuleProps> = ({
  emos,
  trabajadores,
  empresas,
  onAddEMO,
  onUpdateEMO,
  onDeleteEMO,
  onDeleteTrabajador,
  onOpenAptitudModal
}) => {
  const [showModal, setShowModal] = useState(false);
  const [editingEMO, setEditingEMO] = useState<EMOExam | null>(null);
  const [deletingEMOModal, setDeletingEMOModal] = useState<{ open: boolean; emo?: EMOExam }>({ open: false });
  const [filterTipo, setFilterTipo] = useState<string>('TODOS');

  const filteredEMOs = emos.filter(e => {
    if (filterTipo !== 'TODOS' && e.tipoEMO !== filterTipo) return false;
    return true;
  });

  const [formData, setFormData] = useState<Partial<EMOExam>>({
    trabajadorId: trabajadores[0]?.id || 'trab-1',
    tipoEMO: 'PERIODICO',
    fechaProgramada: '2026-08-01',
    protocoloAplicado: 'Protocolo Minería / Construcción Alto Riesgo (RM 312-2011)',
    costoEMO: 280.00,
    evaluaciones: {
      triaje: true,
      medicinaGeneral: true,
      audiometria: true,
      espirometria: true,
      radiografiaOIT: true,
      laboratorio: true,
      psicologia: true,
      oftalmologia: true,
      electrocardiograma: true
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trab = trabajadores.find(t => t.id === formData.trabajadorId);
    if (!trab) return;

    const newEMO: EMOExam = {
      id: `emo-${Date.now()}`,
      codigoEMO: `EMO-2026-${Math.floor(10000 + Math.random() * 90000)}`,
      trabajadorId: trab.id,
      empresaId: trab.empresaId,
      tipoEMO: formData.tipoEMO as any,
      fechaProgramada: formData.fechaProgramada!,
      estado: 'PROGRAMADO',
      protocoloAplicado: formData.protocoloAplicado!,
      costoEMO: Number(formData.costoEMO),
      evaluaciones: formData.evaluaciones as any
    };

    onAddEMO(newEMO);
    setShowModal(false);
  };

  const getTrabajadorNombre = (trabId: string) => {
    const t = trabajadores.find(x => x.id === trabId);
    return t ? `${t.apellidoPaterno} ${t.nombres} (${t.numeroDocumento})` : 'Trabajador No Encontrado';
  };

  const getEmpresaNombre = (empId: string) => {
    const e = empresas.find(x => x.id === empId);
    return e ? e.nombreComercial : 'Empresa';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 p-5 rounded-2xl border border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold uppercase rounded">
              Protocolo Oficial RM 312-2011-MINSA
            </span>
            <span className="text-xs text-slate-400">Anexos 1, 2 y 3</span>
          </div>
          <h2 className="text-xl font-bold text-white font-display flex items-center gap-2">
            <Stethoscope className="w-6 h-6 text-emerald-400" /> Exámenes Médicos Ocupacionales (EMO)
          </h2>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <select
            value={filterTipo}
            onChange={(e) => setFilterTipo(e.target.value)}
            className="bg-slate-800 border border-slate-700/80 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
          >
            <option value="TODOS">Todos los Tipos EMO</option>
            <option value="INGRESO">EMO de Ingreso (Preocupacional)</option>
            <option value="PERIODICO">EMO Periódico (Anual)</option>
            <option value="RETIRO">EMO de Retiro (Egreso)</option>
            <option value="REUBICACION">EMO Reubicación (Cambio de Puesto)</option>
          </select>

          <button
            onClick={() => exportProgramacionesEMOExcel(filteredEMOs, trabajadores, empresas)}
            className="px-3.5 py-2 bg-emerald-700 hover:bg-emerald-600 text-white rounded-lg text-xs font-bold flex items-center gap-2 border border-emerald-500/50 shadow-md shadow-emerald-950 transition-all shrink-0"
            title="Descargar Consolidado General de Programaciones y Exámenes EMO en Excel (.xlsx)"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-200" /> Exportar Consolidado (Excel)
          </button>

          <button
            onClick={() => setShowModal(true)}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold flex items-center gap-2 shadow-lg shadow-emerald-900/40 transition-all shrink-0"
          >
            <Plus className="w-4 h-4" /> Programar EMO
          </button>
        </div>
      </div>

      {/* EMO Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEMOs.map((emo) => (
          <div key={emo.id} className="bg-slate-900 rounded-2xl border border-slate-800 p-5 shadow-lg flex flex-col justify-between hover:border-slate-700 transition-all">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-mono font-bold px-2.5 py-1 bg-slate-800 text-emerald-400 rounded-md border border-slate-700">
                  {emo.codigoEMO}
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase ${
                  emo.estado === 'CERTIFICADO_EMITIDO'
                    ? 'bg-emerald-950/80 text-emerald-300 border-emerald-800'
                    : emo.estado === 'EN_PROCESO'
                    ? 'bg-amber-950/80 text-amber-300 border-amber-800'
                    : 'bg-blue-950/80 text-blue-300 border-blue-800'
                }`}>
                  {emo.estado.replace('_', ' ')}
                </span>
              </div>

              <div className="mb-3">
                <div className="text-xs font-semibold text-slate-400">Tipo de Examen:</div>
                <div className="text-sm font-bold text-white flex items-center gap-1.5 mt-0.5">
                  <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 text-xs rounded border border-emerald-500/30 font-bold">
                    EMO {emo.tipoEMO}
                  </span>
                </div>
              </div>

              <div className="space-y-2 text-xs bg-slate-800/60 p-3 rounded-xl border border-slate-800/80 mb-4">
                <div className="font-semibold text-slate-200">{getTrabajadorNombre(emo.trabajadorId)}</div>
                <div className="text-slate-400 text-[11px]">Empresa: {getEmpresaNombre(emo.empresaId)}</div>
                <div className="text-slate-400 text-[11px]">Protocolo: {emo.protocoloAplicado}</div>
                <div className="text-slate-400 text-[11px]">Fecha Programada: {emo.fechaProgramada}</div>
              </div>

              {/* Component checklist summary */}
              <div className="mb-4">
                <div className="text-[10px] uppercase font-bold text-slate-400 mb-1">Pruebas Componentes a Realizar (RM 312-2011):</div>
                <div className="grid grid-cols-3 gap-1 text-[9px] text-slate-300">
                  <span className={`p-1 rounded border text-center font-medium ${emo.evaluaciones?.triaje !== false ? 'bg-slate-800 border-emerald-500/40 text-emerald-300' : 'bg-slate-900 border-slate-800 text-slate-500 line-through'}`}>Triaje ✓</span>
                  <span className={`p-1 rounded border text-center font-medium ${emo.evaluaciones?.medicinaGeneral !== false ? 'bg-slate-800 border-emerald-500/40 text-emerald-300' : 'bg-slate-900 border-slate-800 text-slate-500 line-through'}`}>Medicina ✓</span>
                  <span className={`p-1 rounded border text-center font-medium ${emo.evaluaciones?.audiometria !== false ? 'bg-slate-800 border-emerald-500/40 text-emerald-300' : 'bg-slate-900 border-slate-800 text-slate-500 line-through'}`}>Audiometría ✓</span>
                  <span className={`p-1 rounded border text-center font-medium ${emo.evaluaciones?.espirometria !== false ? 'bg-slate-800 border-emerald-500/40 text-emerald-300' : 'bg-slate-900 border-slate-800 text-slate-500 line-through'}`}>Espirometría ✓</span>
                  <span className={`p-1 rounded border text-center font-medium ${emo.evaluaciones?.radiografiaOIT !== false ? 'bg-slate-800 border-emerald-500/40 text-emerald-300' : 'bg-slate-900 border-slate-800 text-slate-500 line-through'}`}>Rx OIT ✓</span>
                  <span className={`p-1 rounded border text-center font-medium ${emo.evaluaciones?.psicologia !== false ? 'bg-slate-800 border-emerald-500/40 text-emerald-300' : 'bg-slate-900 border-slate-800 text-slate-500 line-through'}`}>Psicología ✓</span>
                </div>
              </div>
            </div>

            {/* Footer Action */}
            <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setEditingEMO(JSON.parse(JSON.stringify(emo)))}
                  className="px-2.5 py-1.5 bg-indigo-600/20 hover:bg-indigo-600/40 text-indigo-300 rounded-lg font-semibold text-xs flex items-center gap-1 border border-indigo-500/30 transition-all"
                  title="Editar trabajador, tipo de examen o fechas"
                >
                  <Edit3 className="w-3.5 h-3.5 text-indigo-400" /> Editar EMO
                </button>

                <button
                  type="button"
                  onClick={() => setDeletingEMOModal({ open: true, emo })}
                  className="p-1.5 bg-rose-500/10 hover:bg-rose-500 text-rose-400 hover:text-white rounded-lg border border-rose-500/20 text-xs transition-colors"
                  title="Eliminar este EMO o eliminar al trabajador"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              <button
                onClick={() => onOpenAptitudModal(emo)}
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-semibold text-xs flex items-center gap-1 shadow-md shadow-emerald-900/30 transition-all"
              >
                <Award className="w-3.5 h-3.5" /> Dictaminar Aptitud
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Schedule EMO */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-hidden">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-xl max-h-[90vh] flex flex-col shadow-2xl text-slate-100 overflow-hidden my-auto">
            <div className="p-4 sm:p-5 border-b border-slate-800 shrink-0 flex items-center justify-between">
              <h3 className="text-lg font-bold font-display text-white flex items-center gap-2">
                <Stethoscope className="w-5 h-5 text-emerald-400" /> Programar Examen Médico Ocupacional (EMO)
              </h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800">✕</button>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden min-h-0">
              <div className="p-4 sm:p-5 overflow-y-auto space-y-4 text-xs flex-1">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Seleccionar Trabajador:*</label>
                  <select
                    value={formData.trabajadorId}
                    onChange={(e) => setFormData({ ...formData, trabajadorId: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white font-semibold focus:outline-none focus:border-emerald-500"
                  >
                    {trabajadores.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.apellidoPaterno} {t.nombres} ({t.numeroDocumento}) - {t.puestoTrabajo}
                      </option>
                    ))}
                  </select>
                </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Tipo de EMO</label>
                  <select
                    value={formData.tipoEMO}
                    onChange={(e) => setFormData({ ...formData, tipoEMO: e.target.value as any })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="INGRESO">INGRESO (Pre-ocupacional)</option>
                    <option value="PERIODICO">PERIÓDICO (Anual / Bienal)</option>
                    <option value="RETIRO">RETIRO (Egreso)</option>
                    <option value="REUBICACION">REUBICACIÓN / CAMBIO PUESTO</option>
                    <option value="POST_INCAPACIDAD">POST INCAPACIDAD (&gt;30 días)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Fecha Programada</label>
                  <input
                    type="date"
                    required
                    value={formData.fechaProgramada}
                    onChange={(e) => setFormData({ ...formData, fechaProgramada: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Protocolo Examen Aplicable (RM 312-2011)</label>
                <input
                  type="text"
                  required
                  value={formData.protocoloAplicado}
                  onChange={(e) => setFormData({ ...formData, protocoloAplicado: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
              </div>

              <div className="p-4 sm:p-5 border-t border-slate-800 flex justify-end gap-3 shrink-0 bg-slate-900">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg font-medium"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-semibold shadow-lg shadow-emerald-900/30"
                >
                  Confirmar Programación EMO
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Edit EMO */}
      {editingEMO && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-hidden">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-xl max-h-[90vh] flex flex-col shadow-2xl text-slate-100 overflow-hidden my-auto">
            <div className="p-4 sm:p-5 border-b border-slate-800 shrink-0 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-indigo-500/10 text-indigo-400 rounded-xl border border-indigo-500/20">
                  <Edit3 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white font-display">
                    Editar Examen Médico Ocupacional ({editingEMO.codigoEMO})
                  </h3>
                  <p className="text-xs text-slate-400">
                    Modifique el trabajador asignado, tipo de EMO, fechas, estado o protocolo.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setEditingEMO(null)}
                className="p-1.5 bg-slate-800 text-slate-400 hover:text-white rounded-lg border border-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (editingEMO && onUpdateEMO) {
                  onUpdateEMO(editingEMO);
                  setEditingEMO(null);
                }
              }}
              className="flex flex-col flex-1 overflow-hidden min-h-0 text-xs"
            >
              <div className="p-4 sm:p-5 overflow-y-auto space-y-4 flex-1">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Trabajador Asignado:
                </label>
                <select
                  value={editingEMO.trabajadorId}
                  onChange={(e) => {
                    const newTrabId = e.target.value;
                    const selectedTrab = trabajadores.find(t => t.id === newTrabId);
                    setEditingEMO({
                      ...editingEMO,
                      trabajadorId: newTrabId,
                      empresaId: selectedTrab ? selectedTrab.empresaId : editingEMO.empresaId
                    });
                  }}
                  className="w-full bg-slate-800 border border-indigo-500/50 rounded-lg p-2 text-white font-semibold focus:outline-none focus:border-indigo-400"
                >
                  {trabajadores.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.apellidoPaterno} {t.apellidoMaterno}, {t.nombres} ({t.tipoDocumento}: {t.numeroDocumento}) - {t.puestoTrabajo}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Tipo de Examen EMO:
                  </label>
                  <select
                    value={editingEMO.tipoEMO}
                    onChange={(e) => setEditingEMO({
                      ...editingEMO,
                      tipoEMO: e.target.value as any
                    })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white font-semibold focus:outline-none focus:border-indigo-500"
                  >
                    <option value="INGRESO">INGRESO (Pre-ocupacional)</option>
                    <option value="PERIODICO">PERIÓDICO (Anual / Bienal)</option>
                    <option value="RETIRO">RETIRO (Egreso)</option>
                    <option value="REUBICACION">REUBICACIÓN / CAMBIO PUESTO</option>
                    <option value="POST_INCAPACIDAD">POST INCAPACIDAD (&gt;30 días)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Estado del EMO:
                  </label>
                  <select
                    value={editingEMO.estado}
                    onChange={(e) => setEditingEMO({
                      ...editingEMO,
                      estado: e.target.value as any
                    })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white font-semibold focus:outline-none focus:border-indigo-500"
                  >
                    <option value="PROGRAMADO">PROGRAMADO</option>
                    <option value="EN_PROCESO">EN PROCESO</option>
                    <option value="OBSERVADO">OBSERVADO</option>
                    <option value="CONCLUIDO">CONCLUIDO</option>
                    <option value="CERTIFICADO_EMITIDO">CERTIFICADO EMITIDO</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Fecha Programada:</label>
                  <input
                    type="date"
                    required
                    value={editingEMO.fechaProgramada}
                    onChange={(e) => setEditingEMO({
                      ...editingEMO,
                      fechaProgramada: e.target.value
                    })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white font-semibold focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Fecha Realizada (opcional):</label>
                  <input
                    type="date"
                    value={editingEMO.fechaRealizada || ''}
                    onChange={(e) => setEditingEMO({
                      ...editingEMO,
                      fechaRealizada: e.target.value
                    })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-slate-300 font-medium mb-1">Protocolo Examen Aplicable (RM 312-2011):</label>
                  <input
                    type="text"
                    required
                    value={editingEMO.protocoloAplicado}
                    onChange={(e) => setEditingEMO({
                      ...editingEMO,
                      protocoloAplicado: e.target.value
                    })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Costo EMO (S/.):</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={editingEMO.costoEMO}
                    onChange={(e) => setEditingEMO({
                      ...editingEMO,
                      costoEMO: parseFloat(e.target.value) || 0
                    })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white font-mono focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-2">
                <label className="block text-xs font-bold text-slate-300">
                  Pruebas y Evaluaciones Componentes (RM 312-2011):
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-slate-300">
                  {Object.entries({
                    triaje: 'Triaje',
                    medicinaGeneral: 'Medicina General',
                    audiometria: 'Audiometría',
                    espirometria: 'Espirometría',
                    radiografiaOIT: 'Rx OIT',
                    laboratorio: 'Laboratorio',
                    psicologia: 'Psicología',
                    oftalmologia: 'Oftalmología',
                    electrocardiograma: 'Electrocardiograma'
                  }).map(([key, label]) => (
                    <label key={key} className="flex items-center gap-2 cursor-pointer bg-slate-900 px-2.5 py-1.5 rounded border border-slate-800 hover:border-slate-700">
                      <input
                        type="checkbox"
                        checked={Boolean(editingEMO.evaluaciones?.[key as keyof typeof editingEMO.evaluaciones])}
                        onChange={(e) => setEditingEMO({
                          ...editingEMO,
                          evaluaciones: {
                            ...editingEMO.evaluaciones,
                            [key]: e.target.checked
                          }
                        })}
                        className="rounded accent-indigo-500"
                      />
                      <span className="text-[11px] font-medium">{label}</span>
                    </label>
                  ))}
                </div>
              </div>
              </div>

              <div className="p-4 sm:p-5 border-t border-slate-800 flex justify-end gap-3 shrink-0 bg-slate-900">
                <button
                  type="button"
                  onClick={() => setEditingEMO(null)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg font-medium hover:bg-slate-700 transition-all"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-bold flex items-center gap-2 shadow-lg shadow-indigo-900/40 transition-all"
                >
                  <Save className="w-4 h-4" /> Guardar Cambios en EMO
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Deletion: EMO or Trabajador */}
      {deletingEMOModal.open && deletingEMOModal.emo && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl text-slate-100">
            <div className="flex items-start justify-between pb-3 border-b border-slate-800 mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-rose-500/10 text-rose-400 border border-rose-500/30 rounded-xl">
                  <Trash2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Eliminar Registro en EMO</h3>
                  <p className="text-[11px] text-slate-400">Seleccione la acción de eliminación que desea realizar.</p>
                </div>
              </div>
              <button
                onClick={() => setDeletingEMOModal({ open: false })}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-emerald-400 font-bold text-[11px]">{deletingEMOModal.emo.codigoEMO}</span>
                  <span className="px-2 py-0.5 bg-slate-800 text-slate-300 rounded text-[10px] font-bold">EMO {deletingEMOModal.emo.tipoEMO}</span>
                </div>
                <div className="font-bold text-white text-sm pt-1">
                  {getTrabajadorNombre(deletingEMOModal.emo.trabajadorId)}
                </div>
                <div className="text-slate-400 text-[11px]">
                  Fecha Programada: <span className="text-slate-200 font-medium">{deletingEMOModal.emo.fechaProgramada}</span>
                </div>
              </div>

              <p className="text-slate-300 leading-relaxed">
                ¿Qué desea eliminar del módulo de Exámenes Médicos Ocupacionales?
              </p>

              <div className="space-y-2.5 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    if (onDeleteEMO && deletingEMOModal.emo) {
                      onDeleteEMO(deletingEMOModal.emo.id);
                    }
                    setDeletingEMOModal({ open: false });
                  }}
                  className="w-full p-3 bg-slate-800 hover:bg-slate-700/80 border border-slate-700/80 rounded-xl text-left transition-all flex items-center justify-between group"
                >
                  <div>
                    <div className="font-bold text-white text-xs group-hover:text-emerald-300 flex items-center gap-1.5">
                      <Trash2 className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-400" />
                      Eliminar solo esta programación EMO
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5">
                      Mantiene al trabajador en el sistema y elimina únicamente este examen programado.
                    </div>
                  </div>
                  <span className="px-2 py-1 bg-slate-900 text-slate-300 rounded text-[10px] font-bold shrink-0">EMO</span>
                </button>

                {onDeleteTrabajador && (
                  <button
                    type="button"
                    onClick={() => {
                      if (onDeleteTrabajador && deletingEMOModal.emo) {
                        onDeleteTrabajador(deletingEMOModal.emo.trabajadorId);
                      }
                      setDeletingEMOModal({ open: false });
                    }}
                    className="w-full p-3 bg-rose-950/40 hover:bg-rose-900/60 border border-rose-800/60 rounded-xl text-left transition-all flex items-center justify-between group"
                  >
                    <div>
                      <div className="font-bold text-rose-200 text-xs flex items-center gap-1.5">
                        <UserMinus className="w-3.5 h-3.5 text-rose-400" />
                        Eliminar Trabajador de la Nómina
                      </div>
                      <div className="text-[11px] text-rose-300/70 mt-0.5">
                        Elimina permanentemente al trabajador y todas sus evaluaciones EMO asociadas.
                      </div>
                    </div>
                    <span className="px-2 py-1 bg-rose-950 text-rose-300 rounded text-[10px] font-bold shrink-0">TRABAJADOR</span>
                  </button>
                )}
              </div>

              <div className="flex items-center justify-end pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setDeletingEMOModal({ open: false })}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-semibold"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
