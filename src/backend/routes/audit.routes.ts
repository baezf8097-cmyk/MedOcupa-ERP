import { Router } from 'express';
import { getAuditLogs, createAuditLog } from '../modules/audit/audit.controller';
import { authenticateToken } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticateToken);

router.get('/', getAuditLogs);
router.post('/', createAuditLog);

export default router;
