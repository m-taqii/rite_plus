// Client-side authentication utilities and API bridge for Rite Plus

export interface CustomerUser {
  id: string;
  name?: string | null;
  email?: string | null;
  phone: string;
  createdAt?: string;
}

export interface StaffUser {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  role: 'admin' | 'staff' | 'maintainer';
  active: boolean;
  createdAt?: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export async function loginCustomerApi(identifier: string, password: string): Promise<{ success: boolean; message: string; data?: CustomerUser; token?: string }> {
  try {
    const res = await fetch(`${API_BASE_URL}/user/login/customer`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier, password }),
    });
    const data = await res.json();
    if (res.ok && data.success) {
      if (typeof window !== 'undefined') {
        localStorage.setItem('rite_plus_customer', JSON.stringify(data.data));
        if (data.token) localStorage.setItem('rite_plus_token', data.token);
      }
    }
    return data;
  } catch (err: any) {
    return {
      success: false,
      message: err.message?.includes('fetch')
        ? 'Cannot connect to Rite Plus Auth server. Please verify backend is running on :8080'
        : 'Network or server error during sign in',
    };
  }
}

export async function registerCustomerApi(payload: {
  name: string;
  email: string;
  phone: string;
  password: string;
}): Promise<{ success: boolean; message: string; data?: CustomerUser; token?: string }> {
  try {
    const res = await fetch(`${API_BASE_URL}/user/register/customer`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (res.ok && data.success) {
      if (typeof window !== 'undefined') {
        localStorage.setItem('rite_plus_customer', JSON.stringify(data.data));
        if (data.token) localStorage.setItem('rite_plus_token', data.token);
      }
    }
    return data;
  } catch (err: any) {
    return {
      success: false,
      message: err.message?.includes('fetch')
        ? 'Cannot connect to Rite Plus Auth server. Please verify backend is running on :8080'
        : 'Network or server error during registration',
    };
  }
}

export async function loginStaffApi(email: string, password: string): Promise<{ success: boolean; message: string; data?: StaffUser; token?: string }> {
  try {
    const res = await fetch(`${API_BASE_URL}/user/login/staff`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (res.ok && data.success) {
      if (typeof window !== 'undefined') {
        localStorage.setItem('rite_plus_staff', JSON.stringify(data.data));
        if (data.token) localStorage.setItem('rite_plus_staff_token', data.token);
      }
    }
    return data;
  } catch (err: any) {
    return {
      success: false,
      message: err.message?.includes('fetch')
        ? 'Cannot connect to Rite Plus Clinical portal server. Please verify backend is running on :8080'
        : 'Network or server error during staff verification',
    };
  }
}

export function getCurrentCustomer(): CustomerUser | null {
  if (typeof window === 'undefined') return null;
  try {
    const data = localStorage.getItem('rite_plus_customer');
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
}

export function getCurrentStaff(): StaffUser | null {
  if (typeof window === 'undefined') return null;
  try {
    const data = localStorage.getItem('rite_plus_staff');
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
}

export function logoutCustomer() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('rite_plus_customer');
    localStorage.removeItem('rite_plus_token');
  }
}

export function logoutStaff() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('rite_plus_staff');
    localStorage.removeItem('rite_plus_staff_token');
  }
}
