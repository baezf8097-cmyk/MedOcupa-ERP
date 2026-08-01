import React, { useState, useEffect } from 'react';
import { 
  Stethoscope, 
  HeartPulse, 
  HardHat, 
  ShieldCheck, 
  UserCheck, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles, 
  Building2, 
  LockKeyhole,
  Edit3,
  X,
  Save,
  BadgeCheck
} from 'lucide-react';
import { User, Role } from '../../types/erp';

interface LoginViewProps {
  onLoginSuccess: (token: string, user: User) => void;
}

interface ProfileConfig {
  id: string;
  email: string;
  role: Role;
  roleTitle: string;
  userName: string;
  cmpNum?: string;
  rnmNum?: string; // RNE / RNM
  cepNum?: string;
  credencialExtra?: string; // CIP / ID
  avatar: string;
  colorTheme: 'emerald' | 'teal' | 'amber' | 'indigo';
  iconName: 'Stethoscope' | 'HeartPulse' | 'HardHat' | 'ShieldCheck';
  modules: string[];
  description: string;
}

const DEFAULT_PROFILES: ProfileConfig[] = [
  {
    id: 'medico',
    email: 'medico@medocupa.pe',
    role: 'MEDICO_OCUPACIONAL',
    roleTitle: '1. Médico Ocupacional',
    userName: 'Dr. Roberto Silva Alva',
    cmpNum: '65432',
    rnmNum: '01234',
    avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=200',
    colorTheme: 'emerald',
    iconName: 'Stethoscope',
    modules: ['Dictámenes de Aptitud', 'Historias Clínicas', 'EMOs y Protocolos', 'Vigilancia Médica'],
    description: 'Acceso completo para emisión de certificados de aptitud y gestión de antecedentes de salud ocupacional.'
  },
  {
    id: 'enfermera',
    email: 'enfermera@medocupa.pe',
    role: 'ENFERMERA_OCUPACIONAL',
    roleTitle: '2. Enfermera Ocupacional',
    userName: 'Lic. María Elena Ramos',
    cepNum: '87654',
    avatar: 'https://images.unsplash.com/photo-1594824813566-82881a798589?auto=format&fit=crop&q=80&w=200',
    colorTheme: 'teal',
    iconName: 'HeartPulse',
    modules: ['Triaje y Somatometría', 'Carné de Inmunizaciones', 'Registro de Ausentismo', 'Descansos Médicos'],
    description: 'Registro de constantes vitales, control de vacunación y seguimiento de descansos médicos.'
  },
  {
    id: 'sst',
    email: 'sst@medocupa.pe',
    role: 'ESPECIALISTA_SST',
    roleTitle: '3. Especialista SST',
    userName: 'Ing. Fernando Castro',
    credencialExtra: 'Reg. CIP: 104958',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
    colorTheme: 'amber',
    iconName: 'HardHat',
    modules: ['Matriz IPERC & Riesgos', 'Investigación Accidentes', 'Reportes MINSA/MTPE', 'Indicadores SST'],
    description: 'Supervisión de seguridad laboral, reportes estadísticos obligatorios e investigación de incidentes.'
  },
  {
    id: 'admin',
    email: 'admin@medocupa.pe',
    role: 'ADMINISTRADOR',
    roleTitle: '4. Administrador del Sistema',
    userName: 'Admin MedOcupa ERP',
    credencialExtra: 'ID: ADMIN-SYSTEM-01',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200',
    colorTheme: 'indigo',
    iconName: 'ShieldCheck',
    modules: ['Gestión de Empresas', 'Perfiles y Permisos', 'Log de Auditoría', 'Guía Maestra System'],
    description: 'Administración global de empresas clientes, roles, configuración de carpetas y logs de sistema.'
  }
];

export const LoginView: React.FC<LoginViewProps> = ({ onLoginSuccess }) => {
  const [profiles, setProfiles] = useState<ProfileConfig[]>(() => {
    const saved = localStorage.getItem('medocupa_custom_login_profiles');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Error parsing stored profiles', e);
      }
    }
    return DEFAULT_PROFILES;
  });

  const [selectedProfileId, setSelectedProfileId] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');

  // Editing state for profile modal
  const [editingProfile, setEditingProfile] = useState<ProfileConfig | null>(null);
  const [editFormName, setEditFormName] = useState<string>('');
  const [editFormCmp, setEditFormCmp] = useState<string>('');
  const [editFormRnm, setEditFormRnm] = useState<string>('');
  const [editFormCep, setEditFormCep] = useState<string>('');
  const [editFormCredencial, setEditFormCredencial] = useState<string>('');

  // Save customized profiles to localStorage whenever updated
  useEffect(() => {
    localStorage.setItem('medocupa_custom_login_profiles', JSON.stringify(profiles));
  }, [profiles]);

  const openEditModal = (e: React.MouseEvent, profile: ProfileConfig) => {
    e.stopPropagation();
    setEditingProfile(profile);
    setEditFormName(profile.userName || '');
    setEditFormCmp(profile.cmpNum || '');
    setEditFormRnm(profile.rnmNum || '');
    setEditFormCep(profile.cepNum || '');
    setEditFormCredencial(profile.credencialExtra || '');
  };

  const handleSaveProfileEdits = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProfile) return;

    if (!editFormName.trim()) {
      alert('El nombre del profesional no puede estar vacío.');
      return;
    }

    setProfiles(prev => prev.map(p => {
      if (p.id === editingProfile.id) {
        return {
          ...p,
          userName: editFormName.trim(),
          cmpNum: editFormCmp.trim(),
          rnmNum: editFormRnm.trim(),
          cepNum: editFormCep.trim(),
          credencialExtra: editFormCredencial.trim()
        };
      }
      return p;
    }));

    setEditingProfile(null);
  };

  const getProfileCredentialsString = (profile: ProfileConfig) => {
    if (profile.role === 'MEDICO_OCUPACIONAL') {
      const cmpStr = profile.cmpNum ? `CMP: ${profile.cmpNum}` : '';
      const rneStr = profile.rnmNum ? `RNE: ${profile.rnmNum}` : '';
      if (cmpStr && rneStr) return `${cmpStr} / ${rneStr}`;
      return cmpStr || rneStr || 'CMP / RNE No Especificado';
    }
    if (profile.role === 'ENFERMERA_OCUPACIONAL') {
      return profile.cepNum ? `CEP: ${profile.cepNum}` : 'CEP No Especificado';
    }
    return profile.credencialExtra || 'Acreditación Sistema';
  };

  const handleSelectProfile = async (profile: ProfileConfig) => {
    setSelectedProfileId(profile.id);
    setLoading(true);
    setErrorMsg('');

    const credentialsFormatted = getProfileCredentialsString(profile);

    try {
      let data: any = null;

      try {
        const res = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: profile.email })
        });

        const contentType = res.headers.get('content-type');
        if (res.ok && contentType && contentType.includes('application/json')) {
          data = await res.json();
        }
      } catch (netErr) {
        console.warn('Servidor API no disponible, usando modo offline local:', netErr);
      }

      const cmpRnmVal = profile.role === 'MEDICO_OCUPACIONAL' || profile.role === 'ESPECIALISTA_SST' || profile.role === 'ADMINISTRADOR'
        ? credentialsFormatted 
        : undefined;

      const cepVal = profile.role === 'ENFERMERA_OCUPACIONAL'
        ? credentialsFormatted
        : undefined;

      // If backend returned JWT token & user
      if (data && data.success && data.user && data.token) {
        onLoginSuccess(data.token, {
          id: data.user.id,
          nombre: profile.userName || data.user.nombre,
          email: profile.email,
          rol: profile.role,
          cmp_rnm: cmpRnmVal || data.user.cmp_rnm,
          cep: cepVal || data.user.cep,
          empresaId: data.user.empresaId,
          avatar: profile.avatar || data.user.avatar
        });
        return;
      }

      // Standalone / local profile login fallback
      const fallbackUser: User = {
        id: `usr-${profile.id}-1`,
        nombre: profile.userName,
        email: profile.email,
        rol: profile.role,
        cmp_rnm: cmpRnmVal,
        cep: cepVal,
        avatar: profile.avatar
      };

      const fallbackToken = `direct-token-${profile.id}-${Date.now()}`;
      
      // Short transition for smooth UX
      setTimeout(() => {
        onLoginSuccess(fallbackToken, fallbackUser);
      }, 300);

    } catch (err: any) {
      setErrorMsg('Ocurrió un error al iniciar sesión. Intente nuevamente.');
      setLoading(false);
      setSelectedProfileId(null);
    }
  };

  const getProfileIcon = (iconName: string) => {
    switch (iconName) {
      case 'Stethoscope': return Stethoscope;
      case 'HeartPulse': return HeartPulse;
      case 'HardHat': return HardHat;
      case 'ShieldCheck': return ShieldCheck;
      default: return UserCheck;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center p-4 md:p-8 font-sans relative">
      <div className="w-full max-w-5xl space-y-8">
        
        {/* Header Section */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold tracking-wide uppercase">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Acceso Simplificado - MedOcupa ERP v1.0.1</span>
          </div>

          <div className="flex items-center justify-center gap-3 pt-1">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center text-white shadow-xl shadow-indigo-600/25">
              <Stethoscope className="w-7 h-7" />
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white">
              MedOcupa <span className="text-indigo-400">ERP</span>
            </h1>
          </div>

          <p className="text-sm text-slate-400 leading-relaxed">
            Sistema Integrado de Salud Ocupacional, Exámenes EMO & Vigilancia Epidemiológica (Ley 29783).
          </p>

          <div className="pt-2 flex items-center justify-center gap-2 text-xs text-slate-300 bg-slate-900/80 border border-slate-800 rounded-xl px-4 py-2.5 max-w-md mx-auto">
            <UserCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Seleccione su perfil operativo para ingresar instantáneamente sin contraseña:</span>
          </div>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="max-w-md mx-auto bg-rose-500/10 border border-rose-500/30 rounded-xl p-3 text-xs text-rose-300 flex items-center gap-2">
            <LockKeyhole className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* 4 User Profile Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {profiles.map((profile) => {
            const IconComponent = getProfileIcon(profile.iconName);
            const isSelected = selectedProfileId === profile.id;

            // Theme style variants
            const cardStyles = {
              emerald: {
                border: 'hover:border-emerald-500/60 focus:border-emerald-500',
                selectedBorder: 'border-emerald-500 ring-2 ring-emerald-500/20 bg-emerald-950/20',
                badgeBg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
                btnBg: 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-900/30',
                accentText: 'text-emerald-400',
                editBtn: 'text-emerald-400 hover:bg-emerald-500/10 border-emerald-500/30'
              },
              teal: {
                border: 'hover:border-teal-500/60 focus:border-teal-500',
                selectedBorder: 'border-teal-500 ring-2 ring-teal-500/20 bg-teal-950/20',
                badgeBg: 'bg-teal-500/10 text-teal-400 border-teal-500/30',
                btnBg: 'bg-teal-600 hover:bg-teal-500 text-white shadow-teal-900/30',
                accentText: 'text-teal-400',
                editBtn: 'text-teal-400 hover:bg-teal-500/10 border-teal-500/30'
              },
              amber: {
                border: 'hover:border-amber-500/60 focus:border-amber-500',
                selectedBorder: 'border-amber-500 ring-2 ring-amber-500/20 bg-amber-950/20',
                badgeBg: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
                btnBg: 'bg-amber-600 hover:bg-amber-500 text-white shadow-amber-900/30',
                accentText: 'text-amber-400',
                editBtn: 'text-amber-400 hover:bg-amber-500/10 border-amber-500/30'
              },
              indigo: {
                border: 'hover:border-indigo-500/60 focus:border-indigo-500',
                selectedBorder: 'border-indigo-500 ring-2 ring-indigo-500/20 bg-indigo-950/20',
                badgeBg: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30',
                btnBg: 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-900/30',
                accentText: 'text-indigo-400',
                editBtn: 'text-indigo-400 hover:bg-indigo-500/10 border-indigo-500/30'
              }
            }[profile.colorTheme];

            const credentialsText = getProfileCredentialsString(profile);

            return (
              <div
                key={profile.id}
                onClick={() => !loading && handleSelectProfile(profile)}
                className={`group relative bg-slate-900/90 border rounded-2xl p-5 flex flex-col justify-between transition-all duration-200 cursor-pointer shadow-xl hover:shadow-2xl hover:-translate-y-1 ${
                  isSelected ? cardStyles.selectedBorder : `border-slate-800/80 ${cardStyles.border}`
                }`}
              >
                {/* Top Badge & Icon */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className={`p-2.5 rounded-xl border ${cardStyles.badgeBg}`}>
                      <IconComponent className="w-5 h-5" />
                    </div>

                    {/* Edit Profile Button */}
                    <button
                      type="button"
                      onClick={(e) => openEditModal(e, profile)}
                      title="Editar nombre y datos profesionales de este perfil"
                      className={`px-2.5 py-1 rounded-lg border text-[11px] font-semibold flex items-center gap-1 transition-colors cursor-pointer ${cardStyles.editBtn}`}
                    >
                      <Edit3 className="w-3 h-3" />
                      <span>Editar</span>
                    </button>
                  </div>

                  {/* Profile Info */}
                  <div className="space-y-1">
                    <span className={`text-xs font-bold uppercase tracking-wide block ${cardStyles.accentText}`}>
                      {profile.roleTitle}
                    </span>
                    <h3 className="text-base font-bold text-white group-hover:text-slate-100 transition-colors">
                      {profile.userName}
                    </h3>
                    <div className="text-[11px] font-mono text-slate-300 bg-slate-950/80 px-2 py-1 rounded-md border border-slate-800 inline-block mt-1">
                      {credentialsText}
                    </div>
                  </div>

                  <p className="text-xs text-slate-400 leading-relaxed border-t border-slate-800/60 pt-3">
                    {profile.description}
                  </p>

                  {/* Accessible Modules list */}
                  <div className="space-y-1.5 pt-1">
                    <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block">
                      Módulos Incluidos:
                    </span>
                    <ul className="space-y-1">
                      {profile.modules.map((mod, idx) => (
                        <li key={idx} className="text-xs text-slate-300 flex items-center gap-1.5">
                          <span className={`w-1.5 h-1.5 rounded-full ${cardStyles.badgeBg.split(' ')[0]}`} />
                          <span>{mod}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Entry Action Button */}
                <div className="pt-5 mt-4 border-t border-slate-800/80">
                  <button
                    type="button"
                    disabled={loading}
                    className={`w-full py-2.5 px-3 rounded-xl font-semibold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg ${cardStyles.btnBg}`}
                  >
                    {isSelected && loading ? (
                      <>
                        <span className="inline-block animate-spin rounded-full h-3.5 w-3.5 border-2 border-white border-t-transparent" />
                        <span>Ingresando...</span>
                      </>
                    ) : (
                      <>
                        <span>Ingresar con este Perfil</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer info */}
        <div className="text-center pt-4 border-t border-slate-900 flex flex-wrap items-center justify-between text-xs text-slate-500 gap-3">
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-slate-400" />
            <span>MedOcupa ERP &bull; Plataforma Multiempresa & Multi-Sede</span>
          </div>
          <div className="flex items-center gap-1.5 text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Modo Selección Directa de Perfil Activo</span>
          </div>
        </div>

      </div>

      {/* Edit Profile Modal */}
      {editingProfile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden flex flex-col">
            
            {/* Modal Header */}
            <div className="px-5 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-xl">
                  <Edit3 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">
                    Editar Datos: {editingProfile.roleTitle}
                  </h3>
                  <p className="text-xs text-slate-400">
                    Modifique los nombres y número de colegiatura / registro
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setEditingProfile(null)}
                className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSaveProfileEdits} className="p-5 space-y-4">
              
              {/* Role Title */}
              <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-xl flex items-center justify-between text-xs">
                <span className="text-slate-400">Rol a Modificar:</span>
                <span className="font-semibold text-indigo-400 flex items-center gap-1.5">
                  <BadgeCheck className="w-4 h-4 text-indigo-400" />
                  {editingProfile.roleTitle}
                </span>
              </div>

              {/* Professional Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-200">
                  Nombre Completo y Titulación
                </label>
                <input
                  type="text"
                  required
                  value={editFormName}
                  onChange={(e) => setEditFormName(e.target.value)}
                  placeholder="Ej: Dr. Roberto Silva Alva"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                />
              </div>

              {/* Médico Specific Fields: CMP and RNE / RNM */}
              {editingProfile.role === 'MEDICO_OCUPACIONAL' && (
                <div className="p-3.5 bg-emerald-950/20 border border-emerald-500/30 rounded-xl space-y-3">
                  <span className="text-xs font-semibold text-emerald-400 block">
                    Acreditación Médica Ocupacional (CMP / RNE)
                  </span>

                  <div className="space-y-1">
                    <label className="text-[11px] text-slate-300 font-medium">Número de CMP</label>
                    <div className="relative">
                      <span className="absolute left-3 top-2.5 text-xs text-slate-500 font-mono">CMP:</span>
                      <input
                        type="text"
                        value={editFormCmp}
                        onChange={(e) => setEditFormCmp(e.target.value)}
                        placeholder="65432"
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-14 pr-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-emerald-500 font-mono"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] text-slate-300 font-medium">Número de RNE / RNM (Especialidad)</label>
                    <div className="relative">
                      <span className="absolute left-3 top-2.5 text-xs text-slate-500 font-mono">RNE:</span>
                      <input
                        type="text"
                        value={editFormRnm}
                        onChange={(e) => setEditFormRnm(e.target.value)}
                        placeholder="01234"
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-14 pr-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-emerald-500 font-mono"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Enfermera Specific Field: CEP */}
              {editingProfile.role === 'ENFERMERA_OCUPACIONAL' && (
                <div className="p-3.5 bg-teal-950/20 border border-teal-500/30 rounded-xl space-y-3">
                  <span className="text-xs font-semibold text-teal-400 block">
                    Acreditación Enfermería (CEP)
                  </span>

                  <div className="space-y-1">
                    <label className="text-[11px] text-slate-300 font-medium">Número de CEP</label>
                    <div className="relative">
                      <span className="absolute left-3 top-2.5 text-xs text-slate-500 font-mono">CEP:</span>
                      <input
                        type="text"
                        value={editFormCep}
                        onChange={(e) => setEditFormCep(e.target.value)}
                        placeholder="87654"
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-14 pr-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-teal-500 font-mono"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* SST Specialist & Admin Credential Field */}
              {(editingProfile.role === 'ESPECIALISTA_SST' || editingProfile.role === 'ADMINISTRADOR') && (
                <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
                  <label className="text-xs font-semibold text-slate-300 block">
                    {editingProfile.role === 'ESPECIALISTA_SST' ? 'Registro CIP / Credencial SST' : 'Identificador de Administrador'}
                  </label>
                  <input
                    type="text"
                    value={editFormCredencial}
                    onChange={(e) => setEditFormCredencial(e.target.value)}
                    placeholder={editingProfile.role === 'ESPECIALISTA_SST' ? 'Reg. CIP: 104958' : 'ID: ADMIN-SYSTEM-01'}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-indigo-500 font-mono"
                  />
                </div>
              )}

              {/* Action Buttons */}
              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingProfile(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 flex items-center gap-1.5 transition-colors cursor-pointer shadow-lg shadow-indigo-600/30"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Guardar Cambios</span>
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};
