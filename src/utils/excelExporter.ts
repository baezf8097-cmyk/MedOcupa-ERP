import * as XLSX from 'xlsx';
import { EMOExam, Trabajador, Empresa } from '../types/erp';

/**
 * Exporta el Consolidado General de Aptitud Médica Ocupacional de todos los trabajadores
 * a un archivo Excel (.xlsx) estructurado con columnas detalladas.
 */
export const exportConsolidadoAptitudExcel = (
  trabajadores: Trabajador[],
  emos: EMOExam[],
  empresas: Empresa[]
) => {
  // Construir filas de datos
  const data = trabajadores.map((t, index) => {
    // Buscar el EMO asignado
    const emo = emos.find(e => e.trabajadorId === t.id && e.aptitud) || emos.find(e => e.trabajadorId === t.id);
    const empresa = empresas.find(e => e.id === t.empresaId);
    const aptitud = emo?.aptitud;
    const resultado = aptitud?.resultado || 'SIN_EVALUACION';

    let aptitudLabel = 'PENDIENTE / SIN EVALUACIÓN';
    if (resultado === 'APTO') aptitudLabel = 'APTO';
    else if (resultado === 'APTO_CON_RESTRICCIONES') aptitudLabel = 'APTO CON RESTRICCIONES';
    else if (resultado === 'NO_APTO') aptitudLabel = 'NO APTO';
    else if (resultado === 'EVALUADO_NO_CONCLUIDO') aptitudLabel = 'EVALUADO NO CONCLUIDO';

    const restriccionesText = aptitud?.restricciones && aptitud.restricciones.length > 0
      ? aptitud.restricciones.map((r, i) => `${i + 1}. ${r}`).join('\n')
      : 'Sin restricciones';

    const recomendacionesText = aptitud?.recomendaciones && aptitud.recomendaciones.length > 0
      ? aptitud.recomendaciones.map((r, i) => `${i + 1}. ${r}`).join('\n')
      : 'Sin recomendaciones registradas';

    const motivoNoAptoText = resultado === 'NO_APTO'
      ? (aptitud?.motivoNoApto || 'No especificado (Revisar Ficha Médica)')
      : 'N/A (Apto / En proceso)';

    const vigilanciaText = aptitud?.vigilanciaSugerida && aptitud.vigilanciaSugerida.length > 0
      ? aptitud.vigilanciaSugerida.join(', ')
      : 'Vigilancia Epidemiológica Ocupacional';

    return {
      'N°': index + 1,
      'CÓDIGO EMO': emo?.codigoEMO || 'S/N',
      'APELLIDOS Y NOMBRES': `${t.apellidoPaterno} ${t.apellidoMaterno}, ${t.nombres}`,
      'TIPO DOC': t.tipoDocumento,
      'N° DOCUMENTO': t.numeroDocumento,
      'PUESTO DE TRABAJO': t.puestoTrabajo,
      'ÁREA': t.area,
      'EMPRESA / RAZÓN SOCIAL': empresa?.razonSocial || 'Empresa Principal',
      'RUC EMPRESA': empresa?.ruc || '-',
      'TIPO EMO': emo?.tipoEMO || 'PERIODICO',
      'DICTAMEN DE APTITUD': aptitudLabel,
      'MOTIVO / CAUSA (SI NO APTO)': motivoNoAptoText,
      'RESTRICCIONES OPERATIVAS': restriccionesText,
      'RECOMENDACIONES MÉDICAS': recomendacionesText,
      'VIGILANCIA SUGERIDA': vigilanciaText,
      'FECHA EMISIÓN': aptitud?.fechaEmision || emo?.fechaRealizada || '-',
      'FECHA VENCIMIENTO': aptitud?.fechaVencimiento || '-',
      'MÉDICO EVALUADOR': aptitud?.medicoFirmante || 'Dr. Alejandro Morales Ramos',
      'CMP / COLEGIATURA': aptitud?.cmpFirmante || 'CMP 45120'
    };
  });

  // Crear Hoja de Cálculo
  const ws = XLSX.utils.json_to_sheet(data);

  // Definir anchos de columna recomendados
  ws['!cols'] = [
    { wch: 5 },  // N°
    { wch: 16 }, // CÓDIGO EMO
    { wch: 32 }, // APELLIDOS Y NOMBRES
    { wch: 10 }, // TIPO DOC
    { wch: 14 }, // N° DOCUMENTO
    { wch: 25 }, // PUESTO DE TRABAJO
    { wch: 20 }, // ÁREA
    { wch: 28 }, // EMPRESA
    { wch: 14 }, // RUC
    { wch: 14 }, // TIPO EMO
    { wch: 24 }, // DICTAMEN DE APTITUD
    { wch: 35 }, // MOTIVO NO APTO
    { wch: 45 }, // RESTRICCIONES
    { wch: 40 }, // RECOMENDACIONES
    { wch: 25 }, // VIGILANCIA
    { wch: 14 }, // FECHA EMISION
    { wch: 14 }, // FECHA VENCIMIENTO
    { wch: 28 }, // MEDICO
    { wch: 20 }  // CMP
  ];

  // Crear Libro de Excel
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Consolidado Aptitud');

  // Guardar / Descargar archivo
  const fechaHoy = new Date().toISOString().split('T')[0];
  XLSX.writeFile(wb, `Matriz_Consolidada_Aptitud_Medica_${fechaHoy}.xlsx`);
};

/**
 * Exporta el Consolidado de Programaciones EMO y Exámenes Médicos Ocupacionales
 * incluyendo Fecha Examen, Tipo de Examen (Preocupacional, Periódico, Retiro, Cambio de Puesto)
 * y la lista de Exámenes/Pruebas Componentes a realizar según la RM 312-2011.
 */
export const exportProgramacionesEMOExcel = (
  emos: EMOExam[],
  trabajadores: Trabajador[],
  empresas: Empresa[]
) => {
  const data = emos.map((emo, index) => {
    const trab = trabajadores.find(t => t.id === emo.trabajadorId);
    const emp = empresas.find(e => e.id === (emo.empresaId || trab?.empresaId));

    // Mapear Tipo de EMO
    let tipoLabel: string = emo.tipoEMO || 'PERIODICO';
    if (emo.tipoEMO === 'INGRESO') tipoLabel = 'PREOCUPACIONAL (INGRESO)';
    else if (emo.tipoEMO === 'PERIODICO') tipoLabel = 'PERIÓDICO (ANUAL)';
    else if (emo.tipoEMO === 'RETIRO') tipoLabel = 'RETIRO (EGRESO)';
    else if (emo.tipoEMO === 'REUBICACION') tipoLabel = 'CAMBIO DE PUESTO / REUBICACIÓN';
    else if (emo.tipoEMO === 'POST_INCAPACIDAD') tipoLabel = 'POST INCAPACIDAD (>30 DÍAS)';

    // Construir lista de exámenes a realizar
    const evalObj = emo.evaluaciones;
    const examenesList: string[] = [];
    if (!evalObj || evalObj.triaje !== false) examenesList.push('Triaje & Antropometría');
    if (!evalObj || evalObj.medicinaGeneral !== false) examenesList.push('Medicina General');
    if (!evalObj || evalObj.audiometria !== false) examenesList.push('Audiometría Tonal');
    if (!evalObj || evalObj.espirometria !== false) examenesList.push('Espirometría Forzada');
    if (!evalObj || evalObj.radiografiaOIT !== false) examenesList.push('Radiografía de Tórax OIT');
    if (!evalObj || evalObj.laboratorio !== false) examenesList.push('Laboratorio Clínico Compl.');
    if (!evalObj || evalObj.psicologia !== false) examenesList.push('Evaluación Psicológica');
    if (!evalObj || evalObj.oftalmologia !== false) examenesList.push('Oftalmología / Visometría');
    if (!evalObj || evalObj.electrocardiograma !== false) examenesList.push('Electrocardiograma (EKG)');

    const examenesRequeridosText = examenesList.length > 0 
      ? examenesList.join(', ') 
      : 'Evaluaciones médicas ocupacionales según protocolo';

    // Formatear dictamen si existe
    const aptitud = emo.aptitud;
    let dictamenText = 'PENDIENTE / PROGRAMADO';
    if (aptitud?.resultado) {
      if (aptitud.resultado === 'APTO') dictamenText = 'APTO';
      else if (aptitud.resultado === 'APTO_CON_RESTRICCIONES') dictamenText = 'APTO CON RESTRICCIONES';
      else if (aptitud.resultado === 'NO_APTO') dictamenText = 'NO APTO';
      else if (aptitud.resultado === 'EVALUADO_NO_CONCLUIDO') dictamenText = 'EVALUADO NO CONCLUIDO';
    }

    return {
      'N°': index + 1,
      'CÓDIGO EMO': emo.codigoEMO,
      'FECHA PROGRAMADA': emo.fechaProgramada || '-',
      'FECHA REALIZADA': emo.fechaRealizada || 'Pendiente de Atención',
      'TIPO DE EXAMEN': tipoLabel,
      'EXÁMENES Y PRUEBAS A REALIZAR': examenesRequeridosText,
      'ESTADO PROGRAMACIÓN': (emo.estado || 'PROGRAMADO').replace('_', ' '),
      'TRABAJADOR': trab ? `${trab.apellidoPaterno} ${trab.apellidoMaterno}, ${trab.nombres}` : 'Trabajador no hallado',
      'TIPO DOC': trab?.tipoDocumento || 'DNI',
      'N° DOCUMENTO': trab?.numeroDocumento || '-',
      'PUESTO DE TRABAJO': trab?.puestoTrabajo || '-',
      'ÁREA': trab?.area || '-',
      'EMPRESA / RAZÓN SOCIAL': emp?.razonSocial || emp?.nombreComercial || 'Empresa Principal',
      'RUC EMPRESA': emp?.ruc || '-',
      'PROTOCOLO APLICADO': emo.protocoloAplicado || 'Protocolo RM 312-2011-MINSA',
      'DICTAMEN FINAL': dictamenText,
      'COSTO EMO (S/.)': emo.costoEMO ? Number(emo.costoEMO).toFixed(2) : '0.00'
    };
  });

  const ws = XLSX.utils.json_to_sheet(data);

  ws['!cols'] = [
    { wch: 5 },  // N°
    { wch: 16 }, // CÓDIGO EMO
    { wch: 18 }, // FECHA PROGRAMADA
    { wch: 18 }, // FECHA REALIZADA
    { wch: 32 }, // TIPO DE EXAMEN
    { wch: 60 }, // EXÁMENES Y PRUEBAS A REALIZAR
    { wch: 22 }, // ESTADO PROGRAMACION
    { wch: 32 }, // TRABAJADOR
    { wch: 10 }, // TIPO DOC
    { wch: 14 }, // N° DOCUMENTO
    { wch: 25 }, // PUESTO DE TRABAJO
    { wch: 20 }, // ÁREA
    { wch: 28 }, // EMPRESA
    { wch: 14 }, // RUC
    { wch: 40 }, // PROTOCOLO
    { wch: 24 }, // DICTAMEN
    { wch: 15 }  // COSTO
  ];

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Programación EMO');

  const fechaHoy = new Date().toISOString().split('T')[0];
  XLSX.writeFile(wb, `Consolidado_Programaciones_EMO_${fechaHoy}.xlsx`);
};
