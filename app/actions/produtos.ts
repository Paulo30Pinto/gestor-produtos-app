'use server';

import { revalidatePath } from 'next/cache';
import {
  createProduct,
  deleteProduct,
  updateProduct,
} from '@/lib/api';
import { CreateProductoInput, UpdateProductoInput } from '@/types/produtos';

export interface ActionResult<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

export async function createProdutoAction(
  data: CreateProductoInput
): Promise<ActionResult> {
  try {
    if (!data.name || data.name.trim() === '') {
      return { success: false, error: 'O nome do produto é obrigatório.' };
    }
    if (isNaN(Number(data.price)) || Number(data.price) < 0) {
      return { success: false, error: 'Preço inválido.' };
    }
    if (isNaN(Number(data.stock)) || Number(data.stock) < 0) {
      return { success: false, error: 'Estoque inválido.' };
    }

    const created = await createProduct({
      name: data.name.trim(),
      description: data.description?.trim(),
      price: Number(data.price),
      stock: Number(data.stock),
    });

    revalidatePath('/');
    return { success: true, data: created };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Erro ao criar produto';
    return { success: false, error: message };
  }
}

export async function updateProdutoAction(
  id: string,
  data: UpdateProductoInput
): Promise<ActionResult> {
  try {
    if (!id) {
      return { success: false, error: 'ID do produto é obrigatório.' };
    }
    if (data.name !== undefined && data.name.trim() === '') {
      return { success: false, error: 'O nome do produto não pode ser vazio.' };
    }
    if (data.price !== undefined && (isNaN(Number(data.price)) || Number(data.price) < 0)) {
      return { success: false, error: 'Preço inválido.' };
    }
    if (data.stock !== undefined && (isNaN(Number(data.stock)) || Number(data.stock) < 0)) {
      return { success: false, error: 'Estoque inválido.' };
    }

    const updated = await updateProduct(id, {
      name: data.name?.trim(),
      description: data.description?.trim(),
      price: data.price !== undefined ? Number(data.price) : undefined,
      stock: data.stock !== undefined ? Number(data.stock) : undefined,
    });

    revalidatePath('/');
    return { success: true, data: updated };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Erro ao atualizar produto';
    return { success: false, error: message };
  }
}

export async function deleteProdutoAction(id: string): Promise<ActionResult> {
  try {
    if (!id) {
      return { success: false, error: 'ID do produto é obrigatório.' };
    }

    await deleteProduct(id);
    revalidatePath('/');
    return { success: true };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Erro ao excluir produto';
    return { success: false, error: message };
  }
}
