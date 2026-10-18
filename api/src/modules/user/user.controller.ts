import type { Request, Response } from "express";
import { db } from '../../db/index.ts';
import { customers } from '../../db/schema/customers.ts';
import { staffUsers } from '../../db/schema/staff_user.ts';
import { getCustomerByEmail, getCustomerByPhone, getStaffUserByEmail } from "./user.repo.ts";
import * as bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;

async function registerCustomer(req: Request, res: Response) {
    const { name, email, password, phone } = req.body;
    try {
        if (!phone) {
            return res.status(400).json({ success: false, message: "Phone number is required" });
        }
        if (email) {
            const existingCustomer = await getCustomerByEmail(email);
            if (existingCustomer) {
                return res.status(400).json({ success: false, message: "Account with this email already exists" });
            }
        }
        const existingPhone = await getCustomerByPhone(phone);
        if (existingPhone) {
            return res.status(400).json({ success: false, message: "Account with this phone number already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const [result] = await db
            .insert(customers)
            .values({ name, email, phone, passwordHash: hashedPassword })
            .returning();

        if (!result) {
            return res.status(500).json({ success: false, message: "Failed to register customer" });
        }

        const token = jwt.sign({ id: result.id, type: "customer" }, JWT_SECRET, { expiresIn: "7d" });

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        const { passwordHash: _, ...safeUser } = result;
        res.json({ success: true, message: "Account created successfully", data: safeUser, token });
    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}

async function loginCustomer(req: Request, res: Response) {
    const { identifier, email, phone, password } = req.body;
    const loginTarget = identifier || email || phone;

    try {
        if (!loginTarget || !password) {
            return res.status(400).json({ success: false, message: "Email/Phone and password are required" });
        }

        let customer = await getCustomerByEmail(loginTarget);
        if (!customer) {
            customer = await getCustomerByPhone(loginTarget);
        }

        if (!customer) {
            return res.status(400).json({ success: false, message: "Invalid email/phone or password" });
        }

        if (!customer.passwordHash) {
            return res.status(400).json({ success: false, message: "Account password not set. Please contact support." });
        }

        const isPasswordValid = await bcrypt.compare(password, customer.passwordHash);
        if (!isPasswordValid) {
            return res.status(400).json({ success: false, message: "Invalid email/phone or password" });
        }

        const token = jwt.sign({ id: customer.id, type: "customer" }, JWT_SECRET, { expiresIn: "7d" });

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        const { passwordHash: _, ...safeUser } = customer;
        res.json({ success: true, message: "Logged in successfully", data: safeUser, token });
    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}

async function registerStaff(req: Request, res: Response){
    const { name, email, password, phone, role } = req.body;
    try {
        const existingStaffUser = await getStaffUserByEmail(email);
        if (existingStaffUser) {
            return res.status(400).json({ success: false, message: "Staff User already exists" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const [result] = await db
            .insert(staffUsers)
            .values({ name, email, passwordHash: hashedPassword, phone, role })
            .returning();
        
        if (!result) {
            return res.status(500).json({ success: false, message: "Failed to register staff user" });
        }

        const token = jwt.sign(
            { id: result.id, role: result.role, type: "staff" },
            JWT_SECRET,
            { expiresIn: "1d" }
        );

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 24 * 60 * 60 * 1000,
        });

        const { passwordHash: _, ...safeUser } = result;
        res.json({ success: true, message: "Staff User registered successfully", data: safeUser });
    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}

async function loginStaff(req: Request, res: Response) {
    const { email, password } = req.body;
    try {
        const existingStaffUser = await getStaffUserByEmail(email);
        if (!existingStaffUser) {
            return res.status(400).json({ success: false, message: "Invalid Email or password" });
        }

        const isPasswordValid = await bcrypt.compare(password, existingStaffUser.passwordHash);
        if (!isPasswordValid) {
            return res.status(400).json({ success: false, message: "Invalid Email or password" });
        }

        // generate token
        const token = jwt.sign(
            { id: existingStaffUser.id, role: existingStaffUser.role, type: "staff" },
            JWT_SECRET,
            { expiresIn: "1d" }
        );

        // send token
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 24 * 60 * 60 * 1000,
        });
        
        const { passwordHash: _, ...safeUser } = existingStaffUser;
        res.json({ success: true, message: "Staff User logged in successfully", data: safeUser });
    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}

async function logout(req: Request, res: Response){
    try {
        res.clearCookie("token");
        res.json({ success: true, message: "Logged out successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Failed to logout" });
    }
}

export { registerCustomer, loginCustomer, registerStaff, loginStaff, logout };