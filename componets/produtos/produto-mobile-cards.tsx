'use client';

import { Eye, Pencil, Trash2 } from 'lucide-react';
import { IProducto } from '@/types/produtos';
import { formatoKwanza } from '@/lib/format';

interface ProductMobileCardsProps {
  products: IProducto[];
  selectedIds: string[];
  onToggleSelectOne: (id: string) => void;
  onViewProduct: (product: IProducto) => void;
  onEditProduct: (product: IProducto) => void;
  onDeleteProduct: (product: IProducto) => void;
}

export function ProductMobileCards({
  products,
  selectedIds,
  onToggleSelectOne,
  onViewProduct,
  onEditProduct,
  onDeleteProduct,
}: ProductMobileCardsProps) {
  return (
    <div className="flex flex-col gap-2.5 md:hidden">
      {products.map((product) => {
        const isSelected = selectedIds.includes(product._id);
        const isLowStock = product.stock > 0 && product.stock <= 10;
        const isOutOfStock = product.stock === 0;

        return (
          <div
            key={product._id}
            className={`rounded-xl border p-3 transition-colors ${
              isSelected
                ? 'border-indigo-300 bg-indigo-50/30'
                : 'border-slate-200/80 bg-white'
            }`}
          >
            {/* Cabeçalho: Checkbox + Nome + Descrição */}
            <div className="flex items-start gap-2.5">
              <input
                type="checkbox"
                checked={isSelected}
                onChange={() => onToggleSelectOne(product._id)}
                className="mt-0.5 h-3.5 w-3.5 shrink-0 cursor-pointer rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                aria-label={`Selecionar ${product.name}`}
              />
              <div className="min-w-0 flex-1">
                <h3 className="text-sm font-semibold leading-tight text-slate-900">
                  {product.name}
                </h3>
                <p className="mt-0.5 line-clamp-2 text-[11px] leading-snug text-slate-500">
                  {product.description || 'Sem descrição cadastrada.'}
                </p>
              </div>
            </div>

            {/* Preço e Estoque */}
            <div className="mt-2.5 flex items-center justify-between border-t border-slate-100 pt-2.5">
              <div>
                <span className="block text-[10px] text-slate-400">Preço</span>
                <span className="text-sm font-semibold text-slate-900">
                  {formatoKwanza(product.price)}
                </span>
              </div>

              <div className="text-right">
                <span className="block text-[10px] text-slate-400">Estoque</span>
                <div className="mt-0.5 flex items-center justify-end gap-1">
                  <span
                    className={`h-2 w-2 rounded-full ${
                      isOutOfStock
                        ? 'bg-rose-500'
                        : isLowStock
                        ? 'bg-amber-500'
                        : 'bg-emerald-500'
                    }`}
                  />
                  <span className="text-xs font-semibold text-slate-700">
                    {product.stock} un.
                  </span>
                </div>
              </div>
            </div>

            {/* Ações */}
            <div className="mt-2.5 flex items-center justify-end gap-1.5 border-t border-slate-100 pt-2.5">
              <button
                type="button"
                onClick={() => onViewProduct(product)}
                className="inline-flex items-center gap-1 rounded-md bg-indigo-50 px-2.5 py-1 text-[11px] font-medium text-indigo-600 transition-colors hover:bg-indigo-100"
              >
                <Eye className="h-3 w-3" />
                <span>Ver</span>
              </button>

              <button
                type="button"
                onClick={() => onEditProduct(product)}
                className="inline-flex items-center gap-1 rounded-md bg-indigo-50 px-2.5 py-1 text-[11px] font-medium text-indigo-600 transition-colors hover:bg-indigo-100"
              >
                <Pencil className="h-3 w-3" />
                <span>Editar</span>
              </button>

              <button
                type="button"
                onClick={() => onDeleteProduct(product)}
                className="inline-flex items-center gap-1 rounded-md bg-rose-50 px-2.5 py-1 text-[11px] font-medium text-rose-500 transition-colors hover:bg-rose-100"
              >
                <Trash2 className="h-3 w-3" />
                <span>Excluir</span>
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}