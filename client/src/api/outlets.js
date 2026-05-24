import { http } from './http';

export async function fetchOutlets() {
  const { data } = await http.get('/api/outlets');
  return data.outlets;
}
