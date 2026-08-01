import React, { useState } from 'react';
import { 
  Empresa, CapacitacionEPPItem, FichaFNORegistro, AgenteRiesgoFNO, EstadoFNORegistro, CertificadoMedicoPdf 
} from '../../types/erp';
import { 
  FileCheck, Download, Printer, Shield, FileText, CheckCircle2, Edit3, Save, X, 
  Upload, Eye, Trash2, Plus, Calendar, Building2, AlertTriangle, Clock, Filter, Search, FilePlus,
  CheckSquare, Square, UserCheck, ShieldCheck, ShieldAlert, Award, HardHat, BookOpen, Sparkles,
  Ear, FlaskConical, Biohazard, Brain, Activity, Stethoscope
} from 'lucide-react';

interface ReportesMINSAMTPEProps {
  empresas: Empresa[];
}

export interface EvidenciaPdfReporte {
  nombreArchivo: string;
  dataUrl: string;
  tamanioBytes?: number;
  fechaSubida?: string;
}

const DUMMY_PDF_DATAURL = 'data:application/pdf;base64,JVBERi0xLjUNJYCBgYEKMSAwIG9iago8PAovVHlwZSAvQ2F0YWxvZwovUGFnZXMgMiAwIFIKPj4KZW5kb2JqCjIgMCBvYmoKPDAKL1R5cGUgL1BhZ2VzCi9LaWRzIFszIDAgUl0KL0NvdW50IDEKPj4KZW5kb2JqCjMgMCBvYmoKPDAKL1R5cGUgL1BhZ2UKL1BhcmVudCAyIDAgUgovTWVkaWFCb3ggWzAgMCA2MTIgNzkyXQovQ29udGVudHMgNCAwIFIKL1Jlc291cmNlcyA8PAovRm9udCA8PAovRjEgNSAwIFIKPj4KPj4KZW5kb2JqCjQgMCBvYmoKPDAKL0xlbmd0aCA2NQo+PgpzdHJlYW0KQlQKL0YxIDI0IFRmCjEwMCA3MDAgVGQKKFJlZ2lzdHJvIGRlIEVuZmVybWVkYWRlcyBPY3VwYWNpb25hbGVzIC0gRmljaGEgRk5PKTsgVGoKRVQKZW5kc3RyZWFtCmVuZG9iago1IDAgb2JqCjw8Ci9UeXBlIC9Gb250Ci9TdWJ0eXBlIC9UeXBlMQovQmFzZUZvbnQgL0hlbHZldGljYQo+PgplbmRvYmoKdHJhaWxlcgo8PAovUm9vdCAxIDAgUgo+PgpzdGFydHhyZWYKNDAwCiUlRU9G';

const INITIAL_FNO_REGISTROS: FichaFNORegistro[] = [
  {
    id: 'fno-1',
    codigoFNO: 'FNO-2026-001',
    trabajadorNombre: 'Carlos Alberto Huamán Mendoza',
    numeroDocumento: '45892104',
    puestoTrabajo: 'Operador de Chancadora Primaria',
    enfermedadOcupacional: 'Hipoacusia Neurosensorial Inducida por Ruido Bilateral',
    codigoCIE10: 'H83.3',
    agenteRiesgo: 'FISICO',
    agenteEspecifico: 'Exposición continuada a ruido impulsivo y de impacto (> 89 dBA)',
    fechaDiagnostico: '2026-02-14',
    fechaNotificacionMINSA: '2026-02-18',
    estado: 'NOTIFICADO_DIGESA',
    gradoIncapacidad: 'Incapacidad Parcial Permanente (18%)',
    medicoNotificante: 'Dr. Alejandro Morales Ramos',
    cmpMedico: 'CMP 45120 / RNM 1845',
    observaciones: 'Notificación FNO remite adjunto audiometría tonal confirmatoria en cabina insonorizada y dictamen SATEP EsSalud.',
    archivoPdf: {
      nombreArchivo: 'Ficha_FNO_2026_001_Huaman_Hipoacusia.pdf',
      dataUrl: DUMMY_PDF_DATAURL,
      tamanioBytes: 2450000,
      fechaSubida: '2026-02-18'
    }
  },
  {
    id: 'fno-2',
    codigoFNO: 'FNO-2026-002',
    trabajadorNombre: 'Roberto Silva Paredes',
    numeroDocumento: '10742981',
    puestoTrabajo: 'Operador de Perforadora Neumática en Socavón',
    enfermedadOcupacional: 'Neumoconiosis / Silicosis Pulmonar Grado I (CXR OIT 1/1)',
    codigoCIE10: 'J62.8',
    agenteRiesgo: 'QUIMICO',
    agenteEspecifico: 'Inhalación prolongada de polvo de sílice libre cristalina',
    fechaDiagnostico: '2026-01-25',
    fechaNotificacionMINSA: '2026-01-30',
    estado: 'NOTIFICADO_DIGESA',
    gradoIncapacidad: 'En Evaluación SATEP / Reubicación Laboral Obligatoria',
    medicoNotificante: 'Dra. Elena Ramos Castillo',
    cmpMedico: 'CMP 52190 / RNM 2901',
    observaciones: 'Lectura de Placa Radiográfica OIT realizada por Lector B Certificado. Reubicado a área libre de sílice.',
    archivoPdf: {
      nombreArchivo: 'Ficha_FNO_2026_002_Silva_Silicosis.pdf',
      dataUrl: DUMMY_PDF_DATAURL,
      tamanioBytes: 3120000,
      fechaSubida: '2026-01-30'
    }
  },
  {
    id: 'fno-3',
    codigoFNO: 'FNO-2026-003',
    trabajadorNombre: 'Marisol Flores Quispe',
    numeroDocumento: '71249053',
    puestoTrabajo: 'Seleccionadora y Embaladora de Fruta',
    enfermedadOcupacional: 'Tenosinovitis de Estiloides Radial (Síndrome De Quervain)',
    codigoCIE10: 'M65.4',
    agenteRiesgo: 'ERGONOMICO',
    agenteEspecifico: 'Movimientos repetitivos de muñeca > 42 ciclos/min y pinza digital forzada',
    fechaDiagnostico: '2026-03-02',
    fechaNotificacionMINSA: '2026-03-05',
    estado: 'EN_EVALUACION_SATEP',
    gradoIncapacidad: 'Incapacidad Temporal (Restricción de carga y movimientos repetitivos)',
    medicoNotificante: 'Dr. Alejandro Morales Ramos',
    cmpMedico: 'CMP 45120 / RNM 1845',
    observaciones: 'Evaluación ecográfica musculoesquelética positiva. En programa de terapia física ocupacional.',
    archivoPdf: {
      nombreArchivo: 'Ficha_FNO_2026_003_Flores_Tenosinovitis.pdf',
      dataUrl: DUMMY_PDF_DATAURL,
      tamanioBytes: 1890000,
      fechaSubida: '2026-03-05'
    }
  },
  {
    id: 'fno-4',
    codigoFNO: 'FNO-2026-004',
    trabajadorNombre: 'Jorge Luis Vargas Benitez',
    numeroDocumento: '43920184',
    puestoTrabajo: 'Técnico Mecánico de Mantenimiento',
    enfermedadOcupacional: 'Dermatitis Alérgica de Contacto por Aceites Sintéticos',
    codigoCIE10: 'L23.0',
    agenteRiesgo: 'QUIMICO',
    agenteEspecifico: 'Contacto dérmico frecuente con aceites minerales sintéticos y solventes',
    fechaDiagnostico: '2026-03-12',
    fechaNotificacionMINSA: '2026-03-15',
    estado: 'SOSPECHOSO',
    gradoIncapacidad: 'Sin incapacidad (Sujeto a modificación de EPP dérmico nitrilo)',
    medicoNotificante: 'Dra. Elena Ramos Castillo',
    cmpMedico: 'CMP 52190 / RNM 2901',
    observaciones: 'Prueba de parche epicutáneo realizada. Sustitución de desengrasante hidrocarburo por biodegradable.'
  }
];

export interface ReporteLegalItem {
  id: string;
  codigoFormat: string;
  titulo: string;
  normaBase: string;
  entidadReceptora: 'SUNAFIL' | 'MINSA / DIGESA' | 'MTPE' | 'ESSALUD' | 'COMITE_SST';
  periodoAnio: string;
  descripcion: string;
  estado: 'APROBADO' | 'EN_REVISION' | 'PENDIENTE' | 'OBSERVADO' | 'ENVIADO';
  empresaId?: string;
  fechaActualizacion: string;
  observaciones?: string;
  archivoPdf?: EvidenciaPdfReporte;
}

const INITIAL_REPORTES: ReporteLegalItem[] = [
  {
    id: 'rep-1',
    codigoFormat: 'RM-312-ANEXO-1',
    titulo: 'Informe Anual de Salud Ocupacional',
    normaBase: 'R.M. 312-2011-MINSA Numeral 6.8',
    entidadReceptora: 'MINSA / DIGESA',
    periodoAnio: '2026',
    descripcion: 'Consolidado de vigilancia médica, resultados EMO por empresa, perfiles sociodemográficos e indicadores de siniestralidad (IF, IS, IA).',
    estado: 'APROBADO',
    fechaActualizacion: '2026-01-20',
    observaciones: 'Aprobado por el Médico Ocupacional Titular (CMP 45120) y Comité SST.'
  },
  {
    id: 'rep-2',
    codigoFormat: 'RM-480-FNO',
    titulo: 'Registro de Enfermedades Ocupacionales (Ficha FNO)',
    normaBase: 'R.M. 480-2008-MINSA / NTS N° 068',
    entidadReceptora: 'MINSA / DIGESA',
    periodoAnio: '2026',
    descripcion: 'Ficha de Notificación Obligatoria (FNO) para enfermedades profesionales diagnosticadas o sospechadas en programas de vigilancia.',
    estado: 'EN_REVISION',
    fechaActualizacion: '2026-02-15',
    observaciones: 'Sin casos confirmados a la fecha. Registro en blanco para fiscalización.'
  },
  {
    id: 'rep-3',
    codigoFormat: 'DS-005-FORMATO-3',
    titulo: 'Registro de Inducciones, Capacitaciones y EPPs',
    normaBase: 'D.S. 005-2012-TR / R.M. 050-2013-TR Formato 3',
    entidadReceptora: 'SUNAFIL',
    periodoAnio: '2026',
    descripcion: 'Soporte documental de cumplimiento de 4 capacitaciones mínimas anuales en SST y entrega de EPPs por puesto de trabajo.',
    estado: 'APROBADO',
    fechaActualizacion: '2026-03-01',
    observaciones: '7 capacitaciones ejecutadas y registradas con firma digital.'
  },
  {
    id: 'rep-4',
    codigoFormat: 'SAT-MTPE-2026',
    titulo: 'Registro de Accidentes de Trabajo e Incidentes Peligrosos',
    normaBase: 'Ley 29783 / D.S. 012-2014-TR / SAT',
    entidadReceptora: 'MTPE',
    periodoAnio: '2026',
    descripcion: 'Reporte electrónico de accidentes mortales (24h) e incidentes peligrosos normados por el Ministerio de Trabajo.',
    estado: 'APROBADO',
    fechaActualizacion: '2026-03-10',
    observaciones: 'Notificaciones SAT al día. Cero accidentes mortales.'
  },
  {
    id: 'rep-5',
    codigoFormat: 'IPERC-OCUP-2026',
    titulo: 'Matriz IPERC Ocupacional y Agentes de Riesgo',
    normaBase: 'R.M. 050-2013-TR / Ley 29783 Art. 57',
    entidadReceptora: 'SUNAFIL',
    periodoAnio: '2026',
    descripcion: 'Matriz de identificación de peligros, evaluación de riesgos biológicos, físicos, químicos, ergonómicos y psicosociales.',
    estado: 'APROBADO',
    fechaActualizacion: '2026-01-10',
    observaciones: 'Matriz validada para todas las sedes operativas.'
  },
  {
    id: 'rep-6',
    codigoFormat: 'MEMORIA-PASO-2026',
    titulo: 'Memoria Anual del Plan de Vigilancia de la Salud',
    normaBase: 'R.M. 312-2011-MINSA / Ley 29783',
    entidadReceptora: 'COMITE_SST',
    periodoAnio: '2026',
    descripcion: 'Memoria explicativa de epidemiología, ausentismo laboral, vacunas y restricciones dictaminadas durante el periodo anual.',
    estado: 'APROBADO',
    fechaActualizacion: '2026-01-28',
    observaciones: 'Presentado ante la Gerencia General y el Comité Paritario.'
  }
];

const INITIAL_CAPACITACIONES_EPP: CapacitacionEPPItem[] = [
  {
    id: 'cap-1',
    tipo: 'INDUCCION_GENERAL',
    titulo: 'Inducción General de Seguridad y Salud en el Trabajo (SST)',
    fecha: '2026-01-15',
    cumplido: true,
    horasLectivas: 4,
    instructorExp: 'Ing. Carlos Mendoza (CIP 184520)',
    observaciones: 'Firma de compromiso SST y entrega de reglamento interno por todo el personal.'
  },
  {
    id: 'cap-2',
    tipo: 'INDUCCION_ESPECIFICA',
    titulo: 'Inducción Específica por Puesto de Trabajo e IPERC de Área',
    fecha: '2026-01-18',
    cumplido: true,
    horasLectivas: 6,
    instructorExp: 'Dra. Elena Ramos (CMP 45120)',
    observaciones: 'Evaluación práctica aprobada con nota mínima 16/20.'
  },
  {
    id: 'cap-3',
    tipo: 'CAPACITACION_SST',
    titulo: 'Capacitación Mínima 1: Primeros Auxilios, RCP y Respuesta a Emergencias Médicas',
    fecha: '2026-02-10',
    cumplido: true,
    horasLectivas: 3,
    instructorExp: 'Lic. Maria Torres (CEP 89412)',
    observaciones: 'Exigible Ley 29783 Art. 35. Evaluación teórico-práctica con muñeco RCP.'
  },
  {
    id: 'cap-4',
    tipo: 'CAPACITACION_SST',
    titulo: 'Capacitación Mínima 2: Prevención de Incendios, Evacuación y Manejo de Extintores',
    fecha: '2026-03-05',
    cumplido: true,
    horasLectivas: 2,
    instructorExp: 'Cuerpo General de Bomberos / Dpto. SST',
    observaciones: 'Exigible Ley 29783 Art. 35. Simulacro de combate contra amago de incendio.'
  },
  {
    id: 'cap-5',
    tipo: 'CAPACITACION_SST',
    titulo: 'Capacitación Mínima 3: Ergonomía, Pausas Activas y Manejo Manual de Cargas (RM 375)',
    fecha: '2026-04-12',
    cumplido: false,
    horasLectivas: 2,
    instructorExp: 'Dr. Roberto Gomez',
    observaciones: 'Programada para el personal operativo y administrativo de planta.'
  },
  {
    id: 'cap-6',
    tipo: 'CAPACITACION_SST',
    titulo: 'Capacitación Mínima 4: Factores de Riesgo Psicosocial y Salud Mental Ocupacional',
    fecha: '2026-05-20',
    cumplido: false,
    horasLectivas: 2,
    instructorExp: 'Psic. Ana Gutierrez',
    observaciones: 'Taller participativo de manejo del estrés laboral y clima organizacional.'
  },
  {
    id: 'cap-7',
    tipo: 'ENTREGA_EPP',
    titulo: 'Registro de Entrega, Inspección y Cargo de EPPs Individuales (Formato R.M. 050)',
    fecha: '2026-01-20',
    cumplido: true,
    horasLectivas: 1,
    instructorExp: 'Supervisor de Seguridad SST',
    observaciones: 'Entrega de Casco ANSI Z89.1, Lentes de Seguridad, Botas Dieléctricas y Tapones Auditivos.'
  },
  {
    id: 'cap-8',
    tipo: 'ENTRENAMIENTO_BRIGADA',
    titulo: 'Entrenamiento Específico de la Brigada de Evacuación y Rescate Ocupacional',
    fecha: '2026-02-28',
    cumplido: true,
    horasLectivas: 4,
    instructorExp: 'Capitán CGBVP Javier Paredes',
    observaciones: 'Práctica de inmovilización de heridos con camilla espinal y botiquín tipo A.'
  }
];

export const ReportesMINSAMTPE: React.FC<ReportesMINSAMTPEProps> = ({ empresas }) => {
  const [activeViewTab, setActiveViewTab] = useState<'FORMATOS_GENERALES' | 'INDUCCIONES_CAPACITACIONES_EPP' | 'FICHA_FNO_ENFERMEDADES'>('FORMATOS_GENERALES');
  const [reportes, setReportes] = useState<ReporteLegalItem[]>(INITIAL_REPORTES);
  const [capacitaciones, setCapacitaciones] = useState<CapacitacionEPPItem[]>(INITIAL_CAPACITACIONES_EPP);
  
  // FNO Registros State
  const [fnoRegistros, setFnoRegistros] = useState<FichaFNORegistro[]>(INITIAL_FNO_REGISTROS);
  const [fnoSearchTerm, setFnoSearchTerm] = useState('');
  const [fnoFilterAgente, setFnoFilterAgente] = useState<string>('TODOS');
  const [fnoFilterEstado, setFnoFilterEstado] = useState<string>('TODOS');
  const [showFnoModal, setShowFnoModal] = useState(false);
  const [editingFnoRecord, setEditingFnoRecord] = useState<FichaFNORegistro | null>(null);

  const [fnoFormData, setFnoFormData] = useState<Partial<FichaFNORegistro>>({
    codigoFNO: 'FNO-2026-005',
    trabajadorNombre: '',
    numeroDocumento: '',
    puestoTrabajo: '',
    enfermedadOcupacional: '',
    codigoCIE10: 'H83.3',
    agenteRiesgo: 'FISICO',
    agenteEspecifico: '',
    fechaDiagnostico: new Date().toISOString().split('T')[0],
    fechaNotificacionMINSA: new Date().toISOString().split('T')[0],
    estado: 'NOTIFICADO_DIGESA',
    gradoIncapacidad: 'Evaluación Médica Ocupacional',
    medicoNotificante: 'Dr. Alejandro Morales Ramos',
    cmpMedico: 'CMP 45120 / RNM 1845',
    observaciones: ''
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [filterEntidad, setFilterEntidad] = useState<string>('TODAS');

  // Capacitaciones filters
  const [filterCapTipo, setFilterCapTipo] = useState<string>('TODOS');
  const [filterCapEstado, setFilterCapEstado] = useState<string>('TODOS');
  
  // Modal Edit State Formato Legal
  const [editingReport, setEditingReport] = useState<ReporteLegalItem | null>(null);

  // Modal Create State Formato Legal
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newReportData, setNewReportData] = useState<Partial<ReporteLegalItem>>({
    codigoFormat: '',
    titulo: '',
    normaBase: 'R.M. 312-2011-MINSA',
    entidadReceptora: 'SUNAFIL',
    periodoAnio: '2026',
    descripcion: '',
    estado: 'EN_REVISION',
    observaciones: ''
  });

  // Modal Create/Edit Capacitacion State
  const [showCapModal, setShowCapModal] = useState(false);
  const [editingCap, setEditingCap] = useState<CapacitacionEPPItem | null>(null);
  const [capFormData, setCapFormData] = useState<Partial<CapacitacionEPPItem>>({
    tipo: 'CAPACITACION_SST',
    titulo: '',
    fecha: new Date().toISOString().split('T')[0],
    cumplido: true,
    horasLectivas: 2,
    instructorExp: '',
    observaciones: ''
  });

  // Modal PDF Preview State
  const [previewPdf, setPreviewPdf] = useState<EvidenciaPdfReporte | null>(null);

  // Handlers for FNO Registros
  const handleSaveFnoRecord = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fnoFormData.trabajadorNombre || !fnoFormData.enfermedadOcupacional) return;

    if (editingFnoRecord) {
      setFnoRegistros(prev => prev.map(f => f.id === editingFnoRecord.id ? {
        ...editingFnoRecord,
        ...fnoFormData as FichaFNORegistro
      } : f));
    } else {
      const newRecord: FichaFNORegistro = {
        id: `fno-${Date.now()}`,
        codigoFNO: fnoFormData.codigoFNO || `FNO-2026-00${fnoRegistros.length + 1}`,
        trabajadorNombre: fnoFormData.trabajadorNombre,
        numeroDocumento: fnoFormData.numeroDocumento || 'DNI PENDIENTE',
        puestoTrabajo: fnoFormData.puestoTrabajo || 'Operativo',
        enfermedadOcupacional: fnoFormData.enfermedadOcupacional,
        codigoCIE10: fnoFormData.codigoCIE10 || 'H83.3',
        agenteRiesgo: (fnoFormData.agenteRiesgo as any) || 'FISICO',
        agenteEspecifico: fnoFormData.agenteEspecifico || 'Exposición a factor de riesgo ocupacional',
        fechaDiagnostico: fnoFormData.fechaDiagnostico || new Date().toISOString().split('T')[0],
        fechaNotificacionMINSA: fnoFormData.fechaNotificacionMINSA || new Date().toISOString().split('T')[0],
        estado: (fnoFormData.estado as any) || 'NOTIFICADO_DIGESA',
        gradoIncapacidad: fnoFormData.gradoIncapacidad || 'En Evaluación',
        medicoNotificante: fnoFormData.medicoNotificante || 'Dr. Alejandro Morales Ramos',
        cmpMedico: fnoFormData.cmpMedico || 'CMP 45120',
        observaciones: fnoFormData.observaciones || '',
        archivoPdf: fnoFormData.archivoPdf
      };
      setFnoRegistros([newRecord, ...fnoRegistros]);
    }

    setShowFnoModal(false);
    setEditingFnoRecord(null);
  };

  const handleDeleteFnoRecord = (id: string) => {
    if (confirm('¿Está seguro de eliminar esta Ficha FNO de Registro de Enfermedades Ocupacionales?')) {
      setFnoRegistros(prev => prev.filter(f => f.id !== id));
    }
  };

  const handleUpdateFnoDate = (id: string, field: 'fechaDiagnostico' | 'fechaNotificacionMINSA', newDate: string) => {
    setFnoRegistros(prev => prev.map(f => f.id === id ? { ...f, [field]: newDate } : f));
  };

  const handleUpdateFnoStatus = (id: string, newStatus: EstadoFNORegistro) => {
    setFnoRegistros(prev => prev.map(f => f.id === id ? { ...f, estado: newStatus } : f));
  };

  const handleAttachPdfToFno = (id: string, pdfData: CertificadoMedicoPdf) => {
    setFnoRegistros(prev => prev.map(f => f.id === id ? { ...f, archivoPdf: pdfData } : f));
  };

  const handleRemovePdfFromFno = (id: string) => {
    setFnoRegistros(prev => prev.map(f => f.id === id ? { ...f, archivoPdf: undefined } : f));
  };

  // PDF File Upload Helper
  const handlePdfUpload = (
    file: File,
    onSuccess: (pdf: EvidenciaPdfReporte) => void
  ) => {
    if (file.type !== 'application/pdf') {
      alert('Por favor seleccione un archivo en formato PDF.');
      return;
    }

    if (file.size > 15 * 1024 * 1024) {
      alert('El archivo PDF supera el tamaño máximo de 15 MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      onSuccess({
        nombreArchivo: file.name,
        dataUrl,
        tamanioBytes: file.size,
        fechaSubida: new Date().toISOString().split('T')[0]
      });
    };
    reader.readAsDataURL(file);
  };

  const filteredReportes = reportes.filter(r => {
    const matchesSearch = 
      r.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.codigoFormat.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.normaBase.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesEntidad = filterEntidad === 'TODAS' || r.entidadReceptora === filterEntidad;
    return matchesSearch && matchesEntidad;
  });

  const filteredCapacitaciones = capacitaciones.filter(c => {
    const matchesSearch = 
      c.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.instructorExp && c.instructorExp.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesTipo = filterCapTipo === 'TODOS' || c.tipo === filterCapTipo;
    const matchesEstado = 
      filterCapEstado === 'TODOS' ? true :
      filterCapEstado === 'CUMPLIDO' ? c.cumplido :
      !c.cumplido;
    return matchesSearch && matchesTipo && matchesEstado;
  });

  // Toggle Capacitacion Check
  const handleToggleCapacitacionCheck = (id: string) => {
    setCapacitaciones(prev => prev.map(c => c.id === id ? { ...c, cumplido: !c.cumplido } : c));
  };

  // Update Capacitacion Date inline
  const handleUpdateCapacitacionDate = (id: string, newDate: string) => {
    setCapacitaciones(prev => prev.map(c => c.id === id ? { ...c, fecha: newDate } : c));
  };

  const handleSaveCapacitacion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!capFormData.titulo) return;

    if (editingCap) {
      setCapacitaciones(prev => prev.map(c => c.id === editingCap.id ? {
        ...editingCap,
        ...capFormData as CapacitacionEPPItem
      } : c));
    } else {
      const created: CapacitacionEPPItem = {
        id: `cap-${Date.now()}`,
        tipo: capFormData.tipo as any || 'CAPACITACION_SST',
        titulo: capFormData.titulo,
        fecha: capFormData.fecha || new Date().toISOString().split('T')[0],
        cumplido: capFormData.cumplido || false,
        horasLectivas: Number(capFormData.horasLectivas) || 2,
        instructorExp: capFormData.instructorExp || '',
        observaciones: capFormData.observaciones || '',
        archivoPdf: capFormData.archivoPdf
      };
      setCapacitaciones([created, ...capacitaciones]);
    }

    setShowCapModal(false);
    setEditingCap(null);
  };

  const handleCreateReport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReportData.titulo || !newReportData.codigoFormat) return;

    const created: ReporteLegalItem = {
      id: `rep-${Date.now()}`,
      codigoFormat: newReportData.codigoFormat || 'FORMATO-LEG',
      titulo: newReportData.titulo,
      normaBase: newReportData.normaBase || 'Ley 29783',
      entidadReceptora: (newReportData.entidadReceptora as any) || 'SUNAFIL',
      periodoAnio: newReportData.periodoAnio || '2026',
      descripcion: newReportData.descripcion || '',
      estado: (newReportData.estado as any) || 'EN_REVISION',
      fechaActualizacion: new Date().toISOString().split('T')[0],
      observaciones: newReportData.observaciones || '',
      archivoPdf: newReportData.archivoPdf
    };

    setReportes([created, ...reportes]);
    setShowCreateModal(false);
    setNewReportData({
      codigoFormat: '',
      titulo: '',
      normaBase: 'R.M. 312-2011-MINSA',
      entidadReceptora: 'SUNAFIL',
      periodoAnio: '2026',
      descripcion: '',
      estado: 'EN_REVISION',
      observaciones: ''
    });
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingReport) return;

    setReportes(prev => prev.map(r => r.id === editingReport.id ? {
      ...editingReport,
      fechaActualizacion: new Date().toISOString().split('T')[0]
    } : r));

    setEditingReport(null);
  };

  const getEntidadBadge = (entidad: string) => {
    switch (entidad) {
      case 'SUNAFIL':
        return <span className="px-2 py-0.5 bg-amber-500/10 text-amber-300 border border-amber-500/30 text-[10px] font-bold rounded">SUNAFIL</span>;
      case 'MINSA / DIGESA':
        return <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold rounded">MINSA / DIGESA</span>;
      case 'MTPE':
        return <span className="px-2 py-0.5 bg-blue-500/10 text-blue-300 border border-blue-500/30 text-[10px] font-bold rounded">MTPE</span>;
      case 'ESSALUD':
        return <span className="px-2 py-0.5 bg-indigo-500/10 text-indigo-300 border border-indigo-500/30 text-[10px] font-bold rounded">EsSalud</span>;
      default:
        return <span className="px-2 py-0.5 bg-slate-800 text-slate-300 border border-slate-700 text-[10px] font-bold rounded">{entidad}</span>;
    }
  };

  const getCapacitacionTipoBadge = (tipo: string) => {
    switch (tipo) {
      case 'INDUCCION_GENERAL':
        return <span className="px-2 py-0.5 bg-blue-500/10 text-blue-300 border border-blue-500/30 text-[10px] font-bold rounded flex items-center gap-1"><UserCheck className="w-3 h-3" /> Inducción General</span>;
      case 'INDUCCION_ESPECIFICA':
        return <span className="px-2 py-0.5 bg-indigo-500/10 text-indigo-300 border border-indigo-500/30 text-[10px] font-bold rounded flex items-center gap-1"><BookOpen className="w-3 h-3" /> Inducción Puesto</span>;
      case 'CAPACITACION_SST':
        return <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold rounded flex items-center gap-1"><Award className="w-3 h-3" /> Capacitación SST</span>;
      case 'ENTREGA_EPP':
        return <span className="px-2 py-0.5 bg-amber-500/10 text-amber-300 border border-amber-500/30 text-[10px] font-bold rounded flex items-center gap-1"><HardHat className="w-3 h-3" /> Cargo EPP</span>;
      case 'ENTRENAMIENTO_BRIGADA':
        return <span className="px-2 py-0.5 bg-rose-500/10 text-rose-300 border border-rose-500/30 text-[10px] font-bold rounded flex items-center gap-1"><ShieldCheck className="w-3 h-3" /> Brigada SST</span>;
      default:
        return <span className="px-2 py-0.5 bg-slate-800 text-slate-300 border border-slate-700 text-[10px] font-bold rounded">{tipo}</span>;
    }
  };

  const getAgenteBadge = (agente: AgenteRiesgoFNO) => {
    switch (agente) {
      case 'FISICO':
        return <span className="px-2.5 py-0.5 bg-blue-500/10 text-blue-300 border border-blue-500/30 text-[10px] font-bold rounded-full flex items-center gap-1"><Ear className="w-3 h-3 text-blue-400" /> FÍSICO</span>;
      case 'QUIMICO':
        return <span className="px-2.5 py-0.5 bg-purple-500/10 text-purple-300 border border-purple-500/30 text-[10px] font-bold rounded-full flex items-center gap-1"><FlaskConical className="w-3 h-3 text-purple-400" /> QUÍMICO</span>;
      case 'BIOLOGICO':
        return <span className="px-2.5 py-0.5 bg-rose-500/10 text-rose-300 border border-rose-500/30 text-[10px] font-bold rounded-full flex items-center gap-1"><Biohazard className="w-3 h-3 text-rose-400" /> BIOLÓGICO</span>;
      case 'ERGONOMICO':
        return <span className="px-2.5 py-0.5 bg-amber-500/10 text-amber-300 border border-amber-500/30 text-[10px] font-bold rounded-full flex items-center gap-1"><Activity className="w-3 h-3 text-amber-400" /> ERGONÓMICO</span>;
      case 'PSICOSOCIAL':
        return <span className="px-2.5 py-0.5 bg-teal-500/10 text-teal-300 border border-teal-500/30 text-[10px] font-bold rounded-full flex items-center gap-1"><Brain className="w-3 h-3 text-teal-400" /> PSICOSOCIAL</span>;
      default:
        return <span className="px-2 py-0.5 bg-slate-800 text-slate-300 text-[10px] font-bold rounded">{agente}</span>;
    }
  };

  const getEstadoFnoBadge = (estado: EstadoFNORegistro) => {
    switch (estado) {
      case 'NOTIFICADO_DIGESA':
        return <span className="px-2.5 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold rounded-lg flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> NOTIFICADO DIGESA</span>;
      case 'CONFIRMADO':
        return <span className="px-2.5 py-1 bg-indigo-500/10 text-indigo-300 border border-indigo-500/30 text-[10px] font-bold rounded-lg flex items-center gap-1.5"><ShieldAlert className="w-3.5 h-3.5 text-indigo-400" /> CONFIRMADO</span>;
      case 'EN_EVALUACION_SATEP':
        return <span className="px-2.5 py-1 bg-amber-500/10 text-amber-300 border border-amber-500/30 text-[10px] font-bold rounded-lg flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-amber-400" /> EVALUACIÓN SATEP</span>;
      case 'SOSPECHOSO':
        return <span className="px-2.5 py-1 bg-rose-500/10 text-rose-300 border border-rose-500/30 text-[10px] font-bold rounded-lg flex items-center gap-1.5"><AlertTriangle className="w-3.5 h-3.5 text-rose-400" /> SOSPECHOSO</span>;
    }
  };

  const capCumplidasCount = capacitaciones.filter(c => c.cumplido).length;
  const capPorcentaje = Math.round((capCumplidasCount / (capacitaciones.length || 1)) * 100);

  // FNO Filtering and Date Sorting
  const sortedFnoRegistros = [...fnoRegistros].sort((a, b) => {
    return new Date(b.fechaDiagnostico).getTime() - new Date(a.fechaDiagnostico).getTime();
  });

  const filteredFnoRegistros = sortedFnoRegistros.filter(fno => {
    const q = fnoSearchTerm.toLowerCase();
    const matchesSearch =
      fno.codigoFNO.toLowerCase().includes(q) ||
      fno.trabajadorNombre.toLowerCase().includes(q) ||
      fno.numeroDocumento.includes(q) ||
      fno.enfermedadOcupacional.toLowerCase().includes(q) ||
      fno.codigoCIE10.toLowerCase().includes(q) ||
      fno.puestoTrabajo.toLowerCase().includes(q);
    const matchesAgente = fnoFilterAgente === 'TODOS' || fno.agenteRiesgo === fnoFilterAgente;
    const matchesEstado = fnoFilterEstado === 'TODOS' || fno.estado === fnoFilterEstado;
    return matchesSearch && matchesAgente && matchesEstado;
  });

  return (
    <div className="space-y-6">
      {/* View Switcher Tabs Header */}
      <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-lg">
        <div>
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span className="px-2.5 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold uppercase rounded-full">
              Estructuras Oficiales MINSA (RM 312-2011) & MTPE (Ley 29783)
            </span>
            <span className="px-2.5 py-0.5 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-[10px] font-bold uppercase rounded-full">
              Ficha FNO R.M. 480-2008 & Evidencias PDF
            </span>
          </div>
          <h2 className="text-xl font-bold text-white font-sans flex items-center gap-2.5">
            <FileCheck className="w-6 h-6 text-emerald-400" /> 
            Reportes Estadísticos & Formatos Legales Oficiales
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-3xl">
            Generación, edición, registro de Ficha FNO con CIE-10 y PDF previsualizado, capacitaciones/EPP, evidencias en PDF y descarga 1-click para SUNAFIL, DIGESA y MTPE.
          </p>
        </div>

        {/* View Switcher Controls */}
        <div className="flex items-center gap-2 bg-slate-900 p-1.5 rounded-xl border border-slate-800 shrink-0 flex-wrap">
          <button
            type="button"
            onClick={() => setActiveViewTab('FORMATOS_GENERALES')}
            className={`px-3 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
              activeViewTab === 'FORMATOS_GENERALES'
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-950'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <FileText className="w-4 h-4" /> Formatos Legales
          </button>
          <button
            type="button"
            onClick={() => setActiveViewTab('FICHA_FNO_ENFERMEDADES')}
            className={`px-3 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
              activeViewTab === 'FICHA_FNO_ENFERMEDADES'
                ? 'bg-rose-600 text-white shadow-lg shadow-rose-950'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Stethoscope className="w-4 h-4 text-rose-300" /> Ficha FNO (Enfermedades Ocupacionales)
          </button>
          <button
            type="button"
            onClick={() => setActiveViewTab('INDUCCIONES_CAPACITACIONES_EPP')}
            className={`px-3 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
              activeViewTab === 'INDUCCIONES_CAPACITACIONES_EPP'
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-950'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <CheckSquare className="w-4 h-4 text-emerald-300" /> Inducciones, Capacitaciones & EPPs
          </button>
        </div>
      </div>

      {activeViewTab === 'FORMATOS_GENERALES' ? (
        <>
          {/* Top Actions Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-900 p-3.5 rounded-xl border border-slate-800 text-xs">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Buscar por título, código o norma base..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-slate-400 font-medium">Entidad:</span>
              <select
                value={filterEntidad}
                onChange={(e) => setFilterEntidad(e.target.value)}
                className="bg-slate-950 border border-slate-800 text-slate-200 rounded-lg px-2.5 py-1.5 font-semibold focus:outline-none focus:border-emerald-500"
              >
                <option value="TODAS">TODAS LAS ENTIDADES</option>
                <option value="SUNAFIL">SUNAFIL</option>
                <option value="MINSA / DIGESA">MINSA / DIGESA</option>
                <option value="MTPE">MTPE</option>
                <option value="ESSALUD">EsSalud</option>
                <option value="COMITE_SST">Comité SST</option>
              </select>

              <button
                onClick={() => setShowCreateModal(true)}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-emerald-900/40 flex items-center gap-2 shrink-0 transition-all ml-auto"
              >
                <Plus className="w-4 h-4" /> Registrar Nuevo Formato
              </button>
            </div>
          </div>

          {/* Report Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredReportes.map((reporte) => (
              <div
                key={reporte.id}
                className="bg-slate-950 rounded-2xl border border-slate-800 p-5 shadow-lg flex flex-col justify-between space-y-4 hover:border-slate-700 transition-colors"
              >
                <div>
                  {/* Top Header */}
                  <div className="flex items-start justify-between gap-2 pb-3 border-b border-slate-800">
                    <div className="space-y-1">
                      <span className="text-[10px] font-mono font-bold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
                        {reporte.codigoFormat}
                      </span>
                      <div className="mt-1">{getEntidadBadge(reporte.entidadReceptora)}</div>
                    </div>

                    {/* Status Selector Dropdown */}
                    <select
                      value={reporte.estado}
                      onChange={(e) => {
                        const newStatus = e.target.value as any;
                        setReportes(prev => prev.map(r => r.id === reporte.id ? { ...r, estado: newStatus } : r));
                      }}
                      className={`px-2 py-1 rounded-md text-[10px] font-bold border cursor-pointer focus:outline-none ${
                        reporte.estado === 'APROBADO' || reporte.estado === 'ENVIADO'
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                          : reporte.estado === 'EN_REVISION'
                          ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                          : reporte.estado === 'OBSERVADO'
                          ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                          : 'bg-slate-800 text-slate-400 border-slate-700'
                      }`}
                    >
                      <option value="APROBADO" className="bg-slate-900 text-emerald-400">✓ APROBADO</option>
                      <option value="ENVIADO" className="bg-slate-900 text-blue-400">📤 ENVIADO</option>
                      <option value="EN_REVISION" className="bg-slate-900 text-amber-400">⏳ EN REVISIÓN</option>
                      <option value="OBSERVADO" className="bg-slate-900 text-rose-400">⚠ OBSERVADO</option>
                      <option value="PENDIENTE" className="bg-slate-900 text-slate-400">❌ PENDIENTE</option>
                    </select>
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-base font-bold text-white mt-3 leading-snug font-sans">
                    {reporte.titulo}
                  </h3>
                  <p className="text-xs font-semibold text-emerald-400 mt-0.5">
                    Norma Base: {reporte.normaBase}
                  </p>
                  <p className="text-xs text-slate-400 mt-2 line-clamp-3 leading-relaxed">
                    {reporte.descripcion}
                  </p>

                  {reporte.codigoFormat === 'DS-005-FORMATO-3' && (
                    <button
                      type="button"
                      onClick={() => setActiveViewTab('INDUCCIONES_CAPACITACIONES_EPP')}
                      className="mt-3 w-full p-2 bg-emerald-950/40 hover:bg-emerald-900/60 border border-emerald-800/60 text-emerald-300 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow"
                    >
                      <CheckSquare className="w-4 h-4 text-emerald-400" /> Gestionar Capacitaciones & EPPs ({capCumplidasCount}/{capacitaciones.length})
                    </button>
                  )}

                  {reporte.codigoFormat === 'RM-480-FNO' && (
                    <button
                      type="button"
                      onClick={() => setActiveViewTab('FICHA_FNO_ENFERMEDADES')}
                      className="mt-3 w-full p-2 bg-rose-950/40 hover:bg-rose-900/60 border border-rose-800/60 text-rose-300 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow"
                    >
                      <Stethoscope className="w-4 h-4 text-rose-400" /> Gestionar Registros FNO ({fnoRegistros.length} casos)
                    </button>
                  )}

                  {reporte.observaciones && (
                    <div className="mt-3 p-2.5 bg-slate-900/80 rounded-lg border border-slate-800/80 text-[11px] text-slate-300">
                      <strong className="text-indigo-400">Nota Auditado: </strong>
                      {reporte.observaciones}
                    </div>
                  )}
                </div>

                {/* Bottom Actions & PDF Evidencia */}
                <div className="space-y-3 pt-3 border-t border-slate-800">
                  {/* PDF Document Container */}
                  {reporte.archivoPdf ? (
                    <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800 space-y-2">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-slate-400 font-medium">Sustento en PDF:</span>
                        <span className="text-[10px] text-slate-500 font-mono">{reporte.archivoPdf.fechaSubida}</span>
                      </div>

                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5 truncate">
                          <FileText className="w-4 h-4 text-red-400 shrink-0" />
                          <span className="text-slate-200 font-semibold truncate text-xs" title={reporte.archivoPdf.nombreArchivo}>
                            {reporte.archivoPdf.nombreArchivo}
                          </span>
                        </div>

                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            type="button"
                            onClick={() => setPreviewPdf(reporte.archivoPdf!)}
                            className="px-2 py-1 bg-indigo-600/20 hover:bg-indigo-600/40 text-indigo-300 border border-indigo-500/30 rounded text-[11px] font-bold flex items-center gap-1 transition-all"
                            title="Previsualizar PDF"
                          >
                            <Eye className="w-3.5 h-3.5 text-indigo-400" /> Ver
                          </button>

                          <a
                            href={reporte.archivoPdf.dataUrl}
                            download={reporte.archivoPdf.nombreArchivo}
                            className="px-2 py-1 bg-emerald-600/20 hover:bg-emerald-600/40 text-emerald-300 border border-emerald-500/30 rounded text-[11px] font-bold flex items-center gap-1 transition-all"
                            title="Descargar PDF"
                          >
                            <Download className="w-3.5 h-3.5 text-emerald-400" /> PDF
                          </a>

                          <button
                            type="button"
                            onClick={() => {
                              setReportes(prev => prev.map(r => r.id === reporte.id ? { ...r, archivoPdf: undefined } : r));
                            }}
                            className="p-1 text-slate-500 hover:text-rose-400 rounded transition-colors"
                            title="Eliminar PDF"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <label className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-slate-900 hover:bg-slate-800 text-slate-300 border border-dashed border-slate-700 hover:border-emerald-500 rounded-xl text-xs font-semibold cursor-pointer transition-all">
                      <Upload className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Subir Sustento PDF (Firma / Sello)</span>
                      <input
                        type="file"
                        accept="application/pdf"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            handlePdfUpload(file, (pdfData) => {
                              setReportes(prev => prev.map(r => r.id === reporte.id ? { ...r, archivoPdf: pdfData } : r));
                            });
                          }
                        }}
                      />
                    </label>
                  )}

                  {/* Action Buttons */}
                  <div className="flex items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => setEditingReport(JSON.parse(JSON.stringify(reporte)))}
                      className="px-3 py-1.5 bg-indigo-600/20 hover:bg-indigo-600/40 text-indigo-300 border border-indigo-500/30 rounded-lg text-xs font-bold inline-flex items-center gap-1.5 transition-all"
                    >
                      <Edit3 className="w-3.5 h-3.5 text-indigo-400" /> Editar Datos
                    </button>

                    <button
                      type="button"
                      onClick={() => alert(`Generando reporte digital oficial (${reporte.codigoFormat}) en formato PDF estandarizado SUNAFIL / MINSA.`)}
                      className="px-3 py-1.5 bg-emerald-600/20 hover:bg-emerald-600/40 text-emerald-300 border border-emerald-500/30 rounded-lg text-xs font-bold inline-flex items-center gap-1.5 transition-all"
                    >
                      <Printer className="w-3.5 h-3.5 text-emerald-400" /> 1-Click Formato
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : activeViewTab === 'FICHA_FNO_ENFERMEDADES' ? (
        /* TAB 2: REGISTRO DE ENFERMEDADES OCUPACIONALES (FICHA FNO - R.M. 480-2008-MINSA) */
        <div className="space-y-6">
          {/* Header Summary & Actions */}
          <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2.5 py-0.5 bg-rose-500/10 text-rose-400 border border-rose-500/30 text-[10px] font-bold rounded flex items-center gap-1">
                    <Stethoscope className="w-3 h-3" /> Ficha FNO R.M. 480-2008-MINSA
                  </span>
                  <span className="px-2.5 py-0.5 bg-indigo-500/10 text-indigo-300 border border-indigo-500/30 text-[10px] font-bold rounded">
                    Notificación Obligatoria MINSA & DIGESA / D.S. 005-2012-TR
                  </span>
                  <span className="px-2.5 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold rounded">
                    Codificación CIE-10 Exigida
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white font-sans flex items-center gap-2">
                  <Stethoscope className="w-5 h-5 text-rose-400" /> Registro y Notificación de Enfermedades Ocupacionales (Ficha FNO)
                </h3>
                <p className="text-xs text-slate-400">
                  Gestión cronológica de dictámenes médicos ocupacionales, diagnósticos CIE-10, notificación a MINSA/DIGESA y sustentos PDF previsualizables.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setEditingFnoRecord(null);
                  setFnoFormData({
                    codigoFNO: `FNO-2026-00${fnoRegistros.length + 1}`,
                    trabajadorNombre: '',
                    numeroDocumento: '',
                    puestoTrabajo: '',
                    enfermedadOcupacional: '',
                    codigoCIE10: 'H83.3',
                    agenteRiesgo: 'FISICO',
                    agenteEspecifico: '',
                    fechaDiagnostico: new Date().toISOString().split('T')[0],
                    fechaNotificacionMINSA: new Date().toISOString().split('T')[0],
                    estado: 'NOTIFICADO_DIGESA',
                    gradoIncapacidad: 'Evaluación Médica Ocupacional',
                    medicoNotificante: 'Dr. Alejandro Morales Ramos',
                    cmpMedico: 'CMP 45120 / RNM 1845',
                    observaciones: ''
                  });
                  setShowFnoModal(true);
                }}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg shadow-rose-950 transition-all shrink-0"
              >
                <Plus className="w-4 h-4" /> Registrar Nueva Ficha FNO
              </button>
            </div>

            {/* Metrics Dashboard */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Fichas FNO</span>
                <div className="text-xl font-black text-white mt-1 flex items-center justify-between">
                  <span>{fnoRegistros.length}</span>
                  <Stethoscope className="w-4 h-4 text-rose-400" />
                </div>
                <span className="text-[10px] text-slate-400">Casos registrados</span>
              </div>

              <div className="p-3 bg-emerald-950/30 rounded-xl border border-emerald-900/40">
                <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block">Notificados DIGESA</span>
                <div className="text-xl font-black text-emerald-300 mt-1 flex items-center justify-between">
                  <span>{fnoRegistros.filter(f => f.estado === 'NOTIFICADO_DIGESA').length}</span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                </div>
                <span className="text-[10px] text-emerald-400/80">Con constancia de envíos</span>
              </div>

              <div className="p-3 bg-amber-950/30 rounded-xl border border-amber-900/40">
                <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block">Evaluación SATEP</span>
                <div className="text-xl font-black text-amber-300 mt-1 flex items-center justify-between">
                  <span>{fnoRegistros.filter(f => f.estado === 'EN_EVALUACION_SATEP').length}</span>
                  <Clock className="w-4 h-4 text-amber-400" />
                </div>
                <span className="text-[10px] text-amber-400/80">Tramite ante EsSalud/EPS</span>
              </div>

              <div className="p-3 bg-indigo-950/30 rounded-xl border border-indigo-900/40">
                <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider block">Con PDF Adjunto</span>
                <div className="text-xl font-black text-indigo-300 mt-1 flex items-center justify-between">
                  <span>{fnoRegistros.filter(f => !!f.archivoPdf).length}</span>
                  <FileText className="w-4 h-4 text-indigo-400" />
                </div>
                <span className="text-[10px] text-indigo-400/80">Sustentos previsualizables</span>
              </div>
            </div>

            {/* Filters Bar */}
            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
              <div className="relative flex-1 w-full">
                <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Buscar por Trabajador, DNI, CIE-10, Enfermedad o Código FNO..."
                  value={fnoSearchTerm}
                  onChange={(e) => setFnoSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-rose-500"
                />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 shrink-0">
                  <Filter className="w-3.5 h-3.5 text-slate-400" />
                  <span className="text-[11px] text-slate-400 font-medium">Agente:</span>
                  <select
                    value={fnoFilterAgente}
                    onChange={(e) => setFnoFilterAgente(e.target.value)}
                    className="bg-transparent text-xs text-slate-200 focus:outline-none font-bold cursor-pointer"
                  >
                    <option value="TODOS" className="bg-slate-900">Todos los Agentes</option>
                    <option value="FISICO" className="bg-slate-900">Físico</option>
                    <option value="QUIMICO" className="bg-slate-900">Químico</option>
                    <option value="BIOLOGICO" className="bg-slate-900">Biológico</option>
                    <option value="ERGONOMICO" className="bg-slate-900">Ergonómico</option>
                    <option value="PSICOSOCIAL" className="bg-slate-900">Psicosocial</option>
                  </select>
                </div>

                <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 shrink-0">
                  <span className="text-[11px] text-slate-400 font-medium">Estado:</span>
                  <select
                    value={fnoFilterEstado}
                    onChange={(e) => setFnoFilterEstado(e.target.value)}
                    className="bg-transparent text-xs text-slate-200 focus:outline-none font-bold cursor-pointer"
                  >
                    <option value="TODOS" className="bg-slate-900">Todos los Estados</option>
                    <option value="NOTIFICADO_DIGESA" className="bg-slate-900">Notificado DIGESA</option>
                    <option value="CONFIRMADO" className="bg-slate-900">Confirmado</option>
                    <option value="EN_EVALUACION_SATEP" className="bg-slate-900">Evaluación SATEP</option>
                    <option value="SOSPECHOSO" className="bg-slate-900">Sospechoso</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* List of FNO Records ordered chronologically (newest diagnosis date first) */}
          <div className="space-y-4">
            {filteredFnoRegistros.length === 0 ? (
              <div className="p-12 text-center bg-slate-950/60 rounded-2xl border border-slate-800 space-y-3">
                <Stethoscope className="w-10 h-10 text-slate-600 mx-auto" />
                <h4 className="text-base font-bold text-slate-300">No se encontraron Fichas FNO de Enfermedades Ocupacionales</h4>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  No existen registros que coincidan con la búsqueda o filtro seleccionado. Haga clic en "Registrar Nueva Ficha FNO" para crear una.
                </p>
              </div>
            ) : (
              filteredFnoRegistros.map((fno) => (
                <div
                  key={fno.id}
                  className="bg-slate-950 p-5 rounded-2xl border border-slate-800 hover:border-slate-700 shadow-xl transition-all space-y-4"
                >
                  {/* Card Header */}
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="px-3 py-1 bg-rose-950/60 text-rose-300 border border-rose-800/60 rounded-lg text-xs font-mono font-bold">
                        {fno.codigoFNO}
                      </span>

                      {getAgenteBadge(fno.agenteRiesgo)}
                      {getEstadoFnoBadge(fno.estado)}

                      <span className="px-2.5 py-0.5 bg-slate-900 text-slate-300 border border-slate-800 text-[10px] font-mono font-bold rounded">
                        CIE-10: {fno.codigoCIE10}
                      </span>
                    </div>

                    {/* Interactive Date Fields & Actions */}
                    <div className="flex items-center gap-3 flex-wrap">
                      <div className="flex items-center gap-2 bg-slate-900/90 px-3 py-1.5 rounded-xl border border-slate-800 text-xs">
                        <Calendar className="w-3.5 h-3.5 text-rose-400" />
                        <span className="text-[11px] text-slate-400">Diag:</span>
                        <input
                          type="date"
                          value={fno.fechaDiagnostico}
                          onChange={(e) => handleUpdateFnoDate(fno.id, 'fechaDiagnostico', e.target.value)}
                          className="bg-transparent text-slate-200 text-xs font-bold focus:outline-none cursor-pointer"
                        />
                      </div>

                      <div className="flex items-center gap-2 bg-slate-900/90 px-3 py-1.5 rounded-xl border border-slate-800 text-xs">
                        <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-[11px] text-slate-400">Notif MINSA:</span>
                        <input
                          type="date"
                          value={fno.fechaNotificacionMINSA}
                          onChange={(e) => handleUpdateFnoDate(fno.id, 'fechaNotificacionMINSA', e.target.value)}
                          className="bg-transparent text-slate-200 text-xs font-bold focus:outline-none cursor-pointer"
                        />
                      </div>

                      <div className="flex items-center gap-1.5 ml-auto">
                        <button
                          type="button"
                          onClick={() => {
                            setEditingFnoRecord(fno);
                            setFnoFormData(fno);
                            setShowFnoModal(true);
                          }}
                          className="p-1.5 bg-indigo-600/20 hover:bg-indigo-600/40 text-indigo-300 border border-indigo-500/30 rounded-lg text-xs font-bold transition-all"
                          title="Editar Ficha FNO"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteFnoRecord(fno.id)}
                          className="p-1.5 bg-rose-600/20 hover:bg-rose-600/40 text-rose-300 border border-rose-500/30 rounded-lg text-xs font-bold transition-all"
                          title="Eliminar Registro FNO"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Body Info Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                    {/* Worker Info */}
                    <div className="space-y-1.5 bg-slate-900/40 p-3 rounded-xl border border-slate-800/60">
                      <span className="text-[10px] font-bold text-slate-500 uppercase">Trabajador Afectado</span>
                      <p className="font-bold text-slate-100 text-sm">{fno.trabajadorNombre}</p>
                      <div className="flex items-center gap-2 text-slate-400 text-[11px]">
                        <span>DNI: <strong className="text-slate-200 font-mono">{fno.numeroDocumento}</strong></span>
                      </div>
                      <p className="text-slate-400 text-[11px] mt-1">
                        Puesto: <strong className="text-slate-300">{fno.puestoTrabajo}</strong>
                      </p>
                    </div>

                    {/* Occupational Disease Details */}
                    <div className="space-y-1.5 bg-slate-900/40 p-3 rounded-xl border border-slate-800/60">
                      <span className="text-[10px] font-bold text-slate-500 uppercase">Diagnóstico Médico Ocupacional</span>
                      <p className="font-bold text-rose-300 text-xs leading-relaxed">
                        {fno.enfermedadOcupacional}
                      </p>
                      <p className="text-slate-400 text-[11px]">
                        Factor Específico: <span className="text-slate-300 font-medium">{fno.agenteEspecifico}</span>
                      </p>
                      <p className="text-slate-400 text-[11px]">
                        Incapacidad: <span className="text-amber-300 font-medium">{fno.gradoIncapacidad}</span>
                      </p>
                    </div>

                    {/* Physician & Notification info */}
                    <div className="space-y-1.5 bg-slate-900/40 p-3 rounded-xl border border-slate-800/60">
                      <span className="text-[10px] font-bold text-slate-500 uppercase">Médico Notificante & Estado Legal</span>
                      <p className="font-bold text-slate-200">{fno.medicoNotificante}</p>
                      <p className="text-[11px] text-slate-400 font-mono">{fno.cmpMedico}</p>
                      
                      {/* State Select Dropdown */}
                      <div className="mt-2 flex items-center gap-2">
                        <span className="text-[10px] text-slate-400">Cambiar Estado:</span>
                        <select
                          value={fno.estado}
                          onChange={(e) => handleUpdateFnoStatus(fno.id, e.target.value as EstadoFNORegistro)}
                          className="bg-slate-950 text-slate-200 text-[11px] font-bold border border-slate-700 rounded-lg px-2 py-1 focus:outline-none"
                        >
                          <option value="NOTIFICADO_DIGESA">NOTIFICADO DIGESA</option>
                          <option value="CONFIRMADO">CONFIRMADO</option>
                          <option value="EN_EVALUACION_SATEP">EN EVALUACIÓN SATEP</option>
                          <option value="SOSPECHOSO">SOSPECHOSO</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {fno.observaciones && (
                    <div className="p-2.5 bg-slate-900/70 rounded-xl border border-slate-800 text-[11px] text-slate-300">
                      <strong className="text-rose-400">Observaciones del Dictamen / Informe Médico: </strong>
                      {fno.observaciones}
                    </div>
                  )}

                  {/* Sustento PDF Previsualizable */}
                  <div className="p-3 bg-slate-900/90 rounded-xl border border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-rose-500/10 text-rose-400 rounded-lg border border-rose-500/20 shrink-0">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                          Documento Sustento PDF (Ficha FNO / Audiometría / Placa OIT)
                        </span>
                        {fno.archivoPdf ? (
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-xs font-medium text-emerald-400 font-mono truncate max-w-xs">
                              {fno.archivoPdf.nombreArchivo}
                            </span>
                            <span className="text-[10px] text-slate-500">
                              ({Math.round((fno.archivoPdf.tamanioBytes || 2400000) / 1024)} KB · {fno.archivoPdf.fechaSubida})
                            </span>
                          </div>
                        ) : (
                          <span className="text-xs text-amber-400 font-medium">
                            Sin PDF adjunto. Puede cargar la copia escaneada firmada.
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {fno.archivoPdf ? (
                        <>
                          <button
                            type="button"
                            onClick={() => setPreviewPdf({
                              nombreArchivo: fno.archivoPdf!.nombreArchivo,
                              dataUrl: fno.archivoPdf!.dataUrl,
                              fechaSubida: fno.archivoPdf!.fechaSubida,
                              tamanioBytes: fno.archivoPdf!.tamanioBytes
                            })}
                            className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-md shadow-indigo-950 transition-all"
                          >
                            <Eye className="w-3.5 h-3.5" /> Previsualizar PDF
                          </button>

                          <a
                            href={fno.archivoPdf.dataUrl}
                            download={fno.archivoPdf.nombreArchivo}
                            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all"
                          >
                            <Download className="w-3.5 h-3.5" /> Descargar
                          </a>

                          <button
                            type="button"
                            onClick={() => handleRemovePdfFromFno(fno.id)}
                            className="p-1.5 bg-rose-950/60 hover:bg-rose-900 text-rose-400 border border-rose-800 rounded-lg text-xs transition-all"
                            title="Quitar archivo PDF"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </>
                      ) : (
                        <label className="px-3 py-1.5 bg-rose-600/20 hover:bg-rose-600/40 text-rose-300 border border-rose-500/40 rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all">
                          <Upload className="w-3.5 h-3.5 text-rose-400" />
                          <span>Adjuntar Ficha FNO en PDF</span>
                          <input
                            type="file"
                            accept=".pdf,application/pdf"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                handlePdfUpload(file, (pdfObj) => {
                                  handleAttachPdfToFno(fno.id, pdfObj);
                                });
                              }
                            }}
                          />
                        </label>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      ) : (
        /* TAB 3: REGISTRO DE INDUCCIONES, CAPACITACIONES Y EPPS (FORMATO 3 D.S. 005-2012-TR) */
        <div className="space-y-6">
          {/* Progress & Compliance Summary Card */}
          <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold rounded">
                    D.S. 005-2012-TR Formato 3 / Ley 29783 Art. 35
                  </span>
                  <span className="px-2.5 py-0.5 bg-indigo-500/10 text-indigo-300 border border-indigo-500/30 text-[10px] font-bold rounded">
                    4 Capacitaciones Mínimas Anuales Exigibles
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white font-sans flex items-center gap-2">
                  <CheckSquare className="w-5 h-5 text-emerald-400" /> Control de Inducciones, Capacitaciones SST y Cargos de EPP
                </h3>
              </div>

              <button
                type="button"
                onClick={() => {
                  setEditingCap(null);
                  setCapFormData({
                    tipo: 'CAPACITACION_SST',
                    titulo: '',
                    fecha: new Date().toISOString().split('T')[0],
                    cumplido: true,
                    horasLectivas: 2,
                    instructorExp: '',
                    observaciones: ''
                  });
                  setShowCapModal(true);
                }}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-emerald-950 flex items-center gap-2 transition-all shrink-0"
              >
                <Plus className="w-4 h-4" /> Registrar Nueva Capacitación / EPP
              </button>
            </div>

            {/* Compliance Progress Bar */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
              <div className="md:col-span-3 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-300 font-semibold">
                    Cumplimiento del Plan Anual de Inducciones y Capacitaciones:
                  </span>
                  <span className="font-mono font-bold text-emerald-400">
                    {capCumplidasCount} de {capacitaciones.length} ejecutados ({capPorcentaje}%)
                  </span>
                </div>
                <div className="w-full bg-slate-900 rounded-full h-3 overflow-hidden border border-slate-800">
                  <div
                    className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full transition-all duration-500 rounded-full"
                    style={{ width: `${capPorcentaje}%` }}
                  />
                </div>
              </div>

              <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 text-center">
                <div className="text-[10px] text-slate-400 uppercase font-bold">Dictamen Auditabilidad</div>
                <div className={`text-base font-extrabold mt-0.5 ${capPorcentaje >= 75 ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {capPorcentaje >= 75 ? '✓ CONFORME SUNAFIL' : '⚠️ REVISIÓN PENDIENTE'}
                </div>
              </div>
            </div>
          </div>

          {/* Filters Bar for Capacitaciones */}
          <div className="bg-slate-900 p-3.5 rounded-xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Buscar por tema, instructor o tipo..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto flex-wrap">
              <div className="flex items-center gap-1.5">
                <Filter className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-slate-400 font-medium">Tipo:</span>
                <select
                  value={filterCapTipo}
                  onChange={(e) => setFilterCapTipo(e.target.value)}
                  className="bg-slate-950 border border-slate-800 text-slate-200 rounded-lg px-2.5 py-1.5 font-semibold focus:outline-none focus:border-emerald-500"
                >
                  <option value="TODOS">TODOS LOS TIPOS</option>
                  <option value="INDUCCION_GENERAL">Inducción General</option>
                  <option value="INDUCCION_ESPECIFICA">Inducción Puesto</option>
                  <option value="CAPACITACION_SST">Capacitaciones SST</option>
                  <option value="ENTREGA_EPP">Cargos de EPP</option>
                  <option value="ENTRENAMIENTO_BRIGADA">Brigada SST</option>
                </select>
              </div>

              <div className="flex items-center gap-1.5">
                <span className="text-slate-400 font-medium">Estado:</span>
                <select
                  value={filterCapEstado}
                  onChange={(e) => setFilterCapEstado(e.target.value)}
                  className="bg-slate-950 border border-slate-800 text-slate-200 rounded-lg px-2.5 py-1.5 font-semibold focus:outline-none focus:border-emerald-500"
                >
                  <option value="TODOS">TODOS LOS ESTADOS</option>
                  <option value="CUMPLIDO">✓ CUMPLIDOS</option>
                  <option value="PENDIENTE">⏳ PENDIENTES</option>
                </select>
              </div>
            </div>
          </div>

          {/* Interactive Capacitaciones & EPP Table List */}
          <div className="space-y-3">
            {filteredCapacitaciones.map((cap) => (
              <div
                key={cap.id}
                className={`bg-slate-950 rounded-2xl border p-4 shadow-lg transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                  cap.cumplido 
                    ? 'border-slate-800 hover:border-emerald-500/50' 
                    : 'border-amber-500/30 bg-amber-950/10 hover:border-amber-500/60'
                }`}
              >
                {/* Left Section: Checkbox + Badges + Title + Date */}
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  {/* Interactive Checkbox Button */}
                  <button
                    type="button"
                    onClick={() => handleToggleCapacitacionCheck(cap.id)}
                    className={`p-1.5 rounded-xl border transition-all shrink-0 mt-0.5 ${
                      cap.cumplido
                        ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40 hover:bg-emerald-500/30'
                        : 'bg-slate-900 text-slate-500 border-slate-800 hover:border-slate-700 hover:text-slate-300'
                    }`}
                    title={cap.cumplido ? 'Marcar como pendiente' : 'Marcar como cumplido / ejecutado'}
                  >
                    {cap.cumplido ? (
                      <CheckSquare className="w-5 h-5 text-emerald-400" />
                    ) : (
                      <Square className="w-5 h-5" />
                    )}
                  </button>

                  <div className="space-y-1.5 min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap text-xs">
                      {getCapacitacionTipoBadge(cap.tipo)}
                      
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        cap.cumplido ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' : 'bg-amber-950 text-amber-300 border border-amber-800'
                      }`}>
                        {cap.cumplido ? '✓ CUMPLIDO' : '⏳ PROGRAMADO'}
                      </span>

                      {cap.horasLectivas && (
                        <span className="text-[10px] font-mono text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                          {cap.horasLectivas}h lectivas
                        </span>
                      )}
                    </div>

                    <h4 className={`text-sm font-bold leading-snug ${cap.cumplido ? 'text-white' : 'text-slate-200'}`}>
                      {cap.titulo}
                    </h4>

                    <div className="flex items-center gap-4 text-xs text-slate-400 flex-wrap">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                        <span>Fecha:</span>
                        <input
                          type="date"
                          value={cap.fecha}
                          onChange={(e) => handleUpdateCapacitacionDate(cap.id, e.target.value)}
                          className="bg-slate-900 text-emerald-400 font-mono font-bold px-2 py-0.5 rounded border border-slate-800 text-xs focus:outline-none focus:border-emerald-500 cursor-pointer"
                        />
                      </div>

                      {cap.instructorExp && (
                        <div className="text-slate-300 truncate">
                          Expositor/Responsable: <span className="font-semibold text-white">{cap.instructorExp}</span>
                        </div>
                      )}
                    </div>

                    {cap.observaciones && (
                      <p className="text-[11px] text-slate-400 italic">
                        {cap.observaciones}
                      </p>
                    )}
                  </div>
                </div>

                {/* Right Section: PDF Sustento Upload & PDF Controls */}
                <div className="flex flex-col sm:flex-row md:flex-col items-stretch sm:items-center md:items-end justify-center gap-2 shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-slate-800">
                  {cap.archivoPdf ? (
                    <div className="bg-slate-900 p-2 rounded-xl border border-slate-800 space-y-1.5 w-full sm:w-auto">
                      <div className="flex items-center justify-between text-[10px] text-slate-400">
                        <span className="font-semibold text-emerald-400">PDF Sustento Adjunto</span>
                        <span className="font-mono text-slate-500">{cap.archivoPdf.fechaSubida}</span>
                      </div>

                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5 truncate max-w-[150px]">
                          <FileText className="w-4 h-4 text-red-400 shrink-0" />
                          <span className="text-slate-200 font-medium truncate text-[11px]" title={cap.archivoPdf.nombreArchivo}>
                            {cap.archivoPdf.nombreArchivo}
                          </span>
                        </div>

                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            type="button"
                            onClick={() => setPreviewPdf(cap.archivoPdf!)}
                            className="p-1.5 bg-indigo-600/20 hover:bg-indigo-600/40 text-indigo-300 border border-indigo-500/30 rounded text-xs font-bold transition-all"
                            title="Previsualizar PDF Sustento"
                          >
                            <Eye className="w-3.5 h-3.5 text-indigo-400" />
                          </button>

                          <a
                            href={cap.archivoPdf.dataUrl}
                            download={cap.archivoPdf.nombreArchivo}
                            className="p-1.5 bg-emerald-600/20 hover:bg-emerald-600/40 text-emerald-300 border border-emerald-500/30 rounded text-xs font-bold transition-all"
                            title="Descargar PDF Sustento"
                          >
                            <Download className="w-3.5 h-3.5 text-emerald-400" />
                          </a>

                          <button
                            type="button"
                            onClick={() => {
                              setCapacitaciones(prev => prev.map(c => c.id === cap.id ? { ...c, archivoPdf: undefined } : c));
                            }}
                            className="p-1 text-slate-500 hover:text-rose-400 rounded transition-colors"
                            title="Eliminar PDF Sustento"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <label className="flex items-center justify-center gap-2 px-3 py-2 bg-slate-900 hover:bg-slate-800 text-slate-300 border border-dashed border-slate-700 hover:border-emerald-500 rounded-xl text-xs font-semibold cursor-pointer transition-all">
                      <Upload className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>Subir Sustento PDF</span>
                      <input
                        type="file"
                        accept="application/pdf"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            handlePdfUpload(file, (pdfData) => {
                              setCapacitaciones(prev => prev.map(c => c.id === cap.id ? { ...c, archivoPdf: pdfData, cumplido: true } : c));
                            });
                          }
                        }}
                      />
                    </label>
                  )}

                  <div className="flex items-center gap-2 justify-end w-full">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingCap(JSON.parse(JSON.stringify(cap)));
                        setCapFormData(JSON.parse(JSON.stringify(cap)));
                        setShowCapModal(true);
                      }}
                      className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-semibold flex items-center gap-1 border border-slate-700 transition-colors"
                    >
                      <Edit3 className="w-3 h-3 text-indigo-400" /> Editar
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        if (confirm(`¿Desea eliminar este registro de capacitación/EPP "${cap.titulo}"?`)) {
                          setCapacitaciones(prev => prev.filter(c => c.id !== cap.id));
                        }
                      }}
                      className="p-1 text-slate-500 hover:text-rose-400 rounded transition-colors"
                      title="Eliminar Capacitación"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODAL CREAR / EDITAR CAPACITACION O REGISTRO DE EPP */}
      {showCapModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-xl p-6 shadow-2xl text-slate-100 my-8 space-y-5">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/20">
                  <CheckSquare className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white font-display">
                    {editingCap ? 'Editar Capacitación / Cargo EPP' : 'Registrar Nueva Inducción / Capacitación / Cargo EPP'}
                  </h3>
                  <p className="text-xs text-slate-400">
                    Soporte oficial exigible por SUNAFIL y D.S. 005-2012-TR Formato 3.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setShowCapModal(false);
                  setEditingCap(null);
                }}
                className="p-1.5 bg-slate-800 text-slate-400 hover:text-white rounded-lg border border-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCapacitacion} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Tipo de Registro:*</label>
                <select
                  value={capFormData.tipo}
                  onChange={(e) => setCapFormData({ ...capFormData, tipo: e.target.value as any })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white font-semibold focus:outline-none focus:border-emerald-500"
                >
                  <option value="INDUCCION_GENERAL">Inducción General SST</option>
                  <option value="INDUCCION_ESPECIFICA">Inducción Específica por Puesto</option>
                  <option value="CAPACITACION_SST">Capacitación SST (Ley 29783 4 Obligatorias)</option>
                  <option value="ENTREGA_EPP">Cargo de Entrega e Inspección EPP</option>
                  <option value="ENTRENAMIENTO_BRIGADA">Entrenamiento Brigada de Emergencia</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Título / Tema Principal:*</label>
                <input
                  type="text"
                  required
                  value={capFormData.titulo}
                  onChange={(e) => setCapFormData({ ...capFormData, titulo: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white font-semibold focus:outline-none focus:border-emerald-500"
                  placeholder="Ej: Capacitación en Primeros Auxilios y RCP Ocupacional"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Fecha de Ejecución / Prog:*</label>
                  <input
                    type="date"
                    required
                    value={capFormData.fecha}
                    onChange={(e) => setCapFormData({ ...capFormData, fecha: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-emerald-400 font-mono font-bold focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Horas Lectivas:</label>
                  <input
                    type="number"
                    value={capFormData.horasLectivas}
                    onChange={(e) => setCapFormData({ ...capFormData, horasLectivas: Number(e.target.value) })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Estado de Ejecución:</label>
                  <select
                    value={capFormData.cumplido ? 'CUMPLIDO' : 'PENDIENTE'}
                    onChange={(e) => setCapFormData({ ...capFormData, cumplido: e.target.value === 'CUMPLIDO' })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white font-bold focus:outline-none focus:border-emerald-500"
                  >
                    <option value="CUMPLIDO">✓ CUMPLIDO</option>
                    <option value="PENDIENTE">⏳ PENDIENTE</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Expositor / Responsable SST:</label>
                <input
                  type="text"
                  value={capFormData.instructorExp || ''}
                  onChange={(e) => setCapFormData({ ...capFormData, instructorExp: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white focus:outline-none focus:border-emerald-500"
                  placeholder="Ej: Ing. SST Carlos Mendoza (CIP 184520)"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Observaciones / Notas:</label>
                <textarea
                  rows={2}
                  value={capFormData.observaciones || ''}
                  onChange={(e) => setCapFormData({ ...capFormData, observaciones: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white focus:outline-none focus:border-emerald-500 resize-none"
                  placeholder="Detalles sobre asistencia, cargos firmados o alcance..."
                />
              </div>

              {/* PDF Document Upload */}
              <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
                <label className="block text-slate-300 font-semibold">Adjuntar Sustento PDF (Firma / Lista / Acta):</label>
                {capFormData.archivoPdf ? (
                  <div className="flex items-center justify-between p-2.5 bg-slate-900 border border-emerald-500/30 rounded-lg">
                    <div className="flex items-center gap-2 truncate">
                      <FileText className="w-4 h-4 text-red-400 shrink-0" />
                      <span className="text-slate-200 font-semibold truncate">{capFormData.archivoPdf.nombreArchivo}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setCapFormData({ ...capFormData, archivoPdf: undefined })}
                      className="p-1 text-slate-400 hover:text-rose-400"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <label className="flex items-center justify-center gap-2 p-3 bg-slate-900 border border-dashed border-slate-700 hover:border-emerald-500 rounded-lg text-slate-300 cursor-pointer transition-colors">
                    <Upload className="w-4 h-4 text-emerald-400" />
                    <span>Cargar archivo PDF de sustento (Firmas/Asistencia)</span>
                    <input
                      type="file"
                      accept="application/pdf"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          handlePdfUpload(file, (pdfData) => {
                            setCapFormData({ ...capFormData, archivoPdf: pdfData, cumplido: true });
                          });
                        }
                      }}
                    />
                  </label>
                )}
              </div>

              <div className="pt-4 border-t border-slate-800 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowCapModal(false);
                    setEditingCap(null);
                  }}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg font-medium hover:bg-slate-700 transition-all"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold flex items-center gap-2 shadow-lg shadow-emerald-950 transition-all"
                >
                  <Save className="w-4 h-4" /> Guardar Registro
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL EDITAR FORMATO LEGAL */}
      {editingReport && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-xl p-6 shadow-2xl text-slate-100 my-8 space-y-5">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/20">
                  <Edit3 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white font-display">
                    Editar Formato Legal Oficial ({editingReport.codigoFormat})
                  </h3>
                  <p className="text-xs text-slate-400">
                    Modifique los parámetros legales, norma base y observaciones de fiscalización.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setEditingReport(null)}
                className="p-1.5 bg-slate-800 text-slate-400 hover:text-white rounded-lg border border-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-slate-300 font-semibold mb-1">Título del Reporte / Registro:</label>
                  <input
                    type="text"
                    required
                    value={editingReport.titulo}
                    onChange={(e) => setEditingReport({ ...editingReport, titulo: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white font-semibold focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Código Formato:</label>
                  <input
                    type="text"
                    required
                    value={editingReport.codigoFormat}
                    onChange={(e) => setEditingReport({ ...editingReport, codigoFormat: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white font-mono focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Norma Base Legal:</label>
                  <input
                    type="text"
                    required
                    value={editingReport.normaBase}
                    onChange={(e) => setEditingReport({ ...editingReport, normaBase: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Entidad Receptora:</label>
                  <select
                    value={editingReport.entidadReceptora}
                    onChange={(e) => setEditingReport({ ...editingReport, entidadReceptora: e.target.value as any })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white font-semibold focus:outline-none focus:border-emerald-500"
                  >
                    <option value="SUNAFIL">SUNAFIL</option>
                    <option value="MINSA / DIGESA">MINSA / DIGESA</option>
                    <option value="MTPE">MTPE</option>
                    <option value="ESSALUD">EsSalud</option>
                    <option value="COMITE_SST">Comité SST</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Estado Legal:</label>
                  <select
                    value={editingReport.estado}
                    onChange={(e) => setEditingReport({ ...editingReport, estado: e.target.value as any })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white font-semibold focus:outline-none focus:border-emerald-500"
                  >
                    <option value="APROBADO">APROBADO</option>
                    <option value="ENVIADO">ENVIADO</option>
                    <option value="EN_REVISION">EN REVISIÓN</option>
                    <option value="OBSERVADO">OBSERVADO</option>
                    <option value="PENDIENTE">PENDIENTE</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Descripción y Propósito:</label>
                <textarea
                  rows={3}
                  value={editingReport.descripcion}
                  onChange={(e) => setEditingReport({ ...editingReport, descripcion: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white focus:outline-none focus:border-emerald-500 resize-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Observaciones / Dictamen de Auditoría:</label>
                <input
                  type="text"
                  value={editingReport.observaciones || ''}
                  onChange={(e) => setEditingReport({ ...editingReport, observaciones: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white focus:outline-none focus:border-emerald-500"
                  placeholder="Notas de revisión del médico ocupacional o comité SST..."
                />
              </div>

              {/* PDF Document Upload in Edit Modal */}
              <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
                <label className="block text-slate-300 font-semibold">Evidencia / Sustento en PDF:</label>
                {editingReport.archivoPdf ? (
                  <div className="flex items-center justify-between p-2.5 bg-slate-900 border border-emerald-500/30 rounded-lg">
                    <div className="flex items-center gap-2 truncate">
                      <FileText className="w-4 h-4 text-red-400 shrink-0" />
                      <span className="text-slate-200 font-semibold truncate">{editingReport.archivoPdf.nombreArchivo}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setEditingReport({ ...editingReport, archivoPdf: undefined })}
                      className="p-1 text-slate-400 hover:text-rose-400"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <label className="flex items-center justify-center gap-2 p-3 bg-slate-900 border border-dashed border-slate-700 hover:border-emerald-500 rounded-lg text-slate-300 cursor-pointer transition-colors">
                    <Upload className="w-4 h-4 text-emerald-400" />
                    <span>Cargar nuevo archivo PDF de sustento</span>
                    <input
                      type="file"
                      accept="application/pdf"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          handlePdfUpload(file, (pdfData) => {
                            setEditingReport({ ...editingReport, archivoPdf: pdfData });
                          });
                        }
                      }}
                    />
                  </label>
                )}
              </div>

              <div className="pt-4 border-t border-slate-800 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingReport(null)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg font-medium hover:bg-slate-700 transition-all"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold flex items-center gap-2 shadow-lg shadow-emerald-900/40 transition-all"
                >
                  <Save className="w-4 h-4" /> Guardar Cambios
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL CREAR NUEVO FORMATO LEGAL */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-xl p-6 shadow-2xl text-slate-100 my-8 space-y-5">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/20">
                  <Plus className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white font-display">
                    Registrar Nuevo Formato u Ordenanza Legal SST
                  </h3>
                  <p className="text-xs text-slate-400">
                    Añada nuevos requerimientos de SUNAFIL, DIGESA, MINSA o normas internas.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="p-1.5 bg-slate-800 text-slate-400 hover:text-white rounded-lg border border-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateReport} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-slate-300 font-semibold mb-1">Título del Formato / Registro:*</label>
                  <input
                    type="text"
                    required
                    value={newReportData.titulo}
                    onChange={(e) => setNewReportData({ ...newReportData, titulo: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white font-semibold focus:outline-none focus:border-emerald-500"
                    placeholder="Ej: Registro de Monitoreo de Agentes Físicos"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Código Formato:*</label>
                  <input
                    type="text"
                    required
                    value={newReportData.codigoFormat}
                    onChange={(e) => setNewReportData({ ...newReportData, codigoFormat: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white font-mono focus:outline-none focus:border-emerald-500"
                    placeholder="Ej: RM-050-FORMATO-4"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Norma Base Legal:</label>
                  <input
                    type="text"
                    required
                    value={newReportData.normaBase}
                    onChange={(e) => setNewReportData({ ...newReportData, normaBase: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Entidad Receptora:</label>
                  <select
                    value={newReportData.entidadReceptora}
                    onChange={(e) => setNewReportData({ ...newReportData, entidadReceptora: e.target.value as any })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white font-semibold focus:outline-none focus:border-emerald-500"
                  >
                    <option value="SUNAFIL">SUNAFIL</option>
                    <option value="MINSA / DIGESA">MINSA / DIGESA</option>
                    <option value="MTPE">MTPE</option>
                    <option value="ESSALUD">EsSalud</option>
                    <option value="COMITE_SST">Comité SST</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Estado Legal Inicial:</label>
                  <select
                    value={newReportData.estado}
                    onChange={(e) => setNewReportData({ ...newReportData, estado: e.target.value as any })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white font-semibold focus:outline-none focus:border-emerald-500"
                  >
                    <option value="APROBADO">APROBADO</option>
                    <option value="ENVIADO">ENVIADO</option>
                    <option value="EN_REVISION">EN REVISIÓN</option>
                    <option value="OBSERVADO">OBSERVADO</option>
                    <option value="PENDIENTE">PENDIENTE</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Descripción y Propósito:</label>
                <textarea
                  rows={3}
                  value={newReportData.descripcion}
                  onChange={(e) => setNewReportData({ ...newReportData, descripcion: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white focus:outline-none focus:border-emerald-500 resize-none"
                  placeholder="Detalle el contenido y requerimientos del formato..."
                />
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Adjuntar Evidencia PDF Inicial (Opcional)</label>
                {newReportData.archivoPdf ? (
                  <div className="flex items-center justify-between p-2.5 bg-slate-900 border border-emerald-500/30 rounded-lg">
                    <div className="flex items-center gap-2 truncate">
                      <FileText className="w-4 h-4 text-red-400 shrink-0" />
                      <span className="text-slate-200 font-medium truncate">{newReportData.archivoPdf.nombreArchivo}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setNewReportData({ ...newReportData, archivoPdf: undefined })}
                      className="p-1 text-slate-400 hover:text-red-400"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <label className="flex items-center justify-center gap-2 p-3 bg-slate-900 border border-dashed border-slate-700 hover:border-emerald-500 rounded-lg text-slate-300 cursor-pointer transition-colors">
                    <Upload className="w-4 h-4 text-emerald-400" />
                    <span>Adjuntar Formato o Evidencia en PDF</span>
                    <input
                      type="file"
                      accept="application/pdf"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          handlePdfUpload(file, (pdfData) => {
                            setNewReportData({ ...newReportData, archivoPdf: pdfData });
                          });
                        }
                      }}
                    />
                  </label>
                )}
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg font-medium hover:bg-slate-700 transition-all"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold flex items-center gap-2 shadow-lg shadow-emerald-900/40 transition-all"
                >
                  <Plus className="w-4 h-4" /> Crear Formato Legal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL CREAR / EDITAR FICHA FNO ENFERMEDADES OCUPACIONALES */}
      {showFnoModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-3xl my-8 p-6 shadow-2xl space-y-5 text-slate-100">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-rose-500/10 text-rose-400 rounded-lg border border-rose-500/20">
                  <Stethoscope className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white font-sans">
                    {editingFnoRecord ? 'Editar Ficha FNO de Enfermedad Ocupacional' : 'Registrar Nueva Ficha FNO (R.M. 480-2008-MINSA)'}
                  </h3>
                  <p className="text-xs text-slate-400">
                    Notificación y Dictamen de Enfermedad Profesional con Codificación CIE-10 y Sustento PDF
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowFnoModal(false);
                  setEditingFnoRecord(null);
                }}
                className="p-1.5 bg-slate-800 text-slate-400 hover:text-white rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveFnoRecord} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">Código FNO / Registro</label>
                  <input
                    type="text"
                    required
                    value={fnoFormData.codigoFNO || ''}
                    onChange={(e) => setFnoFormData({ ...fnoFormData, codigoFNO: e.target.value })}
                    className="w-full p-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-rose-500 font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">Trabajador (Nombres y Apellidos)</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej: Carlos Huamán Mendoza"
                    value={fnoFormData.trabajadorNombre || ''}
                    onChange={(e) => setFnoFormData({ ...fnoFormData, trabajadorNombre: e.target.value })}
                    className="w-full p-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-rose-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">N° Documento (DNI / CE)</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej: 45892104"
                    value={fnoFormData.numeroDocumento || ''}
                    onChange={(e) => setFnoFormData({ ...fnoFormData, numeroDocumento: e.target.value })}
                    className="w-full p-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-rose-500 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">Puesto de Trabajo</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej: Operador de Chancadora"
                    value={fnoFormData.puestoTrabajo || ''}
                    onChange={(e) => setFnoFormData({ ...fnoFormData, puestoTrabajo: e.target.value })}
                    className="w-full p-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-rose-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">Agente de Riesgo Ocupacional</label>
                  <select
                    value={fnoFormData.agenteRiesgo || 'FISICO'}
                    onChange={(e) => setFnoFormData({ ...fnoFormData, agenteRiesgo: e.target.value as AgenteRiesgoFNO })}
                    className="w-full p-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-rose-500 font-bold"
                  >
                    <option value="FISICO">FÍSICO (Ruido, Vibración, Radiación)</option>
                    <option value="QUIMICO">QUÍMICO (Polvo, Gases, Vapores, Humos)</option>
                    <option value="BIOLOGICO">BIOLÓGICO (Virus, Bacterias, Hongos)</option>
                    <option value="ERGONOMICO">ERGONÓMICO (Mov. Repetitivo, Cargas)</option>
                    <option value="PSICOSOCIAL">PSICOSOCIAL (Estrés, Sobrecarga laboral)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">Código CIE-10 (MINSA)</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej: H83.3 / J62.8 / M65.4"
                    value={fnoFormData.codigoCIE10 || ''}
                    onChange={(e) => setFnoFormData({ ...fnoFormData, codigoCIE10: e.target.value })}
                    className="w-full p-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-rose-500 font-mono font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">Diagnóstico Médico Ocupacional</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej: Hipoacusia Neurosensorial Inducida por Ruido Bilateral"
                    value={fnoFormData.enfermedadOcupacional || ''}
                    onChange={(e) => setFnoFormData({ ...fnoFormData, enfermedadOcupacional: e.target.value })}
                    className="w-full p-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-rose-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">Factor / Agente Específico Medido</label>
                  <input
                    type="text"
                    placeholder="Ej: Exposición continuada a ruido impulsivo > 89 dBA"
                    value={fnoFormData.agenteEspecifico || ''}
                    onChange={(e) => setFnoFormData({ ...fnoFormData, agenteEspecifico: e.target.value })}
                    className="w-full p-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-rose-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">Fecha de Diagnóstico</label>
                  <input
                    type="date"
                    required
                    value={fnoFormData.fechaDiagnostico || ''}
                    onChange={(e) => setFnoFormData({ ...fnoFormData, fechaDiagnostico: e.target.value })}
                    className="w-full p-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-rose-500 font-bold"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">Fecha Notificación MINSA/DIGESA</label>
                  <input
                    type="date"
                    required
                    value={fnoFormData.fechaNotificacionMINSA || ''}
                    onChange={(e) => setFnoFormData({ ...fnoFormData, fechaNotificacionMINSA: e.target.value })}
                    className="w-full p-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-rose-500 font-bold"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">Estado Legal FNO</label>
                  <select
                    value={fnoFormData.estado || 'NOTIFICADO_DIGESA'}
                    onChange={(e) => setFnoFormData({ ...fnoFormData, estado: e.target.value as EstadoFNORegistro })}
                    className="w-full p-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-rose-500 font-bold"
                  >
                    <option value="NOTIFICADO_DIGESA">NOTIFICADO DIGESA</option>
                    <option value="CONFIRMADO">CONFIRMADO</option>
                    <option value="EN_EVALUACION_SATEP">EN EVALUACIÓN SATEP</option>
                    <option value="SOSPECHOSO">SOSPECHOSO</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">Grado de Incapacidad</label>
                  <input
                    type="text"
                    placeholder="Ej: Incapacidad Parcial Permanente (18%)"
                    value={fnoFormData.gradoIncapacidad || ''}
                    onChange={(e) => setFnoFormData({ ...fnoFormData, gradoIncapacidad: e.target.value })}
                    className="w-full p-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-rose-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">Médico Ocupacional Notificante</label>
                  <input
                    type="text"
                    placeholder="Ej: Dr. Alejandro Morales Ramos"
                    value={fnoFormData.medicoNotificante || ''}
                    onChange={(e) => setFnoFormData({ ...fnoFormData, medicoNotificante: e.target.value })}
                    className="w-full p-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-rose-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">Colegiatura CMP / RNM</label>
                  <input
                    type="text"
                    placeholder="Ej: CMP 45120 / RNM 1845"
                    value={fnoFormData.cmpMedico || ''}
                    onChange={(e) => setFnoFormData({ ...fnoFormData, cmpMedico: e.target.value })}
                    className="w-full p-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-rose-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1">Observaciones / Dictamen SATEP</label>
                <textarea
                  rows={2}
                  placeholder="Detalles sobre reubicación laboral, pruebas audiométricas/placa OIT, tratamiento..."
                  value={fnoFormData.observaciones || ''}
                  onChange={(e) => setFnoFormData({ ...fnoFormData, observaciones: e.target.value })}
                  className="w-full p-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-rose-500"
                />
              </div>

              {/* PDF Document Upload in Modal */}
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                <span className="text-[11px] font-bold text-slate-300 block">Sustento Documental (Ficha FNO Escaneada / PDF)</span>
                {fnoFormData.archivoPdf ? (
                  <div className="flex items-center justify-between p-2 bg-slate-900 rounded-lg border border-slate-800">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-emerald-400" />
                      <span className="text-xs font-mono text-slate-200 truncate max-w-xs">{fnoFormData.archivoPdf.nombreArchivo}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setFnoFormData({ ...fnoFormData, archivoPdf: undefined })}
                      className="p-1 text-rose-400 hover:text-rose-300"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <label className="flex items-center justify-center gap-2 p-3 bg-slate-900 border border-dashed border-slate-800 hover:border-rose-500 rounded-lg text-slate-300 cursor-pointer transition-colors">
                    <Upload className="w-4 h-4 text-rose-400" />
                    <span>Seleccionar archivo Ficha FNO o Dictamen en PDF</span>
                    <input
                      type="file"
                      accept=".pdf,application/pdf"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          handlePdfUpload(file, (pdfObj) => {
                            setFnoFormData({ ...fnoFormData, archivoPdf: pdfObj });
                          });
                        }
                      }}
                    />
                  </label>
                )}
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowFnoModal(false);
                    setEditingFnoRecord(null);
                  }}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg font-medium hover:bg-slate-700 transition-all"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-lg font-bold flex items-center gap-2 shadow-lg shadow-rose-950 transition-all"
                >
                  <Save className="w-4 h-4" /> {editingFnoRecord ? 'Guardar Cambios' : 'Registrar Ficha FNO'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL PREVISUALIZADOR PDF EMBEBIDO */}
      {previewPdf && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-4xl h-[85vh] flex flex-col shadow-2xl overflow-hidden text-slate-100">
            {/* Modal Header */}
            <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-500/10 text-red-400 rounded-lg border border-red-500/20">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white truncate max-w-md font-sans">
                    {previewPdf.nombreArchivo}
                  </h3>
                  <p className="text-[10px] text-slate-400">
                    Sustento Documentario PDF · Fecha Subida: {previewPdf.fechaSubida}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={previewPdf.dataUrl}
                  download={previewPdf.nombreArchivo}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg text-xs flex items-center gap-1.5 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" /> Descargar PDF
                </a>

                <button
                  onClick={() => setPreviewPdf(null)}
                  className="p-1.5 bg-slate-800 text-slate-400 hover:text-white rounded-lg border border-slate-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal PDF Viewer Body */}
            <div className="flex-1 bg-slate-950 p-2 overflow-hidden">
              <iframe
                src={previewPdf.dataUrl}
                title={previewPdf.nombreArchivo}
                className="w-full h-full rounded-lg border border-slate-800 bg-white"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
