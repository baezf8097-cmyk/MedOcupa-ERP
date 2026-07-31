import { Router } from 'express';
import { getTrabajadores, createTrabajador, updateTrabajador, deleteTrabajador } from '../modules/trabajadores/trabajadores.controller';
import { authenticateToken } from '../middleware/auth.middleware';
import { authorize } from '../middleware/authRole.middleware';

const router = Router();

router.use(authenticateToken);

router.get('/', authorize('trabajadores', 'leer'), getTrabajadores);
router.post('/', authorize('trabajadores', 'crear'), createTrabajador);
router.put('/:id', authorize('trabajadores', 'editar'), updateTrabajador);
router.delete('/:id', authorize('trabajadores', 'eliminar'), deleteTrabajador);

export default router;
