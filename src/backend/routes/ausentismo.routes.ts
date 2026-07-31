import { Router } from 'express';
import { getAusentismos, createAusentismo, updateAusentismo } from '../modules/ausentismo/ausentismo.controller';
import { authenticateToken } from '../middleware/auth.middleware';
import { authorize } from '../middleware/authRole.middleware';

const router = Router();

router.use(authenticateToken);

router.get('/', authorize('ausentismo', 'leer'), getAusentismos);
router.post('/', authorize('ausentismo', 'crear'), createAusentismo);
router.put('/:id', authorize('ausentismo', 'editar'), updateAusentismo);

export default router;
