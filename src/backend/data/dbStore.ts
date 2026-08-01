import fs from 'fs';
import path from 'path';
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
} from '../../types/erp';

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
} from '../../data/initialData';

function getStoreFilePath(): string {
  if (process.env.APP_DATA_DIR) {
    if (!fs.existsSync(process.env.APP_DATA_DIR)) {
      try {
        fs.mkdirSync(process.env.APP_DATA_DIR, { recursive: true });
      } catch (e) {
        console.error('Error creating APP_DATA_DIR:', e);
      }
    }
    return path.join(process.env.APP_DATA_DIR, 'data_store.json');
  }

  const appDataEnv = process.env.APPDATA 
    || process.env.LOCALAPPDATA
    || (process.platform === 'darwin' ? path.join(process.env.HOME || '', 'Library', 'Application Support') : null)
    || process.env.XDG_DATA_HOME
    || (process.env.HOME ? path.join(process.env.HOME, '.config') : null);

  if (appDataEnv) {
    const medOcupaFolder = path.join(appDataEnv, 'MedOcupaERP');
    try {
      if (!fs.existsSync(medOcupaFolder)) {
        fs.mkdirSync(medOcupaFolder, { recursive: true });
      }
      return path.join(medOcupaFolder, 'data_store.json');
    } catch (e) {
      console.error('Error creating user AppData directory:', e);
    }
  }

  return path.join(process.cwd(), 'data_store.json');
}

const STORE_FILE_PATH = getStoreFilePath();

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

// Predefined seed users with hashed passwords
const INITIAL_USERS: SystemUser[] = [
  {
    id: 'usr-medico-1',
    nombre: 'Dr. Roberto Silva Alva',
    email: 'medico@medocupa.pe',
    passwordHash: bcrypt.hashSync('medico123', 10),
    rol: UserRole.MEDICO_OCUPACIONAL,
    cmp_rnm: 'CMP: 65432 / RNM: 01234',
    avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=200'
  },
  {
    id: 'usr-enfermera-1',
    nombre: 'Lic. María Elena Ramos',
    email: 'enfermera@medocupa.pe',
    passwordHash: bcrypt.hashSync('enfermera123', 10),
    rol: UserRole.ENFERMERA_OCUPACIONAL,
    cep: 'CEP: 87654',
    avatar: 'https://images.unsplash.com/photo-1594824813566-82881a798589?auto=format&fit=crop&q=80&w=200'
  },
  {
    id: 'usr-sst-1',
    nombre: 'Ing. Fernando Castro',
    email: 'sst@medocupa.pe',
    passwordHash: bcrypt.hashSync('sst123', 10),
    rol: UserRole.ESPECIALISTA_SST,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'
  },
  {
    id: 'usr-admin-1',
    nombre: 'Admin MedOcupa ERP',
    email: 'admin@medocupa.pe',
    passwordHash: bcrypt.hashSync('admin123', 10),
    rol: UserRole.ADMINISTRADOR,
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200'
  }
];

let currentStore: ErpDataStore | null = null;

function loadStore(): ErpDataStore {
  if (currentStore) return currentStore;

  try {
    if (fs.existsSync(STORE_FILE_PATH)) {
      const raw = fs.readFileSync(STORE_FILE_PATH, 'utf-8');
      currentStore = JSON.parse(raw);
      // Asegurar que exista propiedad users
      if (!currentStore!.users || currentStore!.users.length === 0) {
        currentStore!.users = [...INITIAL_USERS];
      }
      return currentStore!;
    }
  } catch (err) {
    console.error('[DB STORE] Error al leer data_store.json, inicializando con fallback:', err);
  }

  // Fallback inicial
  currentStore = {
    empresas: [...MOCK_EMPRESAS],
    trabajadores: [...MOCK_TRABAJADORES],
    emos: [...MOCK_EMO_EXAMS],
    historias: [...MOCK_HISTORIAS_CLINICAS],
    accidentes: [...MOCK_ACCIDENTES],
    ausentismos: [...MOCK_AUSENTISMOS],
    programas: [...MOCK_PROGRAMAS_VIGILANCIA],
    vacunas: [...MOCK_VACUNAS],
    auditLogs: [...MOCK_AUDIT_LOGS],
    protocolos: [...MOCK_PROTOCOLOS],
    users: [...INITIAL_USERS]
  };

  saveStore(currentStore);
  return currentStore;
}

export function saveStore(data: ErpDataStore): void {
  try {
    currentStore = data;
    fs.writeFileSync(STORE_FILE_PATH, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('[DB STORE] Error al guardar data_store.json:', err);
  }
}

export function getStore(): ErpDataStore {
  return loadStore();
}
