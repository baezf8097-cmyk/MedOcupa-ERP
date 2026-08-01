import React, { useState } from 'react';
import { IndicadorIGSO, Empresa, EMOExam, AccidenteIncidente, AusentismoMedico, ProgramaVigilancia, ProtocoloExamenMedico, Trabajador } from '../../types/erp';
import { MOCK_TRABAJADORES } from '../../data/initialData';
import { 
  Activity, 
  AlertTriangle, 
  Award, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  FileCheck, 
  ShieldAlert, 
  TrendingUp, 
  Users, 
  Shield, 
  ShieldCheck,
  Stethoscope, 
  ArrowUpRight,
  GraduationCap,
  BookOpen,
  FileText,
  BellRing,
  Filter,
  AlertCircle
} from 'lucide-react';

interface DashboardOverviewProps {
  empresa: Empresa | null;
  emos: EMOExam[];
  trabajadores?: Trabajador[];
  accidentes: AccidenteIncidente[];
  ausentismos: AusentismoMedico[];
  programas: ProgramaVigilancia[];
  protocolos?: ProtocoloExamenMedico[];
  onNavigateTab: (tab: any) => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  empresa,
  emos,
  trabajadores = MOCK_TRABAJADORES,
  accidentes,
  ausentismos,
  programas,
  protocolos = [],
  onNavigateTab
}) => {
  // Category filter for the 30-day alert indicator
  const [filterCategory, setFilterCategory] = useState<'TODOS' | 'PROTOCOLOS' | 'PROGRAMAS' | 'EMOS'>('TODOS');

  // IGSO Calculation
  const totalHHT = 1250000; // Horas Hombre Trabajadas
  const totalAccidentes = accidentes.length;
  const totalDiasPerdidos = ausentismos.reduce((acc, curr) => acc + curr.diasTotales, 0);

  const IF = Number(((totalAccidentes * 1000000) / totalHHT).toFixed(2));
  const IS = Number(((totalDiasPerdidos * 1000000) / totalHHT).toFixed(2));
  const IA = Number(((IF * IS) / 1000).toFixed(2));

  const aptosCount = emos.filter(e => e.aptitud?.resultado === 'APTO').length;
  const aptosRestriccionCount = emos.filter(e => e.aptitud?.resultado === 'APTO_CON_RESTRICCIONES').length;
  const noAptosCount = emos.filter(e => e.aptitud?.resultado === 'NO_APTO').length;
  const observadosCount = emos.filter(e => e.estado === 'EN_PROCESO' || e.estado === 'OBSERVADO').length;

  // 30-Day Alert Calculation for EMO Expirations (Reference Date: 2026-07-30)
  const TODAY_REF = '2026-07-30';
  const getDaysLeft = (dateStr?: string): number | null => {
    if (!dateStr) return null;
    const today = new Date(TODAY_REF + 'T00:00:00');
    const target = new Date(dateStr + 'T00:00:00');
    if (isNaN(target.getTime())) return null;
    const diffTime = target.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  // Filter EMO items expiring in <= 30 days
  const emosProximos = (emos || []).map(e => {
    const daysLeft = getDaysLeft(e.aptitud?.fechaVencimiento || e.fechaProgramada);
    return { ...e, daysLeft };
  }).filter(e => e.daysLeft !== null && e.daysLeft <= 30);

  const emosVencidos = emosProximos.filter(e => e.daysLeft! < 0);
  const emosUrgentes = emosProximos.filter(e => e.daysLeft! >= 0 && e.daysLeft! <= 10);
  const emosProximos30d = emosProximos.filter(e => e.daysLeft! > 10 && e.daysLeft! <= 30);

  const totalProximosCount = emosProximos.length;

  const allAlertItems = emosProximos.map(e => ({
    id: `emo-${e.id}`,
    type: 'EMO' as const,
    title: `EMO ${e.tipoEMO} - Código ${e.codigoEMO}`,
    code: e.codigoEMO,
    trabajadorId: e.trabajadorId,
    empresa: `Aptitud: ${e.aptitud?.resultado?.replace(/_/g, ' ') || 'PROGRAMADO'}`,
    fechaVencimiento: e.aptitud?.fechaVencimiento || e.fechaProgramada,
    daysLeft: e.daysLeft!,
    targetTab: 'emo_examenes'
  })).sort((a, b) => a.daysLeft - b.daysLeft);

  const filteredAlertItems = allAlertItems.filter(item => {
    if (filterCategory === 'PROTOCOLOS') return item.daysLeft < 0; // Overdue filter
    if (filterCategory === 'PROGRAMAS') return item.daysLeft >= 0 && item.daysLeft <= 10; // Urgentes <= 10d
    if (filterCategory === 'EMOS') return item.daysLeft > 10; // 11 to 30d
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner Context */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 p-6 rounded-2xl border border-slate-800 shadow-xl text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 rounded-full text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5" /> Tablero de Gestión SST & IGSO
              </span>
              <span className="text-xs text-slate-400">Ley N° 29783 & D.S. 005-2012-TR</span>
            </div>
            <h2 className="text-2xl font-bold font-display text-white">
              {empresa ? empresa.razonSocial : 'Consolidado General de Salud Ocupacional'}
            </h2>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl">
              Monitoreo en tiempo real de aptitud médica de personal, siniestralidad, programas de vigilancia epidemiológica y cumplimiento normativo MINSA/MTPE.
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => onNavigateTab('emo_examenes')}
              className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-medium flex items-center gap-1.5 shadow-lg shadow-emerald-900/40 transition-all"
            >
              <Stethoscope className="w-4 h-4" /> Nuevo EMO
            </button>
            <button
              onClick={() => onNavigateTab('reportes_minsa')}
              className="px-3.5 py-2 bg-indigo-900/50 hover:bg-indigo-900/80 text-indigo-200 border border-indigo-700/60 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all"
            >
              <GraduationCap className="w-4 h-4 text-indigo-400" /> Capacitaciones SST
            </button>
            <button
              onClick={() => onNavigateTab('aptitudes')}
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium border border-slate-700 flex items-center gap-1.5 transition-all"
            >
              <Award className="w-4 h-4 text-emerald-400" /> Emitir Aptitud
            </button>
            <button
              onClick={() => onNavigateTab('accidentes')}
              className="px-3.5 py-2 bg-rose-900/50 hover:bg-rose-900/80 text-rose-200 border border-rose-700/60 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all"
            >
              <AlertTriangle className="w-4 h-4 text-rose-400" /> Reportar Evento
            </button>
          </div>
        </div>
      </div>

      {/* IGSO Primary KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* IF - Índice de Frecuencia */}
        <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 shadow-md">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Índice Frecuencia (IF)</span>
            <div className="p-2 bg-amber-500/10 text-amber-400 rounded-lg">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white font-display">{IF}</span>
            <span className="text-xs text-slate-400">acc. / 1M HHT</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2 flex items-center gap-1">
            <span className="text-emerald-400 font-semibold">Meta &lt; 5.0</span> • Bajo umbral crítico D.S. 005
          </p>
        </div>

        {/* IS - Índice de Severidad */}
        <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 shadow-md">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Índice Severidad (IS)</span>
            <div className="p-2 bg-rose-500/10 text-rose-400 rounded-lg">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white font-display">{IS}</span>
            <span className="text-xs text-slate-400">días / 1M HHT</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2 flex items-center gap-1">
            <span className="text-slate-300 font-semibold">{totalDiasPerdidos} días</span> perdidos por ausentismo
          </p>
        </div>

        {/* IA - Índice de Accidentabilidad */}
        <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 shadow-md">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Accidentabilidad (IA)</span>
            <div className="p-2 bg-indigo-500/10 text-indigo-400 rounded-lg">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white font-display">{IA}</span>
            <span className="text-xs text-slate-400">fórmula (IF*IS)/1k</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2 flex items-center gap-1">
            <span className="text-emerald-400 font-semibold">Desempeño Controlado</span>
          </p>
        </div>

        {/* Cumplimiento EMO % */}
        <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 shadow-md">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Cumplimiento EMO</span>
            <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-lg">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-emerald-400 font-display">94.8%</span>
            <span className="text-xs text-slate-400">vigentes RM 312</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2 flex items-center gap-1">
            <span className="text-amber-400 font-semibold">{observadosCount} EMOs</span> pendientes de conclusión
          </p>
        </div>
      </div>

      {/* INDICADOR VISUAL: Alertas de Vencimiento de EMOs a 30 Días */}
      <div id="indicador-vencimientos-30dias" className="bg-slate-900 border-2 border-amber-500/40 rounded-2xl p-5 shadow-2xl relative overflow-hidden bg-gradient-to-b from-amber-950/20 via-slate-900 to-slate-900">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-4 pb-4 border-b border-slate-800">
          <div className="flex items-start gap-3">
            <div className="p-2.5 bg-amber-500/20 text-amber-400 border border-amber-500/40 rounded-xl shrink-0 mt-1">
              <BellRing className="w-6 h-6 animate-pulse text-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2.5 py-0.5 bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded-full text-[11px] font-bold uppercase tracking-wider flex items-center gap-1">
                  <Clock className="w-3 h-3 text-amber-400" /> Alerta Temprana EMO • Próximos 30 Días
                </span>
                <span className="text-xs text-slate-400">R.M. 312-2011-MINSA / Ley 29783</span>
              </div>
              <h3 className="text-lg font-bold text-white mt-1 flex items-center gap-2">
                Alertas de Vencimiento de Exámenes Médicos Ocupacionales (EMOs)
              </h3>
              <p className="text-xs text-slate-300 mt-0.5">
                Indicador automatizado para el Médico Ocupacional y SST. Monitorea exclusivamente la vigencia de certificados de aptitud médica laboral para reprogramar EMOs periódicos a tiempo.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start lg:self-center shrink-0">
            <div className="px-4 py-2 bg-amber-950/80 border border-amber-700/80 rounded-xl text-center">
              <span className="text-2xl font-extrabold text-amber-400 block font-display leading-none">
                {totalProximosCount}
              </span>
              <span className="text-[10px] text-amber-200 font-semibold uppercase tracking-wider">
                EMOs por Vencer (≤ 30 Días)
              </span>
            </div>
          </div>
        </div>

        {/* 3 Metric Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
          <div className={`p-3.5 rounded-xl border transition-all ${emosVencidos.length > 0 ? 'bg-rose-950/40 border-rose-700/60' : 'bg-slate-800/40 border-slate-800'}`}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-rose-300 flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-rose-400" /> EMOs Vencidos
              </span>
              <span className={`text-xs font-bold px-2 py-0.5 rounded ${emosVencidos.length > 0 ? 'bg-rose-500/30 text-rose-200 border border-rose-500/40' : 'bg-slate-700 text-slate-400'}`}>
                {emosVencidos.length} Críticos
              </span>
            </div>
            <p className="text-[11px] text-slate-300 mt-1">
              {emosVencidos.length > 0 ? 'Certificados de aptitud con vigencia caducada.' : 'Sin EMOs caducados.'}
            </p>
            <button 
              onClick={() => onNavigateTab('emo_examenes')}
              className="mt-2 text-[11px] text-rose-400 hover:text-rose-300 font-medium flex items-center gap-1"
            >
              Ver Exámenes <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>

          <div className={`p-3.5 rounded-xl border transition-all ${emosUrgentes.length > 0 ? 'bg-amber-950/40 border-amber-700/60' : 'bg-slate-800/40 border-slate-800'}`}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-amber-400" /> Urgentes (≤ 10 Días)
              </span>
              <span className={`text-xs font-bold px-2 py-0.5 rounded ${emosUrgentes.length > 0 ? 'bg-amber-500/30 text-amber-200 border border-amber-500/40' : 'bg-slate-700 text-slate-400'}`}>
                {emosUrgentes.length} Alertas
              </span>
            </div>
            <p className="text-[11px] text-slate-300 mt-1">
              {emosUrgentes.length > 0 ? 'Trabajadores con EMO por vencer en los próximos 10 días.' : 'Sin EMOs urgentes.'}
            </p>
            <button 
              onClick={() => onNavigateTab('emo_examenes')}
              className="mt-2 text-[11px] text-amber-400 hover:text-amber-300 font-medium flex items-center gap-1"
            >
              Ver Exámenes <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>

          <div className={`p-3.5 rounded-xl border transition-all ${emosProximos30d.length > 0 ? 'bg-emerald-950/40 border-emerald-700/60' : 'bg-slate-800/40 border-slate-800'}`}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-emerald-300 flex items-center gap-1.5">
                <Stethoscope className="w-4 h-4 text-emerald-400" /> Próximos (11-30 Días)
              </span>
              <span className={`text-xs font-bold px-2 py-0.5 rounded ${emosProximos30d.length > 0 ? 'bg-emerald-500/30 text-emerald-200 border border-emerald-500/40' : 'bg-slate-700 text-slate-400'}`}>
                {emosProximos30d.length} Alertas
              </span>
            </div>
            <p className="text-[11px] text-slate-300 mt-1">
              {emosProximos30d.length > 0 ? 'Evaluaciones médicas periódicas programables para este mes.' : 'Sin EMOs en esta ventana.'}
            </p>
            <button 
              onClick={() => onNavigateTab('emo_examenes')}
              className="mt-2 text-[11px] text-emerald-400 hover:text-emerald-300 font-medium flex items-center gap-1"
            >
              Ver Exámenes <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Category Filter Tabs Bar */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3 bg-slate-800/60 p-1.5 rounded-xl border border-slate-700/50">
          <div className="flex items-center gap-1 overflow-x-auto">
            <button
              onClick={() => setFilterCategory('TODOS')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${filterCategory === 'TODOS' ? 'bg-amber-500 text-slate-950 font-bold shadow-md' : 'text-slate-300 hover:bg-slate-700/60'}`}
            >
              Todos los EMOs ({allAlertItems.length})
            </button>
            <button
              onClick={() => setFilterCategory('PROTOCOLOS')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${filterCategory === 'PROTOCOLOS' ? 'bg-rose-600 text-white font-bold shadow-md' : 'text-slate-300 hover:bg-slate-700/60'}`}
            >
              🔴 Vencidos ({emosVencidos.length})
            </button>
            <button
              onClick={() => setFilterCategory('PROGRAMAS')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${filterCategory === 'PROGRAMAS' ? 'bg-amber-600 text-white font-bold shadow-md' : 'text-slate-300 hover:bg-slate-700/60'}`}
            >
              🟠 Urgentes ≤ 10d ({emosUrgentes.length})
            </button>
            <button
              onClick={() => setFilterCategory('EMOS')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${filterCategory === 'EMOS' ? 'bg-emerald-600 text-white font-bold shadow-md' : 'text-slate-300 hover:bg-slate-700/60'}`}
            >
              🟢 Próximos 11-30d ({emosProximos30d.length})
            </button>
          </div>
          <span className="text-[11px] text-slate-400 px-2 font-medium">
            Mostrando {filteredAlertItems.length} alertas de EMO
          </span>
        </div>

        {/* Detailed Items List */}
        <div className="space-y-2 max-h-80 overflow-y-auto custom-scrollbar pr-1">
          {filteredAlertItems.length === 0 ? (
            <div className="text-center py-6 bg-slate-800/40 rounded-xl border border-slate-700/40">
              <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-2 opacity-80" />
              <p className="text-xs text-slate-300 font-medium">No hay alertas de vencimiento registradas en esta categoría para los próximos 30 días.</p>
              <p className="text-[11px] text-slate-400 mt-1">Todos los protocolos y programas se encuentran dentro del periodo de vigencia legal.</p>
            </div>
          ) : (
            filteredAlertItems.map((item) => {
              const isOverdue = item.daysLeft < 0;
              const isUrgent = item.daysLeft >= 0 && item.daysLeft <= 10;
              const trabajador = trabajadores.find(t => t.id === item.trabajadorId);
              
              return (
                <div 
                  key={item.id}
                  className={`p-3.5 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs transition-all hover:translate-x-0.5 ${
                    isOverdue 
                      ? 'bg-rose-950/30 border-rose-700/60 hover:border-rose-500' 
                      : isUrgent 
                      ? 'bg-amber-950/30 border-amber-700/60 hover:border-amber-500'
                      : 'bg-slate-800/70 border-slate-700/60 hover:border-slate-500'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg shrink-0 mt-0.5 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      <Stethoscope className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-white text-xs">{item.title}</span>
                        <span className="px-1.5 py-0.2 bg-slate-700 text-slate-300 text-[10px] font-mono rounded">
                          {item.code}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400 flex flex-wrap items-center gap-2 mt-1">
                        {trabajador && (
                          <span className="text-emerald-300 font-semibold">
                            👤 {trabajador.apellidoPaterno} {trabajador.apellidoMaterno}, {trabajador.nombres} ({trabajador.tipoDocumento}: {trabajador.numeroDocumento})
                          </span>
                        )}
                        <span>•</span>
                        <span className="text-slate-300">{item.empresa}</span>
                        <span>•</span>
                        <span>Vencimiento: <strong className="text-slate-200">{item.fechaVencimiento}</strong></span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0 self-end sm:self-auto">
                    {/* Badge of Days Left */}
                    {isOverdue ? (
                      <span className="px-2.5 py-1 bg-rose-500/20 text-rose-300 border border-rose-500/40 rounded-lg text-[11px] font-bold flex items-center gap-1 animate-pulse">
                        <AlertTriangle className="w-3.5 h-3.5 text-rose-400" /> VENCIDO hace {Math.abs(item.daysLeft)} d
                      </span>
                    ) : isUrgent ? (
                      <span className="px-2.5 py-1 bg-rose-500/20 text-rose-300 border border-rose-500/40 rounded-lg text-[11px] font-bold flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-rose-400" /> Vence en {item.daysLeft} días
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded-lg text-[11px] font-bold flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-amber-400" /> Vence en {item.daysLeft} días
                      </span>
                    )}

                    <button
                      onClick={() => onNavigateTab(item.targetTab)}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-600 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all"
                    >
                      Ir al Módulo <ArrowUpRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Middle Section: Aptitude Breakdown & Vigilance Programs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Aptitude Distribution Panel */}
        <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 shadow-md lg:col-span-1">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Award className="w-4 h-4 text-emerald-400" /> Distribución de Aptitud Médica
            </h3>
            <button 
              onClick={() => onNavigateTab('aptitudes')}
              className="text-xs text-emerald-400 hover:underline flex items-center gap-1"
            >
              Ver detalle <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>

          <div className="space-y-3">
            {/* APTO */}
            <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700/60 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                <div>
                  <div className="text-xs font-semibold text-slate-200">Apto (Sin restricciones)</div>
                  <div className="text-[10px] text-slate-400">Capacidad 100% para el puesto</div>
                </div>
              </div>
              <span className="text-sm font-bold text-emerald-400">{aptosCount}</span>
            </div>

            {/* APTO CON RESTRICCIONES */}
            <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700/60 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                <div>
                  <div className="text-xs font-semibold text-slate-200">Apto con Restricciones</div>
                  <div className="text-[10px] text-slate-400">Requiere adecuación laboral/EPP</div>
                </div>
              </div>
              <span className="text-sm font-bold text-amber-400">{aptosRestriccionCount}</span>
            </div>

            {/* EN PROCESO / OBSERVADO */}
            <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700/60 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                <div>
                  <div className="text-xs font-semibold text-slate-200">Evaluado / No Concluido</div>
                  <div className="text-[10px] text-slate-400">Observación clínica o examen pendiente</div>
                </div>
              </div>
              <span className="text-sm font-bold text-blue-400">{observadosCount}</span>
            </div>

            {/* NO APTO */}
            <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700/60 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-rose-500"></div>
                <div>
                  <div className="text-xs font-semibold text-slate-200">No Apto</div>
                  <div className="text-[10px] text-slate-400">Restricción médica absoluta</div>
                </div>
              </div>
              <span className="text-sm font-bold text-rose-400">{noAptosCount}</span>
            </div>
          </div>

          <div className="mt-4 p-3 bg-emerald-950/40 rounded-xl border border-emerald-800/50 text-[11px] text-emerald-300">
            <strong>Protección Secreto Médico:</strong> La empresa sólo accede a las restricciones operativas, preservando la confidencialidad clínica conforme a Ley N° 29733.
          </div>
        </div>

        {/* Vigilance Epidemiological Status */}
        <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 shadow-md lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Activity className="w-4 h-4 text-amber-400" /> Programas de Vigilancia Epidemiológica Activos
            </h3>
            <button
              onClick={() => onNavigateTab('vigilancia')}
              className="text-xs text-amber-400 hover:underline flex items-center gap-1"
            >
              Ver cohortes <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>

          <div className="space-y-3">
            {programas.map((prog) => (
              <div key={prog.id} className="bg-slate-800/60 p-4 rounded-xl border border-slate-700/60">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white">{prog.nombrePrograma.replace('_', ' ')}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      {prog.trabajadoresEnVigilancia} trabajadores en cohorte
                    </span>
                  </div>
                  <span className="text-xs font-semibold text-emerald-400">{prog.avanceActualPorcentaje}% Avance</span>
                </div>

                {/* Progress bar */}
                <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden mb-2">
                  <div 
                    className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                    style={{ width: `${prog.avanceActualPorcentaje}%` }}
                  ></div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span>Médico Responsable: {prog.medicoResponsable}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-amber-400 font-medium">{prog.casosSospechosos} Sospechosos</span>
                    <span className="text-rose-400 font-medium">{prog.casosConfirmados} Confirmados</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Resumen de Cumplimiento de Capacitaciones SST (Ley N° 29783 Art. 35) */}
      <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-indigo-400" /> Resumen de Cumplimiento de Capacitaciones SST & Salud Ocupacional
              </h3>
              <span className="px-2 py-0.5 bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded text-[10px] font-semibold">
                Ley N° 29783 Art. 35
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Monitoreo del Plan Anual de Capacitaciones (Mínimo 4 capacitaciones obligatorias al año) y Formato 3 MTPE D.S. 005-2012-TR.
            </p>
          </div>
          <button
            onClick={() => onNavigateTab('reportes_minsa')}
            className="text-xs text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1 self-start md:self-auto bg-indigo-950/60 px-3 py-1.5 rounded-lg border border-indigo-800/60 transition-all"
          >
            <BookOpen className="w-3.5 h-3.5" /> Ver Formato 3 MTPE <ArrowUpRight className="w-3 h-3" />
          </button>
        </div>

        {/* Training Key Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
          <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/60">
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">Capacitaciones Exigidas</span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl font-bold text-emerald-400">4 / 4</span>
              <span className="text-[10px] text-emerald-300 bg-emerald-500/20 px-1.5 py-0.5 rounded font-medium">100% Ejecutado</span>
            </div>
            <span className="text-[10px] text-slate-400 mt-1 block">Mínimo legal cumplido</span>
          </div>

          <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/60">
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">Horas Lectivas Totales</span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl font-bold text-white">28.5 hrs</span>
              <span className="text-[10px] text-slate-400">impartidas</span>
            </div>
            <span className="text-[10px] text-slate-400 mt-1 block">Promedio 5.7 hrs / módulo</span>
          </div>

          <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/60">
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">Cobertura de Personal</span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl font-bold text-indigo-400">96.8%</span>
              <span className="text-[10px] text-slate-400">asistencia</span>
            </div>
            <span className="text-[10px] text-slate-400 mt-1 block">182 / 188 trabajadores</span>
          </div>

          <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/60">
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">Evidencias PDF / Actas</span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl font-bold text-emerald-400">100%</span>
              <span className="text-[10px] text-slate-400">Digitalizadas</span>
            </div>
            <span className="text-[10px] text-emerald-400 mt-1 block flex items-center gap-1">
              <FileText className="w-3 h-3 inline text-emerald-400" /> Auditables SUNAFIL
            </span>
          </div>
        </div>

        {/* Detailed Training Modules Progress List */}
        <div className="space-y-2.5">
          <div className="text-xs font-semibold text-slate-300 mb-2 flex items-center justify-between">
            <span>Programa Anual de Capacitaciones Ejecutadas (Periodo 2026)</span>
            <span className="text-slate-400 font-normal">Cumplimiento D.S. 005-2012-TR</span>
          </div>

          {[
            {
              titulo: '1. Inducción General & Específica en SST y Prevención de Riesgos',
              norma: 'Ley 29783 Art. 49 / D.S. 005-2012-TR',
              horas: '4.0 hrs',
              asistencia: '100% Cobertura',
              fecha: '15/01/2026',
              estado: 'CONFORME'
            },
            {
              titulo: '2. Ergonomía Ocupacional, Trastornos Musculoesqueléticos y Pausas Activas',
              norma: 'R.M. 375-2008-TR',
              horas: '6.0 hrs',
              asistencia: '98% Cobertura',
              fecha: '20/03/2026',
              estado: 'CONFORME'
            },
            {
              titulo: '3. Uso Correcto, Inspección y Mantenimiento de EPP por Agentes de Riesgo',
              norma: 'R.M. 312-2011-MINSA / Norma G.050',
              horas: '8.0 hrs',
              asistencia: '95% Cobertura',
              fecha: '18/05/2026',
              estado: 'CONFORME'
            },
            {
              titulo: '4. Salud Mental Laboral, Prevención del Estrés y Factores Psicosociales',
              norma: 'Ley 29783 / Ley 30364',
              horas: '5.5 hrs',
              asistencia: '94% Cobertura',
              fecha: '10/06/2026',
              estado: 'CONFORME'
            },
            {
              titulo: '5. Primeros Auxilios, Soporte Vital Básico y Respuesta a Emergencias (Brigadas)',
              norma: 'D.S. 005-2012-TR',
              horas: '5.0 hrs',
              asistencia: '100% Brigadistas',
              fecha: '12/07/2026',
              estado: 'CONFORME'
            }
          ].map((item, idx) => (
            <div key={idx} className="bg-slate-800/80 p-3 rounded-xl border border-slate-700/60 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
              <div className="flex items-start sm:items-center gap-3">
                <div className="p-2 bg-indigo-500/10 text-indigo-400 rounded-lg shrink-0 mt-0.5 sm:mt-0">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                </div>
                <div>
                  <div className="font-semibold text-slate-200">{item.titulo}</div>
                  <div className="text-[11px] text-slate-400 flex flex-wrap items-center gap-2 mt-0.5">
                    <span className="text-indigo-300">{item.norma}</span>
                    <span>•</span>
                    <span>{item.horas} lectivas</span>
                    <span>•</span>
                    <span>Fecha: {item.fecha}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0 self-end sm:self-auto">
                <span className="text-[11px] font-medium text-slate-300 bg-slate-700/60 px-2 py-0.5 rounded">
                  {item.asistencia}
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  {item.estado}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Statutory Alerts & Deadlines */}
      <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 shadow-md">
        <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-rose-400" /> Alertas de Cumplimiento Normativo MINSA / MTPE
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div className="p-3 bg-rose-950/40 rounded-xl border border-rose-800/60 text-rose-200">
            <div className="font-bold flex items-center justify-between mb-1">
              <span>Notificación SAT MTPE</span>
              <span className="px-1.5 py-0.5 bg-rose-800 text-white text-[10px] rounded">24 Horas</span>
            </div>
            <p className="text-[11px] text-rose-300">
              Accidentes Mortales e Incidentes Peligrosos requieren reporte obligatorio mediante sistema SAT en máximo 24 horas.
            </p>
          </div>

          <div className="p-3 bg-amber-950/40 rounded-xl border border-amber-800/60 text-amber-200">
            <div className="font-bold flex items-center justify-between mb-1">
              <span>Custodia HCO (40 Años)</span>
              <span className="px-1.5 py-0.5 bg-amber-800 text-white text-[10px] rounded">Art. 35 DS 005</span>
            </div>
            <p className="text-[11px] text-amber-300">
              Conservación garantizada por 40 años para expuestos a agentes carcinógenos / sílice con borrado lógico protegido.
            </p>
          </div>

          <div className="p-3 bg-emerald-950/40 rounded-xl border border-emerald-800/60 text-emerald-200">
            <div className="font-bold flex items-center justify-between mb-1">
              <span>Revisión de Bateria EMO</span>
              <span className="px-1.5 py-0.5 bg-emerald-800 text-white text-[10px] rounded">RM 312-2011</span>
            </div>
            <p className="text-[11px] text-emerald-300">
              Validación automatizada de 9 componentes antes de habilitar la emisión de la Firma Médica en Certificado.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
