import { Request, Response } from 'express';
import { getStore, saveStore } from '../../data/dbStore';

export const getAptitudes = async (req: Request, res: Response) => {
  try {
    const store = getStore();
    const { empresaId, trabajadorId } = req.query;

    let emosWithAptitud = store.emos.filter(e => e.aptitud);

    if (empresaId && typeof empresaId === 'string' && empresaId !== 'TODAS') {
      emosWithAptitud = emosWithAptitud.filter(e => e.empresaId === empresaId);
    }

    if (trabajadorId && typeof trabajadorId === 'string') {
      emosWithAptitud = emosWithAptitud.filter(e => e.trabajadorId === trabajadorId);
    }

    const aptitudes = emosWithAptitud.map(e => ({
      emoId: e.id,
      codigoEMO: e.codigoEMO,
      trabajadorId: e.trabajadorId,
      empresaId: e.empresaId,
      tipoEMO: e.tipoEMO,
      estadoEMO: e.estado,
      aptitud: e.aptitud
    }));

    return res.status(200).json({
      success: true,
      data: aptitudes,
      total: aptitudes.length
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Error al obtener aptitudes', error: error.message });
  }
};

export const updateAptitud = async (req: Request, res: Response) => {
  try {
    const store = getStore();
    const { id } = req.params; // emoId
    const body = req.body;

    const index = store.emos.findIndex(e => e.id === id || e.codigoEMO === id);
    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Registro de EMO/Aptitud no encontrado' });
    }

    const aptitudData = body.aptitud || body;

    store.emos[index].estado = 'CERTIFICADO_EMITIDO';
    store.emos[index].aptitud = {
      ...(store.emos[index].aptitud || {}),
      ...aptitudData
    } as any;

    saveStore(store);

    return res.status(200).json({
      success: true,
      message: 'Aptitud médica actualizada exitosamente',
      data: store.emos[index]
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Error al actualizar aptitud', error: error.message });
  }
};
