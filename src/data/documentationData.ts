import { TestCaseQA } from '../types/erp';

export const PROYECTO_DEFINICION = {
  titulo: 'Documento de Definición del Proyecto: MedOcupa ERP - Sistema Empresarial de Salud Ocupacional',
  version: '1.0.1-PROD',
  fecha: '2026-07-28',
  empresaConsultora: 'Enterprise Health Tech Solutions S.A.C.',
  
  objetivos: [
    'Automatizar y digitalizar al 100% la gestión de Salud Ocupacional para empresas e Instituciones IPSO en el Perú.',
    'Garantizar el cumplimiento estricto de la normativa legal peruana (Ley 29783, R.M. 312-2011-MINSA, D.S. 005-2012-TR).',
    'Optimizar los tiempos de emisión de Certificados de Aptitud Médica Ocupacional de 48 horas a menos de 5 minutos post-evaluación.',
    'Monitorear epidemiológicamente a los trabajadores mediante programas de vigilancia para prevención de enfermedades ocupacionales.',
    'Proteger la confidencialidad médica conforme a la Ley N° 29733 de Protección de Datos Personales con arquitectura RBAC y encriptación.'
  ],

  alcance: 'El ERP abarca desde el alta de empresas clientes, asignación de matrices IPERC, gestión de nómina de trabajadores, agendamiento de citas, ejecución de baterías de examen EMO (Triaje, Medicina, Audiometría, Espirometría, Rx OIT, Laboratorio, Psicología, Oftalmología, EKG), dictamen de Aptitud Ocupacional, gestión de restricciones/recomendaciones, registro de accidentes de trabajo e incidentes peligrosos con notificación MTPE, ausentismo por descansos médicos, programas de vigilancia epidemiológica, carné de inmunizaciones, indicadores IGSO y generación de informes anuales auditorables.',

  usuariosYRoles: [
    {
      rol: 'MEDICO_OCUPACIONAL',
      nombre: 'Médico Ocupacional (CMP / RNM)',
      descripcion: 'Máxima autoridad médica del sistema. Responsable de la HCO, validación de exámenes, dictamen de Aptitud, firma digital y dirección de vigilancia epidemiológica.'
    },
    {
      rol: 'ENFERMERA_OCUPACIONAL',
      nombre: 'Enfermera Ocupacional (CEP)',
      descripcion: 'Gestión de triaje, toma de constantes vitales, administración de programa de vacunas, seguimiento de descansos médicos y apoyo en pruebas complementarias.'
    },
    {
      rol: 'ESPECIALISTA_SST',
      nombre: 'Especialista / Ingeniero de SST',
      descripcion: 'Acceso a matriz IPERC, registro e investigación de accidentes/incidentes (Ley 29783), monitoreo de indicadores IF/IS/IA y restricciones de aptitud sin datos clínicos confidenciales.'
    },
    {
      rol: 'GERENTE_RRHH',
      nombre: 'Gerente / Analista de Recursos Humanos',
      descripcion: 'Visualización de estatus de aptitud de personal, programación de EMOs de ingreso/periódicos/retiro, ausentismo laboral y reubicaciones.'
    },
    {
      rol: 'EMPRESA_CLIENTE',
      nombre: 'Portal Empresa Cliente',
      descripcion: 'Módulo B2B externo para que los clientes del servicio de salud descarguen certificados de aptitud masivos, informes anuales de salud y métricas de ausentismo.'
    },
    {
      rol: 'AUDITOR_SISTEMA',
      nombre: 'Auditor de Calidad y Seguridad',
      descripcion: 'Verificación inmutable de trazabilidad (Audit Logs), cumplimiento de normas ISO 45001 / MINSA y revisión de controles de protección de datos.'
    }
  ],

  normativaPeruana: [
    { ley: 'Ley N° 29783', nombre: 'Ley de Seguridad y Salud en el Trabajo' },
    { ley: 'D.S. N° 005-2012-TR', nombre: 'Reglamento de la Ley N° 29783' },
    { ley: 'R.M. 312-2011-MINSA', nombre: 'Protocolos de Exámenes Médicos Ocupacionales y Guías Diagnósticas' },
    { ley: 'R.M. 021-2016-MINSA', nombre: 'Norma Técnica de Inmunizaciones en Salud Ocupacional' },
    { ley: 'R.M. 375-2008-TR', nombre: 'Norma Básica de Ergonomía y Procedimiento de Evaluación de Riesgo Disergonómico' },
    { ley: 'Ley N° 29733', nombre: 'Ley de Protección de Datos Personales (Protección de Datos Médicos Sensibles)' },
    { ley: 'R.M. 480-2008-MINSA', nombre: 'NTS N° 068-MINSA/DGSP Norma Técnica de Salud que establece el Listado de Enfermedades Profesionales' }
  ]
};

export const DOCUMENTO_IEEE_SRS = {
  titulo: 'Especificación de Requisitos de Software (SRS) - IEEE Std 830-1998',
  codigoDocumento: 'SRS-MEDOCUPA-2026-V1',
  secciones: [
    {
      numero: '1',
      titulo: 'Introducción',
      contenido: 'Este documento especifica los requisitos funcionales, no funcionales y restricciones de diseño para el ERP de Salud Ocupacional MedOcupa. El propósito es proporcionar una referencia vinculante para desarrolladores, auditores clínicos, arquitectos y usuarios finales.'
    },
    {
      numero: '2',
      titulo: 'Descripción General del Sistema',
      contenido: 'El ERP MedOcupa es una plataforma SaaS/On-Premise multicapa basada en microservicios Web RESTful API con interfaz React SPA cliente. Proporciona módulos dedicados para la gestión clínica ocupacional, seguridad industrial y reportabilidad legal al MINSA y MTPE.'
    },
    {
      numero: '3',
      titulo: 'Requisitos Funcionales Clave (IEEE RF)',
      requisitos: [
        'RF-01: El sistema debe permitir la creación de Historias Clínicas Ocupacionales con encriptación AES-256 en reposo.',
        'RF-02: El sistema debe validar la batería de exámenes complementarios exigidos por protocolo R.M. 312-2011 antes de habilitar la emisión de la aptitud.',
        'RF-03: El sistema debe calcular de manera automatizada los Indicadores de Gestión de Salud Ocupacional (IF, IS, IA) según D.S. 005-2012-TR.',
        'RF-04: El sistema debe alertar al MTPE vía formato SAT en un lapso no mayor a 24 horas ante accidentes mortales e incidentes peligrosos.',
        'RF-05: El sistema debe segregar los datos confidenciales clínicos del reporte administrativo de restricciones enviado a RRHH/SST.'
      ]
    },
    {
      numero: '4',
      titulo: 'Requisitos No Funcionales (IEEE RNF)',
      requisitos: [
        'RNF-01 [Rendimiento]: El tiempo de respuesta de las consultas API no debe superar los 250ms bajo una carga de 1,000 usuarios concurrentes.',
        'RNF-02 [Disponibilidad]: La plataforma debe garantizar un Uptime del 99.9% anual mediante arquitectura redundante en Cloud Run / Docker Swarm.',
        'RNF-03 [Seguridad]: Implementación de Autenticación JWT con rotación de tokens, control RBAC y auditoría Append-Only inmutable.',
        'RNF-04 [Usabilidad]: Interfaz responsive adaptada a pantallas táctiles de tabletas médicas y estaciones de escritorio con tiempo de aprendizaje <2 horas.'
      ]
    }
  ]
};

export const ARQUITECTURA_DETALLADA = {
  frontend: {
    tecnologia: 'React 19 + TypeScript + Vite + Tailwind CSS v4 + Motion',
    justificacion: 'Asegura renderizado ultra veloz en cliente, tipado estricto para evitar errores clínicos en tiempo de ejecución, componentes modulares y animación fluida.'
  },
  backend: {
    tecnologia: 'Node.js (v22 LTS) + Express + TypeScript + Drizzle ORM',
    justificacion: 'Permite ejecutar un servidor REST API de alto rendimiento con validación mediante esquemas TypeScript y abstracción tipo-segura sobre base de datos PostgreSQL.'
  },
  database: {
    motor: 'PostgreSQL 16 (Enterprise Ready)',
    justificacion: 'Motor relacional robusto con soporte nativo de transacciones ACID, índices B-Tree/GIN, encriptación en disco y conformidad con auditorías de datos clínicos.'
  },
  seguridad: {
    mecanismos: ['Tokens JWT firmados con RS256', 'Filtro RBAC estricto', 'Encriptación AES-256 para campos con diagnósticos CIE-10', 'Encabezados Helmet & CORS'],
    politicaAuditoria: 'Audit Trail inmutable en tabla audit_logs con trigger de BD para evitar UPDATE/DELETE.'
  }
};

export const MODELO_BASE_DATOS_DDL = `
-- ESQUEMA COMPLETO DE BASE DE DATOS POSTGRESQL - MEDOCUPA ERP (PERU MINSA/MTPE)
-- Diseñado en Drizzle ORM / SQL 3NF con Auditoría e Inmutabilidad

CREATE TABLE empresas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ruc VARCHAR(11) UNIQUE NOT NULL,
  razon_social VARCHAR(255) NOT NULL,
  nombre_comercial VARCHAR(255),
  ciiu VARCHAR(10) NOT NULL,
  actividad_economica TEXT NOT NULL,
  direccion TEXT NOT NULL,
  nivel_riesgo_sctr VARCHAR(10) CHECK (nivel_riesgo_sctr IN ('ALTO', 'MEDIO', 'BAJO')),
  estado VARCHAR(15) DEFAULT 'ACTIVA',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  deleted_at TIMESTAMP WITH TIME ZONE
);

CREATE TABLE trabajadores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  empresa_id UUID NOT NULL REFERENCES empresas(id),
  tipo_documento VARCHAR(10) CHECK (tipo_documento IN ('DNI', 'CE', 'PASAPORTE')),
  numero_documento VARCHAR(20) NOT NULL,
  nombres VARCHAR(100) NOT NULL,
  apellido_paterno VARCHAR(100) NOT NULL,
  apellido_materno VARCHAR(100) NOT NULL,
  fecha_nacimiento DATE NOT NULL,
  sexo CHAR(1) CHECK (sexo IN ('M', 'F')),
  puesto_trabajo VARCHAR(150) NOT NULL,
  area VARCHAR(150) NOT NULL,
  fecha_ingreso DATE NOT NULL,
  factores_riesgo JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT uq_trabajador_doc UNIQUE (tipo_documento, numero_documento)
);

CREATE TABLE historias_clinicas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trabajador_id UUID UNIQUE NOT NULL REFERENCES trabajadores(id),
  codigo_hco VARCHAR(50) UNIQUE NOT NULL,
  fecha_apertura TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  antecedentes_personales JSONB DEFAULT '{}'::jsonb,
  antecedentes_ocupacionales JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE emos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  codigo_emo VARCHAR(50) UNIQUE NOT NULL,
  trabajador_id UUID NOT NULL REFERENCES trabajadores(id),
  empresa_id UUID NOT NULL REFERENCES empresas(id),
  tipo_emo VARCHAR(20) CHECK (tipo_emo IN ('INGRESO', 'PERIODICO', 'RETIRO', 'REUBICACION', 'POST_INCAPACIDAD')),
  fecha_programada DATE NOT NULL,
  fecha_realizada DATE,
  estado VARCHAR(25) NOT NULL DEFAULT 'PROGRAMADO',
  protocolo_aplicado VARCHAR(100) NOT NULL,
  evaluaciones_componentes JSONB NOT NULL,
  costo_emo NUMERIC(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE certificados_aptitud (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  emo_id UUID UNIQUE NOT NULL REFERENCES emos(id),
  resultado VARCHAR(30) CHECK (resultado IN ('APTO', 'APTO_CON_RESTRICCIONES', 'NO_APTO', 'EVALUADO_NO_CONCLUIDO')),
  fecha_emision DATE NOT NULL,
  fecha_vencimiento DATE NOT NULL,
  restricciones JSONB DEFAULT '[]'::jsonb,
  recomendaciones JSONB DEFAULT '[]'::jsonb,
  medico_cmp VARCHAR(20) NOT NULL,
  medico_nombre VARCHAR(150) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE accidentes_trabajo (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  codigo_evento VARCHAR(50) UNIQUE NOT NULL,
  empresa_id UUID NOT NULL REFERENCES empresas(id),
  trabajador_id UUID NOT NULL REFERENCES trabajadores(id),
  tipo VARCHAR(30) CHECK (tipo IN ('ACCIDENTE_LEVE', 'ACCIDENTE_INCAPACITANTE', 'ACCIDENTE_MORTAL', 'INCIDENTE_PELIGROSO')),
  fecha_hora TIMESTAMP WITH TIME ZONE NOT NULL,
  lugar_exacto TEXT NOT NULL,
  descripcion TEXT NOT NULL,
  diagnostico_cie10 VARCHAR(10),
  dias_incapacidad INT DEFAULT 0,
  notificado_mtpe BOOLEAN DEFAULT FALSE,
  codigo_sat VARCHAR(50),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  usuario VARCHAR(100) NOT NULL,
  rol VARCHAR(30) NOT NULL,
  accion VARCHAR(100) NOT NULL,
  recurso VARCHAR(100) NOT NULL,
  ip VARCHAR(45) NOT NULL,
  resultado VARCHAR(20) NOT NULL
);
`;

export const ROADMAP_DESARROLLO = [
  {
    fase: 'Fase 1: Core de Arquitectura, Modelado de BD y Seguridad RBAC',
    sprints: 'Sprint 1 - 2',
    duracion: '3 Semanas',
    prioridad: 'CRITICA',
    modulos: ['Empresas & Sedes', 'Usuarios & Roles', 'Auditoría inmutable', 'Esquema PostgreSQL'],
    riesgos: 'Definición incompleta de roles que afecte la protección de datos médicos.'
  },
  {
    fase: 'Fase 2: Gestión de Trabajadores e Historia Clínica Ocupacional (HCO)',
    sprints: 'Sprint 3 - 4',
    duracion: '3 Semanas',
    prioridad: 'CRITICA',
    modulos: ['Ficha de Trabajador', 'Matriz de Riesgos IPERC por puesto', 'HCO digital', 'Firma Médica'],
    riesgos: 'Incompatibilidad con antecedentes de empresas anteriores.'
  },
  {
    fase: 'Fase 3: Motor de Exámenes Médicos (EMO) y Certificados de Aptitud',
    sprints: 'Sprint 5 - 7',
    duracion: '4 Semanas',
    prioridad: 'CRITICA',
    modulos: ['Batería de Pruebas (RM 312-2011)', 'Aptitud Médica', 'Restricciones/Recomendaciones', 'PDF Exporter'],
    riesgos: 'Retrasos en la integración con equipos de laboratorio/audiometría.'
  },
  {
    fase: 'Fase 4: Accidentes, Ausentismo, Vigilancia e Inmunizaciones',
    sprints: 'Sprint 8 - 9',
    duracion: '3 Semanas',
    prioridad: 'ALTA',
    modulos: ['Accidentes Ley 29783', 'Notificación MTPE SAT', 'Ausentismo CIE-10', 'Vigilancia Epidemiológica', 'Vacunas'],
    riesgos: 'Cambios normativos repentinos por parte del MTPE/MINSA.'
  },
  {
    fase: 'Fase 5: Tablero IGSO, Reportes Oficiales, QA Suite y Despliegue Docker',
    sprints: 'Sprint 10',
    duracion: '2 Semanas',
    prioridad: 'ALTA',
    modulos: ['Tablero Ejecutivo IGSO', 'Anexo 1 MINSA', 'Pruebas de Estrés', 'Docker Compose & Releases'],
    riesgos: 'Desviación en rendimiento con volúmenes superiores a 1,000,000 registros.'
  }
];

export const CASOS_DE_PRUEBA_QA: TestCaseQA[] = [
  {
    id: '1',
    codigo: 'TC-EMO-001',
    modulo: 'Exámenes EMO',
    titulo: 'Validación de Batería de Pruebas para Puesto de Alto Riesgo (Minería/Ruido)',
    precondiciones: 'Trabajador registrado en área Operaciones Mineras con exposición a Ruido >85dB.',
    pasos: [
      '1. Seleccionar trabajador en EMO de Ingreso.',
      '2. Aplicar protocolo de Minería.',
      '3. Intentar generar Certificado de Aptitud sin cargar el resultado de Audiometría.',
      '4. Cargar resultado de Audiometría e intentar nuevamente.'
    ],
    resultadoEsperado: 'El sistema bloquea la emisión en el paso 3 mostrando alerta "Falta Audiometría Obligatoria". En el paso 4 permite la emisión.',
    tipo: 'CLINICA',
    estado: 'APROBADO'
  },
  {
    id: '2',
    codigo: 'TC-SEC-002',
    modulo: 'Seguridad y Privacidad',
    titulo: 'Segregación de Datos Clínicos para Rol RRHH / SST',
    precondiciones: 'Usuario autenticado con rol GERENTE_RRHH o ESPECIALISTA_SST.',
    pasos: [
      '1. Iniciar sesión como Analista de RRHH.',
      '2. Navegar al perfil de un trabajador con Certificado APTO CON RESTRICCIONES.',
      '3. Intentar acceder a la pestaña de Antecedentes Patológicos o Diagnóstico CIE-10.'
    ],
    resultadoEsperado: 'El sistema oculta las pestañas clínicas y solo muestra las restricciones operativas, registrando el intento en audit_logs.',
    tipo: 'SEGURIDAD_LEY29733',
    estado: 'APROBADO'
  },
  {
    id: '3',
    codigo: 'TC-IND-003',
    modulo: 'Indicadores IGSO',
    titulo: 'Cálculo de Índice de Frecuencia (IF) y Severidad (IS)',
    precondiciones: 'Empresa con 500,000 HHT, 2 accidentes incapacitantes y 15 días perdidos acumulados.',
    pasos: [
      '1. Registrar 2 accidentes de trabajo incapacitantes con total de 15 días perdidos.',
      '2. Ingresar 500,000 Horas Hombre Trabajadas en el módulo de indicadores.',
      '3. Verificar los valores resultantes de IF e IS.'
    ],
    resultadoEsperado: 'IF calculado = (2 * 1,000,000) / 500,000 = 4.00; IS calculado = (15 * 1,000,000) / 500,000 = 30.00.',
    tipo: 'FUNCIONAL',
    estado: 'APROBADO'
  }
];

export const CONFIGURACION_DOCKER = {
  dockerfile: `FROM node:22-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000
COPY package*.json ./
RUN npm ci --only=production
COPY --from=builder /app/dist ./dist
EXPOSE 3000
CMD ["node", "dist/server.cjs"]`,

  dockerCompose: `version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgres://medocupa_usr:SecurePass2026!@postgres:5432/medocupa_db
      - JWT_SECRET=SecretKeyEnterpriseMedOcupa2026
    depends_on:
      - postgres
    restart: always

  postgres:
    image: postgres:16-alpine
    container_name: medocupa_postgres
    environment:
      POSTGRES_USER: medocupa_usr
      POSTGRES_PASSWORD: SecurePass2026!
      POSTGRES_DB: medocupa_db
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    restart: always

volumes:
  postgres_data:`
};
