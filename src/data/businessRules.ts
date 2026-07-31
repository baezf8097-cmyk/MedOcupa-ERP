import { ReglaNegocio } from '../types/erp';

export const REGLAS_DE_NEGOCIO: ReglaNegocio[] = [
  // MÓDULO EMPRESAS Y SEDES
  {
    codigo: 'RN-EMP-001',
    modulo: 'Empresas Clientes',
    nombre: 'Validación de RUC Peruano y SCTR',
    descripcion: 'Toda empresa registrada debe poseer un RUC válido de 11 dígitos iniciado en 10, 15, 17 o 20, con dígito verificador correcto y asignación de tasa de riesgo SCTR según Anexo 5 del D.S. 009-97-SA.',
    condicion: 'Registro o actualización de empresa cliente.',
    resultado: 'Si el RUC no es válido o no tiene actividad económica clasificada, el sistema bloquea el alta.',
    prioridad: 'CRITICA',
    dependencias: ['Módulo SUNAT / RUC validation'],
    baseLegalPeruana: 'Ley N° 26790 / D.S. 009-97-SA (SCTR) y Ley 29783'
  },
  {
    codigo: 'RN-EMP-002',
    modulo: 'Empresas Clientes',
    nombre: 'Sedes y Matrices de Riesgo IPERC por Sede',
    descripcion: 'Cada sede operativamente independiente debe tener su propia matriz de Identificación de Peligros, Evaluación de Riesgos y Medidas de Control (IPERC) y responsable SST designado.',
    condicion: 'Creación de sede empresarial.',
    resultado: 'Se hereda el RUC pero se segregan trabajadores, riesgos específicos y protocolos EMO.',
    prioridad: 'ALTA',
    dependencias: ['RN-EMP-001'],
    baseLegalPeruana: 'R.M. 050-2013-TR / D.S. 005-2012-TR'
  },

  // MÓDULO TRABAJADORES Y PUESTOS DE TRABAJO
  {
    codigo: 'RN-TRAB-001',
    modulo: 'Trabajadores',
    nombre: 'Identificación Única y Mapeo de Riesgos por Puesto',
    descripcion: 'El documento (DNI de 8 dígitos o CE de 9) es único por trabajador. Todo trabajador debe tener obligatoriamente asignado un puesto con sus factores de riesgo físicos, químicos, biológicos, ergonómicos y psicosociales.',
    condicion: 'Alta o edición de trabajador en nómina ocupacional.',
    resultado: 'El sistema genera automáticamente el perfil de exposición ocupacional y determina los exámenes complementarios exigibles.',
    prioridad: 'CRITICA',
    dependencias: ['RN-EMP-001'],
    baseLegalPeruana: 'R.M. 312-2011-MINSA (Protocolos de Exámenes Médicos Ocupacionales)'
  },
  {
    codigo: 'RN-TRAB-002',
    modulo: 'Trabajadores',
    nombre: 'Manejo de Reubicación Laboral por Aptitud',
    descripcion: 'Si un trabajador cambia de puesto de trabajo con diferente nivel de riesgo o por recomendación médica del Certificado de Aptitud, se debe ejecutar un EMO de Cambio de Puesto/Reubicación.',
    condicion: 'Cambio de puesto de trabajo registrado o emisión de Aptitud con Restricción severa.',
    resultado: 'Se bloquea el desempeño en el puesto nuevo hasta la emisión del certificado de aptitud correspondiente.',
    prioridad: 'ALTA',
    dependencias: ['RN-TRAB-001', 'RN-APT-001'],
    baseLegalPeruana: 'Art. 71 de la Ley N° 29783 de Seguridad y Salud en el Trabajo'
  },

  // MÓDULO HISTORIA CLÍNICA OCUPACIONAL (HCO)
  {
    codigo: 'RN-HCO-001',
    modulo: 'Historia Clínica Ocupacional',
    nombre: 'Apertura y Custodia Única de la HCO',
    descripcion: 'Toda persona que ingresa a evaluación médica ocupacional debe tener una Historia Clínica Ocupacional (HCO) con código único e inalterable, custodiada en formato confidencial bajo responsabilidad del Médico Ocupacional.',
    condicion: 'Primer examen médico u observación del trabajador.',
    resultado: 'Se genera el expediente digital con firma y sello médico, encriptado conforme a Ley de Datos Personales.',
    prioridad: 'CRITICA',
    dependencias: ['RN-TRAB-001'],
    baseLegalPeruana: 'R.M. 312-2011-MINSA y Ley N° 29733 (Protección de Datos Personales)'
  },
  {
    codigo: 'RN-HCO-002',
    modulo: 'Historia Clínica Ocupacional',
    nombre: 'Retención y Archivo de Historias Clínicas (40 años para Alto Riesgo)',
    descripcion: 'Las Historias Clínicas Ocupacionales deben ser conservadas por un período mínimo de 20 años en general, y de 40 años para trabajadores expuestos a agentes carcinógenos, asbesto o radiaciones ionizantes.',
    condicion: 'Baja o cese de trabajador de la empresa.',
    resultado: 'El sistema marca la HCO en estado "ARCHIVADO_RETENCION" imposibilitando su eliminación física o purga de base de datos (Soft Delete únicamente).',
    prioridad: 'CRITICA',
    dependencias: ['RN-HCO-001'],
    baseLegalPeruana: 'Art. 35 del D.S. N° 005-2012-TR y R.M. 312-2011-MINSA'
  },

  // MÓDULO EXAMEN MÉDICO OCUPACIONAL (EMO)
  {
    codigo: 'RN-EMO-001',
    modulo: 'Evaluaciones Médicas EMO',
    nombre: 'Periodicidad Obligatoria EMO (Anual vs Bienal)',
    descripcion: 'Los Exámenes Médicos Ocupacionales Periódicos deben realizarse cada 2 años en actividades no de alto riesgo, y de manera ANUAL (o menor según protocolo) en empresas que realizan actividades de alto riesgo (SCTR).',
    condicion: 'Evaluación de fecha de vencimiento de EMO vigente.',
    resultado: 'El sistema emite alertas automáticas a los 60, 30 y 15 días previos a la expiración del EMO para el Médico Ocupacional y SST.',
    prioridad: 'CRITICA',
    dependencias: ['RN-EMP-001', 'RN-TRAB-001'],
    baseLegalPeruana: 'Modificatoria Ley N° 30222 (Modifica Art. 49 Ley 29783) y R.M. 312-2011-MINSA'
  },
  {
    codigo: 'RN-EMO-002',
    modulo: 'Evaluaciones Médicas EMO',
    nombre: 'Obligatoriedad del EMO de Retiro',
    descripcion: 'El EMO de Retiro es obligatorio para actividades de alto riesgo SCTR y opcional a solicitud escrita del trabajador en actividades que no son de alto riesgo.',
    condicion: 'Registro de cese o término del contrato de trabajo.',
    resultado: 'Se programa de forma prioritaria la cita EMO de Retiro y se requiere firma/constancia de renuncia firmada si aplica.',
    prioridad: 'ALTA',
    dependencias: ['RN-EMO-001'],
    baseLegalPeruana: 'Ley N° 29783 Art. 49 inciso d)'
  },
  {
    codigo: 'RN-EMO-003',
    modulo: 'Evaluaciones Médicas EMO',
    nombre: 'Composición de Exámenes Complementarios por Factores de Riesgo',
    descripcion: 'Si el trabajador está expuesto a Ruido >85dB(A), la audiometría es obligatoria. Si está expuesto a Polvo/Sílice, la Espirometría y Rx de Tórax OIT son obligatorias. Si trabajo en altura (>1.8m), EKG y lab completo son requeridos.',
    condicion: 'Selección de protocolo médico EMO.',
    resultado: 'El sistema calcula automáticamente la batería de pruebas y bloquea la emisión de aptitud si falta una prueba requerida por matriz.',
    prioridad: 'CRITICA',
    dependencias: ['RN-TRAB-001', 'RN-HCO-001'],
    baseLegalPeruana: 'Anexo 01 y 02 de la R.M. 312-2011-MINSA / Guías Técnicas'
  },

  // MÓDULO CERTIFICADOS DE APTITUD MÉDICA OCUPACIONAL
  {
    codigo: 'RN-APT-001',
    modulo: 'Certificado de Aptitud',
    nombre: 'Categorización de Aptitud Ocupacional',
    descripcion: 'El dictamen de aptitud médica ocupacional únicamente podrá ser uno de los siguientes: 1. APTO, 2. APTO CON RESTRICCIONES, 3. NO APTO, 4. EVALUADO NO CONCLUIDO (Observado).',
    condicion: 'Conclusión de la evaluación médica de la HCO por el Médico Ocupacional con CMP/RNM.',
    resultado: 'Se emite el Certificado de Aptitud Médica conforme al modelo oficial de R.M. 312-2011-MINSA Anexo 03.',
    prioridad: 'CRITICA',
    dependencias: ['RN-EMO-003', 'RN-HCO-001'],
    baseLegalPeruana: 'Anexo 03 de la R.M. 312-2011-MINSA'
  },
  {
    codigo: 'RN-APT-002',
    modulo: 'Certificado de Aptitud',
    nombre: 'Notificación Obligatoria de Restricciones a RRHH y SST',
    descripcion: 'Cuando se emita un certificado de "APTO CON RESTRICCIONES", el sistema informará las restricciones operativas al empleador (SST/RRHH) SIN develar el diagnóstico confidencial o hallazgo clínico específico.',
    condicion: 'Emisión de Certificado APTO CON RESTRICCIONES.',
    resultado: 'Se notifica al empleador la restricción específica (ej: "No realizar trabajo en altura física >1.8m", "Uso obligatorio de EPP auditivo doble") protegiendo el secreto médico.',
    prioridad: 'CRITICA',
    dependencias: ['RN-APT-001'],
    baseLegalPeruana: 'Ley N° 26842 (Ley General de Salud) Art. 25 y Ley 29783'
  },
  {
    codigo: 'RN-APT-003',
    modulo: 'Certificado de Aptitud',
    nombre: 'Manejo del Dictamen NO APTO y Derecho a Apelación',
    descripcion: 'Si el resultado es NO APTO, se notifica personalmente y en sobre cerrado confidencial al trabajador, indicando los motivos médicos en entrevista privada, e informando al empleador únicamente el resultado sin detalles patológicos.',
    condicion: 'Emisión de Certificado NO APTO.',
    resultado: 'Inicia el plazo de reconsideración y se sugiere interconsulta o junta médica ocupacional.',
    prioridad: 'ALTA',
    dependencias: ['RN-APT-001'],
    baseLegalPeruana: 'R.M. 312-2011-MINSA y Protocolos Médico-Legales del MINSA'
  },

  // MÓDULO ACCIDENTES DE TRABAJO E INCIDENTES
  {
    codigo: 'RN-ACC-001',
    modulo: 'Accidentes e Incidentes',
    nombre: 'Plazo Obligatorio de Notificación al MTPE (24 horas)',
    descripcion: 'Todo Accidente de Trabajo Mortal e Incidente Peligroso debe notificarse obligatoriamente al Ministerio de Trabajo y Promoción del Empleo (MTPE) dentro de las 24 HORAS de ocurrido mediante la plataforma SAT.',
    condicion: 'Registro de Accidente Mortal o Incidente Peligroso.',
    resultado: 'El sistema activa un contador regresivo de 24 horas y alerta en rojo prioritario al Especialista SST y Representante Legal.',
    prioridad: 'CRITICA',
    dependencias: ['RN-EMP-001', 'RN-TRAB-001'],
    baseLegalPeruana: 'Art. 110 del D.S. N° 005-2012-TR y Ley 29783'
  },
  {
    codigo: 'RN-ACC-002',
    modulo: 'Accidentes e Incidentes',
    nombre: 'Investigación de Accidentes Incapacitantes (10 días calendario)',
    descripcion: 'Los Accidentes de Trabajo Incapacitantes deben ser investigados por el Comité o Supervisor de SST en un plazo máximo de 10 días calendario para determinar causas raíz (ICAM / 5 Porqués).',
    condicion: 'Registro de Accidente de Trabajo Incapacitante.',
    resultado: 'Se asigna equipo investigador, requiere registro de días perdidos y genera plan de acción correctivo con responsable y fecha.',
    prioridad: 'ALTA',
    dependencias: ['RN-ACC-001'],
    baseLegalPeruana: 'Art. 42 del D.S. N° 005-2012-TR'
  },

  // MÓDULO AUSENTISMO Y DESCANSOS MÉDICOS
  {
    codigo: 'RN-AUS-001',
    modulo: 'Ausentismo y Licencias',
    nombre: 'Validación de Descansos Médicos y Cierre por CPT/CIE-10',
    descripcion: 'Todo descanso médico presentado debe contar con Código CIE-10 válido, Colegio Médico del profesional emisor (CMP/COP) y número de días. Descansos mayores a 20 días acumulados en el año requieren canje por CITT ESSALUD.',
    condicion: 'Registro de certificado de incapacidad temporal.',
    resultado: 'Se calcula el impacto de días no trabajados en el Índice de Severidad (IS) y alerta si supera el umbral de subsidio ESSALUD (Día 21).',
    prioridad: 'ALTA',
    dependencias: ['RN-TRAB-001'],
    baseLegalPeruana: 'Ley N° 26790 de Modernización de la Seguridad Social en Salud'
  },
  {
    codigo: 'RN-AUS-002',
    modulo: 'Ausentismo y Licencias',
    nombre: 'Evaluación Post-Incapacidad Prolongada',
    descripcion: 'Todo trabajador con descanso médico mayor a 30 días continuos por enfermedad común, accidente o cirugía debe someterse obligatoriamente a una Evaluación EMO Post-Incapacidad antes de reintegrarse a sus labores.',
    condicion: 'Término de descanso médico >30 días.',
    resultado: 'Se bloquea el marcado de asistencia laboral hasta la aprobación del dictamen de aptitud para retorno.',
    prioridad: 'CRITICA',
    dependencias: ['RN-AUS-001', 'RN-EMO-001'],
    baseLegalPeruana: 'R.M. 312-2011-MINSA Numeral 6.4.1'
  },

  // MÓDULO PROGRAMAS DE VIGILANCIA EPIDEMIOLÓGICA
  {
    codigo: 'RN-VIG-001',
    modulo: 'Vigilancia Epidemiológica',
    nombre: 'Inclusión Automática en Programa de Vigilancia según Riesgo',
    descripcion: 'Trabajadores expuestos a Ruido >85dB, Sílice, Polvo, Cargas >25kg, Agentes Biológicos o Turnos Nocturnos ingresan automáticamente a las cohortes del Programa de Vigilancia Epidemiológica correspondiente.',
    condicion: 'Alta de trabajador o emisión de hallazgo clínico en EMO.',
    resultado: 'El sistema enrola al trabajador en la cohorte activa y agenda controles semestrales o anuales específicos.',
    prioridad: 'ALTA',
    dependencias: ['RN-TRAB-001', 'RN-EMO-003'],
    baseLegalPeruana: 'R.M. 312-2011-MINSA y R.M. 375-2008-TR (Norma Básica de Ergonomía)'
  },
  {
    codigo: 'RN-VIG-002',
    modulo: 'Vigilancia Epidemiológica',
    nombre: 'Criterio de Sospecha y Notificación de Enfermedad Ocupacional',
    descripcion: 'Si en el seguimiento de un programa de vigilancia se detecta un cambio de umbral auditivo permanente (TTS/PTS) o alteración espirométrica/patológica, el Médico Ocupacional debe notificar la sospecha de Enfermedad Ocupacional.',
    condicion: 'Registro de alteración diagnóstica en pruebas de vigilancia.',
    resultado: 'Se apertura el protocolo de investigación de enfermedad ocupacional y se genera ficha FNO (Ficha de Notificación Obligatoria) MINSA.',
    prioridad: 'CRITICA',
    dependencias: ['RN-VIG-001', 'RN-HCO-001'],
    baseLegalPeruana: 'R.M. 480-2008-MINSA (NTS N° 068-MINSA/DGSP-V.1 NTS de Enfermedades Ocupacionales)'
  },

  // MÓDULO VACUNAS E INMUNIZACIONES
  {
    codigo: 'RN-VAC-001',
    modulo: 'Inmunizaciones Ocupacionales',
    nombre: 'Esquema de Vacunación Obligatorio por Riesgo Biológico',
    descripcion: 'Trabajadores de salud, saneamiento, manejo de residuos o campo expuestos a agentes biológicos deben contar obligatoriamente con el esquema completo de Hepatitis B (3 dosis), Tétanos/TdaP (3 dosis/refuerzo) e Influenza anual.',
    condicion: 'Evaluación del perfil de vacunación del trabajador.',
    resultado: 'El sistema emite órdenes de aplicación y alertas de refuerzo al servicio de enfermería ocupacional.',
    prioridad: 'ALTA',
    dependencias: ['RN-TRAB-001'],
    baseLegalPeruana: 'R.M. 021-2016-MINSA (NTS de Inmunizaciones en Salud Ocupacional)'
  },

  // MÓDULO INDICADORES DE GESTIÓN (IGSO)
  {
    codigo: 'RN-IND-001',
    modulo: 'Indicadores SST/IGSO',
    nombre: 'Cálculo Estandarizado de Índices de Siniestralidad (IF, IS, IA)',
    descripcion: 'Los indicadores de accidentes deben calcularse según fórmula oficial usando la constante de 1,000,000 de Horas Hombre Trabajadas (HHT): IF = (Accidentes * 1,000,000) / HHT; IS = (Días Perdidos * 1,000,000) / HHT; IA = (IF * IS) / 1,000.',
    condicion: 'Consolidado mensual de seguridad y salud ocupacional.',
    resultado: 'Generación automática de tableros de control con gráficos comparativos contra metas del Plan Anual de SST.',
    prioridad: 'ALTA',
    dependencias: ['RN-ACC-001', 'RN-AUS-001'],
    baseLegalPeruana: 'D.S. 005-2012-TR Art. 33 y R.M. 050-2013-TR'
  },

  // MÓDULO AUDITORÍA Y SEGURIDAD
  {
    codigo: 'RN-AUD-001',
    modulo: 'Seguridad y Auditoría',
    nombre: 'Trazabilidad Inmutable e Imprescriptible de Accesos Médicos',
    descripcion: 'Todo acceso, lectura, edición o descarga de una Historia Clínica Ocupacional o EMO debe quedar registrado de forma inalterable con Timestamp UTC, Usuario ID, Rol, Dirección IP y Acción exacta ejecutada.',
    condicion: 'Consulta o modificación de módulo clínico.',
    resultado: 'Inserción inmediata en tabla audit_logs de solo lectura (Append-Only). Alerta automática si un rol no médico intenta visualizar diagnósticos médicos explícitos.',
    prioridad: 'CRITICA',
    dependencias: ['RN-HCO-001'],
    baseLegalPeruana: 'Ley N° 29733 de Protección de Datos Personales y D.S. 003-2013-JUS'
  }
];
