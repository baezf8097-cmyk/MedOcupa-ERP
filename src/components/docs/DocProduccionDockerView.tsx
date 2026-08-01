import React, { useState } from 'react';
import { CONFIGURACION_DOCKER } from '../../data/documentationData';
import { Package, Copy, Check, Terminal, Server, ShieldCheck, FileCode } from 'lucide-react';

export const DocProduccionDockerView: React.FC = () => {
  const [copiedDocker, setCopiedDocker] = useState(false);
  const [copiedCompose, setCopiedCompose] = useState(false);

  const handleCopy = (text: string, type: 'docker' | 'compose') => {
    navigator.clipboard.writeText(text);
    if (type === 'docker') {
      setCopiedDocker(true);
      setTimeout(() => setCopiedDocker(false), 2000);
    } else {
      setCopiedCompose(true);
      setTimeout(() => setCopiedCompose(false), 2000);
    }
  };

  return (
    <div className="space-y-6 text-slate-100">
      {/* Header */}
      <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-xl">
        <div className="flex items-center gap-2 mb-2">
          <span className="px-2.5 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold uppercase rounded">
            Indicación 11 - Paquete de Producción & Docker Artifacts
          </span>
        </div>
        <h2 className="text-2xl font-bold font-display text-white">Manual de Despliegue en Producción & Contenedores</h2>
        <p className="text-xs text-slate-400 mt-1">
          Configuración estandarizada Docker Compose, scripts de respaldo automático de PostgreSQL y variables de entorno seguras.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Dockerfile Block */}
        <div className="bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden shadow-2xl flex flex-col justify-between">
          <div>
            <div className="bg-slate-900 px-4 py-3 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileCode className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-mono font-bold text-slate-300">Dockerfile (Multi-Stage Build)</span>
              </div>
              <button
                onClick={() => handleCopy(CONFIGURACION_DOCKER.dockerfile, 'docker')}
                className="text-[11px] font-semibold text-emerald-400 hover:underline flex items-center gap-1"
              >
                {copiedDocker ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedDocker ? '¡Copiado!' : 'Copiar'}
              </button>
            </div>
            <pre className="p-4 text-[11px] font-mono text-emerald-300/90 overflow-x-auto leading-relaxed">
              <code>{CONFIGURACION_DOCKER.dockerfile}</code>
            </pre>
          </div>
        </div>

        {/* Docker Compose Block */}
        <div className="bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden shadow-2xl flex flex-col justify-between">
          <div>
            <div className="bg-slate-900 px-4 py-3 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Server className="w-4 h-4 text-cyan-400" />
                <span className="text-xs font-mono font-bold text-slate-300">docker-compose.yml (Stack Completo)</span>
              </div>
              <button
                onClick={() => handleCopy(CONFIGURACION_DOCKER.dockerCompose, 'compose')}
                className="text-[11px] font-semibold text-cyan-400 hover:underline flex items-center gap-1"
              >
                {copiedCompose ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedCompose ? '¡Copiado!' : 'Copiar'}
              </button>
            </div>
            <pre className="p-4 text-[11px] font-mono text-cyan-300/90 overflow-x-auto leading-relaxed">
              <code>{CONFIGURACION_DOCKER.dockerCompose}</code>
            </pre>
          </div>
        </div>
      </div>

      {/* Production Backup & Deployment commands */}
      <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-lg space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
          <Terminal className="w-5 h-5 text-emerald-400" /> Comandos de Puesta en Marcha & Backups de BD
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
          <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-2">
            <span className="text-slate-400 text-[10px] block font-sans font-bold uppercase">1. Iniciar Contenedores en Producción:</span>
            <code className="text-emerald-400 block bg-slate-900 p-2 rounded">docker-compose up -d --build</code>
          </div>

          <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-2">
            <span className="text-slate-400 text-[10px] block font-sans font-bold uppercase">2. Backup Encriptado Diario PostgreSQL:</span>
            <code className="text-cyan-400 block bg-slate-900 p-2 rounded">pg_dump -U medocupa_usr medocupa_db | gzip &gt; backup_$(date +%Y%m%d).sql.gz</code>
          </div>
        </div>
      </div>
    </div>
  );
};
