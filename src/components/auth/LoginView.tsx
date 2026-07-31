import React, { useState } from 'react';
import { Stethoscope, Lock, Mail, ShieldAlert, LogIn, CheckCircle2 } from 'lucide-react';
import { User, Role } from '../../types/erp';

interface LoginViewProps {
  onLoginSuccess: (token: string, user: User) => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg('Por favor complete todos los campos');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Error al iniciar sesión');
      }

      onLoginSuccess(data.token, {
        id: data.user.id,
        nombre: data.user.nombre,
        email: data.user.email,
        rol: data.user.role as Role,
        cmp_rnm: data.user.cmp_rnm,
        cep: data.user.cep,
        empresaId: data.user.empresaId,
        avatar: data.user.avatar || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=200'
      });
    } catch (err: any) {
      setErrorMsg(err.message || 'No se pudo conectar con el servidor');
    } finally {
      setLoading(false);
    }
  };

  const setDemoCredentials = (roleEmail: string, pass: string) => {
    setEmail(roleEmail);
    setPassword(pass);
    setErrorMsg('');
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl space-y-6">
        
        {/* Header Logo */}
        <div className="text-center space-y-2">
          <div className="inline-flex w-14 h-14 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 items-center justify-center text-indigo-400 mb-2">
            <Stethoscope className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-white font-sans">MedOcupa ERP</h2>
          <p className="text-xs text-slate-400">
            Sistema Integrado de Salud Ocupacional & Vigilancia Epidemiológica (Ley 29783)
          </p>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="bg-rose-500/10 border border-rose-500/30 rounded-lg p-3 text-xs text-rose-300 flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-300">Correo Electrónico Institucional</label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ejemplo@rsa.pe"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-300">Contraseña de Acceso</label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm py-2.5 rounded-lg flex items-center justify-center gap-2 transition-colors disabled:opacity-50 cursor-pointer shadow-lg shadow-indigo-600/20 mt-2"
          >
            {loading ? (
              <span className="inline-block animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
            ) : (
              <>
                <LogIn className="w-4 h-4" />
                <span>Ingresar al Sistema</span>
              </>
            )}
          </button>
        </form>

        {/* Demo Roles Quick Select */}
        <div className="pt-4 border-t border-slate-800/80 space-y-2">
          <span className="text-[11px] text-slate-400 font-medium block text-center">
            Acceso Rápido para Pruebas de Auditoría:
          </span>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setDemoCredentials('medico@rsa.pe', 'medico123')}
              className="text-left bg-slate-950/60 hover:bg-emerald-950/30 border border-slate-800 hover:border-emerald-500/40 p-2 rounded-lg text-[11px] transition-colors cursor-pointer"
            >
              <div className="font-semibold text-emerald-400">1. Médico Ocupacional</div>
              <div className="text-slate-500 text-[10px]">medico@rsa.pe</div>
            </button>

            <button
              type="button"
              onClick={() => setDemoCredentials('enfermera@rsa.pe', 'enfermera123')}
              className="text-left bg-slate-950/60 hover:bg-teal-950/30 border border-slate-800 hover:border-teal-500/40 p-2 rounded-lg text-[11px] transition-colors cursor-pointer"
            >
              <div className="font-semibold text-teal-400">2. Enfermera Ocup.</div>
              <div className="text-slate-500 text-[10px]">enfermera@rsa.pe</div>
            </button>

            <button
              type="button"
              onClick={() => setDemoCredentials('sst@rsa.pe', 'sst123')}
              className="text-left bg-slate-950/60 hover:bg-amber-950/30 border border-slate-800 hover:border-amber-500/40 p-2 rounded-lg text-[11px] transition-colors cursor-pointer"
            >
              <div className="font-semibold text-amber-400">3. Especialista SST</div>
              <div className="text-slate-500 text-[10px]">sst@rsa.pe</div>
            </button>

            <button
              type="button"
              onClick={() => setDemoCredentials('admin@rsa.pe', 'admin123')}
              className="text-left bg-slate-950/60 hover:bg-indigo-950/30 border border-slate-800 hover:border-indigo-500/40 p-2 rounded-lg text-[11px] transition-colors cursor-pointer"
            >
              <div className="font-semibold text-indigo-400">4. Administrador</div>
              <div className="text-slate-500 text-[10px]">admin@rsa.pe</div>
            </button>
          </div>
        </div>

        <div className="text-center text-[10px] text-slate-500 flex items-center justify-center gap-1">
          <CheckCircle2 className="w-3 h-3 text-emerald-500" />
          <span>Autenticación JWT Servidor & Encriptación BCRYPT Activa</span>
        </div>
      </div>
    </div>
  );
};
