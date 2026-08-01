import React, { useState } from 'react';
import { MODELO_BASE_DATOS_DDL } from '../../data/documentationData';
import { Database, Copy, Check, ShieldCheck, Code, Layers } from 'lucide-react';

export const DocBaseDatosView: React.FC = () => {
  const [copied, setCopied] = useState(false);

  const handleCopySQL = () => {
    navigator.clipboard.writeText(MODELO_BASE_DATOS_DDL);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 text-slate-100">
      {/* Header */}
      <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 bg-purple-500/20 text-purple-300 border border-purple-500/30 text-[10px] font-bold uppercase rounded">
              Indicación 6 - Modelo Relacional ER 3NF & DDL Drizzle
            </span>
          </div>
          <h2 className="text-2xl font-bold font-display text-white">Diseño Completo de Base de Datos PostgreSQL</h2>
          <p className="text-xs text-slate-400 mt-1">
            Esquema relacional de tablas normalizadas en Tercera Forma Normal (3NF) con claves foráneas, restricciones de auditoría y Soft Delete.
          </p>
        </div>

        <button
          onClick={handleCopySQL}
          className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white font-semibold rounded-lg text-xs flex items-center gap-2 shadow-lg shadow-purple-900/40 transition-all shrink-0"
        >
          {copied ? <Check className="w-4 h-4 text-white" /> : <Copy className="w-4 h-4" />}
          {copied ? '¡Código SQL Copiado!' : 'Copiar DDL SQL PostgreSQL'}
        </button>
      </div>

      {/* ER Diagram Representation */}
      <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-lg space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
          <Layers className="w-5 h-5 text-purple-400" /> Relaciones Principales del Modelo ER
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700">
            <strong className="text-purple-300 block mb-1 font-mono">empresas 1 : N trabajadores</strong>
            <p className="text-slate-400 text-[11px]">Toda empresa cliente agrupa múltiples trabajadores asociados a su RUC y nivel SCTR.</p>
          </div>

          <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700">
            <strong className="text-purple-300 block mb-1 font-mono">trabajadores 1 : 1 historias_clinicas</strong>
            <p className="text-slate-400 text-[11px]">Unicidad garantizada para la Historia Clínica Ocupacional (HCO) por documento de identidad.</p>
          </div>

          <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700">
            <strong className="text-purple-300 block mb-1 font-mono">emos 1 : 1 certificados_aptitud</strong>
            <p className="text-slate-400 text-[11px]">Cada examen EMO concluido genera exactamente un Certificado Anexo 3 con firma del médico.</p>
          </div>
        </div>
      </div>

      {/* DDL Code Block */}
      <div className="bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden shadow-2xl">
        <div className="bg-slate-900 px-4 py-3 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Code className="w-4 h-4 text-purple-400" />
            <span className="text-xs font-mono font-bold text-slate-300">schema.sql / PostgreSQL DDL Script</span>
          </div>
        </div>

        <pre className="p-4 text-xs font-mono text-purple-300/90 overflow-x-auto leading-relaxed custom-scrollbar">
          <code>{MODELO_BASE_DATOS_DDL}</code>
        </pre>
      </div>
    </div>
  );
};
