import { Request, Response } from 'express';
import { getStore, saveStore } from '../../data/dbStore';
import { Trabajador } from '../../../types/erp';

export const getTrabajadores = async (req: Request, res: Response) => {
  try {
    const store = getStore();
    const { empresaId } = req.query;

    let filtered = [...store.trabajadores];
    if (empresaId && typeof empresaId === 'string' && empresaId !== 'TODAS') {
      filtered = filtered.filter(t => t.empresaId === empresaId);
    }

    return res.status(200).json({
      success: true,
      data: filtered,
      total: filtered.length
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: 'Error al obtener trabajadores',
      error: error.message || String(error)
    });
  }
};

export const createTrabajador = async (req: Request, res: Response) => {
  try {
    const store = getStore();
    const body = req.body;

    if (!body || !body.numeroDocumento || !body.nombres || !body.empresaId) {
      return res.status(400).json({
        success: false,
        message: 'Faltan campos requeridos: numeroDocumento, nombres, empresaId'
      });
    }

    const newTrabajador: Trabajador = {
      id: `trab-${Date.now()}`,
      tipoDocumento: body.tipoDocumento || 'DNI',
      numeroDocumento: body.numeroDocumento,
      nombres: body.nombres,
      apellidoPaterno: body.apellidoPaterno || '',
      apellidoMaterno: body.apellidoMaterno || '',
      fechaNacimiento: body.fechaNacimiento || '1990-01-01',
      sexo: body.sexo || 'M',
      email: body.email || '',
      telefono: body.telefono || '',
      empresaId: body.empresaId,
      sedeId: body.sedeId || '',
      puestoTrabajo: body.puestoTrabajo || 'Operario',
      area: body.area || body.areaTrabajo || 'Operaciones',
      grupoOcupacional: body.grupoOcupacional || 'Técnico Ocupacional',
      fechaIngreso: body.fechaIngreso || new Date().toISOString().split('T')[0],
      estado: body.estado || 'ACTIVO',
      factoresRiesgo: body.factoresRiesgo || []
    };

    store.trabajadores.unshift(newTrabajador);
    saveStore(store);

    return res.status(201).json({
      success: true,
      message: 'Trabajador registrado exitosamente',
      data: newTrabajador
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: 'Error al registrar trabajador',
      error: error.message || String(error)
    });
  }
};

export const updateTrabajador = async (req: Request, res: Response) => {
  try {
    const store = getStore();
    const { id } = req.params;
    const body = req.body;

    const index = store.trabajadores.findIndex(t => t.id === id);
    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Trabajador no encontrado' });
    }

    store.trabajadores[index] = {
      ...store.trabajadores[index],
      ...body,
      id
    };

    saveStore(store);
    return res.status(200).json({
      success: true,
      message: 'Trabajador actualizado exitosamente',
      data: store.trabajadores[index]
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Error al actualizar trabajador', error: error.message });
  }
};

export const deleteTrabajador = async (req: Request, res: Response) => {
  try {
    const store = getStore();
    const { id } = req.params;

    const index = store.trabajadores.findIndex(t => t.id === id);
    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Trabajador no encontrado' });
    }

    store.trabajadores.splice(index, 1);
    saveStore(store);

    return res.status(200).json({
      success: true,
      message: 'Trabajador eliminado exitosamente'
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Error al eliminar trabajador', error: error.message });
  }
};
