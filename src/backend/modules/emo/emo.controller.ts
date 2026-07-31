import { Request, Response } from 'express';
import { getStore, saveStore } from '../../data/dbStore';
import { EstadoEMO } from '../../../types/erp';

interface EMOExamCreateInput {
  codigoEMO?: string;
  trabajadorId: string;
  empresaId: string;
  tipoEMO: 'INGRESO' | 'PERIODICO' | 'RETIRO' | 'REUBICACION' | 'POST_INCAPACIDAD';
  fechaProgramada: string;
  protocoloAplicado?: string;
  costoEMO?: number;
  evaluaciones?: any;
}

interface AptitudUpdateInput {
  resultado: 'APTO' | 'APTO_CON_RESTRICCIONES' | 'NO_APTO' | 'EVALUADO_NO_CONCLUIDO';
  fechaEmision: string;
  fechaVencimiento: string;
  restricciones: string[];
  recomendaciones: string[];
  vigilanciaSugerida?: string[];
  medicoFirmante: string;
  cmpFirmante: string;
}

export const getEMOs = async (req: Request, res: Response) => {
  try {
    const store = getStore();
    const { empresaId, trabajadorId, estado } = req.query;

    let filtered = [...store.emos];

    if (empresaId && typeof empresaId === 'string' && empresaId !== 'TODAS') {
      filtered = filtered.filter((e) => e.empresaId === empresaId);
    }

    if (trabajadorId && typeof trabajadorId === 'string') {
      filtered = filtered.filter((e) => e.trabajadorId === trabajadorId);
    }

    if (estado && typeof estado === 'string') {
      filtered = filtered.filter((e) => e.estado === estado);
    }

    return res.status(200).json({
      success: true,
      data: filtered,
      total: filtered.length
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: 'Error al obtener la lista de Exámenes Médicos Ocupacionales',
      error: error.message || String(error)
    });
  }
};

export const createEMO = async (req: Request, res: Response) => {
  try {
    const store = getStore();
    const body: EMOExamCreateInput = req.body;

    if (!body || typeof body !== 'object') {
      return res.status(400).json({
        success: false,
        message: 'Cuerpo de la petición (JSON) inválido'
      });
    }

    if (!body.trabajadorId || !body.empresaId || !body.tipoEMO) {
      return res.status(400).json({
        success: false,
        message: 'Faltan campos obligatorios: trabajadorId, empresaId, tipoEMO'
      });
    }

    const estadoProgramado: EstadoEMO = 'PROGRAMADO';

    const newEMO = {
      id: `emo-${Date.now()}`,
      codigoEMO: body.codigoEMO || `EMO-2026-${Math.floor(100 + Math.random() * 900)}`,
      trabajadorId: body.trabajadorId,
      empresaId: body.empresaId,
      tipoEMO: body.tipoEMO,
      fechaProgramada: body.fechaProgramada || new Date().toISOString().split('T')[0],
      estado: estadoProgramado,
      protocoloAplicado: body.protocoloAplicado || 'R.M. 312-2011-MINSA / Estándar Ocupacional',
      costoEMO: body.costoEMO || 180,
      evaluaciones: body.evaluaciones || {
        triaje: true,
        medicinaGeneral: true,
        audiometria: true,
        espirometria: true,
        radiografiaOIT: false,
        laboratorio: true,
        psicologia: true,
        oftalmologia: true,
        electrocardiograma: false
      }
    };

    store.emos.unshift(newEMO);
    saveStore(store);

    return res.status(201).json({
      success: true,
      message: 'Examen Médico Ocupacional registrado y programado exitosamente',
      data: newEMO
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: 'Error al registrar el Examen Médico Ocupacional',
      error: error.message || String(error)
    });
  }
};

export const updateDictamenAptitud = async (req: Request, res: Response) => {
  try {
    const store = getStore();
    const { id } = req.params;
    const body: AptitudUpdateInput = req.body;

    if (!body || typeof body !== 'object') {
      return res.status(400).json({
        success: false,
        message: 'Cuerpo de la petición (JSON) inválido'
      });
    }

    if (!body.resultado || !body.medicoFirmante || !body.cmpFirmante) {
      return res.status(400).json({
        success: false,
        message: 'Faltan campos requeridos en el dictamen: resultado, medicoFirmante, cmpFirmante'
      });
    }

    const index = store.emos.findIndex((e) => e.id === id || e.codigoEMO === id);

    if (index === -1) {
      return res.status(404).json({
        success: false,
        message: `No se encontró el examen EMO con ID o código: ${id}`
      });
    }

    const fechaHoy = new Date().toISOString().split('T')[0];
    const fechaVenc = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    const dictamenAptitud = {
      resultado: body.resultado,
      fechaEmision: body.fechaEmision || fechaHoy,
      fechaVencimiento: body.fechaVencimiento || fechaVenc,
      restricciones: body.restricciones || [],
      recomendaciones: body.recomendaciones || [],
      vigilanciaSugerida: body.vigilanciaSugerida || ['Vigilancia Epidemiológica Regular'],
      medicoFirmante: body.medicoFirmante,
      cmpFirmante: body.cmpFirmante
    };

    store.emos[index] = {
      ...store.emos[index],
      estado: 'CERTIFICADO_EMITIDO' as EstadoEMO,
      fechaRealizada: fechaHoy,
      aptitud: dictamenAptitud
    };

    saveStore(store);

    return res.status(200).json({
      success: true,
      message: 'Dictamen de aptitud registrado exitosamente y certificado emitido',
      data: store.emos[index]
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: 'Error al emitir el dictamen de aptitud médica',
      error: error.message || String(error)
    });
  }
};
