import { Request, Response } from 'express';
import { getStore, saveStore } from '../../data/dbStore';

export const getProgramasVigilancia = async (req: Request, res: Response) => {
  try {
    const store = getStore();
    const { empresaId } = req.query;

    let filtered = [...store.programas];
    if (empresaId && typeof empresaId === 'string' && empresaId !== 'TODAS') {
      filtered = filtered.filter(p => p.empresaId === empresaId);
    }

    return res.status(200).json({
      success: true,
      data: filtered,
      total: filtered.length
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Error al obtener programas de vigilancia', error: error.message });
  }
};

export const createProgramaVigilancia = async (req: Request, res: Response) => {
  try {
    const store = getStore();
    const body = req.body;

    if (!body || !body.empresaId || !body.nombrePrograma) {
      return res.status(400).json({ success: false, message: 'Faltan campos requeridos: empresaId, nombrePrograma' });
    }

    const newPrograma = {
      id: `prog-${Date.now()}`,
      empresaId: body.empresaId,
      nombrePrograma: body.nombrePrograma,
      codigoPrograma: body.codigoPrograma || `PVE-2026-${Math.floor(100 + Math.random() * 900)}`,
      categoria: body.categoria || 'ESPECIFICO_EXPOSICION',
      descripcion: body.descripcion || 'Programa de vigilancia epidemiológica ocupacional',
      baseLegal: body.baseLegal || 'R.M. 312-2011-MINSA / Ley 29783',
      medicoResponsable: body.medicoResponsable || 'Médico Ocupacional MedOcupa',
      poblacionExpuestaTotal: body.poblacionExpuestaTotal || 50,
      trabajadoresEnVigilancia: body.trabajadoresEnVigilancia || 50,
      casosSospechosos: body.casosSospechosos || 0,
      casosConfirmados: body.casosConfirmados || 0,
      metaCumplimientoPorcentaje: body.metaCumplimientoPorcentaje || 95,
      avanceActualPorcentaje: body.avanceActualPorcentaje || 0,
      estado: body.estado || 'ACTIVO',
      capacitaciones: body.capacitaciones || []
    };

    store.programas.unshift(newPrograma);
    saveStore(store);

    return res.status(201).json({ success: true, message: 'Programa de vigilancia epidemiológica creado exitosamente', data: newPrograma });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Error al crear programa de vigilancia', error: error.message });
  }
};

export const updateProgramaVigilancia = async (req: Request, res: Response) => {
  try {
    const store = getStore();
    const { id } = req.params;
    const body = req.body;

    const index = store.programas.findIndex(p => p.id === id);
    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Programa de vigilancia no encontrado' });
    }

    store.programas[index] = {
      ...store.programas[index],
      ...body
    };

    saveStore(store);

    return res.status(200).json({
      success: true,
      message: 'Programa de vigilancia actualizado exitosamente',
      data: store.programas[index]
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Error al actualizar programa de vigilancia', error: error.message });
  }
};
