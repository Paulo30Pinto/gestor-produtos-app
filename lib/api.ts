import { API_BASE_URL, USER_ID } from './constantes';
import {
  CreateProductoInput,
  IProducto,
  ProductApiResponse,
  ProductsApiResponse,
  UpdateProductoInput,
} from '@/types/produtos';

/**
 * Serviço para comunicação com a API de backend.
 */
export async function getProdutos(
  page: number = 1,
  pageSize: number = 10,
  userId: string = USER_ID
): Promise<ProductsApiResponse> {
  const url = `${API_BASE_URL}/api/products?user=${encodeURIComponent(
    userId
  )}&page=${page}&pageSize=${pageSize}`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    // Evita armazenar em cache dados desatualizados para que as mutações fiquem visíveis imediatamente.
    cache: 'no-store',
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Erro ao buscar produtos (${response.status}): ${errorText}`);
  }

  return response.json();
}

export async function getProdutoById(
  id: string,
  userId: string = USER_ID
): Promise<IProducto | null> {
  const url = `${API_BASE_URL}/api/products/by-id?id=${encodeURIComponent(
    id
  )}&user=${encodeURIComponent(userId)}`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    cache: 'no-store',
  });

  if (!response.ok) {
    if (response.status === 404) return null;
    const errorText = await response.text();
    throw new Error(`Erro ao buscar produto (${response.status}): ${errorText}`);
  }

  const result: ProductApiResponse = await response.json();
  if (result.data && result.data.length > 0) {
    return result.data[0];
  }
  return null;
}

export async function createProduct(
  data: CreateProductoInput,
  userId: string = USER_ID
): Promise<IProducto> {
  const url = `${API_BASE_URL}/api/products?user=${encodeURIComponent(userId)}`;

  const body = {
    name: data.name,
    description: data.description || '',
    price: Number(data.price),
    stock: Number(data.stock),
    user: userId,
  };

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Erro ao criar produto (${response.status}): ${errorText}`);
  }

  const result: ProductApiResponse = await response.json();
  if (result.data && result.data.length > 0) {
    return result.data[0];
  }
  throw new Error('Resposta inválida da API ao criar produto');
}

export async function updateProduct(
  id: string,
  data: UpdateProductoInput,
  userId: string = USER_ID
): Promise<IProducto> {
  const url = `${API_BASE_URL}/api/products?id=${encodeURIComponent(
    id
  )}&user=${encodeURIComponent(userId)}`;

  const body: Record<string, unknown> = {};
  if (data.name !== undefined) body.name = data.name;
  if (data.description !== undefined) body.description = data.description;
  if (data.price !== undefined) body.price = Number(data.price);
  if (data.stock !== undefined) body.stock = Number(data.stock);

  const response = await fetch(url, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Erro ao atualizar produto (${response.status}): ${errorText}`);
  }

  const result: ProductApiResponse = await response.json();
  if (result.data && result.data.length > 0) {
    return result.data[0];
  }
  throw new Error('Resposta inválida da API ao atualizar produto');
}

export async function deleteProduct(
  id: string,
  userId: string = USER_ID
): Promise<{ success: boolean; message?: string }> {
  const url = `${API_BASE_URL}/api/products?id=${encodeURIComponent(
    id
  )}&user=${encodeURIComponent(userId)}`;

  const response = await fetch(url, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Erro ao excluir produto (${response.status}): ${errorText}`);
  }

  return { success: true };
}
