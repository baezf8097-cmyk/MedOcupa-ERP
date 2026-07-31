import { Router } from 'express';
import { getAptitudes, updateAptitud } from '../modules/aptitud/aptitud.controller';
import { authenticateToken } from '../middleware/auth.middleware';
import { authorize } from '../middleware/authRole.middleware';

const router = Router();

router.use(authenticateToken);

router.get('/', authorize('aptitud', 'leer'), getAptitudes);
router.post('/', authorize('aptitud', 'editar'), (req, res, next) => {
  const emoId = req.body.emoId || req.body.id;
  if (emoId) {
    req.params.id = emoId;
    return updateAptitud(req, res);
  }
  return res.status(400).json({ success: false, message: 'Se requiere emoId' });
});
router.put('/:id', authorize('aptitud', 'editar'), updateAptitud);

export default router;
