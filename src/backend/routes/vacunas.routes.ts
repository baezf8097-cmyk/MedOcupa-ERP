import { Router } from 'express';
import { getVacunas, createVacuna } from '../modules/vacunas/vacunas.controller';
import { authenticateToken } from '../middleware/auth.middleware';
import { authorize } from '../middleware/authRole.middleware';

const router = Router();

router.use(authenticateToken);

router.get('/', authorize('vacunas', 'leer'), getVacunas);
router.post('/', authorize('vacunas', 'crear'), createVacuna);

export default router;
