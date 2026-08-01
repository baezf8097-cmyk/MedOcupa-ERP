import { Request, Response } from 'express';
import { getStore, saveStore } from '../../data/dbStore';

export const getAccidentes = async (req: Request, res: Response) => {
  try {
    const store = getStore();
    const { empresaId } = req.query;

    let filtered = [...store.accidentes];
    if (empresaId && typeof empresaId === 'string' && empresaId !== 'TODAS') {
      filtered = filtered.filter(a => a.empresaId === empresaId);
    }

    return res.status(200).json({
      success: true,
      data: filtered,
      total: filtered.length
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Error al obtener registro de accidentes', error: error.message });
  }
};

export const createAccidente = async (req: Request, res: Response) => {
  try {
    const store = getStore();
    const body = req.body;

    if (!body || !body.empresaId || !body.descripcionHechos) {
      return res.status(400).json({ success: false, message: 'Faltan campos requeridos: empresaId, descripcionHechos' });
    }

    const newAccidente = {
      id: `acc-${Date.now()}`,
      codigoEvento: body.codigoEvento || `INC-2026-${Math.floor(100 + Math.random() * 900)}`,
      empresaId: body.empresaId,
      trabajadorId: body.trabajadorId || 'trab-1',
      trabajadorNombreCustom: body.trabajadorNombreCustom || '',
      trabajadorDniCustom: body.trabajadorDniCustom || '',
      tipo: body.tipo || 'ACCIDENTE_LEVE',
      fechaHora: body.fechaHora || new Date().toISOString(),
      lugarExacto: body.lugarExacto || 'Área Operativa',
      descripcionHechos: body.descripcionHechos,
      parteCuerpoAfectada: body.parteCuerpoAfectada || 'No especificada',
      diagnosticoCIE10: body.diagnosticoCIE10 || 'T14.9 Traumatismo no especificado',
      diasIncapacidad: body.diasIncapacidad || 0,
      notificadoMTPE: body.notificadoMTPE || false,
      codigoRegistroSAT: body.codigoRegistroSAT || '',
      causasRaiz: body.causasRaiz || [],
      medidasCorrectivas: body.medidasCorrectivas || [],
      estadoInvestigacion: body.estadoInvestigacion || 'EN_INVESTIGACION'
    };

    store.accidentes.unshift(newAccidente);
    saveStore(store);

    return res.status(201).json({ success: true, message: 'Accidente/Incidente registrado exitosamente', data: newAccidente });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Error al registrar accidente', error: error.message });
  }
};

export const updateAccidente = async (req: Request, res: Response) => {
  try {
    const store = getStore();
    const { id } = req.params;
    const body = req.body;

    const index = store.accidentes.findIndex(a => a.id === id);
    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Registro de accidente no encontrado' });
    }

    store.accidentes[index] = {
      ...store.accidentes[index],
      ...body
    };

    saveStore(store);

    return res.status(200).json({
      success: true,
      message: 'Registro de accidente actualizado exitosamente',
      data: store.accidentes[index]
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Error al actualizar accidente', error: error.message });
  }
};
