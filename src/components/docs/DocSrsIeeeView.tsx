import React from 'react';
import { DOCUMENTO_IEEE_SRS } from '../../data/documentationData';
import { BookOpen, CheckCircle, ShieldCheck, Cpu, Code } from 'lucide-react';

export const DocSrsIeeeView: React.FC = () => {
  return (
    <div className="space-y-6 text-slate-100">
      {/* Header */}
      <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-xl">
        <div className="flex items-center gap-2 mb-2">
          <span className="px-2.5 py-0.5 bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-[10px] font-bold uppercase rounded">
            Indicación 3 - IEEE Std 830-1998 Standard
          </span>
          <span className="text-xs text-slate-400 font-mono">{DOCUMENTO_IEEE_SRS.codigoDocumento}</span>
        </div>
        <h2 className="text-2xl font-bold font-display text-white">{DOCUMENTO_IEEE_SRS.titulo}</h2>
        <p className="text-xs text-slate-400 mt-1">
          Especificación Formal de Requisitos de Software vinculante para desarrollo, homologación auditorable y certificación médica.
        </p>
      </div>

      {/* SRS Sections */}
      <div className="space-y-6">
        {DOCUMENTO_IEEE_SRS.secciones.map((sec) => (
          <div key={sec.numero} className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-lg space-y-3">
            <h3 className="text-base font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
              <BookOpen className="w-5 h-5 text-indigo-400" /> {sec.numero}. {sec.titulo}
            </h3>

            {sec.contenido && (
              <p className="text-xs text-slate-300 leading-relaxed">{sec.contenido}</p>
            )}

            {sec.requisitos && (
              <ul className="space-y-2 text-xs text-slate-200">
                {sec.requisitos.map((req, idx) => (
                  <li key={idx} className="p-3 bg-slate-800/60 rounded-xl border border-slate-700/80 font-mono">
                    {req}
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
