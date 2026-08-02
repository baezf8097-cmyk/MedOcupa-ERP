import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Database } from 'lucide-react';

interface Props {
  children: ReactNode;
  moduleName?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error(`[ErrorBoundary - ${this.props.moduleName || 'App'}]`, error, errorInfo);
  }

  private handleResetState = () => {
    this.setState({ hasError: false, error: null });
  };

  private handleResetLocalStorage = () => {
    if (window.confirm('¿Desea restablecer los datos locales? Esto reparará cualquier registro dañado y recargará la aplicación.')) {
      try {
        localStorage.removeItem('medocupa_db_store');
      } catch (e) {
        console.error(e);
      }
      window.location.reload();
    }
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="p-6 bg-slate-900 border border-rose-900/50 rounded-2xl shadow-2xl text-slate-100 my-4 max-w-2xl mx-auto">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-3 bg-rose-500/10 text-rose-400 border border-rose-500/30 rounded-xl">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white font-display">
                Módulo temporalmente no disponible {this.props.moduleName ? `(${this.props.moduleName})` : ''}
              </h3>
              <p className="text-xs text-slate-400">
                Se ha evitado un bloqueo de pantalla en blanco. El sistema ha capturado la excepción de forma segura.
              </p>
            </div>
          </div>

          <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl mb-4 font-mono text-[11px] text-rose-300 overflow-x-auto">
            {this.state.error?.message || 'Error inesperado de renderizado'}
          </div>

          <div className="flex flex-wrap items-center justify-end gap-3 pt-2 border-t border-slate-800">
            <button
              onClick={this.handleResetLocalStorage}
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-semibold flex items-center gap-2 border border-slate-700 transition-all"
              title="Limpia registros con campos incompletos y restaura la base de datos inicial"
            >
              <Database className="w-3.5 h-3.5 text-amber-400" /> Restablecer Datos Locales
            </button>

            <button
              onClick={this.handleResetState}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold flex items-center gap-2 shadow-lg shadow-indigo-950 transition-all"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Reintentar Cargar Módulo
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
