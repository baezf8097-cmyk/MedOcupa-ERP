import React from 'react';
import { AuditLog } from '../../types/erp';
import { Shield, Lock, X, CheckCircle2, AlertTriangle, FileText } from 'lucide-react';

interface AuditLogModalProps {
  isOpen: boolean;
  onClose: () => void;
  logs: AuditLog[];
}

export const AuditLogModal: React.FC<AuditLogModalProps> = ({ isOpen, onClose, logs }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-4xl p-6 shadow-2xl text-slate-100 flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 shrink-0">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold uppercase rounded">
                Trazabilidad Inmutable Append-Only
              </span>
              <span className="text-xs text-slate-400">Cumplimiento Ley N° 29733 & D.S. 003-2013-JUS</span>
            </div>
            <h3 className="text-xl font-bold font-display text-white flex items-center gap-2">
              <Shield className="w-5 h-5 text-emerald-400" /> Registro de Auditoría de Accesos y Datos Médicos
            </h3>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Logs Table */}
        <div className="p-2 my-4 overflow-y-auto custom-scrollbar flex-1">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] font-bold tracking-wider sticky top-0 border-b border-slate-800">
              <tr>
                <th className="px-3 py-2.5">Timestamp (UTC)</th>
                <th className="px-3 py-2.5">Usuario / Rol</th>
                <th className="px-3 py-2.5">Acción Ejecutada</th>
                <th className="px-3 py-2.5">Recurso / Paciente</th>
                <th className="px-3 py-2.5">IP Origen</th>
                <th className="px-3 py-2.5 text-right">Resultado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-800/50 font-mono text-[11px]">
                  <td className="px-3 py-2 text-slate-400 font-bold whitespace-nowrap">{log.timestamp}</td>
                  <td className="px-3 py-2 text-slate-200 font-sans font-medium">
                    <div>{log.usuario}</div>
                    <div className="text-[10px] text-emerald-400 font-mono">{log.rol}</div>
                  </td>
                  <td className="px-3 py-2 font-bold text-slate-100">{log.accion}</td>
                  <td className="px-3 py-2 text-slate-300 font-sans max-w-xs truncate">{log.recurso}</td>
                  <td className="px-3 py-2 text-slate-400">{log.ip}</td>
                  <td className="px-3 py-2 text-right">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-800 font-sans">
                      {log.resultado}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400 shrink-0">
          <span className="flex items-center gap-1.5">
            <Lock className="w-4 h-4 text-emerald-400" /> Los registros de auditoría no pueden ser modificados ni eliminados por ningún rol.
          </span>
          <button onClick={onClose} className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-medium">
            Cerrar Ventana
          </button>
        </div>
      </div>
    </div>
  );
};
