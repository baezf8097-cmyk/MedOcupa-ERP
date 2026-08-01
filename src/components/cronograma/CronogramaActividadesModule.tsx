import React, { useState, useMemo } from 'react';
import { Empresa } from '../../types/erp';
import { 
  Calendar, GraduationCap, Clock, CheckCircle2, AlertTriangle, Plus, 
  Search, Filter, Edit3, Save, X, Download, UserCheck, ShieldCheck, 
  Building2, Users, FileText, ChevronLeft, ChevronRight, Activity, 
  Sparkles, Stethoscope, Syringe, Eye, Trash2, CalendarDays
} from 'lucide-react';

export interface ActividadCronograma {
  id: string;
  titulo: string;
  tipo: 'CAPACITACION' | 'CAMPAÑA_SALUD' | 'MONITOREO_HIGIENICO' | 'INMUNIZACION' | 'INSPECCION_AUDITORIA';
  fecha: string; // YYYY-MM-DD
  hora?: string;
  lugar?: string;
  responsable: string;
  dirigidoA: string;
  duracionHoras: number;
  asistentesEstimados: number;
  asistentesReales?: number;
  estado: 'PROGRAMADO' | 'EN_EJECUCION' | 'COMPLETADO' | 'REPROGRAMADO' | 'CANCELADO';
  empresaId?: string;
  observaciones?: string;
  normaReferencia?: string;
}

interface CronogramaActividadesModuleProps {
  empresas?: Empresa[];
  selectedEmpresaId?: string;
  onNavigateToCapacitaciones?: () => void;
}

const INITIAL_ACTIVIDADES: ActividadCronograma[] = [
  {
    id: 'act-1',
    titulo: 'Inducción General en Salud Ocupacional, Derechos y Deberes SST',
    tipo: 'CAPACITACION',
    fecha: '2026-01-15',
    hora: '09:00 - 11:00',
    lugar: 'Auditorio Principal / Vía Zoom',
    responsable: 'Dr. Alejandro Morales (CMP 45120)',
    dirigidoA: 'Personal Nuevo Ingreso y Contratistas',
    duracionHoras: 2,
    asistentesEstimados: 150,
    asistentesReales: 142,
    estado: 'COMPLETADO',
    empresaId: 'emp-1',
    normaReferencia: 'Ley 29783 Art. 35',
    observaciones: 'Evaluación de entrada y salida con 98% de aprobación.'
  },
  {
    id: 'act-2',
    titulo: 'Taller de Ergonomía, Pausas Activas y Manejo Manual de Cargas',
    tipo: 'CAPACITACION',
    fecha: '2026-02-20',
    hora: '10:30 - 12:00',
    lugar: 'Sala de Capacitación Planta A',
    responsable: 'Dra. Carmen Alva (Ergónoma Ocupacional)',
    dirigidoA: 'Personal de Almacén, Operaciones y Logística',
    duracionHoras: 1.5,
    asistentesEstimados: 100,
    asistentesReales: 98,
    estado: 'COMPLETADO',
    empresaId: 'emp-1',
    normaReferencia: 'R.M. 375-2008-TR Ergonomía',
    observaciones: 'Demostración práctica de levantamiento correcto de peso (máx 25kg).'
  },
  {
    id: 'act-3',
    titulo: 'Programa de Conservación Auditiva y Uso Correcto de EPP Auditivo',
    tipo: 'CAPACITACION',
    fecha: '2026-03-10',
    hora: '14:00 - 16:00',
    lugar: 'Área de Chancado y Mantenimiento',
    responsable: 'Ing. SST Fernando Soto',
    dirigidoA: 'Trabajadores expuestos a ruido > 85 dBA',
    duracionHoras: 2,
    asistentesEstimados: 90,
    asistentesReales: 85,
    estado: 'COMPLETADO',
    empresaId: 'emp-1',
    normaReferencia: 'R.M. 375-2008-TR',
    observaciones: 'Ajuste de protectores tipo copa e inserción con prueba fit-test.'
  },
  {
    id: 'act-4',
    titulo: 'Campaña de Tamizaje Biológico, Presión Arterial y Glucosa',
    tipo: 'CAMPAÑA_SALUD',
    fecha: '2026-04-05',
    hora: '07:30 - 12:00',
    lugar: 'Tópico de Medicina Ocupacional',
    responsable: 'Lic. Enf. Patricia Vargas (CEP 58912)',
    dirigidoA: 'Población con factores de riesgo metabólico / cardiovascular',
    duracionHoras: 4.5,
    asistentesEstimados: 120,
    asistentesReales: 115,
    estado: 'COMPLETADO',
    empresaId: 'emp-1',
    normaReferencia: 'Ley 30021 Alimentación Saludable',
    observaciones: 'Identificación de 14 trabajadores para plan de nutrición intensivo.'
  },
  {
    id: 'act-5',
    titulo: 'Prevención de Riesgos Psicosociales, Estrés Laboral y Burnout',
    tipo: 'CAPACITACION',
    fecha: '2026-04-18',
    hora: '15:00 - 17:00',
    lugar: 'Salón Multiusos / Virtual',
    responsable: 'Ps. Carmen Rosa Mendoza',
    dirigidoA: 'Personal Administrativo, Jefaturas y Supervisores',
    duracionHoras: 2,
    asistentesEstimados: 110,
    asistentesReales: 110,
    estado: 'COMPLETADO',
    empresaId: 'emp-1',
    normaReferencia: 'Ley 29783 / ISTAS 21',
    observaciones: 'Encuesta de clima organizacional aplicada.'
  },
  {
    id: 'act-6',
    titulo: 'Estilos de Vida Saludable, Nutrición Ocupacional y Síndrome Metabólico',
    tipo: 'CAPACITACION',
    fecha: '2026-05-22',
    hora: '11:00 - 12:30',
    lugar: 'Comedor Central de Planta',
    responsable: 'Nut. Sofía Paredes',
    dirigidoA: 'Toda la Población Ocupacional',
    duracionHoras: 1.5,
    asistentesEstimados: 130,
    asistentesReales: 120,
    estado: 'COMPLETADO',
    empresaId: 'emp-1',
    normaReferencia: 'D.S. 005-2012-TR',
    observaciones: 'Publicación de semáforo nutricional en concesionario de alimentos.'
  },
  {
    id: 'act-7',
    titulo: 'Monitoreo Higiénico de Agentes Físicos (Ruido, Iluminación y WBGT)',
    tipo: 'MONITOREO_HIGIENICO',
    fecha: '2026-06-08',
    hora: '08:00 - 17:00',
    lugar: 'Áreas Operativas, Minas y Talleres',
    responsable: 'Ing. SST Fernando Soto / Lab Acreditado',
    dirigidoA: 'Zonas Críticas Operativas',
    duracionHoras: 8,
    asistentesEstimados: 0,
    asistentesReales: 0,
    estado: 'COMPLETADO',
    empresaId: 'emp-1',
    normaReferencia: 'R.M. 050-2013-TR Formato 4',
    observaciones: 'Informe de monitoreo con certificado de calibración dosimétrica.'
  },
  {
    id: 'act-8',
    titulo: 'Prevención de Fatiga y Somnolencia en Operaciones de Alto Riesgo',
    tipo: 'CAPACITACION',
    fecha: '2026-06-14',
    hora: '08:00 - 10:00',
    lugar: 'Sala de Conductores y Maquinaria Pesada',
    responsable: 'Dr. Alejandro Morales (CMP 45120)',
    dirigidoA: 'Conductores de Transporte, Camiones y Carga Pesada',
    duracionHoras: 2,
    asistentesEstimados: 70,
    asistentesReales: 64,
    estado: 'COMPLETADO',
    empresaId: 'emp-1',
    normaReferencia: 'D.S. 024-2016-EM Minería',
    observaciones: 'Uso de test de alerta y control de apnea del sueño.'
  },
  {
    id: 'act-9',
    titulo: 'Jornada de Inmunizaciones Ocupacionales (Dosis Influenza y Hepatitis B)',
    tipo: 'INMUNIZACION',
    fecha: '2026-07-02',
    hora: '08:00 - 13:00',
    lugar: 'Tópico de Salud Ocupacional',
    responsable: 'Lic. Enf. Patricia Vargas (CEP 58912)',
    dirigidoA: 'Personal de Tópico, Limpieza, Laboratorio y Almacén',
    duracionHoras: 5,
    asistentesEstimados: 80,
    asistentesReales: 76,
    estado: 'COMPLETADO',
    empresaId: 'emp-1',
    normaReferencia: 'Norma Técnica MINSA Vacunación',
    observaciones: 'Registro unificado en carné de vacunas digital.'
  },
  {
    id: 'act-10',
    titulo: 'Primeros Auxilios, RCP Básico y Manejo de Emergencias Médicas en Planta',
    tipo: 'CAPACITACION',
    fecha: '2026-07-05',
    hora: '09:00 - 13:00',
    lugar: 'Patio de Maniobras / Tópico',
    responsable: 'Lic. Enf. Patricia Vargas',
    dirigidoA: 'Brigadistas de Salud y Primeros Auxilios',
    duracionHoras: 4,
    asistentesEstimados: 50,
    asistentesReales: 45,
    estado: 'COMPLETADO',
    empresaId: 'emp-1',
    normaReferencia: 'D.S. 005-2012-TR Art. 33',
    observaciones: 'Práctica con maniquí de reanimación y uso de desfibrilador DEA.'
  },
  {
    id: 'act-11',
    titulo: 'Prevención del Alcoholismo, Drogadicción y Tabaquismo en el Trabajo',
    tipo: 'CAPACITACION',
    fecha: '2026-08-12',
    hora: '10:00 - 12:00',
    lugar: 'Auditorio Central / Vía Teams',
    responsable: 'Ps. Carmen Rosa Mendoza',
    dirigidoA: 'Toda la Población Trabajadora',
    duracionHoras: 2,
    asistentesEstimados: 140,
    estado: 'PROGRAMADO',
    empresaId: 'emp-1',
    normaReferencia: 'D.S. 007-2007-TR',
    observaciones: 'Próxima sesión programada para agosto 2026.'
  },
  {
    id: 'act-12',
    titulo: 'Protección contra Radiación Solar UV y Estrés Térmico en Campo',
    tipo: 'CAPACITACION',
    fecha: '2026-09-10',
    hora: '11:00 - 12:30',
    lugar: 'Comedor de Campo y Oficinas',
    responsable: 'Dr. Alejandro Morales (CMP 45120)',
    dirigidoA: 'Personal a la intemperie y trabajos de campo',
    duracionHoras: 1.5,
    asistentesEstimados: 120,
    estado: 'PROGRAMADO',
    empresaId: 'emp-1',
    normaReferencia: 'Ley 30102 Radiación Solar',
    observaciones: 'Entrega de bloqueador solar FPS 50+ y sombreros cortaviento.'
  },
  {
    id: 'act-13',
    titulo: 'Campaña de Salud Mental y Taller Anti-Estrés Laboral',
    tipo: 'CAMPAÑA_SALUD',
    fecha: '2026-10-15',
    hora: '09:00 - 13:00',
    lugar: 'Áreas Comunes / Tópico',
    responsable: 'Ps. Carmen Rosa Mendoza',
    dirigidoA: 'Todo el Personal Administrativo y Operativo',
    duracionHoras: 4,
    asistentesEstimados: 150,
    estado: 'PROGRAMADO',
    empresaId: 'emp-1',
    normaReferencia: 'Ley 30947 Salud Mental',
    observaciones: 'Evaluaciones individuales y técnicas de respiración diafragmática.'
  },
  {
    id: 'act-14',
    titulo: 'Auditoría Anual de Salud Ocupacional y Verificación de Registros SUNAFIL',
    tipo: 'INSPECCION_AUDITORIA',
    fecha: '2026-11-20',
    hora: '08:30 - 16:30',
    lugar: 'Oficina SST / Comité SST',
    responsable: 'Auditor Externo Registro MTPE / Dr. Alejandro Morales',
    dirigidoA: 'Comité Paritario SST y Medicina Ocupacional',
    duracionHoras: 8,
    asistentesEstimados: 12,
    estado: 'PROGRAMADO',
    empresaId: 'emp-1',
    normaReferencia: 'D.S. 014-2013-TR Auditorías SST',
    observaciones: 'Verificación del 100% de expedientes y 10 Pilares de la Guía Maestra.'
  }
];

export const CronogramaActividadesModule: React.FC<CronogramaActividadesModuleProps> = ({
  empresas = [],
  selectedEmpresaId = 'TODAS',
  onNavigateToCapacitaciones
}) => {
  const [actividades, setActividades] = useState<ActividadCronograma[]>(INITIAL_ACTIVIDADES);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('TODOS');
  const [selectedStatus, setSelectedStatus] = useState<string>('TODOS');
  const [viewMode, setViewMode] = useState<'CALENDARIO' | 'LISTA'>('CALENDARIO');

  // Calendar Month State (Year 2026)
  const [currentDate, setCurrentDate] = useState<Date>(new Date(2026, 7, 1)); // August 2026

  // Edit Date Modal State
  const [editingAct, setEditingAct] = useState<ActividadCronograma | null>(null);
  const [editFormDate, setEditFormDate] = useState<string>('');
  const [editFormHora, setEditFormHora] = useState<string>('');
  const [editFormLugar, setEditFormLugar] = useState<string>('');
  const [editFormResponsable, setEditFormResponsable] = useState<string>('');
  const [editFormEstado, setEditFormEstado] = useState<'PROGRAMADO' | 'EN_EJECUCION' | 'COMPLETADO' | 'REPROGRAMADO' | 'CANCELADO'>('PROGRAMADO');
  const [editFormObs, setEditFormObs] = useState<string>('');

  // New Activity Modal State
  const [newModalOpen, setNewModalOpen] = useState(false);
  const [newFormData, setNewFormData] = useState<Partial<ActividadCronograma>>({
    titulo: '',
    tipo: 'CAPACITACION',
    fecha: new Date(2026, 7, 15).toISOString().split('T')[0],
    hora: '09:00 - 11:00',
    lugar: 'Auditorio Central / Tópico',
    responsable: 'Dr. Alejandro Morales (CMP 45120)',
    dirigidoA: 'Toda la Población Ocupacional',
    duracionHoras: 2,
    asistentesEstimados: 100,
    estado: 'PROGRAMADO',
    normaReferencia: 'Ley 29783 Art. 35'
  });

  // Filtered dataset
  const filteredActividades = useMemo(() => {
    return actividades.filter(act => {
      if (selectedEmpresaId !== 'TODAS' && act.empresaId && act.empresaId !== selectedEmpresaId) {
        return false;
      }
      if (selectedType !== 'TODOS' && act.tipo !== selectedType) {
        return false;
      }
      if (selectedStatus !== 'TODOS' && act.estado !== selectedStatus) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = act.titulo.toLowerCase().includes(q);
        const matchesResp = act.responsable.toLowerCase().includes(q);
        const matchesNorma = (act.normaReferencia || '').toLowerCase().includes(q);
        if (!matchesTitle && !matchesResp && !matchesNorma) return false;
      }
      return true;
    });
  }, [actividades, selectedEmpresaId, selectedType, selectedStatus, searchQuery]);

  // Upcoming Capacitaciones / Activities
  const proximasCapacitaciones = useMemo(() => {
    return actividades
      .filter(a => a.estado === 'PROGRAMADO' || a.estado === 'REPROGRAMADO')
      .sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime());
  }, [actividades]);

  // Calendar Days Helper
  const monthDays = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);

    const startingDayOfWeek = (firstDayOfMonth.getDay() + 6) % 7; // Monday = 0
    const totalDays = lastDayOfMonth.getDate();

    const days: { dateStr: string; dayNum: number; isCurrentMonth: boolean; events: ActividadCronograma[] }[] = [];

    // Previous month padding
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      const dayNum = prevMonthLastDay - i;
      const prevDate = new Date(year, month - 1, dayNum);
      const dateStr = prevDate.toISOString().split('T')[0];
      days.push({
        dateStr,
        dayNum,
        isCurrentMonth: false,
        events: actividades.filter(a => a.fecha === dateStr)
      });
    }

    // Current month days
    for (let day = 1; day <= totalDays; day++) {
      const dateObj = new Date(year, month, day);
      // Format YYYY-MM-DD cleanly using local numbers
      const mStr = String(month + 1).padStart(2, '0');
      const dStr = String(day).padStart(2, '0');
      const dateStr = `${year}-${mStr}-${dStr}`;

      days.push({
        dateStr,
        dayNum: day,
        isCurrentMonth: true,
        events: actividades.filter(a => a.fecha === dateStr)
      });
    }

    // Next month padding to complete 35 or 42 grid cells
    const remaining = (7 - (days.length % 7)) % 7;
    for (let j = 1; j <= remaining; j++) {
      const nextDate = new Date(year, month + 1, j);
      const dateStr = nextDate.toISOString().split('T')[0];
      days.push({
        dateStr,
        dayNum: j,
        isCurrentMonth: false,
        events: actividades.filter(a => a.fecha === dateStr)
      });
    }

    return days;
  }, [currentDate, actividades]);

  // Open Edit Date Modal
  const handleOpenEditModal = (act: ActividadCronograma) => {
    setEditingAct(act);
    setEditFormDate(act.fecha);
    setEditFormHora(act.hora || '09:00 - 11:00');
    setEditFormLugar(act.lugar || 'Auditorio / Tópico');
    setEditFormResponsable(act.responsable || '');
    setEditFormEstado(act.estado);
    setEditFormObs(act.observaciones || '');
  };

  // Save Date Modification
  const handleSaveDateEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAct || !editFormDate) return;

    setActividades(prev => prev.map(a => {
      if (a.id === editingAct.id) {
        return {
          ...a,
          fecha: editFormDate,
          hora: editFormHora,
          lugar: editFormLugar,
          responsable: editFormResponsable,
          estado: editFormEstado,
          observaciones: editFormObs
        };
      }
      return a;
    }));

    setEditingAct(null);
  };

  // Create New Activity
  const handleCreateActivity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFormData.titulo || !newFormData.fecha) return;

    const newAct: ActividadCronograma = {
      id: `act-${Date.now()}`,
      titulo: newFormData.titulo,
      tipo: newFormData.tipo || 'CAPACITACION',
      fecha: newFormData.fecha,
      hora: newFormData.hora || '09:00 - 11:00',
      lugar: newFormData.lugar || 'Auditorio Central / Tópico',
      responsable: newFormData.responsable || 'Dr. Alejandro Morales (CMP 45120)',
      dirigidoA: newFormData.dirigidoA || 'Toda la Población Ocupacional',
      duracionHoras: Number(newFormData.duracionHoras) || 2,
      asistentesEstimados: Number(newFormData.asistentesEstimados) || 100,
      estado: newFormData.estado || 'PROGRAMADO',
      normaReferencia: newFormData.normaReferencia || 'Ley 29783 Art. 35',
      observaciones: newFormData.observaciones || ''
    };

    setActividades([newAct, ...actividades]);
    setNewModalOpen(false);
    setNewFormData({
      titulo: '',
      tipo: 'CAPACITACION',
      fecha: new Date(2026, 7, 15).toISOString().split('T')[0],
      hora: '09:00 - 11:00',
      lugar: 'Auditorio Central / Tópico',
      responsable: 'Dr. Alejandro Morales (CMP 45120)',
      dirigidoA: 'Toda la Población Ocupacional',
      duracionHoras: 2,
      asistentesEstimados: 100,
      estado: 'PROGRAMADO',
      normaReferencia: 'Ley 29783 Art. 35'
    });
  };

  // Delete Activity
  const handleDeleteActivity = (id: string) => {
    if (confirm('¿Está seguro de eliminar esta actividad del Cronograma Anual?')) {
      setActividades(prev => prev.filter(a => a.id !== id));
    }
  };

  const monthNames = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Setiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  const getTypeBadge = (tipo: ActividadCronograma['tipo']) => {
    switch (tipo) {
      case 'CAPACITACION':
        return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20"><GraduationCap className="w-3 h-3" /> Capacitación SST</span>;
      case 'CAMPAÑA_SALUD':
        return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"><Stethoscope className="w-3 h-3" /> Campaña Salud</span>;
      case 'MONITOREO_HIGIENICO':
        return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20"><Activity className="w-3 h-3" /> Monitoreo Higiénico</span>;
      case 'INMUNIZACION':
        return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20"><Syringe className="w-3 h-3" /> Vacunación</span>;
      case 'INSPECCION_AUDITORIA':
        return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-purple-500/10 text-purple-400 border border-purple-500/20"><ShieldCheck className="w-3 h-3" /> Auditoría SST</span>;
      default:
        return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-800 text-slate-300">Actividad</span>;
    }
  };

  const getStatusBadge = (estado: ActividadCronograma['estado']) => {
    switch (estado) {
      case 'COMPLETADO':
        return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"><CheckCircle2 className="w-3 h-3" /> Ejecutado</span>;
      case 'PROGRAMADO':
        return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20"><Clock className="w-3 h-3" /> Programado</span>;
      case 'REPROGRAMADO':
        return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20"><AlertTriangle className="w-3 h-3" /> Reprogramado</span>;
      case 'EN_EJECUCION':
        return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20"><Activity className="w-3 h-3" /> En Curso</span>;
      case 'CANCELADO':
        return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20"><X className="w-3 h-3" /> Cancelado</span>;
    }
  };

  const totalEjecutadas = actividades.filter(a => a.estado === 'COMPLETADO').length;
  const pctAvancePlan = Math.round((totalEjecutadas / actividades.length) * 100);

  return (
    <div className="space-y-6">
      {/* HEADER BANNER */}
      <div className="bg-slate-950 p-6 rounded-xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span className="px-2.5 py-0.5 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-[10px] font-semibold tracking-wider rounded-full uppercase">
              Item 1.5 - Guía Maestra SUNAFIL
            </span>
            <span className="px-2.5 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-semibold tracking-wider rounded-full uppercase">
              D.S. 005-2012-TR & Ley 29783
            </span>
          </div>
          <h2 className="text-xl font-bold text-white font-sans flex items-center gap-2.5">
            <Calendar className="w-6 h-6 text-indigo-400" />
            Cronograma Anual de Actividades, Capacitaciones e Intervenciones 2026
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-3xl">
            Calendario interactivo unificado para la programación, reprogramación de fechas y seguimiento del Plan Anual de Salud Ocupacional y Capacitaciones SST obligatorias.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setNewModalOpen(true)}
            className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-indigo-900/40 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Programar Nueva Actividad</span>
          </button>

          <button
            onClick={() => window.print()}
            className="px-3.5 py-2.5 bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5"
          >
            <Download className="w-4 h-4 text-emerald-400" />
            <span>Imprimir Cronograma</span>
          </button>
        </div>
      </div>

      {/* SUMMARY KPI METRICS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
          <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Actividades Programadas</div>
          <div className="text-2xl font-black text-white mt-1">{actividades.length} <span className="text-xs font-normal text-slate-400">eventos en 2026</span></div>
          <div className="text-[10px] text-indigo-400 mt-1 flex items-center gap-1">
            <CalendarDays className="w-3 h-3" /> PASO & Capacitaciones SST
          </div>
        </div>

        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
          <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Ejecutadas / Conformes</div>
          <div className="text-2xl font-black text-emerald-400 mt-1">{totalEjecutadas} <span className="text-xs font-normal text-slate-400">completadas</span></div>
          <div className="text-[10px] text-emerald-400 mt-1 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> {pctAvancePlan}% Cumplimiento del Plan
          </div>
        </div>

        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
          <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Próximas Sesiones</div>
          <div className="text-2xl font-black text-amber-400 mt-1">{proximasCapacitaciones.length} <span className="text-xs font-normal text-slate-400">pendientes</span></div>
          <div className="text-[10px] text-amber-400 mt-1 flex items-center gap-1">
            <Clock className="w-3 h-3" /> Fechas confirmadas
          </div>
        </div>

        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
          <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Capacitaciones Ley 29783</div>
          <div className="text-2xl font-black text-indigo-400 mt-1">
            {actividades.filter(a => a.tipo === 'CAPACITACION' && a.estado === 'COMPLETADO').length} / 4
          </div>
          <div className="text-[10px] text-slate-400 mt-1 flex items-center gap-1">
            <GraduationCap className="w-3 h-3 text-indigo-400" /> Requisito legal cumplido
          </div>
        </div>
      </div>

      {/* UPCOMING CAPACITACIONES SECTION BANNER */}
      {proximasCapacitaciones.length > 0 && (
        <div className="bg-slate-950 rounded-xl border border-amber-500/30 p-4 bg-gradient-to-r from-amber-950/20 via-slate-950 to-slate-950">
          <div className="flex items-center justify-between gap-2 mb-3">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <Clock className="w-4 h-4" />
              </span>
              <h3 className="text-sm font-bold text-white font-sans">
                Próximas Capacitaciones e Intervenciones Ocupacionales Programadas
              </h3>
            </div>
            <span className="text-xs text-amber-400 font-semibold">
              {proximasCapacitaciones.length} eventos en agenda
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {proximasCapacitaciones.slice(0, 3).map((act) => (
              <div key={act.id} className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 flex flex-col justify-between gap-3 hover:border-amber-500/40 transition-colors">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    {getTypeBadge(act.tipo)}
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                      📅 {act.fecha}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-white line-clamp-2 mt-1">{act.titulo}</h4>
                  <p className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
                    <Users className="w-3 h-3 text-slate-500" /> {act.dirigidoA}
                  </p>
                  <p className="text-[10px] text-slate-500 mt-0.5">
                    <strong>Expositor:</strong> {act.responsable}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-[10px]">
                  <span className="text-slate-400">⏰ {act.hora || 'Por confirmar'}</span>
                  <button
                    onClick={() => handleOpenEditModal(act)}
                    className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-amber-300 rounded text-[10px] font-semibold flex items-center gap-1 transition-colors"
                  >
                    <Edit3 className="w-3 h-3" />
                    <span>Editar Fecha</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* FILTER & VIEW CONTROLS */}
      <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* SEARCH & TYPE FILTERS */}
          <div className="flex items-center gap-2 flex-1 flex-wrap">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar por tema, expositor o norma..."
                className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="bg-slate-900 border border-slate-800 text-xs text-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:border-indigo-500"
            >
              <option value="TODOS">Todos los Tipos de Actividad</option>
              <option value="CAPACITACION">Capacitaciones SST Ley 29783</option>
              <option value="CAMPAÑA_SALUD">Campañas de Salud</option>
              <option value="MONITOREO_HIGIENICO">Monitoreo Higiénico</option>
              <option value="INMUNIZACION">Jornadas de Vacunación</option>
              <option value="INSPECCION_AUDITORIA">Auditoría / Inspección SST</option>
            </select>

            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="bg-slate-900 border border-slate-800 text-xs text-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:border-indigo-500"
            >
              <option value="TODOS">Todos los Estados</option>
              <option value="PROGRAMADO">Programado</option>
              <option value="COMPLETADO">Ejecutado / Completado</option>
              <option value="REPROGRAMADO">Reprogramado</option>
            </select>
          </div>

          {/* VIEW SWITCHER */}
          <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800 shrink-0">
            <button
              onClick={() => setViewMode('CALENDARIO')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                viewMode === 'CALENDARIO'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Vista Calendario</span>
            </button>

            <button
              onClick={() => setViewMode('LISTA')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                viewMode === 'LISTA'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Vista Lista Agenda</span>
            </button>
          </div>
        </div>
      </div>

      {/* VIEW MODE 1: CALENDARIO MENSUAL */}
      {viewMode === 'CALENDARIO' && (
        <div className="bg-slate-950 rounded-xl border border-slate-800 p-4 space-y-4">
          {/* MONTH NAVIGATION BAR */}
          <div className="flex items-center justify-between bg-slate-900/80 p-3 rounded-xl border border-slate-800">
            <button
              onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors flex items-center gap-1 text-xs font-medium"
            >
              <ChevronLeft className="w-4 h-4" /> Anterior
            </button>

            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-indigo-400" />
              <h3 className="text-base font-bold text-white font-sans">
                {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
              </h3>
            </div>

            <button
              onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors flex items-center gap-1 text-xs font-medium"
            >
              Siguiente <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* CALENDAR DAYS OF WEEK */}
          <div className="grid grid-cols-7 gap-1 text-center text-xs font-bold text-slate-400 border-b border-slate-800 pb-2">
            <div>Lun</div>
            <div>Mar</div>
            <div>Mié</div>
            <div>Jue</div>
            <div>Vie</div>
            <div className="text-amber-400/80">Sáb</div>
            <div className="text-rose-400/80">Dom</div>
          </div>

          {/* CALENDAR GRID */}
          <div className="grid grid-cols-7 gap-1.5">
            {monthDays.map((dayObj, idx) => {
              const isToday = dayObj.dateStr === new Date().toISOString().split('T')[0];

              return (
                <div
                  key={idx}
                  className={`min-h-[100px] p-2 rounded-xl border flex flex-col justify-between transition-colors ${
                    !dayObj.isCurrentMonth
                      ? 'bg-slate-950/40 border-slate-900 text-slate-600'
                      : isToday
                      ? 'bg-indigo-950/20 border-indigo-500/50 text-white shadow-inner'
                      : 'bg-slate-900/60 border-slate-800/80 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className={`font-bold rounded-full w-5 h-5 flex items-center justify-center ${
                      isToday ? 'bg-indigo-600 text-white' : ''
                    }`}>
                      {dayObj.dayNum}
                    </span>
                    {dayObj.events.length > 0 && (
                      <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                        {dayObj.events.length} {dayObj.events.length === 1 ? 'evento' : 'eventos'}
                      </span>
                    )}
                  </div>

                  {/* EVENTS LIST IN DAY */}
                  <div className="space-y-1 overflow-y-auto max-h-[80px] custom-scrollbar">
                    {dayObj.events.map((act) => (
                      <div
                        key={act.id}
                        onClick={() => handleOpenEditModal(act)}
                        className={`p-1.5 rounded text-[10px] cursor-pointer font-medium transition-all hover:scale-[1.02] border ${
                          act.estado === 'COMPLETADO'
                            ? 'bg-emerald-950/60 text-emerald-300 border-emerald-800/60 hover:bg-emerald-900/80'
                            : act.estado === 'REPROGRAMADO'
                            ? 'bg-amber-950/60 text-amber-300 border-amber-800/60 hover:bg-amber-900/80'
                            : 'bg-indigo-950/60 text-indigo-200 border-indigo-800/60 hover:bg-indigo-900/80'
                        }`}
                        title={`${act.titulo} - Clic para editar fecha`}
                      >
                        <div className="font-bold truncate line-clamp-1">{act.titulo}</div>
                        <div className="text-[9px] opacity-80 truncate">{act.hora || 'Todo el día'}</div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* VIEW MODE 2: TABULAR LIST / AGENDA */}
      {viewMode === 'LISTA' && (
        <div className="bg-slate-950 rounded-xl border border-slate-800 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-900/90 text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Fecha & Hora</th>
                  <th className="py-3 px-4">Actividad / Capacitación</th>
                  <th className="py-3 px-4">Tipo</th>
                  <th className="py-3 px-4">Expositor / Responsable</th>
                  <th className="py-3 px-4">Dirigido A</th>
                  <th className="py-3 px-4 text-center">Horas</th>
                  <th className="py-3 px-4">Estado</th>
                  <th className="py-3 px-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredActividades.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-slate-500 text-xs">
                      No se encontraron actividades en el cronograma con los filtros seleccionados.
                    </td>
                  </tr>
                ) : (
                  filteredActividades.map((act) => (
                    <tr key={act.id} className="hover:bg-slate-900/40 transition-colors">
                      <td className="py-3 px-4 whitespace-nowrap font-medium text-white">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                          <span className="font-bold">{act.fecha}</span>
                        </div>
                        <div className="text-[10px] text-slate-400 mt-0.5">{act.hora || 'Todo el día'}</div>
                      </td>

                      <td className="py-3 px-4 max-w-xs">
                        <div className="font-bold text-white line-clamp-2">{act.titulo}</div>
                        {act.normaReferencia && (
                          <div className="text-[10px] text-slate-400 mt-0.5">
                            Norma: {act.normaReferencia}
                          </div>
                        )}
                        {act.observaciones && (
                          <div className="text-[10px] text-slate-500 italic mt-0.5 truncate">
                            {act.observaciones}
                          </div>
                        )}
                      </td>

                      <td className="py-3 px-4 whitespace-nowrap">
                        {getTypeBadge(act.tipo)}
                      </td>

                      <td className="py-3 px-4 text-slate-300">
                        <div className="font-medium text-slate-200">{act.responsable}</div>
                        <div className="text-[10px] text-slate-500">{act.lugar}</div>
                      </td>

                      <td className="py-3 px-4 text-slate-300">
                        <div className="text-xs">{act.dirigidoA}</div>
                        <div className="text-[10px] text-slate-500">{act.asistentesEstimados} asistentes est.</div>
                      </td>

                      <td className="py-3 px-4 text-center font-bold text-indigo-400">
                        {act.duracionHoras} hrs
                      </td>

                      <td className="py-3 px-4 whitespace-nowrap">
                        {getStatusBadge(act.estado)}
                      </td>

                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleOpenEditModal(act)}
                            className="p-1.5 bg-indigo-950/60 hover:bg-indigo-900 text-indigo-300 border border-indigo-800/60 rounded-lg text-xs font-medium transition-colors flex items-center gap-1"
                            title="Editar fecha y reprogramar"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                            <span>Editar Fecha</span>
                          </button>

                          <button
                            onClick={() => handleDeleteActivity(act.id)}
                            className="p-1.5 bg-slate-900 hover:bg-rose-950 text-slate-400 hover:text-rose-300 rounded-lg transition-colors"
                            title="Eliminar"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL 1: EDITAR FECHA Y DETALLES */}
      {editingAct && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-950 border border-slate-800 rounded-2xl w-full max-w-lg p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-indigo-400" />
                <h3 className="text-base font-bold text-white font-sans">
                  Editar Fecha y Reprogramar Actividad
                </h3>
              </div>
              <button
                onClick={() => setEditingAct(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 text-xs space-y-1">
              <div className="font-bold text-indigo-300">{editingAct.titulo}</div>
              <div className="text-slate-400">Público: {editingAct.dirigidoA}</div>
            </div>

            <form onSubmit={handleSaveDateEdit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Nueva Fecha Programada <span className="text-rose-400">*</span>
                </label>
                <input
                  type="date"
                  required
                  value={editFormDate}
                  onChange={(e) => setEditFormDate(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Horario</label>
                  <input
                    type="text"
                    value={editFormHora}
                    onChange={(e) => setEditFormHora(e.target.value)}
                    placeholder="Ej. 09:00 - 11:00"
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Estado de Ejecución</label>
                  <select
                    value={editFormEstado}
                    onChange={(e) => setEditFormEstado(e.target.value as any)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="PROGRAMADO">Programado</option>
                    <option value="EN_EJECUCION">En Curso</option>
                    <option value="COMPLETADO">Ejecutado / Completado</option>
                    <option value="REPROGRAMADO">Reprogramado</option>
                    <option value="CANCELADO">Cancelado</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Expositor / Responsable</label>
                <input
                  type="text"
                  value={editFormResponsable}
                  onChange={(e) => setEditFormResponsable(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Lugar / Ubicación</label>
                <input
                  type="text"
                  value={editFormLugar}
                  onChange={(e) => setEditFormLugar(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Observaciones o Motivo de Reprogramación</label>
                <textarea
                  rows={2}
                  value={editFormObs}
                  onChange={(e) => setEditFormObs(e.target.value)}
                  placeholder="Escriba aquí si se reprogramó o avances de la sesión..."
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingAct(null)}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-xl font-semibold transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold transition-all shadow-lg shadow-indigo-900/40 flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4" />
                  <span>Guardar Nueva Fecha</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: PROGRAMAR NUEVA ACTIVIDAD */}
      {newModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-950 border border-slate-800 rounded-2xl w-full max-w-xl p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Plus className="w-5 h-5 text-indigo-400" />
                <h3 className="text-base font-bold text-white font-sans">
                  Programar Nueva Actividad o Capacitación SST
                </h3>
              </div>
              <button
                onClick={() => setNewModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateActivity} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Título de la Actividad o Capacitación <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={newFormData.titulo}
                  onChange={(e) => setNewFormData({ ...newFormData, titulo: e.target.value })}
                  placeholder="Ej. Taller de Salud Mental y Manejo del Estrés Ocupacional"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Tipo de Actividad</label>
                  <select
                    value={newFormData.tipo}
                    onChange={(e) => setNewFormData({ ...newFormData, tipo: e.target.value as any })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="CAPACITACION">Capacitación SST Ley 29783</option>
                    <option value="CAMPAÑA_SALUD">Campaña de Salud Ocupacional</option>
                    <option value="MONITOREO_HIGIENICO">Monitoreo Higiénico Ocupacional</option>
                    <option value="INMUNIZACION">Jornada de Inmunización</option>
                    <option value="INSPECCION_AUDITORIA">Auditoría / Inspección SST</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Fecha Programada <span className="text-rose-400">*</span></label>
                  <input
                    type="date"
                    required
                    value={newFormData.fecha}
                    onChange={(e) => setNewFormData({ ...newFormData, fecha: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Horario</label>
                  <input
                    type="text"
                    value={newFormData.hora}
                    onChange={(e) => setNewFormData({ ...newFormData, hora: e.target.value })}
                    placeholder="Ej. 09:00 - 11:00"
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Duración (Horas)</label>
                  <input
                    type="number"
                    step="0.5"
                    min="0.5"
                    value={newFormData.duracionHoras}
                    onChange={(e) => setNewFormData({ ...newFormData, duracionHoras: Number(e.target.value) })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Expositor / Responsable</label>
                  <input
                    type="text"
                    value={newFormData.responsable}
                    onChange={(e) => setNewFormData({ ...newFormData, responsable: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Público Objetivo (Dirigido a)</label>
                  <input
                    type="text"
                    value={newFormData.dirigidoA}
                    onChange={(e) => setNewFormData({ ...newFormData, dirigidoA: e.target.value })}
                    placeholder="Ej. Trabajadores de Mantenimiento"
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Norma de Referencia Legal</label>
                <input
                  type="text"
                  value={newFormData.normaReferencia}
                  onChange={(e) => setNewFormData({ ...newFormData, normaReferencia: e.target.value })}
                  placeholder="Ej. Ley 29783 Art. 35 / R.M. 375-2008-TR"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setNewModalOpen(false)}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-xl font-semibold transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold transition-all shadow-lg shadow-indigo-900/40 flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>Programar Evento</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
