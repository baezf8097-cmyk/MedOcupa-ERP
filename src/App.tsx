import React, { useState, useEffect, useMemo } from 'react';
import { Header } from './components/Header';
import { Sidebar, ActiveTab } from './components/Sidebar';
import { LoginView } from './components/auth/LoginView';
import { Role, User, Empresa, Trabajador, EMOExam, HistoriaClinicaOcupacional, AccidenteIncidente, AusentismoMedico, ProgramaVigilancia, RegistroVacuna, AuditLog, ProtocoloExamenMedico } from './types/erp';

// Data imports
import { MOCK_EMPRESAS, MOCK_TRABAJADORES, MOCK_EMO_EXAMS, MOCK_HISTORIAS_CLINICAS, MOCK_ACCIDENTES, MOCK_AUSENTISMOS, MOCK_PROGRAMAS_VIGILANCIA, MOCK_VACUNAS, MOCK_AUDIT_LOGS, MOCK_PROTOCOLOS } from './data/initialData';

// Operational Module Component imports
import { DashboardOverview } from './components/dashboard/DashboardOverview';
import { EmpresasModule } from './components/empresas/EmpresasModule';
import { TrabajadoresModule } from './components/trabajadores/TrabajadoresModule';
import { HistoriaClinicaModule } from './components/historia/HistoriaClinicaModule';
import { EMOModule } from './components/emo/EMOModule';
import { ProtocolosModule } from './components/protocolos/ProtocolosModule';
import { AptitudModule } from './components/aptitud/AptitudModule';
import { AccidentesModule } from './components/accidentes/AccidentesModule';
import { AusentismoModule } from './components/ausentismo/AusentismoModule';
import { VigilanciaModule } from './components/vigilancia/VigilanciaModule';
import { VacunasModule } from './components/vacunas/VacunasModule';
import { ReportesMINSAMTPE } from './components/reportes/ReportesMINSAMTPE';
import { GuiaMaestraModule } from './components/guia/GuiaMaestraModule';
import { PerfilesYPermisosView } from './components/auth/PerfilesYPermisosView';
import { RequireRole } from './components/auth/RequireRole';

// Documentation Views
import { DocDefinicionView } from './components/docs/DocDefinicionView';
import { DocSrsIeeeView } from './components/docs/DocSrsIeeeView';
import { DocReglasNegocioView } from './components/docs/DocReglasNegocioView';
import { DocArquitecturaView } from './components/docs/DocArquitecturaView';
import { DocBaseDatosView } from './components/docs/DocBaseDatosView';
import { DocUxUiView } from './components/docs/DocUxUiView';
import { DocRoadmapView } from './components/docs/DocRoadmapView';
import { DocQaTestingView } from './components/docs/DocQaTestingView';
import { DocProduccionDockerView } from './components/docs/DocProduccionDockerView';

// Modal imports
import { AuditLogModal } from './components/audit/AuditLogModal';

export default function App() {
  // Auth State
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('medocupa_token'));
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('medocupa_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [currentRole, setCurrentRole] = useState<Role>(currentUser?.rol || 'MEDICO_OCUPACIONAL');
  const [selectedEmpresaId, setSelectedEmpresaId] = useState<string>('TODAS');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isAuditLogOpen, setIsAuditLogOpen] = useState<boolean>(false);

  // App State initialized with mocks or API
  const [empresas, setEmpresas] = useState<Empresa[]>(MOCK_EMPRESAS);
  const [trabajadores, setTrabajadores] = useState<Trabajador[]>(MOCK_TRABAJADORES);
  const [emos, setEmos] = useState<EMOExam[]>(MOCK_EMO_EXAMS);
  const [historias, setHistorias] = useState<HistoriaClinicaOcupacional[]>(MOCK_HISTORIAS_CLINICAS);
  const [accidentes, setAccidentes] = useState<AccidenteIncidente[]>(MOCK_ACCIDENTES);
  const [ausentismos, setAusentismos] = useState<AusentismoMedico[]>(MOCK_AUSENTISMOS);
  const [programas, setProgramas] = useState<ProgramaVigilancia[]>(MOCK_PROGRAMAS_VIGILANCIA);
  const [vacunas, setVacunas] = useState<RegistroVacuna[]>(MOCK_VACUNAS);
  const [protocolos, setProtocolos] = useState<ProtocoloExamenMedico[]>(MOCK_PROTOCOLOS);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(MOCK_AUDIT_LOGS);

  // Cross-module Navigation selections
  const [selectedTrabajadorForHCO, setSelectedTrabajadorForHCO] = useState<string | undefined>();
  const [selectedEmoForAptitud, setSelectedEmoForAptitud] = useState<EMOExam | null>(null);

  // Sync role when currentUser changes
  useEffect(() => {
    if (currentUser?.rol) {
      setCurrentRole(currentUser.rol);
    }
  }, [currentUser]);

  // Load backend data on login/token availability
  useEffect(() => {
    if (!token) return;

    const fetchAllData = async () => {
      try {
        const headers = { Authorization: `Bearer ${token}` };
        const [
          resEmpresas,
          resTrabajadores,
          resEmos,
          resHistorias,
          resAccidentes,
          resAusentismos,
          resProgramas,
          resVacunas,
          resProtocolos,
          resAudit
        ] = await Promise.all([
          fetch('/api/empresas', { headers }),
          fetch('/api/trabajadores', { headers }),
          fetch('/api/emos', { headers }),
          fetch('/api/historia_clinica', { headers }),
          fetch('/api/accidentes', { headers }),
          fetch('/api/ausentismo', { headers }),
          fetch('/api/vigilancia', { headers }),
          fetch('/api/vacunas', { headers }),
          fetch('/api/protocolos', { headers }),
          fetch('/api/audit', { headers })
        ]);

        if (resEmpresas.ok) {
          const d = await resEmpresas.json();
          if (d.data && d.data.length > 0) setEmpresas(d.data);
        }
        if (resTrabajadores.ok) {
          const d = await resTrabajadores.json();
          if (d.data && d.data.length > 0) setTrabajadores(d.data);
        }
        if (resEmos.ok) {
          const d = await resEmos.json();
          if (d.data && d.data.length > 0) setEmos(d.data);
        }
        if (resHistorias.ok) {
          const d = await resHistorias.json();
          if (d.data && d.data.length > 0) setHistorias(d.data);
        }
        if (resAccidentes.ok) {
          const d = await resAccidentes.json();
          if (d.data && d.data.length > 0) setAccidentes(d.data);
        }
        if (resAusentismos.ok) {
          const d = await resAusentismos.json();
          if (d.data && d.data.length > 0) setAusentismos(d.data);
        }
        if (resProgramas.ok) {
          const d = await resProgramas.json();
          if (d.data && d.data.length > 0) setProgramas(d.data);
        }
        if (resVacunas.ok) {
          const d = await resVacunas.json();
          if (d.data && d.data.length > 0) setVacunas(d.data);
        }
        if (resProtocolos.ok) {
          const d = await resProtocolos.json();
          if (d.data && d.data.length > 0) setProtocolos(d.data);
        }
        if (resAudit.ok) {
          const d = await resAudit.json();
          if (d.data && d.data.length > 0) setAuditLogs(d.data);
        }
      } catch (err) {
        console.error('[API Sync Error]', err);
      }
    };

    fetchAllData();
  }, [token]);

  const handleLoginSuccess = (newToken: string, user: User) => {
    setToken(newToken);
    setCurrentUser(user);
    setCurrentRole(user.rol);
    localStorage.setItem('medocupa_token', newToken);
    localStorage.setItem('medocupa_user', JSON.stringify(user));
  };

  const handleLogout = () => {
    setToken(null);
    setCurrentUser(null);
    localStorage.removeItem('medocupa_token');
    localStorage.removeItem('medocupa_user');
  };

  const addAuditLog = async (accion: string, detalles: string) => {
    const newLog: AuditLog = {
      id: `aud-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC',
      usuario: currentUser ? `${currentUser.nombre} (${currentUser.email})` : 'Usuario Operativo',
      rol: currentRole,
      accion,
      recurso: detalles,
      ip: '190.235.12.89',
      resultado: 'EXITO',
      detalles
    };

    if (token) {
      try {
        const res = await fetch('/api/audit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify({ accion, recurso: detalles, detalles })
        });
        if (res.ok) {
          const resData = await res.json().catch(() => null);
          const logToAdd = resData?.data || newLog;
          setAuditLogs(prev => [logToAdd, ...prev]);
        } else {
          console.error('Error al registrar auditoría en el backend (estatus no exitoso):', res.status);
        }
      } catch (e) {
        console.error('Error al registrar auditoría:', e);
      }
    } else {
      setAuditLogs(prev => [newLog, ...prev]);
    }
  };

  // Filtered context based on selected company
  const activeEmpresa = empresas.find(e => e.id === selectedEmpresaId) || null;

  // Memoized filtered datasets based on selected global company filter
  const filteredEmpresas = useMemo(() => {
    if (selectedEmpresaId === 'TODAS') return empresas;
    return empresas.filter(e => e.id === selectedEmpresaId);
  }, [empresas, selectedEmpresaId]);

  const filteredTrabajadores = useMemo(() => {
    if (selectedEmpresaId === 'TODAS') return trabajadores;
    return trabajadores.filter(t => t.empresaId === selectedEmpresaId);
  }, [trabajadores, selectedEmpresaId]);

  const filteredEmos = useMemo(() => {
    if (selectedEmpresaId === 'TODAS') return emos;
    return emos.filter(e => e.empresaId === selectedEmpresaId);
  }, [emos, selectedEmpresaId]);

  const filteredHistorias = useMemo(() => {
    if (selectedEmpresaId === 'TODAS') return historias;
    const workerIdsInCompany = new Set(
      trabajadores.filter(t => t.empresaId === selectedEmpresaId).map(t => t.id)
    );
    return historias.filter(h => 
      (h as any).empresaId === selectedEmpresaId || workerIdsInCompany.has(h.trabajadorId)
    );
  }, [historias, trabajadores, selectedEmpresaId]);

  const filteredAccidentes = useMemo(() => {
    if (selectedEmpresaId === 'TODAS') return accidentes;
    return accidentes.filter(a => a.empresaId === selectedEmpresaId);
  }, [accidentes, selectedEmpresaId]);

  const filteredAusentismos = useMemo(() => {
    if (selectedEmpresaId === 'TODAS') return ausentismos;
    return ausentismos.filter(a => a.empresaId === selectedEmpresaId);
  }, [ausentismos, selectedEmpresaId]);

  const filteredProgramas = useMemo(() => {
    if (selectedEmpresaId === 'TODAS') return programas;
    return programas.filter(p => p.empresaId === selectedEmpresaId);
  }, [programas, selectedEmpresaId]);

  // Handlers connected to backend API
  const handleAddEmpresa = async (newEmpresa: Empresa) => {
    setEmpresas(prev => [newEmpresa, ...prev]);
    addAuditLog('ALTA_EMPRESA_CLIENTE', `Empresa: ${newEmpresa.razonSocial} (RUC: ${newEmpresa.ruc})`);
    if (token) {
      try {
        const res = await fetch('/api/empresas', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify(newEmpresa)
        });
        const d = await res.json();
        if (d.success && d.data) {
          setEmpresas(prev => prev.map(e => e.id === newEmpresa.id ? d.data : e));
        }
      } catch (e) { console.error(e); }
    }
  };

  const handleUpdateEmpresa = async (updatedEmpresa: Empresa) => {
    setEmpresas(prev => prev.map(e => e.id === updatedEmpresa.id ? updatedEmpresa : e));
    addAuditLog('ACTUALIZAR_EMPRESA', `Empresa: ${updatedEmpresa.razonSocial} - Sedes: ${updatedEmpresa.sedes.length}`);
    if (token) {
      try {
        await fetch(`/api/empresas/${updatedEmpresa.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify(updatedEmpresa)
        });
      } catch (e) { console.error(e); }
    }
  };

  const handleDeleteEmpresa = async (empresaId: string) => {
    const empToDelete = empresas.find(e => e.id === empresaId);
    setEmpresas(prev => prev.filter(e => e.id !== empresaId));
    if (empToDelete) {
      addAuditLog('ELIMINAR_EMPRESA', `Empresa eliminada: ${empToDelete.razonSocial} (RUC: ${empToDelete.ruc})`);
    }
    if (token) {
      try {
        await fetch(`/api/empresas/${empresaId}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` }
        });
      } catch (e) { console.error(e); }
    }
  };

  const handleAddTrabajador = async (newTrabajador: Trabajador) => {
    setTrabajadores(prev => [newTrabajador, ...prev]);
    addAuditLog('ALTA_TRABAJADOR', `Trabajador: ${newTrabajador.apellidoPaterno} ${newTrabajador.nombres} (${newTrabajador.numeroDocumento})`);
    if (token) {
      try {
        const res = await fetch('/api/trabajadores', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify(newTrabajador)
        });
        const d = await res.json();
        if (d.success && d.data) {
          setTrabajadores(prev => prev.map(t => t.id === newTrabajador.id ? d.data : t));
        }
      } catch (e) { console.error(e); }
    }
  };

  const handleUpdateTrabajador = async (updatedTrabajador: Trabajador) => {
    setTrabajadores(prev => prev.map(t => t.id === updatedTrabajador.id ? updatedTrabajador : t));
    addAuditLog('ACTUALIZAR_TRABAJADOR_IPERC', `Trabajador: ${updatedTrabajador.apellidoPaterno} ${updatedTrabajador.nombres} - Estado: ${updatedTrabajador.estado}`);
    if (token) {
      try {
        await fetch(`/api/trabajadores/${updatedTrabajador.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify(updatedTrabajador)
        });
      } catch (e) { console.error(e); }
    }
  };

  const handleDeleteTrabajador = async (trabajadorId: string) => {
    const trabToDelete = trabajadores.find(t => t.id === trabajadorId);
    setTrabajadores(prev => prev.filter(t => t.id !== trabajadorId));
    setEmos(prev => prev.filter(e => e.trabajadorId !== trabajadorId));
    if (trabToDelete) {
      addAuditLog('ELIMINAR_TRABAJADOR', `Trabajador eliminado: ${trabToDelete.apellidoPaterno} ${trabToDelete.nombres} (${trabToDelete.numeroDocumento})`);
    }
    if (token) {
      try {
        await fetch(`/api/trabajadores/${trabajadorId}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` }
        });
      } catch (e) { console.error(e); }
    }
  };

  const handleAddEMO = async (newEMO: EMOExam) => {
    setEmos(prev => [newEMO, ...prev]);
    addAuditLog('PROGRAMACION_EMO', `EMO: ${newEMO.codigoEMO} (Tipo: ${newEMO.tipoEMO})`);
    if (token) {
      try {
        await fetch('/api/emos', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify(newEMO)
        });
      } catch (e) { console.error(e); }
    }
  };

  const handleUpdateEMO = async (updatedEMO: EMOExam) => {
    setEmos(prev => prev.map(e => e.id === updatedEMO.id ? updatedEMO : e));
    addAuditLog('ACTUALIZAR_EMO', `EMO: ${updatedEMO.codigoEMO} (Tipo: ${updatedEMO.tipoEMO})`);
    if (token) {
      try {
        await fetch(`/api/emos/${updatedEMO.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify(updatedEMO)
        });
      } catch (e) { console.error(e); }
    }
  };

  const handleDeleteEMO = async (emoId: string) => {
    const emoToDelete = emos.find(e => e.id === emoId);
    setEmos(prev => prev.filter(e => e.id !== emoId));
    if (emoToDelete) {
      addAuditLog('ELIMINAR_EMO', `Examen EMO eliminado: ${emoToDelete.codigoEMO}`);
    }
    if (token) {
      try {
        await fetch(`/api/emos/${emoId}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` }
        });
      } catch (e) { console.error(e); }
    }
  };

  const handleSaveAptitud = async (emoId: string, aptitudData: EMOExam['aptitud'], workerIdForNewEmo?: string, empresaIdForNewEmo?: string) => {
    setEmos(prev => {
      const exists = prev.some(e => e.id === emoId);
      if (exists) {
        return prev.map(e => e.id === emoId ? {
          ...e,
          estado: 'CERTIFICADO_EMITIDO',
          aptitud: aptitudData
        } : e);
      } else {
        const newEmoRecord: EMOExam = {
          id: emoId || `emo-${Date.now()}`,
          codigoEMO: `EMO-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
          trabajadorId: workerIdForNewEmo || trabajadores[0]?.id || 'trab-1',
          empresaId: empresaIdForNewEmo || empresas[0]?.id || 'emp-1',
          tipoEMO: 'PERIODICO',
          fechaProgramada: new Date().toISOString().split('T')[0],
          fechaRealizada: new Date().toISOString().split('T')[0],
          estado: 'CERTIFICADO_EMITIDO',
          protocoloAplicado: 'Protocolo Ocupacional General (RM 312-2011)',
          costoEMO: 250.00,
          evaluaciones: {
            triaje: true, medicinaGeneral: true, audiometria: true, espirometria: true,
            radiografiaOIT: true, laboratorio: true, psicologia: true, oftalmologia: true, electrocardiograma: true
          },
          aptitud: aptitudData
        };
        return [newEmoRecord, ...prev];
      }
    });

    addAuditLog('DICTAMEN_APTITUD_MEDICA', `EMO ID: ${emoId} - Resultado: ${aptitudData?.resultado}`);

    if (token) {
      try {
        await fetch('/api/aptitud', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify({ emoId, aptitud: aptitudData, workerIdForNewEmo, empresaIdForNewEmo })
        });
      } catch (e) { console.error(e); }
    }
  };

  const handleAddAccidente = async (newAccidente: AccidenteIncidente) => {
    setAccidentes(prev => [newAccidente, ...prev]);
    addAuditLog('REPORTAR_ACCIDENTE', `Evento: ${newAccidente.codigoEvento} - Tipo: ${newAccidente.tipo}`);
    if (token) {
      try {
        await fetch('/api/accidentes', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify(newAccidente)
        });
      } catch (e) { console.error(e); }
    }
  };

  const handleUpdateAccidente = async (updatedAcc: AccidenteIncidente) => {
    setAccidentes(prev => prev.map(a => a.id === updatedAcc.id ? updatedAcc : a));
    addAuditLog('ACTUALIZAR_ACCIDENTE', `Evento: ${updatedAcc.codigoEvento} - Tipo: ${updatedAcc.tipo}`);
    if (token) {
      try {
        await fetch(`/api/accidentes/${updatedAcc.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify(updatedAcc)
        });
      } catch (e) { console.error(e); }
    }
  };

  const handleDeleteAccidente = async (id: string) => {
    const acc = accidentes.find(a => a.id === id);
    setAccidentes(prev => prev.filter(a => a.id !== id));
    addAuditLog('ELIMINAR_ACCIDENTE', `ID: ${id} - Evento: ${acc?.codigoEvento || id}`);
    if (token) {
      try {
        await fetch(`/api/accidentes/${id}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` }
        });
      } catch (e) { console.error(e); }
    }
  };

  const handleAddAusentismo = async (newAusentismo: AusentismoMedico) => {
    setAusentismos(prev => [newAusentismo, ...prev]);
    addAuditLog('REGISTRAR_DESCANSO_MEDICO', `CIE-10: ${newAusentismo.codigoCIE10} - Días: ${newAusentismo.diasTotales}`);
    if (token) {
      try {
        await fetch('/api/ausentismo', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify(newAusentismo)
        });
      } catch (e) { console.error(e); }
    }
  };

  const handleUpdateAusentismo = async (updatedAusentismo: AusentismoMedico) => {
    setAusentismos(prev => prev.map(a => a.id === updatedAusentismo.id ? updatedAusentismo : a));
    addAuditLog('ACTUALIZAR_CERTIFICADO_MEDICO_PDF', `ID: ${updatedAusentismo.id}`);
    if (token) {
      try {
        await fetch(`/api/ausentismo/${updatedAusentismo.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify(updatedAusentismo)
        });
      } catch (e) { console.error(e); }
    }
  };

  const handleDeleteAusentismo = async (id: string) => {
    const aus = ausentismos.find(a => a.id === id);
    setAusentismos(prev => prev.filter(a => a.id !== id));
    addAuditLog('ELIMINAR_DESCANSO_MEDICO', `ID: ${id} - CIE-10: ${aus?.codigoCIE10 || id}`);
    if (token) {
      try {
        await fetch(`/api/ausentismo/${id}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` }
        });
      } catch (e) { console.error(e); }
    }
  };

  const handleUpdateHistoria = async (updatedHCO: HistoriaClinicaOcupacional) => {
    setHistorias(prev => {
      const exists = prev.some(h => h.id === updatedHCO.id || h.trabajadorId === updatedHCO.trabajadorId);
      if (exists) {
        return prev.map(h => (h.id === updatedHCO.id || h.trabajadorId === updatedHCO.trabajadorId) ? updatedHCO : h);
      }
      return [updatedHCO, ...prev];
    });
    addAuditLog('ACTUALIZAR_DOCUMENTO_HC_PDF', `Código HCO: ${updatedHCO.codigoHCO}`);
    if (token) {
      try {
        await fetch('/api/historia_clinica', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify(updatedHCO)
        });
      } catch (e) { console.error(e); }
    }
  };

  const handleAddProtocolo = async (newProt: ProtocoloExamenMedico) => {
    setProtocolos(prev => [newProt, ...prev]);
    addAuditLog('NUEVO_PROTOCOLO_EMO', `Código: ${newProt.codigoProtocolo}`);
    if (token) {
      try {
        await fetch('/api/protocolos', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify(newProt)
        });
      } catch (e) { console.error(e); }
    }
  };

  const handleUpdateProtocolo = async (updatedProt: ProtocoloExamenMedico) => {
    setProtocolos(prev => prev.map(p => p.id === updatedProt.id ? updatedProt : p));
    addAuditLog('ACTUALIZAR_DOCUMENTO_PROTOCOLO', `Código: ${updatedProt.codigoProtocolo}`);
    if (token) {
      try {
        await fetch(`/api/protocolos/${updatedProt.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify(updatedProt)
        });
      } catch (e) { console.error(e); }
    }
  };

  const handleDeleteProtocolo = async (id: string) => {
    setProtocolos(prev => prev.filter(p => p.id !== id));
    addAuditLog('ELIMINAR_PROTOCOLO_EMO', `ID Protocolo: ${id}`);
    if (token) {
      try {
        await fetch(`/api/protocolos/${id}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` }
        });
      } catch (e) { console.error(e); }
    }
  };

  const handleNavigateToHCO = (trabajadorId: string) => {
    setSelectedTrabajadorForHCO(trabajadorId);
    setActiveTab('historia_clinica');
  };

  const handleOpenAptitudModal = (emo: EMOExam) => {
    setSelectedEmoForAptitud(emo);
    setActiveTab('aptitudes');
  };

  // Render LoginView if unauthenticated
  if (!token || !currentUser) {
    return <LoginView onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="h-screen bg-slate-900 text-slate-100 font-sans flex flex-col overflow-hidden">
      {/* Header Bar */}
      <Header
        currentUser={currentUser}
        selectedEmpresaId={selectedEmpresaId}
        onEmpresaChange={setSelectedEmpresaId}
        empresas={empresas}
        onOpenAuditLog={() => setIsAuditLogOpen(true)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onLogout={handleLogout}
      />

      {/* Main Container */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <Sidebar activeTab={activeTab} onTabChange={setActiveTab} currentRole={currentRole} />

        {/* Content Area */}
        <main className="flex-1 bg-slate-900 p-6 overflow-y-auto custom-scrollbar space-y-6">
          {/* OPERATIONAL MODULES */}
          {activeTab === 'dashboard' && (
            <DashboardOverview
              empresa={activeEmpresa}
              emos={filteredEmos}
              trabajadores={filteredTrabajadores}
              accidentes={filteredAccidentes}
              ausentismos={filteredAusentismos}
              programas={filteredProgramas}
              protocolos={protocolos}
              onNavigateTab={setActiveTab}
            />
          )}

          {activeTab === 'empresas' && (
            <EmpresasModule
              empresas={filteredEmpresas}
              onAddEmpresa={handleAddEmpresa}
              onUpdateEmpresa={handleUpdateEmpresa}
              onDeleteEmpresa={handleDeleteEmpresa}
            />
          )}

          {activeTab === 'trabajadores' && (
            <TrabajadoresModule
              trabajadores={filteredTrabajadores}
              empresas={empresas}
              selectedEmpresaId={selectedEmpresaId}
              onAddTrabajador={handleAddTrabajador}
              onUpdateTrabajador={handleUpdateTrabajador}
              onDeleteTrabajador={handleDeleteTrabajador}
              onSelectTrabajadorForHCO={handleNavigateToHCO}
            />
          )}

          {activeTab === 'historia_clinica' && (
            <RequireRole currentRole={currentRole} moduleKey="historia_clinica" action="leer">
              <HistoriaClinicaModule
                historias={filteredHistorias}
                trabajadores={filteredTrabajadores}
                empresas={empresas}
                selectedTrabajadorId={selectedTrabajadorForHCO}
                onUpdateHistoria={handleUpdateHistoria}
              />
            </RequireRole>
          )}

          {activeTab === 'emo_examenes' && (
            <RequireRole currentRole={currentRole} moduleKey="emo" action="leer">
              <EMOModule
                emos={filteredEmos}
                trabajadores={filteredTrabajadores}
                empresas={empresas}
                onAddEMO={handleAddEMO}
                onUpdateEMO={handleUpdateEMO}
                onDeleteEMO={handleDeleteEMO}
                onDeleteTrabajador={handleDeleteTrabajador}
                onOpenAptitudModal={handleOpenAptitudModal}
              />
            </RequireRole>
          )}

          {activeTab === 'protocolos_medicos' && (
            <ProtocolosModule
              protocolos={protocolos}
              empresas={empresas}
              onAddProtocolo={handleAddProtocolo}
              onUpdateProtocolo={handleUpdateProtocolo}
              onDeleteProtocolo={handleDeleteProtocolo}
            />
          )}

          {activeTab === 'aptitudes' && (
            <AptitudModule
              emos={filteredEmos}
              trabajadores={filteredTrabajadores}
              empresas={empresas}
              selectedEmoForAptitud={selectedEmoForAptitud}
              onSaveAptitud={handleSaveAptitud}
            />
          )}

          {activeTab === 'accidentes' && (
            <AccidentesModule
              accidentes={filteredAccidentes}
              trabajadores={filteredTrabajadores}
              empresas={empresas}
              onAddAccidente={handleAddAccidente}
              onUpdateAccidente={handleUpdateAccidente}
              onDeleteAccidente={handleDeleteAccidente}
            />
          )}

          {activeTab === 'ausentismo' && (
            <AusentismoModule
              ausentismos={filteredAusentismos}
              trabajadores={filteredTrabajadores}
              empresas={empresas}
              onAddAusentismo={handleAddAusentismo}
              onUpdateAusentismo={handleUpdateAusentismo}
              onDeleteAusentismo={handleDeleteAusentismo}
            />
          )}

          {activeTab === 'vigilancia' && (
            <VigilanciaModule
              programas={filteredProgramas}
              empresas={empresas}
              trabajadores={filteredTrabajadores}
              selectedEmpresaId={selectedEmpresaId}
              onAddPrograma={async (newProg) => {
                setProgramas(prev => [newProg, ...prev]);
                addAuditLog('NUEVO_PROGRAMA_VIGILANCIA', `Programa: ${newProg.nombrePrograma}`);
                if (token) {
                  try {
                    await fetch('/api/vigilancia', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                      body: JSON.stringify(newProg)
                    });
                  } catch (e) { console.error(e); }
                }
              }}
              onUpdatePrograma={async (updatedProg) => {
                setProgramas(prev => prev.map(p => p.id === updatedProg.id ? updatedProg : p));
                addAuditLog('ACTUALIZACION_PROGRAMA_VIGILANCIA', `Programa: ${updatedProg.nombrePrograma}`);
                if (token) {
                  try {
                    await fetch(`/api/vigilancia/${updatedProg.id}`, {
                      method: 'PUT',
                      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                      body: JSON.stringify(updatedProg)
                    });
                  } catch (e) { console.error(e); }
                }
              }}
              onDeletePrograma={async (id) => {
                const prog = programas.find(p => p.id === id);
                setProgramas(prev => prev.filter(p => p.id !== id));
                addAuditLog('ELIMINAR_PROGRAMA_VIGILANCIA', `ID: ${id} - Nombre: ${prog?.nombrePrograma || id}`);
                if (token) {
                  try {
                    await fetch(`/api/vigilancia/${id}`, {
                      method: 'DELETE',
                      headers: { Authorization: `Bearer ${token}` }
                    });
                  } catch (e) { console.error(e); }
                }
              }}
            />
          )}

          {activeTab === 'vacunas' && (
            <VacunasModule 
              vacunas={vacunas} 
              trabajadores={filteredTrabajadores} 
              onUpdateVacunas={async (newVacunas) => {
                setVacunas(newVacunas);
                addAuditLog('ACTUALIZAR_CARNE_VACUNAS', `Carné de Inmunizaciones actualizado (${newVacunas.length} dosis)`);
                if (token) {
                  try {
                    await fetch('/api/vacunas', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                      body: JSON.stringify(newVacunas)
                    });
                  } catch (e) { console.error(e); }
                }
              }}
            />
          )}

          {activeTab === 'reportes_minsa' && (
            <ReportesMINSAMTPE empresas={empresas} />
          )}

          {activeTab === 'guia_maestra' && (
            <GuiaMaestraModule
              empresas={empresas}
              selectedEmpresaId={selectedEmpresaId}
            />
          )}

          {activeTab === 'perfiles_permisos' && (
            <PerfilesYPermisosView
              currentRole={currentRole}
              onRoleChange={(newRole) => {
                setCurrentRole(newRole);
                if (currentUser) {
                  const updatedUser = { ...currentUser, rol: newRole };
                  setCurrentUser(updatedUser);
                  localStorage.setItem('medocupa_user', JSON.stringify(updatedUser));
                }
              }}
            />
          )}

          {/* TECHNICAL DOCUMENTATION VIEWS */}
          {activeTab === 'doc_definicion' && <DocDefinicionView />}
          {activeTab === 'doc_srs_ieee' && <DocSrsIeeeView />}
          {activeTab === 'doc_reglas_negocio' && <DocReglasNegocioView />}
          {activeTab === 'doc_arquitectura' && <DocArquitecturaView />}
          {activeTab === 'doc_base_datos' && <DocBaseDatosView />}
          {activeTab === 'doc_uxui' && <DocUxUiView />}
          {activeTab === 'doc_roadmap' && <DocRoadmapView />}
          {activeTab === 'doc_qa_testing' && <DocQaTestingView />}
          {activeTab === 'doc_produccion_docker' && <DocProduccionDockerView />}
        </main>
      </div>

      {/* Global Audit Trail Modal */}
      <AuditLogModal
        isOpen={isAuditLogOpen}
        onClose={() => setIsAuditLogOpen(false)}
        logs={auditLogs}
      />
    </div>
  );
}
