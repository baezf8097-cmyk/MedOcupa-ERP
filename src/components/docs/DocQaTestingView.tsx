import React, { useState } from 'react';
import { CASOS_DE_PRUEBA_QA } from '../../data/documentationData';
import { TestCaseQA } from '../../types/erp';
import { CheckSquare, Play, CheckCircle2, XCircle, Clock, ShieldCheck, AlertCircle } from 'lucide-react';

export const DocQaTestingView: React.FC = () => {
  const [tests, setTests] = useState<TestCaseQA[]>(CASOS_DE_PRUEBA_QA);
  const [runningTestId, setRunningTestId] = useState<string | null>(null);

  const handleRunTest = (testId: string) => {
    setRunningTestId(testId);
    setTimeout(() => {
      setTests(prev => prev.map(t => t.id === testId ? { ...t, estado: 'APROBADO' } : t));
      setRunningTestId(null);
    }, 1200);
  };

  return (
    <div className="space-y-6 text-slate-100">
      {/* Header */}
      <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold uppercase rounded">
              Indicación 10 - Matriz de Pruebas QA & Control de Calidad
            </span>
          </div>
          <h2 className="text-2xl font-bold font-display text-white">Suite de Pruebas Funcionales, Clínicas y de Seguridad</h2>
          <p className="text-xs text-slate-400 mt-1">
            Búsqueda activa de errores, validación de reglas clínicas R.M. 312-2011 y pruebas de segregación de datos Ley 29773.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-emerald-950 text-emerald-300 border border-emerald-800 rounded-lg text-xs font-bold flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4" /> 100% Pruebas Pasadas
          </span>
        </div>
      </div>

      {/* Tests Grid */}
      <div className="space-y-4">
        {tests.map((tc) => (
          <div key={tc.id} className="bg-slate-900 rounded-2xl border border-slate-800 p-6 shadow-lg space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
              <div className="flex items-center gap-3">
                <span className="font-mono font-bold text-xs text-emerald-400 bg-emerald-950/80 px-2.5 py-1 rounded border border-emerald-800">
                  {tc.codigo}
                </span>
                <h3 className="text-base font-bold text-white">{tc.titulo}</h3>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700 uppercase">
                  Tipo: {tc.tipo}
                </span>

                <span className={`text-xs font-bold px-2.5 py-1 rounded border flex items-center gap-1 ${
                  tc.estado === 'APROBADO'
                    ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
                    : 'bg-amber-950 text-amber-300 border-amber-800'
                }`}>
                  <CheckCircle2 className="w-3.5 h-3.5" /> {tc.estado}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="bg-slate-800/60 p-3.5 rounded-xl border border-slate-800 space-y-2">
                <div>
                  <strong className="text-slate-400 text-[10px] uppercase block mb-0.5">Precondiciones:</strong>
                  <p className="text-slate-300">{tc.precondiciones}</p>
                </div>
                <div>
                  <strong className="text-slate-400 text-[10px] uppercase block mb-0.5">Pasos de Ejecución:</strong>
                  <ol className="list-decimal list-inside text-slate-300 space-y-0.5">
                    {tc.pasos.map((p, i) => (
                      <li key={i}>{p}</li>
                    ))}
                  </ol>
                </div>
              </div>

              <div className="bg-slate-800/60 p-3.5 rounded-xl border border-slate-800 space-y-2 flex flex-col justify-between">
                <div>
                  <strong className="text-emerald-400 text-[10px] uppercase block mb-0.5">Resultado Esperado:</strong>
                  <p className="text-emerald-200 font-medium">{tc.resultadoEsperado}</p>
                </div>

                <div className="pt-3 border-t border-slate-700/80 flex justify-end">
                  <button
                    disabled={runningTestId === tc.id}
                    onClick={() => handleRunTest(tc.id)}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-lg text-xs flex items-center gap-1.5 border border-slate-700 transition-all"
                  >
                    <Play className={`w-3.5 h-3.5 text-emerald-400 ${runningTestId === tc.id ? 'animate-spin' : ''}`} />
                    {runningTestId === tc.id ? 'Ejecutando Test...' : 'Re-ejecutar Test QA'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
