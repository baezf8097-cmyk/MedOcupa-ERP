import { Request, Response } from 'express';
import { getStore, saveStore } from '../../data/dbStore';

export const getAusentismos = async (req: Request, res: Response) => {
  try {
    const store = getStore();
    const { empresaId, trabajadorId } = req.query;

    let filtered = [...store.ausentismos];
    if (empresaId && typeof empresaId === 'string' && empresaId !== 'TODAS') {
      filtered = filtered.filter(a => a.empresaId === empresaId);
    }
    if (trabajadorId && typeof trabajadorId === 'string') {
      filtered = filtered.filter(a => a.trabajadorId === trabajadorId);
    }

    return res.status(200).json({
      success: true,
      data: filtered,
      total: filtered.length
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Error al obtener registros de ausentismo', error: error.message });
  }
};

export const createAusentismo = async (req: Request, res: Response) => {
  try {
    const store = getStore();
    const body = req.body;

    if (!body || !body.trabajadorId || !body.empresaId || !body.codigoCIE10) {
      return res.status(400).json({ success: false, message: 'Faltan campos requeridos: trabajadorId, empresaId, codigoCIE10' });
    }

    const newAusentismo = {
      id: `aus-${Date.now()}`,
      trabajadorId: body.trabajadorId,
      empresaId: body.empresaId,
      tipoAusencia: body.tipoAusencia || 'ENFERMEDAD_COMUN',
      codigoCIE10: body.codigoCIE10,
      descripcionCIE10: body.descripcionCIE10 || 'Diagnóstico Médico',
      fechaInicio: body.fechaInicio || new Date().toISOString().split('T')[0],
      fechaFin: body.fechaFin || new Date().toISOString().split('T')[0],
      diasTotales: body.diasTotales || 1,
      centroMedicoEmisor: body.centroMedicoEmisor || 'EsSalud / Clínica Privada',
      medicoTratante: body.medicoTratante || 'Médico Tratante',
      cmpMedicoTratante: body.cmpMedicoTratante || 'CMP 00000',
      montoSubsidioEstimado: body.montoSubsidioEstimado || 0
    };

    store.ausentismos.unshift(newAusentismo);
    saveStore(store);

    return res.status(201).json({ success: true, message: 'Registro de descanso médico / ausentismo guardado exitosamente', data: newAusentismo });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Error al registrar ausentismo', error: error.message });
  }
};

export const updateAusentismo = async (req: Request, res: Response) => {
  try {
    const store = getStore();
    const { id } = req.params;
    const body = req.body;

    const index = store.ausentismos.findIndex(a => a.id === id);
    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Registro de ausentismo no encontrado' });
    }

    store.ausentismos[index] = {
      ...store.ausentismos[index],
      ...body
    };

    saveStore(store);

    return res.status(200).json({
      success: true,
      message: 'Registro de ausentismo actualizado exitosamente',
      data: store.ausentismos[index]
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Error al actualizar ausentismo', error: error.message });
  }
};
