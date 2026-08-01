import { Router } from 'express';
import { getEmpresas, createEmpresa, updateEmpresa, deleteEmpresa } from '../modules/empresas/empresas.controller';
import { authenticateToken } from '../middleware/auth.middleware';
import { authorize } from '../middleware/authRole.middleware';

const router = Router();

router.use(authenticateToken);

router.get('/', authorize('empresas', 'leer'), getEmpresas);
router.post('/', authorize('empresas', 'crear'), createEmpresa);
router.put('/:id', authorize('empresas', 'editar'), updateEmpresa);
router.delete('/:id', authorize('empresas', 'eliminar'), deleteEmpresa);

export default router;
