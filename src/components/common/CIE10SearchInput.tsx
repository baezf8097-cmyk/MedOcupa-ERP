import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Check, Stethoscope, AlertCircle, Edit3, Plus, Sparkles } from 'lucide-react';

export interface CIE10Item {
  codigo: string;
  descripcion: string;
  categoria: 'MUSCULOESQUELETICO' | 'AUDITIVO' | 'RESPIRATORIO' | 'METABOLICO' | 'PSICOSOCIAL' | 'EXPOSICION' | 'TRAUMATISMO' | 'GENERAL';
  esOcupacionalFrecuente?: boolean;
}

export const CATALOGO_CIE10: CIE10Item[] = [
  // Músculoesquelético / Ergonomía
  { codigo: 'M54.5', descripcion: 'Lumbalgia no especificada / Dolor lumbar disergonómico', categoria: 'MUSCULOESQUELETICO', esOcupacionalFrecuente: true },
  { codigo: 'M54.2', descripcion: 'Cervicalgia / Tensión en columna cervical', categoria: 'MUSCULOESQUELETICO', esOcupacionalFrecuente: true },
  { codigo: 'G56.0', descripcion: 'Síndrome del túnel carpiano / Atrapamiento del nervio mediano', categoria: 'MUSCULOESQUELETICO', esOcupacionalFrecuente: true },
  { codigo: 'M75.1', descripcion: 'Síndrome del manguito rotador / Tendinitis de hombro', categoria: 'MUSCULOESQUELETICO', esOcupacionalFrecuente: true },
  { codigo: 'M65.3', descripcion: 'Dedo en gatillo / Tenosinovitis estenosante', categoria: 'MUSCULOESQUELETICO', esOcupacionalFrecuente: true },
  { codigo: 'M77.1', descripcion: 'Epicondilitis lateral / Codo de tenista laboral', categoria: 'MUSCULOESQUELETICO', esOcupacionalFrecuente: true },
  { codigo: 'M77.0', descripcion: 'Epicondilitis medial / Codo de golfista', categoria: 'MUSCULOESQUELETICO', esOcupacionalFrecuente: true },
  { codigo: 'M65.4', descripcion: 'Tenosinovitis de de Quervain (Estiloides radial)', categoria: 'MUSCULOESQUELETICO', esOcupacionalFrecuente: true },
  { codigo: 'M51.1', descripcion: 'Trastornos de discos intervertebrales lumbares con radiculopatía', categoria: 'MUSCULOESQUELETICO', esOcupacionalFrecuente: true },

  // Oído / Ruido
  { codigo: 'H83.3', descripcion: 'Efectos del ruido sobre el oído interno / Trauma acústico laboral', categoria: 'AUDITIVO', esOcupacionalFrecuente: true },
  { codigo: 'H90.3', descripcion: 'Hipoacusia neurosensorial bilateral por exposición a ruido', categoria: 'AUDITIVO', esOcupacionalFrecuente: true },
  { codigo: 'H90.6', descripcion: 'Hipoacusia neurosensorial unilateral con audición normal contralateral', categoria: 'AUDITIVO', esOcupacionalFrecuente: true },
  { codigo: 'H91.9', descripcion: 'Hipoacusia no especificada / Trazo de desplazamiento temporal del umbral (TTS)', categoria: 'AUDITIVO', esOcupacionalFrecuente: true },
  { codigo: 'H93.1', descripcion: 'Tinnitus / Acúfenos o zumbido permanente de oído', categoria: 'AUDITIVO', esOcupacionalFrecuente: true },

  // Respiratorio / Agentes Químicos y Polvo
  { codigo: 'J60', descripcion: 'Neumoconiosis de los mineros del carbón', categoria: 'RESPIRATORIO', esOcupacionalFrecuente: true },
  { codigo: 'J62.8', descripcion: 'Silicosis / Neumoconiosis debida a otros polvos con sílice', categoria: 'RESPIRATORIO', esOcupacionalFrecuente: true },
  { codigo: 'J61', descripcion: 'Neumoconiosis debida al asbesto y a otras fibras minerales', categoria: 'RESPIRATORIO', esOcupacionalFrecuente: true },
  { codigo: 'J45.0', descripcion: 'Asma predominantemente alérgica / Asma ocupacional', categoria: 'RESPIRATORIO', esOcupacionalFrecuente: true },
  { codigo: 'J30.3', descripcion: 'Otras rinitis alérgicas ocupacionales por polvo o químicos', categoria: 'RESPIRATORIO', esOcupacionalFrecuente: true },
  { codigo: 'J68.0', descripcion: 'Bronquitis y neumonitis debidas a gases, humos, vapores y reactivos', categoria: 'RESPIRATORIO', esOcupacionalFrecuente: true },

  // Salud Mental / Psicosocial
  { codigo: 'F43.0', descripcion: 'Reacción al estrés agudo / Estrés laboral agudo', categoria: 'PSICOSOCIAL', esOcupacionalFrecuente: true },
  { codigo: 'F43.2', descripcion: 'Trastornos de adaptación / Burnout o desgaste profesional', categoria: 'PSICOSOCIAL', esOcupacionalFrecuente: true },
  { codigo: 'Z56.3', descripcion: 'Ritmo de trabajo apresurado / Estrés por sobrecarga laboral', categoria: 'PSICOSOCIAL', esOcupacionalFrecuente: true },
  { codigo: 'F41.1', descripcion: 'Trastorno de ansiedad generalizada', categoria: 'PSICOSOCIAL', esOcupacionalFrecuente: false },

  // Metabólico / Vida Saludable
  { codigo: 'E66.0', descripcion: 'Obesidad debida a exceso de calorías (IMC >= 30)', categoria: 'METABOLICO', esOcupacionalFrecuente: true },
  { codigo: 'E66.9', descripcion: 'Sobrepeso / Obesidad no especificada (IMC 25 - 29.9)', categoria: 'METABOLICO', esOcupacionalFrecuente: true },
  { codigo: 'E78.5', descripcion: 'Dislipidemia no especificada / Hipercolesterolemia o Hipertrigliceridemia', categoria: 'METABOLICO', esOcupacionalFrecuente: true },
  { codigo: 'I10', descripcion: 'Hipertensión esencial (primaria)', categoria: 'METABOLICO', esOcupacionalFrecuente: true },
  { codigo: 'E11.9', descripcion: 'Diabetes mellitus tipo 2 sin complicaciones', categoria: 'METABOLICO', esOcupacionalFrecuente: true },

  // Factores de Exposición Ocupacional (Codificación Z)
  { codigo: 'Z57.0', descripcion: 'Exposición ocupacional al ruido', categoria: 'EXPOSICION', esOcupacionalFrecuente: true },
  { codigo: 'Z57.1', descripcion: 'Exposición ocupacional a la radiación', categoria: 'EXPOSICION', esOcupacionalFrecuente: true },
  { codigo: 'Z57.2', descripcion: 'Exposición ocupacional al polvo de sílice / carbón', categoria: 'EXPOSICION', esOcupacionalFrecuente: true },
  { codigo: 'Z57.3', descripcion: 'Exposición ocupacional a otros contaminantes del aire (humos/gases)', categoria: 'EXPOSICION', esOcupacionalFrecuente: true },
  { codigo: 'Z57.4', descripcion: 'Exposición ocupacional a plaguicidas / químicos', categoria: 'EXPOSICION', esOcupacionalFrecuente: true },
  { codigo: 'Z57.5', descripcion: 'Exposición ocupacional a agentes biológicos (virus/bacterias)', categoria: 'EXPOSICION', esOcupacionalFrecuente: true },

  // Traumatismos y Accidentes
  { codigo: 'S61.0', descripcion: 'Herida de dedo(s) de la mano sin daño de la uña', categoria: 'TRAUMATISMO', esOcupacionalFrecuente: true },
  { codigo: 'S62.6', descripcion: 'Fractura de otros dedos de la mano', categoria: 'TRAUMATISMO', esOcupacionalFrecuente: true },
  { codigo: 'S93.4', descripcion: 'Esguince y torcedura del tobillo', categoria: 'TRAUMATISMO', esOcupacionalFrecuente: true },
  { codigo: 'S83.5', descripcion: 'Esguince y torcedura del ligamento cruzado de la rodilla', categoria: 'TRAUMATISMO', esOcupacionalFrecuente: true },
  { codigo: 'T56.0', descripcion: 'Efecto tóxico del plomo y sus compuestos (Plombemia laboral)', categoria: 'TRAUMATISMO', esOcupacionalFrecuente: true },
  { codigo: 'T60.0', descripcion: 'Efecto tóxico de plaguicidas organofosforados (Inhibición de colinesterasa)', categoria: 'TRAUMATISMO', esOcupacionalFrecuente: true }
];

interface CIE10SearchInputProps {
  value: string;
  onChange: (codigo: string, descripcion: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export const CIE10SearchInput: React.FC<CIE10SearchInputProps> = ({
  value,
  onChange,
  placeholder = 'Buscar por código CIE-10 (ej. M54.5) o diagnóstico...',
  className = '',
  disabled = false
}) => {
  const [query, setQuery] = useState(value || '');
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'SEARCH' | 'MANUAL'>('SEARCH');
  
  // Manual state
  const [manualCode, setManualCode] = useState('');
  const [manualDesc, setManualDesc] = useState('');

  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setQuery(value || '');
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredItems = CATALOGO_CIE10.filter((item) => {
    if (!query.trim()) return item.esOcupacionalFrecuente;
    const q = query.toLowerCase();
    return (
      item.codigo.toLowerCase().includes(q) ||
      item.descripcion.toLowerCase().includes(q) ||
      item.categoria.toLowerCase().includes(q)
    );
  });

  const handleSelect = (item: CIE10Item) => {
    setQuery(`${item.codigo} - ${item.descripcion}`);
    onChange(item.codigo, item.descripcion);
    setIsOpen(false);
  };

  const handleApplyManual = () => {
    if (!manualCode.trim() && !manualDesc.trim()) return;
    const code = manualCode.trim().toUpperCase() || 'CIE10-MANUAL';
    const desc = manualDesc.trim() || 'Diagnóstico médico libre';
    setQuery(`${code} - ${desc}`);
    onChange(code, desc);
    setIsOpen(false);
  };

  const handleQuickUseQueryAsManual = () => {
    if (!query.trim()) return;
    let code = 'CIE10-MANUAL';
    let desc = query.trim();

    const matchCode = query.trim().match(/^([A-Z][0-9]{2}(\.[0-9]{1,2})?)(.*)/i);
    if (matchCode) {
      code = matchCode[1].toUpperCase();
      desc = matchCode[3]?.replace(/^[\s\-:]+/, '') || query.trim();
    }

    setQuery(`${code} - ${desc}`);
    onChange(code, desc);
    setIsOpen(false);
  };

  const handleClear = () => {
    setQuery('');
    setManualCode('');
    setManualDesc('');
    onChange('', '');
    setIsOpen(true);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen) {
      if (e.key === 'ArrowDown' || e.key === 'Enter') {
        setIsOpen(true);
      }
      return;
    }

    if (activeTab === 'SEARCH') {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setHighlightedIndex((prev) => (prev < filteredItems.length - 1 ? prev + 1 : 0));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : filteredItems.length - 1));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (highlightedIndex >= 0 && highlightedIndex < filteredItems.length) {
          handleSelect(filteredItems[highlightedIndex]);
        } else if (query.trim()) {
          handleQuickUseQueryAsManual();
        }
      } else if (e.key === 'Escape') {
        setIsOpen(false);
      }
    }
  };

  const getCategoryBadgeColor = (cat: CIE10Item['categoria']) => {
    switch (cat) {
      case 'MUSCULOESQUELETICO':
        return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
      case 'AUDITIVO':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'RESPIRATORIO':
        return 'bg-sky-500/10 text-sky-400 border-sky-500/20';
      case 'PSICOSOCIAL':
        return 'bg-pink-500/10 text-pink-400 border-pink-500/20';
      case 'METABOLICO':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'EXPOSICION':
        return 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20';
      case 'TRAUMATISMO':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  return (
    <div ref={wrapperRef} className={`relative w-full ${className}`}>
      <div className="relative flex items-center">
        <Stethoscope className="w-4 h-4 absolute left-3 text-indigo-400 pointer-events-none" />
        <input
          type="text"
          value={query}
          disabled={disabled}
          onFocus={() => setIsOpen(true)}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
            setHighlightedIndex(-1);
          }}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-9 pr-8 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 disabled:opacity-50 transition-colors"
        />

        {query && !disabled && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-2.5 p-1 text-slate-400 hover:text-slate-200 transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* DROPDOWN MENU */}
      {isOpen && !disabled && (
        <div className="absolute z-50 left-0 right-0 mt-1 max-h-80 overflow-y-auto bg-slate-950 border border-slate-800 rounded-xl shadow-2xl custom-scrollbar text-xs">
          {/* TAB HEADER */}
          <div className="p-2 border-b border-slate-800/80 bg-slate-900/80 flex items-center justify-between gap-2">
            <div className="flex items-center gap-1 bg-slate-950 p-0.5 rounded-lg border border-slate-800">
              <button
                type="button"
                onClick={() => setActiveTab('SEARCH')}
                className={`px-2 py-1 rounded text-[10px] font-bold flex items-center gap-1 transition-all ${
                  activeTab === 'SEARCH' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Search className="w-3 h-3" /> Catálogo MINSA
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveTab('MANUAL');
                  if (query && !manualCode && !manualDesc) {
                    const match = query.match(/^([A-Z][0-9]{2}(\.[0-9]{1,2})?)(.*)/i);
                    if (match) {
                      setManualCode(match[1].toUpperCase());
                      setManualDesc(match[3]?.replace(/^[\s\-:]+/, '') || '');
                    } else {
                      setManualDesc(query);
                    }
                  }
                }}
                className={`px-2 py-1 rounded text-[10px] font-bold flex items-center gap-1 transition-all ${
                  activeTab === 'MANUAL' ? 'bg-emerald-600 text-white shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Edit3 className="w-3 h-3" /> Código Manual
              </button>
            </div>

            <span className="text-[10px] font-mono text-slate-400">
              {activeTab === 'SEARCH' ? `${filteredItems.length} resultados` : 'Ingreso Libre'}
            </span>
          </div>

          {activeTab === 'SEARCH' ? (
            <div>
              {filteredItems.length === 0 ? (
                <div className="p-4 text-center text-slate-400 flex flex-col items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-400" />
                  <span>No se encontraron coincidencias en el catálogo.</span>
                  {query.trim() && (
                    <button
                      type="button"
                      onClick={handleQuickUseQueryAsManual}
                      className="mt-1 px-3 py-1.5 bg-emerald-600/20 hover:bg-emerald-600 border border-emerald-500/40 text-emerald-300 hover:text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all"
                    >
                      <Plus className="w-3.5 h-3.5" /> Registrar "{query.trim()}" como CIE-10 Manual
                    </button>
                  )}
                </div>
              ) : (
                <div className="p-1 space-y-0.5">
                  {filteredItems.map((item, index) => {
                    const isSelected = value && value.includes(item.codigo);
                    const isHighlighted = index === highlightedIndex;

                    return (
                      <button
                        key={item.codigo}
                        type="button"
                        onClick={() => handleSelect(item)}
                        onMouseEnter={() => setHighlightedIndex(index)}
                        className={`w-full text-left p-2 rounded-lg transition-colors flex items-start justify-between gap-2 ${
                          isHighlighted
                            ? 'bg-indigo-600/20 text-white'
                            : isSelected
                            ? 'bg-slate-900 text-slate-100 font-medium'
                            : 'text-slate-300 hover:bg-slate-900/80'
                        }`}
                      >
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-indigo-400 bg-indigo-500/10 px-1.5 py-0.5 rounded border border-indigo-500/20 text-[11px]">
                              {item.codigo}
                            </span>
                            <span
                              className={`text-[9px] font-semibold px-1.5 py-0.2 rounded border uppercase ${getCategoryBadgeColor(
                                item.categoria
                              )}`}
                            >
                              {item.categoria}
                            </span>
                            {item.esOcupacionalFrecuente && (
                              <span className="text-[9px] text-emerald-400 bg-emerald-500/10 px-1.5 py-0.2 rounded border border-emerald-500/20">
                                Frecuente Ocupacional
                              </span>
                            )}
                          </div>

                          <div className="text-slate-200 text-xs leading-snug">{item.descripcion}</div>
                        </div>

                        {isSelected && <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-1" />}
                      </button>
                    );
                  })}

                  {query.trim() && (
                    <div className="p-2 border-t border-slate-800 bg-slate-900/50">
                      <button
                        type="button"
                        onClick={handleQuickUseQueryAsManual}
                        className="w-full p-2 bg-emerald-950/40 hover:bg-emerald-900/60 border border-emerald-800/60 text-emerald-300 rounded-lg text-left text-xs font-semibold flex items-center justify-between transition-colors"
                      >
                        <span className="flex items-center gap-1.5 truncate">
                          <Plus className="w-3.5 h-3.5 text-emerald-400" /> Usar "{query}" como Diagnóstico CIE-10 Manual
                        </span>
                        <span className="text-[9px] bg-emerald-900/80 text-emerald-200 px-1.5 py-0.5 rounded font-mono font-bold shrink-0">
                          Manual
                        </span>
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            /* TAB: MANUAL ENTRY */
            <div className="p-3 space-y-3 bg-slate-900/40">
              <div className="flex items-center gap-2 text-[11px] text-emerald-300 font-semibold bg-emerald-500/10 p-2 rounded-lg border border-emerald-500/20">
                <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Ingrese directamente cualquier código CIE-10 oficial o diagnóstico médico.</span>
              </div>

              <div>
                <label className="block text-slate-300 text-[11px] font-medium mb-1">
                  Código CIE-10 (Manual)
                </label>
                <input
                  type="text"
                  value={manualCode}
                  onChange={(e) => setManualCode(e.target.value.toUpperCase())}
                  placeholder="Ej: J18.9, A09, K29.7, S60.2"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 font-mono font-bold text-emerald-400 text-xs focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 text-[11px] font-medium mb-1">
                  Descripción / Diagnóstico Médico Detallado
                </label>
                <input
                  type="text"
                  value={manualDesc}
                  onChange={(e) => setManualDesc(e.target.value)}
                  placeholder="Ej: Neumonía lobar bacteriana no especificada"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white text-xs focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleApplyManual}
                  className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg text-xs flex items-center gap-1.5 shadow-md shadow-emerald-950"
                >
                  <Check className="w-3.5 h-3.5" /> Aplicar CIE-10 Manual
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
