import { Router } from 'express';
import { registerCustomer, loginCustomer, registerStaff, loginStaff, logout } from "./user.controller.ts";
import authenticate, { requireRoles } from '../../middlewares/auth.middleware.ts';

const router = Router();

router.post('/register/customer', registerCustomer);
router.post('/login/customer', loginCustomer);
router.post('/register/staff', authenticate, requireRoles("admin"), registerStaff);
router.post('/login/staff', loginStaff);
router.post('/logout', logout);

export default router;