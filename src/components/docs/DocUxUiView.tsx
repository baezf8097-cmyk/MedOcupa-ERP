import React from 'react';
import { Palette, Layout, Type, Smartphone, Moon } from 'lucide-react';

export const DocUxUiView: React.FC = () => {
  return (
    <div className="space-y-6 text-slate-100">
      {/* Header */}
      <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-xl">
        <div className="flex items-center gap-2 mb-2">
          <span className="px-2.5 py-0.5 bg-pink-500/20 text-pink-300 border border-pink-500/30 text-[10px] font-bold uppercase rounded">
            Indicación 7 - Sistema de Diseño UX/UI ERP
          </span>
        </div>
        <h2 className="text-2xl font-bold font-display text-white">Guía de Estilo y Experiencia de Usuario Pro</h2>
        <p className="text-xs text-slate-400 mt-1">
          Arquitectura de interfaz corporativa tipo ERP para médicos, personal de enfermería, ingenieros SST y ejecutivos de RRHH.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-lg space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
            <Palette className="w-5 h-5 text-emerald-400" /> Paleta de Colores Corporativa
          </h3>

          <div className="space-y-2 text-xs">
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
              <span className="font-bold text-emerald-400">Emeral & Slate (Clínico)</span>
              <span className="text-slate-400 text-[10px]">Utilizado en aprobaciones médicas y dashboards</span>
            </div>
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
              <span className="font-bold text-amber-400">Amber / Gold (SST & Advertencias)</span>
              <span className="text-slate-400 text-[10px]">Alertas de restricciones y vigilancia epidemiológica</span>
            </div>
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
              <span className="font-bold text-rose-400">Rose & Red (Siniestralidad)</span>
              <span className="text-slate-400 text-[10px]">Accidentes de trabajo y reportes SAT 24h</span>
            </div>
          </div>
        </div>

        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-lg space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
            <Type className="w-5 h-5 text-pink-400" /> Tipografía & Ergonomía de Pantalla
          </h3>

          <div className="space-y-3 text-xs text-slate-300">
            <div>
              <strong className="text-white block mb-0.5">Escala Tipográfica Cuestionable:</strong>
              <p className="text-slate-400">Pairing de fuentes display sans con jerarquía matemática estricta para legibilidad bajo luz solar o clínicas de campo.</p>
            </div>
            <div>
              <strong className="text-white block mb-0.5">Responsive & Touch Ready:</strong>
              <p className="text-slate-400">Áreas táctiles mínimas de 44px adaptadas a tabletas médicas e impresoras térmicas de carné.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
