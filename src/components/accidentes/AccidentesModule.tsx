import React, { useState } from 'react';
import { jsPDF } from 'jspdf';
import { AccidenteIncidente, Trabajador, Empresa, CertificadoMedicoPdf } from '../../types/erp';
import { 
  AlertTriangle, Plus, ShieldAlert, Clock, CheckCircle2, FileText, Send, 
  Upload, Eye, Download, Trash2, Calendar, Search, Filter, X, Edit3, FileSpreadsheet, UserPlus
} from 'lucide-react';

interface AccidentesModuleProps {
  accidentes: AccidenteIncidente[];
  trabajadores: Trabajador[];
  empresas: Empresa[];
  onAddAccidente: (acc: AccidenteIncidente) => void;
  onUpdateAccidente?: (acc: AccidenteIncidente) => void;
  onDeleteAccidente?: (id: string) => void;
}

export const AccidentesModule: React.FC<AccidentesModuleProps> = ({
  accidentes,
  trabajadores,
  empresas,
  onAddAccidente,
  onUpdateAccidente,
  onDeleteAccidente
}) => {
  const [showModal, setShowModal] = useState(false);
  const [editingAccidente, setEditingAccidente] = useState<AccidenteIncidente | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTipo, setFilterTipo] = useState<string>('TODOS');
  const [previewPdf, setPreviewPdf] = useState<CertificadoMedicoPdf | null>(null);
  const [deletingAccidente, setDeletingAccidente] = useState<AccidenteIncidente | null>(null);

  const [formData, setFormData] = useState<{
    trabajadorSelectionMode: 'REGISTRADO' | 'MANUAL';
    trabajadorId: string;
    trabajadorNombreCustom: string;
    trabajadorDniCustom: string;
    empresaId: string;
    tipo: 'ACCIDENTE_LEVE' | 'ACCIDENTE_INCAPACITANTE' | 'ACCIDENTE_MORTAL' | 'INCIDENTE_PELIGROSO';
    fechaHora: string;
    lugarExacto: string;
    descripcionHechos: string;
    parteCuerpoAfectada: string;
    diagnosticoCIE10: string;
    diasIncapacidad: number;
    notificadoMTPE: boolean;
    codigoRegistroSAT: string;
    causasRaizStr: string;
    medidasCorrectivasStr: string;
    estadoInvestigacion: 'EN_INVESTIGACION' | 'CERRADO' | 'PENDIENTE_MEDIDAS';
    archivoPdf?: CertificadoMedicoPdf;
  }>({
    trabajadorSelectionMode: 'REGISTRADO',
    trabajadorId: trabajadores[0]?.id || '',
    trabajadorNombreCustom: '',
    trabajadorDniCustom: '',
    empresaId: empresas[0]?.id || 'emp-1',
    tipo: 'ACCIDENTE_INCAPACITANTE',
    fechaHora: '2026-07-28 14:30',
    lugarExacto: 'Área de Planta / Socavón Principal',
    descripcionHechos: 'Resbalón durante maniobra de mantenimiento.',
    parteCuerpoAfectada: 'Tobillo derecho (Esguince Grado II)',
    diagnosticoCIE10: 'S93.4',
    diasIncapacidad: 5,
    notificadoMTPE: true,
    codigoRegistroSAT: 'SAT-MTPE-2026-0012',
    causasRaizStr: 'Falta de orden y limpieza en pasadizo, Uso inadecuado de calzado antideslizante',
    medidasCorrectivasStr: 'Inspección diaria de pasillos, Dotación de calzado de seguridad con cocada de agarre',
    estadoInvestigacion: 'EN_INVESTIGACION',
    archivoPdf: undefined
  });

  // Helper PDF Upload
  const handlePdfUpload = (
    file: File,
    onSuccess: (pdfData: CertificadoMedicoPdf) => void
  ) => {
    if (file.type !== 'application/pdf') {
      alert('Por favor seleccione un archivo en formato PDF.');
      return;
    }
    if (file.size > 15 * 1024 * 1024) {
      alert('El archivo PDF supera el tamaño máximo permitido de 15 MB.');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      onSuccess({
        nombreArchivo: file.name,
        dataUrl: reader.result as string,
        tamanioBytes: file.size,
        fechaSubida: new Date().toISOString().split('T')[0]
      });
    };
    reader.readAsDataURL(file);
  };

  const handleOpenCreateModal = () => {
    setEditingAccidente(null);
    setFormData({
      trabajadorSelectionMode: trabajadores.length > 0 ? 'REGISTRADO' : 'MANUAL',
      trabajadorId: trabajadores[0]?.id || 'OTRO_MANUAL',
      trabajadorNombreCustom: '',
      trabajadorDniCustom: '',
      empresaId: empresas[0]?.id || 'emp-1',
      tipo: 'ACCIDENTE_INCAPACITANTE',
      fechaHora: new Date().toISOString().replace('T', ' ').substring(0, 16),
      lugarExacto: 'Área de Planta / Almacén Principal',
      descripcionHechos: '',
      parteCuerpoAfectada: '',
      diagnosticoCIE10: '',
      diasIncapacidad: 1,
      notificadoMTPE: false,
      codigoRegistroSAT: '',
      causasRaizStr: '',
      medidasCorrectivasStr: '',
      estadoInvestigacion: 'EN_INVESTIGACION',
      archivoPdf: undefined
    });
    setShowModal(true);
  };

  const handleOpenEditModal = (acc: AccidenteIncidente) => {
    setEditingAccidente(acc);
    const isCustom = !!acc.trabajadorNombreCustom;
    setFormData({
      trabajadorSelectionMode: isCustom ? 'MANUAL' : 'REGISTRADO',
      trabajadorId: acc.trabajadorId,
      trabajadorNombreCustom: acc.trabajadorNombreCustom || '',
      trabajadorDniCustom: acc.trabajadorDniCustom || '',
      empresaId: acc.empresaId || empresas[0]?.id || 'emp-1',
      tipo: acc.tipo,
      fechaHora: acc.fechaHora,
      lugarExacto: acc.lugarExacto,
      descripcionHechos: acc.descripcionHechos,
      parteCuerpoAfectada: acc.parteCuerpoAfectada,
      diagnosticoCIE10: acc.diagnosticoCIE10,
      diasIncapacidad: acc.diasIncapacidad,
      notificadoMTPE: acc.notificadoMTPE,
      codigoRegistroSAT: acc.codigoRegistroSAT || '',
      causasRaizStr: (acc.causasRaiz || []).join(', '),
      medidasCorrectivasStr: (acc.medidasCorrectivas || []).join(', '),
      estadoInvestigacion: acc.estadoInvestigacion || 'EN_INVESTIGACION',
      archivoPdf: acc.archivoPdf
    });
    setShowModal(true);
  };

  const handleDelete = (acc: AccidenteIncidente) => {
    setDeletingAccidente(acc);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    let finalTrabajadorId = formData.trabajadorId;
    let finalEmpresaId = formData.empresaId || empresas[0]?.id || 'emp-1';
    let finalNombreCustom: string | undefined = undefined;
    let finalDniCustom: string | undefined = undefined;

    if (formData.trabajadorSelectionMode === 'MANUAL' || formData.trabajadorId === 'OTRO_MANUAL') {
      finalTrabajadorId = `trab-manual-${Date.now()}`;
      finalNombreCustom = formData.trabajadorNombreCustom.trim() || 'Trabajador Manual / Externo';
      finalDniCustom = formData.trabajadorDniCustom.trim() || 'S/D';
    } else {
      const trab = trabajadores.find(t => t.id === formData.trabajadorId);
      if (trab) {
        finalEmpresaId = trab.empresaId;
      }
    }

    const causasArr = formData.causasRaizStr
      ? formData.causasRaizStr.split(',').map(s => s.trim()).filter(Boolean)
      : [];

    const medidasArr = formData.medidasCorrectivasStr
      ? formData.medidasCorrectivasStr.split(',').map(s => s.trim()).filter(Boolean)
      : [];

    if (editingAccidente) {
      const updatedAcc: AccidenteIncidente = {
        ...editingAccidente,
        trabajadorId: finalTrabajadorId,
        trabajadorNombreCustom: finalNombreCustom,
        trabajadorDniCustom: finalDniCustom,
        empresaId: finalEmpresaId,
        tipo: formData.tipo,
        fechaHora: formData.fechaHora || editingAccidente.fechaHora,
        lugarExacto: formData.lugarExacto,
        descripcionHechos: formData.descripcionHechos,
        parteCuerpoAfectada: formData.parteCuerpoAfectada,
        diagnosticoCIE10: formData.diagnosticoCIE10,
        diasIncapacidad: Number(formData.diasIncapacidad) || 0,
        notificadoMTPE: formData.notificadoMTPE,
        codigoRegistroSAT: formData.codigoRegistroSAT || (formData.notificadoMTPE ? 'SAT-MTPE-REGISTRADO' : 'SAT-MTPE-PENDIENTE'),
        causasRaiz: causasArr.length > 0 ? causasArr : editingAccidente.causasRaiz,
        medidasCorrectivas: medidasArr.length > 0 ? medidasArr : editingAccidente.medidasCorrectivas,
        estadoInvestigacion: formData.estadoInvestigacion,
        archivoPdf: formData.archivoPdf
      };

      if (onUpdateAccidente) {
        onUpdateAccidente(updatedAcc);
      }
    } else {
      const newAcc: AccidenteIncidente = {
        id: `acc-${Date.now()}`,
        codigoEvento: `ACC-2026-${Math.floor(1000 + Math.random() * 9000)}`,
        empresaId: finalEmpresaId,
        trabajadorId: finalTrabajadorId,
        trabajadorNombreCustom: finalNombreCustom,
        trabajadorDniCustom: finalDniCustom,
        tipo: formData.tipo,
        fechaHora: formData.fechaHora || new Date().toISOString().replace('T', ' ').substring(0, 16),
        lugarExacto: formData.lugarExacto,
        descripcionHechos: formData.descripcionHechos,
        parteCuerpoAfectada: formData.parteCuerpoAfectada,
        diagnosticoCIE10: formData.diagnosticoCIE10,
        diasIncapacidad: Number(formData.diasIncapacidad) || 0,
        notificadoMTPE: formData.notificadoMTPE,
        codigoRegistroSAT: formData.codigoRegistroSAT || (formData.notificadoMTPE ? 'SAT-MTPE-REGISTRADO' : 'SAT-MTPE-PENDIENTE'),
        causasRaiz: causasArr.length > 0 ? causasArr : ['Pendiente análisis de causa raíz (ICAM)'],
        medidasCorrectivas: medidasArr.length > 0 ? medidasArr : ['Pendiente implementación de medidas correctivas'],
        estadoInvestigacion: formData.estadoInvestigacion,
        archivoPdf: formData.archivoPdf
      };

      onAddAccidente(newAcc);
    }

    setEditingAccidente(null);
    setShowModal(false);
  };

  const handleAttachPdfToAccidente = (accId: string, pdfData: CertificadoMedicoPdf) => {
    const acc = accidentes.find(a => a.id === accId);
    if (acc && onUpdateAccidente) {
      onUpdateAccidente({ ...acc, archivoPdf: pdfData });
    }
  };

  const handleRemovePdfFromAccidente = (accId: string) => {
    const acc = accidentes.find(a => a.id === accId);
    if (acc && onUpdateAccidente) {
      onUpdateAccidente({ ...acc, archivoPdf: undefined });
    }
  };

  const getTrabajadorNombre = (acc: AccidenteIncidente) => {
    if (acc.trabajadorNombreCustom) {
      return `${acc.trabajadorNombreCustom} (${acc.trabajadorDniCustom || 'S/D'}) [Manual/Externo]`;
    }
    const t = trabajadores.find(x => x.id === acc.trabajadorId);
    return t ? `${t.apellidoPaterno} ${t.nombres} (${t.numeroDocumento})` : 'Trabajador no especificado';
  };

  // Sort Accidents Chronologically by Date (descending - newest first)
  const sortedAccidentes = [...accidentes].sort((a, b) => {
    return new Date(b.fechaHora).getTime() - new Date(a.fechaHora).getTime();
  });

  const filteredAccidentes = sortedAccidentes.filter(acc => {
    const trabNombre = getTrabajadorNombre(acc).toLowerCase();
    const matchesSearch = 
      acc.codigoEvento.toLowerCase().includes(searchTerm.toLowerCase()) ||
      acc.lugarExacto.toLowerCase().includes(searchTerm.toLowerCase()) ||
      acc.descripcionHechos.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trabNombre.includes(searchTerm.toLowerCase());
    const matchesTipo = filterTipo === 'TODOS' || acc.tipo === filterTipo;
    return matchesSearch && matchesTipo;
  });

  // Export Consolidado Excel / CSV
  const handleExportConsolidadoCsv = () => {
    if (filteredAccidentes.length === 0) {
      alert('No hay registros de accidentes o incidentes para exportar.');
      return;
    }

    const headers = [
      'Código Evento',
      'Fecha/Hora Evento',
      'Trabajador Afectado',
      'DNI / Documento',
      'Empresa / Sede',
      'Tipo de Evento',
      'Lugar Exacto',
      'Descripción de los Hechos',
      'Parte Afectada',
      'Diagnóstico CIE-10',
      'Días Perdidos',
      'Notificado MTPE',
      'Código Registro SAT MTPE',
      'Estado Investigación',
      'Causas Raíz',
      'Medidas Correctivas'
    ];

    const rows = filteredAccidentes.map(acc => {
      let trabNombre = 'N/A';
      let trabDoc = 'N/A';
      let empNombre = 'N/A';

      if (acc.trabajadorNombreCustom) {
        trabNombre = `${acc.trabajadorNombreCustom} (Externo/Manual)`;
        trabDoc = acc.trabajadorDniCustom || 'S/D';
        const emp = empresas.find(e => e.id === acc.empresaId);
        empNombre = emp ? emp.razonSocial : 'Empresa General';
      } else {
        const t = trabajadores.find(x => x.id === acc.trabajadorId);
        const emp = empresas.find(e => e.id === acc.empresaId);
        trabNombre = t ? `${t.apellidoPaterno} ${t.nombres}` : 'N/A';
        trabDoc = t ? t.numeroDocumento : 'N/A';
        empNombre = emp ? emp.razonSocial : 'N/A';
      }

      const causasStr = (acc.causasRaiz || []).join(' | ');
      const medidasStr = (acc.medidasCorrectivas || []).join(' | ');

      return [
        acc.codigoEvento,
        acc.fechaHora,
        trabNombre,
        trabDoc,
        empNombre,
        acc.tipo.replace('_', ' '),
        acc.lugarExacto,
        acc.descripcionHechos,
        acc.parteCuerpoAfectada,
        acc.diagnosticoCIE10,
        acc.diasIncapacidad,
        acc.notificadoMTPE ? 'SI' : 'NO',
        acc.codigoRegistroSAT || 'PENDIENTE',
        acc.estadoInvestigacion || 'EN_INVESTIGACION',
        causasStr,
        medidasStr
      ];
    });

    const csvContent = '\uFEFF' + [headers, ...rows]
      .map(e => e.map(val => `"${String(val).replace(/"/g, '""')}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Consolidado_Accidentes_SST_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Export Consolidado PDF
  const handleExportConsolidadoPdf = () => {
    if (filteredAccidentes.length === 0) {
      alert('No hay registros de accidentes o incidentes para exportar.');
      return;
    }

    const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
    const todayStr = new Date().toLocaleDateString('es-PE');

    // Title Banner
    doc.setFillColor(15, 23, 42); // slate-900
    doc.rect(0, 0, 297, 24, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(13);
    doc.setFont('helvetica', 'bold');
    doc.text('CONSOLIDADO GENERAL DE ACCIDENTES DE TRABAJO E INCIDENTES PELIGROSOS', 14, 12);

    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.text(`Ley 29783 / D.S. 005-2012-TR · Sistema de Gestión SST · Fecha Emisión: ${todayStr}`, 14, 18);

    // KPI Summary Cards
    const total = filteredAccidentes.length;
    const incapacitantes = filteredAccidentes.filter(a => a.tipo === 'ACCIDENTE_INCAPACITANTE').length;
    const leves = filteredAccidentes.filter(a => a.tipo === 'ACCIDENTE_LEVE').length;
    const incidentes = filteredAccidentes.filter(a => a.tipo === 'INCIDENTE_PELIGROSO').length;
    const mortales = filteredAccidentes.filter(a => a.tipo === 'ACCIDENTE_MORTAL').length;
    const totalDias = filteredAccidentes.reduce((sum, a) => sum + (a.diasIncapacidad || 0), 0);

    let startX = 14;
    const kpis = [
      { label: 'Total Eventos', val: `${total}`, color: [225, 29, 72] },
      { label: 'Acc. Incapacitantes', val: `${incapacitantes}`, color: [217, 119, 6] },
      { label: 'Acc. Leves / Mortales', val: `${leves} / ${mortales}`, color: [71, 85, 105] },
      { label: 'Incidentes Peligrosos', val: `${incidentes}`, color: [14, 165, 233] },
      { label: 'Días Perdidos Totales', val: `${totalDias} días`, color: [16, 185, 129] },
    ];

    kpis.forEach(kpi => {
      doc.setFillColor(248, 250, 252);
      doc.setDrawColor(226, 232, 240);
      doc.roundedRect(startX, 28, 50, 16, 2, 2, 'FD');

      doc.setFontSize(7);
      doc.setTextColor(100, 116, 139);
      doc.setFont('helvetica', 'bold');
      doc.text(kpi.label.toUpperCase(), startX + 3, 33);

      doc.setFontSize(11);
      doc.setTextColor(kpi.color[0], kpi.color[1], kpi.color[2]);
      doc.text(kpi.val, startX + 3, 40);

      startX += 54;
    });

    // Table Header
    let y = 50;
    doc.setFillColor(30, 41, 59); // slate-800
    doc.rect(14, y, 269, 8, 'F');

    doc.setFontSize(7.5);
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.text('CÓDIGO', 16, y + 5.5);
    doc.text('FECHA/HORA', 42, y + 5.5);
    doc.text('TRABAJADOR / DNI', 80, y + 5.5);
    doc.text('TIPO EVENTO', 145, y + 5.5);
    doc.text('LUGAR OCURRENCIA', 190, y + 5.5);
    doc.text('CIE-10', 242, y + 5.5);
    doc.text('DÍAS', 262, y + 5.5);
    doc.text('MTPE', 274, y + 5.5);

    y += 8;

    // Rows
    filteredAccidentes.forEach((acc, idx) => {
      if (y > 180) {
        doc.addPage();
        y = 15;
        doc.setFillColor(30, 41, 59);
        doc.rect(14, y, 269, 8, 'F');
        doc.setFontSize(7.5);
        doc.setTextColor(255, 255, 255);
        doc.setFont('helvetica', 'bold');
        doc.text('CÓDIGO', 16, y + 5.5);
        doc.text('FECHA/HORA', 42, y + 5.5);
        doc.text('TRABAJADOR / DNI', 80, y + 5.5);
        doc.text('TIPO EVENTO', 145, y + 5.5);
        doc.text('LUGAR OCURRENCIA', 190, y + 5.5);
        doc.text('CIE-10', 242, y + 5.5);
        doc.text('DÍAS', 262, y + 5.5);
        doc.text('MTPE', 274, y + 5.5);
        y += 8;
      }

      const isEven = idx % 2 === 0;
      doc.setFillColor(isEven ? 255 : 248, isEven ? 255 : 250, isEven ? 255 : 252);
      doc.rect(14, y, 269, 7.5, 'F');
      doc.setDrawColor(241, 245, 249);
      doc.line(14, y + 7.5, 283, y + 7.5);

      let trabStr = 'N/A';
      if (acc.trabajadorNombreCustom) {
        trabStr = `${acc.trabajadorNombreCustom} (${acc.trabajadorDniCustom || 'S/D'}) [Ext/Man]`;
      } else {
        const t = trabajadores.find(x => x.id === acc.trabajadorId);
        trabStr = t ? `${t.apellidoPaterno} ${t.nombres.substring(0, 10)}. (${t.numeroDocumento})` : 'N/A';
      }

      doc.setFontSize(7);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(30, 41, 59);

      doc.text(acc.codigoEvento, 16, y + 5);
      doc.text(acc.fechaHora.substring(0, 16), 42, y + 5);
      doc.text(trabStr.substring(0, 36), 80, y + 5);
      doc.text(acc.tipo.replace('_', ' '), 145, y + 5);
      doc.text(acc.lugarExacto.substring(0, 30), 190, y + 5);
      doc.text(acc.diagnosticoCIE10 || '---', 242, y + 5);
      doc.text(`${acc.diasIncapacidad || 0}`, 262, y + 5);
      doc.text(acc.notificadoMTPE ? 'SI' : 'NO', 274, y + 5);

      y += 7.5;
    });

    // Signatures
    y = Math.max(y + 12, 175);
    if (y > 185) {
      doc.addPage();
      y = 175;
    }

    doc.setDrawColor(148, 163, 184);
    doc.line(40, y, 110, y);
    doc.line(180, y, 250, y);

    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(51, 65, 85);
    doc.text('MÉDICO OCUPACIONAL - CMP', 48, y + 4);
    doc.text('RESPONSABLE DE SEGURIDAD Y SALUD (SST)', 182, y + 4);

    doc.save(`Consolidado_Accidentes_SST_${new Date().toISOString().split('T')[0]}.pdf`);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-slate-950 p-6 rounded-2xl border border-slate-800 shadow-xl">
        <div>
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span className="px-2.5 py-0.5 bg-rose-500/20 text-rose-300 border border-rose-500/30 text-[10px] font-bold uppercase rounded flex items-center gap-1">
              <Clock className="w-3 h-3 text-rose-400" /> Notificación SAT MTPE &lt; 24 Horas (Ley 29783)
            </span>
            <span className="px-2.5 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold uppercase rounded font-mono">
              Orden Cronológico por Fechas
            </span>
          </div>
          <h2 className="text-xl font-bold text-white font-sans flex items-center gap-2.5">
            <AlertTriangle className="w-6 h-6 text-rose-400" /> Registro de Accidentes de Trabajo e Incidentes Peligrosos
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-3xl">
            Monitoreo y reporte por fecha de eventos SST, investigación ICAM/5 Porqués, registro de días perdidos, modificación de registros y exportación del consolidado.
          </p>
        </div>

        {/* Action Buttons: Consolidado & New Event */}
        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            onClick={handleExportConsolidadoCsv}
            className="px-3 py-2 bg-slate-900 hover:bg-slate-800 text-emerald-400 border border-emerald-500/30 hover:border-emerald-500 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-md"
            title="Exportar hoja de cálculo Excel / CSV"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-400" /> Consolidado Excel
          </button>

          <button
            onClick={handleExportConsolidadoPdf}
            className="px-3 py-2 bg-slate-900 hover:bg-slate-800 text-indigo-300 border border-indigo-500/30 hover:border-indigo-500 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-md"
            title="Exportar reporte Consolidado en PDF"
          >
            <Download className="w-4 h-4 text-indigo-400" /> Consolidado PDF
          </button>

          <button
            onClick={handleOpenCreateModal}
            className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg shadow-rose-950 transition-all shrink-0"
          >
            <Plus className="w-4 h-4" /> Reportar Evento SST
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-slate-900 p-3.5 rounded-xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Buscar por código, trabajador, lugar o hechos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-rose-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-400 font-medium">Tipo Evento:</span>
          <select
            value={filterTipo}
            onChange={(e) => setFilterTipo(e.target.value)}
            className="bg-slate-950 border border-slate-800 text-slate-200 rounded-lg px-2.5 py-1.5 font-semibold focus:outline-none focus:border-rose-500"
          >
            <option value="TODOS">TODOS LOS EVENTOS</option>
            <option value="ACCIDENTE_LEVE">Accidente Leve</option>
            <option value="ACCIDENTE_INCAPACITANTE">Accidente Incapacitante</option>
            <option value="ACCIDENTE_MORTAL">Accidente Mortal</option>
            <option value="INCIDENTE_PELIGROSO">Incidente Peligroso</option>
          </select>
        </div>
      </div>

      {/* List of Accidents chronologically ordered */}
      <div className="space-y-4">
        {filteredAccidentes.map((acc) => (
          <div key={acc.id} className="bg-slate-950 rounded-2xl border border-slate-800 p-5 shadow-lg space-y-4 hover:border-slate-700 transition-all">
            {/* Card Header with Code, Type, Date, SAT Status & Action Buttons */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
              <div className="flex items-center gap-3 flex-wrap">
                <span className="font-mono font-bold text-xs text-rose-400 bg-rose-950/60 px-2.5 py-1 rounded border border-rose-800">
                  {acc.codigoEvento}
                </span>

                <span className={`text-xs font-bold uppercase px-2 py-0.5 rounded border ${
                  acc.tipo === 'ACCIDENTE_MORTAL' 
                    ? 'bg-rose-950 text-rose-300 border-rose-800' 
                    : acc.tipo === 'ACCIDENTE_INCAPACITANTE'
                    ? 'bg-amber-950 text-amber-300 border-amber-800'
                    : 'bg-slate-800 text-slate-300 border-slate-700'
                }`}>
                  {acc.tipo.replace('_', ' ')}
                </span>

                {/* Date Display */}
                <div className="flex items-center gap-1.5 text-xs text-emerald-400 bg-slate-900 px-2.5 py-1 rounded-md border border-slate-800 font-mono font-bold">
                  <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Fecha: {acc.fechaHora}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-wrap shrink-0">
                {acc.notificadoMTPE ? (
                  <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5 bg-emerald-950/50 px-2.5 py-1 rounded-lg border border-emerald-800 shrink-0">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Notificado MTPE: {acc.codigoRegistroSAT}
                  </span>
                ) : (
                  <span className="text-xs font-semibold text-rose-400 flex items-center gap-1.5 bg-rose-950/50 px-2.5 py-1 rounded-lg border border-rose-800 animate-pulse shrink-0">
                    <Clock className="w-3.5 h-3.5" /> Pendiente SAT MTPE
                  </span>
                )}

                {/* Edit & Delete Actions */}
                <button
                  type="button"
                  onClick={() => handleOpenEditModal(acc)}
                  className="px-2.5 py-1 bg-indigo-600/20 hover:bg-indigo-600/40 text-indigo-300 border border-indigo-500/30 rounded-lg text-xs font-bold flex items-center gap-1 transition-all"
                  title="Editar registro de accidente"
                >
                  <Edit3 className="w-3.5 h-3.5 text-indigo-400" /> Editar
                </button>

                <button
                  type="button"
                  onClick={() => handleDelete(acc)}
                  className="px-2.5 py-1 bg-rose-950/60 hover:bg-rose-900/80 text-rose-300 border border-rose-800 rounded-lg text-xs font-bold flex items-center gap-1 transition-all"
                  title="Eliminar registro de accidente"
                >
                  <Trash2 className="w-3.5 h-3.5 text-rose-400" /> Eliminar
                </button>
              </div>
            </div>

            {/* Content Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800/80 space-y-1">
                <div className="text-slate-400 text-[10px] uppercase font-bold">Trabajador Afectado & Ubicación</div>
                <div className="font-bold text-white text-sm">{getTrabajadorNombre(acc)}</div>
                <div className="text-slate-300 font-medium">Lugar Ocurrencia: {acc.lugarExacto}</div>
                <div className="text-slate-400 mt-1 leading-relaxed">Hechos: {acc.descripcionHechos}</div>
              </div>

              <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800/80 space-y-1.5">
                <div className="text-slate-400 text-[10px] uppercase font-bold">Diagnóstico & Días Perdidos</div>
                <div>Parte Afectada: <strong className="text-rose-300 font-semibold">{acc.parteCuerpoAfectada}</strong></div>
                <div>Diagnóstico CIE-10: <strong className="text-emerald-400 font-mono font-bold">{acc.diagnosticoCIE10}</strong></div>
                <div>Días de Incapacidad: <strong className="text-amber-400 font-bold">{acc.diasIncapacidad} días perdidos</strong></div>
              </div>
            </div>

            {/* Root Causes Section */}
            {acc.causasRaiz && acc.causasRaiz.length > 0 && (
              <div className="text-xs bg-slate-900 p-3 rounded-xl border border-slate-800">
                <div className="font-bold text-slate-300 mb-1 flex items-center gap-1.5">
                  <ShieldAlert className="w-3.5 h-3.5 text-indigo-400" />
                  Causas Raíz (Investigación ICAM / 5 Porqués):
                </div>
                <ul className="list-disc list-inside text-slate-400 space-y-0.5">
                  {acc.causasRaiz.map((c, i) => (
                    <li key={i}>{c}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* PDF Sustento Section */}
            <div className="pt-2 border-t border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <span className="text-slate-400 font-semibold">Sustento Documental PDF (Informe ICAM / SAT):</span>

              {acc.archivoPdf ? (
                <div className="bg-slate-900 p-2 rounded-xl border border-slate-800 flex items-center justify-between gap-3 min-w-[280px]">
                  <div className="flex items-center gap-2 truncate">
                    <FileText className="w-4 h-4 text-red-400 shrink-0" />
                    <span className="text-slate-200 font-semibold truncate text-xs" title={acc.archivoPdf.nombreArchivo}>
                      {acc.archivoPdf.nombreArchivo}
                    </span>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => setPreviewPdf(acc.archivoPdf!)}
                      className="px-2.5 py-1 bg-indigo-600/20 hover:bg-indigo-600/40 text-indigo-300 border border-indigo-500/30 rounded-lg text-xs font-bold flex items-center gap-1 transition-all"
                      title="Previsualizar PDF en ventana modal"
                    >
                      <Eye className="w-3.5 h-3.5 text-indigo-400" /> Ver PDF
                    </button>

                    <a
                      href={acc.archivoPdf.dataUrl}
                      download={acc.archivoPdf.nombreArchivo}
                      className="px-2.5 py-1 bg-emerald-600/20 hover:bg-emerald-600/40 text-emerald-300 border border-emerald-500/30 rounded-lg text-xs font-bold flex items-center gap-1 transition-all"
                      title="Descargar PDF"
                    >
                      <Download className="w-3.5 h-3.5 text-emerald-400" />
                    </a>

                    <button
                      type="button"
                      onClick={() => handleRemovePdfFromAccidente(acc.id)}
                      className="p-1 text-slate-500 hover:text-rose-400 rounded transition-colors"
                      title="Eliminar PDF"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ) : (
                <label className="flex items-center justify-center gap-2 px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 border border-dashed border-slate-700 hover:border-emerald-500 rounded-xl text-xs font-semibold cursor-pointer transition-all">
                  <Upload className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Subir Sustento PDF (Informe / Acta ICAM)</span>
                  <input
                    type="file"
                    accept="application/pdf"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        handlePdfUpload(file, (pdfData) => {
                          handleAttachPdfToAccidente(acc.id, pdfData);
                        });
                      }
                    }}
                  />
                </label>
              )}
            </div>
          </div>
        ))}

        {filteredAccidentes.length === 0 && (
          <div className="text-center py-10 bg-slate-950 rounded-2xl border border-slate-800 text-slate-400 text-xs">
            No se encontraron registros de accidentes e incidentes bajo los filtros seleccionados.
          </div>
        )}
      </div>

      {/* Modal Report / Edit Accident */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-hidden">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl text-slate-100 overflow-hidden">
            <div className="p-4 sm:p-5 border-b border-slate-800 shrink-0 flex items-center justify-between">
              <h3 className="text-lg font-bold font-display text-white flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-rose-400" /> 
                {editingAccidente ? `Editar Registro: ${editingAccidente.codigoEvento}` : 'Reportar Accidente / Incidente SST'}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800">✕</button>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden min-h-0">
              <div className="p-4 sm:p-5 overflow-y-auto space-y-4 text-xs flex-1">
                {/* Trabajador Selection: Registrado vs Manual */}
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-slate-300 font-semibold text-xs">Origen del Trabajador Afectado:*</label>
                  <div className="flex items-center gap-1 bg-slate-900 p-0.5 rounded-lg border border-slate-800">
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, trabajadorSelectionMode: 'REGISTRADO' })}
                      className={`px-2 py-1 rounded text-[11px] font-bold transition-all ${
                        formData.trabajadorSelectionMode === 'REGISTRADO'
                          ? 'bg-rose-600 text-white shadow'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      En Nómina ({trabajadores.length})
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, trabajadorSelectionMode: 'MANUAL' })}
                      className={`px-2 py-1 rounded text-[11px] font-bold transition-all flex items-center gap-1 ${
                        formData.trabajadorSelectionMode === 'MANUAL'
                          ? 'bg-rose-600 text-white shadow'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <UserPlus className="w-3 h-3" /> Otro / Manual
                    </button>
                  </div>
                </div>

                {formData.trabajadorSelectionMode === 'REGISTRADO' ? (
                  <div>
                    <select
                      value={formData.trabajadorId}
                      onChange={(e) => {
                        if (e.target.value === 'OTRO_MANUAL') {
                          setFormData({ ...formData, trabajadorSelectionMode: 'MANUAL', trabajadorId: 'OTRO_MANUAL' });
                        } else {
                          setFormData({ ...formData, trabajadorId: e.target.value });
                        }
                      }}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white font-semibold focus:outline-none focus:border-rose-500"
                    >
                      {trabajadores.map((t) => (
                        <option key={t.id} value={t.id}>
                          {t.apellidoPaterno} {t.nombres} ({t.numeroDocumento})
                        </option>
                      ))}
                      <option value="OTRO_MANUAL">+ Registrar otro trabajador / externo...</option>
                    </select>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                    <div>
                      <label className="block text-slate-400 text-[11px] mb-1">Apellidos y Nombres Completos:*</label>
                      <input
                        type="text"
                        required
                        value={formData.trabajadorNombreCustom}
                        onChange={(e) => setFormData({ ...formData, trabajadorNombreCustom: e.target.value })}
                        placeholder="Ej. Perez Gomez Juan"
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white focus:outline-none focus:border-rose-500"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-400 text-[11px] mb-1">DNI / CE / Pasaporte:*</label>
                      <input
                        type="text"
                        required
                        value={formData.trabajadorDniCustom}
                        onChange={(e) => setFormData({ ...formData, trabajadorDniCustom: e.target.value })}
                        placeholder="Ej. 74839201"
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white focus:outline-none focus:border-rose-500 font-mono"
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Tipo de Evento:*</label>
                  <select
                    value={formData.tipo}
                    onChange={(e) => setFormData({ ...formData, tipo: e.target.value as any })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white font-semibold focus:outline-none focus:border-rose-500"
                  >
                    <option value="ACCIDENTE_LEVE">ACCIDENTE LEVE</option>
                    <option value="ACCIDENTE_INCAPACITANTE">ACCIDENTE INCAPACITANTE</option>
                    <option value="ACCIDENTE_MORTAL">ACCIDENTE MORTAL (Notif 24h)</option>
                    <option value="INCIDENTE_PELIGROSO">INCIDENTE PELIGROSO (Notif 24h)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Fecha y Hora Evento:*</label>
                  <input
                    type="text"
                    required
                    value={formData.fechaHora}
                    onChange={(e) => setFormData({ ...formData, fechaHora: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-emerald-400 font-mono font-bold focus:outline-none focus:border-rose-500"
                    placeholder="YYYY-MM-DD HH:MM"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Lugar Exacto de Ocurrencia:*</label>
                <input
                  type="text"
                  required
                  value={formData.lugarExacto}
                  onChange={(e) => setFormData({ ...formData, lugarExacto: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white focus:outline-none focus:border-rose-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Descripción de los Hechos:*</label>
                <textarea
                  required
                  rows={3}
                  value={formData.descripcionHechos}
                  onChange={(e) => setFormData({ ...formData, descripcionHechos: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white focus:outline-none focus:border-rose-500 resize-none"
                ></textarea>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Parte Afectada:*</label>
                  <input
                    type="text"
                    required
                    value={formData.parteCuerpoAfectada}
                    onChange={(e) => setFormData({ ...formData, parteCuerpoAfectada: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white focus:outline-none focus:border-rose-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Diagnóstico CIE-10:*</label>
                  <input
                    type="text"
                    required
                    value={formData.diagnosticoCIE10}
                    onChange={(e) => setFormData({ ...formData, diagnosticoCIE10: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white focus:outline-none focus:border-rose-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Días Perdidos:*</label>
                  <input
                    type="number"
                    required
                    value={formData.diasIncapacidad}
                    onChange={(e) => setFormData({ ...formData, diasIncapacidad: Number(e.target.value) })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white focus:outline-none focus:border-rose-500 font-mono font-bold"
                  />
                </div>
              </div>

              {/* Notificación MTPE & Estado */}
              <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 text-slate-200 font-semibold cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.notificadoMTPE}
                      onChange={(e) => setFormData({ ...formData, notificadoMTPE: e.target.checked })}
                      className="w-4 h-4 rounded border-slate-700 bg-slate-800 text-emerald-500 focus:ring-emerald-500"
                    />
                    <span>Notificado a MTPE (SAT)</span>
                  </label>
                </div>

                {formData.notificadoMTPE && (
                  <div>
                    <label className="block text-slate-400 text-[11px] mb-1">Código de Registro SAT MTPE:</label>
                    <input
                      type="text"
                      value={formData.codigoRegistroSAT}
                      onChange={(e) => setFormData({ ...formData, codigoRegistroSAT: e.target.value })}
                      placeholder="ej. SAT-MTPE-2026-0012"
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-emerald-400 font-mono text-xs font-semibold"
                    />
                  </div>
                )}
              </div>

              {/* Causas Raíz y Medidas */}
              <div className="space-y-2">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Causas Raíz (separadas por comas):</label>
                  <input
                    type="text"
                    value={formData.causasRaizStr}
                    onChange={(e) => setFormData({ ...formData, causasRaizStr: e.target.value })}
                    placeholder="ej. Suelo resbaladizo, Falta de EPP antideslizante"
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white focus:outline-none focus:border-rose-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Medidas Correctivas (separadas por comas):</label>
                  <input
                    type="text"
                    value={formData.medidasCorrectivasStr}
                    onChange={(e) => setFormData({ ...formData, medidasCorrectivasStr: e.target.value })}
                    placeholder="ej. Limpieza inmediata, Capacitación en seguridad"
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white focus:outline-none focus:border-rose-500"
                  />
                </div>
              </div>

              {/* PDF Document Upload in Modal */}
              <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
                <label className="block text-slate-300 font-semibold">Adjuntar Sustento PDF (Informe / Ficha SAT):</label>
                {formData.archivoPdf ? (
                  <div className="flex items-center justify-between p-2.5 bg-slate-900 border border-emerald-500/30 rounded-lg">
                    <div className="flex items-center gap-2 truncate">
                      <FileText className="w-4 h-4 text-red-400 shrink-0" />
                      <span className="text-slate-200 font-semibold truncate">{formData.archivoPdf.nombreArchivo}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, archivoPdf: undefined })}
                      className="p-1 text-slate-400 hover:text-rose-400"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <label className="flex items-center justify-center gap-2 p-3 bg-slate-900 border border-dashed border-slate-700 hover:border-emerald-500 rounded-lg text-slate-300 cursor-pointer transition-colors">
                    <Upload className="w-4 h-4 text-emerald-400" />
                    <span>Cargar archivo PDF de sustento (Opcional)</span>
                    <input
                      type="file"
                      accept="application/pdf"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          handlePdfUpload(file, (pdfData) => {
                            setFormData({ ...formData, archivoPdf: pdfData });
                          });
                        }
                      }}
                    />
                  </label>
                )}
              </div>
              </div>

              <div className="p-4 sm:p-5 border-t border-slate-800 flex items-center justify-between shrink-0 bg-slate-900/80">
                {editingAccidente ? (
                  <button
                    type="button"
                    onClick={() => {
                      setDeletingAccidente(editingAccidente);
                      setShowModal(false);
                    }}
                    className="px-3 py-2 bg-rose-950/60 hover:bg-rose-900/80 text-rose-300 border border-rose-800/80 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all"
                    title="Eliminar este registro de caso"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-rose-400" /> Eliminar Caso
                  </button>
                ) : (
                  <div />
                )}

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 bg-slate-800 text-slate-300 hover:bg-slate-700 rounded-lg font-medium"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-lg font-bold shadow-lg shadow-rose-900/30 flex items-center gap-2"
                  >
                    <Send className="w-4 h-4" /> {editingAccidente ? 'Guardar Cambios' : 'Registrar & Notificar SAT'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL CONFIRMACION DE ELIMINACION DE CASO ACCIDENTE/INCIDENTE */}
      {deletingAccidente && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-hidden">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl text-slate-100 flex flex-col space-y-4 my-auto">
            <div className="flex items-start justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-rose-500/10 text-rose-400 border border-rose-500/30 rounded-xl">
                  <Trash2 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Eliminar Caso de Accidente / Incidente</h3>
                  <p className="text-xs text-slate-400">Esta acción eliminará el caso del registro SST de forma permanente.</p>
                </div>
              </div>
              <button
                onClick={() => setDeletingAccidente(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
              >
                ✕
              </button>
            </div>

            <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 space-y-1.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-mono text-emerald-400 font-bold">{deletingAccidente.codigoEvento}</span>
                <span className="px-2 py-0.5 bg-rose-500/10 text-rose-300 border border-rose-500/20 rounded text-[10px] font-bold">
                  {deletingAccidente.tipo.replace(/_/g, ' ')}
                </span>
              </div>
              <div className="font-bold text-white text-sm pt-0.5">
                {getTrabajadorNombre(deletingAccidente)}
              </div>
              <div className="text-slate-400">
                Fecha del Suceso: <span className="text-slate-200 font-medium">{deletingAccidente.fechaHora}</span>
              </div>
              {deletingAccidente.diagnosticoCIE10 && (
                <div className="text-slate-400">
                  Diagnóstico: <span className="text-emerald-400 font-mono font-bold">{deletingAccidente.diagnosticoCIE10}</span> ({deletingAccidente.diasIncapacidad} días de descanso)
                </div>
              )}
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              ¿Está seguro de que desea eliminar permanentemente este caso? Todos los archivos PDF adjuntos y registros de investigación vinculados serán removidos.
            </p>

            <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setDeletingAccidente(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-semibold transition-colors"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => {
                  if (onDeleteAccidente && deletingAccidente) {
                    onDeleteAccidente(deletingAccidente.id);
                  }
                  setDeletingAccidente(null);
                }}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-bold shadow-lg shadow-rose-900/30 flex items-center gap-1.5 transition-colors"
              >
                <Trash2 className="w-4 h-4" /> Sí, Eliminar Caso
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL PREVISUALIZADOR PDF EMBEBIDO */}
      {previewPdf && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-4xl h-[85vh] flex flex-col shadow-2xl overflow-hidden text-slate-100">
            {/* Modal Header */}
            <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-500/10 text-red-400 rounded-lg border border-red-500/20">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white truncate max-w-md font-sans">
                    {previewPdf.nombreArchivo}
                  </h3>
                  <p className="text-[10px] text-slate-400">
                    Informe / Sustento en PDF · Fecha Subida: {previewPdf.fechaSubida}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={previewPdf.dataUrl}
                  download={previewPdf.nombreArchivo}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg text-xs flex items-center gap-1.5 transition-colors"
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

            {/* Modal PDF Viewer Body */}
            <div className="flex-1 bg-slate-950 p-2 overflow-hidden">
              <iframe
                src={previewPdf.dataUrl}
                title={previewPdf.nombreArchivo}
                className="w-full h-full rounded-lg border border-slate-800 bg-white"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
