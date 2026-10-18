import { Router } from 'express';
import { registerCustomer, loginCustomer, registerStaff, loginStaff } from "./user.controller.ts";

const router = Router();

router.post('/register/customer', registerCustomer);
router.post('/login/customer', loginCustomer);
router.post('/register/staff', registerStaff);
router.post('/login/staff', loginStaff);

export default router;