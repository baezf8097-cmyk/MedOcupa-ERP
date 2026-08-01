import { jsPDF } from 'jspdf';
import { EMOExam, Trabajador, Empresa, AusentismoMedico } from '../types/erp';

/**
 * Genera el Certificado de Aptitud Médica Ocupacional (Anexo 03 R.M. 312-2011-MINSA)
 * Cumple estrictamente con el formato oficial del Ministerio de Salud del Perú.
 */
export const generarCertificadoAnexo3PDF = (
  emo: EMOExam,
  trabajador: Trabajador,
  empresa: Empresa,
  firmaBase64?: string
): void => {
  const doc = new jsPDF({
    orientation: 'p',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  let y = 12;

  // --- CABECERA Y ENCABEZADO MINSA ---
  doc.setFillColor(15, 23, 42); // slate-900
  doc.rect(10, y, pageWidth - 20, 18, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('REPUBLICA DEL PERU - MINISTERIO DE SALUD', pageWidth / 2, y + 6, { align: 'center' });
  doc.setFontSize(10);
  doc.text('CERTIFICADO DE APTITUD MEDICA OCUPACIONAL', pageWidth / 2, y + 11, { align: 'center' });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.text('ANEXO N° 03 - R.M. 312-2011-MINSA / R.M. 004-2014-MINSA', pageWidth / 2, y + 15, { align: 'center' });

  y += 22;

  // CODIGO EMO Y FECHA
  doc.setDrawColor(148, 163, 184); // slate-400
  doc.setLineWidth(0.3);
  doc.rect(10, y, pageWidth - 20, 8);
  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.text(`N° CERTIFICADO EMO: ${emo.codigoEMO}`, 14, y + 5.5);
  doc.text(`FECHA DE EXAMEN: ${emo.fechaRealizada || emo.fechaProgramada}`, pageWidth - 70, y + 5.5);

  y += 12;

  // SECCION I: DATOS DE LA EMPRESA
  doc.setFillColor(226, 232, 240); // slate-200
  doc.rect(10, y, pageWidth - 20, 5, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(15, 23, 42);
  doc.text('I. DATOS DE LA EMPRESA Y LUGAR DE TRABAJO', 12, y + 3.8);

  y += 5;

  doc.rect(10, y, pageWidth - 20, 18);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.text(`RAZON SOCIAL: ${empresa.razonSocial}`, 12, y + 5);
  doc.text(`RUC: ${empresa.ruc}`, 120, y + 5);
  doc.text(`DIRECCION / SEDE: ${empresa.direccion} (${empresa.distrito} - ${empresa.provincia} - ${empresa.departamento})`, 12, y + 10);
  doc.text(`ACTIVIDAD ECONOMICA / CIIU: ${empresa.actividadEconomica} (CIIU ${empresa.ciiu})`, 12, y + 15);

  y += 22;

  // SECCION II: DATOS DEL TRABAJADOR
  doc.setFillColor(226, 232, 240);
  doc.rect(10, y, pageWidth - 20, 5, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.text('II. DATOS FILIATORIOS DEL TRABAJADOR', 12, y + 3.8);

  y += 5;

  doc.rect(10, y, pageWidth - 20, 24);
  doc.setFont('helvetica', 'normal');
  const nombreCompleto = `${trabajador.apellidoPaterno} ${trabajador.apellidoMaterno}, ${trabajador.nombres}`;
  doc.text(`APELLIDOS Y NOMBRES: ${nombreCompleto}`, 12, y + 5);
  doc.text(`TIPO Y N° DOC: ${trabajador.tipoDocumento} ${trabajador.numeroDocumento}`, 120, y + 5);
  doc.text(`FECHA NACIMIENTO: ${trabajador.fechaNacimiento}`, 12, y + 10);
  doc.text(`SEXO: ${trabajador.sexo === 'M' ? 'MASCULINO' : 'FEMENINO'}`, 80, y + 10);
  doc.text(`TELEFONO: ${trabajador.telefono}`, 120, y + 10);
  doc.text(`PUESTO DE TRABAJO: ${trabajador.puestoTrabajo}`, 12, y + 15);
  doc.text(`AREA / GRUPO OCUPACIONAL: ${trabajador.area} / ${trabajador.grupoOcupacional}`, 12, y + 20);

  y += 28;

  // SECCION III: TIPO DE EVALUACION MEDICA
  doc.setFillColor(226, 232, 240);
  doc.rect(10, y, pageWidth - 20, 5, 'F');
  doc.setFont('helvetica', 'bold');
  doc.text('III. TIPO DE EXAMEN MEDICO OCUPACIONAL (R.M. 312-2011)', 12, y + 3.8);

  y += 5;

  doc.rect(10, y, pageWidth - 20, 10);
  doc.setFont('helvetica', 'normal');

  const tipo = emo.tipoEMO;
  const checkIngreso = tipo === 'INGRESO' ? '[X]' : '[  ]';
  const checkPeriodico = tipo === 'PERIODICO' ? '[X]' : '[  ]';
  const checkRetiro = tipo === 'RETIRO' ? '[X]' : '[  ]';
  const checkReubicacion = tipo === 'REUBICACION' ? '[X]' : '[  ]';
  const checkPostIncap = tipo === 'POST_INCAPACIDAD' ? '[X]' : '[  ]';

  doc.text(`${checkIngreso} PRE-OCUPACIONAL`, 14, y + 6);
  doc.text(`${checkPeriodico} PERIODICO`, 55, y + 6);
  doc.text(`${checkRetiro} RETIRO`, 90, y + 6);
  doc.text(`${checkReubicacion} REUBICACION`, 120, y + 6);
  doc.text(`${checkPostIncap} REINCORPORACION`, 155, y + 6);

  y += 14;

  // SECCION IV: DICTAMEN DE APTITUD MEDICA OCUPACIONAL
  doc.setFillColor(15, 23, 42);
  doc.rect(10, y, pageWidth - 20, 6, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.text('IV. DICTAMEN DE APTITUD MEDICA OCUPACIONAL', 12, y + 4.2);

  y += 6;

  const resultado = emo.aptitud?.resultado || 'APTO';

  // Draw 4 Boxes for Aptitude
  const boxWidth = (pageWidth - 20) / 4;
  const aptitudes = [
    { key: 'APTO', label: 'APTO', desc: 'Para el puesto evaluado' },
    { key: 'APTO_CON_RESTRICCIONES', label: 'APTO CON RESTRICCIÓN', desc: 'Sujeto a adaptaciones' },
    { key: 'NO_APTO', label: 'NO APTO', desc: 'No apto para el puesto' },
    { key: 'EVALUADO_NO_CONCLUIDO', label: 'OBSERVADO', desc: 'Exámenes pendientes' }
  ];

  aptitudes.forEach((apt, idx) => {
    const boxX = 10 + idx * boxWidth;
    const isSelected = resultado === apt.key;

    if (isSelected) {
      if (apt.key === 'APTO') doc.setFillColor(220, 252, 231); // emerald-100
      else if (apt.key === 'APTO_CON_RESTRICCIONES') doc.setFillColor(254, 243, 199); // amber-100
      else if (apt.key === 'NO_APTO') doc.setFillColor(254, 226, 226); // rose-100
      else doc.setFillColor(241, 245, 249);
      doc.rect(boxX, y, boxWidth, 16, 'F');
    }

    doc.setDrawColor(148, 163, 184);
    doc.rect(boxX, y, boxWidth, 16);

    doc.setTextColor(15, 23, 42);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    const boxMark = isSelected ? '[ X ]' : '[   ]';
    doc.text(`${boxMark} ${apt.label}`, boxX + 3, y + 6);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.5);
    doc.text(apt.desc, boxX + 3, y + 11);
  });

  y += 20;

  // SECCION V: RESTRICCIONES Y RECOMENDACIONES
  doc.setFillColor(226, 232, 240);
  doc.rect(10, y, pageWidth - 20, 5, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(15, 23, 42);
  doc.text('V. RESTRICCIONES Y RECOMENDACIONES OCUPACIONALES', 12, y + 3.8);

  y += 5;

  doc.rect(10, y, pageWidth - 20, 36);

  // Restricciones
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.text('RESTRICCIONES OPERATIVAS:', 12, y + 5);
  doc.setFont('helvetica', 'normal');

  const restricciones = emo.aptitud?.restricciones || ['Ninguna restricción para el puesto de trabajo.'];
  let ry = y + 9;
  restricciones.forEach((rest, i) => {
    if (i < 3) {
      doc.text(`• ${rest}`, 14, ry);
      ry += 4.5;
    }
  });

  // Recomendaciones
  doc.setFont('helvetica', 'bold');
  doc.text('RECOMENDACIONES MEDICO PREVENTIVAS:', 12, y + 23);
  doc.setFont('helvetica', 'normal');

  const recomendaciones = emo.aptitud?.recomendaciones || [
    'Mantener estilos de vida saludable y participar en las pausas activas.',
    'Uso obligatorio de EPP conforme a la matriz IPERC del puesto de trabajo.'
  ];
  let recy = y + 27;
  recomendaciones.forEach((rec, i) => {
    if (i < 2) {
      doc.text(`• ${rec}`, 14, recy);
      recy += 4.5;
    }
  });

  y += 40;

  // VIGENCIA DEL CERTIFICADO
  doc.rect(10, y, pageWidth - 20, 8);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.text(`FECHA EMISION: ${emo.aptitud?.fechaEmision || emo.fechaProgramada}`, 14, y + 5.5);
  doc.text(`FECHA VENCIMIENTO: ${emo.aptitud?.fechaVencimiento || '2027-06-16'}`, 80, y + 5.5);
  doc.text(`VIGENCIA: 1 ANO (D.S. 005-2012-TR)`, 145, y + 5.5);

  y += 14;

  // SECCION VI: FIRMA Y SELLO DEL MEDICO OCUPACIONAL
  doc.rect(10, y, pageWidth - 20, 35);

  // Left side: Signature space
  const sigX = 25;
  const sigY = y + 5;

  if (firmaBase64) {
    try {
      doc.addImage(firmaBase64, 'PNG', sigX + 5, sigY, 40, 18);
    } catch (e) {
      console.warn('Could not embed base64 signature image in PDF', e);
    }
  }

  doc.line(sigX, sigY + 20, sigX + 50, sigY + 20);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.text('FIRMA Y SELLO DEL MEDICO EVALUADOR', sigX, sigY + 24);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.text(emo.aptitud?.medicoFirmante || 'Dr. Alejandro Morales Ramos', sigX, sigY + 27.5);
  doc.text(`CMP: ${emo.aptitud?.cmpFirmante || '45120'} | RNM: 02845 (Especialista en Salud Ocupacional)`, sigX, sigY + 31);

  // Right side: Worker acknowledgement
  const workerX = pageWidth - 80;
  doc.line(workerX, sigY + 20, workerX + 55, sigY + 20);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.text('FIRMA DEL TRABAJADOR EVALUADO', workerX, sigY + 24);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.text('Declaro haber recibido copia conforme del Certificado.', workerX, sigY + 27.5);
  doc.text(`DNI / CE N°: ${trabajador.numeroDocumento}`, workerX, sigY + 31);

  // FOOTER NOTE
  doc.setFontSize(6);
  doc.setTextColor(100, 116, 139);
  doc.text(
    'Documento emitido conforme al Anexo 03 de la R.M. 312-2011-MINSA. Custodia de la Historia Clínica en archivo físico/digital por 20 años.',
    pageWidth / 2,
    pageHeightFooter(doc),
    { align: 'center' }
  );

  // Save PDF
  const filename = `CAMO_Anexo3_${trabajador.numeroDocumento}_${emo.codigoEMO}.pdf`;
  doc.save(filename);
};

/**
 * Genera la Carta de Notificación Operativa para Recursos Humanos / SST
 * Cumple estrictamente con la Ley N° 29733 de Protección de Datos Personales en Salud.
 * NO contiene diagnósticos médicos ni códigos CIE-10.
 */
export const generarNotificacionRRHHPDF = (
  emo: EMOExam,
  trabajador: Trabajador,
  empresa: Empresa,
  firmaBase64?: string
): void => {
  const doc = new jsPDF({
    orientation: 'p',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  let y = 14;

  // HEADER BANNER
  doc.setFillColor(30, 41, 59); // slate-800
  doc.rect(10, y, pageWidth - 20, 20, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('SISTEMA DE SALUD Y SEGURIDAD EN EL TRABAJO - LEY N° 29783', pageWidth / 2, y + 7, { align: 'center' });
  doc.setFontSize(10);
  doc.text('CARTA DE NOTIFICACION OPERATIVA DE APTITUD LABORAL PARA RR.HH. / SST', pageWidth / 2, y + 13, { align: 'center' });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.text('Documento estrictamente operativo - Filtro de Privacidad Sanitaria (Ley N° 29733 / D.S. 003-2013-JUS)', pageWidth / 2, y + 17.5, { align: 'center' });

  y += 25;

  // LEY 29733 PRIVACY DISCLAIMER BOX
  doc.setFillColor(254, 243, 199); // amber-100
  doc.setDrawColor(245, 158, 11); // amber-500
  doc.rect(10, y, pageWidth - 20, 12, 'FD');

  doc.setTextColor(120, 53, 15); // amber-900
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.text('AVISO DE CONFIDENCIALIDAD SANITARIA (LEY N° 29733):', 13, y + 4.5);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.text(
    'En cumplimiento del Art. 25 de la Ley N° 29733 de Protección de Datos Personales y la R.M. 312-2011-MINSA, este informe omite diagnósticos clínicos y códigos CIE-10, conteniendo únicamente el dictamen de aptitud y las restricciones operativas necesarias para la readecuación del puesto.',
    13,
    y + 8.5,
    { maxWidth: pageWidth - 26 }
  );

  y += 16;

  // SECCION 1: DESTINATARIO Y DATOS DE LA EMPRESA
  doc.setDrawColor(148, 163, 184);
  doc.rect(10, y, pageWidth - 20, 18);
  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.text(`EMPRESA CLIENTE: ${empresa.razonSocial} (RUC: ${empresa.ruc})`, 13, y + 5);
  doc.text(`SEDE / PLANTA: ${empresa.direccion}`, 13, y + 10);
  doc.text(`DESTINATARIO: Jefatura de Recursos Humanos / Comité de Seguridad y Salud en el Trabajo`, 13, y + 15);

  y += 22;

  // SECCION 2: TRABAJADOR EVALUADO
  doc.setFillColor(241, 245, 249);
  doc.rect(10, y, pageWidth - 20, 5, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.text('DATOS DEL TRABAJADOR Y PUESTO OCUPACIONAL', 13, y + 3.8);

  y += 5;

  doc.rect(10, y, pageWidth - 20, 20);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  const nombreCompleto = `${trabajador.apellidoPaterno} ${trabajador.apellidoMaterno}, ${trabajador.nombres}`;
  doc.text(`TRABAJADOR: ${nombreCompleto}`, 13, y + 5);
  doc.text(`DOCUMENTO DE IDENTIDAD: ${trabajador.tipoDocumento} ${trabajador.numeroDocumento}`, 120, y + 5);
  doc.text(`PUESTO EVALUADO: ${trabajador.puestoTrabajo}`, 13, y + 10);
  doc.text(`AREA / DEPARTAMENTO: ${trabajador.area}`, 120, y + 10);
  doc.text(`EVALUACION REALIZADA: Examen Médico Ocupacional (${emo.tipoEMO}) - N° ${emo.codigoEMO}`, 13, y + 15);

  y += 24;

  // SECCION 3: DICTAMEN OPERATIVO DE APTITUD
  doc.setFillColor(30, 41, 59);
  doc.rect(10, y, pageWidth - 20, 6, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.text('DICTAMEN MEDICO OCUPACIONAL RESULTANTE', 13, y + 4.2);

  y += 6;

  const resultado = emo.aptitud?.resultado || 'APTO';
  doc.setDrawColor(148, 163, 184);
  doc.rect(10, y, pageWidth - 20, 16);

  if (resultado === 'APTO') {
    doc.setFillColor(220, 252, 231);
    doc.rect(12, y + 2, pageWidth - 24, 12, 'F');
    doc.setTextColor(22, 101, 52);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.text('ESTADO OPERATIVO: APTO PARA EL PUESTO DE TRABAJO', 16, y + 9);
  } else if (resultado === 'APTO_CON_RESTRICCIONES') {
    doc.setFillColor(254, 243, 199);
    doc.rect(12, y + 2, pageWidth - 24, 12, 'F');
    doc.setTextColor(146, 64, 14);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.text('ESTADO OPERATIVO: APTO CON RESTRICCIONES REQUERIDAS', 16, y + 9);
  } else {
    doc.setFillColor(254, 226, 226);
    doc.rect(12, y + 2, pageWidth - 24, 12, 'F');
    doc.setTextColor(153, 27, 27);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.text('ESTADO OPERATIVO: NO APTO / EVALUACION OBSERVADA', 16, y + 9);
  }

  y += 20;

  // SECCION 4: RESTRICCIONES Y RECOMENDACIONES OPERATIVAS
  doc.setFillColor(241, 245, 249);
  doc.rect(10, y, pageWidth - 20, 5, 'F');
  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.text('ACCI0NES Y RESTRICCIONES OPERATIVAS PARA RECURSOS HUMANOS / SST', 13, y + 3.8);

  y += 5;

  doc.rect(10, y, pageWidth - 20, 42);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.text('RESTRICCIONES LABORALES OBLIGATORIAS:', 13, y + 6);
  doc.setFont('helvetica', 'normal');

  const restricciones = emo.aptitud?.restricciones || ['El trabajador se encuentra APTO sin ninguna restricción operativa.'];
  let ry = y + 11;
  restricciones.forEach((r, idx) => {
    if (idx < 3) {
      doc.text(`[!] ${r}`, 15, ry);
      ry += 5;
    }
  });

  doc.setFont('helvetica', 'bold');
  doc.text('RECOMENDACIONES PARA EL SUPERVISOR DE SST:', 13, y + 26);
  doc.setFont('helvetica', 'normal');

  const recomendaciones = emo.aptitud?.recomendaciones || [
    'Garantizar el cumplimiento de las pausas activas durante la jornada.',
    'Verificar la dotación adecuada y ajuste de EPP específico.'
  ];
  let recy = y + 31;
  recomendaciones.forEach((rec, idx) => {
    if (idx < 2) {
      doc.text(`[•] ${rec}`, 15, recy);
      recy += 5;
    }
  });

  y += 46;

  // SECCION 5: VIGENCIA Y FIRMAS
  doc.rect(10, y, pageWidth - 20, 32);

  const sigX = 25;
  const sigY = y + 4;

  if (firmaBase64) {
    try {
      doc.addImage(firmaBase64, 'PNG', sigX + 5, sigY, 38, 16);
    } catch (e) {
      console.warn('Could not embed base64 signature in HR notification', e);
    }
  }

  doc.line(sigX, sigY + 18, sigX + 50, sigY + 18);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.text('FIRMA Y SELLO MEDICO OCUPACIONAL', sigX, sigY + 22);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.text(emo.aptitud?.medicoFirmante || 'Dr. Alejandro Morales Ramos', sigX, sigY + 25.5);
  doc.text(`CMP: ${emo.aptitud?.cmpFirmante || '45120'} | Médico Ocupacional`, sigX, sigY + 29);

  const rhX = pageWidth - 80;
  doc.line(rhX, sigY + 18, rhX + 55, sigY + 18);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.text('RECEPCION RECURSOS HUMANOS / SST', rhX, sigY + 22);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.text('Cargo / Fecha de Recepción:', rhX, sigY + 25.5);
  doc.text('Firma y Sello de Recepción', rhX, sigY + 29);

  doc.setFontSize(6);
  doc.setTextColor(100, 116, 139);
  doc.text(
    'Notificación emitida bajo las pautas de la Ley N° 29783 de SST y el Reglamento D.S. 005-2012-TR.',
    pageWidth / 2,
    pageHeightFooter(doc),
    { align: 'center' }
  );

  const filename = `Notificacion_RRHH_${trabajador.numeroDocumento}_${emo.codigoEMO}.pdf`;
  doc.save(filename);
};

/**
 * Genera el Certificado de Descanso Médico en formato PDF oficial.
 */
export const generarCertificadoDescansoMedicoPDF = (
  ausentismo: AusentismoMedico,
  trabajador?: Trabajador,
  empresa?: Empresa
): jsPDF => {
  const doc = new jsPDF({
    orientation: 'p',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  let y = 12;

  // Header MINSA / ESSALUD / CITT
  doc.setFillColor(15, 23, 42); // slate-900
  doc.rect(10, y, pageWidth - 20, 20, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('CERTIFICADO DE DESCANSO MEDICO OCUPACIONAL', pageWidth / 2, y + 7, { align: 'center' });
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text('LEY N° 26790 - D.S. 009-97-SA / R.M. 312-2011-MINSA', pageWidth / 2, y + 13, { align: 'center' });
  doc.setFontSize(8);
  doc.text(`CÓDIGO REGISTRO: ${ausentismo.id.toUpperCase()}`, pageWidth / 2, y + 17, { align: 'center' });

  y += 25;

  // DATOS DEL TRABAJADOR Y EMPRESA
  doc.setFillColor(241, 245, 249);
  doc.rect(10, y, pageWidth - 20, 6, 'F');
  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.text('I. DATOS DEL TRABAJADOR Y ENTIDAD EMPLEADORA', 12, y + 4.2);

  y += 8;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  const nombreTrabajador = trabajador ? `${trabajador.apellidoPaterno} ${trabajador.apellidoMaterno} ${trabajador.nombres}` : 'Trabajador Registrado';
  const docIdentidad = trabajador ? `${trabajador.tipoDocumento}: ${trabajador.numeroDocumento}` : 'DNI N/A';
  const nombreEmpresa = empresa ? empresa.razonSocial : 'Empresa Cliente';
  const rucEmpresa = empresa ? `RUC: ${empresa.ruc}` : '';

  doc.text(`Apellidos y Nombres: ${nombreTrabajador}`, 14, y);
  doc.text(`Documento: ${docIdentidad}`, 120, y);
  y += 5;
  doc.text(`Puesto de Trabajo: ${trabajador?.puestoTrabajo || 'Operativo'}`, 14, y);
  doc.text(`Área: ${trabajador?.area || 'Operaciones'}`, 120, y);
  y += 5;
  doc.text(`Empresa Empleadora: ${nombreEmpresa}`, 14, y);
  doc.text(`${rucEmpresa}`, 120, y);

  y += 8;

  // SECCION II: DETALLE CLINICO Y PERIODO DE DESCANSO
  doc.setFillColor(241, 245, 249);
  doc.rect(10, y, pageWidth - 20, 6, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.text('II. DIAGNÓSTICO CLÍNICO Y PERÍODO DE INCAPACIDAD TEMPORAL', 12, y + 4.2);

  y += 8;

  doc.setFont('helvetica', 'bold');
  doc.text(`Tipo de Ausencia / Contingencia:`, 14, y);
  doc.setFont('helvetica', 'normal');
  doc.text(`${ausentismo.tipoAusencia.replace('_', ' ')}`, 65, y);
  y += 5;

  doc.setFont('helvetica', 'bold');
  doc.text(`Código CIE-10 / Diagnóstico:`, 14, y);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(16, 185, 129);
  doc.text(`${ausentismo.codigoCIE10} - ${ausentismo.descripcionCIE10}`, 65, y);
  doc.setTextColor(15, 23, 42);
  y += 6;

  doc.setFont('helvetica', 'bold');
  doc.text(`Fecha Inicio Descanso:`, 14, y);
  doc.setFont('helvetica', 'normal');
  doc.text(`${ausentismo.fechaInicio}`, 65, y);

  doc.setFont('helvetica', 'bold');
  doc.text(`Fecha Fin Descanso:`, 120, y);
  doc.setFont('helvetica', 'normal');
  doc.text(`${ausentismo.fechaFin}`, 160, y);
  y += 6;

  doc.setFont('helvetica', 'bold');
  doc.text(`Días Totales de Incapacidad:`, 14, y);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(217, 119, 6);
  doc.text(`${ausentismo.diasTotales} DÍAS INHÁBILES`, 65, y);
  doc.setTextColor(15, 23, 42);

  doc.setFont('helvetica', 'bold');
  doc.text(`Estatus ESSALUD (Día 21+):`, 120, y);
  doc.setFont('helvetica', 'normal');
  doc.text(ausentismo.diasTotales > 20 ? 'Requiere CITT ESSALUD' : 'A cargo del empleador (d1-20)', 160, y);
  y += 8;

  // SECCION III: CENTRO MEDICO Y MEDICO TRATANTE
  doc.setFillColor(241, 245, 249);
  doc.rect(10, y, pageWidth - 20, 6, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.text('III. CENTRO MÉDICO EMISOR Y MÉDICO TRATANTE', 12, y + 4.2);

  y += 8;

  doc.setFont('helvetica', 'normal');
  doc.text(`Centro Médico Emisor: ${ausentismo.centroMedicoEmisor}`, 14, y);
  y += 5;
  doc.text(`Médico Tratante / Especialista: ${ausentismo.medicoTratante}`, 14, y);
  doc.text(`Colegiatura: ${ausentismo.cmpMedicoTratante}`, 120, y);

  y += 20;

  // FIRMA Y SELLO
  doc.line(30, y, 90, y);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.text('FIRMA Y SELLO DEL MÉDICO TRATANTE', 30, y + 4);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.text(`${ausentismo.medicoTratante}`, 30, y + 8);
  doc.text(`${ausentismo.cmpMedicoTratante}`, 30, y + 11);

  doc.line(120, y, 180, y);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.text('VALIDACIÓN Y RECEPCIÓN SALUD OCUPACIONAL', 120, y + 4);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.text('ERP MedOcupa - Gestión de Ausentismo', 120, y + 8);

  y += 20;

  doc.setFontSize(6.5);
  doc.setTextColor(100, 116, 139);
  doc.text('Documento médico oficial registrado en el ERP MedOcupa para efectos de subsidios y gestión de Salud Ocupacional.', pageWidth / 2, pageHeightFooter(doc), { align: 'center' });

  return doc;
};

export const descargarCertificadoDescansoMedicoPDF = (
  ausentismo: AusentismoMedico,
  trabajador?: Trabajador,
  empresa?: Empresa
) => {
  const doc = generarCertificadoDescansoMedicoPDF(ausentismo, trabajador, empresa);
  const fileName = `Certificado_Descanso_Medico_${trabajador?.numeroDocumento || 'Trabajador'}_${ausentismo.codigoCIE10}.pdf`;
  doc.save(fileName);
};

export const generarDataUrlDescansoMedicoPDF = (
  ausentismo: AusentismoMedico,
  trabajador?: Trabajador,
  empresa?: Empresa
): string => {
  const doc = generarCertificadoDescansoMedicoPDF(ausentismo, trabajador, empresa);
  return doc.output('datauristring');
};

function pageHeightFooter(doc: jsPDF): number {
  return doc.internal.pageSize.getHeight() - 8;
}
