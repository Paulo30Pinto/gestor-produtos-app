'use client';

import { useState, useTransition } from 'react';
import { X, Plus, Trash2, Loader2, Layers, Sparkles } from 'lucide-react';
import { createBatchProductsAction } from '@/app/actions/produtos';
import { CreateProductoInput } from '@/types/produtos';

interface BatchCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (message: string) => void;
  onOpenSingleCreate?: () => void;
}

interface ProductRow {
  id: string;
  name: string;
  description: string;
  price: string;
  stock: string;
}

const INITIAL_ROWS: ProductRow[] = [
  { id: '1', name: '', description: '', price: '', stock: '10' },
  { id: '2', name: '', description: '', price: '', stock: '10' },
];

export function BatchCreateModal({
  isOpen,
  onClose,
  onSuccess,
  onOpenSingleCreate,
}: BatchCreateModalProps) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [rows, setRows] = useState<ProductRow[]>(INITIAL_ROWS);

  if (!isOpen) return null;

  function handleAddRow() {
    setRows((prev) => [
      ...prev,
      {
        id: Math.random().toString(36).substring(2, 9),
        name: '',
        description: '',
        price: '',
        stock: '10',
      },
    ]);
  }

  function handleRemoveRow(id: string) {
    if (rows.length <= 1) return;
    setRows((prev) => prev.filter((r) => r.id !== id));
  }

  function handleRowChange(id: string, field: keyof ProductRow, value: string) {
    setRows((prev) =>
      prev.map((r) => (r.id === id ? { ...r, [field]: value } : r))
    );
  }


  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    // Filter non-empty rows
    const filledRows = rows.filter((r) => r.name.trim() !== '');

    if (filledRows.length === 0) {
      setError('Preencha ao menos um produto com nome.');
      return;
    }

    const payload: CreateProductoInput[] = [];

    for (let i = 0; i < filledRows.length; i++) {
      const r = filledRows[i];
      const numPrice = parseFloat(r.price.replace(',', '.'));
      if (isNaN(numPrice) || numPrice < 0) {
        setError(`Informe um preço válido para "${r.name}".`);
        return;
      }

      const numStock = parseInt(r.stock, 10);
      if (isNaN(numStock) || numStock < 0) {
        setError(`Informe uma quantidade em estoque válida para "${r.name}".`);
        return;
      }

      payload.push({
        name: r.name.trim(),
        description: r.description.trim(),
        price: numPrice,
        stock: numStock,
      });
    }

    startTransition(async () => {
      const result = await createBatchProductsAction(payload);
      if (result.success) {
        onSuccess(`${payload.length} produtos criados em lote com sucesso!`);
        setRows(INITIAL_ROWS);
        onClose();
      } else {
        setError(result.error || 'Erro ao criar produtos em lote.');
      }
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/40 backdrop-blur-xs">
      <div
        id="modal-batch-create-product"
        className="w-full max-w-3xl max-h-[90vh] flex flex-col rounded-2xl bg-white shadow-xl border border-slate-100 transition-all overflow-hidden"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-batch-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
              <Layers className="h-5 w-5" />
            </div>
            <div>
              <h2 id="modal-batch-title" className="text-lg font-bold text-slate-900">
                Criar Produtos em Lote
              </h2>
              <p className="text-xs text-slate-500">
                Adicione múltiplos produtos simultaneamente com o endpoint de lote da API.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content Body */}
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
            {error && (
              <div className="rounded-lg bg-rose-50 p-3 text-xs font-medium text-rose-700 border border-rose-100">
                {error}
              </div>
            )}

            <div className="space-y-3">
              {rows.map((row, index) => (
                <div
                  key={row.id}
                  className="rounded-xl border border-slate-200/80 bg-slate-50/50 p-3.5 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-600">
                      Item #{index + 1}
                    </span>
                    {rows.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveRow(row.id)}
                        className="p-1 text-slate-400 hover:text-rose-600 rounded"
                        title="Remover linha"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 uppercase mb-1">
                        Nome do Produto *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Ex: Teclado sem Fio"
                        value={row.name}
                        onChange={(e) => handleRowChange(row.id, 'name', e.target.value)}
                        className="w-full rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 uppercase mb-1">
                        Descrição
                      </label>
                      <input
                        type="text"
                        placeholder="Descrição opcional..."
                        value={row.description}
                        onChange={(e) => handleRowChange(row.id, 'description', e.target.value)}
                        className="w-full rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 uppercase mb-1">
                        Preço em Kz *
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        required
                        placeholder="0.00"
                        value={row.price}
                        onChange={(e) => handleRowChange(row.id, 'price', e.target.value)}
                        className="w-full rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 uppercase mb-1">
                        Estoque *
                      </label>
                      <input
                        type="number"
                        min="0"
                        required
                        placeholder="0"
                        value={row.stock}
                        onChange={(e) => handleRowChange(row.id, 'stock', e.target.value)}
                        className="w-full rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={handleAddRow}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-slate-300 py-2.5 text-xs font-semibold text-slate-600 hover:border-indigo-400 hover:text-indigo-600 hover:bg-indigo-50/30 transition-colors cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              <span>Adicionar Mais um Produto</span>
            </button>
          </div>

          {/* Footer Actions */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 px-6 py-4 bg-slate-50/50">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                disabled={isPending}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs sm:text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-50 cursor-pointer"
              >
                Cancelar
              </button>

              {onOpenSingleCreate && (
                <button
                  type="button"
                  id="btn-switch-to-single"
                  onClick={() => {
                    onClose();
                    onOpenSingleCreate();
                  }}
                  disabled={isPending}
                  className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs sm:text-sm font-medium text-slate-600 hover:text-indigo-600 hover:bg-indigo-50/50 transition-colors disabled:opacity-50 cursor-pointer"
                >
                  &larr; Produto Individual
                </button>
              )}
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-2 text-xs sm:text-sm font-medium text-white shadow-xs hover:bg-indigo-700 disabled:opacity-60 cursor-pointer"
            >
              {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
              <span>
                {isPending
                  ? 'Cadastrando Produtos...'
                  : `Cadastrar ${rows.filter((r) => r.name.trim()).length || rows.length} Produtos`}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
