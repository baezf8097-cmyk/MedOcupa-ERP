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
      // Ensure seed users exist
      if (!parsed.users || parsed.users.length === 0) {
        parsed.users = INITIAL_USERS;
      }
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
