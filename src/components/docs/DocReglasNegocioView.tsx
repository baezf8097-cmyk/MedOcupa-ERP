import React, { useState } from 'react';
import { REGLAS_DE_NEGOCIO } from '../../data/businessRules';
import { Scale, Search, Filter, ShieldCheck, AlertCircle } from 'lucide-react';

export const DocReglasNegocioView: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedModulo, setSelectedModulo] = useState<string>('TODOS');

  const modulos = Array.from(new Set(REGLAS_DE_NEGOCIO.map(r => r.modulo)));

  const filteredRules = REGLAS_DE_NEGOCIO.filter(r => {
    const matchesModulo = selectedModulo === 'TODOS' || r.modulo === selectedModulo;
    const matchesQuery =
      r.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.descripcion.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.baseLegalPeruana.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesModulo && matchesQuery;
  });

  return (
    <div className="space-y-6 text-slate-100">
      {/* Header */}
      <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-bold uppercase rounded">
              Indicación 4 - Catálogo Completo de Reglas de Negocio
            </span>
            <span className="text-xs text-slate-400">{REGLAS_DE_NEGOCIO.length} Reglas Codificadas</span>
          </div>
          <h2 className="text-2xl font-bold font-display text-white">Motor de Reglas de Negocio (Perú MINSA / MTPE)</h2>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar regla por código o ley..."
              className="bg-slate-800 border border-slate-700/80 rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-amber-500"
            />
          </div>

          <select
            value={selectedModulo}
            onChange={(e) => setSelectedModulo(e.target.value)}
            className="bg-slate-800 border border-slate-700/80 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
          >
            <option value="TODOS">Todos los Módulos</option>
            {modulos.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Rules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredRules.map((rn) => (
          <div key={rn.codigo} className="bg-slate-900 rounded-2xl border border-slate-800 p-5 shadow-lg space-y-3 hover:border-amber-500/50 transition-all flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono font-bold text-xs px-2.5 py-1 bg-amber-950/80 text-amber-300 rounded border border-amber-800">
                  {rn.codigo}
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase ${
                  rn.prioridad === 'CRITICA'
                    ? 'bg-rose-950/80 text-rose-300 border-rose-800'
                    : 'bg-amber-950/80 text-amber-300 border-amber-800'
                }`}>
                  {rn.prioridad}
                </span>
              </div>

              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">{rn.modulo}</div>
              <h3 className="text-base font-bold text-white mb-2">{rn.nombre}</h3>
              <p className="text-xs text-slate-300 leading-relaxed mb-3">{rn.descripcion}</p>

              <div className="space-y-2 text-xs bg-slate-800/60 p-3 rounded-xl border border-slate-800">
                <div>
                  <strong className="text-slate-400 text-[10px] uppercase block">Condición:</strong>
                  <span className="text-slate-200">{rn.condicion}</span>
                </div>
                <div>
                  <strong className="text-emerald-400 text-[10px] uppercase block">Resultado Esperado:</strong>
                  <span className="text-emerald-200 font-medium">{rn.resultado}</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400 font-mono">
              <span>Base Legal: <strong className="text-amber-300 font-sans">{rn.baseLegalPeruana}</strong></span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
