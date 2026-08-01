import { Request, Response } from 'express';
import { getStore, saveStore } from '../../data/dbStore';

export const getReportesMinsa = async (req: Request, res: Response) => {
  try {
    const store = getStore();
    const { empresaId } = req.query;

    let emos = store.emos;
    let accidentes = store.accidentes;
    let ausentismos = store.ausentismos;

    if (empresaId && typeof empresaId === 'string' && empresaId !== 'TODAS') {
      emos = emos.filter(e => e.empresaId === empresaId);
      accidentes = accidentes.filter(a => a.empresaId === empresaId);
      ausentismos = ausentismos.filter(a => a.empresaId === empresaId);
    }

    const reportData = {
      anexo02Minsa: {
        totalEMOs: emos.length,
        aptos: emos.filter(e => e.aptitud?.resultado === 'APTO').length,
        aptosConRestriccion: emos.filter(e => e.aptitud?.resultado === 'APTO_CON_RESTRICCIONES').length,
        noAptos: emos.filter(e => e.aptitud?.resultado === 'NO_APTO').length,
        evaluadosNoConcluidos: emos.filter(e => e.aptitud?.resultado === 'EVALUADO_NO_CONCLUIDO').length
      },
      notificacionSAT24h: accidentes.filter(a => a.notificadoMTPE || a.tipo === 'ACCIDENTE_INCAPACITANTE' || a.tipo === 'ACCIDENTE_MORTAL'),
      estadisticasAusentismo: {
        totalDiasPerdidos: ausentismos.reduce((acc, a) => acc + (a.diasTotales || 0), 0),
        totalCasos: ausentismos.length
      }
    };

    return res.status(200).json({
      success: true,
      data: reportData
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Error al generar reportes MINSA/MTPE', error: error.message });
  }
};

export const createNotificacionSAT = async (req: Request, res: Response) => {
  try {
    const store = getStore();
    const body = req.body;

    if (!body || !body.accidenteId) {
      return res.status(400).json({ success: false, message: 'Se requiere accidenteId para la notificación SAT' });
    }

    const index = store.accidentes.findIndex(a => a.id === body.accidenteId);
    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Accidente no encontrado' });
    }

    store.accidentes[index].notificadoMTPE = true;
    store.accidentes[index].codigoRegistroSAT = body.codigoRegistroSAT || `SAT-MTPE-${Date.now()}`;

    saveStore(store);

    return res.status(200).json({
      success: true,
      message: 'Notificación SAT 24h ante el MTPE registrada exitosamente',
      data: store.accidentes[index]
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Error al registrar notificación SAT', error: error.message });
  }
};
