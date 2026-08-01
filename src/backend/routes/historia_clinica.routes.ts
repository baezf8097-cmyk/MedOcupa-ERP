import { Router } from 'express';
import { getHistoriasClinicas, createHistoriaClinica, updateHistoriaClinica } from '../modules/historia_clinica/historia_clinica.controller';
import { authenticateToken } from '../middleware/auth.middleware';
import { authorize } from '../middleware/authRole.middleware';

const router = Router();

router.use(authenticateToken);

router.get('/', authorize('historia_clinica', 'leer'), getHistoriasClinicas);
router.post('/', authorize('historia_clinica', 'crear'), createHistoriaClinica);
router.put('/:id', authorize('historia_clinica', 'editar'), updateHistoriaClinica);

export default router;
