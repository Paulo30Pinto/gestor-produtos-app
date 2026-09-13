'use client';

import { useState, useRef, useEffect } from 'react';
import { Search, Filter, ChevronDown, X } from 'lucide-react';

interface ProdutoFiltrosBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  pageSize: number;
  onPageSizeChange: (size: number) => void;
  stockFilter: 'all' | 'in_stock' | 'low_stock' | 'out_of_stock';
  onStockFilterChange: (filter: 'all' | 'in_stock' | 'low_stock' | 'out_of_stock') => void;
  minPrice?: number;
  maxPrice?: number;
  onPriceFilterChange: (min?: number, max?: number) => void;
  onClearFilters: () => void;
  hasActiveFilters: boolean;
}

export function ProdutoFiltrosBar({
  searchTerm,
  onSearchChange,
  pageSize,
  onPageSizeChange,
  stockFilter,
  onStockFilterChange,
  minPrice,
  maxPrice,
  onPriceFilterChange,
  onClearFilters,
  hasActiveFilters,
}: ProdutoFiltrosBarProps) {
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsFilterDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="flex flex-col gap-2.5 sm:gap-3 md:flex-row md:items-center md:justify-between">
      {/* Busca + Filtros */}
      <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
        {/* Campo de busca */}
        <div className="relative w-full min-w-0 flex-1 sm:w-64 sm:flex-none md:w-72 lg:w-80">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400 sm:left-3 sm:h-4 sm:w-4" />
          <input
            id="input-search-products"
            type="text"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Buscar por nome, descrição..."
            className="h-9 w-full rounded-lg border border-slate-200 bg-white pl-8 pr-7 text-xs text-slate-800 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 sm:h-10 sm:pl-9 sm:pr-8 sm:text-sm"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 sm:right-2.5"
              title="Limpar busca"
            >
              <X className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            </button>
          )}
        </div>

        {/* Botão Filtros */}
        <div className="relative" ref={dropdownRef}>
          <button
            id="btn-toggle-filters"
            type="button"
            onClick={() => setIsFilterDropdownOpen(!isFilterDropdownOpen)}
            className={`inline-flex h-9 cursor-pointer items-center gap-1.5 rounded-lg border px-2.5 text-xs font-medium transition-colors sm:h-10 sm:gap-2 sm:px-3.5 sm:text-sm ${
              hasActiveFilters || isFilterDropdownOpen
                ? 'border-indigo-500 bg-indigo-50/50 text-indigo-700'
                : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
            }`}
          >
            <Filter className="h-3.5 w-3.5 text-slate-500 sm:h-4 sm:w-4" />
            <span>Filtros</span>
            {hasActiveFilters && (
              <span className="flex h-1.5 w-1.5 rounded-full bg-indigo-600 sm:h-2 sm:w-2" />
            )}
            <ChevronDown className="h-3.5 w-3.5 text-slate-400 sm:h-4 sm:w-4" />
          </button>

          {/* Dropdown - alinhado à direita para não gerar scroll horizontal */}
          {isFilterDropdownOpen && (
            <div
              id="filters-dropdown-popover"
              className="absolute right-0 z-30 mt-1.5 w-64 max-w-[calc(100vw-1.5rem)] rounded-xl border border-slate-200 bg-white p-3 shadow-lg sm:mt-2 sm:w-72 sm:p-4"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-2.5 sm:pb-3">
                <span className="text-xs font-semibold text-slate-900 sm:text-sm">
                  Filtrar Produtos
                </span>
                {hasActiveFilters && (
                  <button
                    type="button"
                    onClick={onClearFilters}
                    className="text-[11px] font-medium text-indigo-600 hover:text-indigo-800 sm:text-xs"
                  >
                    Limpar
                  </button>
                )}
              </div>

              {/* Status de Estoque */}
              <div className="mt-2.5 space-y-1.5 sm:mt-3 sm:space-y-2">
                <label className="text-[10px] font-semibold uppercase tracking-wider text-slate-600 sm:text-xs">
                  Status de Estoque
                </label>
                <div className="flex flex-col gap-1 text-xs text-slate-700 sm:gap-1.5 sm:text-sm">
                  <label className="flex cursor-pointer items-center gap-1.5 sm:gap-2">
                    <input
                      type="radio"
                      name="stock-filter"
                      checked={stockFilter === 'all'}
                      onChange={() => onStockFilterChange('all')}
                      className="h-3.5 w-3.5 text-indigo-600 focus:ring-indigo-500 sm:h-4 sm:w-4"
                    />
                    <span>Todos</span>
                  </label>
                  <label className="flex cursor-pointer items-center gap-1.5 sm:gap-2">
                    <input
                      type="radio"
                      name="stock-filter"
                      checked={stockFilter === 'in_stock'}
                      onChange={() => onStockFilterChange('in_stock')}
                      className="h-3.5 w-3.5 text-indigo-600 focus:ring-indigo-500 sm:h-4 sm:w-4"
                    />
                    <span>Em Estoque (&gt; 0)</span>
                  </label>
                  <label className="flex cursor-pointer items-center gap-1.5 sm:gap-2">
                    <input
                      type="radio"
                      name="stock-filter"
                      checked={stockFilter === 'low_stock'}
                      onChange={() => onStockFilterChange('low_stock')}
                      className="h-3.5 w-3.5 text-indigo-600 focus:ring-indigo-500 sm:h-4 sm:w-4"
                    />
                    <span>Baixo Estoque (≤ 10)</span>
                  </label>
                  <label className="flex cursor-pointer items-center gap-1.5 sm:gap-2">
                    <input
                      type="radio"
                      name="stock-filter"
                      checked={stockFilter === 'out_of_stock'}
                      onChange={() => onStockFilterChange('out_of_stock')}
                      className="h-3.5 w-3.5 text-indigo-600 focus:ring-indigo-500 sm:h-4 sm:w-4"
                    />
                    <span>Esgotado (0)</span>
                  </label>
                </div>
              </div>

              {/* Faixa de Preço */}
              <div className="mt-3 space-y-1.5 border-t border-slate-100 pt-2.5 sm:mt-4 sm:space-y-2 sm:pt-3">
                <label className="text-[10px] font-semibold uppercase tracking-wider text-slate-600 sm:text-xs">
                  Faixa de Preço (Kz)
                </label>
                <div className="grid grid-cols-2 gap-1.5 sm:gap-2">
                  <input
                    type="number"
                    placeholder="Mín"
                    value={minPrice ?? ''}
                    onChange={(e) =>
                      onPriceFilterChange(
                        e.target.value ? Number(e.target.value) : undefined,
                        maxPrice
                      )
                    }
                    className="h-7 rounded border border-slate-200 px-2 text-[11px] text-slate-800 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none sm:h-8 sm:text-xs"
                  />
                  <input
                    type="number"
                    placeholder="Máx"
                    value={maxPrice ?? ''}
                    onChange={(e) =>
                      onPriceFilterChange(
                        minPrice,
                        e.target.value ? Number(e.target.value) : undefined
                      )
                    }
                    className="h-7 rounded border border-slate-200 px-2 text-[11px] text-slate-800 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none sm:h-8 sm:text-xs"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {hasActiveFilters && (
          <button
            type="button"
            onClick={onClearFilters}
            className="text-[11px] font-medium text-slate-500 underline underline-offset-2 hover:text-slate-800 sm:text-xs"
          >
            Limpar filtros
          </button>
        )}
      </div>

      {/* Seletor de itens por página */}
      <div className="flex items-center gap-1.5 text-xs text-slate-500 sm:gap-2 sm:text-sm">
        <span>Mostrar</span>
        <div className="relative inline-block">
          <select
            id="select-page-size"
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            className="h-8 cursor-pointer appearance-none rounded-lg border border-slate-200 bg-white py-0.5 pl-2.5 pr-7 text-xs font-medium text-slate-800 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 sm:h-9 sm:pl-3 sm:pr-8 sm:text-sm"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
          <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-3 w-3 -translate-y-1/2 text-slate-400 sm:right-2.5 sm:h-3.5 sm:w-3.5" />
        </div>
        <span>por página</span>
      </div>
    </div>
  );
}