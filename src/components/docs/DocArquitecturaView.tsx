import React from 'react';
import { ARQUITECTURA_DETALLADA } from '../../data/documentationData';
import { Cpu, Server, Database, Lock, Shield, Layers, ArrowRight } from 'lucide-react';

export const DocArquitecturaView: React.FC = () => {
  return (
    <div className="space-y-6 text-slate-100">
      {/* Header */}
      <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-xl">
        <div className="flex items-center gap-2 mb-2">
          <span className="px-2.5 py-0.5 bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-[10px] font-bold uppercase rounded">
            Indicación 5 - Arquitectura de Software & Especificaciones
          </span>
        </div>
        <h2 className="text-2xl font-bold font-display text-white">Arquitectura General de la Plataforma ERP</h2>
        <p className="text-xs text-slate-400 mt-1">
          Estructura multicapa desarticulada de microservicios Web RESTful API con cliente React SPA responsivo y persistencia PostgreSQL.
        </p>
      </div>

      {/* Logical Architecture Topology */}
      <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-lg space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
          <Layers className="w-5 h-5 text-cyan-400" /> Diagrama de Servicios y Flujo de Datos
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          {/* Frontend */}
          <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700 space-y-2">
            <div className="font-bold text-emerald-400 flex items-center gap-1.5 text-sm">
              <Cpu className="w-4 h-4" /> Capa Frontend (SPA)
            </div>
            <p className="text-slate-300 font-medium">{ARQUITECTURA_DETALLADA.frontend.tecnologia}</p>
            <p className="text-slate-400 text-[11px]">{ARQUITECTURA_DETALLADA.frontend.justificacion}</p>
          </div>

          {/* Backend */}
          <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700 space-y-2">
            <div className="font-bold text-cyan-400 flex items-center gap-1.5 text-sm">
              <Server className="w-4 h-4" /> Capa Backend (API REST)
            </div>
            <p className="text-slate-300 font-medium">{ARQUITECTURA_DETALLADA.backend.tecnologia}</p>
            <p className="text-slate-400 text-[11px]">{ARQUITECTURA_DETALLADA.backend.justificacion}</p>
          </div>

          {/* DB */}
          <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700 space-y-2">
            <div className="font-bold text-purple-400 flex items-center gap-1.5 text-sm">
              <Database className="w-4 h-4" /> Capa Base de Datos
            </div>
            <p className="text-slate-300 font-medium">{ARQUITECTURA_DETALLADA.database.motor}</p>
            <p className="text-slate-400 text-[11px]">{ARQUITECTURA_DETALLADA.database.justificacion}</p>
          </div>
        </div>
      </div>

      {/* Security & Audit */}
      <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-lg space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
          <Lock className="w-5 h-5 text-emerald-400" /> Esquema de Seguridad y Auditoría Inmutable
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-700/80 space-y-2">
            <h4 className="font-bold text-white">Mecanismos de Protección:</h4>
            <ul className="list-disc list-inside text-slate-300 space-y-1">
              {ARQUITECTURA_DETALLADA.seguridad.mecanismos.map((m, i) => (
                <li key={i}>{m}</li>
              ))}
            </ul>
          </div>

          <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-700/80 space-y-2">
            <h4 className="font-bold text-white">Política de Trazabilidad HIPAA / Ley 29733:</h4>
            <p className="text-slate-300">{ARQUITECTURA_DETALLADA.seguridad.politicaAuditoria}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
