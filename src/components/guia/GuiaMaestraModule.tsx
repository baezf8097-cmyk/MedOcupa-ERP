import React, { useState } from 'react';
import { Empresa } from '../../types/erp';
import { CronogramaActividadesModule } from '../cronograma/CronogramaActividadesModule';
import { 
  ShieldCheck, CheckCircle2, AlertTriangle, FileText, Download, ChevronDown, ChevronRight, 
  BarChart3, Users, BookOpen, GraduationCap, Award, Stethoscope, Clock, Activity, 
  Building2, Plus, Calendar, CheckSquare, Edit3, Save, X, Upload, FilePlus, Eye, Trash2, Paperclip, CalendarDays
} from 'lucide-react';

interface GuiaMaestraModuleProps {
  empresas: Empresa[];
  selectedEmpresaId: string;
}

export interface EvidenciaPdfGuia {
  nombreArchivo: string;
  dataUrl: string;
  tamanioBytes?: number;
  fechaSubida: string;
}

export interface PillarItem {
  id: string;
  nombre: string;
  norma: string;
  cumplido: boolean;
  estado?: 'CONFORME' | 'EN_PROCESO' | 'OBSERVADO' | 'PENDIENTE' | 'NO_APLICA';
  porcentajeCumplimiento?: number;
  evidenciaEnERP: string;
  moduloAsociado: string;
  responsable?: string;
  fechaCumplimiento?: string;
  evidenciaPdf?: EvidenciaPdfGuia;
}

export interface PillarCategory {
  numero: number;
  titulo: string;
  descripcion: string;
  items: PillarItem[];
}

interface Capacitacion {
  id: string;
  tema: string;
  fecha: string;
  asistentes: number;
  horas: number;
  expositor: string;
  estado: 'COMPLETADO' | 'PROGRAMADO' | 'PENDIENTE';
  listaAsistentesPdf?: EvidenciaPdfGuia;
}

const INITIAL_PILARES: PillarCategory[] = [
  {
    numero: 1,
    titulo: 'Gestión de Salud Ocupacional',
    descripcion: 'Documentos estratégicos y de planificación anual normados por la Ley 29783 y R.M. 312-2011-MINSA.',
    items: [
      { id: '1.1', nombre: 'Diagnóstico de Línea Base de Salud Ocupacional', norma: 'R.M. 050-2013-TR', cumplido: true, estado: 'CONFORME', porcentajeCumplimiento: 100, evidenciaEnERP: 'Generado con score 94.2% e IPERC Ocupacional', moduloAsociado: 'Dashboard & IGSO', responsable: 'Dr. Alejandro Morales', fechaCumplimiento: '2026-01-10' },
      { id: '1.2', nombre: 'Programa Anual de Salud Ocupacional (PASO 2026)', norma: 'Ley 29783 Art. 36', cumplido: true, estado: 'CONFORME', porcentajeCumplimiento: 100, evidenciaEnERP: 'Aprobado por Comité SST con presupuesto asignado', moduloAsociado: 'Reportes MINSA / MTPE', responsable: 'Ing. Fernando Soto', fechaCumplimiento: '2026-01-15' },
      { id: '1.3', nombre: 'Plan Anual de Vigilancia de la Salud de los Trabajadores', norma: 'R.M. 312-2011-MINSA', cumplido: true, estado: 'CONFORME', porcentajeCumplimiento: 100, evidenciaEnERP: 'Activo con 12 Cohortes de Vigilancia Ocupacional', moduloAsociado: 'Vigilancia Epidemiológica', responsable: 'Dr. Alejandro Morales', fechaCumplimiento: '2026-01-20' },
      { id: '1.4', nombre: 'Objetivos, Metas e Indicadores de Gestión Ocupacional', norma: 'R.M. 050-2013-TR', cumplido: true, estado: 'CONFORME', porcentajeCumplimiento: 100, evidenciaEnERP: 'KPIs en vivo (Cobertura EMO, Restricciones, Ausentismo)', moduloAsociado: 'Dashboard & IGSO', responsable: 'Dra. Carmen Alva', fechaCumplimiento: '2026-01-22' },
      { id: '1.5', nombre: 'Cronograma Anual de Actividades e Intervenciones', norma: 'D.S. 005-2012-TR', cumplido: true, estado: 'CONFORME', porcentajeCumplimiento: 100, evidenciaEnERP: 'Gantt de EMOs, Monitoreos y Campañas de Salud', moduloAsociado: 'Reportes MINSA / MTPE', responsable: 'Lic. Enf. Patricia Vargas', fechaCumplimiento: '2026-01-25' },
      { id: '1.6', nombre: 'Presupuesto Asignado a Salud Ocupacional', norma: 'Ley 29783 Art. 36', cumplido: true, estado: 'CONFORME', porcentajeCumplimiento: 100, evidenciaEnERP: 'Desglose en PASO 2026 (S/ 185,000 anuales)', moduloAsociado: 'Reportes MINSA / MTPE', responsable: 'Gerencia General / SST', fechaCumplimiento: '2026-01-28' },
      { id: '1.7', nombre: 'Memoria Anual de Salud Ocupacional y Resultados', norma: 'R.M. 312-2011 Num. 6.8', cumplido: true, estado: 'CONFORME', porcentajeCumplimiento: 100, evidenciaEnERP: 'Consolidado listo para auditoría SUNAFIL', moduloAsociado: 'Reportes MINSA / MTPE', responsable: 'Dr. Alejandro Morales', fechaCumplimiento: '2026-01-30' }
    ]
  },
  {
    numero: 2,
    titulo: 'Programas Específicos de Vigilancia',
    descripcion: 'Los 12 Programas Sanitarios y de Vigilancia Ocupacional reglamentados por MINSA y MTPE.',
    items: [
      { id: '2.1', nombre: 'Programa de Vigilancia Médica Ocupacional (PVO)', norma: 'R.M. 312-2011-MINSA', cumplido: true, estado: 'CONFORME', porcentajeCumplimiento: 100, evidenciaEnERP: '1,250 trabajadores monitoreados en EMOs', moduloAsociado: 'Vigilancia Epidemiológica', responsable: 'Dr. Alejandro Morales' },
      { id: '2.2', nombre: 'Programa de Conservación Auditiva (PCA)', norma: 'R.M. 375-2008-TR', cumplido: true, estado: 'CONFORME', porcentajeCumplimiento: 100, evidenciaEnERP: 'Monitoreo audiométrico y dosimetría >85 dBA', moduloAsociado: 'Vigilancia Epidemiológica', responsable: 'Ing. SST Fernando Soto' },
      { id: '2.3', nombre: 'Programa de Prevención Ergonomía y TME (PME)', norma: 'R.M. 375-2008-TR Ergonomía', cumplido: true, estado: 'CONFORME', porcentajeCumplimiento: 100, evidenciaEnERP: 'Evaluación REBA/RULA y Pausas Activas', moduloAsociado: 'Vigilancia Epidemiológica', responsable: 'Dra. Carmen Alva' },
      { id: '2.4', nombre: 'Programa de Vigilancia de Riesgo Psicosocial', norma: 'Ley 29783 / SUSESO-ISTAS 21', cumplido: true, estado: 'CONFORME', porcentajeCumplimiento: 100, evidenciaEnERP: 'Evaluación de clima laboral y estrés en 1,250 pers.', moduloAsociado: 'Vigilancia Epidemiológica', responsable: 'Ps. Carmen Rosa Mendoza' },
      { id: '2.5', nombre: 'Programa de Vida Saludable (Síndrome Metabólico)', norma: 'Ley 30021 Alimentación', cumplido: true, estado: 'CONFORME', porcentajeCumplimiento: 100, evidenciaEnERP: 'Tamizaje IMC, Glucosa y Perfil Lipídico', moduloAsociado: 'Vigilancia Epidemiológica', responsable: 'Nut. Sofía Paredes' },
      { id: '2.6', nombre: 'Programa de Promoción de la Salud Ocupacional', norma: 'D.S. 005-2012-TR', cumplido: true, estado: 'CONFORME', porcentajeCumplimiento: 100, evidenciaEnERP: 'Boletines, talleres y pausas saludables activas', moduloAsociado: 'Vigilancia Epidemiológica', responsable: 'Lic. Enf. Patricia Vargas' },
      { id: '2.7', nombre: 'Programa de Inmunizaciones Ocupacionales', norma: 'Norma Técnica MINSA', cumplido: true, estado: 'CONFORME', porcentajeCumplimiento: 100, evidenciaEnERP: 'Dosis Hepatitis B, Tétanos e Influenza registradas', moduloAsociado: 'Carné de Inmunizaciones', responsable: 'Lic. Enf. Patricia Vargas' },
      { id: '2.8', nombre: 'Programa de Enfermedades Respiratorias (si aplica)', norma: 'R.M. 312-2011 Anexo 01', cumplido: true, estado: 'CONFORME', porcentajeCumplimiento: 100, evidenciaEnERP: 'Espirometrías y lectura OIT para 1,100 expuestos', moduloAsociado: 'Vigilancia Epidemiológica', responsable: 'Dr. Alejandro Morales' },
      { id: '2.9', nombre: 'Programa de Control de Riesgos Biológicos (si aplica)', norma: 'D.S. 015-2005-SA', cumplido: true, estado: 'CONFORME', porcentajeCumplimiento: 100, evidenciaEnERP: 'Monitoreo de pinzamiento y serología en 320 pers.', moduloAsociado: 'Vigilancia Epidemiológica', responsable: 'Dra. Carmen Alva' },
      { id: '2.10', nombre: 'Programa de Exposición a Agentes Químicos (si aplica)', norma: 'D.S. 015-2005-SA VLP', cumplido: true, estado: 'CONFORME', porcentajeCumplimiento: 100, evidenciaEnERP: 'Dosaje de Plombemia y Colinesterasa en 450 pers.', moduloAsociado: 'Vigilancia Epidemiológica', responsable: 'Dr. Alejandro Morales' },
      { id: '2.11', nombre: 'Programa de Exposición a Radiaciones (si aplica)', norma: 'Ley 28028 / IPEN', cumplido: true, estado: 'CONFORME', porcentajeCumplimiento: 100, evidenciaEnERP: 'Dosimetría personal mensual e inspección EPP', moduloAsociado: 'Vigilancia Epidemiológica', responsable: 'Ing. SST Fernando Soto' },
      { id: '2.12', nombre: 'Programa de Estrés Térmico (si aplica)', norma: 'R.M. 375-2008-TR WBGT', cumplido: true, estado: 'CONFORME', porcentajeCumplimiento: 100, evidenciaEnERP: 'Monitoreo de índice WBGT y régimen de hidratación', moduloAsociado: 'Vigilancia Epidemiológica', responsable: 'Ing. SST Fernando Soto' }
    ]
  },
  {
    numero: 3,
    titulo: 'Protocolos Médicos y Procedimientos Especiales',
    descripcion: 'Flujogramas normativos para aptitudes, restricciones, reincorporaciones y protección de trabajadoras gestantes.',
    items: [
      { id: '3.1', nombre: 'Protocolo de Exámenes Médicos Ocupacionales (EMO)', norma: 'R.M. 312-2011 Anexo 02', cumplido: true, estado: 'CONFORME', porcentajeCumplimiento: 100, evidenciaEnERP: 'Baterías por grupo de riesgo (Ingreso, Periódico, Retiro)', moduloAsociado: 'Evaluaciones EMO', responsable: 'Dr. Alejandro Morales' },
      { id: '3.2', nombre: 'Procedimiento de Determinación de Aptitud Médica', norma: 'R.M. 312-2011 Num. 6.6', cumplido: true, estado: 'CONFORME', porcentajeCumplimiento: 100, evidenciaEnERP: 'Reglas automáticas de aptitud (Apto, Apto con Restricción, No Apto)', moduloAsociado: 'Certificados Aptitud', responsable: 'Dr. Alejandro Morales' },
      { id: '3.3', nombre: 'Procedimiento para Trabajadores con Restricciones Ocupacionales', norma: 'Ley 29783 Art. 76', cumplido: true, estado: 'CONFORME', porcentajeCumplimiento: 100, evidenciaEnERP: 'Matriz de readecuación y vigencia de restricciones', moduloAsociado: 'Certificados Aptitud', responsable: 'Dra. Carmen Alva' },
      { id: '3.4', nombre: 'Procedimiento de Reincorporación Laboral (Return to Work)', norma: 'R.M. 312-2011-MINSA', cumplido: true, estado: 'CONFORME', porcentajeCumplimiento: 100, evidenciaEnERP: 'Evaluaciones post-incapacidad > 30 días', moduloAsociado: 'Ausentismo & CIE-10', responsable: 'Dr. Alejandro Morales' },
      { id: '3.5', nombre: 'Procedimiento de Protección para Embarazo y Lactancia', norma: 'Ley 28048 / D.S. 009-2004-TR', cumplido: true, estado: 'CONFORME', porcentajeCumplimiento: 100, evidenciaEnERP: 'Identificación de trabajadoras sensibles y reubicación', moduloAsociado: 'Trabajadores & IPERC', responsable: 'Lic. Enf. Patricia Vargas' },
      { id: '3.6', nombre: 'Procedimiento para Enfermedades Ocupacionales y Accidentes', norma: 'D.S. 005-2012-TR / SAT', cumplido: true, estado: 'CONFORME', porcentajeCumplimiento: 100, evidenciaEnERP: 'Notificación SAT 24h e investigación causal', moduloAsociado: 'Accidentes & Incidentes', responsable: 'Ing. SST Fernando Soto' }
    ]
  },
  {
    numero: 4,
    titulo: 'Matrices Ocupacionales de SST',
    descripcion: 'Estructuras de datos y mapeo de puestos, factores de riesgo y exámenes complementarios.',
    items: [
      { id: '4.1', nombre: 'Matriz de Puestos de Trabajo y Perfiles Ocupacionales', norma: 'Ley 29783 Art. 57', cumplido: true, estado: 'CONFORME', porcentajeCumplimiento: 100, evidenciaEnERP: 'Asociación de GES y tareas críticas', moduloAsociado: 'Trabajadores & IPERC', responsable: 'Ing. SST Fernando Soto' },
      { id: '4.2', nombre: 'Matriz IPERC con Factores de Riesgo de Salud Ocupacional', norma: 'R.M. 050-2013-TR', cumplido: true, estado: 'CONFORME', porcentajeCumplimiento: 100, evidenciaEnERP: 'Riesgos Físicos, Químicos, Biológicos, Ergonomía, Psicosocial', moduloAsociado: 'Trabajadores & IPERC', responsable: 'Ing. SST Fernando Soto' },
      { id: '4.3', nombre: 'Matriz de Exámenes Médicos Complementarios', norma: 'R.M. 312-2011 Anexo 01', cumplido: true, estado: 'CONFORME', porcentajeCumplimiento: 100, evidenciaEnERP: 'Mapeo EKG, Espirometría, Audiometría, Lab, RX OIT', moduloAsociado: 'Evaluaciones EMO', responsable: 'Dr. Alejandro Morales' },
      { id: '4.4', nombre: 'Matriz de Control y Seguimiento de Vacunación', norma: 'D.S. 005-2012-TR', cumplido: true, estado: 'CONFORME', porcentajeCumplimiento: 100, evidenciaEnERP: 'Esquema Hepatitis B, Tétanos, Influenza y Neumococo', moduloAsociado: 'Carné de Inmunizaciones', responsable: 'Lic. Enf. Patricia Vargas' },
      { id: '4.5', nombre: 'Matriz de Restricciones Médicas y Adaptación de Puestos', norma: 'Ley 29783 Art. 76', cumplido: true, estado: 'CONFORME', porcentajeCumplimiento: 100, evidenciaEnERP: 'Seguimiento en vivo de recomendaciones con alerta de vencimiento', moduloAsociado: 'Certificados Aptitud', responsable: 'Dra. Carmen Alva' }
    ]
  },
  {
    numero: 5,
    titulo: 'Registros Obligatorios de Salud Ocupacional (Ley 29783)',
    descripcion: 'Los 8 registros obligatorios exigidos por el D.S. 005-2012-TR y R.M. 050-2013-TR ante SUNAFIL.',
    items: [
      { id: '5.1', nombre: 'Registro de Exámenes Médicos Ocupacionales (EMO)', norma: 'R.M. 050-2013-TR Formato 3', cumplido: true, estado: 'CONFORME', porcentajeCumplimiento: 100, evidenciaEnERP: 'Histórico digitalizado conservado por 20 años', moduloAsociado: 'Evaluaciones EMO', responsable: 'Dr. Alejandro Morales' },
      { id: '5.2', nombre: 'Registro de Enfermedades Ocupacionales', norma: 'R.M. 050-2013-TR Formato 1', cumplido: true, estado: 'CONFORME', porcentajeCumplimiento: 100, evidenciaEnERP: 'Módulo de notificación con archivo por 20 años', moduloAsociado: 'Accidentes & Incidentes', responsable: 'Dr. Alejandro Morales' },
      { id: '5.3', nombre: 'Registro de Accidentes de Trabajo e Incidentes Peligrosos', norma: 'R.M. 050-2013-TR Formato 2', cumplido: true, estado: 'CONFORME', porcentajeCumplimiento: 100, evidenciaEnERP: 'Ficha SAT e investigación de incidentes', moduloAsociado: 'Accidentes & Incidentes', responsable: 'Ing. SST Fernando Soto' },
      { id: '5.4', nombre: 'Registro de Ausentismo Laboral por Causas Médicas', norma: 'D.S. 005-2012-TR Art. 33', cumplido: true, estado: 'CONFORME', porcentajeCumplimiento: 100, evidenciaEnERP: 'Seguimiento CIE-10, días perdidos y subsidios EsSalud', moduloAsociado: 'Ausentismo & CIE-10', responsable: 'Dra. Carmen Alva' },
      { id: '5.5', nombre: 'Registro de Trabajadores Sensibles / Gestantes / Discapacidad', norma: 'Ley 29973 / Ley 28048', cumplido: true, estado: 'CONFORME', porcentajeCumplimiento: 100, evidenciaEnERP: 'Identificación especial y protecciones aplicadas', moduloAsociado: 'Trabajadores & IPERC', responsable: 'Lic. Enf. Patricia Vargas' },
      { id: '5.6', nombre: 'Registro de Monitoreos Biológicos y Agentes Físicos/Químicos', norma: 'R.M. 050-2013-TR Formato 4', cumplido: true, estado: 'CONFORME', porcentajeCumplimiento: 100, evidenciaEnERP: 'Resultados de laboratorio e indicadores biológicos', moduloAsociado: 'Vigilancia Epidemiológica', responsable: 'Ing. SST Fernando Soto' }
    ]
  },
  {
    numero: 6,
    titulo: 'Formatos Clínicos y Certificaciones Digitales',
    descripcion: 'Expediente clínico individual con firma del Médico Ocupacional (CMP / RNM) conforme a la Ley 29733.',
    items: [
      { id: '6.1', nombre: 'Historia Clínica Ocupacional (HCO) Unificada', norma: 'R.M. 312-2011 Anexo 02', cumplido: true, estado: 'CONFORME', porcentajeCumplimiento: 100, evidenciaEnERP: 'Formato digital estructurado con antecedentes laborales', moduloAsociado: 'Historia Clínica (HCO)', responsable: 'Dr. Alejandro Morales' },
      { id: '6.2', nombre: 'Consentimiento Informado del Trabajador', norma: 'Ley 26842 Ley General Salud', cumplido: true, estado: 'CONFORME', porcentajeCumplimiento: 100, evidenciaEnERP: 'Aceptación explícita de exámenes complementarios', moduloAsociado: 'Historia Clínica (HCO)', responsable: 'Lic. Enf. Patricia Vargas' },
      { id: '6.3', nombre: 'Certificado de Aptitud Médica Ocupacional (CAMO)', norma: 'R.M. 312-2011 Anexo 03', cumplido: true, estado: 'CONFORME', porcentajeCumplimiento: 100, evidenciaEnERP: 'Generación con QR de validación y firma médica digital', moduloAsociado: 'Certificados Aptitud', responsable: 'Dr. Alejandro Morales' },
      { id: '6.4', nombre: 'Ficha de Interconsulta y Derivación a Especialidad / EsSalud', norma: 'R.M. 312-2011-MINSA', cumplido: true, estado: 'CONFORME', porcentajeCumplimiento: 100, evidenciaEnERP: 'Generador de hoja de derivación médica', moduloAsociado: 'Historia Clínica (HCO)', responsable: 'Dr. Alejandro Morales' },
      { id: '6.5', nombre: 'Ficha de Retorno y Alta Ocupacional', norma: 'R.M. 312-2011-MINSA', cumplido: true, estado: 'CONFORME', porcentajeCumplimiento: 100, evidenciaEnERP: 'Dictamen de aptitud post-descanso médico', moduloAsociado: 'Ausentismo & CIE-10', responsable: 'Dra. Carmen Alva' }
    ]
  },
  {
    numero: 7,
    titulo: 'Vigilancia Epidemiológica y Perfil Ocupacional',
    descripcion: 'Análisis cuantitativo de salud, distribución de morbilidad y perfiles epidemiológicos por empresa.',
    items: [
      { id: '7.1', nombre: 'Perfil Epidemiológico de la Población Trabajadora', norma: 'R.M. 312-2011 Num. 6.7', cumplido: true, estado: 'CONFORME', porcentajeCumplimiento: 100, evidenciaEnERP: 'Distribución por edad, sexo, IMC, VEF1, audición y riesgos', moduloAsociado: 'Reportes MINSA / MTPE', responsable: 'Dr. Alejandro Morales' },
      { id: '7.2', nombre: 'Análisis de Morbilidad Común y Ocupacional (CIE-10)', norma: 'D.S. 005-2012-TR', cumplido: true, estado: 'CONFORME', porcentajeCumplimiento: 100, evidenciaEnERP: 'Top 10 diagnósticos clínicos más frecuentes', moduloAsociado: 'Ausentismo & CIE-10', responsable: 'Dra. Carmen Alva' },
      { id: '7.3', nombre: 'Estadísticas Mensuales y Anuales de Salud Ocupacional', norma: 'R.M. 050-2013-TR', cumplido: true, estado: 'CONFORME', porcentajeCumplimiento: 100, evidenciaEnERP: 'Índices de Frecuencia (IF), Severidad (IS) y Afectación', moduloAsociado: 'Dashboard & IGSO', responsable: 'Ing. SST Fernando Soto' }
    ]
  },
  {
    numero: 8,
    titulo: 'Capacitaciones y Sensibilización en Salud Ocupacional',
    descripcion: 'Las 4 capacitaciones mínimas obligatorias al año exigidas por la Ley 29783 Art. 35.',
    items: [
      { id: '8.1', nombre: 'Capacitaciones Obligatorias de SST (Mínimo 4 al año)', norma: 'Ley 29783 Art. 35', cumplido: true, estado: 'CONFORME', porcentajeCumplimiento: 100, evidenciaEnERP: 'Módulo de registro con 7 capacitaciones ejecutadas en 2026', moduloAsociado: 'Módulo Capacitaciones', responsable: 'Lic. Enf. Patricia Vargas' },
      { id: '8.2', nombre: 'Talleres de Ergonomía y Pausas Activas', norma: 'R.M. 375-2008-TR', cumplido: true, estado: 'CONFORME', porcentajeCumplimiento: 100, evidenciaEnERP: 'Registros de asistencia y rutinas diarias en planta', moduloAsociado: 'Módulo Capacitaciones', responsable: 'Dra. Carmen Alva' },
      { id: '8.3', nombre: 'Capacitación en Salud Mental, Estrés y Prevención de Adicciones', norma: 'Ley 29783 / Ley 30364', cumplido: true, estado: 'CONFORME', porcentajeCumplimiento: 100, evidenciaEnERP: 'Sesiones ejecutadas por Psicóloga Ocupacional', moduloAsociado: 'Módulo Capacitaciones', responsable: 'Ps. Carmen Rosa Mendoza' }
    ]
  },
  {
    numero: 9,
    titulo: 'Indicadores de Desempeño (KPIs de Salud Ocupacional)',
    descripcion: 'Medición contínua de metas, coberturas y eficacia de la gestión sanitaria.',
    items: [
      { id: '9.1', nombre: 'Cobertura de Evaluaciones EMO (% Ejecución vs Programados)', norma: 'Ley 29783 Art. 49', cumplido: true, estado: 'CONFORME', porcentajeCumplimiento: 100, evidenciaEnERP: 'KPI en vivo: 96.5% de avance anual', moduloAsociado: 'Dashboard & IGSO', responsable: 'Ing. SST Fernando Soto' },
      { id: '9.2', nombre: 'Índice de Trabajadores Aptos con Restricciones Ocupacionales', norma: 'R.M. 312-2011', cumplido: true, estado: 'CONFORME', porcentajeCumplimiento: 100, evidenciaEnERP: 'KPI en vivo: 12.4% de la población total', moduloAsociado: 'Dashboard & IGSO', responsable: 'Dra. Carmen Alva' },
      { id: '9.3', nombre: 'Tasa de Ausentismo por Causas Médicas (Días Perdidos)', norma: 'D.S. 005-2012-TR', cumplido: true, estado: 'CONFORME', porcentajeCumplimiento: 100, evidenciaEnERP: 'Mapeo dinámico EsSalud / Citas Médicas', moduloAsociado: 'Ausentismo & CIE-10', responsable: 'Dra. Carmen Alva' },
      { id: '9.4', nombre: 'Cobertura de Inmunizaciones Ocupacionales', norma: 'Norma Técnica MINSA', cumplido: true, estado: 'CONFORME', porcentajeCumplimiento: 100, evidenciaEnERP: 'KPI en vivo: 98.2% con esquema completo', moduloAsociado: 'Carné de Inmunizaciones', responsable: 'Lic. Enf. Patricia Vargas' }
    ]
  },
  {
    numero: 10,
    titulo: 'Informes Periódicos y Entregables MINSA / SUNAFIL',
    descripcion: 'Reportes ejecutivos requeridos por la Autoridad de Salud y Fiscalización Laboral.',
    items: [
      { id: '10.1', nombre: 'Informe Mensual / Trimestral de Gestión de Salud Ocupacional', norma: 'D.S. 005-2012-TR', cumplido: true, estado: 'CONFORME', porcentajeCumplimiento: 100, evidenciaEnERP: 'Exportador PDF/Excel consolidado con tableros', moduloAsociado: 'Reportes MINSA / MTPE', responsable: 'Dr. Alejandro Morales' },
      { id: '10.2', nombre: 'Informe Anual de Vigilancia Sanitaria para la Alta Dirección', norma: 'R.M. 312-2011 Num. 6.8', cumplido: true, estado: 'CONFORME', porcentajeCumplimiento: 100, evidenciaEnERP: 'Generador automático de Informe Ejecutivo MINSA 2026', moduloAsociado: 'Reportes MINSA / MTPE', responsable: 'Dr. Alejandro Morales' }
    ]
  }
];

export const GuiaMaestraModule: React.FC<GuiaMaestraModuleProps> = ({
  empresas,
  selectedEmpresaId
}) => {
  const [pilares, setPilares] = useState<PillarCategory[]>(INITIAL_PILARES);
  const [expandedPillar, setExpandedPillar] = useState<number | null>(1);
  const [activeTab, setActiveTab] = useState<'matriz' | 'capacitaciones' | 'cronograma'>('matriz');

  // Item Editing State
  const [editingItemInfo, setEditingItemInfo] = useState<{
    pilarNumero: number;
    item: PillarItem;
  } | null>(null);

  // PDF Preview State
  const [previewPdf, setPreviewPdf] = useState<EvidenciaPdfGuia | null>(null);

  // Initial list of trainings (Pilar 8)
  const [capacitaciones, setCapacitaciones] = useState<Capacitacion[]>([
    { id: 'cap-1', tema: 'Inducción General en Salud y Seguridad Ocupacional', fecha: '2026-01-15', asistentes: 142, horas: 2, expositor: 'Dr. Alejandro Morales', estado: 'COMPLETADO' },
    { id: 'cap-2', tema: 'Ergonomía, Manipulación Manual de Cargas y Pausas Activas', fecha: '2026-02-20', asistentes: 98, horas: 1.5, expositor: 'Dra. Carmen Alva', estado: 'COMPLETADO' },
    { id: 'cap-3', tema: 'Programa de Conservación Auditiva y Uso Correcto de EPP', fecha: '2026-03-10', asistentes: 85, horas: 2, expositor: 'Ing. SST Fernando Soto', estado: 'COMPLETADO' },
    { id: 'cap-4', tema: 'Prevención de Riesgos Psicosociales, Estrés Laboral y Burnout', fecha: '2026-04-18', asistentes: 110, horas: 2, expositor: 'Ps. Carmen Rosa Mendoza', estado: 'COMPLETADO' },
    { id: 'cap-5', tema: 'Estilos de Vida Saludable, Nutrición y Prevención del Síndrome Metabólico', fecha: '2026-05-22', asistentes: 120, horas: 1.5, expositor: 'Nut. Sofía Paredes', estado: 'COMPLETADO' },
    { id: 'cap-6', tema: 'Prevención de Fatiga y Somnolencia en Operaciones de Alto Riesgo', fecha: '2026-06-14', asistentes: 64, horas: 2, expositor: 'Dr. Alejandro Morales', estado: 'COMPLETADO' },
    { id: 'cap-7', tema: 'Primeros Auxilios, RCP y Manejo de Emergencias Médicas en Planta', fecha: '2026-07-05', asistentes: 45, horas: 4, expositor: 'Lic. Enf. Patricia Vargas', estado: 'COMPLETADO' },
    { id: 'cap-8', tema: 'Prevención del Alcoholismo, Drogadicción y Tabaquismo en el Trabajo', fecha: '2026-08-12', asistentes: 0, horas: 2, expositor: 'Ps. Carmen Rosa Mendoza', estado: 'PROGRAMADO' },
    { id: 'cap-9', tema: 'Protección contra Radiación Solar UV y Estrés Térmico en Campo', fecha: '2026-09-10', asistentes: 0, horas: 1.5, expositor: 'Dr. Alejandro Morales', estado: 'PROGRAMADO' }
  ]);

  const [newCapModal, setNewCapModal] = useState(false);
  const [newCapData, setNewCapData] = useState<Partial<Capacitacion>>({
    tema: '',
    fecha: new Date().toISOString().split('T')[0],
    asistentes: 0,
    horas: 2,
    expositor: 'Dr. Alejandro Morales (CMP 45120)',
    estado: 'COMPLETADO'
  });

  // Global calculations
  const totalItems = pilares.reduce((acc, p) => acc + p.items.length, 0);
  const totalCumplidos = pilares.reduce((acc, p) => acc + p.items.filter(i => i.cumplido || i.estado === 'CONFORME').length, 0);
  const porcentajeGlobal = Math.round((totalCumplidos / totalItems) * 100);

  const handleCreateCapacitacion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCapData.tema) return;

    const newCap: Capacitacion = {
      id: `cap-${Date.now()}`,
      tema: newCapData.tema || 'Nueva Capacitación',
      fecha: newCapData.fecha || new Date().toISOString().split('T')[0],
      asistentes: Number(newCapData.asistentes) || 0,
      horas: Number(newCapData.horas) || 2,
      expositor: newCapData.expositor || 'Dr. Alejandro Morales (CMP 45120)',
      estado: (newCapData.estado as any) || 'COMPLETADO',
      listaAsistentesPdf: newCapData.listaAsistentesPdf
    };

    setCapacitaciones([newCap, ...capacitaciones]);
    setNewCapModal(false);
    setNewCapData({
      tema: '',
      fecha: new Date().toISOString().split('T')[0],
      asistentes: 0,
      horas: 2,
      expositor: 'Dr. Alejandro Morales (CMP 45120)',
      estado: 'COMPLETADO',
      listaAsistentesPdf: undefined
    });
  };

  // Update a single item within pilares
  const handleSaveItemEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItemInfo) return;

    const { pilarNumero, item } = editingItemInfo;

    // Derived values
    const isConforme = item.estado === 'CONFORME' || item.estado === 'NO_APLICA';
    const isCumplido = isConforme ? true : item.cumplido;

    setPilares(prev => prev.map(p => {
      if (p.numero !== pilarNumero) return p;
      return {
        ...p,
        items: p.items.map(it => it.id === item.id ? { ...item, cumplido: isCumplido } : it)
      };
    }));

    setEditingItemInfo(null);
  };

  // PDF File Upload Handler
  const handlePdfUpload = (
    file: File,
    onSuccess: (evidenciaPdf: EvidenciaPdfGuia) => void
  ) => {
    if (file.type !== 'application/pdf') {
      alert('Error: Debe seleccionar un archivo en formato PDF.');
      return;
    }

    if (file.size > 15 * 1024 * 1024) { // 15MB limit
      alert('El archivo PDF excede el tamaño máximo permitido (15 MB).');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      const evidenciaPdf: EvidenciaPdfGuia = {
        nombreArchivo: file.name,
        dataUrl,
        tamanioBytes: file.size,
        fechaSubida: new Date().toISOString().split('T')[0]
      };
      onSuccess(evidenciaPdf);
    };
    reader.readAsDataURL(file);
  };

  const getStatusBadge = (item: PillarItem) => {
    const estado = item.estado || (item.cumplido ? 'CONFORME' : 'PENDIENTE');
    switch (estado) {
      case 'CONFORME':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <CheckCircle2 className="w-3 h-3" />
            Conforme
          </span>
        );
      case 'EN_PROCESO':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Clock className="w-3 h-3" />
            En Proceso ({item.porcentajeCumplimiento ?? 50}%)
          </span>
        );
      case 'OBSERVADO':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20">
            <AlertTriangle className="w-3 h-3" />
            Observado
          </span>
        );
      case 'NO_APLICA':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-slate-800 text-slate-400 border border-slate-700">
            No Aplica
          </span>
        );
      case 'PENDIENTE':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-red-500/10 text-red-400 border border-red-500/20">
            <AlertTriangle className="w-3 h-3" />
            Pendiente
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* HEADER BANNER */}
      <div className="bg-slate-950 p-6 rounded-xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span className="px-2.5 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-semibold tracking-wider rounded-full uppercase">
              Auditoría SUNAFIL / MINSA 2026
            </span>
            <span className="px-2.5 py-0.5 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-[10px] font-semibold tracking-wider rounded-full uppercase">
              Ley 29783 & R.M. 312-2011
            </span>
          </div>
          <h2 className="text-xl font-bold text-white font-sans flex items-center gap-2.5">
            <ShieldCheck className="w-6 h-6 text-indigo-400" />
            Matriz de Cumplimiento de la Guía Maestra (10 Pilares)
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-3xl">
            Estructura maestra unificada para auditoría y gestión de Salud Ocupacional. Edite los avances, estado legal y adjunte evidencias documentarias en PDF por cada ítem.
          </p>
        </div>

        {/* Global Compliance Badge */}
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex items-center gap-4 shrink-0">
          <div className="relative w-14 h-14 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-slate-800"
                strokeWidth="3.5"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="text-emerald-400"
                strokeDasharray={`${porcentajeGlobal}, 100`}
                strokeWidth="3.5"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <span className="absolute text-xs font-bold text-white">{porcentajeGlobal}%</span>
          </div>

          <div>
            <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Cumplimiento Legal</div>
            <div className="text-sm font-bold text-emerald-400 mt-0.5">{totalCumplidos} de {totalItems} requisitos</div>
            <div className="text-[10px] text-slate-400 mt-0.5">Conforme a Inspección SUNAFIL</div>
          </div>
        </div>
      </div>

      {/* NAVIGATION TABS */}
      <div className="bg-slate-950 p-2 rounded-xl border border-slate-800 flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-1 flex-wrap">
          <button
            onClick={() => setActiveTab('matriz')}
            className={`px-4 py-2 rounded-lg text-xs font-medium transition-colors flex items-center gap-2 ${
              activeTab === 'matriz'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <CheckSquare className="w-4 h-4" />
            <span>Matriz 10 Pilares SUNAFIL</span>
          </button>

          <button
            onClick={() => setActiveTab('cronograma')}
            className={`px-4 py-2 rounded-lg text-xs font-medium transition-colors flex items-center gap-2 ${
              activeTab === 'cronograma'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Calendar className="w-4 h-4 text-emerald-400" />
            <span>Cronograma Anual de Actividades (Item 1.5)</span>
          </button>

          <button
            onClick={() => setActiveTab('capacitaciones')}
            className={`px-4 py-2 rounded-lg text-xs font-medium transition-colors flex items-center gap-2 ${
              activeTab === 'capacitaciones'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            <span>Capacitaciones SST ({capacitaciones.length})</span>
          </button>
        </div>

        <button
          onClick={() => window.print()}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 rounded-lg text-xs font-medium transition-colors"
        >
          <Download className="w-3.5 h-3.5 text-indigo-400" />
          <span>Exportar Certificado SUNAFIL</span>
        </button>
      </div>

      {/* TAB 1: MATRIZ DE LOS 10 PILARES ACCORDION */}
      {activeTab === 'matriz' && (
        <div className="space-y-4">
          {pilares.map((pilar) => {
            const isExpanded = expandedPillar === pilar.numero;
            const cumplidosPilar = pilar.items.filter(i => i.cumplido || i.estado === 'CONFORME').length;
            const pctPilar = Math.round((cumplidosPilar / pilar.items.length) * 100);

            return (
              <div
                key={pilar.numero}
                className="bg-slate-950 rounded-xl border border-slate-800 overflow-hidden shadow-sm transition-colors"
              >
                {/* Pillar Accordion Header */}
                <button
                  onClick={() => setExpandedPillar(isExpanded ? null : pilar.numero)}
                  className="w-full p-4 flex items-center justify-between text-left hover:bg-slate-900/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-indigo-600/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-sm shrink-0">
                      P{pilar.numero}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-bold text-white font-sans">{pilar.titulo}</h3>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          {cumplidosPilar}/{pilar.items.length} Conforme ({pctPilar}%)
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">{pilar.descripcion}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="hidden sm:block w-32 h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                      <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${pctPilar}%` }}></div>
                    </div>
                    {isExpanded ? (
                      <ChevronDown className="w-5 h-5 text-slate-400" />
                    ) : (
                      <ChevronRight className="w-5 h-5 text-slate-400" />
                    )}
                  </div>
                </button>

                {/* Pillar Accordion Content */}
                {isExpanded && (
                  <div className="p-4 border-t border-slate-800 bg-slate-900/40 space-y-3 text-xs">
                    <div className="overflow-x-auto rounded-lg border border-slate-800">
                      <table className="w-full text-left border-collapse">
                        <thead className="bg-slate-900 text-[10px] text-slate-400 uppercase tracking-wider">
                          <tr>
                            <th className="p-3 w-16">Item</th>
                            <th className="p-3">Requisito / Registro Legal</th>
                            <th className="p-3">Norma Base</th>
                            <th className="p-3">Evidencia & Responsable</th>
                            <th className="p-3">Sustento PDF</th>
                            <th className="p-3">Estado SUNAFIL</th>
                            <th className="p-3 text-right">Acción</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800 text-slate-300">
                          {pilar.items.map((item) => (
                            <tr key={item.id} className="hover:bg-slate-900/80">
                              <td className="p-3 font-mono font-semibold text-indigo-400">{item.id}</td>
                              <td className="p-3 font-medium text-slate-100 max-w-xs">
                                <div>{item.nombre}</div>
                                <span className="text-[10px] text-slate-500 font-mono">Módulo: {item.moduloAsociado}</span>
                              </td>
                              <td className="p-3 text-slate-400 text-[11px] whitespace-nowrap">{item.norma}</td>
                              <td className="p-3 text-slate-200 text-[11px] max-w-xs">
                                <div className="font-semibold text-emerald-400">{item.evidenciaEnERP}</div>
                                {item.responsable && (
                                  <div className="text-[10px] text-slate-400 mt-0.5">Resp: {item.responsable}</div>
                                )}
                              </td>
                              <td className="p-3">
                                {item.evidenciaPdf ? (
                                  <div className="flex items-center gap-1.5">
                                    <button
                                      type="button"
                                      onClick={() => setPreviewPdf(item.evidenciaPdf!)}
                                      className="inline-flex items-center gap-1 px-2.5 py-1 bg-red-500/10 hover:bg-red-500/20 text-red-300 border border-red-500/30 rounded text-[11px] font-semibold transition-all"
                                      title="Ver Evidencia PDF"
                                    >
                                      <FileText className="w-3.5 h-3.5 text-red-400" />
                                      <span className="truncate max-w-[100px]">{item.evidenciaPdf.nombreArchivo}</span>
                                      <Eye className="w-3 h-3 text-red-400 ml-0.5" />
                                    </button>
                                  </div>
                                ) : (
                                  <label className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 rounded text-[11px] font-medium cursor-pointer transition-all">
                                    <Upload className="w-3 h-3 text-indigo-400" />
                                    <span>Subir PDF</span>
                                    <input
                                      type="file"
                                      accept="application/pdf"
                                      className="hidden"
                                      onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) {
                                          handlePdfUpload(file, (pdfData) => {
                                            setPilares(prev => prev.map(p => {
                                              if (p.numero !== pilar.numero) return p;
                                              return {
                                                ...p,
                                                items: p.items.map(it => it.id === item.id ? { ...it, evidenciaPdf: pdfData } : it)
                                              };
                                            }));
                                          });
                                        }
                                      }}
                                    />
                                  </label>
                                )}
                              </td>
                              <td className="p-3">
                                <select
                                  value={item.estado || (item.cumplido ? 'CONFORME' : 'PENDIENTE')}
                                  onChange={(e) => {
                                    const nuevoEstado = e.target.value as any;
                                    const esCumplido = nuevoEstado === 'CONFORME' || nuevoEstado === 'NO_APLICA';
                                    const nuevoPct = nuevoEstado === 'CONFORME' ? 100 : nuevoEstado === 'EN_PROCESO' ? 50 : nuevoEstado === 'OBSERVADO' ? 25 : 0;
                                    
                                    setPilares(prev => prev.map(p => {
                                      if (p.numero !== pilar.numero) return p;
                                      return {
                                        ...p,
                                        items: p.items.map(it => it.id === item.id ? {
                                          ...it,
                                          estado: nuevoEstado,
                                          cumplido: esCumplido,
                                          porcentajeCumplimiento: nuevoPct
                                        } : it)
                                      };
                                    }));
                                  }}
                                  className={`px-2.5 py-1 rounded-full text-[10px] font-bold border cursor-pointer focus:outline-none transition-all ${
                                    (item.estado || (item.cumplido ? 'CONFORME' : 'PENDIENTE')) === 'CONFORME'
                                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20'
                                      : (item.estado || (item.cumplido ? 'CONFORME' : 'PENDIENTE')) === 'EN_PROCESO'
                                      ? 'bg-amber-500/10 text-amber-400 border-amber-500/30 hover:bg-amber-500/20'
                                      : (item.estado || (item.cumplido ? 'CONFORME' : 'PENDIENTE')) === 'OBSERVADO'
                                      ? 'bg-rose-500/10 text-rose-400 border-rose-500/30 hover:bg-rose-500/20'
                                      : (item.estado || (item.cumplido ? 'CONFORME' : 'PENDIENTE')) === 'NO_APLICA'
                                      ? 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700'
                                      : 'bg-red-500/10 text-red-400 border-red-500/30 hover:bg-red-500/20'
                                  }`}
                                  title="Cambiar Estado SUNAFIL directamente"
                                >
                                  <option value="CONFORME" className="bg-slate-900 text-emerald-400 font-semibold">✓ CONFORME</option>
                                  <option value="EN_PROCESO" className="bg-slate-900 text-amber-400 font-semibold">⏳ EN PROCESO</option>
                                  <option value="OBSERVADO" className="bg-slate-900 text-rose-400 font-semibold">⚠ OBSERVADO</option>
                                  <option value="PENDIENTE" className="bg-slate-900 text-red-400 font-semibold">❌ PENDIENTE</option>
                                  <option value="NO_APLICA" className="bg-slate-900 text-slate-400 font-semibold">➖ NO APLICA</option>
                                </select>
                              </td>
                              <td className="p-3 text-right">
                                <div className="flex items-center justify-end gap-1.5">
                                  {(item.id === '1.5' || item.id === '8.1') && (
                                    <button
                                      type="button"
                                      onClick={() => setActiveTab('cronograma')}
                                      className="px-2.5 py-1.5 bg-emerald-600/20 hover:bg-emerald-600/40 text-emerald-300 border border-emerald-500/30 rounded-lg text-xs font-semibold inline-flex items-center gap-1 transition-all"
                                      title="Abrir Calendario Interactivo y Reprogramar Fechas"
                                    >
                                      <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                                      <span>Calendario</span>
                                    </button>
                                  )}

                                  <button
                                    type="button"
                                    onClick={() => setEditingItemInfo({
                                      pilarNumero: pilar.numero,
                                      item: JSON.parse(JSON.stringify(item))
                                    })}
                                    className="px-2.5 py-1.5 bg-indigo-600/20 hover:bg-indigo-600/40 text-indigo-300 border border-indigo-500/30 rounded-lg text-xs font-semibold inline-flex items-center gap-1 transition-all"
                                    title="Editar estado o subir evidencia"
                                  >
                                    <Edit3 className="w-3.5 h-3.5 text-indigo-400" />
                                    Editar
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* TAB 2: CAPACITACIONES OCUPACIONALES (PILAR 8) */}
      {activeTab === 'capacitaciones' && (
        <div className="space-y-5">
          <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-indigo-400" />
                Pilar 8: Registro Obligatorio de Capacitaciones de Salud Ocupacional
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Exigencia legal: Mínimo 4 capacitaciones anuales en materia de SST (Ley 29783 Art. 35).
              </p>
            </div>

            <button
              onClick={() => setNewCapModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs rounded-lg shadow-sm transition-colors shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Registrar Capacitación</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {capacitaciones.map((cap) => (
              <div key={cap.id} className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-3 flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between gap-2 pb-2 border-b border-slate-800">
                    <span className="text-[10px] font-mono font-semibold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
                      Ley 29783 Art. 35
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                        cap.estado === 'COMPLETADO'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                      }`}
                    >
                      {cap.estado}
                    </span>
                  </div>

                  <h4 className="text-sm font-semibold text-slate-100 mt-2.5 leading-snug">
                    {cap.tema}
                  </h4>

                  <div className="space-y-1.5 mt-3 text-xs text-slate-400">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                      <span>Fecha: <strong className="text-slate-200">{cap.fecha}</strong> ({cap.horas} hrs)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                      <span>Asistentes registrados: <strong className="text-emerald-400">{cap.asistentes} trabajadores</strong></span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Award className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                      <span>Expositor: <strong className="text-slate-200">{cap.expositor}</strong></span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span className="text-[10px] text-slate-500">Formato SUNAFIL R.M. 050-2013-TR</span>
                    <span className="font-semibold text-slate-300">Lista de Asistencia PDF</span>
                  </div>

                  {cap.listaAsistentesPdf ? (
                    <div className="flex items-center justify-between gap-1.5 p-2 bg-slate-900 rounded-lg border border-slate-800">
                      <div className="flex items-center gap-1.5 truncate">
                        <FileText className="w-3.5 h-3.5 text-red-400 shrink-0" />
                        <span className="text-slate-200 font-medium truncate text-[11px]" title={cap.listaAsistentesPdf.nombreArchivo}>
                          {cap.listaAsistentesPdf.nombreArchivo}
                        </span>
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          type="button"
                          onClick={() => setPreviewPdf(cap.listaAsistentesPdf!)}
                          className="px-2 py-1 bg-indigo-600/20 hover:bg-indigo-600/40 text-indigo-300 rounded border border-indigo-500/30 transition-all flex items-center gap-1 text-[10px] font-semibold"
                          title="Previsualizar Lista en PDF"
                        >
                          <Eye className="w-3 h-3 text-indigo-400" /> Ver
                        </button>

                        <a
                          href={cap.listaAsistentesPdf.dataUrl}
                          download={cap.listaAsistentesPdf.nombreArchivo}
                          className="px-2 py-1 bg-emerald-600/20 hover:bg-emerald-600/40 text-emerald-300 rounded border border-emerald-500/30 transition-all flex items-center gap-1 text-[10px] font-semibold"
                          title="Descargar PDF"
                        >
                          <Download className="w-3 h-3 text-emerald-400" /> PDF
                        </a>

                        <button
                          type="button"
                          onClick={() => {
                            setCapacitaciones(prev => prev.map(c => c.id === cap.id ? { ...c, listaAsistentesPdf: undefined } : c));
                          }}
                          className="p-1 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded border border-rose-500/20 transition-all"
                          title="Quitar PDF"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <label className="w-full flex items-center justify-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-indigo-300 border border-slate-800 hover:border-indigo-500/50 rounded-lg text-xs font-semibold cursor-pointer transition-all">
                      <Upload className="w-3.5 h-3.5 text-indigo-400" />
                      <span>Subir Lista Asistentes (PDF)</span>
                      <input
                        type="file"
                        accept="application/pdf"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            handlePdfUpload(file, (pdfData) => {
                              setCapacitaciones(prev => prev.map(c => c.id === cap.id ? { ...c, listaAsistentesPdf: pdfData } : c));
                            });
                          }
                        }}
                      />
                    </label>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: CRONOGRAMA ANUAL DE ACTIVIDADES E INTERVENCIONES (ITEM 1.5) */}
      {activeTab === 'cronograma' && (
        <CronogramaActividadesModule
          empresas={empresas}
          selectedEmpresaId={selectedEmpresaId}
          onNavigateToCapacitaciones={() => setActiveTab('capacitaciones')}
        />
      )}

      {/* MODAL EDIT ITEM / SUBIR EVIDENCIA PDF */}
      {editingItemInfo && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-xl p-6 shadow-2xl text-slate-100 my-8 space-y-5">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-indigo-500/10 text-indigo-400 rounded-xl border border-indigo-500/20">
                  <Edit3 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white font-display">
                    Editar Requisito {editingItemInfo.item.id}
                  </h3>
                  <p className="text-xs text-slate-400">
                    {editingItemInfo.item.nombre}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setEditingItemInfo(null)}
                className="p-1.5 bg-slate-800 text-slate-400 hover:text-white rounded-lg border border-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveItemEdit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Estado de Cumplimiento:
                  </label>
                  <select
                    value={editingItemInfo.item.estado || (editingItemInfo.item.cumplido ? 'CONFORME' : 'PENDIENTE')}
                    onChange={(e) => {
                      const nuevoEstado = e.target.value as any;
                      const esCumplido = nuevoEstado === 'CONFORME' || nuevoEstado === 'NO_APLICA';
                      setEditingItemInfo({
                        ...editingItemInfo,
                        item: {
                          ...editingItemInfo.item,
                          estado: nuevoEstado,
                          cumplido: esCumplido,
                          porcentajeCumplimiento: nuevoEstado === 'CONFORME' ? 100 : nuevoEstado === 'EN_PROCESO' ? 50 : nuevoEstado === 'OBSERVADO' ? 25 : 0
                        }
                      });
                    }}
                    className="w-full bg-slate-800 border border-indigo-500/50 rounded-lg p-2 text-white font-semibold focus:outline-none focus:border-indigo-400"
                  >
                    <option value="CONFORME">CONFORME (100% Cumplido)</option>
                    <option value="EN_PROCESO">EN PROCESO (Avance)</option>
                    <option value="OBSERVADO">OBSERVADO (Auditoría)</option>
                    <option value="PENDIENTE">PENDIENTE (No iniciado)</option>
                    <option value="NO_APLICA">NO APLICA</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Porcentaje de Avance Real (%):
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="range"
                      min="0"
                      max="100"
                      step="5"
                      value={editingItemInfo.item.porcentajeCumplimiento ?? (editingItemInfo.item.cumplido ? 100 : 0)}
                      onChange={(e) => {
                        const val = parseInt(e.target.value);
                        setEditingItemInfo({
                          ...editingItemInfo,
                          item: {
                            ...editingItemInfo.item,
                            porcentajeCumplimiento: val,
                            cumplido: val === 100
                          }
                        });
                      }}
                      className="w-full accent-indigo-500"
                    />
                    <span className="font-mono font-bold text-indigo-400 w-12 text-right">
                      {editingItemInfo.item.porcentajeCumplimiento ?? (editingItemInfo.item.cumplido ? 100 : 0)}%
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">
                    Responsable de la Ejecución:
                  </label>
                  <input
                    type="text"
                    value={editingItemInfo.item.responsable || ''}
                    onChange={(e) => setEditingItemInfo({
                      ...editingItemInfo,
                      item: { ...editingItemInfo.item, responsable: e.target.value }
                    })}
                    placeholder="Ej. Dr. Alejandro Morales / Ing. SST"
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">
                    Fecha de Cumplimiento / Revisión:
                  </label>
                  <input
                    type="date"
                    value={editingItemInfo.item.fechaCumplimiento || ''}
                    onChange={(e) => setEditingItemInfo({
                      ...editingItemInfo,
                      item: { ...editingItemInfo.item, fechaCumplimiento: e.target.value }
                    })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">
                  Detalles de la Evidencia / Observaciones en ERP:
                </label>
                <textarea
                  rows={3}
                  value={editingItemInfo.item.evidenciaEnERP}
                  onChange={(e) => setEditingItemInfo({
                    ...editingItemInfo,
                    item: { ...editingItemInfo.item, evidenciaEnERP: e.target.value }
                  })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white focus:outline-none focus:border-indigo-500 resize-none"
                  placeholder="Detalle el documento, acta o registro que sustenta este ítem..."
                />
              </div>

              {/* PDF Evidence Section */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-slate-200 flex items-center gap-1.5">
                    <Paperclip className="w-4 h-4 text-red-400" />
                    Adjuntar Evidencia en Formato PDF (SUNAFIL / MINSA)
                  </label>
                  {editingItemInfo.item.evidenciaPdf && (
                    <span className="text-[10px] text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                      Archivo Guardado
                    </span>
                  )}
                </div>

                {editingItemInfo.item.evidenciaPdf ? (
                  <div className="flex items-center justify-between bg-slate-900 p-3 rounded-lg border border-slate-800">
                    <div className="flex items-center gap-2.5 truncate">
                      <div className="p-2 bg-red-500/10 text-red-400 rounded-lg border border-red-500/20 shrink-0">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div className="truncate text-xs">
                        <div className="font-semibold text-slate-200 truncate">{editingItemInfo.item.evidenciaPdf.nombreArchivo}</div>
                        <div className="text-[10px] text-slate-400">
                          {editingItemInfo.item.evidenciaPdf.tamanioBytes 
                            ? `${(editingItemInfo.item.evidenciaPdf.tamanioBytes / 1024).toFixed(1)} KB` 
                            : 'PDF Document'} - Subido: {editingItemInfo.item.evidenciaPdf.fechaSubida}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        type="button"
                        onClick={() => setPreviewPdf(editingItemInfo.item.evidenciaPdf!)}
                        className="p-1.5 bg-slate-800 text-indigo-400 hover:text-white rounded-lg border border-slate-700"
                        title="Visualizar PDF"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingItemInfo({
                          ...editingItemInfo,
                          item: { ...editingItemInfo.item, evidenciaPdf: undefined }
                        })}
                        className="p-1.5 bg-slate-800 text-rose-400 hover:text-rose-300 rounded-lg border border-slate-700"
                        title="Eliminar PDF"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center p-5 border-2 border-dashed border-slate-800 hover:border-indigo-500/50 rounded-xl bg-slate-900/50 cursor-pointer transition-all group">
                    <Upload className="w-8 h-8 text-slate-500 group-hover:text-indigo-400 transition-colors mb-1.5" />
                    <span className="text-xs font-semibold text-slate-300 group-hover:text-indigo-300">
                      Haga clic para seleccionar o arrastre un documento PDF
                    </span>
                    <span className="text-[10px] text-slate-500 mt-0.5">
                      Soporta Actas, Planes, Informes o Registros firmados (Máx 15MB)
                    </span>
                    <input
                      type="file"
                      accept="application/pdf"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          handlePdfUpload(file, (pdfData) => {
                            setEditingItemInfo({
                              ...editingItemInfo,
                              item: { ...editingItemInfo.item, evidenciaPdf: pdfData }
                            });
                          });
                        }
                      }}
                    />
                  </label>
                )}
              </div>

              <div className="pt-4 border-t border-slate-800 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingItemInfo(null)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg font-medium hover:bg-slate-700 transition-all"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-bold flex items-center gap-2 shadow-lg shadow-indigo-900/40 transition-all"
                >
                  <Save className="w-4 h-4" /> Guardar Cambios en Guía Maestra
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PDF PREVIEW MODAL */}
      {previewPdf && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-4xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-red-500/10 text-red-400 rounded-lg border border-red-500/20">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white font-sans">{previewPdf.nombreArchivo}</h3>
                  <p className="text-[10px] text-slate-400">Vista Previa del Sustento Documentario Ocupacional (PDF)</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={previewPdf.dataUrl}
                  download={previewPdf.nombreArchivo}
                  className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-semibold text-xs inline-flex items-center gap-1.5 transition-all"
                >
                  <Download className="w-3.5 h-3.5" /> Descargar PDF
                </a>
                <button
                  onClick={() => setPreviewPdf(null)}
                  className="p-1.5 bg-slate-800 text-slate-400 hover:text-white rounded-lg border border-slate-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="bg-slate-950 rounded-xl p-2 border border-slate-800 overflow-hidden">
              <iframe
                src={previewPdf.dataUrl}
                title={previewPdf.nombreArchivo}
                className="w-full h-[70vh] rounded-lg bg-white"
              />
            </div>
          </div>
        </div>
      )}

      {/* MODAL CREAR CAPACITACION */}
      {newCapModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-950 border border-slate-800 rounded-xl w-full max-w-lg p-6 space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-indigo-400" />
              Registrar Capacitación en Salud Ocupacional
            </h3>

            <form onSubmit={handleCreateCapacitacion} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-400 font-medium mb-1">Tema / Título de la Capacitación *</label>
                <input
                  type="text"
                  required
                  value={newCapData.tema || ''}
                  onChange={(e) => setNewCapData({ ...newCapData, tema: e.target.value })}
                  placeholder="Ej. Prevención del Riesgo Disergonómico y Pausas Activas"
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-medium mb-1">Fecha de Ejecución</label>
                  <input
                    type="date"
                    value={newCapData.fecha || ''}
                    onChange={(e) => setNewCapData({ ...newCapData, fecha: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-medium mb-1">Duración (Horas)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={newCapData.horas || 2}
                    onChange={(e) => setNewCapData({ ...newCapData, horas: parseFloat(e.target.value) || 2 })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-medium mb-1">N° Asistentes</label>
                  <input
                    type="number"
                    value={newCapData.asistentes || 0}
                    onChange={(e) => setNewCapData({ ...newCapData, asistentes: parseInt(e.target.value) || 0 })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-medium mb-1">Estado</label>
                  <select
                    value={newCapData.estado || 'COMPLETADO'}
                    onChange={(e) => setNewCapData({ ...newCapData, estado: e.target.value as any })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-indigo-500"
                  >
                    <option value="COMPLETADO">Completado</option>
                    <option value="PROGRAMADO">Programado</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Expositor / Facilitador</label>
                <input
                  type="text"
                  value={newCapData.expositor || ''}
                  onChange={(e) => setNewCapData({ ...newCapData, expositor: e.target.value })}
                  placeholder="Dr. Nombre Apellido (CMP / CEP)"
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Lista de Asistentes Firmada (PDF)</label>
                {newCapData.listaAsistentesPdf ? (
                  <div className="flex items-center justify-between p-2.5 bg-slate-900 border border-emerald-500/30 rounded-lg">
                    <div className="flex items-center gap-2 truncate">
                      <FileText className="w-4 h-4 text-red-400 shrink-0" />
                      <span className="text-slate-200 font-medium truncate">{newCapData.listaAsistentesPdf.nombreArchivo}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setNewCapData({ ...newCapData, listaAsistentesPdf: undefined })}
                      className="p-1 text-slate-400 hover:text-red-400"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <label className="flex items-center justify-center gap-2 p-3 bg-slate-900 border border-dashed border-slate-700 hover:border-indigo-500 rounded-lg text-slate-300 cursor-pointer transition-colors">
                    <Upload className="w-4 h-4 text-indigo-400" />
                    <span>Adjuntar Lista de Asistencia en PDF</span>
                    <input
                      type="file"
                      accept="application/pdf"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          handlePdfUpload(file, (pdfData) => {
                            setNewCapData({ ...newCapData, listaAsistentesPdf: pdfData });
                          });
                        }
                      }}
                    />
                  </label>
                )}
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setNewCapModal(false)}
                  className="px-4 py-2 bg-slate-900 text-slate-300 rounded-lg font-medium border border-slate-800"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-medium shadow-sm"
                >
                  Guardar Capacitación
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
