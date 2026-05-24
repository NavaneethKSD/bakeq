import { http } from './http';

export async function fetchProducts({ outletId } = {}) {
  const { data } = await http.get('/api/products', { params: outletId ? { outletId } : {} });
  return data.products;
}
