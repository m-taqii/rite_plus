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
      credentials: 'include',
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
      credentials: 'include',
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
      credentials: 'include',
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (res.ok && data.success) {
      if (typeof window !== 'undefined') {
        localStorage.setItem('rite_plus_staff', JSON.stringify(data.data));
        if (data.token) {
          localStorage.setItem('rite_plus_staff_token', data.token);
          // Set client-accessible cookie for Next.js route middleware
          document.cookie = `rite_plus_staff_token=${data.token}; path=/; max-age=86400; SameSite=Lax`;
        }
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

export function hasStaffCookie(): boolean {
  if (typeof document === 'undefined') return false;
  return document.cookie.split(';').some((c) => {
    const item = c.trim();
    return item.startsWith('rite_plus_staff_token=') || item.startsWith('staff_token=');
  });
}

export function getCurrentStaff(): StaffUser | null {
  if (typeof window === 'undefined') return null;
  try {
    // If cookies were cleared from the browser, wipe localStorage too to prevent zombie sessions
    if (!hasStaffCookie()) {
      localStorage.removeItem('rite_plus_staff');
      localStorage.removeItem('rite_plus_staff_token');
      return null;
    }
    const token = localStorage.getItem('rite_plus_staff_token');
    const data = localStorage.getItem('rite_plus_staff');
    if (!token || !data) return null;
    return JSON.parse(data);
  } catch {
    return null;
  }
}

export async function logoutCustomer(): Promise<void> {
  try {
    await fetch(`${API_BASE_URL}/user/logout`, {
      method: 'POST',
      credentials: 'include',
    });
  } catch (err) {
    console.warn('API logout error:', err);
  } finally {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('rite_plus_customer');
      localStorage.removeItem('rite_plus_token');
      document.cookie = 'rite_plus_token=; path=/; max-age=0; SameSite=Lax';
      document.cookie = 'token=; path=/; max-age=0; SameSite=Lax';
    }
  }
}

export async function logoutStaff(): Promise<void> {
  try {
    await fetch(`${API_BASE_URL}/user/logout`, {
      method: 'POST',
      credentials: 'include',
    });
  } catch (err) {
    console.warn('API logout error:', err);
  } finally {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('rite_plus_staff');
      localStorage.removeItem('rite_plus_staff_token');
      document.cookie = 'rite_plus_staff_token=; path=/; max-age=0; SameSite=Lax';
      document.cookie = 'staff_token=; path=/; max-age=0; SameSite=Lax';
    }
  }
}
