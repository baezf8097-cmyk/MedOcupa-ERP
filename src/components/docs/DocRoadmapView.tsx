import React from 'react';
import { ROADMAP_DESARROLLO } from '../../data/documentationData';
import { Map, Calendar, AlertTriangle, CheckCircle2 } from 'lucide-react';

export const DocRoadmapView: React.FC = () => {
  return (
    <div className="space-y-6 text-slate-100">
      {/* Header */}
      <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-xl">
        <div className="flex items-center gap-2 mb-2">
          <span className="px-2.5 py-0.5 bg-orange-500/20 text-orange-300 border border-orange-500/30 text-[10px] font-bold uppercase rounded">
            Indicación 8 - Plan de Desarrollo & Roadmap de Fases
          </span>
        </div>
        <h2 className="text-2xl font-bold font-display text-white">Cronograma de Ejecución y Plan por Sprints</h2>
        <p className="text-xs text-slate-400 mt-1">
          División modular de sprints con análisis de dependencias técnicas y matriz de riesgos para entrega continua.
        </p>
      </div>

      <div className="space-y-4">
        {ROADMAP_DESARROLLO.map((fase, idx) => (
          <div key={idx} className="bg-slate-900 rounded-2xl border border-slate-800 p-6 shadow-lg space-y-3 hover:border-slate-700 transition-all">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-xl bg-orange-500/20 text-orange-400 border border-orange-500/30 flex items-center justify-center font-bold text-sm">
                  0{idx + 1}
                </span>
                <div>
                  <h3 className="text-base font-bold text-white">{fase.fase}</h3>
                  <span className="text-xs text-slate-400">{fase.sprints} • Duración estimada: {fase.duracion}</span>
                </div>
              </div>

              <span className={`text-[10px] font-bold px-2.5 py-1 rounded border uppercase ${
                fase.prioridad === 'CRITICA'
                  ? 'bg-rose-950/80 text-rose-300 border-rose-800'
                  : 'bg-amber-950/80 text-amber-300 border-amber-800'
              }`}>
                Prioridad: {fase.prioridad}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="bg-slate-800/60 p-3.5 rounded-xl border border-slate-800 space-y-1">
                <span className="font-bold text-emerald-400 text-[10px] uppercase block">Módulos Entregables:</span>
                <ul className="list-disc list-inside text-slate-200 space-y-0.5">
                  {fase.modulos.map((m, i) => (
                    <li key={i}>{m}</li>
                  ))}
                </ul>
              </div>

              <div className="bg-rose-950/30 p-3.5 rounded-xl border border-rose-800/50 text-rose-200 space-y-1">
                <span className="font-bold text-rose-400 text-[10px] uppercase block flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5" /> Riesgo Identificado:
                </span>
                <p className="text-slate-300">{fase.riesgos}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
