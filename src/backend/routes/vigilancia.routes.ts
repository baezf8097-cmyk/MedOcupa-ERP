import { Router } from 'express';
import { getProgramasVigilancia, createProgramaVigilancia, updateProgramaVigilancia } from '../modules/vigilancia/vigilancia.controller';
import { authenticateToken } from '../middleware/auth.middleware';
import { authorize } from '../middleware/authRole.middleware';

const router = Router();

router.use(authenticateToken);

router.get('/', authorize('vigilancia', 'leer'), getProgramasVigilancia);
router.post('/', authorize('vigilancia', 'crear'), createProgramaVigilancia);
router.put('/:id', authorize('vigilancia', 'editar'), updateProgramaVigilancia);

export default router;
