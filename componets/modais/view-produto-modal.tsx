'use client';

import { X, Eye, Pencil, Trash2, Calendar, ShieldCheck, Tag } from 'lucide-react';
import { IProducto } from '@/types/produtos';
import { formatoKwanza, formatoData } from '@/lib/format';

interface ViewProdutoModalProps {
  product: IProducto | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (product: IProducto) => void;
  onDelete: (product: IProducto) => void;
}

export function ViewProdutoModal({
  product,
  isOpen,
  onClose,
  onEdit,
  onDelete,
}: ViewProdutoModalProps) {
  if (!isOpen || !product) return null;

  const isLowStock = product.stock > 0 && product.stock <= 10;
  const isOutOfStock = product.stock === 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-3 backdrop-blur-xs sm:p-4">
      <div
        id="modal-view-product"
        className="flex max-h-[90dvh] w-full max-w-lg flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-view-title"
      >
        {/* Cabeçalho */}
        <div className="flex shrink-0 items-center justify-between border-b border-slate-100 px-4 py-3 sm:px-5 sm:py-4">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 sm:h-10 sm:w-10 sm:rounded-xl">
              <Eye className="h-4 w-4 sm:h-5 sm:w-5" />
            </div>
            <div>
              <h2
                id="modal-view-title"
                className="text-sm font-bold text-slate-900 sm:text-lg"
              >
                Detalhes do Produto
              </h2>
              <p className="text-[10px] text-slate-500 sm:text-xs">
                Informações completas cadastradas na API.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 sm:p-1.5"
          >
            <X className="h-4 w-4 sm:h-5 sm:w-5" />
          </button>
        </div>

        {/* Conteúdo scrollável */}
        <div className="flex-1 overflow-y-auto px-4 py-3 sm:px-5 sm:py-4">
          <div className="space-y-3 sm:space-y-4">
            {/* Nome */}
            <div>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-indigo-600 sm:text-xs">
                Produto
              </span>
              <h3 className="mt-0.5 text-base font-bold text-slate-900 sm:text-xl">
                {product.name}
              </h3>
            </div>

            {/* Descrição */}
            <div className="rounded-xl border border-slate-100 bg-slate-50 p-2.5 sm:p-3.5">
              <span className="mb-0.5 block text-[10px] font-semibold uppercase tracking-wider text-slate-500 sm:mb-1 sm:text-xs">
                Descrição
              </span>
              <p className="whitespace-pre-wrap text-xs leading-relaxed text-slate-700 sm:text-sm">
                {product.description || 'Nenhuma descrição fornecida para este item.'}
              </p>
            </div>

            {/* Preço e Estoque */}
            <div className="grid grid-cols-2 gap-2 sm:gap-3">
              <div className="rounded-xl border border-slate-100 p-2.5 sm:p-3.5">
                <span className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-slate-500 sm:gap-1.5 sm:text-xs">
                  <Tag className="h-3 w-3 text-slate-400 sm:h-3.5 sm:w-3.5" />
                  Preço Unitário
                </span>
                <p className="mt-1 text-sm font-bold text-slate-900 sm:mt-1.5 sm:text-lg">
                  {formatoKwanza(product.price)}
                </p>
              </div>

              <div className="rounded-xl border border-slate-100 p-2.5 sm:p-3.5">
                <span className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-slate-500 sm:gap-1.5 sm:text-xs">
                  <ShieldCheck className="h-3 w-3 text-slate-400 sm:h-3.5 sm:w-3.5" />
                  Estoque
                </span>
                <div className="mt-1 flex items-center gap-1.5 sm:mt-1.5 sm:gap-2">
                  <span
                    className={`h-2 w-2 rounded-full sm:h-2.5 sm:w-2.5 ${
                      isOutOfStock
                        ? 'bg-rose-500'
                        : isLowStock
                        ? 'bg-amber-500'
                        : 'bg-emerald-500'
                    }`}
                  />
                  <span className="text-sm font-bold text-slate-900 sm:text-lg">
                    {product.stock}
                  </span>
                  <span className="text-[10px] text-slate-500 sm:text-xs">
                    {isOutOfStock
                      ? '(Esgotado)'
                      : isLowStock
                      ? '(Baixo)'
                      : '(Disponível)'}
                  </span>
                </div>
              </div>
            </div>

            {/* Metadados */}
            <div className="space-y-1.5 rounded-xl border border-slate-100 p-2.5 text-[10px] text-slate-500 sm:space-y-2 sm:p-3.5 sm:text-xs">
              <div className="flex items-center justify-between gap-2">
                <span className="shrink-0 font-medium text-slate-600">ID do Produto:</span>
                <span className="truncate font-mono text-slate-800">{product._id}</span>
              </div>
              <div className="flex items-center justify-between gap-2">
                <span className="shrink-0 font-medium text-slate-600">ID do Usuário:</span>
                <span className="truncate font-mono text-slate-800">{product.createdBy}</span>
              </div>
              {product.createdAt && (
                <div className="flex items-center justify-between gap-2">
                  <span className="flex shrink-0 items-center gap-1 font-medium text-slate-600">
                    <Calendar className="h-3 w-3 sm:h-3.5 sm:w-3.5" /> Criado em:
                  </span>
                  <span>{formatoData(product.createdAt)}</span>
                </div>
              )}
              {product.updatedAt && (
                <div className="flex items-center justify-between gap-2">
                  <span className="shrink-0 font-medium text-slate-600">Última atualização:</span>
                  <span>{formatoData(product.updatedAt)}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Rodapé */}
        <div className="flex shrink-0 flex-wrap items-center justify-between gap-2 border-t border-slate-100 px-4 py-3 sm:gap-3 sm:px-5 sm:py-4">
          <button
            type="button"
            onClick={() => {
              onClose();
              onDelete(product);
            }}
            className="inline-flex cursor-pointer items-center gap-1 rounded-lg border border-rose-200 bg-rose-50 px-2.5 py-1.5 text-[11px] font-semibold text-rose-600 hover:bg-rose-100 sm:gap-1.5 sm:rounded-xl sm:px-3.5 sm:py-2 sm:text-xs"
          >
            <Trash2 className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
            <span>Excluir</span>
          </button>

          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              type="button"
              onClick={onClose}
              className="cursor-pointer rounded-lg border border-slate-200 px-3 py-1.5 text-[11px] font-medium text-slate-600 hover:bg-slate-50 sm:rounded-xl sm:px-4 sm:py-2 sm:text-xs"
            >
              Fechar
            </button>

            <button
              type="button"
              onClick={() => {
                onClose();
                onEdit(product);
              }}
              className="inline-flex cursor-pointer items-center gap-1 rounded-lg bg-indigo-600 px-3 py-1.5 text-[11px] font-semibold text-white shadow-xs hover:bg-indigo-700 sm:gap-1.5 sm:rounded-xl sm:px-4 sm:py-2 sm:text-xs"
            >
              <Pencil className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
              <span>Editar</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}