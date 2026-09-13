'use client';

import { useState, useTransition } from 'react';
import { X, Loader2, Pencil } from 'lucide-react';
import { updateProdutoAction } from '@/app/actions/produtos';
import { IProducto } from '@/types/produtos';

interface EditProdutoModalProps {
  product: IProducto | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (message: string) => void;
}

interface EditProdutoFormProps {
  product: IProducto;
  onClose: () => void;
  onSuccess: (message: string) => void;
}

function EditProdutoForm({ product, onClose, onSuccess }: EditProdutoFormProps) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState(product.name || '');
  const [description, setDescription] = useState(product.description || '');
  const [price, setPrice] = useState(product.price?.toString() || '0');
  const [stock, setStock] = useState(product.stock?.toString() || '0');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError('O nome do produto não pode ser vazio.');
      return;
    }

    const numPrice = parseFloat(price.replace(',', '.'));
    if (isNaN(numPrice) || numPrice < 0) {
      setError('Informe um valor de preço válido.');
      return;
    }

    const numStock = parseInt(stock, 10);
    if (isNaN(numStock) || numStock < 0) {
      setError('Informe uma quantidade em estoque válida.');
      return;
    }

    startTransition(async () => {
      const result = await updateProdutoAction(product._id, {
        name: name.trim(),
        description: description.trim(),
        price: numPrice,
        stock: numStock,
      });

      if (result.success) {
        onSuccess('Produto atualizado com sucesso!');
        onClose();
      } else {
        setError(result.error || 'Erro ao atualizar o produto.');
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="mt-3 space-y-3 sm:mt-4 sm:space-y-4">
      {error && (
        <div className="rounded-lg border border-rose-100 bg-rose-50 p-2.5 text-[11px] font-medium text-rose-700 sm:p-3 sm:text-xs">
          {error}
        </div>
      )}

      <div>
        <label
          htmlFor="edit-product-name"
          className="mb-0.5 block text-[10px] font-semibold uppercase tracking-wider text-slate-700 sm:mb-1 sm:text-xs"
        >
          Nome do Produto <span className="text-rose-500">*</span>
        </label>
        <input
          id="edit-product-name"
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full rounded-lg border border-slate-200 px-3 py-1.5 text-xs text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 sm:px-3.5 sm:py-2 sm:text-sm"
        />
      </div>

      <div>
        <label
          htmlFor="edit-product-description"
          className="mb-0.5 block text-[10px] font-semibold uppercase tracking-wider text-slate-700 sm:mb-1 sm:text-xs"
        >
          Descrição
        </label>
        <textarea
          id="edit-product-description"
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full rounded-lg border border-slate-200 px-3 py-1.5 text-xs text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 sm:px-3.5 sm:py-2 sm:text-sm"
        />
      </div>

      <div className="grid grid-cols-2 gap-2.5 sm:gap-4">
        <div>
          <label
            htmlFor="edit-product-price"
            className="mb-0.5 block text-[10px] font-semibold uppercase tracking-wider text-slate-700 sm:mb-1 sm:text-xs"
          >
            Preço (Kz) <span className="text-rose-500">*</span>
          </label>
          <input
            id="edit-product-price"
            type="number"
            step="0.01"
            min="0"
            required
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full rounded-lg border border-slate-200 px-3 py-1.5 text-xs text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 sm:px-3.5 sm:py-2 sm:text-sm"
          />
        </div>

        <div>
          <label
            htmlFor="edit-product-stock"
            className="mb-0.5 block text-[10px] font-semibold uppercase tracking-wider text-slate-700 sm:mb-1 sm:text-xs"
          >
            Estoque <span className="text-rose-500">*</span>
          </label>
          <input
            id="edit-product-stock"
            type="number"
            min="0"
            required
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            className="w-full rounded-lg border border-slate-200 px-3 py-1.5 text-xs text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 sm:px-3.5 sm:py-2 sm:text-sm"
          />
        </div>
      </div>

      {/* Rodapé */}
      <div className="flex items-center justify-end gap-2 border-t border-slate-100 pt-3 sm:gap-3 sm:pt-4">
        <button
          type="button"
          onClick={onClose}
          disabled={isPending}
          className="cursor-pointer rounded-lg border border-slate-200 px-3 py-1.5 text-[11px] font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-50 sm:rounded-xl sm:px-4 sm:py-2 sm:text-sm"
        >
          Cancelar
        </button>

        <button
          id="btn-submit-edit-product"
          type="submit"
          disabled={isPending}
          className="inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-lg bg-indigo-600 px-3.5 py-1.5 text-[11px] font-medium text-white shadow-xs hover:bg-indigo-700 disabled:opacity-60 sm:gap-2 sm:rounded-xl sm:px-5 sm:py-2 sm:text-sm"
        >
          {isPending && <Loader2 className="h-3.5 w-3.5 animate-spin sm:h-4 sm:w-4" />}
          <span>{isPending ? 'Salvando...' : 'Salvar Alterações'}</span>
        </button>
      </div>
    </form>
  );
}

export function EditProdutoModal({
  product,
  isOpen,
  onClose,
  onSuccess,
}: EditProdutoModalProps) {
  if (!isOpen || !product) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-3 backdrop-blur-xs sm:p-4">
      <div
        id="modal-edit-product"
        className="flex max-h-[90dvh] w-full max-w-lg flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-edit-title"
      >
        {/* Cabeçalho */}
        <div className="flex shrink-0 items-center justify-between border-b border-slate-100 px-4 py-3 sm:px-5 sm:py-4">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 sm:h-10 sm:w-10 sm:rounded-xl">
              <Pencil className="h-4 w-4 sm:h-5 sm:w-5" />
            </div>
            <div>
              <h2
                id="modal-edit-title"
                className="text-sm font-bold text-slate-900 sm:text-lg"
              >
                Editar Produto
              </h2>
              <p className="text-[10px] text-slate-500 sm:text-xs">
                Altere os detalhes do produto selecionado.
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

        {/* Formulário (scrollável se necessário) */}
        <div className="flex-1 overflow-y-auto px-4 pb-4 sm:px-5 sm:pb-5">
          <EditProdutoForm
            key={product._id}
            product={product}
            onClose={onClose}
            onSuccess={onSuccess}
          />
        </div>
      </div>
    </div>
  );
}