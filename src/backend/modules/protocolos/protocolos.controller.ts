import { Request, Response } from 'express';
import { getStore, saveStore } from '../../data/dbStore';

export const getProtocolos = async (req: Request, res: Response) => {
  try {
    const store = getStore();
    const { empresaId } = req.query;

    let filtered = [...store.protocolos];
    if (empresaId && typeof empresaId === 'string' && empresaId !== 'TODAS') {
      filtered = filtered.filter(p => !p.empresaId || p.empresaId === empresaId);
    }

    return res.status(200).json({
      success: true,
      data: filtered,
      total: filtered.length
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Error al obtener protocolos médicos ocupacionales', error: error.message });
  }
};

export const createProtocolo = async (req: Request, res: Response) => {
  try {
    const store = getStore();
    const body = req.body;

    if (!body || !body.nombreProtocolo || !body.codigoProtocolo) {
      return res.status(400).json({ success: false, message: 'Faltan campos requeridos: nombreProtocolo, codigoProtocolo' });
    }

    const newProtocolo = {
      id: `prot-${Date.now()}`,
      empresaId: body.empresaId || '',
      nombreProtocolo: body.nombreProtocolo,
      codigoProtocolo: body.codigoProtocolo,
      sectorActividad: body.sectorActividad || 'GENERAL',
      tipoEvaluacion: body.tipoEvaluacion || 'TODOS',
      normaLegalBase: body.normaLegalBase || 'R.M. 312-2011-MINSA Anexo 01',
      descripcionBateria: body.descripcionBateria || 'Batería médica estándar',
      estado: body.estado || 'ACTIVO',
      version: body.version || 'v1.0',
      fechaAprobacion: body.fechaAprobacion || new Date().toISOString().split('T')[0]
    };

    store.protocolos.unshift(newProtocolo);
    saveStore(store);

    return res.status(201).json({ success: true, message: 'Protocolo examen médico creado exitosamente', data: newProtocolo });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Error al crear protocolo', error: error.message });
  }
};

export const updateProtocolo = async (req: Request, res: Response) => {
  try {
    const store = getStore();
    const { id } = req.params;
    const body = req.body;

    const index = store.protocolos.findIndex(p => p.id === id);
    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Protocolo no encontrado' });
    }

    store.protocolos[index] = {
      ...store.protocolos[index],
      ...body
    };

    saveStore(store);

    return res.status(200).json({ success: true, message: 'Protocolo actualizado exitosamente', data: store.protocolos[index] });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Error al actualizar protocolo', error: error.message });
  }
};

export const deleteProtocolo = async (req: Request, res: Response) => {
  try {
    const store = getStore();
    const { id } = req.params;

    const index = store.protocolos.findIndex(p => p.id === id);
    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Protocolo no encontrado' });
    }

    store.protocolos.splice(index, 1);
    saveStore(store);

    return res.status(200).json({ success: true, message: 'Protocolo eliminado exitosamente' });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Error al eliminar protocolo', error: error.message });
  }
};
