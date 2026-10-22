import { Router } from 'express';
import { registerCustomer, loginCustomer, registerStaff, loginStaff, logout, getStaffMe } from "./user.controller.ts";
import authenticate, { requireRoles, requireStaff } from '../../middlewares/auth.middleware.ts';

const router = Router();

router.post('/register/customer', registerCustomer);
router.post('/login/customer', loginCustomer);
router.post('/register/staff', authenticate, requireRoles("admin"), registerStaff);
router.post('/login/staff', loginStaff);
router.get('/me', authenticate, requireStaff, getStaffMe);
router.post('/logout', logout);

export default router;