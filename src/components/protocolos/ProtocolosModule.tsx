import React, { useState } from 'react';
import { ProtocoloExamenMedico, ArchivoProtocolo, Empresa } from '../../types/erp';
import {
  ClipboardList,
  Plus,
  FileSpreadsheet,
  FileText,
  Upload,
  Download,
  Eye,
  Trash2,
  FileUp,
  Sparkles,
  CheckCircle2,
  X,
  Search,
  Filter,
  Building2,
  ShieldCheck,
  Stethoscope,
  Table,
  FileCode,
  Info,
  Edit3,
  Save
} from 'lucide-react';
import { jsPDF } from 'jspdf';

interface ProtocolosModuleProps {
  protocolos: ProtocoloExamenMedico[];
  empresas: Empresa[];
  onAddProtocolo: (prot: ProtocoloExamenMedico) => void;
  onUpdateProtocolo?: (prot: ProtocoloExamenMedico) => void;
  onDeleteProtocolo?: (id: string) => void;
}

export const ProtocolosModule: React.FC<ProtocolosModuleProps> = ({
  protocolos,
  empresas,
  onAddProtocolo,
  onUpdateProtocolo,
  onDeleteProtocolo
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSector, setSelectedSector] = useState<string>('TODOS');

  const [showModal, setShowModal] = useState(false);
  const [uploadFileModal, setUploadFileModal] = useState<{
    open: boolean;
    protocolo?: ProtocoloExamenMedico;
  }>({ open: false });

  const [editModal, setEditModal] = useState<{
    open: boolean;
    protocolo?: ProtocoloExamenMedico;
  }>({ open: false });

  const [viewerModal, setViewerModal] = useState<{
    open: boolean;
    protocolo?: ProtocoloExamenMedico;
  }>({ open: false });

  const [deleteModal, setDeleteModal] = useState<{
    open: boolean;
    protocolo?: ProtocoloExamenMedico;
  }>({ open: false });

  // Form State
  const [formData, setFormData] = useState<Partial<ProtocoloExamenMedico>>({
    empresaId: empresas[0]?.id || 'emp-1',
    nombreProtocolo: 'Protocolo de Exámenes Médicos Ocupacionales (EMO)',
    codigoProtocolo: `PROT-EMO-${new Date().getFullYear()}-${Math.floor(Math.random() * 900 + 100)}`,
    sectorActividad: 'MINERIA',
    tipoEvaluacion: 'TODOS',
    normaLegalBase: 'R.M. 312-2011-MINSA Anexo 01 y 02',
    descripcionBateria: 'Triaje Completo, Examen Clínico Medicina Ocupacional, Espirometría Digital, Audiometría Tonal ISO, Radiografía de Tórax OIT, Laboratorio Completo, Psicología Ocupacional, Oftalmología y EKG.',
    estado: 'ACTIVO',
    version: '1.0',
    fechaAprobacion: new Date().toISOString().split('T')[0],
    archivoProtocolo: undefined
  });

  const [isDragging, setIsDragging] = useState(false);

  // Filter Protocols
  const filteredProtocolos = (protocolos || []).filter(p => {
    if (!p) return false;
    const nombre = p.nombreProtocolo || (p as any).nombre || '';
    const codigo = p.codigoProtocolo || (p as any).codigo || '';
    const bateria = p.descripcionBateria || '';
    const sector = p.sectorActividad || 'GENERAL';

    const matchesSearch =
      nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bateria.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSector = selectedSector === 'TODOS' || sector === selectedSector;
    return matchesSearch && matchesSector;
  });

  // Upload handler for PDF or Excel
  const handleFileProcess = (file: File, callback: (archivo: ArchivoProtocolo) => void) => {
    const filename = file.name.toLowerCase();
    const isPdf = file.type === 'application/pdf' || filename.endsWith('.pdf');
    const isExcel =
      file.type.includes('spreadsheet') ||
      file.type.includes('excel') ||
      filename.endsWith('.xlsx') ||
      filename.endsWith('.xls') ||
      filename.endsWith('.csv');

    if (!isPdf && !isExcel) {
      alert('Por favor, seleccione un archivo de tipo PDF (.pdf) o Excel (.xlsx, .xls, .csv).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      if (dataUrl) {
        callback({
          nombreArchivo: file.name,
          tipoArchivo: isPdf ? 'PDF' : 'EXCEL',
          dataUrl,
          tamanioBytes: file.size,
          fechaSubida: new Date().toISOString().split('T')[0]
        });
      }
    };
    reader.readAsDataURL(file);
  };

  const handleGenerateSamplePdf = () => {
    const emp = empresas.find(e => e.id === formData.empresaId) || empresas[0];
    const doc = new jsPDF({ orientation: 'p', unit: 'mm', format: 'a4' });

    doc.setFillColor(15, 23, 42); // slate-900
    doc.rect(10, 10, 190, 20, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.text('MATRIZ OFICIAL DE PROTOCOLO DE EXAMENES MEDICOS EMO', 105, 18, { align: 'center' });
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.text('CUMPLIMIENTO LEGAL R.M. 312-2011-MINSA / SALUD OCUPACIONAL', 105, 24, { align: 'center' });

    let y = 38;
    doc.setTextColor(15, 23, 42);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.text(`CÓDIGO PROTOCOLO: ${formData.codigoProtocolo}`, 12, y);
    doc.text(`SECTOR: ${formData.sectorActividad}`, 120, y);
    y += 6;
    doc.setFont('helvetica', 'normal');
    doc.text(`Nombre Protocolo: ${formData.nombreProtocolo}`, 12, y);
    y += 6;
    doc.text(`Empresa / Entidad: ${emp?.razonSocial || 'Compañía Registrada'} (RUC: ${emp?.ruc || 'N/A'})`, 12, y);
    y += 6;
    doc.text(`Norma Base Legal: ${formData.normaLegalBase}`, 12, y);
    y += 8;

    doc.setFillColor(241, 245, 249);
    doc.rect(10, y, 190, 6, 'F');
    doc.setFont('helvetica', 'bold');
    doc.text('BATERIA DE EXAMENES CLINICOS Y COMPLEMENTARIOS EXIGIDOS', 12, y + 4.2);
    y += 10;

    const bateria = formData.descripcionBateria ? formData.descripcionBateria.split(',') : ['Triaje', 'Medicina General', 'Espirometría', 'Audiometría'];
    bateria.forEach((ex, idx) => {
      doc.setFont('helvetica', 'normal');
      doc.text(`${idx + 1}. ${ex.trim()} --- Exigido según Riesgo IPERC (Anexo 02 RM 312-2011)`, 14, y);
      y += 6;
    });

    y += 10;
    doc.setFont('helvetica', 'bold');
    doc.text('Aprobado por el Médico Ocupacional (CMP / RNM)', 12, y);
    doc.setFont('helvetica', 'normal');
    doc.text('ERP MedOcupa - Documento Médico Registrado Oficialmente', 12, y + 5);

    const dataUrl = doc.output('datauristring');
    setFormData(prev => ({
      ...prev,
      archivoProtocolo: {
        nombreArchivo: `${formData.codigoProtocolo}_RM312_MINSA.pdf`,
        tipoArchivo: 'PDF',
        dataUrl,
        tamanioBytes: Math.round(dataUrl.length * 0.75),
        fechaSubida: new Date().toISOString().split('T')[0]
      }
    }));
  };

  const handleGenerateSampleExcel = () => {
    const csvContent =
      'CODIGO_PROTOCOLO,SECTOR,PRUEBA_MEDICA,EXIGENCIA_RM312,PERIODICIDAD,CRITERIO_APTITUD\n' +
      `${formData.codigoProtocolo},${formData.sectorActividad},Triaje y Somatometría,MANDATORIO,ANUAL,IMC < 35\n` +
      `${formData.codigoProtocolo},${formData.sectorActividad},Examen Físico Clínico por Médico Ocupacional,MANDATORIO,ANUAL,Sin contraindicaciones\n` +
      `${formData.codigoProtocolo},${formData.sectorActividad},Audiometría Tonal ISO 8253-1,MANDATORIO,ANUAL,Bilateral < 25dB\n` +
      `${formData.codigoProtocolo},${formData.sectorActividad},Espirometría Digital ATS/ERS,MANDATORIO,ANUAL,FVC > 80%\n` +
      `${formData.codigoProtocolo},${formData.sectorActividad},Radiografía de Tórax OIT 2000,MANDATORIO,ANUAL,Lectura 0/0\n` +
      `${formData.codigoProtocolo},${formData.sectorActividad},Perfil Hemático y Bioquímico Completo,MANDATORIO,ANUAL,Glucosa < 110mg/dL\n` +
      `${formData.codigoProtocolo},${formData.sectorActividad},Evaluación Psicológica Ocupacional,MANDATORIO,BIANUAL,Apto Psico-emocional\n`;

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      setFormData(prev => ({
        ...prev,
        archivoProtocolo: {
          nombreArchivo: `Matriz_Bateria_Protocolo_${formData.codigoProtocolo}.csv`,
          tipoArchivo: 'EXCEL',
          dataUrl,
          tamanioBytes: blob.size,
          fechaSubida: new Date().toISOString().split('T')[0]
        }
      }));
    };
    reader.readAsDataURL(blob);
  };

  const handleSubmitNewProtocolo = (e: React.FormEvent) => {
    e.preventDefault();
    const newProt: ProtocoloExamenMedico = {
      id: `prot-${Date.now()}`,
      empresaId: formData.empresaId,
      nombreProtocolo: formData.nombreProtocolo!,
      codigoProtocolo: formData.codigoProtocolo!,
      sectorActividad: formData.sectorActividad as any,
      tipoEvaluacion: formData.tipoEvaluacion as any,
      normaLegalBase: formData.normaLegalBase!,
      descripcionBateria: formData.descripcionBateria!,
      estado: 'ACTIVO',
      version: formData.version || '1.0',
      fechaAprobacion: formData.fechaAprobacion || new Date().toISOString().split('T')[0],
      archivoProtocolo: formData.archivoProtocolo
    };

    onAddProtocolo(newProt);
    setShowModal(false);

    // Reset Form
    setFormData({
      empresaId: empresas[0]?.id || 'emp-1',
      nombreProtocolo: 'Protocolo de Exámenes Médicos Ocupacionales (EMO)',
      codigoProtocolo: `PROT-EMO-${new Date().getFullYear()}-${Math.floor(Math.random() * 900 + 100)}`,
      sectorActividad: 'MINERIA',
      tipoEvaluacion: 'TODOS',
      normaLegalBase: 'R.M. 312-2011-MINSA Anexo 01 y 02',
      descripcionBateria: 'Triaje Completo, Examen Físico Clínico, Espirometría, Audiometría, Rx OIT 2000, Laboratorio, Psicología, EKG.',
      estado: 'ACTIVO',
      version: '1.0',
      fechaAprobacion: new Date().toISOString().split('T')[0],
      archivoProtocolo: undefined
    });
  };

  const handleUpdateProtocolSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editModal.protocolo) return;

    const updatedProt: ProtocoloExamenMedico = {
      ...editModal.protocolo,
      empresaId: formData.empresaId || editModal.protocolo.empresaId,
      nombreProtocolo: formData.nombreProtocolo || editModal.protocolo.nombreProtocolo,
      codigoProtocolo: formData.codigoProtocolo || editModal.protocolo.codigoProtocolo,
      sectorActividad: (formData.sectorActividad as any) || editModal.protocolo.sectorActividad,
      tipoEvaluacion: (formData.tipoEvaluacion as any) || editModal.protocolo.tipoEvaluacion,
      normaLegalBase: formData.normaLegalBase || editModal.protocolo.normaLegalBase,
      descripcionBateria: formData.descripcionBateria || editModal.protocolo.descripcionBateria,
      version: formData.version || editModal.protocolo.version || '1.1',
      archivoProtocolo: formData.archivoProtocolo !== undefined ? formData.archivoProtocolo : editModal.protocolo.archivoProtocolo
    };

    if (onUpdateProtocolo) {
      onUpdateProtocolo(updatedProt);
    }
    setEditModal({ open: false });
  };

  const handleDownloadFile = (prot: ProtocoloExamenMedico) => {
    if (prot.archivoProtocolo?.dataUrl) {
      const a = document.createElement('a');
      a.href = prot.archivoProtocolo.dataUrl;
      a.download = prot.archivoProtocolo.nombreArchivo || `${prot.codigoProtocolo}_documento`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } else {
      // Autogenerate PDF for download if no file exists
      const doc = new jsPDF({ orientation: 'p', unit: 'mm', format: 'a4' });
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(14);
      doc.text(`PROTOCOLO OFICIAL DE EXÁMENES MÉDICOS: ${prot.codigoProtocolo}`, 15, 20);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text(`Nombre: ${prot.nombreProtocolo}`, 15, 28);
      doc.text(`Sector: ${prot.sectorActividad} | Base Legal: ${prot.normaLegalBase}`, 15, 34);
      doc.text(`Batería: ${prot.descripcionBateria}`, 15, 42, { maxWidth: 180 });
      doc.save(`${prot.codigoProtocolo}_Protocolo_EMO.pdf`);
    }
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return 'Archivo Adjunto';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const countPdf = protocolos.filter(p => p.archivoProtocolo?.tipoArchivo === 'PDF').length;
  const countExcel = protocolos.filter(p => p.archivoProtocolo?.tipoArchivo === 'EXCEL').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 p-5 rounded-2xl border border-slate-800 shadow-xl">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-[10px] font-bold uppercase rounded">
              R.M. 312-2011-MINSA Anexo 01 y 02
            </span>
            <span className="px-2.5 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold uppercase rounded flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" /> Repositorio PDF y Excel (.xlsx)
            </span>
          </div>
          <h2 className="text-xl font-bold text-white font-display flex items-center gap-2">
            <ClipboardList className="w-6 h-6 text-indigo-400" /> Protocolos y Baterías de Exámenes Médicos Ocupacionales (EMO)
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Carga, consulta y descarga los protocolos médicos en PDF o matrices en Excel requeridos para cada perfil de riesgo.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setShowModal(true)}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold flex items-center gap-2 shadow-lg shadow-indigo-900/40 transition-all"
          >
            <Plus className="w-4 h-4" /> Subir / Nuevo Protocolo
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3.5 sm:p-4 flex items-center gap-3 min-w-0 shadow-sm">
          <div className="p-2.5 sm:p-3 bg-indigo-500/10 text-indigo-400 rounded-lg border border-indigo-500/20 shrink-0">
            <ClipboardList className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-[11px] sm:text-xs text-slate-400 font-medium truncate">Total Protocolos EMO</div>
            <div className="text-base sm:text-lg font-bold text-white truncate">{protocolos.length} Activos</div>
            <div className="text-[10px] text-slate-500 truncate">Conformidad SUNAFIL y MINSA</div>
          </div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3.5 sm:p-4 flex items-center gap-3 min-w-0 shadow-sm">
          <div className="p-2.5 sm:p-3 bg-emerald-500/10 text-emerald-400 rounded-lg border border-emerald-500/20 shrink-0">
            <FileSpreadsheet className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-[11px] sm:text-xs text-slate-400 font-medium truncate">Matrices en Excel (.xlsx)</div>
            <div className="text-base sm:text-lg font-bold text-emerald-400 truncate">{countExcel} Matrices</div>
            <div className="text-[10px] text-emerald-400/80 truncate">Tablas de Baterías de Exámenes</div>
          </div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3.5 sm:p-4 flex items-center gap-3 min-w-0 shadow-sm">
          <div className="p-2.5 sm:p-3 bg-rose-500/10 text-rose-400 rounded-lg border border-rose-500/20 shrink-0">
            <FileText className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-[11px] sm:text-xs text-slate-400 font-medium truncate">Protocolos en PDF (.pdf)</div>
            <div className="text-base sm:text-lg font-bold text-rose-400 truncate">{countPdf} Documentos</div>
            <div className="text-[10px] text-rose-400/80 truncate">Visor Integrado en Pantalla</div>
          </div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3.5 sm:p-4 flex items-center gap-3 min-w-0 shadow-sm">
          <div className="p-2.5 sm:p-3 bg-amber-500/10 text-amber-400 rounded-lg border border-amber-500/20 shrink-0">
            <Stethoscope className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-[11px] sm:text-xs text-slate-400 font-medium truncate">Sectores de Riesgo</div>
            <div className="text-base sm:text-lg font-bold text-amber-400 truncate">5 Actividades</div>
            <div className="text-[10px] text-slate-500 truncate">Minería, Construcción, Agro, etc.</div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-900/80 p-3.5 rounded-xl border border-slate-800">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar por código, protocolo o examen..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
          <span className="text-xs text-slate-400 font-medium flex items-center gap-1 shrink-0">
            <Filter className="w-3.5 h-3.5" /> Sector:
          </span>
          {['TODOS', 'MINERIA', 'CONSTRUCCION', 'AGROINDUSTRIA', 'SALUD', 'GENERAL'].map((sect) => (
            <button
              key={sect}
              onClick={() => setSelectedSector(sect)}
              className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all shrink-0 ${
                selectedSector === sect
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'
              }`}
            >
              {sect}
            </button>
          ))}
        </div>
      </div>

      {/* Protocols Grid / Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredProtocolos.map((prot) => {
          const emp = (empresas || []).find(e => e.id === prot.empresaId);
          const hasFile = !!prot.archivoProtocolo;
          const isExcel = prot.archivoProtocolo?.tipoArchivo === 'EXCEL';
          const nombre = prot.nombreProtocolo || (prot as any).nombre || 'Protocolo EMO';
          const codigo = prot.codigoProtocolo || (prot as any).codigo || 'PROT-001';
          const sector = prot.sectorActividad || 'GENERAL';
          const norma = prot.normaLegalBase || 'R.M. 312-2011-MINSA';
          const bateria = prot.descripcionBateria || 'Batería de exámenes médicos ocupacionales';
          const version = prot.version || '1.0';

          return (
            <div
              key={prot.id}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between hover:border-slate-700 transition-all shadow-xl group"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="px-2.5 py-0.5 bg-slate-800 text-indigo-300 font-mono text-[10px] font-bold border border-slate-700 rounded">
                      {codigo}
                    </span>
                    <span className={`px-2 py-0.5 text-[10px] font-bold rounded ${
                      sector === 'MINERIA'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        : sector === 'CONSTRUCCION'
                        ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                        : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    }`}>
                      {sector}
                    </span>
                    <span className="px-2 py-0.5 bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-[10px] font-bold uppercase rounded">
                      {prot.tipoEvaluacion === 'INGRESO' ? 'PRE-OCUPACIONAL' :
                       prot.tipoEvaluacion === 'PERIODICO' ? 'PERIÓDICO' :
                       prot.tipoEvaluacion === 'RETIRO' ? 'RETIRO' :
                       prot.tipoEvaluacion === 'REUBICACION' ? 'REUBICACIÓN' : 'TODOS LOS TIPOS'}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => {
                        setFormData({
                          empresaId: prot.empresaId,
                          nombreProtocolo: prot.nombreProtocolo,
                          codigoProtocolo: prot.codigoProtocolo,
                          sectorActividad: prot.sectorActividad,
                          tipoEvaluacion: prot.tipoEvaluacion,
                          normaLegalBase: prot.normaLegalBase,
                          descripcionBateria: prot.descripcionBateria,
                          version: prot.version || '1.0',
                          archivoProtocolo: prot.archivoProtocolo
                        });
                        setEditModal({ open: true, protocolo: prot });
                      }}
                      className="p-1.5 bg-indigo-500/10 hover:bg-indigo-600 text-indigo-400 hover:text-white border border-indigo-500/20 rounded-lg text-xs transition-colors shrink-0"
                      title="Editar este Protocolo EMO"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setDeleteModal({ open: true, protocolo: prot })}
                      className="p-1.5 bg-rose-500/10 hover:bg-rose-500 text-rose-400 hover:text-white border border-rose-500/20 rounded-lg text-xs transition-colors shrink-0"
                      title="Eliminar este Protocolo EMO"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <h3 className="font-bold text-white text-sm mb-1.5 line-clamp-2 group-hover:text-indigo-300 transition-colors">
                  {nombre}
                </h3>

                <div className="text-[11px] text-slate-400 space-y-1 mb-3">
                  <div className="flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                    <span className="truncate">{emp ? emp.razonSocial : 'Empresa Cliente / General'}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Base Legal: {norma}</span>
                  </div>
                </div>

                <div className="p-3 bg-slate-950/80 border border-slate-800/80 rounded-xl mb-4 text-[11px]">
                  <div className="text-slate-400 font-medium mb-1 flex items-center justify-between">
                    <span>Batería de Exámenes Exigidos:</span>
                    <span className="text-[9px] text-slate-500">v{version}</span>
                  </div>
                  <p className="text-slate-300 text-[10px] leading-relaxed line-clamp-3">
                    {bateria}
                  </p>
                </div>
              </div>

              {/* Document File Section & Actions */}
              <div className="pt-3 border-t border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  {hasFile ? (
                    <div className="flex items-center gap-2">
                      {isExcel ? (
                        <span className="p-1.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded-lg">
                          <FileSpreadsheet className="w-4 h-4" />
                        </span>
                      ) : (
                        <span className="p-1.5 bg-rose-500/10 text-rose-400 border border-rose-500/30 rounded-lg">
                          <FileText className="w-4 h-4" />
                        </span>
                      )}
                      <div>
                        <div className="text-xs font-bold text-slate-200 truncate max-w-[140px]" title={prot.archivoProtocolo?.nombreArchivo}>
                          {prot.archivoProtocolo?.nombreArchivo}
                        </div>
                        <div className="text-[9px] text-slate-400">
                          {prot.archivoProtocolo?.tipoArchivo} • {formatFileSize(prot.archivoProtocolo?.tamanioBytes)}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <span className="text-[10px] text-slate-500 italic">
                      Sin archivo PDF / Excel adjunto
                    </span>
                  )}

                  <button
                    onClick={() => setUploadFileModal({ open: true, protocolo: prot })}
                    className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 rounded-lg text-xs"
                    title="Subir o Reemplazar PDF / Excel"
                  >
                    <Upload className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setViewerModal({ open: true, protocolo: prot })}
                    className="w-full py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 border border-slate-700 transition-all"
                  >
                    <Eye className="w-3.5 h-3.5 text-blue-400" /> Previsualizar
                  </button>

                  <button
                    onClick={() => handleDownloadFile(prot)}
                    className="w-full py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 shadow-md shadow-indigo-900/30 transition-all"
                  >
                    <Download className="w-3.5 h-3.5" /> Descargar
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* MODAL 1: Create New Protocol & Upload File */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl p-6 shadow-2xl text-slate-100 my-8">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
              <h3 className="text-lg font-bold font-display text-white flex items-center gap-2">
                <ClipboardList className="w-5 h-5 text-indigo-400" /> Registrar Nuevo Protocolo de Exámenes Médicos
              </h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleSubmitNewProtocolo} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Empresa Cliente / Sede</label>
                  <select
                    value={formData.empresaId}
                    onChange={(e) => setFormData({ ...formData, empresaId: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white focus:outline-none focus:border-indigo-500"
                  >
                    {empresas.map((e) => (
                      <option key={e.id} value={e.id}>
                        {e.razonSocial} ({e.ruc})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Código del Protocolo</label>
                  <input
                    type="text"
                    required
                    value={formData.codigoProtocolo}
                    onChange={(e) => setFormData({ ...formData, codigoProtocolo: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white font-mono font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Nombre / Título del Protocolo</label>
                <input
                  type="text"
                  required
                  value={formData.nombreProtocolo}
                  onChange={(e) => setFormData({ ...formData, nombreProtocolo: e.target.value })}
                  placeholder="Ej: Protocolo de Exámenes Médicos para Operadores de Maquinaria Pesada"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Sector / Actividad</label>
                  <select
                    value={formData.sectorActividad}
                    onChange={(e) => setFormData({ ...formData, sectorActividad: e.target.value as any })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
                  >
                    <option value="MINERIA">MINERÍA</option>
                    <option value="CONSTRUCCION">CONSTRUCCIÓN</option>
                    <option value="AGROINDUSTRIA">AGROINDUSTRIA</option>
                    <option value="SALUD">SALUD</option>
                    <option value="ELECTRICIDAD">ELECTRICIDAD</option>
                    <option value="GENERAL">GENERAL</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Tipo de Evaluación EMO</label>
                  <select
                    value={formData.tipoEvaluacion}
                    onChange={(e) => setFormData({ ...formData, tipoEvaluacion: e.target.value as any })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
                  >
                    <option value="TODOS">TODOS LOS TIPOS</option>
                    <option value="INGRESO">PRE-OCUPACIONAL (INGRESO)</option>
                    <option value="PERIODICO">PERIÓDICO (ANUAL)</option>
                    <option value="RETIRO">RETIRO</option>
                    <option value="REUBICACION">REUBICACIÓN LABORAL</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Base Legal / Norma</label>
                  <input
                    type="text"
                    required
                    value={formData.normaLegalBase}
                    onChange={(e) => setFormData({ ...formData, normaLegalBase: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Batería de Exámenes Exigidos (Detalle)</label>
                <textarea
                  rows={3}
                  required
                  value={formData.descripcionBateria}
                  onChange={(e) => setFormData({ ...formData, descripcionBateria: e.target.value })}
                  placeholder="Escriba los exámenes exigidos: Triaje, Audiometría, Espirometría, Rx OIT, Laboratorio, Psicología..."
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              {/* UPLOAD FILE SECTION (PDF OR EXCEL) */}
              <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                    <FileUp className="w-4 h-4 text-indigo-400" />
                    Cargar Documento de Protocolo en PDF o Excel (.xlsx, .csv)
                  </label>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={handleGenerateSampleExcel}
                      className="text-[10px] px-2 py-1 bg-emerald-600/20 text-emerald-300 hover:bg-emerald-600 hover:text-white border border-emerald-500/30 rounded font-semibold flex items-center gap-1 transition-all"
                    >
                      <FileSpreadsheet className="w-3 h-3" /> Generar Excel
                    </button>

                    <button
                      type="button"
                      onClick={handleGenerateSamplePdf}
                      className="text-[10px] px-2 py-1 bg-indigo-600/20 text-indigo-300 hover:bg-indigo-600 hover:text-white border border-indigo-500/30 rounded font-semibold flex items-center gap-1 transition-all"
                    >
                      <Sparkles className="w-3 h-3 text-amber-400" /> Generar PDF
                    </button>
                  </div>
                </div>

                {formData.archivoProtocolo ? (
                  <div className="p-3 bg-indigo-950/40 border border-indigo-500/40 rounded-lg flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-indigo-500/20 rounded-lg text-indigo-300">
                        <CheckCircle2 className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="font-bold text-slate-200 text-xs">
                          {formData.archivoProtocolo.nombreArchivo}
                        </div>
                        <div className="text-[10px] text-indigo-300">
                          Formato {formData.archivoProtocolo.tipoArchivo} • {formatFileSize(formData.archivoProtocolo.tamanioBytes)} • Creado el {formData.archivoProtocolo.fechaSubida}
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, archivoProtocolo: undefined })}
                      className="p-1 bg-rose-500/20 text-rose-400 hover:bg-rose-500 hover:text-white rounded border border-rose-500/30 transition-all"
                      title="Quitar archivo"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div
                    onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={(e) => {
                      e.preventDefault();
                      setIsDragging(false);
                      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                        handleFileProcess(e.dataTransfer.files[0], (archivo) => {
                          setFormData({ ...formData, archivoProtocolo: archivo });
                        });
                      }
                    }}
                    className={`border-2 border-dashed rounded-xl p-5 text-center transition-all cursor-pointer ${
                      isDragging
                        ? 'border-indigo-500 bg-indigo-500/10'
                        : 'border-slate-800 hover:border-slate-700 bg-slate-900/50'
                    }`}
                  >
                    <input
                      type="file"
                      id="prot-file-upload-input"
                      accept=".pdf,.xlsx,.xls,.csv"
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          handleFileProcess(e.target.files[0], (archivo) => {
                            setFormData({ ...formData, archivoProtocolo: archivo });
                          });
                        }
                      }}
                    />
                    <label htmlFor="prot-file-upload-input" className="cursor-pointer flex flex-col items-center gap-2">
                      <div className="flex items-center gap-2">
                        <FileText className="w-6 h-6 text-rose-400" />
                        <FileSpreadsheet className="w-6 h-6 text-emerald-400" />
                      </div>
                      <div>
                        <span className="text-xs font-bold text-indigo-400 hover:underline">
                          Haz clic para subir el Protocolo (PDF o Excel)
                        </span>{' '}
                        <span className="text-xs text-slate-400">o arrastra y suelta el archivo</span>
                      </div>
                      <span className="text-[10px] text-slate-500">
                        Formatos soportados: Documento PDF (.pdf) o Matriz Excel (.xlsx, .xls, .csv)
                      </span>
                    </label>
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-slate-800 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg font-medium hover:bg-slate-700"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-semibold shadow-lg shadow-indigo-900/30 flex items-center gap-2"
                >
                  <ClipboardList className="w-4 h-4" /> Guardar Protocolo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: Upload / Replace File on Existing Protocol */}
      {uploadFileModal.open && uploadFileModal.protocolo && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl text-slate-100">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Upload className="w-5 h-5 text-indigo-400" /> Adjuntar o Reemplazar Documento
              </h3>
              <button
                onClick={() => setUploadFileModal({ open: false })}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                <div className="font-bold text-white text-sm">
                  {uploadFileModal.protocolo.codigoProtocolo} - {uploadFileModal.protocolo.nombreProtocolo}
                </div>
                <div className="text-slate-400 mt-1">
                  Sector: {uploadFileModal.protocolo.sectorActividad} | Base Legal: {uploadFileModal.protocolo.normaLegalBase}
                </div>
              </div>

              <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-3">
                <label className="block text-xs font-bold text-slate-200">
                  Selecciona archivo desde tu computador (PDF o Excel):
                </label>

                <input
                  type="file"
                  id="modal-prot-file"
                  accept=".pdf,.xlsx,.xls,.csv"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0] && uploadFileModal.protocolo) {
                      handleFileProcess(e.target.files[0], (archivo) => {
                        if (onUpdateProtocolo) {
                          onUpdateProtocolo({
                            ...uploadFileModal.protocolo!,
                            archivoProtocolo: archivo
                          });
                        }
                        setUploadFileModal({ open: false });
                      });
                    }
                  }}
                />

                <label
                  htmlFor="modal-prot-file"
                  className="p-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-all shadow-lg shadow-indigo-900/30"
                >
                  <Upload className="w-4 h-4" /> Seleccionar Archivo PDF / Excel (.xlsx)
                </label>
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setUploadFileModal({ open: false })}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg font-medium"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: Interactive Viewer (PDF / Excel Matrix Viewer) */}
      {viewerModal.open && viewerModal.protocolo && (() => {
        const activeViewerProt = (protocolos || []).find(p => p.id === viewerModal.protocolo?.id) || viewerModal.protocolo;
        if (!activeViewerProt) return null;

        return (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-5xl h-[90vh] flex flex-col p-5 shadow-2xl text-slate-100">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800 flex-wrap gap-2">
                <div className="flex items-center gap-2.5">
                  <ClipboardList className="w-5 h-5 text-indigo-400" />
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-white">
                        Visor de Protocolo: {activeViewerProt.codigoProtocolo}
                      </h3>
                      <span className="px-2 py-0.5 bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-[10px] font-bold uppercase rounded">
                        EMO: {
                          activeViewerProt.tipoEvaluacion === 'INGRESO' ? 'PRE-OCUPACIONAL' :
                          activeViewerProt.tipoEvaluacion === 'PERIODICO' ? 'PERIÓDICO' :
                          activeViewerProt.tipoEvaluacion === 'RETIRO' ? 'RETIRO' :
                          activeViewerProt.tipoEvaluacion === 'REUBICACION' ? 'REUBICACIÓN' : 'TODOS LOS TIPOS'
                        }
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-400">
                      {activeViewerProt.nombreProtocolo}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setFormData({
                        empresaId: activeViewerProt.empresaId,
                        nombreProtocolo: activeViewerProt.nombreProtocolo,
                        codigoProtocolo: activeViewerProt.codigoProtocolo,
                        sectorActividad: activeViewerProt.sectorActividad,
                        tipoEvaluacion: activeViewerProt.tipoEvaluacion,
                        normaLegalBase: activeViewerProt.normaLegalBase,
                        descripcionBateria: activeViewerProt.descripcionBateria,
                        version: activeViewerProt.version || '1.0',
                        archivoProtocolo: activeViewerProt.archivoProtocolo
                      });
                      setEditModal({ open: true, protocolo: activeViewerProt });
                    }}
                    className="px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-md shadow-amber-900/40"
                  >
                    <Edit3 className="w-4 h-4" /> Editar Protocolo
                  </button>

                  <button
                    onClick={() => handleDownloadFile(activeViewerProt)}
                    className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-indigo-900/40"
                  >
                    <Download className="w-4 h-4" /> Descargar Archivo
                  </button>

                  <button
                    onClick={() => setViewerModal({ open: false })}
                    className="p-1.5 bg-slate-800 text-slate-400 hover:text-white rounded-lg border border-slate-700"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Viewer Content */}
              <div className="flex-1 my-3 bg-slate-950 rounded-xl overflow-hidden border border-slate-800 relative flex flex-col">
                {activeViewerProt.archivoProtocolo?.tipoArchivo === 'EXCEL' ? (
                  /* EXCEL / MATRIX INTERACTIVE SPREADSHEET TABLE VIEW */
                  <div className="p-5 flex-1 overflow-y-auto space-y-4">
                    <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-emerald-500/20 text-emerald-400 rounded-lg">
                          <FileSpreadsheet className="w-6 h-6" />
                        </div>
                        <div>
                          <div className="font-bold text-white text-xs">
                            {activeViewerProt.archivoProtocolo?.nombreArchivo || `Matriz_Bateria_${activeViewerProt.codigoProtocolo}.xlsx`}
                          </div>
                          <div className="text-[10px] text-emerald-400 font-mono">
                            Matriz de Batería de Exámenes Exigidos por la R.M. 312-2011-MINSA
                          </div>
                        </div>
                      </div>

                      <span className="px-2.5 py-1 bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 rounded text-[10px] font-bold">
                        HOJA DE CÁLCULO ACTIVA
                      </span>
                    </div>

                    {/* Sample Parsed Table for Protocol Examen Battery */}
                    <div className="overflow-x-auto rounded-xl border border-slate-800">
                      <table className="w-full text-left text-xs text-slate-300">
                        <thead className="bg-slate-900 text-slate-400 uppercase text-[10px] font-bold border-b border-slate-800">
                          <tr>
                            <th className="px-3 py-2.5">N°</th>
                            <th className="px-3 py-2.5">Examen / Evaluación Médica</th>
                            <th className="px-3 py-2.5">Exigencia RM 312</th>
                            <th className="px-3 py-2.5">Frecuencia</th>
                            <th className="px-3 py-2.5">Factor de Riesgo Asociado</th>
                            <th className="px-3 py-2.5">Criterio de Aptitud Ocupacional</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800 bg-slate-950 font-mono text-[11px]">
                          <tr className="hover:bg-slate-900/60">
                            <td className="px-3 py-2 text-slate-500">01</td>
                            <td className="px-3 py-2 font-bold text-white font-sans">Triaje y Somatometría Completa</td>
                            <td className="px-3 py-2 text-emerald-400">OBLIGATORIO</td>
                            <td className="px-3 py-2 text-slate-300 font-sans">Anual</td>
                            <td className="px-3 py-2 text-slate-400 font-sans">Ergonomía / Cardiovascular</td>
                            <td className="px-3 py-2 text-amber-300 font-sans">IMC &lt; 35.0 (Sin Obesidad Mórbida)</td>
                          </tr>
                          <tr className="hover:bg-slate-900/60">
                            <td className="px-3 py-2 text-slate-500">02</td>
                            <td className="px-3 py-2 font-bold text-white font-sans">Examen Físico Clínico Ocupacional</td>
                            <td className="px-3 py-2 text-emerald-400">OBLIGATORIO</td>
                            <td className="px-3 py-2 text-slate-300 font-sans">Anual</td>
                            <td className="px-3 py-2 text-slate-400 font-sans">Riesgo General Socavón/Superficie</td>
                            <td className="px-3 py-2 text-emerald-300 font-sans">Apto para Trabajo Operativo</td>
                          </tr>
                          <tr className="hover:bg-slate-900/60">
                            <td className="px-3 py-2 text-slate-500">03</td>
                            <td className="px-3 py-2 font-bold text-white font-sans">Audiometría Tonal ISO 8253-1</td>
                            <td className="px-3 py-2 text-emerald-400">OBLIGATORIO</td>
                            <td className="px-3 py-2 text-slate-300 font-sans">Anual</td>
                            <td className="px-3 py-2 text-slate-400 font-sans">Exposición a Ruido &gt; 85 dB(A)</td>
                            <td className="px-3 py-2 text-slate-300 font-sans">Umbral Auditivo &lt; 25 dB o Nivel II</td>
                          </tr>
                          <tr className="hover:bg-slate-900/60">
                            <td className="px-3 py-2 text-slate-500">04</td>
                            <td className="px-3 py-2 font-bold text-white font-sans">Espirometría Digital ATS/ERS</td>
                            <td className="px-3 py-2 text-emerald-400">OBLIGATORIO</td>
                            <td className="px-3 py-2 text-slate-300 font-sans">Anual</td>
                            <td className="px-3 py-2 text-slate-400 font-sans">Polvos Respirables / Sílice</td>
                            <td className="px-3 py-2 text-slate-300 font-sans">FVC &gt; 80% y FEV1/FVC &gt; 70%</td>
                          </tr>
                          <tr className="hover:bg-slate-900/60">
                            <td className="px-3 py-2 text-slate-500">05</td>
                            <td className="px-3 py-2 font-bold text-white font-sans">Radiografía de Tórax OIT 2000</td>
                            <td className="px-3 py-2 text-emerald-400">OBLIGATORIO</td>
                            <td className="px-3 py-2 text-slate-300 font-sans">Anual</td>
                            <td className="px-3 py-2 text-slate-400 font-sans">Neumoconiosis / Silicosis</td>
                            <td className="px-3 py-2 text-slate-300 font-sans">Categoría OIT 0/0 (Sin Opacidades)</td>
                          </tr>
                          <tr className="hover:bg-slate-900/60">
                            <td className="px-3 py-2 text-slate-500">06</td>
                            <td className="px-3 py-2 font-bold text-white font-sans">Laboratorio: Perfil Hepático & Renal</td>
                            <td className="px-3 py-2 text-emerald-400">OBLIGATORIO</td>
                            <td className="px-3 py-2 text-slate-300 font-sans">Anual</td>
                            <td className="px-3 py-2 text-slate-400 font-sans">Sustancias Químicas / Metales</td>
                            <td className="px-3 py-2 text-slate-300 font-sans">TGO/TGP &lt; 40 U/L, Creatinina normal</td>
                          </tr>
                          <tr className="hover:bg-slate-900/60">
                            <td className="px-3 py-2 text-slate-500">07</td>
                            <td className="px-3 py-2 font-bold text-white font-sans">Evaluación Psicológica Ocupacional</td>
                            <td className="px-3 py-2 text-emerald-400">OBLIGATORIO</td>
                            <td className="px-3 py-2 text-slate-300 font-sans">Anual</td>
                            <td className="px-3 py-2 text-slate-400 font-sans">Trabajos en Altura &gt; 2500 msnm</td>
                            <td className="px-3 py-2 text-emerald-300 font-sans">Apto Psico-emocional / Acrofobia (-)</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    <div className="p-3 bg-slate-900/60 border border-slate-800 rounded-lg text-xs text-slate-400 flex items-center gap-2">
                      <Info className="w-4 h-4 text-indigo-400 shrink-0" />
                      <span>
                        Detalle técnico del protocolo oficial. Para exportar esta matriz en formato editable Microsoft Excel o CSV, presiona el botón <strong>Descargar Archivo</strong>.
                      </span>
                    </div>
                  </div>
                ) : (
                  /* PDF DOCUMENT VIEWER (Displays uploaded PDF or auto-generated official PDF) */
                  <iframe
                    key={activeViewerProt.archivoProtocolo?.dataUrl || activeViewerProt.id}
                    src={
                      activeViewerProt.archivoProtocolo?.dataUrl ||
                      (() => {
                        const emp = (empresas || []).find(e => e.id === activeViewerProt.empresaId);
                        const doc = new jsPDF({ orientation: 'p', unit: 'mm', format: 'a4' });
                        doc.setFillColor(15, 23, 42);
                        doc.rect(10, 10, 190, 20, 'F');
                        doc.setTextColor(255, 255, 255);
                        doc.setFont('helvetica', 'bold');
                        doc.setFontSize(11);
                        doc.text('MATRIZ OFICIAL DE PROTOCOLO DE EXAMENES MEDICOS EMO', 105, 18, { align: 'center' });
                        doc.setFontSize(8);
                        doc.setFont('helvetica', 'normal');
                        doc.text('CUMPLIMIENTO LEGAL R.M. 312-2011-MINSA / SALUD OCUPACIONAL', 105, 24, { align: 'center' });

                        let y = 38;
                        doc.setTextColor(15, 23, 42);
                        doc.setFontSize(9);
                        doc.setFont('helvetica', 'bold');
                        doc.text(`CÓDIGO PROTOCOLO: ${activeViewerProt.codigoProtocolo}`, 12, y);
                        doc.text(`SECTOR: ${activeViewerProt.sectorActividad}`, 120, y);
                        y += 6;
                        doc.text(`TIPO DE EVALUACIÓN: ${
                          activeViewerProt.tipoEvaluacion === 'INGRESO' ? 'PRE-OCUPACIONAL (INGRESO)' :
                          activeViewerProt.tipoEvaluacion === 'PERIODICO' ? 'PERIÓDICO (ANUAL)' :
                          activeViewerProt.tipoEvaluacion === 'RETIRO' ? 'RETIRO' :
                          activeViewerProt.tipoEvaluacion === 'REUBICACION' ? 'REUBICACIÓN' : 'TODOS LOS TIPOS'
                        }`, 12, y);
                        y += 6;
                        doc.setFont('helvetica', 'normal');
                        doc.text(`Nombre Protocolo: ${activeViewerProt.nombreProtocolo}`, 12, y);
                        y += 6;
                        doc.text(`Empresa / Entidad: ${emp?.razonSocial || 'Compañía Registrada'} (RUC: ${emp?.ruc || 'N/A'})`, 12, y);
                        y += 6;
                        doc.text(`Norma Base Legal: ${activeViewerProt.normaLegalBase}`, 12, y);
                        y += 8;

                        doc.setFillColor(241, 245, 249);
                        doc.rect(10, y, 190, 6, 'F');
                        doc.setFont('helvetica', 'bold');
                        doc.text('BATERIA DE EXAMENES CLINICOS Y COMPLEMENTARIOS EXIGIDOS', 12, y + 4.2);
                        y += 10;

                        const bateria = activeViewerProt.descripcionBateria ? activeViewerProt.descripcionBateria.split(',') : ['Triaje', 'Medicina General', 'Espirometría', 'Audiometría'];
                        bateria.forEach((ex, idx) => {
                          doc.setFont('helvetica', 'normal');
                          doc.text(`${idx + 1}. ${ex.trim()} --- Exigido según Riesgo IPERC (Anexo 02 RM 312-2011)`, 14, y);
                          y += 6;
                        });

                        y += 10;
                        doc.setFont('helvetica', 'bold');
                        doc.text('Aprobado por el Médico Ocupacional (CMP / RNM)', 12, y);
                        doc.setFont('helvetica', 'normal');
                        doc.text('ERP MedOcupa - Documento Médico Registrado Oficialmente', 12, y + 5);

                        return doc.output('datauristring');
                      })()
                    }
                    className="w-full h-full bg-white rounded-xl"
                    title="Visor Documento Protocolo EMO"
                  />
                )}
              </div>

              <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                <span>R.M. 312-2011-MINSA • Protocolo Aprobado e Integrado en ERP MedOcupa</span>
                <button
                  onClick={() => setViewerModal({ open: false })}
                  className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg"
                >
                  Cerrar Visor
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* MODAL 3.5: Edit Protocol Modal */}
      {editModal.open && editModal.protocolo && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl p-6 shadow-2xl text-slate-100 my-8">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
              <h3 className="text-lg font-bold font-display text-white flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-amber-400" /> Editar Protocolo de Exámenes Médicos
              </h3>
              <button onClick={() => setEditModal({ open: false })} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleUpdateProtocolSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Empresa Cliente / Sede</label>
                  <select
                    value={formData.empresaId}
                    onChange={(e) => setFormData({ ...formData, empresaId: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white focus:outline-none focus:border-indigo-500"
                  >
                    {empresas.map((e) => (
                      <option key={e.id} value={e.id}>
                        {e.razonSocial} ({e.ruc})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Código del Protocolo</label>
                  <input
                    type="text"
                    required
                    value={formData.codigoProtocolo}
                    onChange={(e) => setFormData({ ...formData, codigoProtocolo: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white font-mono font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Nombre / Título del Protocolo</label>
                <input
                  type="text"
                  required
                  value={formData.nombreProtocolo}
                  onChange={(e) => setFormData({ ...formData, nombreProtocolo: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Sector / Actividad</label>
                  <select
                    value={formData.sectorActividad}
                    onChange={(e) => setFormData({ ...formData, sectorActividad: e.target.value as any })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
                  >
                    <option value="MINERIA">MINERÍA</option>
                    <option value="CONSTRUCCION">CONSTRUCCIÓN</option>
                    <option value="AGROINDUSTRIA">AGROINDUSTRIA</option>
                    <option value="SALUD">SALUD</option>
                    <option value="ELECTRICIDAD">ELECTRICIDAD</option>
                    <option value="GENERAL">GENERAL</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Tipo de Evaluación EMO</label>
                  <select
                    value={formData.tipoEvaluacion}
                    onChange={(e) => setFormData({ ...formData, tipoEvaluacion: e.target.value as any })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
                  >
                    <option value="TODOS">TODOS LOS TIPOS</option>
                    <option value="INGRESO">PRE-OCUPACIONAL (INGRESO)</option>
                    <option value="PERIODICO">PERIÓDICO (ANUAL)</option>
                    <option value="RETIRO">RETIRO</option>
                    <option value="REUBICACION">REUBICACIÓN LABORAL</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Base Legal / Norma</label>
                  <input
                    type="text"
                    required
                    value={formData.normaLegalBase}
                    onChange={(e) => setFormData({ ...formData, normaLegalBase: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Batería de Exámenes Exigidos (Detalle)</label>
                <textarea
                  rows={3}
                  required
                  value={formData.descripcionBateria}
                  onChange={(e) => setFormData({ ...formData, descripcionBateria: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              {/* UPLOAD FILE SECTION (PDF OR EXCEL) IN EDIT */}
              <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                    <FileUp className="w-4 h-4 text-indigo-400" />
                    Documento de Protocolo Adjunto (PDF o Excel)
                  </label>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={handleGenerateSampleExcel}
                      className="text-[10px] px-2 py-1 bg-emerald-600/20 text-emerald-300 hover:bg-emerald-600 hover:text-white border border-emerald-500/30 rounded font-semibold flex items-center gap-1 transition-all"
                    >
                      <FileSpreadsheet className="w-3 h-3" /> Generar Excel
                    </button>

                    <button
                      type="button"
                      onClick={handleGenerateSamplePdf}
                      className="text-[10px] px-2 py-1 bg-indigo-600/20 text-indigo-300 hover:bg-indigo-600 hover:text-white border border-indigo-500/30 rounded font-semibold flex items-center gap-1 transition-all"
                    >
                      <Sparkles className="w-3 h-3 text-amber-400" /> Generar PDF
                    </button>
                  </div>
                </div>

                {formData.archivoProtocolo ? (
                  <div className="p-3 bg-indigo-950/40 border border-indigo-500/40 rounded-lg flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-indigo-500/20 rounded-lg text-indigo-300">
                        <CheckCircle2 className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="font-bold text-slate-200 text-xs">
                          {formData.archivoProtocolo.nombreArchivo}
                        </div>
                        <div className="text-[10px] text-indigo-300">
                          Formato {formData.archivoProtocolo.tipoArchivo} • {formatFileSize(formData.archivoProtocolo.tamanioBytes)} • Creado el {formData.archivoProtocolo.fechaSubida}
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, archivoProtocolo: undefined })}
                      className="p-1 bg-rose-500/20 text-rose-400 hover:bg-rose-500 hover:text-white rounded border border-rose-500/30 transition-all"
                      title="Quitar archivo"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div>
                    <input
                      type="file"
                      id="edit-prot-file-upload-input"
                      accept=".pdf,.xlsx,.xls,.csv"
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          handleFileProcess(e.target.files[0], (archivo) => {
                            setFormData({ ...formData, archivoProtocolo: archivo });
                          });
                        }
                      }}
                    />
                    <label htmlFor="edit-prot-file-upload-input" className="p-3 bg-slate-900 border border-slate-700 hover:border-indigo-500 rounded-xl cursor-pointer flex items-center justify-center gap-2 text-indigo-400 font-bold text-xs">
                      <Upload className="w-4 h-4" /> Seleccionar Archivo PDF o Excel (.xlsx)
                    </label>
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-slate-800 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditModal({ open: false })}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg font-medium hover:bg-slate-700"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-semibold shadow-lg shadow-indigo-900/30 flex items-center gap-2"
                >
                  <Save className="w-4 h-4" /> Guardar Cambios
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 4: Delete Protocol Confirmation */}
      {deleteModal.open && deleteModal.protocolo && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl text-slate-100">
            <div className="flex items-start justify-between pb-3 border-b border-slate-800 mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-rose-500/10 text-rose-400 border border-rose-500/30 rounded-xl">
                  <Trash2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Eliminar Protocolo EMO</h3>
                  <p className="text-[11px] text-slate-400">Esta acción no se puede deshacer.</p>
                </div>
              </div>
              <button
                onClick={() => setDeleteModal({ open: false })}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                <div className="text-[10px] uppercase font-bold text-indigo-400">
                  {deleteModal.protocolo.codigoProtocolo}
                </div>
                <div className="font-bold text-white text-sm">
                  {deleteModal.protocolo.nombreProtocolo}
                </div>
                <div className="text-slate-400 text-[11px]">
                  Sector: <span className="text-slate-200">{deleteModal.protocolo.sectorActividad}</span> | Base Legal: <span className="text-slate-200">{deleteModal.protocolo.normaLegalBase}</span>
                </div>
              </div>

              <p className="text-slate-300 leading-relaxed">
                ¿Está seguro de que desea eliminar permanentemente este protocolo médico de la batería EMO?
              </p>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setDeleteModal({ open: false })}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (onDeleteProtocolo && deleteModal.protocolo) {
                      onDeleteProtocolo(deleteModal.protocolo.id);
                    }
                    setDeleteModal({ open: false });
                  }}
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-semibold flex items-center gap-2 shadow-lg shadow-rose-950 transition-all"
                >
                  <Trash2 className="w-4 h-4" /> Confirmar Eliminación
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
