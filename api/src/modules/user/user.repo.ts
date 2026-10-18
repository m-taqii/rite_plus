import { db } from "../../db/index.ts";
import { customers } from "../../db/schema/customers.ts";
import {staffUsers} from "../../db/schema/staff_user.ts"
import {eq} from "drizzle-orm";

export async function getCustomerByEmail(email:string){
    const customer = await db.select().from(customers).where(eq(customers.email,email));
    if(customer.length===0)return null;
    return customer[0];
}

export async function getCustomerByPhone(phone:string){
    const customer = await db.select().from(customers).where(eq(customers.phone,phone));
    if(customer.length===0)return null;
    return customer[0];
}

export async function getStaffUserByEmail(email:string){
    const staffUser = await db.select().from(staffUsers).where(eq(staffUsers.email,email));
    if(staffUser.length===0)return null;
    return staffUser[0];
}

export async function getCustomerById(id:string){
    const customer = await db.select().from(customers).where(eq(customers.id,id));
    if(customer.length===0)return null;
    return customer[0];
}

export async function getStaffUserById(id:string){
    const staffUser = await db.select().from(staffUsers).where(eq(staffUsers.id,id));
    if(staffUser.length===0)return null;
    return staffUser[0];
}

export async function getAllCustomers(){
    const allCustomers = await db.select().from(customers);
    return allCustomers;
}

export async function getAllStaffUsers(){
    const allStaffUsers = await db.select().from(staffUsers);
    return allStaffUsers;
}