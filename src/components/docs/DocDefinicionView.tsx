import React from 'react';
import { PROYECTO_DEFINICION } from '../../data/documentationData';
import { FileText, Users, Scale, ShieldCheck, CheckCircle2 } from 'lucide-react';

export const DocDefinicionView: React.FC = () => {
  return (
    <div className="space-y-6 text-slate-100">
      {/* Title */}
      <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-xl">
        <div className="flex items-center gap-2 mb-2">
          <span className="px-2.5 py-0.5 bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-bold uppercase rounded">
            Indicación 1 & 2 - Definición del Proyecto ERP
          </span>
          <span className="text-xs text-slate-400">Versión {PROYECTO_DEFINICION.version}</span>
        </div>
        <h2 className="text-2xl font-bold font-display text-white">{PROYECTO_DEFINICION.titulo}</h2>
        <p className="text-xs text-slate-400 mt-1">
          Documento técnico elaborado por la empresa consultora especialista en desarrollo ERP de Salud Ocupacional.
        </p>
      </div>

      {/* Team Declaration (Indicación 1) */}
      <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-lg space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
          <Users className="w-5 h-5 text-emerald-400" /> Equipo Multidisciplinario de Desarrollo
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700/80">
            <span className="font-bold text-emerald-400 block mb-0.5">Arquitecto de Software Senior</span>
            <p className="text-slate-300 text-[11px]">Diseño de microservicios, seguridad OAuth/JWT y trazabilidad inmutable.</p>
          </div>
          <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700/80">
            <span className="font-bold text-emerald-400 block mb-0.5">Analista Funcional Médico</span>
            <p className="text-slate-300 text-[11px]">Mapeo de protocolos R.M. 312-2011-MINSA y normativa SUNAFIL.</p>
          </div>
          <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700/80">
            <span className="font-bold text-emerald-400 block mb-0.5">DBA Senior & Especialista Seguridad</span>
            <p className="text-slate-300 text-[11px]">PostgreSQL 3NF, cifrado AES-256 y cumplimiento Ley 29733.</p>
          </div>
        </div>
      </div>

      {/* Objectives & Scope (Indicación 2) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-lg space-y-3">
          <h3 className="text-base font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" /> Objetivos Estratégicos
          </h3>
          <ul className="space-y-2 text-xs text-slate-300">
            {PROYECTO_DEFINICION.objetivos.map((obj, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0"></span>
                <span>{obj}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Peruvian Regulations */}
        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-lg space-y-3">
          <h3 className="text-base font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
            <Scale className="w-5 h-5 text-amber-400" /> Marco Normativo Peruano Aplicable
          </h3>
          <div className="space-y-2 text-xs">
            {PROYECTO_DEFINICION.normativaPeruana.map((norma, idx) => (
              <div key={idx} className="p-2.5 bg-slate-800/60 rounded-lg border border-slate-700/80 flex items-center justify-between">
                <span className="font-bold text-amber-300 font-mono">{norma.ley}</span>
                <span className="text-slate-300 text-[11px] text-right">{norma.nombre}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
