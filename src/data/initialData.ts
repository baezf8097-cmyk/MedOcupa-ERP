import { Empresa, Trabajador, EMOExam, HistoriaClinicaOcupacional, AccidenteIncidente, AusentismoMedico, ProgramaVigilancia, RegistroVacuna, AuditLog, ProtocoloExamenMedico } from '../types/erp';

export const MOCK_EMPRESAS: Empresa[] = [
  {
    id: 'emp-1',
    ruc: '20100234561',
    razonSocial: 'COMPAÑÍA MINERA LOS ANDES S.A.C.',
    nombreComercial: 'Minera Los Andes',
    ciiu: '0710',
    actividadEconomica: 'Extracción de minerales metalíferos (Oro, Cobre, Zinc)',
    direccion: 'Av. Las Camelias 450, San Isidro, Lima / Unidad Operativa Pasco',
    departamento: 'Pasco',
    provincia: 'Pasco',
    distrito: 'Chaupimarca',
    nivelRiesgoSCTR: 'ALTO',
    totalTrabajadores: 1450,
    contactoNombre: 'Ing. Carlos Mendoza',
    contactoEmail: 'cmendoza@mineralosandes.pe',
    contactoTelefono: '+51 987654321',
    estado: 'ACTIVA',
    sedes: [
      { id: 'sed-1', nombre: 'Unidad Operativa Pasco (Mina)', direccion: 'Carretera Central Km 312', trabajadoresCount: 1100, estado: 'ACTIVA' },
      { id: 'sed-2', nombre: 'Sede Administrativa Lima', direccion: 'Av. Las Camelias 450', trabajadoresCount: 350, estado: 'ACTIVA' }
    ]
  },
  {
    id: 'emp-2',
    ruc: '20554981234',
    razonSocial: 'CONSTRUCTORA DEL PACÍFICO S.A.',
    nombreComercial: 'Constructora del Pacífico',
    ciiu: '4100',
    actividadEconomica: 'Construcción de edificios residenciales y obras de infraestructura pública',
    direccion: 'Av. Javier Prado Este 2800, San Borja, Lima',
    departamento: 'Lima',
    provincia: 'Lima',
    distrito: 'San Borja',
    nivelRiesgoSCTR: 'ALTO',
    totalTrabajadores: 680,
    contactoNombre: 'Lic. Mariela Torres',
    contactoEmail: 'mtorres@cpacifico.com.pe',
    contactoTelefono: '+51 912345678',
    estado: 'ACTIVA',
    sedes: [
      { id: 'sed-3', nombre: 'Obra Línea 3 Metro', direccion: 'Av. Arequipa Cdra 15', trabajadoresCount: 420, estado: 'ACTIVA' },
      { id: 'sed-4', nombre: 'Oficina Central', direccion: 'Av. Javier Prado Este 2800', trabajadoresCount: 260, estado: 'ACTIVA' }
    ]
  },
  {
    id: 'emp-3',
    ruc: '20489123987',
    razonSocial: 'AGROINDUSTRIAL EL SOL S.A.A.',
    nombreComercial: 'AgroSol',
    ciiu: '0113',
    actividadEconomica: 'Cultivo de frutas, espárragos y arándanos para exportación',
    direccion: 'Fundo El Sol S/N, Ica',
    departamento: 'Ica',
    provincia: 'Ica',
    distrito: 'Salas Guadalupe',
    nivelRiesgoSCTR: 'MEDIO',
    totalTrabajadores: 2100,
    contactoNombre: 'Dr. Roberto Silva',
    contactoEmail: 'rsilva@agrosol.pe',
    contactoTelefono: '+51 955443322',
    estado: 'ACTIVA',
    sedes: [
      { id: 'sed-5', nombre: 'Planta de Empaque Ica', direccion: 'Fundo El Sol Km 12', trabajadoresCount: 1500, estado: 'ACTIVA' },
      { id: 'sed-6', nombre: 'Fundo Chincha', direccion: 'Carretera Panamericana Sur Km 198', trabajadoresCount: 600, estado: 'ACTIVA' }
    ]
  }
];

export const MOCK_TRABAJADORES: Trabajador[] = [
  {
    id: 'trab-1',
    empresaId: 'emp-1',
    sedeId: 'sed-1',
    tipoDocumento: 'DNI',
    numeroDocumento: '45891234',
    nombres: 'Juan Carlos',
    apellidoPaterno: 'Quispe',
    apellidoMaterno: 'Huamán',
    fechaNacimiento: '1988-05-14',
    sexo: 'M',
    telefono: '987123456',
    email: 'jquispe@mineralosandes.pe',
    puestoTrabajo: 'Operador de Maquinaria Pesada - Socavón',
    area: 'Operaciones Mina',
    grupoOcupacional: 'OPERATIVO_MINERO',
    fechaIngreso: '2019-03-15',
    factoresRiesgo: [
      { tipo: 'FISICO', descripcion: 'Ruido continuo de perforadora >88 dB(A)', intensidadNivel: 'ALTO' },
      { tipo: 'FISICO', descripcion: 'Vibración de cuerpo entero por cargador frontal', intensidadNivel: 'ALTO' },
      { tipo: 'QUIMICO', descripcion: 'Polvo de sílice libre cristalizada en socavón', intensidadNivel: 'CRITICO' },
      { tipo: 'ERGONOMICO', descripcion: 'Postura prolongada sentado en cabina', intensidadNivel: 'MEDIO' }
    ],
    estado: 'ACTIVO'
  },
  {
    id: 'trab-2',
    empresaId: 'emp-1',
    sedeId: 'sed-1',
    tipoDocumento: 'DNI',
    numeroDocumento: '71234890',
    nombres: 'María Elena',
    apellidoPaterno: 'Gonzales',
    apellidoMaterno: 'Rojas',
    fechaNacimiento: '1993-11-20',
    sexo: 'F',
    telefono: '954321876',
    email: 'mgonzales@mineralosandes.pe',
    puestoTrabajo: 'Metalurgista de Control de Calidad',
    area: 'Planta Concentradora',
    grupoOcupacional: 'TECNICO_LABORATORIO',
    fechaIngreso: '2021-08-01',
    factoresRiesgo: [
      { tipo: 'QUIMICO', descripcion: 'Exposición a cianuro y reactivos de flotación', intensidadNivel: 'ALTO' },
      { tipo: 'BIOLOGICO', descripcion: 'Muestras de aguas servidas', intensidadNivel: 'BAJO' }
    ],
    estado: 'ACTIVO'
  },
  {
    id: 'trab-3',
    empresaId: 'emp-2',
    sedeId: 'sed-3',
    tipoDocumento: 'DNI',
    numeroDocumento: '42109876',
    nombres: 'Jorge Luis',
    apellidoPaterno: 'Benítez',
    apellidoMaterno: 'Pérez',
    fechaNacimiento: '1985-02-10',
    sexo: 'M',
    telefono: '911223344',
    email: 'jbenitez@cpacifico.com.pe',
    puestoTrabajo: 'Andamiero / Encofrador en Altura',
    area: 'Estructuras',
    grupoOcupacional: 'CONSTRUCCION_ALTURA',
    fechaIngreso: '2022-01-10',
    factoresRiesgo: [
      { tipo: 'FISICO', descripcion: 'Trabajo en altura física >12 metros', intensidadNivel: 'CRITICO' },
      { tipo: 'ERGONOMICO', descripcion: 'Levantamiento manual de cargas >25 kg', intensidadNivel: 'ALTO' }
    ],
    estado: 'ACTIVO'
  },
  {
    id: 'trab-4',
    empresaId: 'emp-3',
    sedeId: 'sed-5',
    tipoDocumento: 'DNI',
    numeroDocumento: '48901234',
    nombres: 'Rosa Luz',
    apellidoPaterno: 'Campos',
    apellidoMaterno: 'Vargas',
    fechaNacimiento: '1996-09-30',
    sexo: 'F',
    telefono: '966778899',
    email: 'rcampos@agrosol.pe',
    puestoTrabajo: 'Seccionadora de Empaque de Arándano',
    area: 'Planta de Procesamiento',
    grupoOcupacional: 'AGROINDUSTRIAL',
    fechaIngreso: '2023-05-20',
    factoresRiesgo: [
      { tipo: 'ERGONOMICO', descripcion: 'Movimiento repetitivo de extremidad superior (>30 cic/min)', intensidadNivel: 'ALTO' },
      { tipo: 'FISICO', descripcion: 'Baja temperatura en cámara fría (8°C)', intensidadNivel: 'MEDIO' }
    ],
    estado: 'ACTIVO'
  }
];

export const MOCK_EMO_EXAMS: EMOExam[] = [
  {
    id: 'emo-1',
    codigoEMO: 'EMO-2026-00891',
    trabajadorId: 'trab-1',
    empresaId: 'emp-1',
    tipoEMO: 'PERIODICO',
    fechaProgramada: '2026-06-15',
    fechaRealizada: '2026-06-16',
    estado: 'CERTIFICADO_EMITIDO',
    medicoId: 'med-101',
    protocoloAplicado: 'Protocolo Minería Socavón - Alto Riesgo (RM 312-2011 Anexo 1)',
    costoEMO: 320.00,
    evaluaciones: {
      triaje: true,
      medicinaGeneral: true,
      audiometria: true,
      espirometria: true,
      radiografiaOIT: true,
      laboratorio: true,
      psicologia: true,
      oftalmologia: true,
      electrocardiograma: true
    },
    aptitud: {
      resultado: 'APTO_CON_RESTRICCIONES',
      fechaEmision: '2026-06-17',
      fechaVencimiento: '2027-06-17',
      restricciones: [
        'Uso permanente de doble protección auditiva (tapones de silicona + orejeras NRR 29dB) por trauma acústico leve en oído izquierdo.',
        'Pausas activas ergonómicas de 5 minutos cada 2 horas de conducción.',
        'Prohibido realizar esfuerzo físico de levantamiento >20 kg sin ayuda mecánica.'
      ],
      recomendaciones: [
        'Ingreso inmediato al Programa de Vigilancia de la Conservación Auditiva.',
        'Evaluación audiométrica de control semestral.',
        'Bajar de peso (IMC actual: 28.4 kg/m² - Sobrepeso grado I).'
      ],
      vigilanciaSugerida: ['AUDITIVO_RUIRDO', 'RESPIRATORIO_NEUMOCONIOSIS'],
      medicoFirmante: 'Dr. Alejandro Morales Ramos',
      cmpFirmante: 'CMP 45120 / RNM 18920 (Especialista en Medicina Ocupacional)'
    }
  },
  {
    id: 'emo-2',
    codigoEMO: 'EMO-2026-00902',
    trabajadorId: 'trab-3',
    empresaId: 'emp-2',
    tipoEMO: 'INGRESO',
    fechaProgramada: '2026-07-02',
    fechaRealizada: '2026-07-02',
    estado: 'CERTIFICADO_EMITIDO',
    medicoId: 'med-101',
    protocoloAplicado: 'Protocolo Construcción Trabajos en Altura >1.8m',
    costoEMO: 280.00,
    evaluaciones: {
      triaje: true,
      medicinaGeneral: true,
      audiometria: true,
      espirometria: true,
      radiografiaOIT: false,
      laboratorio: true,
      psicologia: true,
      oftalmologia: true,
      electrocardiograma: true
    },
    aptitud: {
      resultado: 'APTO',
      fechaEmision: '2026-07-03',
      fechaVencimiento: '2028-07-03',
      restricciones: [],
      recomendaciones: [
        'Uso obligatorio de arnés de seguridad de 5 puntos en todo trabajo en altura.',
        'Inspección previa de línea de vida.'
      ],
      vigilanciaSugerida: [],
      medicoFirmante: 'Dr. Alejandro Morales Ramos',
      cmpFirmante: 'CMP 45120 / RNM 18920'
    }
  },
  {
    id: 'emo-3',
    codigoEMO: 'EMO-2026-00915',
    trabajadorId: 'trab-4',
    empresaId: 'emp-3',
    tipoEMO: 'PERIODICO',
    fechaProgramada: '2026-07-20',
    fechaRealizada: '2026-07-21',
    estado: 'EN_PROCESO',
    medicoId: 'med-101',
    protocoloAplicado: 'Protocolo Agroindustria y Movimientos Repetitivos',
    costoEMO: 190.00,
    evaluaciones: {
      triaje: true,
      medicinaGeneral: true,
      audiometria: true,
      espirometria: false,
      radiografiaOIT: false,
      laboratorio: true,
      psicologia: true,
      oftalmologia: true,
      electrocardiograma: false
    },
    aptitud: {
      resultado: 'EVALUADO_NO_CONCLUIDO',
      fechaEmision: '2026-07-21',
      fechaVencimiento: '2026-08-21',
      restricciones: ['Pendiente resultado de laboratorio glucosa en ayunas y espirometria de control.'],
      recomendaciones: ['Completar exámenes complementarios observados en un plazo máximo de 15 días.'],
      vigilanciaSugerida: ['ERGONOMICO'],
      medicoFirmante: 'Dr. Alejandro Morales Ramos',
      cmpFirmante: 'CMP 45120 / RNM 18920'
    }
  },
  {
    id: 'emo-4',
    codigoEMO: 'EMO-2026-00930',
    trabajadorId: 'trab-2',
    empresaId: 'emp-1',
    tipoEMO: 'REUBICACION',
    fechaProgramada: '2026-07-10',
    fechaRealizada: '2026-07-11',
    estado: 'CERTIFICADO_EMITIDO',
    medicoId: 'med-101',
    protocoloAplicado: 'Protocolo Operación Minera Socavón / Gran Altitud',
    costoEMO: 310.00,
    evaluaciones: {
      triaje: true,
      medicinaGeneral: true,
      audiometria: true,
      espirometria: true,
      radiografiaOIT: true,
      laboratorio: true,
      psicologia: true,
      oftalmologia: true,
      electrocardiograma: true
    },
    aptitud: {
      resultado: 'NO_APTO',
      fechaEmision: '2026-07-12',
      fechaVencimiento: '2027-07-12',
      motivoNoApto: 'Hipertensión Arterial Grado III descompensada (PA 175/110 mmHg) asociada a hipertrofia ventricular izquierda y Síndrome Vertiginoso. Incompatible con labor operativa en gran altitud (>3,500 msnm).',
      restricciones: [
        'No apto para trabajar en altitudes superiores a 2,500 msnm.',
        'Prohibida la conducción de vehículos de carga y maquinaria pesada.',
        'No realizar trabajos en altura estructural (>1.8 m).'
      ],
      recomendaciones: [
        'Transferencia inmediata a Medicina de Familia / Cardiología por Essalud.',
        'Tratamiento antihipertensivo intensivo y monitoreo MAPA de 24 horas.',
        'Reevaluación ocupacional tras compensación clínica demostrada (mínimo 60 días).'
      ],
      vigilanciaSugerida: ['CARDIOVASCULAR', 'HIPERTENSION_ARTERIAL'],
      medicoFirmante: 'Dr. Alejandro Morales Ramos',
      cmpFirmante: 'CMP 45120 / RNM 18920'
    }
  }
];

export const MOCK_HISTORIAS_CLINICAS: HistoriaClinicaOcupacional[] = [
  {
    id: 'hco-1',
    trabajadorId: 'trab-1',
    codigoHCO: 'HCO-45891234',
    fechaApertura: '2019-03-15',
    antecedentesPersonales: {
      patologicas: ['Gastritis crónica', 'Hipertensión arterial controlada'],
      quirurgicas: ['Apendicectomía a los 18 años'],
      alergias: ['Alergia a la Penicilina'],
      habitosNocivos: 'Alcohol ocasional, Niega tabaco'
    },
    antecedentesOcupacionales: [
      {
        empresaAnterior: 'Volcan Compañía Minera',
        puesto: 'Perforista de Socavón',
        tiempoAnos: 6,
        riesgosExpuestos: ['Ruido >90dB', 'Polvo de sílice', 'Monóxido de carbono'],
        eppUtilizado: 'Respirador media cara con filtros P100, Tapones auditivos'
      }
    ],
    constantesVitalesMasRecientes: {
      pa: '120/80 mmHg',
      fc: 72,
      fr: 16,
      temperatura: 36.6,
      imc: 28.4,
      saturacionO2: 96
    },
    diagnosticosCIE10: [
      { id: 'diag-1', codigo: 'M54.5', descripcion: 'Lumbalgia no especificada / Dolor lumbar disergonómico', tipo: 'DEFINITIVO', fecha: '2026-02-15' },
      { id: 'diag-2', codigo: 'H83.3', descripcion: 'Efectos del ruido sobre el oído interno / Trauma acústico laboral', tipo: 'PRESUNTIVO', fecha: '2026-03-20' }
    ],
    observacionesMedicas: 'Trabajador en monitoreo periódico por exposición a ruido y ergonómicos en área minera. Apto con recomendaciones.',
    controlesPosteriores: [
      {
        id: 'ctrl-1',
        fecha: '2026-06-15',
        motivoControl: 'Control 1',
        medicoAtendio: 'Dr. Alejandro Morales (CMP 45892)',
        signosVitales: {
          pa: '122/80 mmHg',
          fc: 74,
          fr: 16,
          saturacionO2: 97,
          temperatura: 36.5
        },
        examenesLaboratorio: [
          { id: 'lab-1', nombreExamen: 'Hemograma Completo', resultado: 'Hb 15.2 g/dL - Leucocitos 7,200/mm3', valoresReferencia: 'Hb 13-17 g/dL', observacion: 'Valores normales sin signos de infección' },
          { id: 'lab-2', nombreExamen: 'Glucosa Basal', resultado: '92 mg/dL', valoresReferencia: '70 - 100 mg/dL', observacion: 'Euglucémico' },
          { id: 'lab-3', nombreExamen: 'Perfil Lipídico (Colesterol / Triglicéridos)', resultado: 'Col: 185 mg/dL | Trig: 140 mg/dL', valoresReferencia: 'Col <200 | Trig <150', observacion: 'Dentro de rango de referencia' },
          { id: 'lab-4', nombreExamen: 'Espirometría / Audiometría Control', resultado: 'Normal / Hipoacusia Leve Bilateral HZ 4000', valoresReferencia: 'Normoacusia', observacion: 'Uso obligatorio de protección auditiva de silicona' }
        ],
        observacionControl: 'Evolución favorable de presión arterial. Continuar con dieta hiposódica y uso estricto de EPP auditivo.'
      },
      {
        id: 'ctrl-2',
        fecha: '2026-07-20',
        motivoControl: 'Control 2',
        medicoAtendio: 'Dra. Carmen Alva (CMP 51204)',
        signosVitales: {
          pa: '118/78 mmHg',
          fc: 70,
          fr: 15,
          saturacionO2: 98,
          temperatura: 36.6
        },
        examenesLaboratorio: [
          { id: 'lab-5', nombreExamen: 'Plomemia (Plomo en Sangre)', resultado: '18 ug/dL', valoresReferencia: '<30 ug/dL (OSHA/MINSA)', observacion: 'Conforme con límites máximos permisibles' },
          { id: 'lab-6', nombreExamen: 'Creatinina / Urea', resultado: '0.9 mg/dL / 28 mg/dL', valoresReferencia: '0.7-1.3 mg/dL', observacion: 'Función renal conservada' }
        ],
        observacionControl: 'Presión arterial óptima. Parámetros de laboratorio dentro de límites biológicos de exposición (BEI).'
      }
    ],
    archivosAdjuntos: [
      {
        id: 'doc-1',
        nombreArchivo: 'Certificado_Aptitud_EMO_2026.pdf',
        tipoDocumento: 'CERTIFICADO_APTITUD',
        dataUrl: 'data:application/pdf;base64,JVBERi0xLjQK...',
        tamanioBytes: 245000,
        fechaSubida: '2026-06-17',
        subidoPor: 'Dr. Alejandro Morales',
        observaciones: 'Certificado de Aptitud Ocupacional (Apto con Restricciones Auditivas)'
      },
      {
        id: 'doc-2',
        nombreArchivo: 'Informe_Audiometria_Control.pdf',
        tipoDocumento: 'EXAMEN_LABORATORIO_EXTERNO',
        dataUrl: 'data:application/pdf;base64,JVBERi0xLjQK...',
        tamanioBytes: 182000,
        fechaSubida: '2026-06-16',
        subidoPor: 'Centro Audiológico Ocupacional Sur',
        observaciones: 'Audiograma tonal por vía aérea y ósea - Trauma acústico leve'
      },
      {
        id: 'doc-3',
        nombreArchivo: 'Radiografia_Torax_OIT_2026.pdf',
        tipoDocumento: 'INFORME_RADIOLOGICO_OIT',
        dataUrl: 'data:application/pdf;base64,JVBERi0xLjQK...',
        tamanioBytes: 310000,
        fechaSubida: '2026-06-16',
        subidoPor: 'Dr. Roberto Mendoza (Radiólogo RNM 12903)',
        observaciones: 'Placa R-X de tórax clasificada OIT: 0/0 (Limpio)'
      }
    ]
  }
];

export const MOCK_ACCIDENTES: AccidenteIncidente[] = [
  {
    id: 'acc-1',
    codigoEvento: 'ACC-2026-0012',
    empresaId: 'emp-1',
    trabajadorId: 'trab-1',
    tipo: 'ACCIDENTE_INCAPACITANTE',
    fechaHora: '2026-05-10 10:30',
    lugarExacto: 'Galería 450 Nivel - Socavón Principal Pasco',
    descripcionHechos: 'Atrapamiento leve de extremidad superior izquierda al operar palanca de mando de jumbo sin bloqueo de energía previa.',
    parteCuerpoAfectada: 'Mano izquierda (Traumatismo contuso)',
    diagnosticoCIE10: 'S60.2',
    diasIncapacidad: 12,
    notificadoMTPE: true,
    codigoRegistroSAT: 'SAT-MTPE-2026-98123',
    causasRaiz: [
      'Ausencia de procedimiento LOTO (Lockout/Tagout) en mantenimiento menor.',
      'Exceso de confianza del operador por prisa en el turno.'
    ],
    medidasCorrectivas: [
      'Capacitación obligatoria de refuerzo en LOTO a todo el turno.',
      'Instalación de guarda física protectora en palanca.'
    ],
    estadoInvestigacion: 'CERRADO'
  }
];

export const MOCK_AUSENTISMOS: AusentismoMedico[] = [
  {
    id: 'aus-1',
    trabajadorId: 'trab-1',
    empresaId: 'emp-1',
    tipoAusencia: 'ACCIDENTE_TRABAJO',
    codigoCIE10: 'S60.2',
    descripcionCIE10: 'Contusión de la mano y de la muñeca',
    fechaInicio: '2026-05-10',
    fechaFin: '2026-05-22',
    diasTotales: 12,
    centroMedicoEmisor: 'Clínica de Salud Ocupacional Cerro de Pasco',
    medicoTratante: 'Dr. Víctor Fernández',
    cmpMedicoTratante: 'CMP 31209',
    montoSubsidioEstimado: 1440.00,
    certificadoPdf: {
      nombreArchivo: 'Certificado_Descanso_S60.2_Trabajador.pdf',
      dataUrl: '',
      tamanioBytes: 245120,
      fechaSubida: '2026-05-10'
    }
  },
  {
    id: 'aus-2',
    trabajadorId: 'trab-4',
    empresaId: 'emp-3',
    tipoAusencia: 'ENFERMEDAD_COMUN',
    codigoCIE10: 'M65.4',
    descripcionCIE10: 'Tenosinovitis de estiloides radial [De Quervain]',
    fechaInicio: '2026-06-01',
    fechaFin: '2026-06-08',
    diasTotales: 7,
    centroMedicoEmisor: 'Hospital Regional de Ica MINSA',
    medicoTratante: 'Dra. Patricia Silva',
    cmpMedicoTratante: 'CMP 51234',
    montoSubsidioEstimado: 630.00,
    certificadoPdf: {
      nombreArchivo: 'Certificado_Descanso_M65.4_Trabajador.pdf',
      dataUrl: '',
      tamanioBytes: 189400,
      fechaSubida: '2026-06-01'
    }
  }
];

export const MOCK_PROGRAMAS_VIGILANCIA: ProgramaVigilancia[] = [
  {
    id: 'prog-1',
    empresaId: 'emp-1',
    nombrePrograma: 'Programa de Vigilancia Médica Ocupacional',
    codigoPrograma: 'PVO-01',
    categoria: 'GENERAL',
    descripcion: 'Vigilancia médica integral del estado de salud de todos los trabajadores mediante evaluaciones EMO pre-ocupacionales, periódicas y de retiro con seguimiento de aptitud médica.',
    baseLegal: 'R.M. 312-2011-MINSA / Ley 29783 Art. 49',
    medicoResponsable: 'Dr. Alejandro Morales Ramos (CMP 45120)',
    poblacionExpuestaTotal: 1250,
    trabajadoresEnVigilancia: 1250,
    casosSospechosos: 28,
    casosConfirmados: 5,
    metaCumplimientoPorcentaje: 100.0,
    avanceActualPorcentaje: 96.5,
    estado: 'ACTIVO',
    aplicaSegunRiesgo: false,
    periodicidadEvaluacion: 'Anual / Bi-anual',
    indicadoresClave: ['Cobertura de EMO Periódico', 'Porcentaje de Aptitudes Emitidas', 'Tasa de Hallazgos Clínicos'],
    fechaVencimiento: '2026-08-12',
    proximaEvaluacionFecha: '2026-08-12',
    capacitaciones: [
      {
        id: 'cap-101',
        nombre: 'Inducción en Salud Ocupacional y Evaluaciones Medicas EMO',
        fecha: '2026-03-12',
        horasLectivas: 2,
        instructor: 'Dr. Alejandro Morales Ramos',
        observaciones: 'Capacitación obligatoria a personal ingresante sobre la importancia del EMO, derechos y recomendaciones de salud.',
        evidencias: [
          {
            id: 'ev-101',
            nombreArchivo: 'Acta_Asistencia_Induccion_EMO_2026.pdf',
            dataUrl: 'data:application/pdf;base64,JVBERi0xLjQKJ...',
            tipoArchivo: 'application/pdf',
            tamanioBytes: 345000,
            fechaSubida: '2026-03-12'
          }
        ]
      }
    ]
  },
  {
    id: 'prog-2',
    empresaId: 'emp-1',
    nombrePrograma: 'Programa de Conservación Auditiva',
    codigoPrograma: 'PCA-02',
    categoria: 'ESPECIFICO_EXPOSICION',
    descripcion: 'Monitoreo audiométrico seriado, dosimetría de ruido laboral (>85 dBA), atenuación de EPP auditivo y prevención de trauma acústico / hipoacusia inducida por ruido (HIR).',
    baseLegal: 'R.M. 312-2011-MINSA / R.M. 375-2008-TR',
    medicoResponsable: 'Dr. Alejandro Morales Ramos (CMP 45120)',
    poblacionExpuestaTotal: 890,
    trabajadoresEnVigilancia: 890,
    casosSospechosos: 42,
    casosConfirmados: 8,
    metaCumplimientoPorcentaje: 95.0,
    avanceActualPorcentaje: 91.2,
    estado: 'ACTIVO',
    aplicaSegunRiesgo: false,
    periodicidadEvaluacion: 'Semestral / Anual',
    indicadoresClave: ['Tasa de Desplazamiento Temporal de Umbral (TTS)', 'Porcentaje de Hipoacusia Confirmada (PTS)', 'Calibración NRR EPP'],
    fechaVencimiento: '2026-08-18',
    proximaEvaluacionFecha: '2026-08-18',
    capacitaciones: [
      {
        id: 'cap-201',
        nombre: 'Uso Correcto, Limpieza y Mantenimiento de Protectores Auditivos',
        fecha: '2026-04-18',
        horasLectivas: 3,
        instructor: 'Ing. Javier Solís (Higienista Ocupacional)',
        observaciones: 'Taller práctico con verificación de tasa de atenuación NRR y prueba de ajuste de tapones moldeadles.',
        evidencias: [
          {
            id: 'ev-201',
            nombreArchivo: 'Lista_Asistencia_Capacitacion_Auditiva.pdf',
            dataUrl: 'data:application/pdf;base64,JVBERi0xLjQKJ...',
            tipoArchivo: 'application/pdf',
            tamanioBytes: 412000,
            fechaSubida: '2026-04-18'
          },
          {
            id: 'ev-202',
            nombreArchivo: 'Evidencia_Fotografica_Taller_EPP.png',
            dataUrl: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
            tipoArchivo: 'image/png',
            tamanioBytes: 156000,
            fechaSubida: '2026-04-18'
          }
        ]
      }
    ]
  },
  {
    id: 'prog-3',
    empresaId: 'emp-3',
    nombrePrograma: 'Programa de Prevención de Trastornos Musculoesqueléticos (Ergonomía)',
    codigoPrograma: 'PME-03',
    categoria: 'ESPECIFICO_EXPOSICION',
    descripcion: 'Evaluación ergonómica de puestos de trabajo (REBA, RULA, OWAS, NIOSH), pausas activas obligatorias y prevención de TME (lumbalgias, tendinitis, síndrome de túnel carpiano).',
    baseLegal: 'R.M. 375-2008-TR (Norma Básica de Ergonomía)',
    medicoResponsable: 'Dra. Carmen Alva (CMP 58912)',
    poblacionExpuestaTotal: 1500,
    trabajadoresEnVigilancia: 1200,
    casosSospechosos: 68,
    casosConfirmados: 12,
    metaCumplimientoPorcentaje: 90.0,
    avanceActualPorcentaje: 84.5,
    estado: 'ACTIVO',
    aplicaSegunRiesgo: false,
    periodicidadEvaluacion: 'Trimestral',
    indicadoresClave: ['Cumplimiento de Pausas Activas', 'Reducción de Días Perdidos por Lumbalgia', 'Readecuación Ergonómica de Puestos'],
    fechaVencimiento: '2026-08-05',
    proximaEvaluacionFecha: '2026-08-05'
  },
  {
    id: 'prog-4',
    empresaId: 'emp-1',
    nombrePrograma: 'Programa de Vigilancia de Riesgo Psicosocial',
    codigoPrograma: 'PRP-04',
    categoria: 'GENERAL',
    descripcion: 'Identificación y evaluación de factores de riesgo psicosocial (SUSESO-ISTAS 21 / CoPsoQ), prevención del estrés laboral, síndrome de burnout y clima de trabajo seguro.',
    baseLegal: 'Ley 29783 / R.M. 312-2011-MINSA / Ley 30364',
    medicoResponsable: 'Ps. Carmen Rosa Mendoza (CPsP 14209)',
    poblacionExpuestaTotal: 1250,
    trabajadoresEnVigilancia: 1250,
    casosSospechosos: 18,
    casosConfirmados: 3,
    metaCumplimientoPorcentaje: 95.0,
    avanceActualPorcentaje: 92.0,
    estado: 'ACTIVO',
    aplicaSegunRiesgo: false,
    periodicidadEvaluacion: 'Anual',
    indicadoresClave: ['Índice de Clima Psicosocial', 'Casos de Estrés Severo en Riesgo Alto', 'Talleres de Manejo de Estrés'],
    fechaVencimiento: '2026-09-20',
    proximaEvaluacionFecha: '2026-09-20'
  },
  {
    id: 'prog-5',
    empresaId: 'emp-2',
    nombrePrograma: 'Programa de Vida Saludable y Salud Cardiovascular',
    codigoPrograma: 'PVS-05',
    categoria: 'SALUD_Y_BIENESTAR',
    descripcion: 'Detección oportuna de síndrome metabólico, sobrepeso, obesidad, hipertensión arterial y diabetes mellitus. Orientación nutricional y prescripción de actividad física.',
    baseLegal: 'Ley 30021 (Alimentación Saludable) / R.M. 312-2011-MINSA',
    medicoResponsable: 'Dr. Alejandro Morales Ramos (CMP 45120)',
    poblacionExpuestaTotal: 1250,
    trabajadoresEnVigilancia: 680,
    casosSospechosos: 85,
    casosConfirmados: 24,
    metaCumplimientoPorcentaje: 85.0,
    avanceActualPorcentaje: 82.4,
    estado: 'ACTIVO',
    aplicaSegunRiesgo: false,
    periodicidadEvaluacion: 'Semestral',
    fechaVencimiento: '2026-08-01',
    proximaEvaluacionFecha: '2026-08-01',
    indicadoresClave: ['Porcentaje con IMC > 25 kg/m²', 'Control Glycemia/Perfil Lipídico', 'Participación en Reto Saludable']
  },
  {
    id: 'prog-6',
    empresaId: 'emp-1',
    nombrePrograma: 'Programa de Promoción de la Salud',
    codigoPrograma: 'PPS-06',
    categoria: 'SALUD_Y_BIENESTAR',
    descripcion: 'Desarrollo de competencias en salud preventiva, pausas saludables, campañas contra adicciones, salud oral, salud visual y fomento de hábitos higiénico-sanitarios.',
    baseLegal: 'Ley 29783 Art. 36 / D.S. 005-2012-TR',
    medicoResponsable: 'Lic. Enf. Patricia Vargas (CEP 38920)',
    poblacionExpuestaTotal: 1250,
    trabajadoresEnVigilancia: 1250,
    casosSospechosos: 0,
    casosConfirmados: 0,
    metaCumplimientoPorcentaje: 100.0,
    avanceActualPorcentaje: 95.0,
    estado: 'ACTIVO',
    aplicaSegunRiesgo: false,
    periodicidadEvaluacion: 'Mensual',
    indicadoresClave: ['Asistencia a Capacitaciones de Salud', 'Campañas Preventivas Ejecutadas', 'Boletines de Salud Difundidos']
  },
  {
    id: 'prog-7',
    empresaId: 'emp-1',
    nombrePrograma: 'Programa de Inmunizaciones',
    codigoPrograma: 'PIN-07',
    categoria: 'GENERAL',
    descripcion: 'Garantía del esquema de vacunación ocupacional para trabajadores (Hepatitis B, Tétanos-Difteria Td/TdaP, Influenza Estacional, Neumococo, Fiebre Amarilla, SR).',
    baseLegal: 'Norma Técnica de Vacunación MINSA / D.S. 005-2012-TR',
    medicoResponsable: 'Lic. Enf. Patricia Vargas (CEP 38920)',
    poblacionExpuestaTotal: 1250,
    trabajadoresEnVigilancia: 1250,
    casosSospechosos: 0,
    casosConfirmados: 0,
    metaCumplimientoPorcentaje: 100.0,
    avanceActualPorcentaje: 98.2,
    estado: 'ACTIVO',
    aplicaSegunRiesgo: false,
    periodicidadEvaluacion: 'Anual / Según Esquema',
    indicadoresClave: ['Cobertura Vacunal 3° Dosis Hep B', 'Protección Tetanica Vigente', 'Cobertura Influenza Anual']
  },
  {
    id: 'prog-8',
    empresaId: 'emp-1',
    nombrePrograma: 'Programa de Prevención de Enfermedades Respiratorias',
    codigoPrograma: 'PER-08',
    categoria: 'ESPECIFICO_EXPOSICION',
    descripcion: 'Prevención de silicosis, asbestosis y neumoconiosis mediante pruebas de Espirometría con curva flujo-volumen y Radiografía de Tórax con lectura OIT por neumólogo calificado.',
    baseLegal: 'R.M. 312-2011-MINSA Anexo 01 (Polvo y Sílice)',
    medicoResponsable: 'Dr. Alejandro Morales Ramos (CMP 45120)',
    poblacionExpuestaTotal: 1100,
    trabajadoresEnVigilancia: 1100,
    casosSospechosos: 15,
    casosConfirmados: 2,
    metaCumplimientoPorcentaje: 100.0,
    avanceActualPorcentaje: 94.8,
    estado: 'ACTIVO',
    aplicaSegunRiesgo: true,
    periodicidadEvaluacion: 'Anual',
    indicadoresClave: ['Lecturas OIT > 1/0', 'VEF1/CVF < 70% en Espirometría', 'Prueba de Ajuste Respirador N95/P100']
  },
  {
    id: 'prog-9',
    empresaId: 'emp-3',
    nombrePrograma: 'Programa de Control de Riesgos Biológicos',
    codigoPrograma: 'PRB-09',
    categoria: 'ESPECIFICO_EXPOSICION',
    descripcion: 'Vigilancia epidemiológica para personal expuesto a agentes biológicos (bacterias, virus, hongos, parásitos, fluidos corporales, picaduras o manejo de residuos biocontaminados).',
    baseLegal: 'R.M. 312-2011-MINSA / D.S. 015-2005-SA',
    medicoResponsable: 'Lic. Enf. Patricia Vargas (CEP 38920)',
    poblacionExpuestaTotal: 320,
    trabajadoresEnVigilancia: 320,
    casosSospechosos: 4,
    casosConfirmados: 0,
    metaCumplimientoPorcentaje: 100.0,
    avanceActualPorcentaje: 96.0,
    estado: 'ACTIVO',
    aplicaSegunRiesgo: true,
    periodicidadEvaluacion: 'Semestral',
    indicadoresClave: ['Accidentes por Pinchazo con Aguja', 'Reporte de Exposición a Fluidos', 'Cotejo de Serología Ocupacional']
  },
  {
    id: 'prog-10',
    empresaId: 'emp-1',
    nombrePrograma: 'Programa de Vigilancia por Exposición a Agentes Químicos',
    codigoPrograma: 'PAQ-10',
    categoria: 'ESPECIFICO_EXPOSICION',
    descripcion: 'Monitoreo biológico de exposición a vapores orgánicos, solventes, metales pesados (Plomo, Mercurio, Arsénico) y plaguicidas organofosforados (colinesterasa sérica/eritrocitaria).',
    baseLegal: 'D.S. 015-2005-SA (Valores Límite Permisibles Agentes Químicos)',
    medicoResponsable: 'Dr. Alejandro Morales Ramos (CMP 45120)',
    poblacionExpuestaTotal: 450,
    trabajadoresEnVigilancia: 450,
    casosSospechosos: 9,
    casosConfirmados: 1,
    metaCumplimientoPorcentaje: 95.0,
    avanceActualPorcentaje: 90.0,
    estado: 'ACTIVO',
    aplicaSegunRiesgo: true,
    periodicidadEvaluacion: 'Semestral / Anual',
    indicadoresClave: ['Dosaje de Plomo en Sangre (Plombemia)', 'Nivel de Acetilcolinesterasa', 'Fichas de Datos de Seguridad HDS/MSDS']
  },
  {
    id: 'prog-11',
    empresaId: 'emp-1',
    nombrePrograma: 'Programa de Vigilancia por Exposición a Radiaciones',
    codigoPrograma: 'PVR-11',
    categoria: 'ESPECIFICO_EXPOSICION',
    descripcion: 'Control dosimétrico personal para radiaciones ionizantes (Rayos X, gammagrafía industrial) y prevención de eritema/catarata por radiación ultravioleta (UV) solar en campo abierto.',
    baseLegal: 'Ley 28028 / Norma Técnica IPEN / R.M. 312-2011-MINSA',
    medicoResponsable: 'Ing. Especialista SST / Dr. Alejandro Morales',
    poblacionExpuestaTotal: 210,
    trabajadoresEnVigilancia: 210,
    casosSospechosos: 2,
    casosConfirmados: 0,
    metaCumplimientoPorcentaje: 100.0,
    avanceActualPorcentaje: 100.0,
    estado: 'ACTIVO',
    aplicaSegunRiesgo: true,
    periodicidadEvaluacion: 'Mensual (Dosimetría) / Semestral',
    indicadoresClave: ['Dosis Equivalente Mensual (mSv)', 'Inspección de EPP Plomado / Bloqueador Solar', 'Evaluación Dermatológica UV']
  },
  {
    id: 'prog-12',
    empresaId: 'emp-2',
    nombrePrograma: 'Programa de Vigilancia por Estrés Térmico',
    codigoPrograma: 'PET-12',
    categoria: 'ESPECIFICO_EXPOSICION',
    descripcion: 'Control de exposición a calor extremo (índice WBGT/TGBH > límites ACGIH) y áreas frías (cámaras frigoríficas), régimen de hidratación, aclimatación y pausas térmicas.',
    baseLegal: 'R.M. 375-2008-TR / R.M. 312-2011-MINSA',
    medicoResponsable: 'Dr. Alejandro Morales Ramos (CMP 45120)',
    poblacionExpuestaTotal: 380,
    trabajadoresEnVigilancia: 380,
    casosSospechosos: 7,
    casosConfirmados: 1,
    metaCumplimientoPorcentaje: 95.0,
    avanceActualPorcentaje: 89.5,
    estado: 'ACTIVO',
    aplicaSegunRiesgo: true,
    periodicidadEvaluacion: 'Trimestral / Monitoreo Diario',
    indicadoresClave: ['Monitoreo WBGT / TGBH', 'Consumo de Suero Oral Hydrolite', 'Incidentes de Agotamiento por Calor']
  }
];

export const MOCK_VACUNAS: RegistroVacuna[] = [
  // Juan Carlos Quispe (trab-1)
  {
    id: 'vac-1',
    trabajadorId: 'trab-1',
    vacunaNombre: 'Hepatitis B (Recombinante)',
    dosisNumero: 1,
    fechaAplicacion: '2022-01-10',
    lote: 'HEP-2022-X90',
    laboratorio: 'GlaxoSmithKline',
    aplicada: true,
    tieneProximoRefuerzo: false
  },
  {
    id: 'vac-2',
    trabajadorId: 'trab-1',
    vacunaNombre: 'Hepatitis B (Recombinante)',
    dosisNumero: 2,
    fechaAplicacion: '2022-02-12',
    lote: 'HEP-2022-X91',
    laboratorio: 'GlaxoSmithKline',
    aplicada: true,
    tieneProximoRefuerzo: false
  },
  {
    id: 'vac-3',
    trabajadorId: 'trab-1',
    vacunaNombre: 'Hepatitis B (Recombinante)',
    dosisNumero: 3,
    fechaAplicacion: '2022-04-10',
    lote: 'HEP-2022-X92',
    laboratorio: 'GlaxoSmithKline',
    aplicada: true,
    tieneProximoRefuerzo: false
  },
  {
    id: 'vac-4',
    trabajadorId: 'trab-1',
    vacunaNombre: 'Tétanos / TdaP (Difteria, Tétanos y Pertussis)',
    dosisNumero: 1,
    fechaAplicacion: '2024-02-15',
    lote: 'TET-2024-L02',
    laboratorio: 'Sanofi Pasteur',
    aplicada: true,
    tieneProximoRefuerzo: true,
    proximaDosisFecha: '2029-02-15'
  },
  {
    id: 'vac-5',
    trabajadorId: 'trab-1',
    vacunaNombre: 'Influenza Estacional 2026',
    dosisNumero: 1,
    fechaAplicacion: '2026-04-05',
    lote: 'FLU-2026-I09',
    laboratorio: 'Abbott / Influvac',
    aplicada: true,
    tieneProximoRefuerzo: true,
    proximaDosisFecha: '2027-04-05'
  },
  {
    id: 'vac-6',
    trabajadorId: 'trab-1',
    vacunaNombre: 'Fiebre Amarilla (Antiamarílica)',
    dosisNumero: 1,
    fechaAplicacion: '',
    lote: '',
    laboratorio: 'Bio-Manguinhos',
    aplicada: false,
    tieneProximoRefuerzo: true,
    proximaDosisFecha: '2026-09-01'
  },

  // María Elena Gonzales (trab-2)
  {
    id: 'vac-7',
    trabajadorId: 'trab-2',
    vacunaNombre: 'Hepatitis B (Recombinante)',
    dosisNumero: 1,
    fechaAplicacion: '2023-03-15',
    lote: 'HEP-2023-M01',
    laboratorio: 'GSK',
    aplicada: true,
    tieneProximoRefuerzo: false
  },
  {
    id: 'vac-8',
    trabajadorId: 'trab-2',
    vacunaNombre: 'Hepatitis B (Recombinante)',
    dosisNumero: 2,
    fechaAplicacion: '2023-04-18',
    lote: 'HEP-2023-M02',
    laboratorio: 'GSK',
    aplicada: true,
    tieneProximoRefuerzo: false
  },
  {
    id: 'vac-9',
    trabajadorId: 'trab-2',
    vacunaNombre: 'Hepatitis B (Recombinante)',
    dosisNumero: 3,
    fechaAplicacion: '',
    lote: '',
    laboratorio: 'GSK',
    aplicada: false,
    tieneProximoRefuerzo: true,
    proximaDosisFecha: '2026-08-15'
  },
  {
    id: 'vac-10',
    trabajadorId: 'trab-2',
    vacunaNombre: 'Influenza Estacional 2026',
    dosisNumero: 1,
    fechaAplicacion: '2026-05-10',
    lote: 'FLU-2026-I12',
    laboratorio: 'Sanofi Pasteur',
    aplicada: true,
    tieneProximoRefuerzo: true,
    proximaDosisFecha: '2027-05-10'
  },

  // Jorge Luis Benítez (trab-3)
  {
    id: 'vac-11',
    trabajadorId: 'trab-3',
    vacunaNombre: 'Tétanos / Td (Difteria y Tétanos Adultos)',
    dosisNumero: 1,
    fechaAplicacion: '2023-10-05',
    lote: 'TD-2023-B88',
    laboratorio: 'Serum Institute',
    aplicada: true,
    tieneProximoRefuerzo: true,
    proximaDosisFecha: '2028-10-05'
  },
  {
    id: 'vac-12',
    trabajadorId: 'trab-3',
    vacunaNombre: 'Neumococo 23-valente',
    dosisNumero: 1,
    fechaAplicacion: '2025-06-20',
    lote: 'NEU-2025-P10',
    laboratorio: 'Pfizer / Pneumovax',
    aplicada: true,
    tieneProximoRefuerzo: false
  },

  // Rosa Luz Campos (trab-4)
  {
    id: 'vac-13',
    trabajadorId: 'trab-4',
    vacunaNombre: 'Hepatitis A',
    dosisNumero: 1,
    fechaAplicacion: '2024-01-15',
    lote: 'HPA-2024-A01',
    laboratorio: 'Havrix / GSK',
    aplicada: true,
    tieneProximoRefuerzo: true,
    proximaDosisFecha: '2024-07-15'
  },
  {
    id: 'vac-14',
    trabajadorId: 'trab-4',
    vacunaNombre: 'Influenza Estacional 2026',
    dosisNumero: 1,
    fechaAplicacion: '',
    lote: '',
    laboratorio: 'Abbott',
    aplicada: false,
    tieneProximoRefuerzo: true,
    proximaDosisFecha: '2026-08-01'
  }
];

export const MOCK_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'aud-101',
    timestamp: '2026-07-28 21:45:12 UTC',
    usuario: 'Dr. Alejandro Morales (CMP 45120)',
    rol: 'MEDICO_OCUPACIONAL',
    accion: 'EMISION_APTITUDE_CERTIFICATE',
    recurso: 'EMO-2026-00891 / Trabajador: Juan Carlos Quispe',
    ip: '190.235.12.89',
    resultado: 'EXITO',
    detalles: 'Se emitió Certificado APTO CON RESTRICCIONES con 3 restricciones operativas registradas.'
  },
  {
    id: 'aud-102',
    timestamp: '2026-07-28 20:10:05 UTC',
    usuario: 'Ing. Carlos Mendoza (SST)',
    rol: 'ESPECIALISTA_SST',
    accion: 'CONSULTA_REST_APTITUD',
    recurso: 'Certificado Aptitud EMO-2026-00891',
    ip: '200.37.189.12',
    resultado: 'EXITO',
    detalles: 'Acceso a restricciones operativas sin desglose de diagnósticos médicos (Filtro Ley 29733).'
  },
  {
    id: 'aud-103',
    timestamp: '2026-07-28 18:30:00 UTC',
    usuario: 'Lic. Mariela Torres (Admin)',
    rol: 'ADMINISTRADOR',
    accion: 'PROGRAMACION_EMO_MASIVO',
    recurso: 'Módulo EMO / Empresa: Constructora del Pacífico',
    ip: '190.235.45.101',
    resultado: 'EXITO',
    detalles: 'Programación de 25 EMOs Periódicos para la Sede Obra Línea 3.'
  }
];

export const MOCK_PROTOCOLOS: ProtocoloExamenMedico[] = [
  {
    id: 'prot-1',
    empresaId: 'emp-1',
    nombreProtocolo: 'Protocolo Exámenes EMO Socavón y Alto Riesgo Minero',
    codigoProtocolo: 'PROT-MIN-2026-V2',
    sectorActividad: 'MINERIA',
    tipoEvaluacion: 'TODOS',
    normaLegalBase: 'R.M. 312-2011-MINSA Anexo 01 y D.S. 024-2016-EM',
    descripcionBateria: 'Triaje Completo, Medicina General, Espirometría Digital, Audiometría Tonal ISO, Radiografía de Tórax OIT 2000, Laboratorio Completo (Perfil Hepático, Renal, Plomo en Sangre, Hemograma, Glucosa), Psicología Ocupacional (>2500 msnm), Oftalmología y EKG.',
    estado: 'ACTIVO',
    version: '2.1',
    fechaAprobacion: '2025-08-15',
    fechaVencimiento: '2026-08-15',
    proximaRevisionFecha: '2026-08-15',
    archivoProtocolo: {
      nombreArchivo: 'Matriz_Protocolo_Examenes_Mineria_2026.xlsx',
      tipoArchivo: 'EXCEL',
      dataUrl: '',
      tamanioBytes: 154200,
      fechaSubida: '2026-01-15'
    }
  },
  {
    id: 'prot-2',
    empresaId: 'emp-2',
    nombreProtocolo: 'Protocolo Construcción Civil y Trabajos en Altura (>1.80m)',
    codigoProtocolo: 'PROT-CONST-2026',
    sectorActividad: 'CONSTRUCCION',
    tipoEvaluacion: 'PERIODICO',
    normaLegalBase: 'R.M. 312-2011-MINSA / G.050 Seguridad en Construcción',
    descripcionBateria: 'Evaluación Clínica Ocupacional, Triaje, Agudeza Visual Campimetría, Audiometría Screening, Electrocardiograma en reposo, Test Psicomecánico y Sensometric, Análisis Clínico (Hemograma, Glucosa, Grupo Rh).',
    estado: 'ACTIVO',
    version: '1.4',
    fechaAprobacion: '2025-08-08',
    fechaVencimiento: '2026-08-08',
    proximaRevisionFecha: '2026-08-08',
    archivoProtocolo: {
      nombreArchivo: 'Protocolo_EMO_Construccion_Altura.pdf',
      tipoArchivo: 'PDF',
      dataUrl: '',
      tamanioBytes: 389100,
      fechaSubida: '2025-08-08'
    }
  },
  {
    id: 'prot-3',
    empresaId: 'emp-3',
    nombreProtocolo: 'Protocolo Agroindustria, Movimientos Repetitivos y Plaguicidas',
    codigoProtocolo: 'PROT-AGRO-2026',
    sectorActividad: 'AGROINDUSTRIA',
    tipoEvaluacion: 'PERIODICO',
    normaLegalBase: 'R.M. 312-2011-MINSA y D.S. 005-2012-TR',
    descripcionBateria: 'Examen Físico Musculoesquelético (Ergonomía), Dosaje de Colinesterasa Sérica (Plaguicidas), Espirometría, Visión de Colores, Examen Dermatológico, Tamizaje de Salud Mental.',
    estado: 'ACTIVO',
    version: '1.0',
    fechaAprobacion: '2025-08-25',
    fechaVencimiento: '2026-08-25',
    proximaRevisionFecha: '2026-08-25',
    archivoProtocolo: {
      nombreArchivo: 'Bateria_Examenes_Agroindustria_Plaguicidas.xlsx',
      tipoArchivo: 'EXCEL',
      dataUrl: '',
      tamanioBytes: 98400,
      fechaSubida: '2025-08-25'
    }
  },
  {
    id: 'prot-4',
    empresaId: 'emp-1',
    nombreProtocolo: 'Protocolo Exámenes EMO Personal Administrativo y PVD',
    codigoProtocolo: 'PROT-ADM-2025',
    sectorActividad: 'GENERAL',
    tipoEvaluacion: 'PERIODICO',
    normaLegalBase: 'R.M. 312-2011-MINSA / R.M. 375-2008-TR',
    descripcionBateria: 'Evaluación de Agudeza Visual Campimetría, Cuestionario Ergonómico PVD, Laboratorio Básico, Electrocardiograma >40 años, Psicología laboral.',
    estado: 'REVISION',
    version: '1.2',
    fechaAprobacion: '2025-07-20',
    fechaVencimiento: '2026-07-20',
    proximaRevisionFecha: '2026-07-20',
    archivoProtocolo: {
      nombreArchivo: 'Protocolo_EMO_Administrativo_PVD.pdf',
      tipoArchivo: 'PDF',
      dataUrl: '',
      tamanioBytes: 210000,
      fechaSubida: '2025-07-20'
    }
  }
];
