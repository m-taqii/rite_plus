import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Send HTTP cookies
});

// Attach Authorization Bearer token from localStorage if present
apiClient.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const staffToken = localStorage.getItem('rite_plus_staff_token');
      const customerToken = localStorage.getItem('rite_plus_token');

      // For staff mutation routes, only send staffToken to avoid 403 Forbidden
      const isStaffEndpoint =
        config.url?.startsWith('/product/create') ||
        config.url?.startsWith('/product/upload-image') ||
        config.url?.startsWith('/product/categories') ||
        config.url?.includes('/stock') ||
        (config.method && config.method.toLowerCase() !== 'get');

      const token = isStaffEndpoint ? staffToken : (staffToken || customerToken);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export interface ApiProduct {
  id: string;
  code: string;
  name: string;
  price: string | number;
  description?: string | null;
  image?: string | null;
  genericName?: string | null;
  brand?: string | null;
  strength?: string | null;
  form?: string | null;
  packSize?: string | null;
  stock: number;
  requiresRx: boolean;
  categoryId?: string | null;
  active: boolean;
  searchText?: string;
  updatedAt?: string;
}

export interface ApiCategory {
  id: string;
  name: string;
  slug: string;
  parentId?: string | null;
  description?: string | null;
  image?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProductListResponse {
  success: boolean;
  items: ApiProduct[];
  total: number;
  limit: number;
  offset: number;
}

//  PRODUCTS API CALLS

export async function fetchProducts(params: {
  search?: string;
  categoryId?: string;
  categorySlug?: string;
  category?: string;
  requiresRx?: boolean;
  inStockOnly?: boolean;
  minPrice?: number | string;
  maxPrice?: number | string;
  brand?: string;
  sortBy?: string;
  limit?: number;
  offset?: number;
  activeOnly?: boolean;
} = {}): Promise<ProductListResponse> {
  const response = await apiClient.get<ProductListResponse>('/product/list', {
    params,
  });
  return response.data;
}

export async function fetchProductById(id: string): Promise<ApiProduct | null> {
  const response = await apiClient.get<{ success: boolean; data: ApiProduct }>(
    `/product/${id}`
  );
  return response.data.data;
}

export async function createProductApi(
  payload: FormData | Record<string, any>
): Promise<{ success: boolean; message: string; data?: ApiProduct }> {
  const isFormData = typeof FormData !== 'undefined' && payload instanceof FormData;
  const headers = isFormData
    ? { 'Content-Type': 'multipart/form-data' }
    : { 'Content-Type': 'application/json' };

  const response = await apiClient.post<{
    success: boolean;
    message: string;
    data?: ApiProduct;
  }>('/product/create', payload, { headers });

  return response.data;
}

export async function updateProductApi(
  id: string,
  payload: FormData | Record<string, any>
): Promise<{ success: boolean; message: string; data?: ApiProduct }> {
  const isFormData = typeof FormData !== 'undefined' && payload instanceof FormData;
  const headers = isFormData
    ? { 'Content-Type': 'multipart/form-data' }
    : { 'Content-Type': 'application/json' };

  const response = await apiClient.patch<{
    success: boolean;
    message: string;
    data?: ApiProduct;
  }>(`/product/${id}`, payload, { headers });

  return response.data;
}

export async function adjustStockApi(
  id: string,
  delta: number
): Promise<{ success: boolean; message: string; data?: ApiProduct }> {
  const response = await apiClient.patch<{
    success: boolean;
    message: string;
    data?: ApiProduct;
  }>(`/product/${id}/stock`, { delta });

  return response.data;
}

export async function deleteProductApi(
  id: string
): Promise<{ success: boolean; message: string }> {
  const response = await apiClient.delete<{
    success: boolean;
    message: string;
  }>(`/product/${id}`);

  return response.data;
}

export async function uploadProductImageApi(
  file: File
): Promise<{ success: boolean; message: string; data?: { url: string; fileId: string } }> {
  const formData = new FormData();
  formData.append('image', file);

  const response = await apiClient.post<{
    success: boolean;
    message: string;
    data?: { url: string; fileId: string };
  }>('/product/upload-image', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

  return response.data;
}

export async function fetchCategories(): Promise<ApiCategory[]> {
  try {
    const response = await apiClient.get<{ success: boolean; data: ApiCategory[] }>(
      '/product/categories'
    );
    return response.data.data || [];
  } catch {
    return [];
  }
}

export async function createCategoryApi(
  name: string,
  slug?: string,
  parentId?: string | null,
  description?: string | null
): Promise<{ success: boolean; message: string; data?: ApiCategory }> {
  const response = await apiClient.post<{
    success: boolean;
    message: string;
    data?: ApiCategory;
  }>('/product/categories', { name, slug, parentId, description });
  return response.data;
}

export async function updateCategoryApi(
  id: string,
  data: {
    name?: string;
    slug?: string;
    parentId?: string | null;
    description?: string | null;
  }
): Promise<{ success: boolean; message: string; data?: ApiCategory }> {
  const response = await apiClient.patch<{
    success: boolean;
    message: string;
    data?: ApiCategory;
  }>(`/product/categories/${id}`, data);
  return response.data;
}

export async function deleteCategoryApi(
  id: string
): Promise<{ success: boolean; message: string }> {
  const response = await apiClient.delete<{
    success: boolean;
    message: string;
  }>(`/product/categories/${id}`);
  return response.data;
}

export default apiClient;
