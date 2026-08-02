export enum UserRole {
  MEDICO_OCUPACIONAL = 'MEDICO_OCUPACIONAL',
  ENFERMERA_OCUPACIONAL = 'ENFERMERA_OCUPACIONAL',
  ESPECIALISTA_SST = 'ESPECIALISTA_SST',
  ADMINISTRADOR = 'ADMINISTRADOR',
}

export type Role = 'MEDICO_OCUPACIONAL' | 'ENFERMERA_OCUPACIONAL' | 'ESPECIALISTA_SST' | 'ADMINISTRADOR';

export type PermissionLevel = 'CREAR' | 'LEER' | 'EDITAR' | 'ELIMINAR' | 'EXPORTAR' | 'NINGUNO';

export interface ModulePermissions {
  crear: boolean;
  leer: boolean;
  editar: boolean;
  eliminar: boolean;
  exportar: boolean;
}

export type SystemModuleKey = 
  | 'empresas'
  | 'trabajadores'
  | 'historia_clinica'
  | 'emo'
  | 'aptitud'
  | 'accidentes'
  | 'vacunas'
  | 'ausentismo'
  | 'vigilancia'
  | 'reportes_minsa'
  | 'protocolos';

export interface RolePermissionsMatrix {
  role: Role;
  roleName: string;
  modules: Record<SystemModuleKey, ModulePermissions>;
}

export interface User {
  id: string;
  nombre: string;
  email: string;
  rol: Role;
  cmp_rnm?: string; // Colegio Médico del Perú / Registro Nacional de Médico Ocupacional (RNM)
  cep?: string; // Colegio de Enfermeros del Perú
  empresaId?: string;
  avatar: string;
}

export interface Empresa {
  id: string;
  ruc: string;
  razonSocial: string;
  nombreComercial: string;
  ciiu: string;
  actividadEconomica: string;
  direccion: string;
  departamento: string;
  provincia: string;
  distrito: string;
  nivelRiesgoSCTR: 'ALTO' | 'MEDIO' | 'BAJO';
  totalTrabajadores: number;
  contactoNombre: string;
  contactoEmail: string;
  contactoTelefono: string;
  estado: 'ACTIVA' | 'INACTIVA';
  sedes: Sede[];
}

export interface Sede {
  id: string;
  nombre: string;
  direccion: string;
  trabajadoresCount: number;
  estado?: 'ACTIVA' | 'INACTIVA';
}

export interface FactorRiesgo {
  tipo: 'FISICO' | 'QUIMICO' | 'BIOLOGICO' | 'ERGONOMICO' | 'PSICOSOCIAL';
  descripcion: string;
  intensidadNivel: 'BAJO' | 'MEDIO' | 'ALTO' | 'CRITICO';
}

export interface Trabajador {
  id: string;
  empresaId: string;
  sedeId: string;
  tipoDocumento: 'DNI' | 'CE' | 'PASAPORTE';
  numeroDocumento: string;
  nombres: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  fechaNacimiento: string;
  sexo: 'M' | 'F';
  telefono: string;
  email: string;
  puestoTrabajo: string;
  area: string;
  grupoOcupacional: string;
  fechaIngreso: string;
  factoresRiesgo: FactorRiesgo[];
  estado: 'ACTIVO' | 'INACTIVO' | 'LICENCIA';
}

export type TipoEMO = 'INGRESO' | 'PERIODICO' | 'RETIRO' | 'REUBICACION' | 'POST_INCAPACIDAD';

export type EstadoEMO = 'PROGRAMADO' | 'EN_PROCESO' | 'OBSERVADO' | 'CONCLUIDO' | 'CERTIFICADO_EMITIDO';

export type ResultadoAptitud = 'APTO' | 'APTO_CON_RESTRICCIONES' | 'NO_APTO' | 'EVALUADO_NO_CONCLUIDO';

export interface EMOExam {
  id: string;
  codigoEMO: string;
  trabajadorId: string;
  empresaId: string;
  tipoEMO: TipoEMO;
  fechaProgramada: string;
  fechaRealizada?: string;
  estado: EstadoEMO;
  medicoId?: string;
  protocoloAplicado: string;
  costoEMO: number;
  
  // Evaluaciones componentes (RM 312-2011)
  evaluaciones: {
    triaje: boolean;
    medicinaGeneral: boolean;
    audiometria: boolean;
    espirometria: boolean;
    radiografiaOIT: boolean;
    laboratorio: boolean;
    psicologia: boolean;
    oftalmologia: boolean;
    electrocardiograma: boolean;
  };

  aptitud?: {
    resultado: ResultadoAptitud;
    fechaEmision: string;
    fechaVencimiento: string;
    restricciones: string[];
    recomendaciones: string[];
    vigilanciaSugerida: string[];
    motivoNoApto?: string;
    medicoFirmante: string;
    cmpFirmante: string;
  };
}

export interface ExamenLaboratorioControl {
  id: string;
  nombreExamen: string;
  resultado: string;
  valoresReferencia?: string;
  observacion?: string;
}

export interface ControlSeguimientoMedico {
  id: string;
  fecha: string;
  motivoControl?: string;
  medicoAtendio?: string;
  signosVitales: {
    pa: string;            // Presión Arterial
    fc: number | string;   // Frecuencia Cardíaca (LPM)
    fr: number | string;   // Frecuencia Respiratoria (RPM)
    saturacionO2: number | string; // Saturación de Oxígeno (%)
    temperatura: number | string;  // Temperatura (°C)
  };
  examenesLaboratorio?: ExamenLaboratorioControl[];
  observacionControl?: string;
}

export type TipoDocumentoHCO = 
  | 'EXPEDIENTE_HC_PDF' 
  | 'FICHA_EMO' 
  | 'CERTIFICADO_APTITUD' 
  | 'EXAMEN_LABORATORIO_EXTERNO' 
  | 'INFORME_RADIOLOGICO_OIT' 
  | 'INTERCONSULTA_ESPECIALIZADA' 
  | 'FIRMA_DIGITAL_CONSENTIMIENTO' 
  | 'OTRO_DOCUMENTO';

export interface DocumentoAdjuntoHCO {
  id: string;
  nombreArchivo: string;
  tipoDocumento: TipoDocumentoHCO;
  dataUrl: string;
  tamanioBytes?: number;
  fechaSubida: string;
  subidoPor?: string;
  observaciones?: string;
}

export interface HistoriaClinicaOcupacional {
  id: string;
  trabajadorId: string;
  codigoHCO: string;
  fechaApertura: string;
  
  antecedentesPersonales: {
    patologicas: string[];
    quirurgicas: string[];
    alergias: string[];
    habitosNocivos: string;
  };
  
  antecedentesOcupacionales: {
    empresaAnterior: string;
    puesto: string;
    tiempoAnos: number;
    riesgosExpuestos: string[];
    eppUtilizado: string;
  }[];

  constantesVitalesMasRecientes?: {
    pa: string;
    fc: number;
    fr: number;
    temperatura: number;
    imc: number;
    saturacionO2: number;
    peso?: number;
    talla?: number;
  };

  controlesPosteriores?: ControlSeguimientoMedico[];

  diagnosticosCIE10?: {
    id?: string;
    codigo: string;
    descripcion: string;
    tipo: 'PRESUNTIVO' | 'DEFINITIVO' | 'REPETIDO';
    fecha?: string;
  }[];

  observacionesMedicas?: string;

  archivoPdf?: ArchivoProtocolo;
  archivosAdjuntos?: DocumentoAdjuntoHCO[];
}

export interface AccidenteIncidente {
  id: string;
  codigoEvento: string;
  empresaId: string;
  trabajadorId: string;
  trabajadorNombreCustom?: string;
  trabajadorDniCustom?: string;
  tipo: 'ACCIDENTE_LEVE' | 'ACCIDENTE_INCAPACITANTE' | 'ACCIDENTE_MORTAL' | 'INCIDENTE_PELIGROSO';
  fechaHora: string;
  lugarExacto: string;
  descripcionHechos: string;
  parteCuerpoAfectada: string;
  diagnosticoCIE10: string;
  diasIncapacidad: number;
  notificadoMTPE: boolean;
  codigoRegistroSAT?: string;
  causasRaiz: string[];
  medidasCorrectivas: string[];
  estadoInvestigacion: 'EN_INVESTIGACION' | 'CERRADO' | 'PENDIENTE_MEDIDAS';
  archivoPdf?: CertificadoMedicoPdf;
}

export interface CapacitacionEPPItem {
  id: string;
  tipo: 'INDUCCION_GENERAL' | 'INDUCCION_ESPECIFICA' | 'CAPACITACION_SST' | 'ENTREGA_EPP' | 'ENTRENAMIENTO_BRIGADA';
  titulo: string;
  fecha: string;
  cumplido: boolean;
  horasLectivas?: number;
  instructorExp?: string;
  archivoPdf?: CertificadoMedicoPdf;
  observaciones?: string;
}

export interface CertificadoMedicoPdf {
  nombreArchivo: string;
  dataUrl: string;
  tamanioBytes?: number;
  fechaSubida?: string;
}

export type AgenteRiesgoFNO = 'FISICO' | 'QUIMICO' | 'BIOLOGICO' | 'ERGONOMICO' | 'PSICOSOCIAL';
export type EstadoFNORegistro = 'CONFIRMADO' | 'SOSPECHOSO' | 'EN_EVALUACION_SATEP' | 'NOTIFICADO_DIGESA';

export interface FichaFNORegistro {
  id: string;
  codigoFNO: string;
  empresaId?: string;
  trabajadorId?: string;
  trabajadorNombre: string;
  numeroDocumento: string;
  puestoTrabajo: string;
  enfermedadOcupacional: string;
  codigoCIE10: string;
  agenteRiesgo: AgenteRiesgoFNO;
  agenteEspecifico: string;
  fechaDiagnostico: string;
  fechaNotificacionMINSA: string;
  estado: EstadoFNORegistro;
  gradoIncapacidad: string;
  medicoNotificante: string;
  cmpMedico: string;
  observaciones?: string;
  archivoPdf?: CertificadoMedicoPdf;
}

export interface AusentismoMedico {
  id: string;
  trabajadorId: string;
  empresaId: string;
  tipoAusencia: 'ENFERMEDAD_COMUN' | 'ACCIDENTE_TRABAJO' | 'ENFERMEDAD_OCUPACIONAL' | 'MATERNIDAD_PATERNIDAD' | 'LICENCIA_MEDICA';
  codigoCIE10: string;
  descripcionCIE10: string;
  fechaInicio: string;
  fechaFin: string;
  diasTotales: number;
  centroMedicoEmisor: string;
  medicoTratante: string;
  cmpMedicoTratante: string;
  montoSubsidioEstimado: number;
  certificadoPdf?: CertificadoMedicoPdf;
}

export type CategoriaProgramaVigilancia = 'GENERAL' | 'ESPECIFICO_EXPOSICION' | 'SALUD_Y_BIENESTAR';

export interface EvidenciaCapacitacion {
  id: string;
  nombreArchivo: string;
  dataUrl: string;
  tipoArchivo?: string;
  tamanioBytes?: number;
  fechaSubida?: string;
}

export interface CapacitacionProgramaVigilancia {
  id: string;
  nombre: string;
  fecha: string;
  horasLectivas?: number;
  instructor?: string;
  observaciones?: string;
  evidencias?: EvidenciaCapacitacion[];
}

export interface ProgramaVigilancia {
  id: string;
  empresaId: string;
  nombrePrograma: string; // Nombre completo del programa (e.g., 'Programa de Conservación Auditiva')
  codigoPrograma?: string;
  categoria?: CategoriaProgramaVigilancia;
  descripcion: string;
  baseLegal?: string; // e.g., 'R.M. 312-2011-MINSA / R.M. 375-2008-TR'
  medicoResponsable: string;
  poblacionExpuestaTotal: number;
  trabajadoresEnVigilancia: number;
  casosSospechosos: number;
  casosConfirmados: number;
  metaCumplimientoPorcentaje: number;
  avanceActualPorcentaje: number;
  estado: 'ACTIVO' | 'REVISION' | 'FINALIZADO' | 'NO_APLICA' | 'PROGRAMADO';
  aplicaSegunRiesgo?: boolean; // true for "cuando aplique / si aplica"
  periodicidadEvaluacion?: string; // e.g. 'Semestral', 'Anual'
  indicadoresClave?: string[];
  capacitaciones?: CapacitacionProgramaVigilancia[];
  fechaVencimiento?: string;
  proximaEvaluacionFecha?: string;
}

export interface RegistroVacuna {
  id: string;
  trabajadorId: string;
  vacunaNombre: string;
  dosisNumero: number;
  fechaAplicacion: string;
  lote: string;
  laboratorio: string;
  aplicada?: boolean;
  tieneProximoRefuerzo?: boolean;
  proximaDosisFecha?: string;
  observaciones?: string;
  aplicadoPor?: string;
}

export interface IndicadorIGSO {
  indiceFrecuencia: number; // IF = (N° Accidentes * 1,000,000) / Horas Hombre Trab
  indiceSeveridad: number;  // IS = (N° Días Perdidos * 1,000,000) / Horas Hombre Trab
  indiceAccidentabilidad: number; // IA = (IF * IS) / 1000
  cumplimientoEMOPorcentaje: number;
  tasaPrevalenciaEnfermedadOcupacional: number;
  tasaAusentismoPorEnfermedad: number;
  coberturaVigilanciaEpidemiologica: number;
  totalHorasHombreTrabajadas: number;
}

export interface ReglaNegocio {
  codigo: string;
  modulo: string;
  nombre: string;
  descripcion: string;
  condicion: string;
  resultado: string;
  prioridad: 'CRITICA' | 'ALTA' | 'MEDIA' | 'BAJA';
  dependencias: string[];
  baseLegalPeruana: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  usuario: string;
  rol: Role;
  accion: string;
  recurso: string;
  ip: string;
  resultado: 'EXITO' | 'ADVERTENCIA' | 'DENEGADO';
  detalles: string;
}

export interface ArchivoProtocolo {
  nombreArchivo: string;
  tipoArchivo: 'PDF' | 'EXCEL';
  dataUrl: string;
  tamanioBytes?: number;
  fechaSubida: string;
}

export interface ProtocoloExamenMedico {
  id: string;
  empresaId?: string;
  nombreProtocolo: string;
  codigoProtocolo: string;
  sectorActividad: 'MINERIA' | 'CONSTRUCCION' | 'SALUD' | 'AGROINDUSTRIA' | 'ELECTRICIDAD' | 'GENERAL';
  tipoEvaluacion: 'INGRESO' | 'PERIODICO' | 'RETIRO' | 'REUBICACION' | 'TODOS';
  normaLegalBase: string; // e.g. R.M. 312-2011-MINSA Anexo 01
  descripcionBateria: string; // List of exams (Laboratorio, Rx OIT, Espirometría, Audiometría, Psicología, etc.)
  estado: 'ACTIVO' | 'REVISION' | 'HISTORICO';
  version: string;
  fechaAprobacion: string;
  fechaVencimiento?: string;
  proximaRevisionFecha?: string;
  archivoProtocolo?: ArchivoProtocolo;
}

export interface TestCaseQA {
  id: string;
  codigo: string;
  modulo: string;
  titulo: string;
  precondiciones: string;
  pasos: string[];
  resultadoEsperado: string;
  tipo: 'FUNCIONAL' | 'CLINICA' | 'SEGURIDAD_LEY29733' | 'RENDIMIENTO' | 'INTEGRACION';
  estado: 'APROBADO' | 'PENDIENTE' | 'EN_EJECUCION' | 'FALLIDO';
}
