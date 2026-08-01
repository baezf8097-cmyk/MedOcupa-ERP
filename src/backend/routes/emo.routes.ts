import { Router } from 'express';
import { getEMOs, createEMO, updateDictamenAptitud } from '../modules/emo/emo.controller';
import { authenticateToken } from '../middleware/auth.middleware';
import { authorize } from '../middleware/authRole.middleware';

const router = Router();

router.use(authenticateToken);

// GET /api/emos - Lista EMOs con filtros
router.get('/', authorize('emo', 'leer'), getEMOs);

// POST /api/emos - Registrar nuevo EMO
router.post('/', authorize('emo', 'crear'), createEMO);

// PUT /api/emos/:id/aptitud - Dictaminar aptitud y emitir certificado
router.put('/:id/aptitud', authorize('emo', 'editar'), updateDictamenAptitud);

export default router;
