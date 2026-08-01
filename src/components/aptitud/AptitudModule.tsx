import React, { useState } from 'react';
import { EMOExam, Trabajador, Empresa, ResultadoAptitud } from '../../types/erp';
import { 
  Award, ShieldCheck, Printer, CheckCircle2, AlertTriangle, XCircle, FileText, 
  Plus, Trash2, Download, PenTool, FileCheck, Search, Filter, Edit3, User, 
  Building2, Eye, HelpCircle, Users, ChevronRight, AlertCircle, X, CheckSquare,
  FileSpreadsheet
} from 'lucide-react';
import { generarCertificadoAnexo3PDF, generarNotificacionRRHHPDF } from '../../utils/pdfGenerator';
import { exportConsolidadoAptitudExcel } from '../../utils/excelExporter';
import { SignatureCanvasModal } from '../common/SignatureCanvasModal';

interface AptitudModuleProps {
  emos: EMOExam[];
  trabajadores: Trabajador[];
  empresas: Empresa[];
  selectedEmoForAptitud?: EMOExam | null;
  onSaveAptitud: (
    emoId: string, 
    aptitudData: EMOExam['aptitud'], 
    workerIdForNewEmo?: string, 
    empresaIdForNewEmo?: string
  ) => void;
}

export const AptitudModule: React.FC<AptitudModuleProps> = ({
  emos,
  trabajadores,
  empresas,
  selectedEmoForAptitud,
  onSaveAptitud
}) => {
  // Navigation View Tab: 'consolidado' | 'emision'
  const [activeViewTab, setActiveViewTab] = useState<'consolidado' | 'emision'>('consolidado');

  // Active selected EMO for individual Certificate view
  const [activeEmoId, setActiveEmoId] = useState<string>(
    selectedEmoForAptitud?.id || emos[0]?.id || 'emo-1'
  );

  // Print Preview Toggle for Certificate Tab
  const [printPreview, setPrintPreview] = useState(false);
  const [showSignatureModal, setShowSignatureModal] = useState(false);
  const [firmaBase64, setFirmaBase64] = useState<string | undefined>(undefined);

  // Consolidado Filter & Search State
  const [searchTerm, setSearchTerm] = useState('');
  const [filterAptitud, setFilterAptitud] = useState<string>('TODOS');
  const [filterEmpresa, setFilterEmpresa] = useState<string>('TODAS');

  // Quick Edit Modal State for any worker
  const [editingWorkerId, setEditingWorkerId] = useState<string | null>(null);

  // Edit Form State (Used in both modal and individual certificate view)
  const [modalResultado, setModalResultado] = useState<ResultadoAptitud>('APTO');
  const [modalFechaEmision, setModalFechaEmision] = useState<string>('2026-07-29');
  const [modalFechaVencimiento, setModalFechaVencimiento] = useState<string>('2027-07-29');
  const [modalMotivoNoApto, setModalMotivoNoApto] = useState<string>('');
  const [modalRestricciones, setModalRestricciones] = useState<string[]>([]);
  const [modalNuevaRestriccion, setModalNuevaRestriccion] = useState('');
  const [modalRecomendaciones, setModalRecomendaciones] = useState<string[]>([]);
  const [modalNuevaRecomendacion, setModalNuevaRecomendacion] = useState('');
  const [modalMedicoFirmante, setModalMedicoFirmante] = useState('Dr. Alejandro Morales Ramos');
  const [modalCmpFirmante, setModalCmpFirmante] = useState('CMP 45120 / RNM 18920 (Especialista Medicina Ocupacional)');

  // Selected EMO for Emission tab
  const activeEmo = emos.find(e => e.id === activeEmoId) || emos[0];
  const activeTrabajador = trabajadores.find(t => t.id === activeEmo?.trabajadorId);
  const activeEmpresa = empresas.find(e => e.id === activeEmo?.empresaId);

  // Individual Form State for Certificate Tab
  const [indResultado, setIndResultado] = useState<ResultadoAptitud>(
    activeEmo?.aptitud?.resultado || 'APTO_CON_RESTRICCIONES'
  );
  const [indFechaEmision, setIndFechaEmision] = useState(
    activeEmo?.aptitud?.fechaEmision || '2026-07-28'
  );
  const [indFechaVencimiento, setIndFechaVencimiento] = useState(
    activeEmo?.aptitud?.fechaVencimiento || '2027-07-28'
  );
  const [indMotivoNoApto, setIndMotivoNoApto] = useState(
    activeEmo?.aptitud?.motivoNoApto || ''
  );
  const [indRestricciones, setIndRestricciones] = useState<string[]>(
    activeEmo?.aptitud?.restricciones || [
      'Uso obligatorio de doble protección auditiva (tapones silicona + orejeras NRR 29dB).',
      'Pausas activas ergonómicas de 5 minutos cada 2 horas de labor.'
    ]
  );
  const [indNuevaRestriccion, setIndNuevaRestriccion] = useState('');
  const [indRecomendaciones, setIndRecomendaciones] = useState<string[]>(
    activeEmo?.aptitud?.recomendaciones || [
      'Ingreso al Programa de Vigilancia Epidemiológica Auditiva.',
      'Control semestral de audiometría.'
    ]
  );
  const [indNuevaRecomendacion, setIndNuevaRecomendacion] = useState('');
  const [indMedicoFirmante, setIndMedicoFirmante] = useState(
    activeEmo?.aptitud?.medicoFirmante || 'Dr. Alejandro Morales Ramos'
  );
  const [indCmpFirmante, setIndCmpFirmante] = useState(
    activeEmo?.aptitud?.cmpFirmante || 'CMP 45120 / RNM 18920 (Especialista Medicina Ocupacional)'
  );

  // When activeEmo changes in certificate tab, update individual form
  const handleSelectEmo = (emoId: string) => {
    setActiveEmoId(emoId);
    const selected = emos.find(e => e.id === emoId);
    if (selected) {
      setIndResultado(selected.aptitud?.resultado || 'APTO');
      setIndFechaEmision(selected.aptitud?.fechaEmision || '2026-07-28');
      setIndFechaVencimiento(selected.aptitud?.fechaVencimiento || '2027-07-28');
      setIndMotivoNoApto(selected.aptitud?.motivoNoApto || '');
      setIndRestricciones(selected.aptitud?.restricciones || []);
      setIndRecomendaciones(selected.aptitud?.recomendaciones || []);
      setIndMedicoFirmante(selected.aptitud?.medicoFirmante || 'Dr. Alejandro Morales Ramos');
      setIndCmpFirmante(selected.aptitud?.cmpFirmante || 'CMP 45120 / RNM 18920');
    }
  };

  // Helper to get active EMO for a specific worker
  const getEmoForWorker = (workerId: string): EMOExam | undefined => {
    return emos.find(e => e.trabajadorId === workerId && e.aptitud) || emos.find(e => e.trabajadorId === workerId);
  };

  // Open Quick Edit Modal for any worker
  const handleOpenEditModal = (worker: Trabajador) => {
    setEditingWorkerId(worker.id);
    const workerEmo = getEmoForWorker(worker.id);

    if (workerEmo?.aptitud) {
      setModalResultado(workerEmo.aptitud.resultado);
      setModalFechaEmision(workerEmo.aptitud.fechaEmision || '2026-07-29');
      setModalFechaVencimiento(workerEmo.aptitud.fechaVencimiento || '2027-07-29');
      setModalMotivoNoApto(workerEmo.aptitud.motivoNoApto || '');
      setModalRestricciones([...workerEmo.aptitud.restricciones]);
      setModalRecomendaciones([...workerEmo.aptitud.recomendaciones]);
      setModalMedicoFirmante(workerEmo.aptitud.medicoFirmante || 'Dr. Alejandro Morales Ramos');
      setModalCmpFirmante(workerEmo.aptitud.cmpFirmante || 'CMP 45120 / RNM 18920');
    } else {
      // Defaults for worker without dictamen
      setModalResultado('APTO');
      setModalFechaEmision(new Date().toISOString().split('T')[0]);
      const nextYear = new Date();
      nextYear.setFullYear(nextYear.getFullYear() + 1);
      setModalFechaVencimiento(nextYear.toISOString().split('T')[0]);
      setModalMotivoNoApto('');
      setModalRestricciones([]);
      setModalRecomendaciones(['Ingreso a programa de vigilancia ocupacional según factor de riesgo.']);
      setModalMedicoFirmante('Dr. Alejandro Morales Ramos');
      setModalCmpFirmante('CMP 45120 / RNM 18920');
    }
  };

  // Save Modal Aptitud Data
  const handleSaveModalAptitud = () => {
    if (!editingWorkerId) return;
    const worker = trabajadores.find(t => t.id === editingWorkerId);
    if (!worker) return;

    const workerEmo = getEmoForWorker(editingWorkerId);
    const emoIdToSave = workerEmo?.id || `emo-new-${editingWorkerId}`;

    const aptitudObj = {
      resultado: modalResultado,
      fechaEmision: modalFechaEmision,
      fechaVencimiento: modalFechaVencimiento,
      restricciones: modalRestricciones,
      recomendaciones: modalRecomendaciones,
      vigilanciaSugerida: ['Vigilancia Epidemiológica Ocupacional'],
      motivoNoApto: modalResultado === 'NO_APTO' ? modalMotivoNoApto : undefined,
      medicoFirmante: modalMedicoFirmante,
      cmpFirmante: modalCmpFirmante
    };

    onSaveAptitud(emoIdToSave, aptitudObj, worker.id, worker.empresaId);
    setEditingWorkerId(null);
    alert(`Aptitud Médica Ocupacional para ${worker.apellidoPaterno} ${worker.nombres} dictaminada y guardada exitosamente.`);
  };

  // Save Individual Certificate View
  const handleSaveIndividual = () => {
    if (!activeEmo) return;
    const aptitudObj = {
      resultado: indResultado,
      fechaEmision: indFechaEmision,
      fechaVencimiento: indFechaVencimiento,
      restricciones: indRestricciones,
      recomendaciones: indRecomendaciones,
      vigilanciaSugerida: ['Vigilancia Epidemiológica Ocupacional'],
      motivoNoApto: indResultado === 'NO_APTO' ? indMotivoNoApto : undefined,
      medicoFirmante: indMedicoFirmante,
      cmpFirmante: indCmpFirmante
    };

    onSaveAptitud(activeEmo.id, aptitudObj);
    alert('Certificado de Aptitud Médica Ocupacional dictaminado y registrado con éxito.');
  };

  // Quick preset restrictions
  const PRESET_RESTRICCIONES = [
    'Uso obligatorio de doble protección auditiva (tapones silicona + orejeras NRR 29dB).',
    'Pausas activas ergonómicas de 5 minutos cada 2 horas de labor.',
    'No realizar trabajos en altura física ni estructural (>1.80 metros).',
    'Restricción para levantamiento manual de cargas superior a 15 kg.',
    'Uso permanente de lentes correctivos con protección lateral para visión cercana.',
    'No apto para conducción de vehículos pesados ni operación de maquinaria en movimiento.'
  ];

  // Quick preset recommendations
  const PRESET_RECOMENDACIONES = [
    'Ingreso al Programa de Vigilancia Epidemiológica de Conservación Auditiva.',
    'Evaluación médica y control audiométrico semestral.',
    'Programa de nutrición y control metabólico por IMC elevado.',
    'Inspección ergonómica del puesto de trabajo en planta.',
    'Uso continuo de respirador con filtros P100 contra material particulado.'
  ];

  // PDF Downloads
  const handleDownloadAnexo3PDFForWorker = (workerId: string) => {
    const emo = getEmoForWorker(workerId);
    const worker = trabajadores.find(t => t.id === workerId);
    const emp = empresas.find(e => e.id === worker?.empresaId);

    if (!worker || !emp) {
      alert('Información incompleta del trabajador o empresa');
      return;
    }

    const emoConAptitud: EMOExam = emo ? {
      ...emo,
      aptitud: emo.aptitud || {
        resultado: 'APTO',
        fechaEmision: new Date().toISOString().split('T')[0],
        fechaVencimiento: '2027-07-29',
        restricciones: [],
        recomendaciones: ['Control ocupacional anual'],
        vigilanciaSugerida: [],
        medicoFirmante: 'Dr. Alejandro Morales Ramos',
        cmpFirmante: 'CMP 45120'
      }
    } : {
      id: `emo-gen-${worker.id}`,
      codigoEMO: `EMO-${new Date().getFullYear()}-001`,
      trabajadorId: worker.id,
      empresaId: worker.empresaId,
      tipoEMO: 'PERIODICO',
      fechaProgramada: new Date().toISOString().split('T')[0],
      estado: 'CERTIFICADO_EMITIDO',
      protocoloAplicado: 'Protocolo General Ocupacional',
      costoEMO: 200,
      evaluaciones: { triaje: true, medicinaGeneral: true, audiometria: true, espirometria: true, radiografiaOIT: true, laboratorio: true, psicologia: true, oftalmologia: true, electrocardiograma: true },
      aptitud: {
        resultado: 'APTO',
        fechaEmision: new Date().toISOString().split('T')[0],
        fechaVencimiento: '2027-07-29',
        restricciones: [],
        recomendaciones: ['Control ocupacional anual'],
        vigilanciaSugerida: [],
        medicoFirmante: 'Dr. Alejandro Morales Ramos',
        cmpFirmante: 'CMP 45120'
      }
    };

    generarCertificadoAnexo3PDF(emoConAptitud, worker, emp, firmaBase64);
  };

  const handleDownloadNotificacionRRHHPDFForWorker = (workerId: string) => {
    const emo = getEmoForWorker(workerId);
    const worker = trabajadores.find(t => t.id === workerId);
    const emp = empresas.find(e => e.id === worker?.empresaId);

    if (!worker || !emp) {
      alert('Información incompleta para notificación RRHH');
      return;
    }

    const emoConAptitud: EMOExam = emo ? {
      ...emo,
      aptitud: emo.aptitud || {
        resultado: 'APTO',
        fechaEmision: new Date().toISOString().split('T')[0],
        fechaVencimiento: '2027-07-29',
        restricciones: [],
        recomendaciones: ['Control ocupacional anual'],
        vigilanciaSugerida: [],
        medicoFirmante: 'Dr. Alejandro Morales Ramos',
        cmpFirmante: 'CMP 45120'
      }
    } : {
      id: `emo-gen-${worker.id}`,
      codigoEMO: `EMO-${new Date().getFullYear()}-001`,
      trabajadorId: worker.id,
      empresaId: worker.empresaId,
      tipoEMO: 'PERIODICO',
      fechaProgramada: new Date().toISOString().split('T')[0],
      estado: 'CERTIFICADO_EMITIDO',
      protocoloAplicado: 'Protocolo General Ocupacional',
      costoEMO: 200,
      evaluaciones: { triaje: true, medicinaGeneral: true, audiometria: true, espirometria: true, radiografiaOIT: true, laboratorio: true, psicologia: true, oftalmologia: true, electrocardiograma: true },
      aptitud: {
        resultado: 'APTO',
        fechaEmision: new Date().toISOString().split('T')[0],
        fechaVencimiento: '2027-07-29',
        restricciones: [],
        recomendaciones: ['Control ocupacional anual'],
        vigilanciaSugerida: [],
        medicoFirmante: 'Dr. Alejandro Morales Ramos',
        cmpFirmante: 'CMP 45120'
      }
    };

    generarNotificacionRRHHPDF(emoConAptitud, worker, emp, firmaBase64);
  };

  // Filtered workers logic
  const filteredTrabajadores = trabajadores.filter(t => {
    const emo = getEmoForWorker(t.id);
    const resultado = emo?.aptitud?.resultado || 'SIN_EVALUACION';

    // Search filter
    const fullName = `${t.nombres} ${t.apellidoPaterno} ${t.apellidoMaterno}`.toLowerCase();
    const doc = t.numeroDocumento.toLowerCase();
    const puesto = t.puestoTrabajo.toLowerCase();
    const area = t.area.toLowerCase();
    const searchMatch = fullName.includes(searchTerm.toLowerCase()) || 
                         doc.includes(searchTerm.toLowerCase()) || 
                         puesto.includes(searchTerm.toLowerCase()) || 
                         area.includes(searchTerm.toLowerCase());

    // Aptitud filter
    const aptitudMatch = filterAptitud === 'TODOS' || resultado === filterAptitud;

    // Empresa filter
    const empresaMatch = filterEmpresa === 'TODAS' || t.empresaId === filterEmpresa;

    return searchMatch && aptitudMatch && empresaMatch;
  });

  // Calculate statistics across ALL registered workers
  const stats = trabajadores.reduce((acc, t) => {
    const emo = getEmoForWorker(t.id);
    const res = emo?.aptitud?.resultado;
    if (res === 'APTO') acc.aptos++;
    else if (res === 'APTO_CON_RESTRICCIONES') acc.aptosRestriccion++;
    else if (res === 'NO_APTO') acc.noAptos++;
    else if (res === 'EVALUADO_NO_CONCLUIDO') acc.noConcluidos++;
    else acc.sinEvaluacion++;
    return acc;
  }, { aptos: 0, aptosRestriccion: 0, noAptos: 0, noConcluidos: 0, sinEvaluacion: 0 });

  return (
    <div className="space-y-6">
      {/* Top Header & Tab Navigation */}
      <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold uppercase rounded tracking-wider">
              Sistema de Salud Ocupacional • R.M. 312-2011-MINSA (Anexo 03) & Ley N° 29783
            </span>
          </div>
          <h2 className="text-xl font-bold text-white font-display flex items-center gap-2">
            <Award className="w-6 h-6 text-emerald-400" /> Dictamen y Consolidado de Aptitud Médica
          </h2>
        </div>

        {/* Tab Switchers */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setActiveViewTab('consolidado')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
              activeViewTab === 'consolidado'
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-950 border border-emerald-500'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700'
            }`}
          >
            <Users className="w-4 h-4" /> Consolidado General ({trabajadores.length})
          </button>

          <button
            onClick={() => setActiveViewTab('emision')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
              activeViewTab === 'emision'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-950 border border-indigo-500'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700'
            }`}
          >
            <FileText className="w-4 h-4" /> Certificado Anexo 03 Individual
          </button>

          <button
            onClick={() => setShowSignatureModal(true)}
            className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all"
            title="Firmar digitalmente certificados en memoria"
          >
            <PenTool className="w-4 h-4 text-emerald-400" /> {firmaBase64 ? 'Firma ✓' : 'Firma Digital'}
          </button>

          <button
            onClick={() => exportConsolidadoAptitudExcel(filteredTrabajadores, emos, empresas)}
            className="px-3 py-2 bg-emerald-700 hover:bg-emerald-600 text-white border border-emerald-500/50 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md shadow-emerald-950 transition-all"
            title="Descargar Matriz Consolidada de Aptitud de todos los trabajadores en Excel"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-200" /> Exportar Excel (.xlsx)
          </button>
        </div>
      </div>

      {/* VIEW 1: CONSOLIDADO GENERAL DE APTITUD DE TODOS LOS TRABAJADORES */}
      {activeViewTab === 'consolidado' && (
        <div className="space-y-6">
          {/* Metrics Overview Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            <div className="bg-slate-900/90 p-4 rounded-xl border border-slate-800 shadow-sm">
              <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
                <span>Total Registrados</span>
                <Users className="w-4 h-4 text-slate-400" />
              </div>
              <div className="text-2xl font-black text-white mt-1">{trabajadores.length}</div>
              <div className="text-[10px] text-slate-500 mt-0.5">Trabajadores en nómina</div>
            </div>

            <div className="bg-emerald-950/40 p-4 rounded-xl border border-emerald-800/40 shadow-sm">
              <div className="flex items-center justify-between text-emerald-300 text-xs font-semibold">
                <span>Aptos</span>
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-2xl font-black text-emerald-400 mt-1">{stats.aptos}</div>
              <div className="text-[10px] text-emerald-300/80 mt-0.5">Sin restricciones</div>
            </div>

            <div className="bg-amber-950/40 p-4 rounded-xl border border-amber-800/40 shadow-sm">
              <div className="flex items-center justify-between text-amber-300 text-xs font-semibold">
                <span>Con Restricción</span>
                <AlertTriangle className="w-4 h-4 text-amber-400" />
              </div>
              <div className="text-2xl font-black text-amber-400 mt-1">{stats.aptosRestriccion}</div>
              <div className="text-[10px] text-amber-300/80 mt-0.5">Requieren adecuación EPP/puesto</div>
            </div>

            <div className="bg-rose-950/40 p-4 rounded-xl border border-rose-800/40 shadow-sm">
              <div className="flex items-center justify-between text-rose-300 text-xs font-semibold">
                <span>No Aptos</span>
                <XCircle className="w-4 h-4 text-rose-400" />
              </div>
              <div className="text-2xl font-black text-rose-400 mt-1">{stats.noAptos}</div>
              <div className="text-[10px] text-rose-300/80 mt-0.5">Incompatibilidad médica</div>
            </div>

            <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-700/60 shadow-sm col-span-2 sm:col-span-1">
              <div className="flex items-center justify-between text-slate-300 text-xs font-semibold">
                <span>Pendientes / No Concl.</span>
                <HelpCircle className="w-4 h-4 text-slate-400" />
              </div>
              <div className="text-2xl font-black text-slate-300 mt-1">{stats.noConcluidos + stats.sinEvaluacion}</div>
              <div className="text-[10px] text-slate-400 mt-0.5">En proceso o por evaluar</div>
            </div>
          </div>

          {/* Search & Filtering Bar */}
          <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 flex flex-col md:flex-row gap-3 justify-between items-center">
            {/* Search Input */}
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar por Nombre, DNI, Cargo o Área..."
                className="w-full bg-slate-800 border border-slate-700/80 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* Filters */}
            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
              {/* Aptitud filter */}
              <div className="flex items-center gap-1.5 text-xs text-slate-300">
                <Filter className="w-3.5 h-3.5 text-slate-400" />
                <span className="font-semibold text-[11px]">Aptitud:</span>
                <select
                  value={filterAptitud}
                  onChange={(e) => setFilterAptitud(e.target.value)}
                  className="bg-slate-800 border border-slate-700/80 rounded-lg px-2.5 py-1 text-xs text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="TODOS">Todas las Aptitudes</option>
                  <option value="APTO">APTO (Sin Restricciones)</option>
                  <option value="APTO_CON_RESTRICCIONES">APTO CON RESTRICCIONES</option>
                  <option value="NO_APTO">NO APTO</option>
                  <option value="EVALUADO_NO_CONCLUIDO">EVALUADO NO CONCLUIDO</option>
                  <option value="SIN_EVALUACION">SIN EVALUACIÓN / PENDIENTE</option>
                </select>
              </div>

              {/* Empresa filter */}
              <div className="flex items-center gap-1.5 text-xs text-slate-300">
                <Building2 className="w-3.5 h-3.5 text-slate-400" />
                <span className="font-semibold text-[11px]">Empresa:</span>
                <select
                  value={filterEmpresa}
                  onChange={(e) => setFilterEmpresa(e.target.value)}
                  className="bg-slate-800 border border-slate-700/80 rounded-lg px-2.5 py-1 text-xs text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="TODAS">Todas las Empresas</option>
                  {empresas.map(emp => (
                    <option key={emp.id} value={emp.id}>{emp.razonSocial}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Consolidated Workers Table */}
          <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
            <div className="p-4 bg-slate-800/50 border-b border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" /> Consolidado Ocupacional de Trabajadores y Aptitud Médica
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Mostrando {filteredTrabajadores.length} de {trabajadores.length} trabajadores registrados
                </p>
              </div>

              <button
                onClick={() => exportConsolidadoAptitudExcel(filteredTrabajadores, emos, empresas)}
                className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-md shadow-emerald-950/80 border border-emerald-400/40 transition-all shrink-0"
                title="Descargar reporte completo en formato Microsoft Excel"
              >
                <FileSpreadsheet className="w-4 h-4 text-emerald-100" /> Descargar Matriz Consolidada (Excel)
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950 text-slate-400 uppercase font-mono text-[10px] tracking-wider border-b border-slate-800">
                  <tr>
                    <th className="py-3.5 px-4">Trabajador / Documento</th>
                    <th className="py-3.5 px-4">Puesto / Área / Empresa</th>
                    <th className="py-3.5 px-4 text-center">Dictamen de Aptitud</th>
                    <th className="py-3.5 px-4">Restricciones Operativas</th>
                    <th className="py-3.5 px-4">Motivo / Causa Médica (Si NO APTO)</th>
                    <th className="py-3.5 px-4 text-center">Acciones / Edición</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-sans">
                  {filteredTrabajadores.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-slate-500">
                        No se encontraron trabajadores que coincidan con los criterios de búsqueda.
                      </td>
                    </tr>
                  ) : (
                    filteredTrabajadores.map((t) => {
                      const emo = getEmoForWorker(t.id);
                      const empresa = empresas.find(e => e.id === t.empresaId);
                      const aptitud = emo?.aptitud;
                      const resultado = aptitud?.resultado || 'SIN_EVALUACION';

                      return (
                        <tr key={t.id} className="hover:bg-slate-800/40 transition-colors">
                          {/* Worker Details */}
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-slate-200 text-xs shrink-0">
                                {t.nombres.charAt(0)}{t.apellidoPaterno.charAt(0)}
                              </div>
                              <div>
                                <div className="font-bold text-white text-xs">
                                  {t.apellidoPaterno} {t.apellidoMaterno}, {t.nombres}
                                </div>
                                <div className="text-[11px] font-mono text-slate-400 flex items-center gap-1.5 mt-0.5">
                                  <span>{t.tipoDocumento}: <strong>{t.numeroDocumento}</strong></span>
                                  <span>•</span>
                                  <span className="text-slate-500">{t.telefono}</span>
                                </div>
                              </div>
                            </div>
                          </td>

                          {/* Job & Company */}
                          <td className="py-3.5 px-4">
                            <div className="font-semibold text-slate-200">{t.puestoTrabajo}</div>
                            <div className="text-[10px] text-slate-400 mt-0.5">
                              Área: <span className="text-slate-300 font-medium">{t.area}</span>
                            </div>
                            <div className="text-[10px] text-emerald-400/90 font-mono mt-0.5">
                              {empresa?.razonSocial || 'Empresa Principal'}
                            </div>
                          </td>

                          {/* Aptitud Status Badge */}
                          <td className="py-3.5 px-4 text-center">
                            {resultado === 'APTO' && (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 rounded-lg text-[11px] font-bold shadow-sm">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> APTO
                              </span>
                            )}
                            {resultado === 'APTO_CON_RESTRICCIONES' && (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-950/80 border border-amber-500/50 text-amber-300 rounded-lg text-[11px] font-bold shadow-sm">
                                <AlertTriangle className="w-3.5 h-3.5 text-amber-400" /> CON RESTRICCIONES
                              </span>
                            )}
                            {resultado === 'NO_APTO' && (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-rose-950/80 border border-rose-500/50 text-rose-300 rounded-lg text-[11px] font-bold shadow-sm animate-pulse">
                                <XCircle className="w-3.5 h-3.5 text-rose-400" /> NO APTO
                              </span>
                            )}
                            {resultado === 'EVALUADO_NO_CONCLUIDO' && (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-sky-950/80 border border-sky-500/50 text-sky-300 rounded-lg text-[11px] font-bold">
                                <FileText className="w-3.5 h-3.5 text-sky-400" /> NO CONCLUIDO
                              </span>
                            )}
                            {resultado === 'SIN_EVALUACION' && (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-800 border border-slate-700 text-slate-400 rounded-lg text-[11px] font-medium">
                                <HelpCircle className="w-3.5 h-3.5 text-slate-500" /> SIN EVALUACIÓN
                              </span>
                            )}

                            {aptitud?.fechaVencimiento && (
                              <div className="text-[9px] text-slate-500 font-mono mt-1">
                                Venc: {aptitud.fechaVencimiento}
                              </div>
                            )}
                          </td>

                          {/* Restricciones Column */}
                          <td className="py-3.5 px-4 max-w-xs">
                            {aptitud?.restricciones && aptitud.restricciones.length > 0 ? (
                              <ul className="space-y-1">
                                {aptitud.restricciones.map((r, idx) => (
                                  <li key={idx} className="bg-amber-950/40 text-amber-200 border border-amber-800/40 p-1.5 rounded text-[10px] leading-tight flex items-start gap-1">
                                    <span className="text-amber-400 font-bold">•</span>
                                    <span>{r}</span>
                                  </li>
                                ))}
                              </ul>
                            ) : (
                              <span className="text-slate-500 italic text-[11px]">Sin restricciones registradas</span>
                            )}
                          </td>

                          {/* Motivo de No Aptitud (Special Focus Column) */}
                          <td className="py-3.5 px-4 max-w-xs">
                            {resultado === 'NO_APTO' ? (
                              <div className="bg-rose-950/60 border border-rose-800/80 p-2.5 rounded-xl space-y-1">
                                <div className="text-[10px] uppercase font-bold text-rose-300 flex items-center gap-1">
                                  <AlertCircle className="w-3.5 h-3.5 text-rose-400" /> Causa / Motivo de No Aptitud:
                                </div>
                                <p className="text-[11px] text-rose-100 font-medium leading-normal">
                                  {aptitud?.motivoNoApto || (
                                    <span className="italic text-rose-300/70">
                                      Sin motivo especificado aún. Haz clic en "Editar Aptitud" para registrar la causa médica.
                                    </span>
                                  )}
                                </p>
                              </div>
                            ) : (
                              <span className="text-slate-500 text-[11px]">N/A (Apto / En proceso)</span>
                            )}
                          </td>

                          {/* Actions */}
                          <td className="py-3.5 px-4 text-center">
                            <div className="flex items-center justify-center gap-1.5">
                              {/* Quick Edit Button */}
                              <button
                                onClick={() => handleOpenEditModal(t)}
                                className="px-2.5 py-1.5 bg-emerald-600/90 hover:bg-emerald-500 text-white rounded-lg text-[11px] font-bold flex items-center gap-1 shadow transition-all"
                                title="Editar aptitud, restricciones o motivo de no aptitud"
                              >
                                <Edit3 className="w-3.5 h-3.5" /> Editar
                              </button>

                              {/* PDF Anexo 03 Button */}
                              <button
                                onClick={() => handleDownloadAnexo3PDFForWorker(t.id)}
                                className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-[11px]"
                                title="Descargar Certificado Anexo 03 en PDF"
                              >
                                <Download className="w-3.5 h-3.5 text-emerald-400" />
                              </button>

                              {/* Carta RRHH Button */}
                              <button
                                onClick={() => handleDownloadNotificacionRRHHPDFForWorker(t.id)}
                                className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-[11px]"
                                title="Descargar Carta Notificación RRHH / SST"
                              >
                                <FileCheck className="w-3.5 h-3.5 text-sky-400" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: DICTAMEN INDIVIDUAL Y CERTIFICADO ANEXO 03 */}
      {activeViewTab === 'emision' && (
        <div className="space-y-6">
          {/* Top Controls Bar for Individual Certificate */}
          <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">Seleccionar EMO:</span>
              <select
                value={activeEmoId}
                onChange={(e) => handleSelectEmo(e.target.value)}
                className="bg-slate-800 border border-slate-700/80 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500 font-semibold max-w-md"
              >
                {emos.map((e) => {
                  const trab = trabajadores.find(t => t.id === e.trabajadorId);
                  return (
                    <option key={e.id} value={e.id}>
                      {e.codigoEMO} - {trab?.apellidoPaterno} {trab?.nombres} ({e.tipoEMO}) - {e.aptitud?.resultado || 'SIN RESULTADO'}
                    </option>
                  );
                })}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setPrintPreview(!printPreview)}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all"
              >
                <Printer className="w-4 h-4 text-emerald-400" /> {printPreview ? 'Modo Edición' : 'Vista Previa Oficial'}
              </button>

              <button
                onClick={() => {
                  if (activeEmo && activeTrabajador) {
                    handleDownloadAnexo3PDFForWorker(activeTrabajador.id);
                  }
                }}
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-emerald-950 transition-all"
              >
                <Download className="w-4 h-4" /> PDF Anexo 03
              </button>

              <button
                onClick={() => {
                  if (activeTrabajador) {
                    handleDownloadNotificacionRRHHPDFForWorker(activeTrabajador.id);
                  }
                }}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all"
              >
                <FileCheck className="w-4 h-4 text-sky-400" /> Notificación RRHH
              </button>
            </div>
          </div>

          {printPreview ? (
            /* Printable Anexo 03 Sheet */
            <div className="bg-white text-slate-900 p-8 rounded-2xl shadow-2xl border border-slate-300 max-w-4xl mx-auto space-y-6 font-serif">
              <div className="text-center border-b-2 border-slate-900 pb-4">
                <div className="text-xs font-bold uppercase tracking-widest text-slate-600">REPÚBLICA DEL PERÚ • MINISTERIO DE SALUD</div>
                <h1 className="text-xl font-extrabold uppercase tracking-tight text-slate-900 mt-1">
                  CERTIFICADO DE APTITUD MÉDICA OCUPACIONAL
                </h1>
                <div className="text-xs font-sans font-semibold text-slate-600">Anexo N° 03 - R.M. N° 312-2011/MINSA</div>
                <div className="text-sm font-mono font-bold text-slate-800 mt-2">CÓDIGO EMO: {activeEmo?.codigoEMO}</div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs font-sans border p-4 rounded bg-slate-50 border-slate-300">
                <div>
                  <strong>Empresa Empleadora:</strong> {activeEmpresa?.razonSocial}<br />
                  <strong>RUC:</strong> {activeEmpresa?.ruc} | <strong>CIIU:</strong> {activeEmpresa?.ciiu}<br />
                  <strong>Actividad Económica:</strong> {activeEmpresa?.actividadEconomica}
                </div>
                <div>
                  <strong>Trabajador:</strong> {activeTrabajador?.apellidoPaterno} {activeTrabajador?.apellidoMaterno}, {activeTrabajador?.nombres}<br />
                  <strong>Documento:</strong> {activeTrabajador?.tipoDocumento} {activeTrabajador?.numeroDocumento}<br />
                  <strong>Puesto de Trabajo:</strong> {activeTrabajador?.puestoTrabajo}
                </div>
              </div>

              {/* Dictamen Box */}
              <div className="border-2 border-slate-900 p-4 text-center rounded bg-emerald-50/50">
                <div className="text-xs uppercase tracking-wider font-sans font-bold text-slate-600">DICTAMEN DE APTITUD MÉDICA OCUPACIONAL</div>
                <div className="text-2xl font-black font-sans uppercase my-2 text-emerald-800">
                  {indResultado.replace('_', ' ')}
                </div>
                <div className="text-xs font-sans text-slate-600">
                  Vigencia desde: <strong>{indFechaEmision}</strong> hasta <strong>{indFechaVencimiento}</strong>
                </div>
              </div>

              {/* If NO APTO, Motivo */}
              {indResultado === 'NO_APTO' && indMotivoNoApto && (
                <div className="font-sans text-xs border border-rose-300 bg-rose-50 p-3 rounded">
                  <h4 className="font-bold text-rose-900 uppercase">MOTIVO CLÍNICO / OCUPACIONAL DE NO APTITUD:</h4>
                  <p className="text-rose-800 mt-1 font-medium">{indMotivoNoApto}</p>
                </div>
              )}

              {/* Restricciones */}
              <div className="font-sans text-xs space-y-2">
                <h4 className="font-bold uppercase tracking-wider border-b pb-1 border-slate-300">
                  RESTRICCIONES OPERATIVAS (Para conocimiento del Empleador y SST - Ley N° 29783):
                </h4>
                {indRestricciones.length > 0 ? (
                  <ul className="list-disc list-inside space-y-1 text-slate-800 font-medium">
                    {indRestricciones.map((r, i) => (
                      <li key={i}>{r}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="italic text-slate-500">Sin restricciones para el desempeño del puesto.</p>
                )}
              </div>

              {/* Recomendaciones */}
              <div className="font-sans text-xs space-y-2">
                <h4 className="font-bold uppercase tracking-wider border-b pb-1 border-slate-300">
                  RECOMENDACIONES MÉDICO OCUPACIONALES:
                </h4>
                <ul className="list-disc list-inside space-y-1 text-slate-800">
                  {indRecomendaciones.map((rec, i) => (
                    <li key={i}>{rec}</li>
                  ))}
                </ul>
              </div>

              {/* Signature Stamp */}
              <div className="pt-8 grid grid-cols-2 gap-8 text-center font-sans text-xs">
                <div>
                  <div className="border-t border-slate-400 pt-2 font-bold text-slate-700">
                    Firma y Huella del Trabajador
                  </div>
                  <div className="text-[10px] text-slate-500 mt-1">DNI {activeTrabajador?.numeroDocumento}</div>
                </div>

                <div>
                  <div className="border-2 border-emerald-800 p-2 rounded inline-block bg-emerald-50/30">
                    <div className="font-bold text-emerald-900">{indMedicoFirmante}</div>
                    <div className="text-[10px] font-mono font-bold text-emerald-800">{indCmpFirmante}</div>
                    <div className="text-[9px] text-slate-500 mt-1">Firma Digital & Sello Médico Ocupacional</div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Form View for Individual Certificate */
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 lg:col-span-2 space-y-6">
                <div className="border-b border-slate-800 pb-4">
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Award className="w-5 h-5 text-emerald-400" /> Dictaminar Certificado de Aptitud
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Evaluación de: <strong className="text-white">{activeTrabajador?.apellidoPaterno} {activeTrabajador?.nombres}</strong> ({activeTrabajador?.puestoTrabajo})
                  </p>
                </div>

                {/* Aptitud Options */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                    Resultado de Aptitud (R.M. 312-2011 Anexo 3)
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <button
                      type="button"
                      onClick={() => setIndResultado('APTO')}
                      className={`p-3 rounded-xl border font-bold flex items-center gap-2.5 transition-all ${
                        indResultado === 'APTO'
                          ? 'bg-emerald-950 border-emerald-500 text-emerald-300 shadow-md shadow-emerald-950'
                          : 'bg-slate-800/60 border-slate-700 text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      <CheckCircle2 className="w-5 h-5 text-emerald-400" /> APTO (Sin restricciones)
                    </button>

                    <button
                      type="button"
                      onClick={() => setIndResultado('APTO_CON_RESTRICCIONES')}
                      className={`p-3 rounded-xl border font-bold flex items-center gap-2.5 transition-all ${
                        indResultado === 'APTO_CON_RESTRICCIONES'
                          ? 'bg-amber-950 border-amber-500 text-amber-300 shadow-md shadow-amber-950'
                          : 'bg-slate-800/60 border-slate-700 text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      <AlertTriangle className="w-5 h-5 text-amber-400" /> APTO CON RESTRICCIONES
                    </button>

                    <button
                      type="button"
                      onClick={() => setIndResultado('EVALUADO_NO_CONCLUIDO')}
                      className={`p-3 rounded-xl border font-bold flex items-center gap-2.5 transition-all ${
                        indResultado === 'EVALUADO_NO_CONCLUIDO'
                          ? 'bg-blue-950 border-blue-500 text-blue-300 shadow-md shadow-blue-950'
                          : 'bg-slate-800/60 border-slate-700 text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      <FileText className="w-5 h-5 text-blue-400" /> EVALUADO NO CONCLUIDO
                    </button>

                    <button
                      type="button"
                      onClick={() => setIndResultado('NO_APTO')}
                      className={`p-3 rounded-xl border font-bold flex items-center gap-2.5 transition-all ${
                        indResultado === 'NO_APTO'
                          ? 'bg-rose-950 border-rose-500 text-rose-300 shadow-md shadow-rose-950'
                          : 'bg-slate-800/60 border-slate-700 text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      <XCircle className="w-5 h-5 text-rose-400" /> NO APTO
                    </button>
                  </div>
                </div>

                {/* Motivo de No Aptitud Field (if NO_APTO) */}
                {indResultado === 'NO_APTO' && (
                  <div className="bg-rose-950/40 p-4 rounded-xl border border-rose-800/70 space-y-2">
                    <label className="block text-xs font-bold text-rose-300 uppercase tracking-wider">
                      Motivo / Causa Médica Ocupacional de No Aptitud:
                    </label>
                    <textarea
                      rows={3}
                      value={indMotivoNoApto}
                      onChange={(e) => setIndMotivoNoApto(e.target.value)}
                      placeholder="Escriba detalladamente la justificación médica o patología que determina la NO APTITUD (ej: Hipertensión severa descompensada, Síndrome vertiginoso en altura, etc.)..."
                      className="w-full bg-slate-900 border border-rose-700 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-rose-500"
                    />
                  </div>
                )}

                {/* Dates */}
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block text-slate-300 font-medium mb-1">Fecha de Emisión</label>
                    <input
                      type="date"
                      value={indFechaEmision}
                      onChange={(e) => setIndFechaEmision(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-medium mb-1">Fecha de Vencimiento</label>
                    <input
                      type="date"
                      value={indFechaVencimiento}
                      onChange={(e) => setIndFechaVencimiento(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                {/* Restricciones Builder */}
                <div>
                  <label className="block text-xs font-bold text-amber-400 uppercase tracking-wider mb-2">
                    Restricciones Operativas para el Puesto (Ley N° 29783)
                  </label>
                  <div className="space-y-2 mb-3">
                    {indRestricciones.map((r, idx) => (
                      <div key={idx} className="bg-slate-800 p-2.5 rounded-lg border border-slate-700 flex items-center justify-between text-xs text-slate-200">
                        <span>{r}</span>
                        <button
                          type="button"
                          onClick={() => setIndRestricciones(indRestricciones.filter((_, i) => i !== idx))}
                          className="text-rose-400 hover:text-rose-300 p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={indNuevaRestriccion}
                      onChange={(e) => setIndNuevaRestriccion(e.target.value)}
                      placeholder="Agregar restricción..."
                      className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-amber-500"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (indNuevaRestriccion.trim()) {
                          setIndRestricciones([...indRestricciones, indNuevaRestriccion.trim()]);
                          setIndNuevaRestriccion('');
                        }
                      }}
                      className="px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-white font-semibold rounded-lg text-xs flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" /> Agregar
                    </button>
                  </div>
                </div>

                {/* Save */}
                <div className="pt-4 border-t border-slate-800 flex justify-end">
                  <button
                    type="button"
                    onClick={handleSaveIndividual}
                    className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs flex items-center gap-2 shadow-lg shadow-emerald-900/40 transition-all"
                  >
                    <ShieldCheck className="w-4 h-4" /> Firmar & Guardar Certificado
                  </button>
                </div>
              </div>

              {/* Doctor info sidebar */}
              <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 space-y-4">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">Médico Ocupacional Firmante</h4>
                <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700 text-xs space-y-2">
                  <div>
                    <label className="block text-slate-400 text-[10px] mb-0.5">Médico Responsable:</label>
                    <input
                      type="text"
                      value={indMedicoFirmante}
                      onChange={(e) => setIndMedicoFirmante(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded p-1.5 text-white font-semibold"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 text-[10px] mb-0.5">CMP / Registro Especialidad:</label>
                    <input
                      type="text"
                      value={indCmpFirmante}
                      onChange={(e) => setIndCmpFirmante(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded p-1.5 text-emerald-400 font-mono text-[11px]"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* QUICK EDIT MODAL FOR ANY WORKER */}
      {editingWorkerId && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-hidden">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-2xl max-h-[90vh] flex flex-col rounded-2xl shadow-2xl overflow-hidden my-auto">
            {/* Modal Header */}
            <div className="bg-slate-800/80 p-4 border-b border-slate-800 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-emerald-400" />
                <div>
                  <h3 className="text-sm font-bold text-white">Dictaminar / Editar Aptitud Médica</h3>
                  <div className="text-[11px] text-slate-400">
                    Trabajador: <strong className="text-slate-200">
                      {trabajadores.find(t => t.id === editingWorkerId)?.apellidoPaterno} {trabajadores.find(t => t.id === editingWorkerId)?.nombres}
                    </strong> (DNI: {trabajadores.find(t => t.id === editingWorkerId)?.numeroDocumento})
                  </div>
                </div>
              </div>
              <button
                onClick={() => setEditingWorkerId(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 sm:p-6 space-y-5 flex-1 overflow-y-auto">
              {/* Resultado Selection */}
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  Resultado de Aptitud (Anexo 03 R.M. 312-2011)
                </label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => setModalResultado('APTO')}
                    className={`p-3 rounded-xl border font-bold flex items-center gap-2 transition-all ${
                      modalResultado === 'APTO'
                        ? 'bg-emerald-950 border-emerald-500 text-emerald-300'
                        : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700'
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" /> APTO
                  </button>

                  <button
                    type="button"
                    onClick={() => setModalResultado('APTO_CON_RESTRICCIONES')}
                    className={`p-3 rounded-xl border font-bold flex items-center gap-2 transition-all ${
                      modalResultado === 'APTO_CON_RESTRICCIONES'
                        ? 'bg-amber-950 border-amber-500 text-amber-300'
                        : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700'
                    }`}
                  >
                    <AlertTriangle className="w-4 h-4 text-amber-400" /> APTO CON RESTRICCIONES
                  </button>

                  <button
                    type="button"
                    onClick={() => setModalResultado('NO_APTO')}
                    className={`p-3 rounded-xl border font-bold flex items-center gap-2 transition-all ${
                      modalResultado === 'NO_APTO'
                        ? 'bg-rose-950 border-rose-500 text-rose-300'
                        : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700'
                    }`}
                  >
                    <XCircle className="w-4 h-4 text-rose-400" /> NO APTO
                  </button>

                  <button
                    type="button"
                    onClick={() => setModalResultado('EVALUADO_NO_CONCLUIDO')}
                    className={`p-3 rounded-xl border font-bold flex items-center gap-2 transition-all ${
                      modalResultado === 'EVALUADO_NO_CONCLUIDO'
                        ? 'bg-sky-950 border-sky-500 text-sky-300'
                        : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700'
                    }`}
                  >
                    <FileText className="w-4 h-4 text-sky-400" /> EVALUADO NO CONCLUIDO
                  </button>
                </div>
              </div>

              {/* Motivo de No Aptitud (CRITICAL USER REQUIREMENT) */}
              {modalResultado === 'NO_APTO' && (
                <div className="bg-rose-950/40 p-4 rounded-xl border border-rose-800/80 space-y-2">
                  <label className="block text-xs font-bold text-rose-300 uppercase tracking-wider flex items-center gap-1.5">
                    <AlertCircle className="w-4 h-4 text-rose-400" /> Motivo / Causa Médica Ocupacional de No Aptitud:
                  </label>
                  <textarea
                    rows={3}
                    value={modalMotivoNoApto}
                    onChange={(e) => setModalMotivoNoApto(e.target.value)}
                    placeholder="Describa la causa clínica, diagnóstico CIE-10 o motivo por el cual el trabajador NO se encuentra apto para su puesto de trabajo..."
                    className="w-full bg-slate-900 border border-rose-700/80 rounded-lg p-2.5 text-xs text-white placeholder-rose-300/40 focus:outline-none focus:border-rose-500"
                  />
                  <div className="text-[10px] text-rose-300/80">
                    * Esta información fundamenta el dictamen de No Aptitud según la R.M. 312-2011/MINSA.
                  </div>
                </div>
              )}

              {/* Dates */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Fecha de Emisión</label>
                  <input
                    type="date"
                    value={modalFechaEmision}
                    onChange={(e) => setModalFechaEmision(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Fecha de Vencimiento</label>
                  <input
                    type="date"
                    value={modalFechaVencimiento}
                    onChange={(e) => setModalFechaVencimiento(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Restricciones Builder */}
              <div>
                <label className="block text-xs font-bold text-amber-400 uppercase tracking-wider mb-2">
                  Restricciones Operativas (Ley N° 29783 / SST)
                </label>
                
                {/* List of current restrictions */}
                <div className="space-y-1.5 mb-3">
                  {modalRestricciones.map((r, idx) => (
                    <div key={idx} className="bg-slate-800/90 p-2 rounded-lg border border-slate-700 flex items-center justify-between text-xs text-slate-200">
                      <span className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                        {r}
                      </span>
                      <button
                        type="button"
                        onClick={() => setModalRestricciones(modalRestricciones.filter((_, i) => i !== idx))}
                        className="text-rose-400 hover:text-rose-300 p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Input to add restriction */}
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={modalNuevaRestriccion}
                    onChange={(e) => setModalNuevaRestriccion(e.target.value)}
                    placeholder="Escriba una restricción personalizada..."
                    className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (modalNuevaRestriccion.trim()) {
                        setModalRestricciones([...modalRestricciones, modalNuevaRestriccion.trim()]);
                        setModalNuevaRestriccion('');
                      }
                    }}
                    className="px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-white font-semibold rounded-lg text-xs flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" /> Agregar
                  </button>
                </div>

                {/* Preset Suggestions */}
                <div className="space-y-1">
                  <span className="text-[10px] text-slate-400 font-semibold uppercase">Plantillas Rápidas de Restricción:</span>
                  <div className="flex flex-wrap gap-1">
                    {PRESET_RESTRICCIONES.map((preset, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          if (!modalRestricciones.includes(preset)) {
                            setModalRestricciones([...modalRestricciones, preset]);
                          }
                        }}
                        className="px-2 py-0.5 bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-800/30 rounded text-[10px] text-left transition-colors"
                      >
                        + {preset.substring(0, 45)}...
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Recomendaciones Builder */}
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  Recomendaciones Médico Ocupacionales
                </label>
                <div className="space-y-1.5 mb-3">
                  {modalRecomendaciones.map((rec, idx) => (
                    <div key={idx} className="bg-slate-800/90 p-2 rounded-lg border border-slate-700 flex items-center justify-between text-xs text-slate-200">
                      <span>{rec}</span>
                      <button
                        type="button"
                        onClick={() => setModalRecomendaciones(modalRecomendaciones.filter((_, i) => i !== idx))}
                        className="text-rose-400 hover:text-rose-300 p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={modalNuevaRecomendacion}
                    onChange={(e) => setModalNuevaRecomendacion(e.target.value)}
                    placeholder="Agregar recomendación..."
                    className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (modalNuevaRecomendacion.trim()) {
                        setModalRecomendaciones([...modalRecomendaciones, modalNuevaRecomendacion.trim()]);
                        setModalNuevaRecomendacion('');
                      }
                    }}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-emerald-400 font-semibold rounded-lg text-xs flex items-center gap-1 border border-slate-700"
                  >
                    <Plus className="w-3.5 h-3.5" /> Agregar
                  </button>
                </div>
              </div>

              {/* Doctor Info */}
              <div className="grid grid-cols-2 gap-3 text-xs bg-slate-950 p-3 rounded-xl border border-slate-800">
                <div>
                  <label className="block text-slate-400 text-[10px] mb-0.5">Médico Ocupacional:</label>
                  <input
                    type="text"
                    value={modalMedicoFirmante}
                    onChange={(e) => setModalMedicoFirmante(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded p-1.5 text-white font-semibold text-xs"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 text-[10px] mb-0.5">CMP / Colegiatura:</label>
                  <input
                    type="text"
                    value={modalCmpFirmante}
                    onChange={(e) => setModalCmpFirmante(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded p-1.5 text-emerald-400 font-mono text-xs"
                  />
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="bg-slate-800/80 p-4 border-t border-slate-800 flex items-center justify-end gap-3 shrink-0">
              <button
                type="button"
                onClick={() => setEditingWorkerId(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold rounded-xl text-xs transition-colors"
              >
                Cancelar
              </button>

              <button
                type="button"
                onClick={handleSaveModalAptitud}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-lg shadow-emerald-950 transition-all"
              >
                <ShieldCheck className="w-4 h-4" /> Guardar Dictamen de Aptitud
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Signature Canvas Modal */}
      <SignatureCanvasModal
        isOpen={showSignatureModal}
        onClose={() => setShowSignatureModal(false)}
        onSaveSignature={(sig) => {
          setFirmaBase64(sig);
          alert('Firma digital capturada y almacenada en memoria para estampación en PDF.');
        }}
        title="Captura de Firma Digital - Médico Ocupacional"
        subtitle={`Firmante: ${indMedicoFirmante} (${indCmpFirmante})`}
      />
    </div>
  );
};
