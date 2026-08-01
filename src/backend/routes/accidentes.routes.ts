import { Router } from 'express';
import { getAccidentes, createAccidente, updateAccidente } from '../modules/accidentes/accidentes.controller';
import { authenticateToken } from '../middleware/auth.middleware';
import { authorize } from '../middleware/authRole.middleware';

const router = Router();

router.use(authenticateToken);

router.get('/', authorize('accidentes', 'leer'), getAccidentes);
router.post('/', authorize('accidentes', 'crear'), createAccidente);
router.put('/:id', authorize('accidentes', 'editar'), updateAccidente);

export default router;
