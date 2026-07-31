import React, { useState } from 'react';
import { calculateAge } from '../trabajadores/TrabajadoresModule';
import { 
  HistoriaClinicaOcupacional, 
  Trabajador, 
  Empresa, 
  ArchivoProtocolo, 
  ControlSeguimientoMedico, 
  ExamenLaboratorioControl 
} from '../../types/erp';
import {
  FileSpreadsheet,
  User,
  Shield,
  Stethoscope,
  Heart,
  Activity,
  AlertCircle,
  Save,
  Lock,
  ArrowLeft,
  Plus,
  CheckCircle2,
  Upload,
  Download,
  Eye,
  Trash2,
  FileText,
  FileUp,
  Sparkles,
  X,
  Edit3,
  Thermometer,
  Wind,
  Search,
  Building2,
  Clock,
  ChevronRight,
  PlusCircle,
  FlaskConical,
  Calendar,
  UserPlus,
  Filter,
  LayoutGrid,
  List,
  FolderOpen
} from 'lucide-react';
import { CIE10SearchInput } from '../common/CIE10SearchInput';
import { jsPDF } from 'jspdf';

interface HistoriaClinicaModuleProps {
  historias: HistoriaClinicaOcupacional[];
  trabajadores: Trabajador[];
  empresas: Empresa[];
  selectedTrabajadorId?: string;
  onCloseDetail?: () => void;
  onUpdateHistoria?: (updated: HistoriaClinicaOcupacional) => void;
}

export const HistoriaClinicaModule: React.FC<HistoriaClinicaModuleProps> = ({
  historias,
  trabajadores,
  empresas,
  selectedTrabajadorId,
  onCloseDetail,
  onUpdateHistoria
}) => {
  const [activeTrabajadorId, setActiveTrabajadorId] = useState<string>(
    selectedTrabajadorId || trabajadores[0]?.id || 'trab-1'
  );

  const [viewMode, setViewMode] = useState<'list' | 'detail'>(
    selectedTrabajadorId ? 'detail' : 'list'
  );

  const [searchQuery, setSearchQuery] = useState('');
  const [empresaFilter, setEmpresaFilter] = useState('TODAS');
  const [statusFilter, setStatusFilter] = useState<'TODOS' | 'CON_DIAGNOSTICO' | 'CON_PDF' | 'CON_SEGUIMIENTO'>('TODOS');
  const [displayFormat, setDisplayFormat] = useState<'table' | 'cards'>('table');

  React.useEffect(() => {
    if (selectedTrabajadorId) {
      setActiveTrabajadorId(selectedTrabajadorId);
      setViewMode('detail');
    }
  }, [selectedTrabajadorId]);

  const handleSelectWorker = (trabId: string) => {
    setActiveTrabajadorId(trabId);
    setViewMode('detail');
  };

  const [isDragging, setIsDragging] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showNewHCOModal, setShowNewHCOModal] = useState(false);
  const [showControlModal, setShowControlModal] = useState(false);
  const [editingControlIndex, setEditingControlIndex] = useState<number | null>(null);

  // Diagnostic state for adding CIE-10
  const [useManualCie, setUseManualCie] = useState(false);
  const [selectedCieCodigo, setSelectedCieCodigo] = useState('');
  const [selectedCieDesc, setSelectedCieDesc] = useState('');
  const [manualCieCodigo, setManualCieCodigo] = useState('');
  const [manualCieDesc, setManualCieDesc] = useState('');
  const [cieTipo, setCieTipo] = useState<'PRESUNTIVO' | 'DEFINITIVO' | 'REPETIDO'>('DEFINITIVO');

  const trabajador = trabajadores.find(t => t.id === activeTrabajadorId) || trabajadores[0];
  const empresa = empresas.find(e => e.id === trabajador?.empresaId);
  
  const existingHco = historias.find(h => h.trabajadorId === trabajador?.id);
  const hco: HistoriaClinicaOcupacional = existingHco || {
    id: `hco-new-${trabajador?.id || '1'}`,
    trabajadorId: trabajador?.id || 'trab-1',
    codigoHCO: `HCO-${trabajador?.numeroDocumento || '00000000'}`,
    fechaApertura: '2026-01-10',
    antecedentesPersonales: {
      patologicas: ['Evaluación previa normal'],
      quirurgicas: ['Sin cirugías previas'],
      alergias: ['Niega alergias medicamentosas'],
      habitosNocivos: 'Niega consumo de tabaco'
    },
    antecedentesOcupacionales: [
      {
        empresaAnterior: 'Empresa Servicios Industriales S.A.C.',
        puesto: 'Técnico Mantenimiento',
        tiempoAnos: 3,
        riesgosExpuestos: ['Ruido industrial', 'Polvo ambiental'],
        eppUtilizado: 'EPP básico completo'
      }
    ],
    constantesVitalesMasRecientes: {
      pa: '120/80 mmHg',
      fc: 74,
      fr: 16,
      temperatura: 36.5,
      imc: 24.2,
      saturacionO2: 98
    },
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
          { id: 'lab-1', nombreExamen: 'Hemograma Completo', resultado: 'Hb 15.2 g/dL - Leucocitos 7,200/mm3', valoresReferencia: 'Hb 13-17 g/dL', observacion: 'Valores normales' },
          { id: 'lab-2', nombreExamen: 'Glucosa Basal', resultado: '92 mg/dL', valoresReferencia: '70 - 100 mg/dL', observacion: 'Normal' }
        ],
        observacionControl: 'Evolución favorable de presión arterial. Continuar con dieta e higiene ocupacional.'
      }
    ],
    diagnosticosCIE10: [
      { id: 'diag-1', codigo: 'M54.5', descripcion: 'Lumbalgia no especificada / Dolor lumbar disergonómico', tipo: 'DEFINITIVO', fecha: '2026-02-15' }
    ],
    observacionesMedicas: 'Paciente en condiciones clínicas óptimas para sus labores habituales.'
  };

  // State for editing form modal
  const [editForm, setEditForm] = useState<HistoriaClinicaOcupacional>(hco);

  // State for creating a new HCO modal
  const [newHCOForm, setNewHCOForm] = useState({
    trabajadorId: trabajadores[0]?.id || '',
    codigoHCO: '',
    fechaApertura: new Date().toISOString().split('T')[0],
    pa: '120/80 mmHg',
    fc: 72,
    fr: 16,
    temperatura: 36.5,
    saturacionO2: 98,
    imc: 24.2,
    patologicas: 'Niega patologías de importancia',
    quirurgicas: 'Niega antecedentes quirúrgicos',
    alergias: 'Niega alergias medicamentosas',
    habitosNocivos: 'Niega consumo de tabaco',
    empresaAnterior: 'Empresa Contratista S.A.C.',
    puestoAnterior: 'Técnico Operativo',
    tiempoAnos: 2,
    riesgosExpuestos: 'Ruido industrial, Polvo',
    eppUtilizado: 'EPP básico completo',
    observacionesMedicas: 'Evaluación de apertura de historia clínica ocupacional. Trabajador en condiciones aptas.'
  });

  // State for adding/editing follow-up control modal
  const [controlForm, setControlForm] = useState<ControlSeguimientoMedico>({
    id: '',
    fecha: new Date().toISOString().split('T')[0],
    motivoControl: 'Control Periódico y Seguimiento de Signos Vitales',
    medicoAtendio: 'Dr. Alejandro Morales (CMP 45892)',
    signosVitales: {
      pa: '120/80 mmHg',
      fc: 72,
      fr: 16,
      saturacionO2: 98,
      temperatura: 36.5
    },
    examenesLaboratorio: [
      { id: 'lab-init-1', nombreExamen: 'Hemograma Completo', resultado: 'Hb 15.0 g/dL', valoresReferencia: '13.0 - 17.5 g/dL', observacion: 'Sin alteración' }
    ],
    observacionControl: 'Paciente en monitoreo con signos vitales dentro de rangos normales.'
  });

  const handleOpenEditModal = () => {
    setEditForm(JSON.parse(JSON.stringify(hco)));
    setShowEditModal(true);
  };

  const handleSaveEditModal = () => {
    if (onUpdateHistoria) {
      onUpdateHistoria(editForm);
    }
    setShowEditModal(false);
    alert('Historia Clínica Ocupacional actualizada exitosamente.');
  };

  const handleAddAntecedenteOcupacionalInEdit = () => {
    const current = editForm.antecedentesOcupacionales || [];
    setEditForm({
      ...editForm,
      antecedentesOcupacionales: [
        ...current,
        {
          empresaAnterior: 'Nueva Empresa S.A.C.',
          puesto: 'Técnico Operativo',
          tiempoAnos: 1,
          riesgosExpuestos: ['Ruido', 'Ergocargas'],
          eppUtilizado: 'EPP básico completo'
        }
      ]
    });
  };

  const handleRemoveAntecedenteOcupacionalInEdit = (index: number) => {
    const current = editForm.antecedentesOcupacionales || [];
    setEditForm({
      ...editForm,
      antecedentesOcupacionales: current.filter((_, idx) => idx !== index)
    });
  };

  // Handlers for New Historia Clínica Modal
  const handleOpenNewHCOModal = () => {
    const selectedTrab = trabajadores.find(t => t.id === activeTrabajadorId) || trabajadores[0];
    setNewHCOForm({
      trabajadorId: selectedTrab?.id || trabajadores[0]?.id || '',
      codigoHCO: `HCO-${selectedTrab?.numeroDocumento || Date.now().toString().slice(-6)}`,
      fechaApertura: new Date().toISOString().split('T')[0],
      pa: '120/80 mmHg',
      fc: 72,
      fr: 16,
      temperatura: 36.5,
      saturacionO2: 98,
      imc: 24.2,
      patologicas: 'Niega patologías de importancia',
      quirurgicas: 'Niega antecedentes quirúrgicos',
      alergias: 'Niega alergias medicamentosas',
      habitosNocivos: 'Niega consumo de tabaco',
      empresaAnterior: 'Empresa Contratista S.A.C.',
      puestoAnterior: 'Técnico Operativo',
      tiempoAnos: 2,
      riesgosExpuestos: 'Ruido industrial, Polvo',
      eppUtilizado: 'EPP básico completo',
      observacionesMedicas: 'Evaluación de apertura de historia clínica ocupacional. Trabajador en condiciones aptas.'
    });
    setShowNewHCOModal(true);
  };

  const handleCreateNewHCO = () => {
    const targetTrab = trabajadores.find(t => t.id === newHCOForm.trabajadorId);
    if (!targetTrab) {
      alert('Por favor, seleccione un trabajador.');
      return;
    }

    const newHCO: HistoriaClinicaOcupacional = {
      id: `hco-${Date.now()}`,
      trabajadorId: targetTrab.id,
      codigoHCO: newHCOForm.codigoHCO || `HCO-${targetTrab.numeroDocumento}`,
      fechaApertura: newHCOForm.fechaApertura || new Date().toISOString().split('T')[0],
      antecedentesPersonales: {
        patologicas: newHCOForm.patologicas.split(',').map(s => s.trim()).filter(Boolean),
        quirurgicas: newHCOForm.quirurgicas.split(',').map(s => s.trim()).filter(Boolean),
        alergias: newHCOForm.alergias.split(',').map(s => s.trim()).filter(Boolean),
        habitosNocivos: newHCOForm.habitosNocivos
      },
      antecedentesOcupacionales: newHCOForm.empresaAnterior ? [
        {
          empresaAnterior: newHCOForm.empresaAnterior,
          puesto: newHCOForm.puestoAnterior,
          tiempoAnos: Number(newHCOForm.tiempoAnos) || 1,
          riesgosExpuestos: newHCOForm.riesgosExpuestos.split(',').map(s => s.trim()).filter(Boolean),
          eppUtilizado: newHCOForm.eppUtilizado
        }
      ] : [],
      constantesVitalesMasRecientes: {
        pa: newHCOForm.pa,
        fc: Number(newHCOForm.fc) || 72,
        fr: Number(newHCOForm.fr) || 16,
        temperatura: Number(newHCOForm.temperatura) || 36.5,
        imc: Number(newHCOForm.imc) || 24.2,
        saturacionO2: Number(newHCOForm.saturacionO2) || 98
      },
      controlesPosteriores: [],
      diagnosticosCIE10: [],
      observacionesMedicas: newHCOForm.observacionesMedicas
    };

    if (onUpdateHistoria) {
      onUpdateHistoria(newHCO);
    }

    setActiveTrabajadorId(targetTrab.id);
    setViewMode('detail');
    setShowNewHCOModal(false);
    alert(`Historia Clínica Ocupacional ${newHCO.codigoHCO} creada para ${targetTrab.nombres} ${targetTrab.apellidoPaterno}.`);
  };

  // Handlers for Follow-up Controls Modal
  const handleOpenAddControlModal = () => {
    const currentList = hco.controlesPosteriores || [];
    const nextNum = currentList.length + 1;
    setEditingControlIndex(null);
    setControlForm({
      id: `ctrl-${Date.now()}`,
      fecha: new Date().toISOString().split('T')[0],
      motivoControl: `Control ${nextNum}`,
      medicoAtendio: 'Dr. Alejandro Morales (CMP 45892)',
      signosVitales: {
        pa: hco.constantesVitalesMasRecientes?.pa || '120/80 mmHg',
        fc: hco.constantesVitalesMasRecientes?.fc || 72,
        fr: hco.constantesVitalesMasRecientes?.fr || 16,
        saturacionO2: hco.constantesVitalesMasRecientes?.saturacionO2 || 98,
        temperatura: hco.constantesVitalesMasRecientes?.temperatura || 36.5
      },
      examenesLaboratorio: [],
      observacionControl: ''
    });
    setShowControlModal(true);
  };

  const handleOpenEditControlModal = (ctrl: ControlSeguimientoMedico, index: number) => {
    setEditingControlIndex(index);
    setControlForm(JSON.parse(JSON.stringify(ctrl)));
    setShowControlModal(true);
  };

  const handleSaveControl = () => {
    const currentControls = [...(hco.controlesPosteriores || [])];
    if (editingControlIndex !== null && editingControlIndex >= 0) {
      currentControls[editingControlIndex] = controlForm;
    } else {
      currentControls.push(controlForm);
    }

    const updatedHCO: HistoriaClinicaOcupacional = {
      ...hco,
      controlesPosteriores: currentControls,
      constantesVitalesMasRecientes: {
        pa: controlForm.signosVitales.pa,
        fc: Number(controlForm.signosVitales.fc) || 72,
        fr: Number(controlForm.signosVitales.fr) || 16,
        temperatura: Number(controlForm.signosVitales.temperatura) || 36.5,
        imc: hco.constantesVitalesMasRecientes?.imc || 24.2,
        saturacionO2: Number(controlForm.signosVitales.saturacionO2) || 98
      }
    };

    if (onUpdateHistoria) {
      onUpdateHistoria(updatedHCO);
    }

    setShowControlModal(false);
  };

  const handleDeleteControl = (index: number) => {
    const controlNum = index + 1;
    if (confirm(`¿Está seguro de eliminar el Control ${controlNum}?`)) {
      const currentControls = [...(hco.controlesPosteriores || [])];
      currentControls.splice(index, 1);

      const updatedHCO: HistoriaClinicaOcupacional = {
        ...hco,
        controlesPosteriores: currentControls
      };

      if (onUpdateHistoria) {
        onUpdateHistoria(updatedHCO);
      }
    }
  };

  const handleAddLabExamToControl = () => {
    const labs = controlForm.examenesLaboratorio || [];
    setControlForm({
      ...controlForm,
      examenesLaboratorio: [
        ...labs,
        {
          id: `lab-${Date.now()}`,
          nombreExamen: 'Nuevo Examen de Laboratorio',
          resultado: 'Normal',
          valoresReferencia: 'Rango de referencia',
          observacion: 'Sin observaciones'
        }
      ]
    });
  };

  const handleRemoveLabExamFromControl = (idToRemove: string) => {
    const labs = controlForm.examenesLaboratorio || [];
    setControlForm({
      ...controlForm,
      examenesLaboratorio: labs.filter(l => l.id !== idToRemove)
    });
  };

  // Process uploaded PDF file
  const handlePdfUpload = (file: File) => {
    const filename = file.name.toLowerCase();
    if (!file.type.includes('pdf') && !filename.endsWith('.pdf')) {
      alert('Por favor, seleccione un archivo de formato PDF (.pdf).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      if (dataUrl && onUpdateHistoria) {
        const updated: HistoriaClinicaOcupacional = {
          ...hco,
          archivoPdf: {
            nombreArchivo: file.name,
            tipoArchivo: 'PDF',
            dataUrl,
            tamanioBytes: file.size,
            fechaSubida: new Date().toISOString().split('T')[0]
          }
        };
        onUpdateHistoria(updated);
      }
    };
    reader.readAsDataURL(file);
  };

  // Autogenerate sample official HC PDF using jsPDF
  const handleGenerateOfficialPdf = (): ArchivoProtocolo => {
    const doc = new jsPDF({ orientation: 'p', unit: 'mm', format: 'a4' });

    // Header block
    doc.setFillColor(15, 23, 42); // slate-900
    doc.rect(10, 10, 190, 22, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text('HISTORIA CLINICA OCUPACIONAL (HCO)', 105, 18, { align: 'center' });
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.text('DOCUMENTO CONFIDENCIAL - R.M. 312-2011-MINSA / LEY N° 29733 CUSTODIA 40 AÑOS', 105, 25, { align: 'center' });

    let y = 38;

    // 1. Datos del trabajador
    doc.setFillColor(241, 245, 249);
    doc.rect(10, y, 190, 6, 'F');
    doc.setTextColor(15, 23, 42);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.text('1. DATOS DEL TRABAJADOR Y EXPEDIENTE MEDICO', 12, y + 4.2);
    y += 10;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.text(`Código HCO: ${hco.codigoHCO}`, 12, y);
    doc.text(`Fecha Apertura: ${hco.fechaApertura}`, 110, y);
    y += 5;
    doc.text(`Trabajador: ${trabajador?.nombres} ${trabajador?.apellidoPaterno} ${trabajador?.apellidoMaterno}`, 12, y);
    doc.text(`Documento: ${trabajador?.tipoDocumento} ${trabajador?.numeroDocumento}`, 110, y);
    y += 5;
    doc.text(`Empresa: ${empresa?.razonSocial || 'N/A'} (RUC: ${empresa?.ruc || 'N/A'})`, 12, y);
    doc.text(`Puesto: ${trabajador?.puestoTrabajo}`, 110, y);
    y += 5;
    doc.text(`Fecha Nacimiento: ${trabajador?.fechaNacimiento}`, 12, y);
    doc.text(`Área: ${trabajador?.area}`, 110, y);
    y += 8;

    // 2. Vital signs
    if (hco.constantesVitalesMasRecientes) {
      doc.setFillColor(241, 245, 249);
      doc.rect(10, y, 190, 6, 'F');
      doc.setFont('helvetica', 'bold');
      doc.text('2. CONSTANTES VITALES Y SOMATOMETRIA RECIENTE', 12, y + 4.2);
      y += 10;

      doc.setFont('helvetica', 'normal');
      doc.text(`Presión Arterial: ${hco.constantesVitalesMasRecientes.pa}`, 12, y);
      doc.text(`Frecuencia Cardíaca: ${hco.constantesVitalesMasRecientes.fc} LPM`, 70, y);
      doc.text(`Frecuencia Resp. (FR): ${hco.constantesVitalesMasRecientes.fr || 16} RPM`, 130, y);
      y += 5;
      doc.text(`Temperatura: ${hco.constantesVitalesMasRecientes.temperatura || 36.5} °C`, 12, y);
      doc.text(`IMC: ${hco.constantesVitalesMasRecientes.imc} kg/m²`, 70, y);
      doc.text(`Saturación O2: ${hco.constantesVitalesMasRecientes.saturacionO2}%`, 130, y);
      y += 8;
    }

    // 3. Antecedentes Personales
    doc.setFillColor(241, 245, 249);
    doc.rect(10, y, 190, 6, 'F');
    doc.setFont('helvetica', 'bold');
    doc.text('3. ANTECEDENTES PERSONALES Y PATOLOGICOS', 12, y + 4.2);
    y += 10;

    doc.setFont('helvetica', 'normal');
    doc.text(`Patológicos: ${hco.antecedentesPersonales?.patologicas?.join(', ') || 'Sin patologías'}`, 12, y);
    y += 5;
    doc.text(`Quirúrgicos: ${hco.antecedentesPersonales?.quirurgicas?.join(', ') || 'Sin cirugías'}`, 12, y);
    y += 5;
    doc.text(`Alergias: ${hco.antecedentesPersonales?.alergias?.join(', ') || 'Sin alergias conocidas'}`, 12, y);
    y += 5;
    doc.text(`Hábitos Nocivos: ${hco.antecedentesPersonales?.habitosNocivos || 'Sin hábitos nocivos'}`, 12, y);
    y += 8;

    // 4. Antecedentes Ocupacionales
    doc.setFillColor(241, 245, 249);
    doc.rect(10, y, 190, 6, 'F');
    doc.setFont('helvetica', 'bold');
    doc.text('4. ANTECEDENTES OCUPACIONALES', 12, y + 4.2);
    y += 10;

    if (hco.antecedentesOcupacionales && hco.antecedentesOcupacionales.length > 0) {
      hco.antecedentesOcupacionales.forEach((ant, idx) => {
        doc.setFont('helvetica', 'bold');
        doc.text(`${idx + 1}. Empresa: ${ant.empresaAnterior} - Puesto: ${ant.puesto} (${ant.tiempoAnos} años)`, 12, y);
        y += 5;
        doc.setFont('helvetica', 'normal');
        doc.text(`   Riesgos: ${ant.riesgosExpuestos?.join(', ')} | EPP: ${ant.eppUtilizado}`, 12, y);
        y += 6;
      });
    } else {
      doc.setFont('helvetica', 'normal');
      doc.text('Sin registros de empresas anteriores.', 12, y);
      y += 6;
    }

    // 5. Controles Posteriores
    if (hco.controlesPosteriores && hco.controlesPosteriores.length > 0) {
      if (y > 230) { doc.addPage(); y = 20; }
      doc.setFillColor(241, 245, 249);
      doc.rect(10, y, 190, 6, 'F');
      doc.setFont('helvetica', 'bold');
      doc.text('5. CONTROLES POSTERIORES Y SEGUIMIENTO MEDICO OCUPACIONAL', 12, y + 4.2);
      y += 10;

      hco.controlesPosteriores.forEach((ctrl, idx) => {
        if (y > 240) { doc.addPage(); y = 20; }
        doc.setFont('helvetica', 'bold');
        doc.text(`Control N° ${idx + 1} [${ctrl.fecha}] - ${ctrl.motivoControl || 'Control Periódico'}`, 12, y);
        y += 5;
        doc.setFont('helvetica', 'normal');
        doc.text(`PA: ${ctrl.signosVitales.pa} | FC: ${ctrl.signosVitales.fc} LPM | FR: ${ctrl.signosVitales.fr} RPM | SatO2: ${ctrl.signosVitales.saturacionO2}% | Temp: ${ctrl.signosVitales.temperatura} °C`, 12, y);
        y += 5;
        if (ctrl.examenesLaboratorio && ctrl.examenesLaboratorio.length > 0) {
          doc.text(`Exámenes Lab: ${ctrl.examenesLaboratorio.map(l => `${l.nombreExamen}: ${l.resultado}`).join('; ')}`, 12, y);
          y += 5;
        }
        y += 2;
      });
    }

    // 6. Diagnósticos CIE-10
    if (hco.diagnosticosCIE10 && hco.diagnosticosCIE10.length > 0) {
      if (y > 240) { doc.addPage(); y = 20; }
      doc.setFillColor(241, 245, 249);
      doc.rect(10, y, 190, 6, 'F');
      doc.setFont('helvetica', 'bold');
      doc.text('6. IMPRESIONES DIAGNOSTICAS OCUPACIONALES (CIE-10)', 12, y + 4.2);
      y += 10;

      hco.diagnosticosCIE10.forEach((diag) => {
        doc.setFont('helvetica', 'bold');
        doc.text(`• [${diag.codigo}] ${diag.descripcion}`, 12, y);
        doc.setFont('helvetica', 'normal');
        doc.text(`Tipo: ${diag.tipo} | Fecha: ${diag.fecha || 'N/A'}`, 140, y);
        y += 5;
      });
      y += 3;
    }

    // 7. Observaciones Médicas
    if (hco.observacionesMedicas) {
      if (y > 240) { doc.addPage(); y = 20; }
      doc.setFillColor(241, 245, 249);
      doc.rect(10, y, 190, 6, 'F');
      doc.setFont('helvetica', 'bold');
      doc.text('7. OBSERVACIONES Y EVALUACION MEDICA OCUPACIONAL', 12, y + 4.2);
      y += 10;

      doc.setFont('helvetica', 'normal');
      const lines = doc.splitTextToSize(hco.observacionesMedicas, 180);
      doc.text(lines, 12, y);
      y += lines.length * 5 + 5;
    }

    y += 12;
    if (y > 260) { doc.addPage(); y = 30; }
    doc.setFont('helvetica', 'bold');
    doc.text('Firma y Sello del Médico Ocupacional (CMP / RNM)', 105, y, { align: 'center' });
    doc.setFont('helvetica', 'normal');
    doc.text('Sistema MedOcupa ERP - Registro Inmutable de Historia Clínica', 105, y + 5, { align: 'center' });

    const dataUrl = doc.output('datauristring');
    const archivo: ArchivoProtocolo = {
      nombreArchivo: `Historia_Clinica_${hco.codigoHCO}_${trabajador?.numeroDocumento}.pdf`,
      tipoArchivo: 'PDF',
      dataUrl,
      fechaSubida: new Date().toISOString().split('T')[0]
    };

    if (onUpdateHistoria) {
      onUpdateHistoria({
        ...hco,
        archivoPdf: archivo
      });
    }

    return archivo;
  };

  const handleDownloadPdf = () => {
    if (hco.archivoPdf?.dataUrl) {
      const a = document.createElement('a');
      a.href = hco.archivoPdf.dataUrl;
      a.download = hco.archivoPdf.nombreArchivo || `Historia_Clinica_${hco.codigoHCO}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } else {
      const genFile = handleGenerateOfficialPdf();
      const a = document.createElement('a');
      a.href = genFile.dataUrl;
      a.download = genFile.nombreArchivo;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  const handleRemovePdf = () => {
    if (confirm('¿Está seguro de eliminar el archivo PDF adjunto de esta Historia Clínica?')) {
      if (onUpdateHistoria) {
        onUpdateHistoria({
          ...hco,
          archivoPdf: undefined
        });
      }
    }
  };

  // Add CIE-10 Diagnosis to HCO
  const handleAddDiagnosis = () => {
    let codigo = '';
    let descripcion = '';

    if (useManualCie) {
      codigo = manualCieCodigo.trim().toUpperCase();
      descripcion = manualCieDesc.trim();
    } else {
      codigo = selectedCieCodigo.trim().toUpperCase();
      descripcion = selectedCieDesc.trim();
    }

    if (!codigo) {
      alert('Por favor, ingrese o seleccione un código CIE-10.');
      return;
    }
    if (!descripcion) {
      alert('Por favor, ingrese o seleccione la descripción del diagnóstico.');
      return;
    }

    const currentDiagnosticos = hco.diagnosticosCIE10 || [];
    const newDiag = {
      id: `diag-${Date.now()}`,
      codigo,
      descripcion,
      tipo: cieTipo,
      fecha: new Date().toISOString().split('T')[0]
    };

    const updatedHCO: HistoriaClinicaOcupacional = {
      ...hco,
      diagnosticosCIE10: [newDiag, ...currentDiagnosticos]
    };

    if (onUpdateHistoria) {
      onUpdateHistoria(updatedHCO);
    }

    // Reset inputs
    setSelectedCieCodigo('');
    setSelectedCieDesc('');
    setManualCieCodigo('');
    setManualCieDesc('');
  };

  // Remove diagnosis
  const handleRemoveDiagnosis = (idToRemove?: string, idxToRemove?: number) => {
    const currentDiagnosticos = hco.diagnosticosCIE10 || [];
    const updatedDiags = currentDiagnosticos.filter((d, idx) => {
      if (idToRemove && d.id) return d.id !== idToRemove;
      return idx !== idxToRemove;
    });

    if (onUpdateHistoria) {
      onUpdateHistoria({
        ...hco,
        diagnosticosCIE10: updatedDiags
      });
    }
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return 'Archivo PDF';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const allHistoriasData = trabajadores.map(t => {
    const emp = empresas.find(e => e.id === t.empresaId);
    const existing = historias.find(h => h.trabajadorId === t.id);
    const h: HistoriaClinicaOcupacional = existing || {
      id: `hco-preview-${t.id}`,
      trabajadorId: t.id,
      codigoHCO: `HCO-${t.numeroDocumento}`,
      fechaApertura: '2026-01-10',
      antecedentesPersonales: {
        patologicas: ['Evaluación previa normal'],
        quirurgicas: ['Sin cirugías previas'],
        alergias: ['Niega alergias medicamentosas'],
        habitosNocivos: 'Niega consumo de tabaco'
      },
      antecedentesOcupacionales: [
        {
          empresaAnterior: 'Empresa Anterior S.A.C.',
          puesto: t.puestoTrabajo || 'Operario',
          tiempoAnos: 3,
          riesgosExpuestos: ['Ruido', 'Ergonomía'],
          eppUtilizado: 'Tapones auditivos, botas dieléctricas'
        }
      ],
      constantesVitalesMasRecientes: {
        pa: '120/80 mmHg',
        fc: 74,
        fr: 16,
        temperatura: 36.5,
        imc: 24.2,
        saturacionO2: 98
      },
      controlesPosteriores: [],
      diagnosticosCIE10: [],
      observacionesMedicas: 'Evaluación de apertura de historia clínica ocupacional.'
    };

    return {
      trabajador: t,
      empresa: emp,
      hco: h
    };
  });

  const filteredHistoriasList = allHistoriasData.filter(item => {
    const { trabajador: t, empresa: emp, hco: h } = item;

    if (empresaFilter !== 'TODAS' && t.empresaId !== empresaFilter) {
      return false;
    }

    if (statusFilter === 'CON_DIAGNOSTICO') {
      if (!h.diagnosticosCIE10 || h.diagnosticosCIE10.length === 0) return false;
    } else if (statusFilter === 'CON_PDF') {
      if (!h.archivoPdf) return false;
    } else if (statusFilter === 'CON_SEGUIMIENTO') {
      if (!h.controlesPosteriores || h.controlesPosteriores.length === 0) return false;
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const fullName = `${t.nombres} ${t.apellidoPaterno} ${t.apellidoMaterno}`.toLowerCase();
      const dni = t.numeroDocumento.toLowerCase();
      const codigoHCO = (h.codigoHCO || '').toLowerCase();
      const puesto = (t.puestoTrabajo || '').toLowerCase();
      const area = (t.area || '').toLowerCase();
      const empName = (emp?.nombreComercial || emp?.razonSocial || '').toLowerCase();
      const diags = (h.diagnosticosCIE10 || []).map(d => `${d.codigo} ${d.descripcion}`).join(' ').toLowerCase();

      const matchesSearch = fullName.includes(q) || 
        dni.includes(q) || 
        codigoHCO.includes(q) || 
        puesto.includes(q) || 
        area.includes(q) ||
        empName.includes(q) || 
        diags.includes(q);

      if (!matchesSearch) return false;
    }

    return true;
  });

  const metricsTotal = allHistoriasData.length;
  const metricsConDiag = allHistoriasData.filter(i => i.hco.diagnosticosCIE10 && i.hco.diagnosticosCIE10.length > 0).length;
  const metricsConSeguimiento = allHistoriasData.filter(i => i.hco.controlesPosteriores && i.hco.controlesPosteriores.length > 0).length;
  const metricsConPdf = allHistoriasData.filter(i => Boolean(i.hco.archivoPdf)).length;

  return (
    <div className="space-y-6">
      {viewMode === 'list' ? (
        /* ==================== VISTA DIRECTORIO GENERAL (TODAS LAS HISTORIAS CLINICAS) ==================== */
        <div className="space-y-6">
          {/* Header */}
          <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold uppercase rounded">
                  Directorio General Ley N° 29733 & R.M. 312-2011
                </span>
                <span className="text-xs text-slate-400">Custodia Médica Ocupacional (40 Años)</span>
              </div>
              <h2 className="text-xl font-bold text-white font-display flex items-center gap-2">
                <FileSpreadsheet className="w-6 h-6 text-emerald-400" /> Historias Clínicas Ocupacionales (HCO)
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Revise la lista de historias clínicas de los trabajadores y haga clic en cualquiera para examinar su expediente en detalle.
              </p>
            </div>

            <button
              onClick={handleOpenNewHCOModal}
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg shadow-emerald-900/40 transition-all shrink-0 self-start md:self-auto"
            >
              <UserPlus className="w-4 h-4" /> + Aperturar Nueva Historia
            </button>
          </div>

          {/* KPI Metrics Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-slate-900/90 p-4 rounded-xl border border-slate-800 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                <FileSpreadsheet className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] text-slate-400 block font-medium">Total Expedientes</span>
                <span className="text-lg font-bold text-white">{metricsTotal} HCOs</span>
              </div>
            </div>

            <div className="bg-slate-900/90 p-4 rounded-xl border border-slate-800 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0">
                <Stethoscope className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] text-slate-400 block font-medium">Con Diagnóstico CIE-10</span>
                <span className="text-lg font-bold text-indigo-300">{metricsConDiag} Pacientes</span>
              </div>
            </div>

            <div className="bg-slate-900/90 p-4 rounded-xl border border-slate-800 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
                <Activity className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] text-slate-400 block font-medium">Con Controles Recientes</span>
                <span className="text-lg font-bold text-amber-300">{metricsConSeguimiento} Registros</span>
              </div>
            </div>

            <div className="bg-slate-900/90 p-4 rounded-xl border border-slate-800 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400 shrink-0">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] text-slate-400 block font-medium">Expedientes en PDF</span>
                <span className="text-lg font-bold text-sky-300">{metricsConPdf} PDF Adjuntos</span>
              </div>
            </div>
          </div>

          {/* Search, Filter and View Toggle Bar */}
          <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
            <div className="flex-1 flex flex-col sm:flex-row items-center gap-3">
              {/* Search Bar */}
              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar por Trabajador, DNI, HCO, CIE-10..."
                  className="w-full bg-slate-800 border border-slate-700/80 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 placeholder-slate-500"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs font-bold"
                  >
                    ×
                  </button>
                )}
              </div>

              {/* Empresa Filter */}
              <div className="w-full sm:w-auto flex items-center gap-2">
                <Building2 className="w-4 h-4 text-slate-400 shrink-0 hidden sm:block" />
                <select
                  value={empresaFilter}
                  onChange={(e) => setEmpresaFilter(e.target.value)}
                  className="w-full sm:w-48 bg-slate-800 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 font-medium"
                >
                  <option value="TODAS">Todas las Empresas</option>
                  {empresas.map((emp) => (
                    <option key={emp.id} value={emp.id}>
                      {emp.nombreComercial || emp.razonSocial}
                    </option>
                  ))}
                </select>
              </div>

              {/* Status Filter */}
              <div className="w-full sm:w-auto">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as any)}
                  className="w-full bg-slate-800 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 font-medium"
                >
                  <option value="TODOS">Todos los Registros</option>
                  <option value="CON_DIAGNOSTICO">Con Diagnóstico CIE-10</option>
                  <option value="CON_PDF">Con PDF Adjunto</option>
                  <option value="CON_SEGUIMIENTO">Con Controles de Seguimiento</option>
                </select>
              </div>
            </div>

            {/* View Mode Switcher (Table vs Cards) */}
            <div className="flex items-center gap-1 bg-slate-800 p-1 rounded-xl border border-slate-700/80 self-end md:self-auto">
              <button
                onClick={() => setDisplayFormat('table')}
                className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  displayFormat === 'table' ? 'bg-emerald-600 text-white shadow' : 'text-slate-400 hover:text-white'
                }`}
                title="Vista en Tabla"
              >
                <List className="w-4 h-4" /> Tabla
              </button>
              <button
                onClick={() => setDisplayFormat('cards')}
                className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  displayFormat === 'cards' ? 'bg-emerald-600 text-white shadow' : 'text-slate-400 hover:text-white'
                }`}
                title="Vista en Tarjetas"
              >
                <LayoutGrid className="w-4 h-4" /> Tarjetas
              </button>
            </div>
          </div>

          {/* Table or Card View Render */}
          {filteredHistoriasList.length === 0 ? (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center text-slate-400 space-y-3">
              <FileSpreadsheet className="w-12 h-12 text-slate-600 mx-auto" />
              <h3 className="text-base font-bold text-slate-200">No se encontraron Historias Clínicas</h3>
              <p className="text-xs max-w-md mx-auto text-slate-400">
                No hay expedientes médicos que coincidan con la búsqueda o filtro seleccionado.
              </p>
              <button
                onClick={() => { setSearchQuery(''); setEmpresaFilter('TODAS'); setStatusFilter('TODOS'); }}
                className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 rounded-lg text-xs font-semibold"
              >
                Limpiar Filtros
              </button>
            </div>
          ) : displayFormat === 'table' ? (
            /* TABLE VIEW */
            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-950 text-slate-400 font-semibold border-b border-slate-800 uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="py-3.5 px-4">Código HCO / Apertura</th>
                      <th className="py-3.5 px-4">Trabajador / Documento</th>
                      <th className="py-3.5 px-4">Empresa / Puesto</th>
                      <th className="py-3.5 px-4">Signos Vitales</th>
                      <th className="py-3.5 px-4">Diagnósticos CIE-10</th>
                      <th className="py-3.5 px-4">Estado / PDF</th>
                      <th className="py-3.5 px-4 text-right">Acción</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {filteredHistoriasList.map(({ trabajador: t, empresa: emp, hco: h }) => {
                      const diagsCount = h.diagnosticosCIE10?.length || 0;
                      const controlsCount = h.controlesPosteriores?.length || 0;
                      return (
                        <tr 
                          key={t.id}
                          className="hover:bg-slate-800/40 transition-colors cursor-pointer group"
                          onClick={() => handleSelectWorker(t.id)}
                        >
                          <td className="py-3.5 px-4 font-mono">
                            <div className="font-bold text-emerald-400 group-hover:text-emerald-300 flex items-center gap-1.5">
                              <FileSpreadsheet className="w-4 h-4 text-emerald-500 shrink-0" />
                              {h.codigoHCO}
                            </div>
                            <div className="text-[10px] text-slate-400 mt-0.5">
                              Apertura: {h.fechaApertura}
                            </div>
                          </td>

                          <td className="py-3.5 px-4">
                            <div className="font-bold text-white text-sm group-hover:text-emerald-300 transition-colors">
                              {t.nombres} {t.apellidoPaterno} {t.apellidoMaterno}
                            </div>
                            <div className="text-[10px] text-slate-400 font-mono">
                              {t.tipoDocumento}: {t.numeroDocumento}
                            </div>
                          </td>

                          <td className="py-3.5 px-4">
                            <div className="font-semibold text-slate-200">
                              {t.puestoTrabajo}
                            </div>
                            <div className="text-[10px] text-emerald-400 flex items-center gap-1">
                              <Building2 className="w-3 h-3 shrink-0" />
                              {emp?.nombreComercial || emp?.razonSocial || 'N/A'}
                            </div>
                          </td>

                          <td className="py-3.5 px-4">
                            <div className="flex flex-wrap items-center gap-1.5 text-[10px] font-mono">
                              <span className="px-1.5 py-0.5 bg-slate-800 border border-slate-700/80 rounded text-emerald-400 font-bold">
                                PA: {h.constantesVitalesMasRecientes?.pa || '120/80'}
                              </span>
                              <span className="px-1.5 py-0.5 bg-slate-800 border border-slate-700/80 rounded text-rose-400">
                                FC: {h.constantesVitalesMasRecientes?.fc || 72}
                              </span>
                              <span className="px-1.5 py-0.5 bg-slate-800 border border-slate-700/80 rounded text-indigo-400">
                                IMC: {h.constantesVitalesMasRecientes?.imc || 24}
                              </span>
                            </div>
                          </td>

                          <td className="py-3.5 px-4">
                            {diagsCount > 0 ? (
                              <div className="flex flex-wrap gap-1">
                                {h.diagnosticosCIE10?.slice(0, 2).map((d, idx) => (
                                  <span key={idx} className="px-1.5 py-0.5 bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded text-[10px] font-mono font-bold" title={d.descripcion}>
                                    {d.codigo}
                                  </span>
                                ))}
                                {diagsCount > 2 && (
                                  <span className="text-[10px] text-slate-400 font-medium">+{diagsCount - 2} más</span>
                                )}
                              </div>
                            ) : (
                              <span className="text-slate-500 text-[11px] italic">Sin hallazgos</span>
                            )}
                          </td>

                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-2">
                              {h.archivoPdf ? (
                                <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded text-[10px] font-bold flex items-center gap-1">
                                  <FileText className="w-3 h-3 text-emerald-400" /> PDF Adjunto
                                </span>
                              ) : (
                                <span className="px-2 py-0.5 bg-slate-800 text-slate-400 border border-slate-700 rounded text-[10px]">
                                  Sin PDF
                                </span>
                              )}
                              {controlsCount > 0 && (
                                <span className="px-2 py-0.5 bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded text-[10px] font-bold">
                                  {controlsCount} {controlsCount === 1 ? 'control' : 'controles'}
                                </span>
                              )}
                            </div>
                          </td>

                          <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => handleSelectWorker(t.id)}
                                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold text-xs flex items-center gap-1 shadow-md transition-all"
                              >
                                Revisar <ChevronRight className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            /* CARDS GRID VIEW */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredHistoriasList.map(({ trabajador: t, empresa: emp, hco: h }) => {
                const diagsCount = h.diagnosticosCIE10?.length || 0;
                const controlsCount = h.controlesPosteriores?.length || 0;
                return (
                  <div
                    key={t.id}
                    onClick={() => handleSelectWorker(t.id)}
                    className="bg-slate-900 border border-slate-800 hover:border-emerald-500/50 rounded-2xl p-5 space-y-4 shadow-xl hover:shadow-2xl hover:shadow-emerald-950/20 transition-all cursor-pointer group flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      {/* Top bar */}
                      <div className="flex items-center justify-between gap-2 pb-2 border-b border-slate-800">
                        <span className="font-mono text-xs font-bold text-emerald-400 flex items-center gap-1">
                          <FileSpreadsheet className="w-4 h-4 text-emerald-500" /> {h.codigoHCO}
                        </span>
                        <span className="text-[10px] text-slate-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                          {h.fechaApertura}
                        </span>
                      </div>

                      {/* Worker info */}
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 font-bold flex items-center justify-center shrink-0">
                          {t.nombres[0]}{t.apellidoPaterno[0]}
                        </div>
                        <div className="min-w-0 flex-1">
                          <h4 className="font-bold text-white text-sm group-hover:text-emerald-300 transition-colors truncate">
                            {t.nombres} {t.apellidoPaterno} {t.apellidoMaterno}
                          </h4>
                          <p className="text-xs text-slate-300 font-medium truncate">{t.puestoTrabajo}</p>
                          <p className="text-[11px] text-emerald-400 font-semibold truncate flex items-center gap-1 mt-0.5">
                            <Building2 className="w-3 h-3 shrink-0" />
                            {emp?.nombreComercial || emp?.razonSocial}
                          </p>
                        </div>
                      </div>

                      {/* Vital signs badge grid */}
                      <div className="grid grid-cols-3 gap-2 bg-slate-950 p-2.5 rounded-xl border border-slate-800 text-[11px] font-mono">
                        <div>
                          <span className="text-[9px] text-slate-500 block">P. Arterial</span>
                          <span className="font-bold text-emerald-400">{h.constantesVitalesMasRecientes?.pa || '120/80'}</span>
                        </div>
                        <div>
                          <span className="text-[9px] text-slate-500 block">F. Cardíaca</span>
                          <span className="font-bold text-rose-400">{h.constantesVitalesMasRecientes?.fc || 72} LPM</span>
                        </div>
                        <div>
                          <span className="text-[9px] text-slate-500 block">IMC</span>
                          <span className="font-bold text-indigo-400">{h.constantesVitalesMasRecientes?.imc || 24.2}</span>
                        </div>
                      </div>

                      {/* Diagnoses preview */}
                      <div>
                        <span className="text-[10px] text-slate-400 font-semibold block mb-1">Diagnósticos Ocupacionales:</span>
                        {diagsCount > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {h.diagnosticosCIE10?.map((d, idx) => (
                              <span key={idx} className="px-2 py-0.5 bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded text-[10px] font-mono font-bold" title={d.descripcion}>
                                {d.codigo}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span className="text-slate-500 text-xs italic">Sin diagnósticos CIE-10 registrados</span>
                        )}
                      </div>
                    </div>

                    {/* Bottom Action */}
                    <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                      <span className="text-[10px] text-slate-400">
                        {controlsCount > 0 ? `${controlsCount} controles registrados` : 'Sin controles posteriores'}
                      </span>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleSelectWorker(t.id); }}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold text-xs flex items-center gap-1 shadow-md transition-all"
                      >
                        Revisar Expediente <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ) : (
        /* ==================== VISTA DETALLE DE HISTORIA CLINICA ==================== */
        <div className="space-y-6">
          {/* Header Bar in Detail View */}
          <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setViewMode('list')}
                className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-md shrink-0"
                title="Volver al directorio general de historias clínicas"
              >
                <ArrowLeft className="w-4 h-4 text-emerald-400" /> Volver al Listado
              </button>

              <div>
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="px-2.5 py-0.5 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold uppercase rounded">
                    Expediente #{hco.codigoHCO}
                  </span>
                  <span className="text-xs text-slate-400">Confidencial Ley N° 29733</span>
                </div>
                <h2 className="text-xl font-bold text-white font-display flex items-center gap-2">
                  <FileSpreadsheet className="w-5 h-5 text-emerald-400" /> {trabajador.nombres} {trabajador.apellidoPaterno} {trabajador.apellidoMaterno}
                </h2>
              </div>
            </div>

            {/* Worker Switcher & Action Buttons */}
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={handleOpenNewHCOModal}
                className="px-3.5 py-2 bg-emerald-700 hover:bg-emerald-600 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-lg transition-all shrink-0"
                title="Abrir o registrar una nueva Historia Clínica Ocupacional"
              >
                <UserPlus className="w-4 h-4" /> + Nueva Historia
              </button>

              <button
                onClick={handleOpenEditModal}
                className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold flex items-center gap-2 shadow-lg shadow-indigo-900/40 transition-all shrink-0"
                title="Editar información de la Historia Clínica"
              >
                <Edit3 className="w-4 h-4" /> Editar Historia
              </button>

              <button
                onClick={handleDownloadPdf}
                className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 rounded-lg text-xs font-bold flex items-center gap-2 transition-all shrink-0"
                title="Descargar Historia Clínica en PDF"
              >
                <Download className="w-4 h-4 text-emerald-400" /> Descargar PDF
              </button>

              <div className="flex items-center gap-2">
                <label className="text-xs text-slate-400 font-medium hidden sm:inline">Expediente:</label>
                <select
                  value={activeTrabajadorId}
                  onChange={(e) => setActiveTrabajadorId(e.target.value)}
                  className="bg-slate-800 border border-slate-700/80 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 font-semibold"
                >
                  {trabajadores.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.apellidoPaterno} {t.nombres} ({t.numeroDocumento})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

      {trabajador && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Worker Demographic Sidebar */}
          <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 space-y-4">
            <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
              <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center font-bold text-lg shrink-0">
                {trabajador.nombres[0]}{trabajador.apellidoPaterno[0]}
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-bold text-white text-base truncate">
                  {trabajador.nombres} {trabajador.apellidoPaterno}
                </h3>
                <p className="text-xs text-emerald-400 font-mono font-semibold truncate">
                  {trabajador.tipoDocumento}: {trabajador.numeroDocumento}
                </p>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Código HCO:</span>
                <span className="font-mono text-white font-semibold">{hco.codigoHCO}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Empresa Cliente:</span>
                <span className="text-slate-200 font-medium truncate max-w-[150px]">{empresa?.nombreComercial}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Puesto de Trabajo:</span>
                <span className="text-white font-semibold truncate max-w-[150px]">{trabajador.puestoTrabajo}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Área Ocupacional:</span>
                <span className="text-slate-300 truncate max-w-[150px]">{trabajador.area}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Fecha Nac. / Edad:</span>
                <span className="text-slate-300 font-semibold">{trabajador.fechaNacimiento} ({calculateAge(trabajador.fechaNacimiento)} años)</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Fecha de Apertura:</span>
                <span className="text-slate-300">{hco.fechaApertura}</span>
              </div>
            </div>

            {/* Subir y Descargar Historia Clínica en PDF */}
            <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-emerald-400" />
                  Expediente HC en PDF
                </h4>
                <button
                  type="button"
                  onClick={handleGenerateOfficialPdf}
                  className="text-[10px] px-2 py-1 bg-emerald-500/20 text-emerald-300 hover:bg-emerald-600 hover:text-white border border-emerald-500/30 rounded font-semibold flex items-center gap-1 transition-all"
                  title="Generar documento oficial en PDF con la firma del médico"
                >
                  <Sparkles className="w-3 h-3 text-amber-400" /> Generar PDF
                </button>
              </div>

              {hco.archivoPdf ? (
                <div className="bg-slate-900 p-3 rounded-lg border border-slate-800 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 min-w-0">
                    <FileText className="w-5 h-5 text-emerald-400 shrink-0" />
                    <div className="min-w-0">
                      <p className="text-white font-medium truncate">{hco.archivoPdf.nombreArchivo}</p>
                      <p className="text-[10px] text-slate-400">
                        {formatFileSize(hco.archivoPdf.tamanioBytes)} • {hco.archivoPdf.fechaSubida}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => setShowPreviewModal(true)}
                      className="p-1.5 text-slate-400 hover:text-emerald-400 hover:bg-slate-800 rounded"
                      title="Ver PDF"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={handleDownloadPdf}
                      className="p-1.5 text-slate-400 hover:text-indigo-400 hover:bg-slate-800 rounded"
                      title="Descargar PDF"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={handleRemovePdf}
                      className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded"
                      title="Eliminar PDF"
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
                      handlePdfUpload(e.dataTransfer.files[0]);
                    }
                  }}
                  className={`border-2 border-dashed rounded-xl p-4 text-center transition-all ${
                    isDragging ? 'border-emerald-500 bg-emerald-500/10' : 'border-slate-800 hover:border-slate-700 bg-slate-900/50'
                  }`}
                >
                  <Upload className="w-6 h-6 text-slate-500 mx-auto mb-1.5" />
                  <p className="text-xs font-semibold text-slate-300">Arrastre su PDF escaneado aquí</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">o seleccione desde su equipo</p>

                  <label className="mt-2.5 inline-flex items-center gap-1.5 px-3 py-1 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-semibold rounded-lg cursor-pointer transition-all">
                    <FileUp className="w-3.5 h-3.5 text-emerald-400" /> Adjuntar Expediente PDF
                    <input
                      type="file"
                      accept=".pdf"
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          handlePdfUpload(e.target.files[0]);
                        }
                      }}
                    />
                  </label>
                </div>
              )}
            </div>
          </div>

          {/* Main Clinical History Content */}
          <div className="lg:col-span-2 bg-slate-900 p-6 rounded-2xl border border-slate-800 space-y-6">
            
            {/* Section 1: Constantes Vitales & Somatometría */}
            <div>
              <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-800">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Activity className="w-4 h-4 text-emerald-400" /> Constantes Vitales Iniciales / Recientes
                </h3>
                <button
                  onClick={handleOpenEditModal}
                  className="text-xs text-indigo-400 hover:underline font-semibold flex items-center gap-1"
                >
                  <Edit3 className="w-3 h-3" /> Modificar Vitales
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 block mb-1 uppercase tracking-wider font-semibold">Presión Arterial</span>
                  <div className="text-sm font-mono font-bold text-emerald-400 flex items-center gap-1.5">
                    <Activity className="w-4 h-4 text-emerald-400 shrink-0" />
                    {hco.constantesVitalesMasRecientes?.pa || 'N/R'}
                  </div>
                </div>

                <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 block mb-1 uppercase tracking-wider font-semibold">Frecuencia Cardíaca</span>
                  <div className="text-sm font-mono font-bold text-rose-400 flex items-center gap-1.5">
                    <Heart className="w-4 h-4 text-rose-400 shrink-0" />
                    {hco.constantesVitalesMasRecientes?.fc || 0} LPM
                  </div>
                </div>

                <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 block mb-1 uppercase tracking-wider font-semibold">Frecuencia Resp.</span>
                  <div className="text-sm font-mono font-bold text-sky-400 flex items-center gap-1.5">
                    <Wind className="w-4 h-4 text-sky-400 shrink-0" />
                    {hco.constantesVitalesMasRecientes?.fr || 16} RPM
                  </div>
                </div>

                <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 block mb-1 uppercase tracking-wider font-semibold">Temperatura</span>
                  <div className="text-sm font-mono font-bold text-amber-400 flex items-center gap-1.5">
                    <Thermometer className="w-4 h-4 text-amber-400 shrink-0" />
                    {hco.constantesVitalesMasRecientes?.temperatura || 36.5} °C
                  </div>
                </div>

                <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 block mb-1 uppercase tracking-wider font-semibold">Índice Masa Corporal</span>
                  <div className="text-sm font-mono font-bold text-indigo-400">
                    {hco.constantesVitalesMasRecientes?.imc || 0} kg/m²
                  </div>
                </div>

                <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 block mb-1 uppercase tracking-wider font-semibold">Saturación O2</span>
                  <div className="text-sm font-mono font-bold text-emerald-300">
                    {hco.constantesVitalesMasRecientes?.saturacionO2 || 0}% Sat
                  </div>
                </div>
              </div>
            </div>

            {/* Section 2: Antecedentes Personales & Patológicos */}
            <div>
              <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-800">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Stethoscope className="w-4 h-4 text-indigo-400" /> Antecedentes Personales & Patológicos
                </h3>
                <button
                  onClick={handleOpenEditModal}
                  className="text-xs text-indigo-400 hover:underline font-semibold flex items-center gap-1"
                >
                  <Edit3 className="w-3 h-3" /> Modificar
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="bg-slate-800/50 p-3 rounded-xl border border-slate-800">
                  <span className="text-slate-400 font-semibold block mb-1">Patologías:</span>
                  <p className="text-slate-200">
                    {hco.antecedentesPersonales?.patologicas?.join(', ') || 'Niega antecedentes patológicos'}
                  </p>
                </div>

                <div className="bg-slate-800/50 p-3 rounded-xl border border-slate-800">
                  <span className="text-slate-400 font-semibold block mb-1">Cirugías:</span>
                  <p className="text-slate-200">
                    {hco.antecedentesPersonales?.quirurgicas?.join(', ') || 'Niega cirugías previas'}
                  </p>
                </div>

                <div className="bg-slate-800/50 p-3 rounded-xl border border-slate-800">
                  <span className="text-slate-400 font-semibold block mb-1">Alergias Medicamentosas:</span>
                  <p className="text-slate-200">
                    {hco.antecedentesPersonales?.alergias?.join(', ') || 'Niega alergias conocidas'}
                  </p>
                </div>

                <div className="bg-slate-800/50 p-3 rounded-xl border border-slate-800">
                  <span className="text-slate-400 font-semibold block mb-1">Hábitos Nocivos:</span>
                  <p className="text-slate-200">
                    {hco.antecedentesPersonales?.habitosNocivos || 'Niega hábitos nocivos'}
                  </p>
                </div>
              </div>
            </div>

            {/* Section 3: Antecedentes Ocupacionales */}
            <div>
              <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-800">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Shield className="w-4 h-4 text-amber-400" /> Antecedentes Ocupacionales (Empresas Anteriores)
                </h3>
                <button
                  onClick={handleOpenEditModal}
                  className="text-xs text-amber-400 hover:underline font-semibold flex items-center gap-1 bg-amber-500/10 px-2.5 py-1 rounded border border-amber-500/20"
                >
                  <Edit3 className="w-3 h-3" /> Editar Antecedentes Ocupacionales
                </button>
              </div>

              <div className="space-y-3 text-xs">
                {hco.antecedentesOcupacionales && hco.antecedentesOcupacionales.length > 0 ? (
                  hco.antecedentesOcupacionales.map((ant, idx) => (
                    <div key={idx} className="bg-slate-800/50 p-3.5 rounded-xl border border-slate-800">
                      <div className="flex items-center justify-between font-bold text-white mb-1">
                        <span>{ant.empresaAnterior}</span>
                        <span className="text-amber-400">{ant.tiempoAnos} Años de Exposición</span>
                      </div>
                      <p className="text-slate-300 font-medium mb-1">Puesto: {ant.puesto}</p>
                      <div className="text-slate-400">
                        Riesgos Expuestos: <span className="text-slate-200">{ant.riesgosExpuestos?.join(', ')}</span> | EPP: <span className="text-slate-200">{ant.eppUtilizado}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-slate-500 text-xs italic">Sin antecedentes ocupacionales registrados.</p>
                )}
              </div>
            </div>

            {/* NUEVA SECCIÓN: Controles Posteriores y Seguimiento Médico Ocupacional */}
            <div className="bg-slate-950/80 p-5 rounded-2xl border border-indigo-900/50 shadow-inner space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Activity className="w-4 h-4 text-emerald-400" /> Controles Médicos de Seguimiento
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Histórico de controles (Control 1, Control 2, Control 3...) con seguimiento de constante vitales y laboratorios.
                  </p>
                </div>

                <button
                  onClick={handleOpenAddControlModal}
                  className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-emerald-900/30 transition-all shrink-0 self-start sm:self-auto"
                >
                  <PlusCircle className="w-4 h-4" /> + Agregar Control
                </button>
              </div>

              {hco.controlesPosteriores && hco.controlesPosteriores.length > 0 ? (
                <div className="space-y-4">
                  {hco.controlesPosteriores.map((ctrl, idx) => {
                    const controlNumber = idx + 1;
                    return (
                      <div key={ctrl.id || idx} className="bg-slate-900/90 p-4 rounded-xl border border-slate-800 space-y-3">
                        {/* Control Header Bar */}
                        <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-800 text-xs">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 font-mono font-bold rounded-lg border border-emerald-500/40 text-xs flex items-center gap-1.5">
                              <Activity className="w-3.5 h-3.5 text-emerald-400" /> Control {controlNumber}
                            </span>
                            <span className="px-2.5 py-0.5 bg-slate-950 text-slate-300 font-mono text-xs rounded border border-slate-800">
                              Fecha: {ctrl.fecha}
                            </span>
                            {ctrl.motivoControl && ctrl.motivoControl !== `Control ${controlNumber}` && (
                              <span className="text-slate-400 text-xs">({ctrl.motivoControl})</span>
                            )}
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="text-[11px] text-slate-400 flex items-center gap-1 mr-2">
                              <Stethoscope className="w-3.5 h-3.5 text-indigo-400" /> {ctrl.medicoAtendio || 'Médico Ocupacional'}
                            </span>
                            <button
                              onClick={() => handleOpenEditControlModal(ctrl, idx)}
                              className="px-2 py-1 bg-slate-800 hover:bg-indigo-600/30 text-slate-300 hover:text-indigo-300 border border-slate-700/80 rounded text-xs font-semibold flex items-center gap-1 transition-all"
                              title="Editar Control"
                            >
                              <Edit3 className="w-3.5 h-3.5" /> Editar
                            </button>
                            <button
                              onClick={() => handleDeleteControl(idx)}
                              className="px-2 py-1 bg-slate-800 hover:bg-rose-600/30 text-slate-300 hover:text-rose-400 border border-slate-700/80 rounded text-xs font-semibold flex items-center gap-1 transition-all"
                              title="Eliminar Control"
                            >
                              <Trash2 className="w-3.5 h-3.5" /> Eliminar
                            </button>
                          </div>
                        </div>

                        {/* Vital Signs Grid Badges */}
                        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs">
                          <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                            <span className="text-[10px] text-slate-400 block">P. Arterial (PA)</span>
                            <span className="font-mono font-bold text-emerald-400">{ctrl.signosVitales.pa}</span>
                          </div>

                          <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                            <span className="text-[10px] text-slate-400 block">F. Cardíaca (FC)</span>
                            <span className="font-mono font-bold text-rose-400">{ctrl.signosVitales.fc} LPM</span>
                          </div>

                          <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                            <span className="text-[10px] text-slate-400 block">F. Resp. (FR)</span>
                            <span className="font-mono font-bold text-sky-400">{ctrl.signosVitales.fr} RPM</span>
                          </div>

                          <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                            <span className="text-[10px] text-slate-400 block">Saturación O2</span>
                            <span className="font-mono font-bold text-emerald-300">{ctrl.signosVitales.saturacionO2}%</span>
                          </div>

                          <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 col-span-2 sm:col-span-1">
                            <span className="text-[10px] text-slate-400 block">Temperatura</span>
                            <span className="font-mono font-bold text-amber-400">{ctrl.signosVitales.temperatura} °C</span>
                          </div>
                        </div>

                        {/* Lab Exams Table */}
                        {ctrl.examenesLaboratorio && ctrl.examenesLaboratorio.length > 0 && (
                          <div className="bg-slate-950 rounded-lg border border-slate-800 p-3 space-y-2">
                            <div className="text-[11px] font-semibold text-slate-300 flex items-center gap-1.5">
                              <FlaskConical className="w-3.5 h-3.5 text-indigo-400" /> Exámenes de Laboratorio del Control:
                            </div>
                            <div className="divide-y divide-slate-800 text-xs">
                              {ctrl.examenesLaboratorio.map((lab) => (
                                <div key={lab.id} className="py-1.5 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                                  <div className="font-medium text-slate-200">
                                    {lab.nombreExamen}: <span className="font-mono text-emerald-400 font-bold">{lab.resultado}</span>
                                  </div>
                                  <div className="text-[11px] text-slate-400 flex items-center gap-2">
                                    {lab.valoresReferencia && <span>(Ref: {lab.valoresReferencia})</span>}
                                    {lab.observacion && <span className="text-slate-300">• {lab.observacion}</span>}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Clinical Observation Note */}
                        {ctrl.observacionControl && (
                          <div className="text-xs text-slate-300 italic bg-slate-950/40 p-2.5 rounded-lg border border-slate-800/60">
                            "{ctrl.observacionControl}"
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-6 bg-slate-900/60 rounded-xl border border-slate-800 text-xs text-slate-400 space-y-2">
                  <Activity className="w-8 h-8 text-slate-600 mx-auto" />
                  <p>Sin controles registrados para esta Historia Clínica.</p>
                  <button
                    onClick={handleOpenAddControlModal}
                    className="text-xs text-emerald-400 hover:underline font-semibold"
                  >
                    + Registrar Control 1
                  </button>
                </div>
              )}
            </div>

            {/* Section 4: Impresiones Diagnósticas CIE-10 (Búsqueda o Manual) */}
            <div>
              <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-800">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Stethoscope className="w-4 h-4 text-indigo-400" /> Búsqueda e Inserción de Diagnósticos (CIE-10)
                </h3>
                <button
                  type="button"
                  onClick={() => setUseManualCie(!useManualCie)}
                  className="text-xs text-emerald-400 hover:underline font-semibold flex items-center gap-1"
                >
                  {useManualCie ? 'Usar Catálogo CIE-10' : '+ Ingresar Código Manualmente'}
                </button>
              </div>

              {/* Added Diagnoses Table */}
              {hco.diagnosticosCIE10 && hco.diagnosticosCIE10.length > 0 && (
                <div className="mb-4 bg-slate-950 rounded-xl border border-slate-800 overflow-hidden">
                  <div className="p-3 bg-slate-900 border-b border-slate-800 text-xs font-bold text-slate-300 flex items-center justify-between">
                    <span>Diagnósticos CIE-10 Registrados ({hco.diagnosticosCIE10.length})</span>
                    <span className="text-[10px] text-slate-500">Formato R.M. 312-2011</span>
                  </div>
                  <div className="divide-y divide-slate-800/60">
                    {hco.diagnosticosCIE10.map((diag, idx) => (
                      <div key={diag.id || idx} className="p-3 flex items-center justify-between gap-3 text-xs hover:bg-slate-900/40 transition-all">
                        <div className="flex items-center gap-3 min-w-0">
                          <span className="px-2 py-1 bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded font-mono font-bold shrink-0">
                            {diag.codigo}
                          </span>
                          <div className="min-w-0">
                            <div className="text-slate-200 font-semibold truncate">{diag.descripcion}</div>
                            <div className="text-[10px] text-slate-400 flex items-center gap-2">
                              <span>Tipo: <strong className="text-emerald-400">{diag.tipo}</strong></span>
                              <span>•</span>
                              <span>Fecha: {diag.fecha || 'Reciente'}</span>
                            </div>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleRemoveDiagnosis(diag.id, idx)}
                          className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded transition-all shrink-0"
                          title="Eliminar diagnóstico"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Form to Add Diagnosis */}
              <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-semibold text-slate-200">
                    {useManualCie ? 'Ingresar Código CIE-10 Manualmente:' : 'Buscar en Catálogo de CIE-10 Ocupacional:'}
                  </label>
                  <span className="text-[10px] text-slate-400">
                    {useManualCie ? 'Ingreso libre de cualquier código' : 'Autocompletado con filtro'}
                  </span>
                </div>

                {!useManualCie ? (
                  <CIE10SearchInput
                    value={selectedCieCodigo ? `${selectedCieCodigo} - ${selectedCieDesc}` : ''}
                    onChange={(codigo, descripcion) => {
                      setSelectedCieCodigo(codigo);
                      setSelectedCieDesc(descripcion);
                    }}
                    placeholder="Buscar por código (ej. M54.5, H83.3, J62) o por enfermedad..."
                  />
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <div>
                      <label className="text-[10px] text-slate-400 mb-1 block">Código CIE-10:</label>
                      <input
                        type="text"
                        value={manualCieCodigo}
                        onChange={(e) => setManualCieCodigo(e.target.value)}
                        placeholder="Ej. J45.9"
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white uppercase font-mono font-bold focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="text-[10px] text-slate-400 mb-1 block">Descripción Médica:</label>
                      <input
                        type="text"
                        value={manualCieDesc}
                        onChange={(e) => setManualCieDesc(e.target.value)}
                        placeholder="Ej. Asma no especificada / Exposición a alérgenos"
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
                  <div className="flex items-center gap-2">
                    <label className="text-xs text-slate-300 font-semibold">Tipo de Diagnóstico:</label>
                    <select
                      value={cieTipo}
                      onChange={(e) => setCieTipo(e.target.value as any)}
                      className="bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-white font-semibold focus:outline-none focus:border-indigo-500"
                    >
                      <option value="DEFINITIVO">Definitivo</option>
                      <option value="PRESUNTIVO">Presuntivo</option>
                      <option value="REPETIDO">Repetido</option>
                    </select>
                  </div>

                  <button
                    type="button"
                    onClick={handleAddDiagnosis}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 shadow-md shadow-indigo-900/30 transition-all"
                  >
                    <PlusCircle className="w-4 h-4" /> Agregar Diagnóstico a Historia
                  </button>
                </div>
              </div>
            </div>

            {/* Section 5: Observaciones Médicas */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <FileText className="w-4 h-4 text-emerald-400" /> Observaciones y Conclusiones del Médico Ocupacional
                </h3>
                <button
                  onClick={handleOpenEditModal}
                  className="text-xs text-indigo-400 hover:underline font-semibold flex items-center gap-1"
                >
                  <Edit3 className="w-3 h-3" /> Editar Observaciones
                </button>
              </div>

              <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-800 text-xs text-slate-200 leading-relaxed">
                {hco.observacionesMedicas || 'Sin observaciones adicionales registradas.'}
              </div>
            </div>

            {/* Security Lock Note */}
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-slate-400 text-xs flex items-center gap-2">
              <Lock className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>
                <strong>Trazabilidad Ley N° 29733:</strong> Toda modificación queda respaldada en auditoría médica con sello digital inmutable.
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  )}

      {/* MODAL 1: EDIT CLINICAL HISTORY MODAL */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-hidden">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl text-slate-100 overflow-hidden my-auto">
            <div className="p-4 sm:p-5 border-b border-slate-800 shrink-0 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-indigo-500/10 text-indigo-400 rounded-xl border border-indigo-500/20">
                  <Edit3 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">
                    Editar Historia Clínica Ocupacional
                  </h3>
                  <p className="text-xs text-slate-400">
                    Expediente {editForm.codigoHCO} • {trabajador?.nombres} {trabajador?.apellidoPaterno}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowEditModal(false)}
                className="p-1.5 bg-slate-800 text-slate-400 hover:text-white rounded-lg border border-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 sm:p-5 flex-1 overflow-y-auto space-y-6">
              {/* 1. Constantes Vitales */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
                <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-2">
                  <Activity className="w-4 h-4" /> 1. Constantes Vitales & Somatometría Inicial
                </h4>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">Presión Arterial (PA):</label>
                    <input
                      type="text"
                      value={editForm.constantesVitalesMasRecientes?.pa || ''}
                      onChange={(e) => setEditForm({
                        ...editForm,
                        constantesVitalesMasRecientes: {
                          ...editForm.constantesVitalesMasRecientes!,
                          pa: e.target.value
                        }
                      })}
                      placeholder="ej. 120/80 mmHg"
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white font-mono focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">Frecuencia Cardíaca (LPM):</label>
                    <input
                      type="number"
                      value={editForm.constantesVitalesMasRecientes?.fc || ''}
                      onChange={(e) => setEditForm({
                        ...editForm,
                        constantesVitalesMasRecientes: {
                          ...editForm.constantesVitalesMasRecientes!,
                          fc: Number(e.target.value)
                        }
                      })}
                      placeholder="ej. 75"
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white font-mono focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">Frec. Respiratoria (FR - RPM):</label>
                    <input
                      type="number"
                      value={editForm.constantesVitalesMasRecientes?.fr || ''}
                      onChange={(e) => setEditForm({
                        ...editForm,
                        constantesVitalesMasRecientes: {
                          ...editForm.constantesVitalesMasRecientes!,
                          fr: Number(e.target.value)
                        }
                      })}
                      placeholder="ej. 16"
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white font-mono focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">Temperatura (°C):</label>
                    <input
                      type="number"
                      step="0.1"
                      value={editForm.constantesVitalesMasRecientes?.temperatura || ''}
                      onChange={(e) => setEditForm({
                        ...editForm,
                        constantesVitalesMasRecientes: {
                          ...editForm.constantesVitalesMasRecientes!,
                          temperatura: Number(e.target.value)
                        }
                      })}
                      placeholder="ej. 36.6"
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white font-mono focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">IMC (kg/m²):</label>
                    <input
                      type="number"
                      step="0.1"
                      value={editForm.constantesVitalesMasRecientes?.imc || ''}
                      onChange={(e) => setEditForm({
                        ...editForm,
                        constantesVitalesMasRecientes: {
                          ...editForm.constantesVitalesMasRecientes!,
                          imc: Number(e.target.value)
                        }
                      })}
                      placeholder="ej. 24.5"
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white font-mono focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">Saturación O2 (%):</label>
                    <input
                      type="number"
                      value={editForm.constantesVitalesMasRecientes?.saturacionO2 || ''}
                      onChange={(e) => setEditForm({
                        ...editForm,
                        constantesVitalesMasRecientes: {
                          ...editForm.constantesVitalesMasRecientes!,
                          saturacionO2: Number(e.target.value)
                        }
                      })}
                      placeholder="ej. 98"
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white font-mono focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>
              </div>

              {/* 2. Antecedentes Personales */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
                <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
                  <Stethoscope className="w-4 h-4" /> 2. Antecedentes Personales & Patológicos
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">Patologías (Separadas por coma):</label>
                    <input
                      type="text"
                      value={editForm.antecedentesPersonales?.patologicas?.join(', ') || ''}
                      onChange={(e) => setEditForm({
                        ...editForm,
                        antecedentesPersonales: {
                          ...editForm.antecedentesPersonales,
                          patologicas: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                        }
                      })}
                      placeholder="Gastritis, Hipertensión, etc."
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">Antecedentes Quirúrgicos:</label>
                    <input
                      type="text"
                      value={editForm.antecedentesPersonales?.quirurgicas?.join(', ') || ''}
                      onChange={(e) => setEditForm({
                        ...editForm,
                        antecedentesPersonales: {
                          ...editForm.antecedentesPersonales,
                          quirurgicas: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                        }
                      })}
                      placeholder="Apendicectomía, etc."
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">Alergias Medicamentosas:</label>
                    <input
                      type="text"
                      value={editForm.antecedentesPersonales?.alergias?.join(', ') || ''}
                      onChange={(e) => setEditForm({
                        ...editForm,
                        antecedentesPersonales: {
                          ...editForm.antecedentesPersonales,
                          alergias: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                        }
                      })}
                      placeholder="Alergia a Penicilina, Sulfa, etc."
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">Hábitos Nocivos:</label>
                    <input
                      type="text"
                      value={editForm.antecedentesPersonales?.habitosNocivos || ''}
                      onChange={(e) => setEditForm({
                        ...editForm,
                        antecedentesPersonales: {
                          ...editForm.antecedentesPersonales,
                          habitosNocivos: e.target.value
                        }
                      })}
                      placeholder="Alcohol ocasional, Niega tabaco, etc."
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>
              </div>

              {/* 3. Antecedentes Ocupacionales Editables */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
                    <Shield className="w-4 h-4" /> 3. Antecedentes Ocupacionales (Empresas Anteriores)
                  </h4>
                  <button
                    type="button"
                    onClick={handleAddAntecedenteOcupacionalInEdit}
                    className="text-xs px-2.5 py-1 bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 border border-amber-500/30 rounded flex items-center gap-1 font-semibold"
                  >
                    <Plus className="w-3.5 h-3.5" /> Agregar Empresa Anterior
                  </button>
                </div>

                <div className="space-y-3">
                  {editForm.antecedentesOcupacionales && editForm.antecedentesOcupacionales.length > 0 ? (
                    editForm.antecedentesOcupacionales.map((ant, idx) => (
                      <div key={idx} className="bg-slate-900 p-3.5 rounded-xl border border-slate-800 space-y-2 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-300">Empresa Anterior #{idx + 1}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveAntecedenteOcupacionalInEdit(idx)}
                            className="p-1 text-slate-400 hover:text-rose-400 rounded"
                            title="Eliminar Antecedente Ocupacional"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                          <div>
                            <label className="text-[10px] text-slate-400 block mb-0.5">Empresa Anterior:</label>
                            <input
                              type="text"
                              value={ant.empresaAnterior}
                              onChange={(e) => {
                                const list = [...(editForm.antecedentesOcupacionales || [])];
                                list[idx].empresaAnterior = e.target.value;
                                setEditForm({ ...editForm, antecedentesOcupacionales: list });
                              }}
                              className="w-full bg-slate-950 border border-slate-700 rounded px-2.5 py-1 text-xs text-white"
                              placeholder="Nombre de empresa"
                            />
                          </div>

                          <div>
                            <label className="text-[10px] text-slate-400 block mb-0.5">Puesto Desempeñado:</label>
                            <input
                              type="text"
                              value={ant.puesto}
                              onChange={(e) => {
                                const list = [...(editForm.antecedentesOcupacionales || [])];
                                list[idx].puesto = e.target.value;
                                setEditForm({ ...editForm, antecedentesOcupacionales: list });
                              }}
                              className="w-full bg-slate-950 border border-slate-700 rounded px-2.5 py-1 text-xs text-white"
                              placeholder="Puesto de trabajo"
                            />
                          </div>

                          <div>
                            <label className="text-[10px] text-slate-400 block mb-0.5">Tiempo (Años):</label>
                            <input
                              type="number"
                              value={ant.tiempoAnos}
                              onChange={(e) => {
                                const list = [...(editForm.antecedentesOcupacionales || [])];
                                list[idx].tiempoAnos = Number(e.target.value);
                                setEditForm({ ...editForm, antecedentesOcupacionales: list });
                              }}
                              className="w-full bg-slate-950 border border-slate-700 rounded px-2.5 py-1 text-xs text-white"
                              placeholder="Años"
                            />
                          </div>

                          <div className="sm:col-span-2">
                            <label className="text-[10px] text-slate-400 block mb-0.5">Riesgos Expuestos (separados por coma):</label>
                            <input
                              type="text"
                              value={ant.riesgosExpuestos?.join(', ') || ''}
                              onChange={(e) => {
                                const list = [...(editForm.antecedentesOcupacionales || [])];
                                list[idx].riesgosExpuestos = e.target.value.split(',').map(s => s.trim()).filter(Boolean);
                                setEditForm({ ...editForm, antecedentesOcupacionales: list });
                              }}
                              className="w-full bg-slate-950 border border-slate-700 rounded px-2.5 py-1 text-xs text-white"
                              placeholder="Ruido, Polvo, Químicos, Ergonomía"
                            />
                          </div>

                          <div>
                            <label className="text-[10px] text-slate-400 block mb-0.5">EPP Utilizado:</label>
                            <input
                              type="text"
                              value={ant.eppUtilizado}
                              onChange={(e) => {
                                const list = [...(editForm.antecedentesOcupacionales || [])];
                                list[idx].eppUtilizado = e.target.value;
                                setEditForm({ ...editForm, antecedentesOcupacionales: list });
                              }}
                              className="w-full bg-slate-950 border border-slate-700 rounded px-2.5 py-1 text-xs text-white"
                              placeholder="Respirador, Tapones, Casco, Botas"
                            />
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-slate-500 text-xs italic">Sin antecedentes ocupacionales. Presione 'Agregar Empresa Anterior' arriba.</p>
                  )}
                </div>
              </div>

              {/* 4. Observaciones del Médico */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                <h4 className="text-xs font-bold text-sky-400 uppercase tracking-wider flex items-center gap-2">
                  <FileText className="w-4 h-4" /> 4. Observaciones y Recomendaciones Médicas
                </h4>
                <textarea
                  rows={3}
                  value={editForm.observacionesMedicas || ''}
                  onChange={(e) => setEditForm({ ...editForm, observacionesMedicas: e.target.value })}
                  placeholder="Escriba las conclusiones, recomendaciones ergonómicas o notas del médico ocupacional..."
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="p-4 sm:p-5 border-t border-slate-800 flex items-center justify-end gap-3 shrink-0 bg-slate-900">
              <button
                type="button"
                onClick={() => setShowEditModal(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-semibold"
              >
                Cancelar
              </button>

              <button
                type="button"
                onClick={handleSaveEditModal}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold flex items-center gap-2 shadow-lg shadow-emerald-900/40"
              >
                <Save className="w-4 h-4" /> Guardar Cambios
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: CREAR NUEVA HISTORIA CLINICA MODAL */}
      {showNewHCOModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-hidden">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl text-slate-100 overflow-hidden my-auto">
            <div className="p-4 sm:p-5 border-b border-slate-800 shrink-0 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/20">
                  <UserPlus className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">
                    Abrir Nueva Historia Clínica Ocupacional (HCO)
                  </h3>
                  <p className="text-xs text-slate-400">
                    Apertura oficial conforme al Anexo 02 R.M. 312-2011-MINSA
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowNewHCOModal(false)}
                className="p-1.5 bg-slate-800 text-slate-400 hover:text-white rounded-lg border border-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 sm:p-5 flex-1 overflow-y-auto space-y-4 text-xs">
              {/* Worker Selector */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
                <label className="text-xs font-bold text-emerald-400 block">
                  1. Seleccionar Trabajador Titular del Expediente:
                </label>
                <select
                  value={newHCOForm.trabajadorId}
                  onChange={(e) => {
                    const sel = trabajadores.find(t => t.id === e.target.value);
                    setNewHCOForm({
                      ...newHCOForm,
                      trabajadorId: e.target.value,
                      codigoHCO: `HCO-${sel?.numeroDocumento || Date.now().toString().slice(-6)}`
                    });
                  }}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-xs text-white font-semibold focus:outline-none focus:border-emerald-500"
                >
                  {trabajadores.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.apellidoPaterno} {t.nombres} — DNI/CE: {t.numeroDocumento} ({t.puestoTrabajo})
                    </option>
                  ))}
                </select>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1">Código Único HCO:</label>
                    <input
                      type="text"
                      value={newHCOForm.codigoHCO}
                      onChange={(e) => setNewHCOForm({ ...newHCOForm, codigoHCO: e.target.value })}
                      placeholder="ej. HCO-45891234"
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white font-mono font-bold focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1">Fecha de Apertura:</label>
                    <input
                      type="date"
                      value={newHCOForm.fechaApertura}
                      onChange={(e) => setNewHCOForm({ ...newHCOForm, fechaApertura: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white font-mono focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>
              </div>

              {/* Initial Vital Signs */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                <label className="text-xs font-bold text-sky-400 block">
                  2. Constantes Vitales & Somatometría Inicial:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  <div>
                    <span className="text-[10px] text-slate-400 block mb-0.5">P. Arterial (PA):</span>
                    <input
                      type="text"
                      value={newHCOForm.pa}
                      onChange={(e) => setNewHCOForm({ ...newHCOForm, pa: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1 text-xs text-white font-mono"
                      placeholder="120/80 mmHg"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block mb-0.5">F. Cardíaca (FC):</span>
                    <input
                      type="number"
                      value={newHCOForm.fc}
                      onChange={(e) => setNewHCOForm({ ...newHCOForm, fc: Number(e.target.value) })}
                      className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1 text-xs text-white font-mono"
                      placeholder="72 LPM"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block mb-0.5">F. Resp. (FR):</span>
                    <input
                      type="number"
                      value={newHCOForm.fr}
                      onChange={(e) => setNewHCOForm({ ...newHCOForm, fr: Number(e.target.value) })}
                      className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1 text-xs text-white font-mono"
                      placeholder="16 RPM"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block mb-0.5">Temperatura (°C):</span>
                    <input
                      type="number"
                      step="0.1"
                      value={newHCOForm.temperatura}
                      onChange={(e) => setNewHCOForm({ ...newHCOForm, temperatura: Number(e.target.value) })}
                      className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1 text-xs text-white font-mono"
                      placeholder="36.5"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block mb-0.5">Saturación O2 (%):</span>
                    <input
                      type="number"
                      value={newHCOForm.saturacionO2}
                      onChange={(e) => setNewHCOForm({ ...newHCOForm, saturacionO2: Number(e.target.value) })}
                      className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1 text-xs text-white font-mono"
                      placeholder="98"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block mb-0.5">IMC (kg/m²):</span>
                    <input
                      type="number"
                      step="0.1"
                      value={newHCOForm.imc}
                      onChange={(e) => setNewHCOForm({ ...newHCOForm, imc: Number(e.target.value) })}
                      className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1 text-xs text-white font-mono"
                      placeholder="24.2"
                    />
                  </div>
                </div>
              </div>

              {/* Initial Personal Antecedents */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                <label className="text-xs font-bold text-amber-400 block">
                  3. Antecedentes Personales Iniciales:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <span className="text-[10px] text-slate-400 block mb-0.5">Patologías:</span>
                    <input
                      type="text"
                      value={newHCOForm.patologicas}
                      onChange={(e) => setNewHCOForm({ ...newHCOForm, patologicas: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-white"
                      placeholder="Gastritis, HTA, etc."
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block mb-0.5">Alergias:</span>
                    <input
                      type="text"
                      value={newHCOForm.alergias}
                      onChange={(e) => setNewHCOForm({ ...newHCOForm, alergias: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-white"
                      placeholder="Penicilina, etc."
                    />
                  </div>
                </div>
              </div>

              {/* Initial Occupational Antecedent */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                <label className="text-xs font-bold text-amber-400 block">
                  4. Antecedente Ocupacional Anterior:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <div>
                    <span className="text-[10px] text-slate-400 block mb-0.5">Empresa Anterior:</span>
                    <input
                      type="text"
                      value={newHCOForm.empresaAnterior}
                      onChange={(e) => setNewHCOForm({ ...newHCOForm, empresaAnterior: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-white"
                      placeholder="Empresa contratista"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block mb-0.5">Puesto Anterior:</span>
                    <input
                      type="text"
                      value={newHCOForm.puestoAnterior}
                      onChange={(e) => setNewHCOForm({ ...newHCOForm, puestoAnterior: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-white"
                      placeholder="Puesto de trabajo"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block mb-0.5">Años de Exposición:</span>
                    <input
                      type="number"
                      value={newHCOForm.tiempoAnos}
                      onChange={(e) => setNewHCOForm({ ...newHCOForm, tiempoAnos: Number(e.target.value) })}
                      className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-white"
                    />
                  </div>
                </div>
              </div>

              {/* Initial Observations */}
              <div>
                <label className="text-[10px] text-slate-400 block mb-1">Observaciones Médicas de Apertura:</label>
                <textarea
                  rows={2}
                  value={newHCOForm.observacionesMedicas}
                  onChange={(e) => setNewHCOForm({ ...newHCOForm, observacionesMedicas: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="p-4 sm:p-5 border-t border-slate-800 flex items-center justify-end gap-3 shrink-0 bg-slate-900">
              <button
                type="button"
                onClick={() => setShowNewHCOModal(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-semibold"
              >
                Cancelar
              </button>

              <button
                type="button"
                onClick={handleCreateNewHCO}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold flex items-center gap-2 shadow-lg shadow-emerald-900/40"
              >
                <UserPlus className="w-4 h-4" /> Abrir y Crear Historia Clínica
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: REGISTRAR / EDITAR CONTROL POSTERIOR */}
      {showControlModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col p-6 shadow-2xl text-slate-100 space-y-5">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/20">
                  <Activity className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">
                    {editingControlIndex !== null 
                      ? `Editar Control ${editingControlIndex + 1}` 
                      : `Registrar Control ${(hco.controlesPosteriores || []).length + 1}`}
                  </h3>
                  <p className="text-xs text-slate-400">
                    Seguimiento de constantes vitales y Exámenes de Laboratorio • Expediente {hco.codigoHCO}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowControlModal(false)}
                className="p-1.5 bg-slate-800 text-slate-400 hover:text-white rounded-lg border border-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-4 text-xs pr-2">
              {/* Fecha, Motivo y Médico */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-950 p-4 rounded-xl border border-slate-800">
                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">Fecha del Control:</label>
                  <input
                    type="date"
                    value={controlForm.fecha}
                    onChange={(e) => setControlForm({ ...controlForm, fecha: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white font-mono focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">Motivo / Tipo de Control (Manual o Elegir):</label>
                  <input
                    type="text"
                    list="opciones-motivo-control"
                    value={controlForm.motivoControl || ''}
                    onChange={(e) => setControlForm({ ...controlForm, motivoControl: e.target.value })}
                    placeholder="Escriba o seleccione el motivo..."
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                  <datalist id="opciones-motivo-control">
                    <option value="Control 1" />
                    <option value="Control 2" />
                    <option value="Control 3" />
                    <option value="Control 4" />
                    <option value="Control de Signos Vitales" />
                    <option value="Control Médico Ocupacional" />
                    <option value="Exámenes de Laboratorio" />
                    <option value="Seguimiento Clínico" />
                    <option value="Evaluación de Retorno Laboral" />
                  </datalist>
                </div>

                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">Médico / Evaluador:</label>
                  <input
                    type="text"
                    value={controlForm.medicoAtendio || ''}
                    onChange={(e) => setControlForm({ ...controlForm, medicoAtendio: e.target.value })}
                    placeholder="ej. Dr. Alejandro Morales"
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Signos Vitales del Control */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
                <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-2">
                  <Activity className="w-4 h-4" /> Control de Signos Vitales
                </h4>

                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1">Presión Arterial (PA):</label>
                    <input
                      type="text"
                      value={controlForm.signosVitales.pa}
                      onChange={(e) => setControlForm({
                        ...controlForm,
                        signosVitales: { ...controlForm.signosVitales, pa: e.target.value }
                      })}
                      placeholder="120/80 mmHg"
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white font-mono focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1">Frecuencia Cardíaca:</label>
                    <input
                      type="number"
                      value={controlForm.signosVitales.fc}
                      onChange={(e) => setControlForm({
                        ...controlForm,
                        signosVitales: { ...controlForm.signosVitales, fc: Number(e.target.value) }
                      })}
                      placeholder="72 LPM"
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white font-mono focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1">Frec. Respiratoria:</label>
                    <input
                      type="number"
                      value={controlForm.signosVitales.fr}
                      onChange={(e) => setControlForm({
                        ...controlForm,
                        signosVitales: { ...controlForm.signosVitales, fr: Number(e.target.value) }
                      })}
                      placeholder="16 RPM"
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white font-mono focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1">Saturación O2 (%):</label>
                    <input
                      type="number"
                      value={controlForm.signosVitales.saturacionO2}
                      onChange={(e) => setControlForm({
                        ...controlForm,
                        signosVitales: { ...controlForm.signosVitales, saturacionO2: Number(e.target.value) }
                      })}
                      placeholder="98 %"
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white font-mono focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div className="col-span-2 sm:col-span-1">
                    <label className="text-[10px] text-slate-400 block mb-1">Temperatura (°C):</label>
                    <input
                      type="number"
                      step="0.1"
                      value={controlForm.signosVitales.temperatura}
                      onChange={(e) => setControlForm({
                        ...controlForm,
                        signosVitales: { ...controlForm.signosVitales, temperatura: Number(e.target.value) }
                      })}
                      placeholder="36.5 °C"
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white font-mono focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>
              </div>

              {/* Exámenes de Laboratorio en el Control */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-2">
                    <FlaskConical className="w-4 h-4" /> Exámenes de Laboratorio
                  </h4>
                  <button
                    type="button"
                    onClick={handleAddLabExamToControl}
                    className="text-xs px-2.5 py-1 bg-indigo-500/20 text-indigo-300 hover:bg-indigo-500/30 border border-indigo-500/30 rounded flex items-center gap-1 font-semibold"
                  >
                    <Plus className="w-3.5 h-3.5" /> Agregar Examen de Laboratorio
                  </button>
                </div>

                <div className="space-y-2">
                  {controlForm.examenesLaboratorio && controlForm.examenesLaboratorio.length > 0 ? (
                    controlForm.examenesLaboratorio.map((lab, idx) => (
                      <div key={lab.id} className="bg-slate-900 p-3 rounded-xl border border-slate-800 grid grid-cols-1 sm:grid-cols-4 gap-2 items-center">
                        <div>
                          <label className="text-[10px] text-slate-400 block mb-0.5">Nombre del Examen:</label>
                          <input
                            type="text"
                            value={lab.nombreExamen}
                            onChange={(e) => {
                              const labs = [...(controlForm.examenesLaboratorio || [])];
                              labs[idx].nombreExamen = e.target.value;
                              setControlForm({ ...controlForm, examenesLaboratorio: labs });
                            }}
                            className="w-full bg-slate-950 border border-slate-700 rounded px-2 py-1 text-xs text-white font-semibold"
                            placeholder="Hemograma, Glucosa, etc."
                          />
                        </div>

                        <div>
                          <label className="text-[10px] text-slate-400 block mb-0.5">Resultado Obtención:</label>
                          <input
                            type="text"
                            value={lab.resultado}
                            onChange={(e) => {
                              const labs = [...(controlForm.examenesLaboratorio || [])];
                              labs[idx].resultado = e.target.value;
                              setControlForm({ ...controlForm, examenesLaboratorio: labs });
                            }}
                            className="w-full bg-slate-950 border border-slate-700 rounded px-2 py-1 text-xs text-white font-mono"
                            placeholder="ej. 92 mg/dL"
                          />
                        </div>

                        <div>
                          <label className="text-[10px] text-slate-400 block mb-0.5">Valores Referenciales:</label>
                          <input
                            type="text"
                            value={lab.valoresReferencia || ''}
                            onChange={(e) => {
                              const labs = [...(controlForm.examenesLaboratorio || [])];
                              labs[idx].valoresReferencia = e.target.value;
                              setControlForm({ ...controlForm, examenesLaboratorio: labs });
                            }}
                            className="w-full bg-slate-950 border border-slate-700 rounded px-2 py-1 text-xs text-white"
                            placeholder="ej. 70-100 mg/dL"
                          />
                        </div>

                        <div className="flex items-center gap-2">
                          <div className="flex-1">
                            <label className="text-[10px] text-slate-400 block mb-0.5">Observación / Conclusión:</label>
                            <input
                              type="text"
                              value={lab.observacion || ''}
                              onChange={(e) => {
                                const labs = [...(controlForm.examenesLaboratorio || [])];
                                labs[idx].observacion = e.target.value;
                                setControlForm({ ...controlForm, examenesLaboratorio: labs });
                              }}
                              className="w-full bg-slate-950 border border-slate-700 rounded px-2 py-1 text-xs text-white"
                              placeholder="ej. Normal / Dentro de rango"
                            />
                          </div>

                          <button
                            type="button"
                            onClick={() => handleRemoveLabExamFromControl(lab.id)}
                            className="p-1.5 text-slate-400 hover:text-rose-400 rounded shrink-0 self-end mb-0.5"
                            title="Eliminar examen"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-slate-500 text-xs italic">Sin exámenes de laboratorio adjuntos a este control.</p>
                  )}
                </div>
              </div>

              {/* Observación / Evaluación del Control */}
              <div>
                <label className="text-[10px] text-slate-400 block mb-1 font-semibold">Observación y Evaluación Clínica del Control:</label>
                <textarea
                  rows={3}
                  value={controlForm.observacionControl || ''}
                  onChange={(e) => setControlForm({ ...controlForm, observacionControl: e.target.value })}
                  placeholder="Escriba las recomendaciones clínicas, evolución de presión arterial o seguimiento de laboratorio..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowControlModal(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-semibold"
              >
                Cancelar
              </button>

              <button
                type="button"
                onClick={handleSaveControl}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold flex items-center gap-2 shadow-lg shadow-emerald-900/40"
              >
                <Save className="w-4 h-4" /> Guardar Control Médico
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PDF PREVIEW MODAL */}
      {showPreviewModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-5xl h-[90vh] flex flex-col p-5 shadow-2xl text-slate-100">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-emerald-400" />
                <div>
                  <h3 className="text-sm font-bold text-white">
                    Visor de Historia Clínica: {hco.codigoHCO}
                  </h3>
                  <p className="text-[10px] text-slate-400">
                    {trabajador?.nombres} {trabajador?.apellidoPaterno} - {empresa?.razonSocial}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleDownloadPdf}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-emerald-900/40"
                >
                  <Download className="w-4 h-4" /> Descargar Archivo
                </button>

                <button
                  onClick={() => setShowPreviewModal(false)}
                  className="p-1.5 bg-slate-800 text-slate-400 hover:text-white rounded-lg border border-slate-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body / iFrame Viewer */}
            <div className="flex-1 my-3 bg-slate-950 rounded-xl overflow-hidden border border-slate-800 relative flex flex-col">
              {hco.archivoPdf?.dataUrl ? (
                <iframe
                  src={hco.archivoPdf.dataUrl}
                  className="w-full h-full bg-white rounded-xl"
                  title="Visor PDF Historia Clínica"
                />
              ) : (
                <div className="p-8 flex flex-col items-center justify-center h-full text-center space-y-3">
                  <FileText className="w-12 h-12 text-slate-600" />
                  <div className="text-slate-300 font-bold text-sm">Sin PDF adjunto generado</div>
                  <button
                    onClick={handleGenerateOfficialPdf}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold flex items-center gap-2"
                  >
                    <Sparkles className="w-4 h-4 text-amber-300" /> Generar Documento PDF Oficial
                  </button>
                </div>
              )}
            </div>

            <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <span>Ley N° 29733 / R.M. 312-2011-MINSA • Expediente de Historia Clínica Digitalizado</span>
              <button
                onClick={() => setShowPreviewModal(false)}
                className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg"
              >
                Cerrar Visor
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HistoriaClinicaModule;
