import { Request, Response } from 'express';
import { getStore, saveStore } from '../../data/dbStore';

export const getEmpresas = async (req: Request, res: Response) => {
  try {
    const store = getStore();
    return res.status(200).json({
      success: true,
      data: store.empresas,
      total: store.empresas.length
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: 'Error al obtener lista de empresas',
      error: error.message || String(error)
    });
  }
};

export const createEmpresa = async (req: Request, res: Response) => {
  try {
    const store = getStore();
    const body = req.body;

    if (!body || !body.ruc || !body.razonSocial) {
      return res.status(400).json({
        success: false,
        message: 'Faltan campos requeridos: ruc, razonSocial'
      });
    }

    const newEmpresa = {
      id: `emp-${Date.now()}`,
      ruc: body.ruc,
      razonSocial: body.razonSocial,
      nombreComercial: body.nombreComercial || body.razonSocial,
      ciiu: body.ciiu || '7010',
      actividadEconomica: body.actividadEconomica || 'Actividad General',
      direccion: body.direccion || 'Dirección Principal',
      departamento: body.departamento || 'Lima',
      provincia: body.provincia || 'Lima',
      distrito: body.distrito || 'Lima',
      nivelRiesgoSCTR: body.nivelRiesgoSCTR || 'ALTO',
      totalTrabajadores: body.totalTrabajadores || 0,
      contactoNombre: body.contactoNombre || '',
      contactoEmail: body.contactoEmail || '',
      contactoTelefono: body.contactoTelefono || '',
      estado: body.estado || 'ACTIVA',
      sedes: body.sedes || []
    };

    store.empresas.unshift(newEmpresa);
    saveStore(store);

    return res.status(201).json({
      success: true,
      message: 'Empresa registrada exitosamente',
      data: newEmpresa
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: 'Error al registrar empresa',
      error: error.message || String(error)
    });
  }
};

export const updateEmpresa = async (req: Request, res: Response) => {
  try {
    const store = getStore();
    const { id } = req.params;
    const body = req.body;

    const index = store.empresas.findIndex(e => e.id === id);
    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Empresa no encontrada' });
    }

    store.empresas[index] = {
      ...store.empresas[index],
      ...body,
      id
    };

    saveStore(store);
    return res.status(200).json({
      success: true,
      message: 'Empresa actualizada exitosamente',
      data: store.empresas[index]
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Error al actualizar empresa', error: error.message });
  }
};

export const deleteEmpresa = async (req: Request, res: Response) => {
  try {
    const store = getStore();
    const { id } = req.params;

    const index = store.empresas.findIndex(e => e.id === id);
    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Empresa no encontrada' });
    }

    store.empresas.splice(index, 1);
    saveStore(store);

    return res.status(200).json({
      success: true,
      message: 'Empresa eliminada exitosamente'
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Error al eliminar empresa', error: error.message });
  }
};
