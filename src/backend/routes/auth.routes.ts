import { Router } from 'express';
import { login, getMe, updateProfile, getAllUsers, updateUserById } from '../modules/auth/auth.controller';
import { authenticateToken } from '../middleware/auth.middleware';

const router = Router();

router.post('/login', login);
router.get('/me', authenticateToken, getMe);
router.put('/profile', authenticateToken, updateProfile);
router.get('/users', authenticateToken, getAllUsers);
router.put('/users/:id', authenticateToken, updateUserById);

export default router;
