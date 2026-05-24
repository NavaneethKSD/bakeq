import { http } from './http';

export async function createOrder(payload) {
  const { data } = await http.post('/api/orders', payload);
  return data.order;
}

export async function fetchOrders(params = {}) {
  const { data } = await http.get('/api/orders', { params });
  return data.orders;
}

export async function fetchOrderById(id) {
  const { data } = await http.get(`/api/orders/${id}`);
  return data.order;
}

export async function updateOrderStatus(id, status) {
  const { data } = await http.patch(`/api/orders/${id}/status`, { status });
  return data.order;
}
