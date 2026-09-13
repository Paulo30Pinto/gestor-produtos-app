'use client';

import { ChevronsUpDown, Eye, Pencil, Trash2 } from 'lucide-react';
import { IProducto } from '@/types/produtos';
import { formatoKwanza } from '@/lib/format';

export type SortField = 'name' | 'description' | 'price' | 'stock';
export type SortOrder = 'asc' | 'desc';

interface ProdutoTableProps {
  products: IProducto[];
  selectedIds: string[];
  onToggleSelectAll: () => void;
  onToggleSelectOne: (id: string) => void;
  sortField: SortField;
  sortOrder: SortOrder;
  onSort: (field: SortField) => void;
  onViewProduct: (product: IProducto) => void;
  onEditProduct: (product: IProducto) => void;
  onDeleteProduct: (product: IProducto) => void;
}

export function ProductTable({
  products,
  selectedIds,
  onToggleSelectAll,
  onToggleSelectOne,
  sortField,
  sortOrder,
  onSort,
  onViewProduct,
  onEditProduct,
  onDeleteProduct,
}: ProdutoTableProps) {
  const isAllSelected =
    products.length > 0 && products.every((p) => selectedIds.includes(p._id));
  const isPartiallySelected =
    selectedIds.length > 0 && !isAllSelected;

  return (
    <div className="hidden md:block overflow-x-auto rounded-xl border border-slate-200/80 bg-white">
      <table className="w-full border-collapse text-left">
        <thead>
          <tr className="border-b border-slate-200/80 bg-[#fbfcfe] text-[11px] font-semibold text-slate-500 sm:text-xs">
            {/* Checkbox "Todos" */}
            <th className="w-10 py-2.5 pl-3 pr-1.5 sm:w-12 sm:py-3 sm:pl-4 sm:pr-2">
              <input
                type="checkbox"
                checked={isAllSelected}
                ref={(el) => {
                  if (el) el.indeterminate = isPartiallySelected;
                }}
                onChange={onToggleSelectAll}
                className="h-3.5 w-3.5 cursor-pointer rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 sm:h-4 sm:w-4"
                aria-label="Selecionar todos os produtos"
              />
            </th>

            {/* Produto */}
            <th className="px-2.5 py-2.5 font-semibold sm:px-4 sm:py-3">
              <button
                type="button"
                onClick={() => onSort('name')}
                className="inline-flex cursor-pointer items-center gap-0.5 transition-colors hover:text-slate-900 sm:gap-1"
              >
                <span>Produto</span>
                <ChevronsUpDown
                  className={`h-3 w-3 sm:h-3.5 sm:w-3.5 ${
                    sortField === 'name' ? 'text-indigo-600' : 'text-slate-400'
                  }`}
                />
              </button>
            </th>

            {/* Descrição */}
            <th className="px-2.5 py-2.5 font-semibold sm:px-4 sm:py-3">
              <button
                type="button"
                onClick={() => onSort('description')}
                className="inline-flex cursor-pointer items-center gap-0.5 transition-colors hover:text-slate-900 sm:gap-1"
              >
                <span>Descrição</span>
                <ChevronsUpDown
                  className={`h-3 w-3 sm:h-3.5 sm:w-3.5 ${
                    sortField === 'description' ? 'text-indigo-600' : 'text-slate-400'
                  }`}
                />
              </button>
            </th>

            {/* Preço */}
            <th className="px-2.5 py-2.5 font-semibold sm:px-4 sm:py-3">
              <button
                type="button"
                onClick={() => onSort('price')}
                className="inline-flex cursor-pointer items-center gap-0.5 transition-colors hover:text-slate-900 sm:gap-1"
              >
                <span>Preço (Kz)</span>
                <ChevronsUpDown
                  className={`h-3 w-3 sm:h-3.5 sm:w-3.5 ${
                    sortField === 'price' ? 'text-indigo-600' : 'text-slate-400'
                  }`}
                />
              </button>
            </th>

            {/* Estoque */}
            <th className="px-2.5 py-2.5 font-semibold sm:px-4 sm:py-3">
              <button
                type="button"
                onClick={() => onSort('stock')}
                className="inline-flex cursor-pointer items-center gap-0.5 transition-colors hover:text-slate-900 sm:gap-1"
              >
                <span>Estoque</span>
                <ChevronsUpDown
                  className={`h-3 w-3 sm:h-3.5 sm:w-3.5 ${
                    sortField === 'stock' ? 'text-indigo-600' : 'text-slate-400'
                  }`}
                />
              </button>
            </th>

            {/* Ações */}
            <th className="px-2.5 py-2.5 text-center font-semibold sm:px-4 sm:py-3">
              Ações
            </th>
          </tr>
        </thead>

        <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
          {products.map((product) => {
            const isSelected = selectedIds.includes(product._id);
            const isLowStock = product.stock > 0 && product.stock <= 10;
            const isOutOfStock = product.stock === 0;

            return (
              <tr
                key={product._id}
                className={`transition-colors hover:bg-slate-50/70 ${
                  isSelected ? 'bg-indigo-50/20' : ''
                }`}
              >
                {/* Checkbox */}
                <td className="py-2.5 pl-3 pr-1.5 sm:py-3.5 sm:pl-4 sm:pr-2">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => onToggleSelectOne(product._id)}
                    className="h-3.5 w-3.5 cursor-pointer rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 sm:h-4 sm:w-4"
                    aria-label={`Selecionar ${product.name}`}
                  />
                </td>

                {/* Nome */}
                <td className="whitespace-nowrap px-2.5 py-2.5 font-semibold text-slate-900 sm:px-4 sm:py-3.5">
                  {product.name}
                </td>

                {/* Descrição */}
                <td className="max-w-[140px] truncate px-2.5 py-2.5 font-normal text-slate-500 sm:max-w-xs sm:px-4 sm:py-3.5 xl:max-w-sm">
                  {product.description || (
                    <span className="italic text-slate-400">Sem descrição</span>
                  )}
                </td>

                {/* Preço */}
                <td className="whitespace-nowrap px-2.5 py-2.5 font-semibold text-slate-900 sm:px-4 sm:py-3.5">
                  {formatoKwanza(product.price)}
                </td>

                {/* Estoque */}
                <td className="whitespace-nowrap px-2.5 py-2.5 sm:px-4 sm:py-3.5">
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <span
                      className={`h-2 w-2 rounded-full sm:h-2.5 sm:w-2.5 ${
                        isOutOfStock
                          ? 'bg-rose-500'
                          : isLowStock
                          ? 'bg-amber-500'
                          : 'bg-emerald-500'
                      }`}
                    />
                    <span className="font-medium text-slate-700">
                      {product.stock}
                    </span>
                  </div>
                </td>

                {/* Ações */}
                <td className="px-2.5 py-2.5 sm:px-4 sm:py-3.5">
                  <div className="flex items-center justify-center gap-1 sm:gap-1.5">
                    <button
                      type="button"
                      id={`btn-view-${product._id}`}
                      onClick={() => onViewProduct(product)}
                      title="Visualizar produto"
                      className="inline-flex cursor-pointer items-center justify-center rounded-md bg-indigo-50 p-1.5 text-indigo-600 transition-colors hover:bg-indigo-100 active:bg-indigo-200 sm:rounded-lg sm:p-2"
                    >
                      <Eye className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    </button>

                    <button
                      type="button"
                      id={`btn-edit-${product._id}`}
                      onClick={() => onEditProduct(product)}
                      title="Editar produto"
                      className="inline-flex cursor-pointer items-center justify-center rounded-md bg-indigo-50 p-1.5 text-indigo-600 transition-colors hover:bg-indigo-100 active:bg-indigo-200 sm:rounded-lg sm:p-2"
                    >
                      <Pencil className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    </button>

                    <button
                      type="button"
                      id={`btn-delete-${product._id}`}
                      onClick={() => onDeleteProduct(product)}
                      title="Excluir produto"
                      className="inline-flex cursor-pointer items-center justify-center rounded-md bg-rose-50 p-1.5 text-rose-500 transition-colors hover:bg-rose-100 active:bg-rose-200 sm:rounded-lg sm:p-2"
                    >
                      <Trash2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}