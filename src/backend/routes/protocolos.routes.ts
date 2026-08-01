import { Router } from 'express';
import { getProtocolos, createProtocolo, updateProtocolo, deleteProtocolo } from '../modules/protocolos/protocolos.controller';
import { authenticateToken } from '../middleware/auth.middleware';
import { authorize } from '../middleware/authRole.middleware';

const router = Router();

router.use(authenticateToken);

router.get('/', authorize('protocolos', 'leer'), getProtocolos);
router.post('/', authorize('protocolos', 'crear'), createProtocolo);
router.put('/:id', authorize('protocolos', 'editar'), updateProtocolo);
router.delete('/:id', authorize('protocolos', 'eliminar'), deleteProtocolo);

export default router;
