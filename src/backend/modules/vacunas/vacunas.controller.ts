import { Request, Response } from 'express';
import { getStore, saveStore } from '../../data/dbStore';

export const getVacunas = async (req: Request, res: Response) => {
  try {
    const store = getStore();
    const { trabajadorId } = req.query;

    let filtered = [...store.vacunas];
    if (trabajadorId && typeof trabajadorId === 'string') {
      filtered = filtered.filter(v => v.trabajadorId === trabajadorId);
    }

    return res.status(200).json({
      success: true,
      data: filtered,
      total: filtered.length
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Error al obtener registro de vacunas', error: error.message });
  }
};

export const createVacuna = async (req: Request, res: Response) => {
  try {
    const store = getStore();
    const body = req.body;

    if (!body || !body.trabajadorId || !body.vacunaNombre) {
      return res.status(400).json({ success: false, message: 'Faltan campos requeridos: trabajadorId, vacunaNombre' });
    }

    const newVacuna = {
      id: `vac-${Date.now()}`,
      trabajadorId: body.trabajadorId,
      vacunaNombre: body.vacunaNombre,
      dosisNumero: body.dosisNumero || 1,
      fechaAplicacion: body.fechaAplicacion || new Date().toISOString().split('T')[0],
      lote: body.lote || 'LOTE-DEFAULT',
      laboratorio: body.laboratorio || 'MINSA / ESSALUD',
      aplicada: body.aplicada ?? true,
      tieneProximoRefuerzo: body.tieneProximoRefuerzo ?? false,
      proximaDosisFecha: body.proximaDosisFecha || '',
      observaciones: body.observaciones || '',
      aplicadoPor: body.aplicadoPor || 'Lic. Enfermería Ocupacional'
    };

    store.vacunas.unshift(newVacuna);
    saveStore(store);

    return res.status(201).json({ success: true, message: 'Inmunización registrada exitosamente', data: newVacuna });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Error al registrar vacuna', error: error.message });
  }
};
