import { Router } from 'express';
import { getReportesMinsa, createNotificacionSAT } from '../modules/reportes_minsa/reportes_minsa.controller';
import { authenticateToken } from '../middleware/auth.middleware';
import { authorize } from '../middleware/authRole.middleware';

const router = Router();

router.use(authenticateToken);

router.get('/', authorize('reportes_minsa', 'leer'), getReportesMinsa);
router.post('/sat', authorize('reportes_minsa', 'crear'), createNotificacionSAT);

export default router;
