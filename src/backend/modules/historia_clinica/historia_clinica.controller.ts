import { Request, Response } from 'express';
import { getStore, saveStore } from '../../data/dbStore';

export const getHistoriasClinicas = async (req: Request, res: Response) => {
  try {
    const store = getStore();
    const { trabajadorId } = req.query;

    let filtered = [...store.historias];
    if (trabajadorId && typeof trabajadorId === 'string') {
      filtered = filtered.filter(h => h.trabajadorId === trabajadorId);
    }

    return res.status(200).json({
      success: true,
      data: filtered,
      total: filtered.length
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Error al obtener Historias Clínicas', error: error.message });
  }
};

export const createHistoriaClinica = async (req: Request, res: Response) => {
  try {
    const store = getStore();
    const body = req.body;

    if (!body || !body.trabajadorId) {
      return res.status(400).json({ success: false, message: 'Se requiere trabajadorId' });
    }

    const newHCO = {
      id: `hco-${Date.now()}`,
      trabajadorId: body.trabajadorId,
      codigoHCO: body.codigoHCO || `HCO-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      fechaApertura: body.fechaApertura || new Date().toISOString().split('T')[0],
      antecedentesPersonales: body.antecedentesPersonales || {
        patologicas: [],
        quirurgicas: [],
        alergias: [],
        habitosNocivos: 'Ninguno'
      },
      antecedentesOcupacionales: body.antecedentesOcupacionales || [],
      constantesVitalesMasRecientes: body.constantesVitalesMasRecientes || {
        pa: '120/80',
        fc: 72,
        fr: 16,
        temperatura: 36.5,
        imc: 23.5,
        saturacionO2: 98
      },
      controlesPosteriores: body.controlesPosteriores || [],
      diagnosticosCIE10: body.diagnosticosCIE10 || [],
      observacionesMedicas: body.observacionesMedicas || ''
    };

    store.historias.unshift(newHCO);
    saveStore(store);

    return res.status(201).json({ success: true, message: 'Historia Clínica aperturada exitosamente', data: newHCO });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Error al aperturar Historia Clínica', error: error.message });
  }
};

export const updateHistoriaClinica = async (req: Request, res: Response) => {
  try {
    const store = getStore();
    const { id } = req.params;
    const body = req.body;

    const index = store.historias.findIndex(h => h.id === id || h.trabajadorId === id);
    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Historia Clínica no encontrada' });
    }

    store.historias[index] = {
      ...store.historias[index],
      ...body
    };

    saveStore(store);
    return res.status(200).json({ success: true, message: 'Historia Clínica actualizada exitosamente', data: store.historias[index] });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Error al actualizar Historia Clínica', error: error.message });
  }
};
