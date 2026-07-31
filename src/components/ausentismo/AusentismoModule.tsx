import React, { useState } from 'react';
import { AusentismoMedico, CertificadoMedicoPdf, Trabajador, Empresa } from '../../types/erp';
import {
  Clock,
  Plus,
  AlertCircle,
  FileCheck2,
  Calendar,
  Stethoscope,
  Building,
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
  Edit3
} from 'lucide-react';
import { CIE10SearchInput } from '../common/CIE10SearchInput';
import {
  descargarCertificadoDescansoMedicoPDF,
  generarDataUrlDescansoMedicoPDF
} from '../../utils/pdfGenerator';

interface AusentismoModuleProps {
  ausentismos: AusentismoMedico[];
  trabajadores: Trabajador[];
  empresas: Empresa[];
  onAddAusentismo: (aus: AusentismoMedico) => void;
  onUpdateAusentismo?: (aus: AusentismoMedico) => void;
  onDeleteAusentismo?: (id: string) => void;
}

export const AusentismoModule: React.FC<AusentismoModuleProps> = ({
  ausentismos,
  trabajadores,
  empresas,
  onAddAusentismo,
  onUpdateAusentismo,
  onDeleteAusentismo
}) => {
  const [showModal, setShowModal] = useState(false);
  const [isManualCIE10, setIsManualCIE10] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [deletingAusentismo, setDeletingAusentismo] = useState<AusentismoMedico | null>(null);
  const [previewPdfModal, setPreviewPdfModal] = useState<{
    open: boolean;
    ausentismo?: AusentismoMedico;
    pdfData?: CertificadoMedicoPdf;
  }>({ open: false });

  const [uploadPdfModal, setUploadPdfModal] = useState<{
    open: boolean;
    ausentismo?: AusentismoMedico;
  }>({ open: false });

  const [formData, setFormData] = useState<Partial<AusentismoMedico>>({
    trabajadorId: trabajadores[0]?.id || 'trab-1',
    tipoAusencia: 'ENFERMEDAD_COMUN',
    codigoCIE10: 'J06.9',
    descripcionCIE10: 'Infección aguda de las vías respiratorias superiores',
    fechaInicio: '2026-07-28',
    fechaFin: '2026-07-30',
    diasTotales: 3,
    centroMedicoEmisor: 'Clínica Internacional',
    medicoTratante: 'Dr. Fernando Vega',
    cmpMedicoTratante: 'CMP 38912',
    montoSubsidioEstimado: 270.00,
    certificadoPdf: undefined
  });

  const [isDragging, setIsDragging] = useState(false);

  // File upload reader
  const handleFileChange = (file: File) => {
    if (file.type !== 'application/pdf' && !file.name.endsWith('.pdf')) {
      alert('Por favor, seleccione un archivo con formato PDF (.pdf)');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      if (dataUrl) {
        setFormData(prev => ({
          ...prev,
          certificadoPdf: {
            nombreArchivo: file.name,
            dataUrl,
            tamanioBytes: file.size,
            fechaSubida: new Date().toISOString().split('T')[0]
          }
        }));
      }
    };
    reader.readAsDataURL(file);
  };

  const handleGenerateSamplePdf = () => {
    const trab = trabajadores.find(t => t.id === formData.trabajadorId) || trabajadores[0];
    const emp = empresas.find(e => e.id === trab?.empresaId) || empresas[0];

    const tempAus: AusentismoMedico = {
      id: `preview-${Date.now()}`,
      trabajadorId: trab?.id || 'trab-1',
      empresaId: emp?.id || 'emp-1',
      tipoAusencia: (formData.tipoAusencia as any) || 'ENFERMEDAD_COMUN',
      codigoCIE10: formData.codigoCIE10 || 'J06.9',
      descripcionCIE10: formData.descripcionCIE10 || 'Infección Aguda Respiratoria',
      fechaInicio: formData.fechaInicio || '2026-07-28',
      fechaFin: formData.fechaFin || '2026-07-30',
      diasTotales: Number(formData.diasTotales) || 3,
      centroMedicoEmisor: formData.centroMedicoEmisor || 'Clínica Internacional',
      medicoTratante: formData.medicoTratante || 'Dr. Fernando Vega',
      cmpMedicoTratante: formData.cmpMedicoTratante || 'CMP 38912',
      montoSubsidioEstimado: Number(formData.montoSubsidioEstimado) || 270
    };

    const dataUrl = generarDataUrlDescansoMedicoPDF(tempAus, trab, emp);
    setFormData(prev => ({
      ...prev,
      certificadoPdf: {
        nombreArchivo: `Certificado_Descanso_${trab?.numeroDocumento || 'Medico'}_${tempAus.codigoCIE10}.pdf`,
        dataUrl,
        tamanioBytes: Math.round(dataUrl.length * 0.75),
        fechaSubida: new Date().toISOString().split('T')[0]
      }
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trab = trabajadores.find(t => t.id === formData.trabajadorId);
    if (!trab) return;

    const newAus: AusentismoMedico = {
      id: `aus-${Date.now()}`,
      trabajadorId: trab.id,
      empresaId: trab.empresaId,
      tipoAusencia: formData.tipoAusencia as any,
      codigoCIE10: formData.codigoCIE10!,
      descripcionCIE10: formData.descripcionCIE10!,
      fechaInicio: formData.fechaInicio!,
      fechaFin: formData.fechaFin!,
      diasTotales: Number(formData.diasTotales),
      centroMedicoEmisor: formData.centroMedicoEmisor!,
      medicoTratante: formData.medicoTratante!,
      cmpMedicoTratante: formData.cmpMedicoTratante!,
      montoSubsidioEstimado: Number(formData.montoSubsidioEstimado),
      certificadoPdf: formData.certificadoPdf
    };

    onAddAusentismo(newAus);
    setShowModal(false);

    // Reset form
    setFormData({
      trabajadorId: trabajadores[0]?.id || 'trab-1',
      tipoAusencia: 'ENFERMEDAD_COMUN',
      codigoCIE10: 'J06.9',
      descripcionCIE10: 'Infección aguda de las vías respiratorias superiores',
      fechaInicio: new Date().toISOString().split('T')[0],
      fechaFin: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      diasTotales: 3,
      centroMedicoEmisor: 'Clínica Internacional',
      medicoTratante: 'Dr. Fernando Vega',
      cmpMedicoTratante: 'CMP 38912',
      montoSubsidioEstimado: 270.00,
      certificadoPdf: undefined
    });
  };

  const getTrabajador = (id: string) => trabajadores.find(x => x.id === id);
  const getTrabajadorNombre = (id: string) => {
    const t = getTrabajador(id);
    return t ? `${t.apellidoPaterno} ${t.nombres} (${t.numeroDocumento})` : 'Trabajador';
  };
  const getEmpresa = (empresaId: string) => empresas.find(e => e.id === empresaId);

  const handleDownloadPdf = (aus: AusentismoMedico) => {
    const trab = getTrabajador(aus.trabajadorId);
    const emp = getEmpresa(aus.empresaId);

    if (aus.certificadoPdf?.dataUrl) {
      const link = document.createElement('a');
      link.href = aus.certificadoPdf.dataUrl;
      link.download = aus.certificadoPdf.nombreArchivo || `Certificado_Descanso_${trab?.numeroDocumento || 'Medico'}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      descargarCertificadoDescansoMedicoPDF(aus, trab, emp);
    }
  };

  const handleAttachPdfToExisting = (aus: AusentismoMedico, pdf: CertificadoMedicoPdf) => {
    if (onUpdateAusentismo) {
      onUpdateAusentismo({
        ...aus,
        certificadoPdf: pdf
      });
    }
    setUploadPdfModal({ open: false });
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return 'PDF Adjunto';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const totalCertificadosConPdf = ausentismos.filter(a => !!a.certificadoPdf).length;
  const totalDiasPerdidos = ausentismos.reduce((acc, a) => acc + a.diasTotales, 0);

  const filteredAusentismos = ausentismos.filter(aus => {
    const trab = trabajadores.find(t => t.id === aus.trabajadorId);
    const trabNombre = trab ? `${trab.nombres} ${trab.apellidoPaterno} ${trab.apellidoMaterno}` : '';
    const trabDni = trab ? trab.numeroDocumento : '';
    const term = searchTerm.toLowerCase().trim();

    if (!term) return true;

    return (
      trabNombre.toLowerCase().includes(term) ||
      trabDni.toLowerCase().includes(term) ||
      aus.codigoCIE10.toLowerCase().includes(term) ||
      aus.descripcionCIE10.toLowerCase().includes(term) ||
      aus.centroMedicoEmisor.toLowerCase().includes(term) ||
      aus.medicoTratante.toLowerCase().includes(term)
    );
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 p-5 rounded-2xl border border-slate-800 shadow-xl">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 bg-blue-500/20 text-blue-300 border border-blue-500/30 text-[10px] font-bold uppercase rounded">
              Ley N° 26790 & CITT ESSALUD (Día 21+)
            </span>
            <span className="px-2.5 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold uppercase rounded flex items-center gap-1">
              <FileText className="w-3 h-3" /> Repositorio Certificados PDF
            </span>
          </div>
          <h2 className="text-xl font-bold text-white font-display flex items-center gap-2">
            <Clock className="w-6 h-6 text-blue-400" /> Ausentismo Laboral & Descansos Médicos (CIE-10)
          </h2>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold flex items-center gap-2 shadow-lg shadow-blue-900/40 transition-all shrink-0"
        >
          <Plus className="w-4 h-4" /> Registrar Descanso
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 flex items-center gap-4">
          <div className="p-3 bg-blue-500/10 text-blue-400 rounded-lg border border-blue-500/20">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-slate-400 font-medium">Total Descansos Médicos</div>
            <div className="text-2xl font-bold text-white">{ausentismos.length} Registros</div>
            <div className="text-[10px] text-slate-500">{totalDiasPerdidos} días perdidos en total</div>
          </div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 flex items-center gap-4">
          <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-lg border border-emerald-500/20">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-slate-400 font-medium">Certificados PDF en Sistema</div>
            <div className="text-2xl font-bold text-emerald-400">{totalCertificadosConPdf} de {ausentismos.length}</div>
            <div className="text-[10px] text-slate-400">Descargables e imprimibles en 1-click</div>
          </div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 flex items-center gap-4">
          <div className="p-3 bg-amber-500/10 text-amber-400 rounded-lg border border-amber-500/20">
            <Stethoscope className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-slate-400 font-medium">Contingencia ESSALUD (&gt;20 Días)</div>
            <div className="text-2xl font-bold text-amber-400">
              {ausentismos.filter(a => a.diasTotales > 20).length} CITT Canje
            </div>
            <div className="text-[10px] text-slate-500">Subsidios EsSalud recuperables</div>
          </div>
        </div>
      </div>

      {/* List Table */}
      <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
        <div className="p-4 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-bold text-sm text-slate-200 flex items-center gap-2">
              <FileCheck2 className="w-4 h-4 text-blue-400" /> Registro de Descansos Médicos y Documentación Digital
            </h3>
            <span className="text-xs text-slate-400">
              Visualiza, gestiona, elimina, sube o descarga el Certificado de Descanso Médico en formato PDF
            </span>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar por trabajador, DNI, CIE-10..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] font-bold tracking-wider border-b border-slate-800">
              <tr>
                <th className="px-4 py-3">Trabajador</th>
                <th className="px-4 py-3">Tipo de Ausencia</th>
                <th className="px-4 py-3">Diagnóstico CIE-10</th>
                <th className="px-4 py-3">Período / Días</th>
                <th className="px-4 py-3">Centro Emisor / CMP</th>
                <th className="px-4 py-3 text-center">Certificado PDF (Adjunto)</th>
                <th className="px-4 py-3 text-right">Estatus ESSALUD / Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filteredAusentismos.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-slate-400">
                    No se encontraron registros de ausentismo o descansos médicos con los criterios ingresados.
                  </td>
                </tr>
              ) : (
                filteredAusentismos.map((aus) => {
                  const trab = getTrabajador(aus.trabajadorId);
                  const hasPdf = !!aus.certificadoPdf;

                  return (
                    <tr key={aus.id} className="hover:bg-slate-800/50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="font-bold text-white text-sm">{getTrabajadorNombre(aus.trabajadorId)}</div>
                        <div className="text-[10px] text-slate-400">{trab?.puestoTrabajo || 'Operativo'}</div>
                      </td>

                      <td className="px-4 py-3">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-200 border border-slate-700">
                          {aus.tipoAusencia.replace('_', ' ')}
                        </span>
                      </td>

                      <td className="px-4 py-3">
                        <div className="font-mono font-bold text-emerald-400">{aus.codigoCIE10}</div>
                        <div className="text-[10px] text-slate-400 max-w-xs truncate">{aus.descripcionCIE10}</div>
                      </td>

                      <td className="px-4 py-3">
                        <div className="font-medium text-slate-200">{aus.fechaInicio} al {aus.fechaFin}</div>
                        <div className="text-amber-400 font-bold">{aus.diasTotales} Días Inhábiles</div>
                      </td>

                      <td className="px-4 py-3">
                        <div className="text-slate-200">{aus.centroMedicoEmisor}</div>
                        <div className="text-[10px] text-slate-400">{aus.medicoTratante} ({aus.cmpMedicoTratante})</div>
                      </td>

                      {/* Column: Certificado PDF Upload / Download */}
                      <td className="px-4 py-3 text-center">
                        {hasPdf ? (
                          <div className="flex flex-col items-center gap-1.5">
                            <span className="px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 rounded-md text-[10px] font-bold flex items-center gap-1.5">
                              <FileText className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                              <span className="truncate max-w-[130px]" title={aus.certificadoPdf?.nombreArchivo}>
                                {aus.certificadoPdf?.nombreArchivo}
                              </span>
                              <span className="text-[9px] text-emerald-400/70">({formatFileSize(aus.certificadoPdf?.tamanioBytes)})</span>
                            </span>

                            <div className="flex items-center justify-center gap-1">
                              <button
                                onClick={() => setPreviewPdfModal({ open: true, ausentismo: aus, pdfData: aus.certificadoPdf })}
                                className="px-2 py-0.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded text-[10px] font-medium flex items-center gap-1 border border-slate-700 transition-all"
                                title="Previsualizar PDF"
                              >
                                <Eye className="w-3 h-3 text-blue-400" /> Ver PDF
                              </button>

                              <button
                                onClick={() => handleDownloadPdf(aus)}
                                className="px-2 py-0.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-[10px] font-bold flex items-center gap-1 shadow-sm transition-all"
                                title="Descargar PDF"
                              >
                                <Download className="w-3 h-3" /> Descargar
                              </button>

                              <button
                                onClick={() => setUploadPdfModal({ open: true, ausentismo: aus })}
                                className="px-1.5 py-0.5 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded text-[10px] border border-slate-700"
                                title="Cambiar PDF"
                              >
                                <Upload className="w-3 h-3 text-slate-400" />
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center gap-1">
                            <span className="px-2 py-0.5 bg-slate-800 text-slate-400 border border-slate-700 rounded text-[10px]">
                              Sin PDF Adjunto
                            </span>
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => setUploadPdfModal({ open: true, ausentismo: aus })}
                                className="px-2 py-1 bg-blue-600/20 hover:bg-blue-600 text-blue-300 hover:text-white border border-blue-500/40 rounded text-[10px] font-semibold flex items-center gap-1 transition-all"
                              >
                                <Upload className="w-3 h-3" /> Subir PDF
                              </button>

                              <button
                                onClick={() => handleDownloadPdf(aus)}
                                className="px-2 py-1 bg-indigo-600/20 hover:bg-indigo-600 text-indigo-300 hover:text-white border border-indigo-500/40 rounded text-[10px] font-semibold flex items-center gap-1 transition-all"
                                title="Generar y Descargar PDF Oficial MINSA"
                              >
                                <Sparkles className="w-3 h-3 text-amber-400" /> Generar PDF
                              </button>
                            </div>
                          </div>
                        )}
                      </td>

                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {aus.diasTotales > 20 ? (
                            <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px] font-bold border border-amber-500/30">
                              CITT Canje (&gt;20d)
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/30">
                              Empleador (d1-20)
                            </span>
                          )}

                          <button
                            onClick={() => setDeletingAusentismo(aus)}
                            className="p-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 hover:text-rose-300 rounded-lg border border-rose-500/20 transition-colors"
                            title="Eliminar este registro de descanso médico"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL 1: Create Ausentismo + Upload PDF */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-hidden">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl text-slate-100 overflow-hidden">
            <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-800 shrink-0">
              <h3 className="text-lg font-bold font-display text-white flex items-center gap-2">
                <Clock className="w-5 h-5 text-blue-400" /> Registrar Descanso Médico Ocupacional
              </h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800">✕</button>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden min-h-0">
              <div className="p-4 sm:p-5 overflow-y-auto space-y-4 text-xs flex-1">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Trabajador Afectado:*</label>
                  <select
                    value={formData.trabajadorId}
                    onChange={(e) => setFormData({ ...formData, trabajadorId: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white font-semibold focus:outline-none focus:border-blue-500"
                  >
                    {trabajadores.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.apellidoPaterno} {t.nombres} ({t.numeroDocumento}) - {t.puestoTrabajo}
                      </option>
                    ))}
                  </select>
                </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Tipo de Ausencia</label>
                  <select
                    value={formData.tipoAusencia}
                    onChange={(e) => setFormData({ ...formData, tipoAusencia: e.target.value as any })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="ENFERMEDAD_COMUN">ENFERMEDAD COMÚN</option>
                    <option value="ACCIDENTE_TRABAJO">ACCIDENTE DE TRABAJO</option>
                    <option value="ENFERMEDAD_OCUPACIONAL">ENFERMEDAD OCUPACIONAL</option>
                    <option value="MATERNIDAD_PATERNIDAD">MATERNIDAD / PATERNIDAD</option>
                    <option value="LICENCIA_MEDICA">LICENCIA MÉRICA ESPECIAL</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Código CIE-10 Estado</label>
                  <input
                    type="text"
                    readOnly={!isManualCIE10}
                    value={formData.codigoCIE10 || ''}
                    onChange={(e) => setFormData({ ...formData, codigoCIE10: e.target.value.toUpperCase() })}
                    placeholder="Código (ej. J18.9)"
                    className={`w-full bg-slate-950 border text-emerald-400 font-mono font-bold rounded-lg p-2.5 text-xs ${
                      isManualCIE10 
                        ? 'border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500' 
                        : 'border-slate-800 cursor-not-allowed'
                    }`}
                  />
                </div>
              </div>

              {/* CIE-10 SELECTION & MANUAL ENTRY DUAL CONTAINER */}
              <div className="space-y-3 p-3.5 bg-slate-950/70 rounded-xl border border-slate-800">
                <div className="flex items-center justify-between gap-2">
                  <label className="block text-slate-200 font-bold text-xs flex items-center gap-1.5">
                    <Stethoscope className="w-4 h-4 text-emerald-400" /> Diagnóstico y Código CIE-10
                  </label>
                  <div className="flex items-center gap-1 bg-slate-900 p-0.5 rounded-lg border border-slate-800 text-[10px]">
                    <button
                      type="button"
                      onClick={() => setIsManualCIE10(false)}
                      className={`px-2.5 py-1 rounded-md font-bold transition-all flex items-center gap-1 ${
                        !isManualCIE10
                          ? 'bg-blue-600 text-white shadow'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      <Search className="w-3 h-3" /> Catálogo MINSA
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsManualCIE10(true)}
                      className={`px-2.5 py-1 rounded-md font-bold transition-all flex items-center gap-1 ${
                        isManualCIE10
                          ? 'bg-emerald-600 text-white shadow'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      <Edit3 className="w-3 h-3" /> Ingreso Manual Libre
                    </button>
                  </div>
                </div>

                {!isManualCIE10 ? (
                  <div className="space-y-2">
                    <CIE10SearchInput
                      value={formData.codigoCIE10 ? `${formData.codigoCIE10} - ${formData.descripcionCIE10 || ''}` : ''}
                      onChange={(codigo, descripcion) => {
                        setFormData({
                          ...formData,
                          codigoCIE10: codigo,
                          descripcionCIE10: descripcion
                        });
                      }}
                      placeholder="Escriba código o diagnóstico (ej: Lumbalgia, M54.5, Silicosis, Ruido)..."
                    />
                    {formData.codigoCIE10 && (
                      <div className="flex items-center gap-2 text-[11px] bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800">
                        <span className="text-slate-400">Seleccionado:</span>
                        <span className="font-mono font-bold text-emerald-400">{formData.codigoCIE10}</span>
                        <span className="text-slate-200 truncate">{formData.descripcionCIE10}</span>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-slate-400 text-[10px] font-semibold mb-1">
                        Código CIE-10 (Manual)
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.codigoCIE10 || ''}
                        onChange={(e) => setFormData({ ...formData, codigoCIE10: e.target.value.toUpperCase() })}
                        placeholder="Ej: J18.9, A09, K29.7, S60.2"
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 font-mono font-bold text-emerald-400 text-xs focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-slate-400 text-[10px] font-semibold mb-1">
                        Descripción / Diagnóstico Médico Detallado (Manual)
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.descripcionCIE10 || ''}
                        onChange={(e) => setFormData({ ...formData, descripcionCIE10: e.target.value })}
                        placeholder="Ej: Neumonía lobar bacteriana no especificada"
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white text-xs focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Fecha Inicio</label>
                  <input
                    type="date"
                    required
                    value={formData.fechaInicio}
                    onChange={(e) => setFormData({ ...formData, fechaInicio: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Fecha Fin</label>
                  <input
                    type="date"
                    required
                    value={formData.fechaFin}
                    onChange={(e) => setFormData({ ...formData, fechaFin: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Días Totales</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={formData.diasTotales}
                    onChange={(e) => setFormData({ ...formData, diasTotales: Number(e.target.value) })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white focus:outline-none focus:border-blue-500 font-bold text-amber-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Centro Médico Emisor</label>
                  <input
                    type="text"
                    required
                    value={formData.centroMedicoEmisor}
                    onChange={(e) => setFormData({ ...formData, centroMedicoEmisor: e.target.value })}
                    placeholder="Ej: Clínica Internacional"
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Médico Tratante</label>
                  <input
                    type="text"
                    required
                    value={formData.medicoTratante}
                    onChange={(e) => setFormData({ ...formData, medicoTratante: e.target.value })}
                    placeholder="Ej: Dr. Fernando Vega"
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Colegiatura CMP / RNM</label>
                  <input
                    type="text"
                    required
                    value={formData.cmpMedicoTratante}
                    onChange={(e) => setFormData({ ...formData, cmpMedicoTratante: e.target.value })}
                    placeholder="Ej: CMP 38912"
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
                  />
                </div>
              </div>

              {/* SECCIÓN ADJUNTA: Certificado de Descanso Médico en PDF */}
              <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-emerald-400" />
                    Adjuntar Certificado de Descanso Médico (PDF)
                  </label>

                  <button
                    type="button"
                    onClick={handleGenerateSamplePdf}
                    className="text-[11px] px-2.5 py-1 bg-indigo-600/20 hover:bg-indigo-600 text-indigo-300 hover:text-white border border-indigo-500/40 rounded-lg font-medium flex items-center gap-1 transition-all"
                    title="Generar un certificado PDF oficial autocompletado con la información actual"
                  >
                    <Sparkles className="w-3 h-3 text-amber-400" /> Generar PDF de Muestra
                  </button>
                </div>

                {formData.certificadoPdf ? (
                  <div className="p-3 bg-emerald-950/30 border border-emerald-500/30 rounded-lg flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-emerald-500/20 rounded-lg text-emerald-400">
                        <CheckCircle2 className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="font-bold text-slate-200 text-xs">
                          {formData.certificadoPdf.nombreArchivo}
                        </div>
                        <div className="text-[10px] text-emerald-400">
                          PDF Listo • {formatFileSize(formData.certificadoPdf.tamanioBytes)} • Cargado el {formData.certificadoPdf.fechaSubida}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setPreviewPdfModal({ open: true, pdfData: formData.certificadoPdf })}
                        className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-xs font-medium flex items-center gap-1 border border-slate-700"
                      >
                        <Eye className="w-3.5 h-3.5 text-blue-400" /> Previa
                      </button>

                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, certificadoPdf: undefined })}
                        className="p-1 bg-rose-500/20 text-rose-400 hover:bg-rose-500 hover:text-white rounded border border-rose-500/30 transition-all"
                        title="Quitar archivo PDF"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div
                    onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={(e) => {
                      e.preventDefault();
                      setIsDragging(false);
                      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                        handleFileChange(e.dataTransfer.files[0]);
                      }
                    }}
                    className={`border-2 border-dashed rounded-xl p-5 text-center transition-all cursor-pointer ${
                      isDragging
                        ? 'border-blue-500 bg-blue-500/10'
                        : 'border-slate-800 hover:border-slate-700 bg-slate-900/50'
                    }`}
                  >
                    <input
                      type="file"
                      id="pdf-upload-input"
                      accept="application/pdf,.pdf"
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          handleFileChange(e.target.files[0]);
                        }
                      }}
                    />
                    <label htmlFor="pdf-upload-input" className="cursor-pointer flex flex-col items-center gap-2">
                      <FileUp className="w-8 h-8 text-blue-400" />
                      <div>
                        <span className="text-xs font-bold text-blue-400 hover:underline">
                          Haz clic para subir tu Certificado en PDF
                        </span>{' '}
                        <span className="text-xs text-slate-400">o arrastra y suelta aquí el archivo</span>
                      </div>
                      <span className="text-[10px] text-slate-500">
                        Formatos soportados: Documento PDF escaneado o digitalizado (Máx. 10MB)
                      </span>
                    </label>
                  </div>
                )}
              </div>
              </div>

              <div className="p-4 sm:p-5 border-t border-slate-800 flex justify-end gap-3 shrink-0 bg-slate-900/80">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg font-medium hover:bg-slate-700"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-semibold shadow-lg shadow-blue-900/30 flex items-center gap-2"
                >
                  <FileCheck2 className="w-4 h-4" /> Registrar Descanso Médico
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: Attach / Upload PDF to Existing Record */}
      {uploadPdfModal.open && uploadPdfModal.ausentismo && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl text-slate-100">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Upload className="w-5 h-5 text-blue-400" /> Adjuntar / Reemplazar Certificado PDF
              </h3>
              <button
                onClick={() => setUploadPdfModal({ open: false })}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-xs">
                <div className="font-bold text-white">
                  {getTrabajadorNombre(uploadPdfModal.ausentismo.trabajadorId)}
                </div>
                <div className="text-slate-400 mt-0.5">
                  Diagnóstico: <span className="text-emerald-400 font-mono">{uploadPdfModal.ausentismo.codigoCIE10}</span> - {uploadPdfModal.ausentismo.descripcionCIE10}
                </div>
                <div className="text-slate-400 text-[11px] mt-0.5">
                  Período: {uploadPdfModal.ausentismo.fechaInicio} al {uploadPdfModal.ausentismo.fechaFin} ({uploadPdfModal.ausentismo.diasTotales} días)
                </div>
              </div>

              <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-3">
                <label className="block text-xs font-bold text-slate-200">
                  Seleccionar archivo PDF local o autogenerar:
                </label>

                <input
                  type="file"
                  id="modal-pdf-input"
                  accept="application/pdf,.pdf"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      const file = e.target.files[0];
                      const reader = new FileReader();
                      reader.onload = (ev) => {
                        const dataUrl = ev.target?.result as string;
                        if (dataUrl && uploadPdfModal.ausentismo) {
                          handleAttachPdfToExisting(uploadPdfModal.ausentismo, {
                            nombreArchivo: file.name,
                            dataUrl,
                            tamanioBytes: file.size,
                            fechaSubida: new Date().toISOString().split('T')[0]
                          });
                        }
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                />

                <div className="grid grid-cols-1 gap-2">
                  <label
                    htmlFor="modal-pdf-input"
                    className="p-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-all shadow-lg shadow-blue-900/30"
                  >
                    <Upload className="w-4 h-4" /> Seleccionar Archivo PDF desde mi Equipo
                  </label>

                  <button
                    type="button"
                    onClick={() => {
                      if (uploadPdfModal.ausentismo) {
                        const trab = getTrabajador(uploadPdfModal.ausentismo.trabajadorId);
                        const emp = getEmpresa(uploadPdfModal.ausentismo.empresaId);
                        const dataUrl = generarDataUrlDescansoMedicoPDF(uploadPdfModal.ausentismo, trab, emp);

                        handleAttachPdfToExisting(uploadPdfModal.ausentismo, {
                          nombreArchivo: `Certificado_Oficial_${trab?.numeroDocumento || 'Trabajador'}_${uploadPdfModal.ausentismo.codigoCIE10}.pdf`,
                          dataUrl,
                          tamanioBytes: Math.round(dataUrl.length * 0.75),
                          fechaSubida: new Date().toISOString().split('T')[0]
                        });
                      }
                    }}
                    className="p-3 bg-indigo-600/20 hover:bg-indigo-600 text-indigo-300 hover:text-white border border-indigo-500/40 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all"
                  >
                    <Sparkles className="w-4 h-4 text-amber-400" /> Autogenerar Certificado Oficial MINSA en PDF
                  </button>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setUploadPdfModal({ open: false })}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg text-xs font-medium"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: PDF Preview & Download */}
      {previewPdfModal.open && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-4xl h-[90vh] flex flex-col p-5 shadow-2xl text-slate-100">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-emerald-400" />
                <div>
                  <h3 className="text-sm font-bold text-white">
                    {previewPdfModal.pdfData?.nombreArchivo || 'Certificado de Descanso Médico PDF'}
                  </h3>
                  <p className="text-[10px] text-slate-400">
                    Visor Oficial de Certificados Ocupacionales ERP MedOcupa
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    if (previewPdfModal.ausentismo) {
                      handleDownloadPdf(previewPdfModal.ausentismo);
                    } else if (previewPdfModal.pdfData?.dataUrl) {
                      const a = document.createElement('a');
                      a.href = previewPdfModal.pdfData.dataUrl;
                      a.download = previewPdfModal.pdfData.nombreArchivo || 'Certificado.pdf';
                      a.click();
                    }
                  }}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-emerald-900/40"
                >
                  <Download className="w-4 h-4" /> Descargar PDF
                </button>

                <button
                  onClick={() => setPreviewPdfModal({ open: false })}
                  className="p-1.5 bg-slate-800 text-slate-400 hover:text-white rounded-lg border border-slate-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="flex-1 my-3 bg-slate-950 rounded-xl overflow-hidden border border-slate-800 relative flex items-center justify-center">
              {previewPdfModal.pdfData?.dataUrl ? (
                <iframe
                  src={previewPdfModal.pdfData.dataUrl}
                  className="w-full h-full rounded-xl bg-white"
                  title="Visor PDF"
                />
              ) : (
                <div className="text-center p-8 text-slate-400">
                  <AlertCircle className="w-10 h-10 text-amber-400 mx-auto mb-2" />
                  <p className="text-sm">No hay vista previa disponible.</p>
                </div>
              )}
            </div>

            <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <span>Formato PDF Oficial • Válido para Fiscalizaciones SUNAFIL & ESSALUD</span>
              <button
                onClick={() => setPreviewPdfModal({ open: false })}
                className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg"
              >
                Cerrar Visor
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 4: Confirm Deletion of Ausentismo Record */}
      {deletingAusentismo && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-hidden">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl text-slate-100 flex flex-col space-y-4 my-auto">
            <div className="flex items-start justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-rose-500/10 text-rose-400 border border-rose-500/30 rounded-xl">
                  <Trash2 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Eliminar Registro de Ausentismo</h3>
                  <p className="text-xs text-slate-400">Elimina el descanso médico registrado para el trabajador.</p>
                </div>
              </div>
              <button
                onClick={() => setDeletingAusentismo(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
              >
                ✕
              </button>
            </div>

            <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 space-y-1.5 text-xs">
              <div className="font-bold text-white text-sm">
                {getTrabajadorNombre(deletingAusentismo.trabajadorId)}
              </div>
              <div className="flex items-center justify-between pt-1">
                <span className="font-mono text-emerald-400 font-bold">{deletingAusentismo.codigoCIE10}</span>
                <span className="px-2 py-0.5 bg-blue-500/10 text-blue-300 border border-blue-500/20 rounded text-[10px] font-bold">
                  {deletingAusentismo.diasTotales} días inactivos
                </span>
              </div>
              <p className="text-slate-400 text-[11px] truncate">{deletingAusentismo.descripcionCIE10}</p>
              <div className="text-slate-400 text-[11px]">
                Período: <span className="text-slate-200 font-medium">{deletingAusentismo.fechaInicio} al {deletingAusentismo.fechaFin}</span>
              </div>
              {deletingAusentismo.certificadoPdf && (
                <div className="text-emerald-400 text-[10px] flex items-center gap-1 font-medium pt-1 border-t border-slate-800/80">
                  <FileText className="w-3 h-3" /> Certificado PDF adjunto: {deletingAusentismo.certificadoPdf.nombreArchivo}
                </div>
              )}
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              ¿Está seguro de que desea eliminar permanentemente este descanso médico? Todos los datos asociados y el certificado adjunto serán borrados del sistema.
            </p>

            <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setDeletingAusentismo(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-semibold transition-colors"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => {
                  if (onDeleteAusentismo && deletingAusentismo) {
                    onDeleteAusentismo(deletingAusentismo.id);
                  }
                  setDeletingAusentismo(null);
                }}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-bold shadow-lg shadow-rose-900/30 flex items-center gap-1.5 transition-colors"
              >
                <Trash2 className="w-4 h-4" /> Sí, Eliminar Registro
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
