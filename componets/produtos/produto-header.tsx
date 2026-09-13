'use client';

import { Plus, Package } from 'lucide-react';

interface ProdutoHeaderProps {
  onOpenCreate: () => void;
}

export function ProdutoHeader({onOpenCreate}: ProdutoHeaderProps) {
  return (
    <header className="flex gap-2 sm:gap-4 flex-row sm:items-center justify-between sm:justify-between">
      <div className="flex items-start gap-2 sm:gap-4">
        {/* Selo de ícone do pacote violeta */}
        <div
          id="product-header-icon"
          className="flex h-9 w-9 sm:h-12 sm:w-12 rounded-xl sm:rounded-2xl shrink-0 items-center justify-center bg-indigo-500 text-white shadow-xs"
        >
          <Package className="h-4 w-4 sm:h-6 sm:w-6 stroke-[2.2]" />
        </div>

        <div>
          <h1
            id="product-header-title"
            className="text-lg sm:text-2xl md:text-3xl font-bold tracking-tight text-slate-900"
          >
            Produtos
          </h1>
          <p
            id="product-header-subtitle"
            className="hidden xs:inline sm:inline mt-1 text-xs text-slate-500 sm:text-sm"
          >
            Gerencie os produtos da sua loja. Aqui você pode visualizar, editar, adicionar ou remover produtos.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 self-start sm:self-center">
        <button
          id="btn-novo-produto"
          onClick={onOpenCreate}
          type="button"
          className="inline-flex cursor-pointer items-center justify-center gap-2  bg-indigo-600 px-2.5 py-1.5 text-xs sm:px-4 sm:py-2.5 sm:text-sm font-medium text-white shadow-xs transition-colors hover:bg-indigo-700 active:bg-indigo-800"
        >
          <Plus className="h-3.5 w-3.5 sm:h-4 sm:w-4 stroke-[2.5]" />
          <span>Novo Produto</span>
        </button>
      </div>
    </header>
  );
}
