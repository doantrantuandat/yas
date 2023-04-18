import { Warehouse } from '../models/Warehouse';

export async function getWarehouses(): Promise<Warehouse[]> {
  const response = await fetch('/api/inventory/backoffice/warehouses');
  return await response.json();
}

export async function getPageableWarehouses(pageNo: number, pageSize: number) {
  const url = `/api/inventory/backoffice/warehouses/paging?pageNo=${pageNo}&pageSize=${pageSize}`;
  const response = await fetch(url);
  return await response.json();
}

export async function createWarehouse(warehouse: Warehouse) {
  const response = await fetch('/api/inventory/backoffice/warehouses', {
    method: 'POST',
    body: JSON.stringify(warehouse),
    headers: { 'Content-type': 'application/json; charset=UTF-8' },
  });
  return response;
}
export async function getWarehouse(id: number) {
  const response = await fetch('/api/inventory/backoffice/warehouses/' + id);
  return await response.json();
}

export async function deleteWarehouse(id: number) {
  const response = await fetch(`/api/inventory/backoffice/warehouses/${id}`, {
    method: 'DELETE',
    headers: { 'Content-type': 'application/json; charset=UTF-8' },
  });
  if (response.status === 204) return response;
  else return await response.json();
}

export async function editWarehouse(id: number, warehouse: Warehouse) {
  const response = await fetch(`/api/inventory/backoffice/warehouses/${id}`, {
    method: 'PUT',
    headers: { 'Content-type': 'application/json; charset=UTF-8' },
    body: JSON.stringify(warehouse),
  });
  if (response.status === 204) return response;
  else return await response.json();
}
