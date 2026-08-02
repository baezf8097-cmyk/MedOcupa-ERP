import bcrypt from 'bcryptjs';
import { 
  Empresa, 
  Trabajador, 
  EMOExam, 
  HistoriaClinicaOcupacional, 
  AccidenteIncidente, 
  AusentismoMedico, 
  ProgramaVigilancia, 
  RegistroVacuna, 
  AuditLog, 
  ProtocoloExamenMedico,
  Role,
  UserRole
} from '../types/erp';

import { 
  MOCK_EMPRESAS, 
  MOCK_TRABAJADORES, 
  MOCK_EMO_EXAMS, 
  MOCK_HISTORIAS_CLINICAS, 
  MOCK_ACCIDENTES, 
  MOCK_AUSENTISMOS, 
  MOCK_PROGRAMAS_VIGILANCIA, 
  MOCK_VACUNAS, 
  MOCK_AUDIT_LOGS,
  MOCK_PROTOCOLOS
} from '../data/initialData';

export interface SystemUser {
  id: string;
  nombre: string;
  email: string;
  passwordHash: string;
  rol: Role;
  cmp_rnm?: string;
  cep?: string;
  empresaId?: string;
  avatar?: string;
}

export interface ErpDataStore {
  empresas: Empresa[];
  trabajadores: Trabajador[];
  emos: EMOExam[];
  historias: HistoriaClinicaOcupacional[];
  accidentes: AccidenteIncidente[];
  ausentismos: AusentismoMedico[];
  programas: ProgramaVigilancia[];
  vacunas: RegistroVacuna[];
  auditLogs: AuditLog[];
  protocolos: ProtocoloExamenMedico[];
  users: SystemUser[];
}

const STORAGE_KEY = 'medocupa_db_store';

const INITIAL_USERS: SystemUser[] = [
  {
    id: 'usr-medico-1',
    nombre: 'Dr. Roberto Silva Alva',
    email: 'medico@rsa.pe',
    passwordHash: bcrypt.hashSync('medico123', 10),
    rol: UserRole.MEDICO_OCUPACIONAL,
    cmp_rnm: 'CMP-74839',
    empresaId: 'emp-1',
    avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=200'
  },
  {
    id: 'usr-enfermera-1',
    nombre: 'Lic. Ana Morales Torres',
    email: 'enfermera@rsa.pe',
    passwordHash: bcrypt.hashSync('enfermera123', 10),
    rol: UserRole.ENFERMERA_OCUPACIONAL,
    cep: 'CEP-58291',
    empresaId: 'emp-1',
    avatar: 'https://images.unsplash.com/photo-1594824813566-78a93272d3e3?auto=format&fit=crop&q=80&w=200'
  },
  {
    id: 'usr-sst-1',
    nombre: 'Ing. Carlos Mendoza Rios',
    email: 'sst@rsa.pe',
    passwordHash: bcrypt.hashSync('sst123', 10),
    rol: UserRole.ESPECIALISTA_SST,
    empresaId: 'emp-1',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=200'
  },
  {
    id: 'usr-admin-1',
    nombre: 'Admin General Sistema',
    email: 'admin@rsa.pe',
    passwordHash: bcrypt.hashSync('admin123', 10),
    rol: UserRole.ADMINISTRADOR,
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200'
  }
];

export function getClientStore(): ErpDataStore {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (!parsed.empresas || !Array.isArray(parsed.empresas)) parsed.empresas = MOCK_EMPRESAS;
      if (!parsed.trabajadores || !Array.isArray(parsed.trabajadores)) parsed.trabajadores = MOCK_TRABAJADORES;
      if (!parsed.emos || !Array.isArray(parsed.emos)) parsed.emos = MOCK_EMO_EXAMS;
      if (!parsed.historias || !Array.isArray(parsed.historias)) parsed.historias = MOCK_HISTORIAS_CLINICAS;
      if (!parsed.accidentes || !Array.isArray(parsed.accidentes)) parsed.accidentes = MOCK_ACCIDENTES;
      if (!parsed.ausentismos || !Array.isArray(parsed.ausentismos)) parsed.ausentismos = MOCK_AUSENTISMOS;
      if (!parsed.programas || !Array.isArray(parsed.programas)) parsed.programas = MOCK_PROGRAMAS_VIGILANCIA;
      if (!parsed.vacunas || !Array.isArray(parsed.vacunas)) parsed.vacunas = MOCK_VACUNAS;
      if (!parsed.auditLogs || !Array.isArray(parsed.auditLogs)) parsed.auditLogs = MOCK_AUDIT_LOGS;
      if (!parsed.protocolos || !Array.isArray(parsed.protocolos) || parsed.protocolos.length === 0) parsed.protocolos = MOCK_PROTOCOLOS;
      if (!parsed.users || !Array.isArray(parsed.users) || parsed.users.length === 0) parsed.users = INITIAL_USERS;

      // Sanitize protocols to ensure no missing properties
      parsed.protocolos = parsed.protocolos.filter(Boolean).map((p: any, idx: number) => ({
        id: p.id || `prot-${idx + 1}`,
        empresaId: p.empresaId || MOCK_EMPRESAS[0]?.id || 'emp-1',
        nombreProtocolo: p.nombreProtocolo || p.nombre || 'Protocolo de Exámenes Médicos Ocupacionales (EMO)',
        codigoProtocolo: p.codigoProtocolo || p.codigo || `PROT-EMO-2026-00${idx + 1}`,
        sectorActividad: p.sectorActividad || 'MINERIA',
        tipoEvaluacion: p.tipoEvaluacion || 'TODOS',
        normaLegalBase: p.normaLegalBase || 'R.M. 312-2011-MINSA Anexo 01 y 02',
        descripcionBateria: p.descripcionBateria || 'Triaje Completo, Examen Clínico, Espirometría, Audiometría, Rx OIT 2000',
        estado: p.estado || 'ACTIVO',
        version: p.version || '1.0',
        fechaAprobacion: p.fechaAprobacion || '2026-01-15',
        archivoProtocolo: p.archivoProtocolo
      }));

      // Sanitize trabajadores
      parsed.trabajadores = parsed.trabajadores.filter(Boolean).map((t: any, idx: number) => ({
        id: t.id || `trab-${idx + 1}`,
        empresaId: t.empresaId || MOCK_EMPRESAS[0]?.id || 'emp-1',
        nombres: t.nombres || '',
        apellidos: t.apellidos || '',
        numDoc: t.numDoc || t.dni || '00000000',
        puestoTrabajo: t.puestoTrabajo || t.puesto || 'Puesto Operativo',
        areaArea: t.areaArea || t.area || 'Operaciones',
        estado: t.estado || 'ACTIVO',
        fechaNacimiento: t.fechaNacimiento || '1990-01-01',
        genero: t.genero || 'MASCULINO',
        grupoSanguineo: t.grupoSanguineo || 'O+',
        telefono: t.telefono || '',
        email: t.email || ''
      }));

      // Sanitize EMOs
      parsed.emos = parsed.emos.filter(Boolean).map((e: any, idx: number) => ({
        id: e.id || `emo-${idx + 1}`,
        trabajadorId: e.trabajadorId || '',
        empresaId: e.empresaId || MOCK_EMPRESAS[0]?.id || 'emp-1',
        tipoEmo: e.tipoEmo || 'PERIODICO',
        fechaExamen: e.fechaExamen || new Date().toISOString().split('T')[0],
        estadoAptitud: e.estadoAptitud || 'APT',
        restricciones: e.restricciones || [],
        observaciones: e.observaciones || '',
        medicoEvaluador: e.medicoEvaluador || 'Dr. Roberto Silva Alva',
        cmp: e.cmp || '65432'
      }));

      // Sanitize Historias while preserving all properties
      parsed.historias = parsed.historias.filter(Boolean).map((h: any, idx: number) => ({
        ...h,
        id: h.id || `hco-${idx + 1}`,
        trabajadorId: h.trabajadorId || '',
        codigoHCO: h.codigoHCO || h.numeroHistoria || `HCO-2026-00${idx + 1}`,
        fechaApertura: h.fechaApertura || '2026-01-10',
        constantesVitalesMasRecientes: h.constantesVitalesMasRecientes || {
          pa: '120/80', fc: 72, fr: 18, temperatura: 36.5, imc: 24.2, saturacionO2: 98, peso: 70, talla: 1.70
        }
      }));

      return parsed;
    }
  } catch (e) {
    console.warn('Error loading client dbStore from localStorage:', e);
  }

  const initialStore: ErpDataStore = {
    empresas: MOCK_EMPRESAS,
    trabajadores: MOCK_TRABAJADORES,
    emos: MOCK_EMO_EXAMS,
    historias: MOCK_HISTORIAS_CLINICAS,
    accidentes: MOCK_ACCIDENTES,
    ausentismos: MOCK_AUSENTISMOS,
    programas: MOCK_PROGRAMAS_VIGILANCIA,
    vacunas: MOCK_VACUNAS,
    auditLogs: MOCK_AUDIT_LOGS,
    protocolos: MOCK_PROTOCOLOS,
    users: INITIAL_USERS
  };

  saveClientStore(initialStore);
  return initialStore;
}

export function saveClientStore(store: ErpDataStore): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  } catch (e) {
    console.error('Error saving client dbStore to localStorage:', e);
  }
}
