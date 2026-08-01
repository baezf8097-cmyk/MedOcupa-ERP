import React, { useState } from 'react';
import { ProgramaVigilancia, Empresa, Trabajador, CategoriaProgramaVigilancia, CapacitacionProgramaVigilancia, EvidenciaCapacitacion } from '../../types/erp';
import { 
  Activity, Users, AlertTriangle, CheckCircle2, ShieldAlert, Search, Plus, 
  Filter, FileText, Ear, Wind, Brain, HeartPulse, ShieldCheck, Biohazard, 
  FlaskConical, Sun, Flame, Stethoscope, X, ChevronRight, Download, Edit3, 
  UserPlus, Eye, Building2, Calendar, Award, Trash2, GraduationCap, Upload, 
  Paperclip, Clock, Image as ImageIcon
} from 'lucide-react';

interface VigilanciaModuleProps {
  programas: ProgramaVigilancia[];
  empresas?: Empresa[];
  trabajadores?: Trabajador[];
  selectedEmpresaId?: string;
  onAddPrograma?: (newPrograma: ProgramaVigilancia) => void;
  onUpdatePrograma?: (updatedPrograma: ProgramaVigilancia) => void;
  onDeletePrograma?: (id: string) => void;
}

export const VigilanciaModule: React.FC<VigilanciaModuleProps> = ({
  programas,
  empresas = [],
  trabajadores = [],
  selectedEmpresaId = 'TODAS',
  onAddPrograma,
  onUpdatePrograma,
  onDeletePrograma
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('TODAS');
  const [selectedApplicability, setSelectedApplicability] = useState<string>('TODAS');
  
  // Modals state
  const [cohortModalProg, setCohortModalProg] = useState<ProgramaVigilancia | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingProg, setEditingProg] = useState<ProgramaVigilancia | null>(null);
  const [deletingProg, setDeletingProg] = useState<ProgramaVigilancia | null>(null);

  // New program form state
  const [formData, setFormData] = useState<Partial<ProgramaVigilancia>>({
    nombrePrograma: '',
    codigoPrograma: 'PV-00',
    categoria: 'GENERAL',
    descripcion: '',
    baseLegal: 'R.M. 312-2011-MINSA / Ley 29783',
    medicoResponsable: 'Dr. Alejandro Morales Ramos (CMP 45120)',
    poblacionExpuestaTotal: 100,
    trabajadoresEnVigilancia: 100,
    casosSospechosos: 0,
    casosConfirmados: 0,
    metaCumplimientoPorcentaje: 100,
    avanceActualPorcentaje: 0,
    estado: 'ACTIVO',
    aplicaSegunRiesgo: false,
    periodicidadEvaluacion: 'Anual',
    indicadoresClave: ['Cobertura de Monitoreo', 'Casos Controlados']
  });

  // Capacitaciones states
  const [capacitacionesModalProg, setCapacitacionesModalProg] = useState<ProgramaVigilancia | null>(null);
  const [isCapacitacionFormOpen, setIsCapacitacionFormOpen] = useState(false);
  const [editingCapacitacion, setEditingCapacitacion] = useState<CapacitacionProgramaVigilancia | null>(null);
  const [deletingCapacitacion, setDeletingCapacitacion] = useState<CapacitacionProgramaVigilancia | null>(null);
  const [previewEvidencia, setPreviewEvidencia] = useState<EvidenciaCapacitacion | null>(null);

  // Capacitación form state
  const [capFormData, setCapFormData] = useState<Partial<CapacitacionProgramaVigilancia>>({
    nombre: '',
    fecha: new Date().toISOString().split('T')[0],
    horasLectivas: 2,
    instructor: '',
    observaciones: '',
    evidencias: []
  });
  const [tempEvidencias, setTempEvidencias] = useState<EvidenciaCapacitacion[]>([]);

  const formatBytes = (bytes?: number) => {
    if (!bytes) return '';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const handleOpenAddCapacitacion = () => {
    setEditingCapacitacion(null);
    setCapFormData({
      nombre: '',
      fecha: new Date().toISOString().split('T')[0],
      horasLectivas: 2,
      instructor: 'Dr. Alejandro Morales Ramos (CMP 45120)',
      observaciones: '',
      evidencias: []
    });
    setTempEvidencias([]);
    setIsCapacitacionFormOpen(true);
  };

  const handleOpenEditCapacitacion = (cap: CapacitacionProgramaVigilancia) => {
    setEditingCapacitacion(cap);
    setCapFormData(cap);
    setTempEvidencias(cap.evidencias || []);
    setIsCapacitacionFormOpen(true);
  };

  const handleFileUploadTemp = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    (Array.from(files) as File[]).forEach((file: File) => {
      const reader = new FileReader();
      reader.onload = () => {
        const dataUrl = reader.result as string;
        const newEv: EvidenciaCapacitacion = {
          id: `ev-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
          nombreArchivo: file.name,
          dataUrl,
          tipoArchivo: file.type || (file.name.endsWith('.pdf') ? 'application/pdf' : 'image/png'),
          tamanioBytes: file.size,
          fechaSubida: new Date().toISOString().split('T')[0]
        };
        setTempEvidencias(prev => [...prev, newEv]);
      };
      reader.readAsDataURL(file);
    });
    e.target.value = '';
  };

  const handleFileUploadDirect = (e: React.ChangeEvent<HTMLInputElement>, capId: string) => {
    const files = e.target.files;
    if (!files || files.length === 0 || !capacitacionesModalProg) return;

    (Array.from(files) as File[]).forEach((file: File) => {
      const reader = new FileReader();
      reader.onload = () => {
        const dataUrl = reader.result as string;
        const newEv: EvidenciaCapacitacion = {
          id: `ev-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
          nombreArchivo: file.name,
          dataUrl,
          tipoArchivo: file.type || (file.name.endsWith('.pdf') ? 'application/pdf' : 'image/png'),
          tamanioBytes: file.size,
          fechaSubida: new Date().toISOString().split('T')[0]
        };

        setCapacitacionesModalProg(prev => {
          if (!prev) return null;
          const updatedCaps = (prev.capacitaciones || []).map(c => {
            if (c.id === capId) {
              return {
                ...c,
                evidencias: [...(c.evidencias || []), newEv]
              };
            }
            return c;
          });
          const updatedProg = { ...prev, capacitaciones: updatedCaps };
          if (onUpdatePrograma) {
            onUpdatePrograma(updatedProg);
          }
          return updatedProg;
        });
      };
      reader.readAsDataURL(file);
    });
    e.target.value = '';
  };

  const handleSaveCapacitacionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!capacitacionesModalProg || !capFormData.nombre) return;

    let updatedCapList: CapacitacionProgramaVigilancia[] = capacitacionesModalProg.capacitaciones || [];

    if (editingCapacitacion) {
      updatedCapList = updatedCapList.map(c => {
        if (c.id === editingCapacitacion.id) {
          return {
            ...c,
            nombre: capFormData.nombre || 'Capacitación SST',
            fecha: capFormData.fecha || new Date().toISOString().split('T')[0],
            horasLectivas: Number(capFormData.horasLectivas) || 0,
            instructor: capFormData.instructor || '',
            observaciones: capFormData.observaciones || '',
            evidencias: tempEvidencias
          };
        }
        return c;
      });
    } else {
      const newCap: CapacitacionProgramaVigilancia = {
        id: `cap-${Date.now()}`,
        nombre: capFormData.nombre || 'Capacitación SST',
        fecha: capFormData.fecha || new Date().toISOString().split('T')[0],
        horasLectivas: Number(capFormData.horasLectivas) || 0,
        instructor: capFormData.instructor || '',
        observaciones: capFormData.observaciones || '',
        evidencias: tempEvidencias
      };
      updatedCapList = [newCap, ...updatedCapList];
    }

    const updatedProg = {
      ...capacitacionesModalProg,
      capacitaciones: updatedCapList
    };

    setCapacitacionesModalProg(updatedProg);
    if (onUpdatePrograma) {
      onUpdatePrograma(updatedProg);
    }

    setIsCapacitacionFormOpen(false);
    setEditingCapacitacion(null);
  };

  const handleDeleteCapacitacionConfirm = () => {
    if (!capacitacionesModalProg || !deletingCapacitacion) return;

    const updatedCaps = (capacitacionesModalProg.capacitaciones || []).filter(c => c.id !== deletingCapacitacion.id);
    const updatedProg = { ...capacitacionesModalProg, capacitaciones: updatedCaps };

    setCapacitacionesModalProg(updatedProg);
    if (onUpdatePrograma) {
      onUpdatePrograma(updatedProg);
    }
    setDeletingCapacitacion(null);
  };

  const handleDeleteEvidenciaDirect = (capId: string, evId: string) => {
    if (!capacitacionesModalProg) return;

    const updatedCaps = (capacitacionesModalProg.capacitaciones || []).map(c => {
      if (c.id === capId) {
        return {
          ...c,
          evidencias: (c.evidencias || []).filter(e => e.id !== evId)
        };
      }
      return c;
    });

    const updatedProg = { ...capacitacionesModalProg, capacitaciones: updatedCaps };
    setCapacitacionesModalProg(updatedProg);
    if (onUpdatePrograma) {
      onUpdatePrograma(updatedProg);
    }
  };

  const handleDownloadEvidenciaFile = (ev: EvidenciaCapacitacion) => {
    const link = document.createElement('a');
    link.href = ev.dataUrl;
    link.download = ev.nombreArchivo;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filter programs based on selected company and controls
  const filteredProgramas = programas.filter(prog => {
    // Company filter
    if (selectedEmpresaId !== 'TODAS' && prog.empresaId && prog.empresaId !== selectedEmpresaId) {
      return false;
    }

    // Search query
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      const matchName = prog.nombrePrograma.toLowerCase().includes(q);
      const matchCode = prog.codigoPrograma?.toLowerCase().includes(q) || false;
      const matchMedico = prog.medicoResponsable.toLowerCase().includes(q);
      const matchLegal = prog.baseLegal?.toLowerCase().includes(q) || false;
      if (!matchName && !matchCode && !matchMedico && !matchLegal) return false;
    }

    // Category filter
    if (selectedCategory !== 'TODAS') {
      if (prog.categoria !== selectedCategory) return false;
    }

    // Applicability filter
    if (selectedApplicability === 'GENERALES') {
      if (prog.aplicaSegunRiesgo) return false;
    } else if (selectedApplicability === 'ESPECIFICOS') {
      if (!prog.aplicaSegunRiesgo) return false;
    }

    return true;
  });

  // KPI Calculations
  const totalProgramas = filteredProgramas.length;
  const totalExpuestos = filteredProgramas.reduce((acc, curr) => acc + curr.poblacionExpuestaTotal, 0);
  const totalEnVigilancia = filteredProgramas.reduce((acc, curr) => acc + curr.trabajadoresEnVigilancia, 0);
  const totalSospechosos = filteredProgramas.reduce((acc, curr) => acc + curr.casosSospechosos, 0);
  const totalConfirmados = filteredProgramas.reduce((acc, curr) => acc + curr.casosConfirmados, 0);
  const promedioAvance = totalProgramas > 0 
    ? (filteredProgramas.reduce((acc, curr) => acc + curr.avanceActualPorcentaje, 0) / totalProgramas).toFixed(1)
    : '0';

  // Helper icon selector based on program name
  const getProgramIcon = (nombre: string) => {
    const n = nombre.toLowerCase();
    if (n.includes('auditiv') || n.includes('ruido')) return <Ear className="w-5 h-5 text-amber-400" />;
    if (n.includes('respirator') || n.includes('neumoconiosis')) return <Wind className="w-5 h-5 text-sky-400" />;
    if (n.includes('musculoesquelét') || n.includes('ergonomía') || n.includes('ergonomico')) return <Activity className="w-5 h-5 text-purple-400" />;
    if (n.includes('psicosocial') || n.includes('estrés')) return <Brain className="w-5 h-5 text-pink-400" />;
    if (n.includes('vida saludable') || n.includes('saludable')) return <HeartPulse className="w-5 h-5 text-rose-400" />;
    if (n.includes('promoción de la salud') || n.includes('promocion')) return <Award className="w-5 h-5 text-emerald-400" />;
    if (n.includes('inmunizaciones') || n.includes('vacun')) return <ShieldCheck className="w-5 h-5 text-teal-400" />;
    if (n.includes('biológi') || n.includes('biologico')) return <Biohazard className="w-5 h-5 text-orange-400" />;
    if (n.includes('químic') || n.includes('quimico')) return <FlaskConical className="w-5 h-5 text-indigo-400" />;
    if (n.includes('radiacion') || n.includes('radiaciones')) return <Sun className="w-5 h-5 text-yellow-400" />;
    if (n.includes('térmico') || n.includes('termico') || n.includes('calor')) return <Flame className="w-5 h-5 text-red-400" />;
    return <Stethoscope className="w-5 h-5 text-emerald-400" />;
  };

  // Preset program templates for quick addition
  const PROGRAM_TEMPLATES = [
    { nombre: 'Programa de Vigilancia Médica Ocupacional', codigo: 'PVO-01', cat: 'GENERAL', base: 'R.M. 312-2011-MINSA / Ley 29783', desc: 'Vigilancia médica integral mediante evaluaciones pre-ocupacionales, periódicas y de retiro.', riesgo: false },
    { nombre: 'Programa de Conservación Auditiva', codigo: 'PCA-02', cat: 'ESPECIFICO_EXPOSICION', base: 'R.M. 312-2011-MINSA / R.M. 375-2008-TR', desc: 'Monitoreo audiométrico seriado, dosimetría de ruido laboral (>85 dBA) y prevención de HIR.', riesgo: false },
    { nombre: 'Programa de Prevención de Trastornos Musculoesqueléticos (Ergonomía)', codigo: 'PME-03', cat: 'ESPECIFICO_EXPOSICION', base: 'R.M. 375-2008-TR (Norma Básica de Ergonomía)', desc: 'Evaluación ergonómica (REBA, RULA, OWAS, NIOSH), pausas activas y prevención de TME.', riesgo: false },
    { nombre: 'Programa de Vigilancia de Riesgo Psicosocial', codigo: 'PRP-04', cat: 'GENERAL', base: 'Ley 29783 / R.M. 312-2011-MINSA', desc: 'Evaluación de factores psicosociales (SUSESO-ISTAS 21), prevención del estrés laboral y burnout.', riesgo: false },
    { nombre: 'Programa de Vida Saludable', codigo: 'PVS-05', cat: 'SALUD_Y_BIENESTAR', base: 'Ley 30021 / R.M. 312-2011-MINSA', desc: 'Detección de síndrome metabólico, sobrepeso, obesidad, hipertensión y diabetes.', riesgo: false },
    { nombre: 'Programa de Promoción de la Salud', codigo: 'PPS-06', cat: 'SALUD_Y_BIENESTAR', base: 'Ley 29783 Art. 36 / D.S. 005-2012-TR', desc: 'Talleres educativos, pausas saludables, campañas contra adicciones y fomento de hábitos sanos.', riesgo: false },
    { nombre: 'Programa de Inmunizaciones', codigo: 'PIN-07', cat: 'GENERAL', base: 'Norma Técnica Vacunación MINSA / D.S. 005-2012-TR', desc: 'Garantía del esquema de vacunación ocupacional (Hepatitis B, Tétanos, Influenza, Neumococo).', riesgo: false },
    { nombre: 'Programa de Prevención de Enfermedades Respiratorias (cuando aplique)', codigo: 'PER-08', cat: 'ESPECIFICO_EXPOSICION', base: 'R.M. 312-2011-MINSA Anexo 01', desc: 'Prevención de silicosis y neumoconiosis mediante espirometría y radiografía OIT.', riesgo: true },
    { nombre: 'Programa de Control de Riesgos Biológicos (si aplica)', codigo: 'PRB-09', cat: 'ESPECIFICO_EXPOSICION', base: 'R.M. 312-2011-MINSA / D.S. 015-2005-SA', desc: 'Vigilancia para personal expuesto a agentes biológicos, fluidos corporales o picaduras.', riesgo: true },
    { nombre: 'Programa de Vigilancia por Exposición a Agentes Químicos (si aplica)', codigo: 'PAQ-10', cat: 'ESPECIFICO_EXPOSICION', base: 'D.S. 015-2005-SA (Valores Límite Agentes Químicos)', desc: 'Monitoreo biológico de exposición a solventes, metales pesados y plaguicidas.', riesgo: true },
    { nombre: 'Programa de Vigilancia por Exposición a Radiaciones (si aplica)', codigo: 'PVR-11', cat: 'ESPECIFICO_EXPOSICION', base: 'Ley 28028 / Norma Técnica IPEN', desc: 'Control dosimétrico personal de radiaciones ionizantes y protección UV solar en campo.', riesgo: true },
    { nombre: 'Programa de Vigilancia por Estrés Térmico (si aplica)', codigo: 'PET-12', cat: 'ESPECIFICO_EXPOSICION', base: 'R.M. 375-2008-TR (Índice WBGT/TGBH)', desc: 'Control de exposición a calor/frío extremo, régimen de hidratación y aclimatación.', riesgo: true }
  ];

  const handleApplyPreset = (template: typeof PROGRAM_TEMPLATES[0]) => {
    setFormData(prev => ({
      ...prev,
      nombrePrograma: template.nombre,
      codigoPrograma: template.codigo,
      categoria: template.cat as CategoriaProgramaVigilancia,
      baseLegal: template.base,
      descripcion: template.desc,
      aplicaSegunRiesgo: template.riesgo
    }));
  };

  const handleSubmitNewProgram = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nombrePrograma) return;

    const newProg: ProgramaVigilancia = {
      id: editingProg ? editingProg.id : `prog-${Date.now()}`,
      empresaId: selectedEmpresaId !== 'TODAS' ? selectedEmpresaId : 'emp-1',
      nombrePrograma: formData.nombrePrograma || 'Nuevo Programa de Vigilancia',
      codigoPrograma: formData.codigoPrograma || 'PV-01',
      categoria: formData.categoria || 'GENERAL',
      descripcion: formData.descripcion || 'Descripción del programa de vigilancia ocupacional.',
      baseLegal: formData.baseLegal || 'R.M. 312-2011-MINSA',
      medicoResponsable: formData.medicoResponsable || 'Dr. Médico Ocupacional (CMP 00000)',
      poblacionExpuestaTotal: Number(formData.poblacionExpuestaTotal) || 0,
      trabajadoresEnVigilancia: Number(formData.trabajadoresEnVigilancia) || 0,
      casosSospechosos: Number(formData.casosSospechosos) || 0,
      casosConfirmados: Number(formData.casosConfirmados) || 0,
      metaCumplimientoPorcentaje: Number(formData.metaCumplimientoPorcentaje) || 100,
      avanceActualPorcentaje: Number(formData.avanceActualPorcentaje) || 0,
      estado: formData.estado || 'ACTIVO',
      aplicaSegunRiesgo: formData.aplicaSegunRiesgo || false,
      periodicidadEvaluacion: formData.periodicidadEvaluacion || 'Anual',
      indicadoresClave: formData.indicadoresClave || ['Monitoreo Continuo']
    };

    if (editingProg && onUpdatePrograma) {
      onUpdatePrograma(newProg);
    } else if (onAddPrograma) {
      onAddPrograma(newProg);
    }

    setIsAddModalOpen(false);
    setEditingProg(null);
  };

  return (
    <div className="space-y-6">
      {/* HEADER BAR */}
      <div className="bg-slate-950 p-6 rounded-xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span className="px-2.5 py-0.5 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-[10px] font-semibold tracking-wider rounded-full uppercase">
              R.M. 312-2011-MINSA
            </span>
            <span className="px-2.5 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-semibold tracking-wider rounded-full uppercase">
              R.M. 375-2008-TR Ergonomía
            </span>
            <span className="px-2.5 py-0.5 bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[10px] font-semibold tracking-wider rounded-full uppercase">
              Ley 29783 SST
            </span>
          </div>
          <h2 className="text-xl font-bold text-white font-sans flex items-center gap-2.5">
            <Activity className="w-6 h-6 text-indigo-400" />
            Programas de Vigilancia Epidemiológica Ocupacional
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-3xl">
            Monitoreo dinámico de cohortes ocupacionales y vigilancia especializada de salud según normativa peruana (Médica, Auditiva, Ergonómica, Psicosocial, Respiratoria, Química, Biológica, Radiaciones, Estrés Térmico e Inmunizaciones).
          </p>
        </div>

        <button
          onClick={() => {
            setEditingProg(null);
            setFormData({
              nombrePrograma: '',
              codigoPrograma: 'PV-01',
              categoria: 'GENERAL',
              descripcion: '',
              baseLegal: 'R.M. 312-2011-MINSA / Ley 29783',
              medicoResponsable: 'Dr. Alejandro Morales Ramos (CMP 45120)',
              poblacionExpuestaTotal: 100,
              trabajadoresEnVigilancia: 100,
              casosSospechosos: 0,
              casosConfirmados: 0,
              metaCumplimientoPorcentaje: 100,
              avanceActualPorcentaje: 0,
              estado: 'ACTIVO',
              aplicaSegunRiesgo: false,
              periodicidadEvaluacion: 'Anual'
            });
            setIsAddModalOpen(true);
          }}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs rounded-lg shadow-sm transition-colors shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Nuevo Programa de Vigilancia</span>
        </button>
      </div>

      {/* KPI METRICS SUMMARY BAR */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
          <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Programas Activos</div>
          <div className="text-xl font-bold text-white mt-1">{totalProgramas} <span className="text-xs font-normal text-slate-400">programas</span></div>
        </div>

        <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
          <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Población Expuesta</div>
          <div className="text-xl font-bold text-slate-200 mt-1">{totalExpuestos.toLocaleString()} <span className="text-xs font-normal text-slate-400">pers.</span></div>
        </div>

        <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
          <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">En Vigilancia Activa</div>
          <div className="text-xl font-bold text-emerald-400 mt-1">{totalEnVigilancia.toLocaleString()} <span className="text-xs font-normal text-slate-400">pers.</span></div>
        </div>

        <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
          <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Casos Sospechosos</div>
          <div className="text-xl font-bold text-amber-400 mt-1">{totalSospechosos} <span className="text-xs font-normal text-slate-400">casos</span></div>
        </div>

        <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
          <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Casos Confirmados</div>
          <div className="text-xl font-bold text-rose-400 mt-1">{totalConfirmados} <span className="text-xs font-normal text-slate-400">casos</span></div>
        </div>

        <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
          <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Cumplimiento Promedio</div>
          <div className="text-xl font-bold text-indigo-400 mt-1">{promedioAvance}%</div>
        </div>
      </div>

      {/* FILTER & CONTROLS */}
      <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col md:flex-row gap-4 items-center justify-between">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por programa, código o norma..."
            className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
          />
        </div>

        {/* Categories Tabs & Filters */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-lg border border-slate-800 text-xs">
            <button
              onClick={() => setSelectedCategory('TODAS')}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                selectedCategory === 'TODAS'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Todos (12)
            </button>
            <button
              onClick={() => setSelectedCategory('GENERAL')}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                selectedCategory === 'GENERAL'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Generales
            </button>
            <button
              onClick={() => setSelectedCategory('ESPECIFICO_EXPOSICION')}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                selectedCategory === 'ESPECIFICO_EXPOSICION'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Exposición
            </button>
            <button
              onClick={() => setSelectedCategory('SALUD_Y_BIENESTAR')}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                selectedCategory === 'SALUD_Y_BIENESTAR'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Salud & Bienestar
            </button>
          </div>

          <select
            value={selectedApplicability}
            onChange={(e) => setSelectedApplicability(e.target.value)}
            className="bg-slate-900 border border-slate-800 text-slate-300 text-xs rounded-lg px-3 py-1.5 focus:outline-none focus:border-indigo-500"
          >
            <option value="TODAS">Todas las Aplicaciones</option>
            <option value="GENERALES">Obligatorios Generales</option>
            <option value="ESPECIFICOS">Cuando / Si Aplica</option>
          </select>
        </div>
      </div>

      {/* PROGRAM CARDS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {filteredProgramas.map((prog) => {
          const isHighAlert = prog.casosSospechosos > 10 || prog.casosConfirmados > 0;

          return (
            <div
              key={prog.id}
              className="bg-slate-950 rounded-xl border border-slate-800 p-5 shadow-sm space-y-4 hover:border-slate-700 transition-colors flex flex-col justify-between"
            >
              <div>
                {/* Header info */}
                <div className="flex items-start justify-between gap-2 pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 shrink-0">
                      {getProgramIcon(prog.nombrePrograma)}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {prog.codigoPrograma && (
                          <span className="font-mono text-[10px] font-semibold text-indigo-400 bg-indigo-500/10 px-1.5 py-0.5 rounded border border-indigo-500/20">
                            {prog.codigoPrograma}
                          </span>
                        )}
                        {prog.aplicaSegunRiesgo && (
                          <span className="text-[10px] font-medium text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20">
                            Si Aplica
                          </span>
                        )}
                      </div>
                      <h3 className="text-sm font-semibold text-slate-100 mt-1 leading-snug">
                        {prog.nombrePrograma}
                      </h3>
                    </div>
                  </div>

                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-semibold shrink-0 ${
                      prog.estado === 'ACTIVO'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : prog.estado === 'REVISION'
                        ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                        : 'bg-slate-800 text-slate-400 border border-slate-700'
                    }`}
                  >
                    {prog.estado}
                  </span>
                </div>

                {/* Base Legal badge */}
                {prog.baseLegal && (
                  <div className="mt-2.5 text-[11px] text-slate-400 flex items-center gap-1.5 bg-slate-900/60 px-2.5 py-1 rounded-md border border-slate-800/80">
                    <FileText className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                    <span className="truncate">{prog.baseLegal}</span>
                  </div>
                )}

                {/* Description */}
                <p className="text-xs text-slate-300 mt-3 line-clamp-2 leading-relaxed">
                  {prog.descripcion}
                </p>

                {/* Metrics 4-grid */}
                <div className="grid grid-cols-2 gap-2 mt-4 text-xs">
                  <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                    <div className="text-[10px] text-slate-500 font-medium">Población Expuesta</div>
                    <div className="text-sm font-bold text-slate-200 mt-0.5">{prog.poblacionExpuestaTotal} pers.</div>
                  </div>

                  <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                    <div className="text-[10px] text-slate-500 font-medium">En Vigilancia</div>
                    <div className="text-sm font-bold text-emerald-400 mt-0.5">{prog.trabajadoresEnVigilancia} pers.</div>
                  </div>

                  <div className="bg-amber-950/20 p-2.5 rounded-lg border border-amber-800/30">
                    <div className="text-[10px] text-amber-400/90 font-medium">Casos Sospechosos</div>
                    <div className="text-sm font-bold text-amber-400 mt-0.5">{prog.casosSospechosos} casos</div>
                  </div>

                  <div className="bg-rose-950/20 p-2.5 rounded-lg border border-rose-800/30">
                    <div className="text-[10px] text-rose-400/90 font-medium">Casos Confirmados</div>
                    <div className="text-sm font-bold text-rose-400 mt-0.5">{prog.casosConfirmados} casos</div>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="mt-4">
                  <div className="flex justify-between text-xs font-medium mb-1">
                    <span className="text-slate-400">Avance de Vigilancia Anual</span>
                    <span className={prog.avanceActualPorcentaje >= 90 ? 'text-emerald-400' : 'text-amber-400'}>
                      {prog.avanceActualPorcentaje}% / Meta {prog.metaCumplimientoPorcentaje}%
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                    <div
                      className={`h-full rounded-full transition-all ${
                        prog.avanceActualPorcentaje >= 90
                          ? 'bg-emerald-500'
                          : prog.avanceActualPorcentaje >= 70
                          ? 'bg-amber-500'
                          : 'bg-rose-500'
                      }`}
                      style={{ width: `${Math.min(100, prog.avanceActualPorcentaje)}%` }}
                    ></div>
                  </div>
                </div>

                {/* Key indicators tags if present */}
                {prog.indicadoresClave && prog.indicadoresClave.length > 0 && (
                  <div className="mt-3.5 flex flex-wrap gap-1">
                    {prog.indicadoresClave.map((ind, idx) => (
                      <span key={idx} className="text-[10px] text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                        • {ind}
                      </span>
                    ))}
                  </div>
                )}

                {/* Capacitaciones summary badge if any */}
                {prog.capacitaciones && prog.capacitaciones.length > 0 && (
                  <div className="mt-3 text-[11px] text-amber-300 flex items-center justify-between bg-amber-950/30 px-2.5 py-1.5 rounded-lg border border-amber-800/40">
                    <span className="flex items-center gap-1.5 font-semibold">
                      <GraduationCap className="w-4 h-4 text-amber-400 shrink-0" />
                      {prog.capacitaciones.length} Capacitació{prog.capacitaciones.length > 1 ? 'nes' : 'n'}
                    </span>
                    <span className="text-[10px] text-amber-400/90 font-mono bg-amber-900/40 px-1.5 py-0.5 rounded border border-amber-700/50">
                      {prog.capacitaciones.reduce((acc, c) => acc + (c.evidencias?.length || 0), 0)} evidencia(s)
                    </span>
                  </div>
                )}
              </div>

              {/* Card Footer & Actions */}
              <div className="pt-3 border-t border-slate-800 mt-4 space-y-2">
                <div className="text-[11px] text-slate-400 flex items-center justify-between">
                  <span>Médico: <strong className="text-slate-200">{prog.medicoResponsable}</strong></span>
                  {prog.periodicidadEvaluacion && (
                    <span className="text-[10px] text-indigo-400">{prog.periodicidadEvaluacion}</span>
                  )}
                </div>

                <div className="flex items-center gap-1.5 pt-1">
                  <button
                    onClick={() => setCohortModalProg(prog)}
                    className="flex-1 inline-flex items-center justify-center gap-1 px-2 py-1.5 bg-indigo-600/10 hover:bg-indigo-600/20 text-indigo-300 border border-indigo-500/20 rounded-md text-xs font-medium transition-colors"
                    title="Ver trabajadores en seguimiento"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Cohorte</span>
                  </button>

                  <button
                    onClick={() => setCapacitacionesModalProg(prog)}
                    className="flex-1 inline-flex items-center justify-center gap-1 px-2 py-1.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-md text-xs font-bold transition-colors"
                    title="Registrar y ver capacitaciones y evidencias"
                  >
                    <GraduationCap className="w-3.5 h-3.5 text-amber-400" />
                    <span>Capacitaciones ({prog.capacitaciones?.length || 0})</span>
                  </button>

                  <button
                    onClick={() => {
                      setEditingProg(prog);
                      setFormData(prog);
                      setIsAddModalOpen(true);
                    }}
                    className="p-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-md border border-slate-800 transition-colors"
                    title="Editar programa"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => setDeletingProg(prog)}
                    className="p-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded-md border border-rose-500/20 transition-colors"
                    title="Eliminar programa"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredProgramas.length === 0 && (
        <div className="p-12 text-center bg-slate-950 rounded-xl border border-slate-800 text-slate-400 space-y-3">
          <Activity className="w-8 h-8 text-slate-600 mx-auto" />
          <p className="text-sm">No se encontraron programas de vigilancia que coincidan con la búsqueda o filtro.</p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('TODAS');
              setSelectedApplicability('TODAS');
            }}
            className="text-xs text-indigo-400 hover:underline"
          >
            Limpiar filtros de búsqueda
          </button>
        </div>
      )}

      {/* MODAL 1: VER DETALLE DE COHORTE Y TRABAJADORES EN VIGILANCIA */}
      {cohortModalProg && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-950 border border-slate-800 rounded-xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl">
            {/* Header */}
            <div className="p-5 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-500/10 border border-indigo-500/20 rounded-lg">
                  {getProgramIcon(cohortModalProg.nombrePrograma)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs text-indigo-400 font-semibold">{cohortModalProg.codigoPrograma}</span>
                    <span className="text-[10px] bg-slate-900 text-slate-300 px-2 py-0.5 rounded border border-slate-800">
                      {cohortModalProg.baseLegal}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-white mt-0.5">{cohortModalProg.nombrePrograma}</h3>
                </div>
              </div>

              <button
                onClick={() => setCohortModalProg(null)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-900"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto space-y-6 custom-scrollbar text-xs">
              {/* Program Summary Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-slate-900 p-3 rounded-lg border border-slate-800">
                  <span className="text-slate-500 text-[10px]">Población Expuesta</span>
                  <div className="text-base font-bold text-white mt-0.5">{cohortModalProg.poblacionExpuestaTotal} pers.</div>
                </div>
                <div className="bg-slate-900 p-3 rounded-lg border border-slate-800">
                  <span className="text-slate-500 text-[10px]">En Vigilancia Activa</span>
                  <div className="text-base font-bold text-emerald-400 mt-0.5">{cohortModalProg.trabajadoresEnVigilancia} pers.</div>
                </div>
                <div className="bg-amber-950/20 p-3 rounded-lg border border-amber-800/30">
                  <span className="text-amber-400/80 text-[10px]">Casos Sospechosos / Observados</span>
                  <div className="text-base font-bold text-amber-400 mt-0.5">{cohortModalProg.casosSospechosos} casos</div>
                </div>
                <div className="bg-rose-950/20 p-3 rounded-lg border border-rose-800/30">
                  <span className="text-rose-400/80 text-[10px]">Casos Confirmados</span>
                  <div className="text-base font-bold text-rose-400 mt-0.5">{cohortModalProg.casosConfirmados} casos</div>
                </div>
              </div>

              {/* Protocol Details */}
              <div className="bg-slate-900 p-4 rounded-lg border border-slate-800 space-y-2">
                <h4 className="font-semibold text-slate-200 text-xs">Objetivo y Protocolo del Programa</h4>
                <p className="text-slate-300 leading-relaxed">{cohortModalProg.descripcion}</p>
                <div className="flex flex-wrap gap-4 pt-2 text-[11px] text-slate-400 border-t border-slate-800">
                  <span>Médico Responsable: <strong className="text-slate-200">{cohortModalProg.medicoResponsable}</strong></span>
                  <span>Periodicidad: <strong className="text-slate-200">{cohortModalProg.periodicidadEvaluacion || 'Anual'}</strong></span>
                </div>
              </div>

              {/* Cohort Workers Table */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-slate-200 text-xs flex items-center gap-2">
                    <Users className="w-4 h-4 text-indigo-400" />
                    Cohorte de Trabajadores en Vigilancia
                  </h4>
                  <span className="text-[11px] text-slate-400">
                    Mostrando trabajadores inscritos en la empresa
                  </span>
                </div>

                <div className="overflow-x-auto rounded-lg border border-slate-800">
                  <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-900 text-[10px] text-slate-400 uppercase tracking-wider">
                      <tr>
                        <th className="p-3">Trabajador (DNI)</th>
                        <th className="p-3">Puesto / Área</th>
                        <th className="p-3">Riesgo Asociado</th>
                        <th className="p-3">Último EMO / Evaluación</th>
                        <th className="p-3">Estado en Vigilancia</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/80 text-slate-300">
                      {trabajadores.slice(0, 5).map((t, idx) => (
                        <tr key={t.id} className="hover:bg-slate-900/50">
                          <td className="p-3 font-medium text-slate-100">
                            {t.apellidoPaterno} {t.apellidoMaterno}, {t.nombres}
                            <div className="text-[10px] text-slate-500 font-mono">DNI: {t.numeroDocumento}</div>
                          </td>
                          <td className="p-3">
                            <div>{t.puestoTrabajo}</div>
                            <div className="text-[10px] text-slate-500">{t.area}</div>
                          </td>
                          <td className="p-3">
                            <span className="px-2 py-0.5 rounded text-[10px] bg-slate-900 text-slate-300 border border-slate-800">
                              {t.factoresRiesgo[0]?.descripcion || 'Riesgo Específico'}
                            </span>
                          </td>
                          <td className="p-3">
                            <div className="text-slate-200">2026-06-16</div>
                            <div className="text-[10px] text-emerald-400">Vigente</div>
                          </td>
                          <td className="p-3">
                            {idx === 0 ? (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                                En Observación (TTS)
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                Normal / Control Ok
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-slate-800 bg-slate-950 flex items-center justify-between">
              <span className="text-[11px] text-slate-500">Formato R.M. 312-2011-MINSA Anexo 01</span>
              <button
                onClick={() => setCohortModalProg(null)}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-lg text-xs font-medium border border-slate-800"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: CREAR O EDITAR PROGRAMA DE VIGILANCIA */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-950 border border-slate-800 rounded-xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl">
            <div className="p-5 border-b border-slate-800 flex items-center justify-between">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Activity className="w-5 h-5 text-indigo-400" />
                {editingProg ? 'Editar Programa de Vigilancia' : 'Registrar Nuevo Programa de Vigilancia Epidemiológica'}
              </h3>
              <button
                onClick={() => {
                  setIsAddModalOpen(false);
                  setEditingProg(null);
                }}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-900"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitNewProgram} className="p-6 overflow-y-auto space-y-5 custom-scrollbar text-xs">
              {/* Plantillas Rápidas */}
              {!editingProg && (
                <div className="space-y-2">
                  <label className="text-[11px] font-semibold text-indigo-400 uppercase tracking-wider block">
                    Plantillas Reglamentarias (R.M. 312-2011 & R.M. 375-2008)
                  </label>
                  <p className="text-slate-400 text-[11px]">Seleccione un programa de la lista normativa para autocompletar:</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-36 overflow-y-auto p-2 bg-slate-900 rounded-lg border border-slate-800 custom-scrollbar">
                    {PROGRAM_TEMPLATES.map((tmpl) => (
                      <button
                        type="button"
                        key={tmpl.codigo}
                        onClick={() => handleApplyPreset(tmpl)}
                        className="text-left p-2 rounded bg-slate-950 hover:bg-slate-800/80 border border-slate-800 text-slate-300 transition-colors"
                      >
                        <div className="font-semibold text-slate-100 flex items-center justify-between">
                          <span className="truncate">{tmpl.nombre}</span>
                          <span className="text-[9px] font-mono text-indigo-400 shrink-0 ml-1">{tmpl.codigo}</span>
                        </div>
                        <div className="text-[10px] text-slate-500 truncate">{tmpl.base}</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Form Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-slate-400 font-medium mb-1">Nombre del Programa de Vigilancia *</label>
                  <input
                    type="text"
                    required
                    value={formData.nombrePrograma || ''}
                    onChange={(e) => setFormData({ ...formData, nombrePrograma: e.target.value })}
                    placeholder="Ej. Programa de Conservación Auditiva"
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-medium mb-1">Código del Programa</label>
                  <input
                    type="text"
                    value={formData.codigoPrograma || ''}
                    onChange={(e) => setFormData({ ...formData, codigoPrograma: e.target.value })}
                    placeholder="Ej. PCA-02"
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-medium mb-1">Categoría</label>
                  <select
                    value={formData.categoria || 'GENERAL'}
                    onChange={(e) => setFormData({ ...formData, categoria: e.target.value as CategoriaProgramaVigilancia })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-indigo-500"
                  >
                    <option value="GENERAL">General Obligatorio</option>
                    <option value="ESPECIFICO_EXPOSICION">Específico por Exposición a Riesgo</option>
                    <option value="SALUD_Y_BIENESTAR">Salud & Bienestar</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-slate-400 font-medium mb-1">Base Legal Peruana</label>
                  <input
                    type="text"
                    value={formData.baseLegal || ''}
                    onChange={(e) => setFormData({ ...formData, baseLegal: e.target.value })}
                    placeholder="Ej. R.M. 312-2011-MINSA / R.M. 375-2008-TR"
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-slate-400 font-medium mb-1">Descripción y Objetivo Clínico</label>
                  <textarea
                    rows={2}
                    value={formData.descripcion || ''}
                    onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                    placeholder="Objetivo del protocolo, criterios de inclusión y prevención de patología..."
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-medium mb-1">Médico Ocupacional Responsable</label>
                  <input
                    type="text"
                    value={formData.medicoResponsable || ''}
                    onChange={(e) => setFormData({ ...formData, medicoResponsable: e.target.value })}
                    placeholder="Dr. Nombre Apellido (CMP 00000)"
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-medium mb-1">Periodicidad de Evaluación</label>
                  <select
                    value={formData.periodicidadEvaluacion || 'Anual'}
                    onChange={(e) => setFormData({ ...formData, periodicidadEvaluacion: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-indigo-500"
                  >
                    <option value="Trimestral">Trimestral</option>
                    <option value="Semestral">Semestral</option>
                    <option value="Anual">Anual</option>
                    <option value="Bi-anual">Bi-anual</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 font-medium mb-1">Población Expuesta Total</label>
                  <input
                    type="number"
                    value={formData.poblacionExpuestaTotal || 0}
                    onChange={(e) => setFormData({ ...formData, poblacionExpuestaTotal: parseInt(e.target.value) || 0 })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-medium mb-1">Trabajadores en Vigilancia</label>
                  <input
                    type="number"
                    value={formData.trabajadoresEnVigilancia || 0}
                    onChange={(e) => setFormData({ ...formData, trabajadoresEnVigilancia: parseInt(e.target.value) || 0 })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-medium mb-1">Casos Sospechosos / Observados</label>
                  <input
                    type="number"
                    value={formData.casosSospechosos || 0}
                    onChange={(e) => setFormData({ ...formData, casosSospechosos: parseInt(e.target.value) || 0 })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-medium mb-1">Casos Confirmados</label>
                  <input
                    type="number"
                    value={formData.casosConfirmados || 0}
                    onChange={(e) => setFormData({ ...formData, casosConfirmados: parseInt(e.target.value) || 0 })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-medium mb-1">Avance Actual (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.avanceActualPorcentaje || 0}
                    onChange={(e) => setFormData({ ...formData, avanceActualPorcentaje: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-medium mb-1">Meta Cumplimiento (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.metaCumplimientoPorcentaje || 100}
                    onChange={(e) => setFormData({ ...formData, metaCumplimientoPorcentaje: parseFloat(e.target.value) || 100 })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="sm:col-span-2 flex items-center gap-2 pt-2">
                  <input
                    type="checkbox"
                    id="aplicaSegunRiesgo"
                    checked={formData.aplicaSegunRiesgo || false}
                    onChange={(e) => setFormData({ ...formData, aplicaSegunRiesgo: e.target.checked })}
                    className="rounded border-slate-800 bg-slate-900 text-indigo-600 focus:ring-indigo-500"
                  />
                  <label htmlFor="aplicaSegunRiesgo" className="text-slate-300 font-medium">
                    Aplica según evaluación de riesgo (Programa condicional: "cuando aplique / si aplica")
                  </label>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                {editingProg ? (
                  <button
                    type="button"
                    onClick={() => {
                      setDeletingProg(editingProg);
                      setIsAddModalOpen(false);
                      setEditingProg(null);
                    }}
                    className="px-3 py-2 bg-rose-950/60 hover:bg-rose-900/80 text-rose-300 border border-rose-800/80 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all"
                    title="Eliminar este programa de vigilancia"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-rose-400" /> Eliminar Programa
                  </button>
                ) : (
                  <div />
                )}

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setIsAddModalOpen(false);
                      setEditingProg(null);
                    }}
                    className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-lg font-medium border border-slate-800"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-medium shadow-sm"
                  >
                    {editingProg ? 'Guardar Cambios' : 'Registrar Programa'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL CONFIRMACION DE ELIMINACION DE PROGRAMA DE VIGILANCIA */}
      {deletingProg && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-hidden">
          <div className="bg-slate-950 border border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl text-slate-100 flex flex-col space-y-4 my-auto">
            <div className="flex items-start justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-rose-500/10 text-rose-400 border border-rose-500/30 rounded-xl">
                  <Trash2 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Eliminar Programa de Vigilancia</h3>
                  <p className="text-xs text-slate-400">Esta acción removerá el programa de la matriz ocupacional.</p>
                </div>
              </div>
              <button
                onClick={() => setDeletingProg(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-900"
              >
                ✕
              </button>
            </div>

            <div className="p-3.5 bg-slate-900 rounded-xl border border-slate-800 space-y-1.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-mono text-indigo-400 font-bold">{deletingProg.codigoPrograma || 'PV-00'}</span>
                <span className="px-2 py-0.5 bg-slate-800 text-slate-300 border border-slate-700 rounded text-[10px] font-bold">
                  {deletingProg.categoria}
                </span>
              </div>
              <div className="font-bold text-white text-sm pt-0.5">
                {deletingProg.nombrePrograma}
              </div>
              <div className="text-slate-400">
                Población en vigilancia: <span className="text-slate-200 font-medium">{deletingProg.trabajadoresEnVigilancia} trabajadores</span>
              </div>
              {deletingProg.baseLegal && (
                <div className="text-slate-400 text-[11px] truncate">
                  Norma: <span className="text-slate-300">{deletingProg.baseLegal}</span>
                </div>
              )}
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              ¿Está seguro de que desea eliminar permanentemente este Programa de Vigilancia Epidemiológica? Todos los indicadores y métricas asociadas serán removidos.
            </p>

            <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setDeletingProg(null)}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-lg text-xs font-semibold transition-colors border border-slate-800"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => {
                  if (onDeletePrograma && deletingProg) {
                    onDeletePrograma(deletingProg.id);
                  }
                  setDeletingProg(null);
                }}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-bold shadow-lg shadow-rose-900/30 flex items-center gap-1.5 transition-colors"
              >
                <Trash2 className="w-4 h-4" /> Sí, Eliminar Programa
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL PRINCIPAL DE CAPACITACIONES Y EVIDENCIAS POR PROGRAMA DE VIGILANCIA */}
      {capacitacionesModalProg && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-hidden">
          <div className="bg-slate-950 border border-slate-800 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl text-slate-100 overflow-hidden">
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between shrink-0 bg-slate-900/90">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-amber-500/10 text-amber-400 border border-amber-500/30 rounded-xl">
                  <GraduationCap className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                      {capacitacionesModalProg.codigoPrograma || 'PROGRAMA SST'}
                    </span>
                    <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">
                      Capacitaciones & Evidencias
                    </span>
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-white mt-0.5">
                    {capacitacionesModalProg.nombrePrograma}
                  </h3>
                </div>
              </div>
              <button
                onClick={() => setCapacitacionesModalProg(null)}
                className="text-slate-400 hover:text-white p-2 rounded-lg hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1">
              {/* Stats Bar */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800 flex items-center gap-3">
                  <div className="p-2 bg-amber-500/10 text-amber-400 rounded-lg">
                    <GraduationCap className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs text-slate-400">Total Capacitaciones</div>
                    <div className="text-lg font-bold text-white">
                      {capacitacionesModalProg.capacitaciones?.length || 0} registradas
                    </div>
                  </div>
                </div>

                <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800 flex items-center gap-3">
                  <div className="p-2 bg-indigo-500/10 text-indigo-400 rounded-lg">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs text-slate-400">Horas Lectivas Totales</div>
                    <div className="text-lg font-bold text-indigo-300">
                      {(capacitacionesModalProg.capacitaciones || []).reduce((acc, c) => acc + (c.horasLectivas || 0), 0)} Horas
                    </div>
                  </div>
                </div>

                <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800 flex items-center gap-3">
                  <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-lg">
                    <Paperclip className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs text-slate-400">Archivos de Evidencia</div>
                    <div className="text-lg font-bold text-emerald-400">
                      {(capacitacionesModalProg.capacitaciones || []).reduce((acc, c) => acc + (c.evidencias?.length || 0), 0)} Archivos
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Bar */}
              <div className="flex items-center justify-between pt-2">
                <h4 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-amber-400" />
                  Capacitaciones Específicas del Programa
                </h4>

                <button
                  onClick={handleOpenAddCapacitacion}
                  className="px-3.5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg text-xs shadow-lg shadow-amber-950/40 flex items-center gap-2 transition-all"
                >
                  <Plus className="w-4 h-4 text-slate-950 stroke-[3]" /> Registrar Capacitación
                </button>
              </div>

              {/* List of Capacitaciones */}
              {!capacitacionesModalProg.capacitaciones || capacitacionesModalProg.capacitaciones.length === 0 ? (
                <div className="p-8 text-center bg-slate-900/50 rounded-2xl border border-dashed border-slate-800 text-slate-400 space-y-3">
                  <GraduationCap className="w-10 h-10 text-slate-600 mx-auto" />
                  <p className="text-sm font-medium">No se han registrado capacitaciones aún para este programa de vigilancia.</p>
                  <p className="text-xs text-slate-500">Haz clic en "Registrar Capacitación" para ingresar el tema, fecha y adjuntar listas de asistencia, fotografías o constancias.</p>
                  <button
                    onClick={handleOpenAddCapacitacion}
                    className="mt-2 px-4 py-2 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-lg text-xs font-bold transition-all"
                  >
                    + Registrar Primera Capacitación
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {capacitacionesModalProg.capacitaciones.map((cap) => (
                    <div
                      key={cap.id}
                      className="p-4 bg-slate-900/90 rounded-2xl border border-slate-800 space-y-3 hover:border-slate-700 transition-all shadow-md"
                    >
                      {/* Header row for training item */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-800/80">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 bg-amber-500/10 text-amber-300 border border-amber-500/20 rounded text-[10px] font-bold">
                              {cap.fecha}
                            </span>
                            {cap.horasLectivas ? (
                              <span className="px-2 py-0.5 bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 rounded text-[10px] font-medium flex items-center gap-1">
                                <Clock className="w-3 h-3 text-indigo-400" /> {cap.horasLectivas} h lectivas
                              </span>
                            ) : null}
                          </div>
                          <h5 className="font-bold text-white text-base leading-snug">
                            {cap.nombre}
                          </h5>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            onClick={() => handleOpenEditCapacitacion(cap)}
                            className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-medium border border-slate-700 flex items-center gap-1.5 transition-colors"
                          >
                            <Edit3 className="w-3.5 h-3.5" /> Editar
                          </button>
                          <button
                            onClick={() => setDeletingCapacitacion(cap)}
                            className="p-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded-lg border border-rose-500/20 transition-colors"
                            title="Eliminar capacitación"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Instructor and notes */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-300">
                        {cap.instructor && (
                          <div className="flex items-center gap-2 bg-slate-950/60 p-2 rounded-lg border border-slate-800">
                            <Users className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                            <span>Facilitador: <strong className="text-white">{cap.instructor}</strong></span>
                          </div>
                        )}
                        {cap.observaciones && (
                          <div className="flex items-center gap-2 bg-slate-950/60 p-2 rounded-lg border border-slate-800 col-span-1 sm:col-span-2">
                            <FileText className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span className="text-slate-300 italic">{cap.observaciones}</span>
                          </div>
                        )}
                      </div>

                      {/* Evidence Files Section */}
                      <div className="pt-2">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                            <Paperclip className="w-3.5 h-3.5 text-emerald-400" />
                            Evidencias Adjuntas ({cap.evidencias?.length || 0})
                          </span>

                          <label className="cursor-pointer px-2.5 py-1 bg-emerald-600/20 hover:bg-emerald-600 text-emerald-300 hover:text-white border border-emerald-500/30 rounded-lg text-[11px] font-bold flex items-center gap-1.5 transition-all">
                            <Upload className="w-3 h-3" />
                            Subir Evidencia
                            <input
                              type="file"
                              multiple
                              accept=".pdf,image/*,.doc,.docx"
                              onChange={(e) => handleFileUploadDirect(e, cap.id)}
                              className="hidden"
                            />
                          </label>
                        </div>

                        {!cap.evidencias || cap.evidencias.length === 0 ? (
                          <div className="p-2.5 bg-slate-950/80 rounded-xl border border-slate-800 text-center text-xs text-slate-500">
                            Sin evidencias adjuntas para esta capacitación. Haz clic en <strong className="text-emerald-400">Subir Evidencia</strong> para agregar listas de asistencia o fotografías.
                          </div>
                        ) : (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {cap.evidencias.map((ev) => {
                              const isImage = ev.tipoArchivo?.startsWith('image/') || ev.nombreArchivo.match(/\.(png|jpg|jpeg|webp)$/i);
                              return (
                                <div
                                  key={ev.id}
                                  className="p-2 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between gap-2 hover:border-slate-700 transition-colors"
                                >
                                  <div className="flex items-center gap-2 overflow-hidden">
                                    <div className={`p-1.5 rounded-lg shrink-0 ${isImage ? 'bg-indigo-500/10 text-indigo-400' : 'bg-emerald-500/10 text-emerald-400'}`}>
                                      {isImage ? <ImageIcon className="w-4 h-4" /> : <FileText className="w-4 h-4" />}
                                    </div>
                                    <div className="truncate text-xs">
                                      <div className="font-semibold text-slate-200 truncate" title={ev.nombreArchivo}>
                                        {ev.nombreArchivo}
                                      </div>
                                      <div className="text-[10px] text-slate-400">
                                        {formatBytes(ev.tamanioBytes)} • {ev.fechaSubida || cap.fecha}
                                      </div>
                                    </div>
                                  </div>

                                  <div className="flex items-center gap-1 shrink-0">
                                    <button
                                      onClick={() => setPreviewEvidencia(ev)}
                                      className="p-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded hover:text-white transition-colors"
                                      title="Previsualizar archivo"
                                    >
                                      <Eye className="w-3.5 h-3.5 text-blue-400" />
                                    </button>
                                    <button
                                      onClick={() => handleDownloadEvidenciaFile(ev)}
                                      className="p-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded hover:text-white transition-colors"
                                      title="Descargar archivo"
                                    >
                                      <Download className="w-3.5 h-3.5 text-emerald-400" />
                                    </button>
                                    <button
                                      onClick={() => handleDeleteEvidenciaDirect(cap.id, ev.id)}
                                      className="p-1 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded transition-colors"
                                      title="Eliminar evidencia"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-slate-800 bg-slate-900/90 flex justify-end shrink-0">
              <button
                onClick={() => setCapacitacionesModalProg(null)}
                className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-bold transition-colors"
              >
                Cerrar Ventana
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL DE FORMULARIO REGISTRAR / EDITAR CAPACITACION */}
      {isCapacitacionFormOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-hidden">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl text-slate-100 flex flex-col space-y-4 my-auto max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-amber-500/10 text-amber-400 border border-amber-500/30 rounded-xl">
                  <GraduationCap className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">
                    {editingCapacitacion ? 'Editar Capacitación SST' : 'Registrar Nueva Capacitación'}
                  </h3>
                  <p className="text-xs text-slate-400">
                    {capacitacionesModalProg?.nombrePrograma}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsCapacitacionFormOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveCapacitacionSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-bold mb-1">
                  Nombre / Tema de la Capacitación *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Uso Correcto de Protectores Auditivos y Medición NRR"
                  value={capFormData.nombre || ''}
                  onChange={(e) => setCapFormData(prev => ({ ...prev, nombre: e.target.value }))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">
                    Fecha de Realización *
                  </label>
                  <input
                    type="date"
                    required
                    value={capFormData.fecha || ''}
                    onChange={(e) => setCapFormData(prev => ({ ...prev, fecha: e.target.value }))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">
                    Horas Lectivas (Duración)
                  </label>
                  <input
                    type="number"
                    min="0.5"
                    step="0.5"
                    placeholder="2"
                    value={capFormData.horasLectivas || ''}
                    onChange={(e) => setCapFormData(prev => ({ ...prev, horasLectivas: parseFloat(e.target.value) || 0 }))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">
                  Facilitador / Instructor / Expositor
                </label>
                <input
                  type="text"
                  placeholder="Ej. Dr. Alejandro Morales / Ing. Higienista Ocupacional"
                  value={capFormData.instructor || ''}
                  onChange={(e) => setCapFormData(prev => ({ ...prev, instructor: e.target.value }))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">
                  Observaciones / Contenido Resumido
                </label>
                <textarea
                  rows={2}
                  placeholder="Detalles del contenido, acuerdos o lista de asistencia aprobada..."
                  value={capFormData.observaciones || ''}
                  onChange={(e) => setCapFormData(prev => ({ ...prev, observaciones: e.target.value }))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* Upload evidence section inside form */}
              <div className="pt-2 border-t border-slate-800">
                <label className="block text-slate-300 font-bold mb-1.5 flex items-center justify-between">
                  <span>Subir Evidencias (Listas de Asistencia, Fotos, Certificados)</span>
                  <span className="text-[10px] text-emerald-400 font-normal">PDF e Imágenes permitidas</span>
                </label>

                <label className="cursor-pointer p-3 border-2 border-dashed border-slate-800 hover:border-emerald-500/50 rounded-xl bg-slate-950/60 flex flex-col items-center justify-center text-center transition-all group">
                  <Upload className="w-6 h-6 text-emerald-400 group-hover:scale-110 transition-transform mb-1" />
                  <span className="text-slate-300 font-semibold">Haz clic aquí para seleccionar archivos</span>
                  <span className="text-[10px] text-slate-500 mt-0.5">Listas de asistencia en PDF, fotos de la sesión en PNG/JPG</span>
                  <input
                    type="file"
                    multiple
                    accept=".pdf,image/*,.doc,.docx"
                    onChange={handleFileUploadTemp}
                    className="hidden"
                  />
                </label>

                {tempEvidencias.length > 0 && (
                  <div className="mt-2.5 space-y-1.5 max-h-36 overflow-y-auto pr-1">
                    {tempEvidencias.map((ev, idx) => (
                      <div key={ev.id || idx} className="p-2 bg-slate-950 rounded-lg border border-slate-800 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2 truncate">
                          <Paperclip className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          <span className="truncate text-slate-200">{ev.nombreArchivo}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setTempEvidencias(prev => prev.filter(item => item.id !== ev.id))}
                          className="text-rose-400 hover:text-rose-300 p-1 rounded"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsCapacitacionFormOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg font-medium"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg shadow-lg shadow-amber-950/40 flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" /> {editingCapacitacion ? 'Guardar Cambios' : 'Registrar Capacitación'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL CONFIRMACION DE ELIMINACION DE CAPACITACION */}
      {deletingCapacitacion && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-hidden">
          <div className="bg-slate-950 border border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl text-slate-100 flex flex-col space-y-4 my-auto">
            <div className="flex items-start justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-rose-500/10 text-rose-400 border border-rose-500/30 rounded-xl">
                  <Trash2 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Eliminar Capacitación SST</h3>
                  <p className="text-xs text-slate-400">Esta acción removerá el registro y sus evidencias.</p>
                </div>
              </div>
              <button
                onClick={() => setDeletingCapacitacion(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-900"
              >
                ✕
              </button>
            </div>

            <div className="p-3.5 bg-slate-900 rounded-xl border border-slate-800 space-y-1 text-xs">
              <div className="font-bold text-white text-sm">{deletingCapacitacion.nombre}</div>
              <div className="text-amber-400 font-semibold">Fecha: {deletingCapacitacion.fecha}</div>
              {deletingCapacitacion.evidencias && deletingCapacitacion.evidencias.length > 0 && (
                <div className="text-emerald-400 text-[11px] pt-1 border-t border-slate-800">
                  Contiene {deletingCapacitacion.evidencias.length} archivo(s) de evidencia adjuntos.
                </div>
              )}
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              ¿Está seguro de que desea eliminar permanentemente esta capacitación? Todos los archivos adjuntos serán borrados.
            </p>

            <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setDeletingCapacitacion(null)}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-lg text-xs font-semibold border border-slate-800"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleDeleteCapacitacionConfirm}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-bold shadow-lg shadow-rose-900/30 flex items-center gap-1.5"
              >
                <Trash2 className="w-4 h-4" /> Sí, Eliminar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL VISOR DE EVIDENCIAS EN PDF O IMAGEN */}
      {previewEvidencia && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-hidden">
          <div className="bg-slate-950 border border-slate-800 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl text-slate-100 overflow-hidden">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between shrink-0 bg-slate-900/90">
              <div className="flex items-center gap-2 overflow-hidden">
                <Paperclip className="w-5 h-5 text-emerald-400 shrink-0" />
                <span className="font-bold text-sm text-white truncate" title={previewEvidencia.nombreArchivo}>
                  {previewEvidencia.nombreArchivo}
                </span>
                <span className="text-xs text-slate-400 shrink-0">
                  ({formatBytes(previewEvidencia.tamanioBytes)})
                </span>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => handleDownloadEvidenciaFile(previewEvidencia)}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-md transition-all"
                >
                  <Download className="w-3.5 h-3.5" /> Descargar
                </button>
                <button
                  onClick={() => setPreviewEvidencia(null)}
                  className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-4 flex-1 bg-slate-900/50 flex items-center justify-center overflow-auto">
              {previewEvidencia.tipoArchivo?.startsWith('image/') || previewEvidencia.nombreArchivo.match(/\.(png|jpg|jpeg|webp)$/i) ? (
                <img
                  src={previewEvidencia.dataUrl}
                  alt={previewEvidencia.nombreArchivo}
                  className="max-h-[70vh] w-auto max-w-full object-contain rounded-lg border border-slate-800 shadow-xl"
                />
              ) : previewEvidencia.tipoArchivo?.includes('pdf') || previewEvidencia.nombreArchivo.endsWith('.pdf') ? (
                <iframe
                  src={previewEvidencia.dataUrl}
                  title={previewEvidencia.nombreArchivo}
                  className="w-full h-[70vh] rounded-lg border border-slate-800"
                />
              ) : (
                <div className="p-8 text-center space-y-3">
                  <FileText className="w-12 h-12 text-slate-500 mx-auto" />
                  <p className="text-sm font-semibold text-slate-300">
                    Previsualización no disponible para este formato de archivo.
                  </p>
                  <button
                    onClick={() => handleDownloadEvidenciaFile(previewEvidencia)}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-lg shadow-md"
                  >
                    Descargar Archivo para Ver Localmente
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
