'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ProdutoPaginationProps {
  total: number;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function ProdutoPagination({
  total,
  currentPage,
  totalPages,
  onPageChange,
}: ProdutoPaginationProps) {
  const pages: number[] = [];
  const maxButtons = 5;
  const effectiveTotalPages = Math.max(1, totalPages);

  let startPage = Math.max(1, currentPage - 2);
  let endPage = Math.min(effectiveTotalPages, startPage + maxButtons - 1);

  if (endPage - startPage < maxButtons - 1) {
    startPage = Math.max(1, endPage - maxButtons + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  const displayPages =
    effectiveTotalPages <= 5
      ? Array.from({ length: effectiveTotalPages }, (_, i) => i + 1)
      : pages;

  return (
    <div className="flex flex-col gap-2.5 pt-1 sm:flex-row sm:items-center sm:justify-between sm:gap-3 sm:pt-2">
      {/* Total de itens */}
      <div
        id="pagination-total"
        className="text-xs font-medium text-slate-500 sm:text-sm"
      >
        Total: {total} {total === 1 ? 'item' : 'itens'}
      </div>

      {/* Navegação */}
      <div className="flex items-center gap-1 self-end sm:gap-1.5 sm:self-auto">
        {/* Anterior */}
        <button
          id="btn-pagina-anterior"
          type="button"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          className="inline-flex cursor-pointer items-center gap-0.5 rounded-md border border-slate-200 bg-white px-2 py-1 text-[11px] font-medium text-slate-500 shadow-2xs transition-colors hover:bg-slate-50 hover:text-slate-800 disabled:cursor-not-allowed disabled:opacity-40 sm:gap-1 sm:rounded-lg sm:px-3 sm:py-1.5 sm:text-xs"
        >
          <ChevronLeft className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
          <span className="hidden xs:inline sm:inline">Anterior</span>
        </button>

        {/* Números de página */}
        <div className="flex items-center gap-0.5 sm:gap-1">
          {displayPages.map((page) => {
            const isActive = page === currentPage;
            return (
              <button
                key={page}
                id={`btn-pagina-${page}`}
                type="button"
                onClick={() => onPageChange(page)}
                className={`h-7 min-w-[28px] cursor-pointer rounded-md text-[11px] font-medium transition-colors sm:h-8 sm:min-w-[32px] sm:rounded-lg sm:text-xs ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {page}
              </button>
            );
          })}
        </div>

        {/* Próxima */}
        <button
          id="btn-proxima-pagina"
          type="button"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= effectiveTotalPages}
          className="inline-flex cursor-pointer items-center gap-0.5 rounded-md border border-slate-200 bg-white px-2 py-1 text-[11px] font-medium text-slate-500 shadow-2xs transition-colors hover:bg-slate-50 hover:text-slate-800 disabled:cursor-not-allowed disabled:opacity-40 sm:gap-1 sm:rounded-lg sm:px-3 sm:py-1.5 sm:text-xs"
        >
          <span className="hidden xs:inline sm:inline">Próxima</span>
          <ChevronRight className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
        </button>
      </div>
    </div>
  );
}