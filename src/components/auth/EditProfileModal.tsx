import React, { useState, useEffect } from 'react';
import { User, Role } from '../../types/erp';
import { UserCheck, Stethoscope, Edit3, X, CheckCircle2, ShieldAlert, BadgeCheck, FileText } from 'lucide-react';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User | null;
  onSaveProfile: (updatedUser: User) => Promise<void> | void;
}

export const EditProfileModal: React.FC<EditProfileModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onSaveProfile
}) => {
  if (!isOpen || !currentUser) return null;

  const [nombre, setNombre] = useState(currentUser.nombre || '');
  const [email, setEmail] = useState(currentUser.email || '');

  // For Doctors (CMP and RNM)
  const parseCmpRnm = (val?: string) => {
    if (!val) return { cmp: '', rnm: '' };
    const parts = val.split('/');
    const cmpPart = parts[0]?.trim() || '';
    const rnmPart = parts[1]?.trim() || '';
    return {
      cmp: cmpPart.replace(/CMP:\s*|CMP\s*/gi, ''),
      rnm: rnmPart.replace(/RNM:\s*|RNM\s*|RNE:\s*|RNE\s*/gi, '')
    };
  };

  const initialParsed = parseCmpRnm(currentUser.cmp_rnm);
  const [cmpNum, setCmpNum] = useState(initialParsed.cmp);
  const [rnmNum, setRnmNum] = useState(initialParsed.rnm);

  // For Nurse (CEP)
  const parseCep = (val?: string) => {
    if (!val) return '';
    return val.replace(/CEP:\s*|CEP\s*/gi, '').trim();
  };
  const [cepNum, setCepNum] = useState(parseCep(currentUser.cep));

  // For SST Specialist / Admin credential
  const [credencialExtra, setCredencialExtra] = useState(() => {
    if (currentUser.rol === 'ESPECIALISTA_SST' || currentUser.rol === 'ADMINISTRADOR') {
      return currentUser.cmp_rnm || currentUser.cep || '';
    }
    return '';
  });

  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (currentUser) {
      setNombre(currentUser.nombre || '');
      setEmail(currentUser.email || '');
      const parsed = parseCmpRnm(currentUser.cmp_rnm);
      setCmpNum(parsed.cmp);
      setRnmNum(parsed.rnm);
      setCepNum(parseCep(currentUser.cep));
      setCredencialExtra(currentUser.cmp_rnm || currentUser.cep || '');
    }
  }, [currentUser]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre.trim()) {
      setErrorMsg('El nombre del profesional es obligatorio.');
      return;
    }

    setSaving(true);
    setErrorMsg('');
    setSuccessMsg('');

    let newCmpRnm: string | undefined = currentUser.cmp_rnm;
    let newCep: string | undefined = currentUser.cep;

    if (currentUser.rol === 'MEDICO_OCUPACIONAL') {
      const cmpStr = cmpNum.trim() ? `CMP: ${cmpNum.trim()}` : '';
      const rnmStr = rnmNum.trim() ? `RNM: ${rnmNum.trim()}` : '';
      if (cmpStr && rnmStr) {
        newCmpRnm = `${cmpStr} / ${rnmStr}`;
      } else if (cmpStr) {
        newCmpRnm = cmpStr;
      } else if (rnmStr) {
        newCmpRnm = rnmStr;
      } else {
        newCmpRnm = '';
      }
    } else if (currentUser.rol === 'ENFERMERA_OCUPACIONAL') {
      newCep = cepNum.trim() ? `CEP: ${cepNum.trim()}` : '';
    } else {
      if (credencialExtra.trim()) {
        newCmpRnm = credencialExtra.trim();
      }
    }

    const updatedUser: User = {
      ...currentUser,
      nombre: nombre.trim(),
      email: email.trim(),
      cmp_rnm: newCmpRnm,
      cep: newCep
    };

    try {
      await onSaveProfile(updatedUser);
      setSuccessMsg('¡Datos guardados correctamente!');
      setTimeout(() => {
        setSuccessMsg('');
        onClose();
      }, 1200);
    } catch (err: any) {
      setErrorMsg(err.message || 'Error al guardar los datos');
    } finally {
      setSaving(false);
    }
  };

  const getRoleTitle = (role: Role) => {
    switch (role) {
      case 'MEDICO_OCUPACIONAL': return 'Médico Ocupacional';
      case 'ENFERMERA_OCUPACIONAL': return 'Enfermera Ocupacional';
      case 'ESPECIALISTA_SST': return 'Especialista SST';
      case 'ADMINISTRADOR': return 'Administrador de Sistema';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        
        {/* Header Modal */}
        <div className="px-6 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 rounded-xl">
              <Edit3 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Editar Perfil Profesional</h3>
              <p className="text-xs text-slate-400">Actualizar nombres, colegiatura y acreditaciones</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSave} className="p-6 space-y-4">
          
          {/* Alerts */}
          {errorMsg && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-xs text-rose-300 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-xs text-emerald-300 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Active Role Indicator */}
          <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-xl flex items-center justify-between text-xs">
            <span className="text-slate-400">Rol Activo:</span>
            <span className="font-semibold text-indigo-400 flex items-center gap-1.5">
              <BadgeCheck className="w-4 h-4 text-indigo-400" />
              {getRoleTitle(currentUser.rol)}
            </span>
          </div>

          {/* Professional Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
              <UserCheck className="w-3.5 h-3.5 text-indigo-400" />
              Nombre Completo y Titulación
            </label>
            <input
              type="text"
              required
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder={currentUser.rol === 'MEDICO_OCUPACIONAL' ? "Ej: Dr. Roberto Silva Alva" : "Ej: Lic. María Elena Ramos"}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500"
            />
            <p className="text-[10px] text-slate-500">
              Este nombre aparecerá en la barra superior, certificados EMO, informes y auditorías.
            </p>
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-200">
              Correo Electrónico Institucional
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ejemplo@medocupa.pe"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Role-Specific Credential Inputs */}
          {currentUser.rol === 'MEDICO_OCUPACIONAL' && (
            <div className="p-4 bg-emerald-950/20 border border-emerald-500/30 rounded-xl space-y-3">
              <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold">
                <Stethoscope className="w-4 h-4" />
                <span>Colegiatura Médica del Perú (CMP) y Registro RNM / RNE</span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] text-slate-300 font-medium">Número de CMP</label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-xs text-slate-500 font-mono">CMP:</span>
                    <input
                      type="text"
                      value={cmpNum}
                      onChange={(e) => setCmpNum(e.target.value)}
                      placeholder="65432"
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-14 pr-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-emerald-500 font-mono"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] text-slate-300 font-medium">Número de RNM / RNE</label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-xs text-slate-500 font-mono">RNM:</span>
                    <input
                      type="text"
                      value={rnmNum}
                      onChange={(e) => setRnmNum(e.target.value)}
                      placeholder="01234"
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-14 pr-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-emerald-500 font-mono"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentUser.rol === 'ENFERMERA_OCUPACIONAL' && (
            <div className="p-4 bg-teal-950/20 border border-teal-500/30 rounded-xl space-y-3">
              <div className="flex items-center gap-2 text-teal-400 text-xs font-semibold">
                <BadgeCheck className="w-4 h-4" />
                <span>Colegio de Enfermeros del Perú (CEP)</span>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] text-slate-300 font-medium">Número de Colegiatura CEP</label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-xs text-slate-500 font-mono">CEP:</span>
                  <input
                    type="text"
                    value={cepNum}
                    onChange={(e) => setCepNum(e.target.value)}
                    placeholder="87654"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-14 pr-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-teal-500 font-mono"
                  />
                </div>
              </div>
            </div>
          )}

          {(currentUser.rol === 'ESPECIALISTA_SST' || currentUser.rol === 'ADMINISTRADOR') && (
            <div className="p-4 bg-amber-950/20 border border-amber-500/30 rounded-xl space-y-3">
              <div className="flex items-center gap-2 text-amber-400 text-xs font-semibold">
                <FileText className="w-4 h-4" />
                <span>Acreditación / Registro Profesional SST</span>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] text-slate-300 font-medium">Registro CIP / Certificación SST</label>
                <input
                  type="text"
                  value={credencialExtra}
                  onChange={(e) => setCredencialExtra(e.target.value)}
                  placeholder="Ej: CIP: 21543 / Registro SST"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>
          )}

          {/* Footer buttons */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-medium transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold transition-colors flex items-center gap-2 cursor-pointer shadow-lg shadow-indigo-600/20 disabled:opacity-50"
            >
              {saving ? (
                <span className="inline-block animate-spin rounded-full h-3.5 w-3.5 border-2 border-white border-t-transparent" />
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Guardar Cambios</span>
                </>
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
