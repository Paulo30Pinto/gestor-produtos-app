'use client';

import { useState, useTransition } from 'react';
import { X, Loader2, AlertTriangle } from 'lucide-react';
import { deleteProdutoAction } from '@/app/actions/produtos';
import { IProducto } from '@/types/produtos';

interface DeleteProdutoModalProps {
  product: IProducto | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (message: string) => void;
}

export function DeleteProdutoModal({
  product,
  isOpen,
  onClose,
  onSuccess,
}: DeleteProdutoModalProps) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  if (!isOpen || !product) return null;

  function handleDelete() {
    if (!product) return;
    setError(null);

    startTransition(async () => {
      const result = await deleteProdutoAction(product._id);
      if (result.success) {
        onSuccess(`O produto "${product.name}" foi removido com sucesso.`);
        onClose();
      } else {
        setError(result.error || 'Erro ao excluir o produto.');
      }
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-3 backdrop-blur-xs sm:p-4">
      <div
        id="modal-delete-product"
        className="w-full max-w-md rounded-2xl border border-slate-100 bg-white p-4 shadow-xl sm:p-5"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-delete-title"
      >
        {/* Cabeçalho */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-rose-50 text-rose-600 sm:h-11 sm:w-11 sm:rounded-xl">
              <AlertTriangle className="h-5 w-5 sm:h-6 sm:w-6" />
            </div>
            <div>
              <h2
                id="modal-delete-title"
                className="text-sm font-bold text-slate-900 sm:text-lg"
              >
                Excluir Produto
              </h2>
              <p className="text-[10px] text-slate-500 sm:text-xs">
                Esta ação é irreversível.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isPending}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 sm:p-1.5"
          >
            <X className="h-4 w-4 sm:h-5 sm:w-5" />
          </button>
        </div>

        {/* Aviso */}
        <div className="mt-3 rounded-xl border border-slate-100 bg-slate-50 p-3 text-xs text-slate-700 sm:mt-4 sm:p-4 sm:text-sm">
          Você tem certeza que deseja excluir o produto{' '}
          <strong className="font-semibold text-slate-900">{product.name}</strong>?
        </div>

        {/* Erro */}
        {error && (
          <div className="mt-2.5 rounded-lg border border-rose-100 bg-rose-50 p-2.5 text-[11px] font-medium text-rose-700 sm:mt-3 sm:p-3 sm:text-xs">
            {error}
          </div>
        )}

        {/* Rodapé */}
        <div className="mt-3 flex items-center justify-end gap-2 border-t border-slate-100 pt-3 sm:mt-4 sm:gap-3 sm:pt-4">
          <button
            type="button"
            onClick={onClose}
            disabled={isPending}
            className="cursor-pointer rounded-lg border border-slate-200 px-3 py-1.5 text-[11px] font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-50 sm:rounded-xl sm:px-4 sm:py-2 sm:text-sm"
          >
            Cancelar
          </button>

          <button
            id="btn-confirm-delete"
            type="button"
            onClick={handleDelete}
            disabled={isPending}
            className="inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-lg bg-rose-600 px-3.5 py-1.5 text-[11px] font-medium text-white shadow-xs hover:bg-rose-700 disabled:opacity-60 sm:gap-2 sm:rounded-xl sm:px-5 sm:py-2 sm:text-sm"
          >
            {isPending && <Loader2 className="h-3.5 w-3.5 animate-spin sm:h-4 sm:w-4" />}
            <span>{isPending ? 'Excluindo...' : 'Confirmar Exclusão'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}