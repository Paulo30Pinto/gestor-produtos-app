'use client';

import { useState, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { IProducto, PaginationMeta } from '@/types/produtos';
import { ProdutoHeader } from './produto-header';
import { ProdutoFiltrosBar } from './produto-filtros-bar';
import { ProductTable, SortField, SortOrder } from './produto-table';
import { ProdutoPagination } from './produto-pagination';
import { CreateProdutoModal } from '../modais/create-produto-modal';
import { BatchCreateModal } from '../modais/batch-create-modal';
import { EditProdutoModal } from '../modais/edit-produto-modal';
import { ViewProdutoModal } from '../modais/view-produto-modal';
import { DeleteProdutoModal } from '../modais/delete-produto-modal';
import { ToastBanner } from './toast-banner';
import { PackageOpen, Trash2, RotateCcw } from 'lucide-react';
import { deleteProdutoAction } from '@/app/actions/produtos';
import { ProductMobileCards } from './produto-mobile-cards';

interface ProdutoManagerProps {
  initialProducts: IProducto[];
  pagination: PaginationMeta;
}

export function ProdutoManager({
  initialProducts,
  pagination,
}: ProdutoManagerProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Busca e filtros
  const [searchTerm, setSearchTerm] = useState('');
  const [stockFilter, setStockFilter] = useState<'all' | 'in_stock' | 'low_stock' | 'out_of_stock'>('all');
  const [minPrice, setMinPrice] = useState<number | undefined>();
  const [maxPrice, setMaxPrice] = useState<number | undefined>();

  // Classificação
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');

  // Seleção
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isBatchDeleting, setIsBatchDeleting] = useState(false);

  // Estado dos modais
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isBatchCreateOpen, setIsBatchCreateOpen] = useState(false);
  const [viewProduct, setViewProduct] = useState<IProducto | null>(null);
  const [editProduct, setEditProduct] = useState<IProducto | null>(null);
  const [deleteProduct, setDeleteProduct] = useState<IProducto | null>(null);

  // Feedback de notificação
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<'success' | 'error'>('success');

  function showToast(message: string, type: 'success' | 'error' = 'success') {
    setToastMessage(message);
    setToastType(type);
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  }

  // Gerenciar a navegação por página e tamanho da página
  const currentPage = pagination.currentPage || 1;
  const pageSize = pagination.pageSize || 10;

  function handlePageChange(newPage: number) {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', String(newPage));
    params.set('pageSize', String(pageSize));
    router.push(`/?${params.toString()}`);
  }

  function handlePageSizeChange(newSize: number) {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', '1');
    params.set('pageSize', String(newSize));
    router.push(`/?${params.toString()}`);
  }

  // Alternância de ordenação
  function handleSort(field: SortField) {
    if (sortField === field) {
      setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  }

  // Filtre e ordene os produtos da página atual
  const processedProducts = useMemo(() => {
    let result = [...initialProducts];

    // Filtrar por pesquisa
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          (p.description && p.description.toLowerCase().includes(q))
      );
    }

    // Filtrar por estoque
    if (stockFilter === 'in_stock') {
      result = result.filter((p) => p.stock > 0);
    } else if (stockFilter === 'low_stock') {
      result = result.filter((p) => p.stock > 0 && p.stock <= 10);
    } else if (stockFilter === 'out_of_stock') {
      result = result.filter((p) => p.stock === 0);
    }

    // Filtrar por preço
    if (minPrice !== undefined) {
      result = result.filter((p) => p.price >= minPrice);
    }
    if (maxPrice !== undefined) {
      result = result.filter((p) => p.price <= maxPrice);
    }

    // Organizar
    result.sort((a, b) => {
      let comparison = 0;
      if (sortField === 'name') {
        comparison = a.name.localeCompare(b.name, 'pt');
      } else if (sortField === 'description') {
        comparison = (a.description || '').localeCompare(b.description || '', 'pt');
      } else if (sortField === 'price') {
        comparison = a.price - b.price;
      } else if (sortField === 'stock') {
        comparison = a.stock - b.stock;
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return result;
  }, [initialProducts, searchTerm, stockFilter, minPrice, maxPrice, sortField, sortOrder]);

  // Manipuladores de seleção
  function handleToggleSelectAll() {
    if (processedProducts.length === 0) return;
    const allSelected = processedProducts.every((p) => selectedIds.includes(p._id));
    if (allSelected) {
      // Desmarcar tudo nesta página
      const pageIds = new Set(processedProducts.map((p) => p._id));
      setSelectedIds(selectedIds.filter((id) => !pageIds.has(id)));
    } else {
      // Selecionar tudo nesta página
      const combined = new Set([...selectedIds, ...processedProducts.map((p) => p._id)]);
      setSelectedIds(Array.from(combined));
    }
  }

  function handleToggleSelectOne(id: string) {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((item) => item !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  }

  //  Exclusão em lote
  async function handleBatchDelete() {
    if (selectedIds.length === 0) return;
    if (!confirm(`Deseja realmente excluir os ${selectedIds.length} produtos selecionados?`)) {
      return;
    }

    setIsBatchDeleting(true);
    try {
      for (const id of selectedIds) {
        await deleteProdutoAction(id);
      }
      setSelectedIds([]);
      showToast(`${selectedIds.length} produtos foram excluídos com sucesso.`);
    } catch {
      showToast('Ocorreu um erro ao excluir alguns produtos.', 'error');
    } finally {
      setIsBatchDeleting(false);
    }
  }


  const hasActiveFilters =
    stockFilter !== 'all' || minPrice !== undefined || maxPrice !== undefined;

  function handleClearFilters() {
    setStockFilter('all');
    setMinPrice(undefined);
    setMaxPrice(undefined);
    setSearchTerm('');
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-6 md:px-8 md:py-10">
      {/* Contêiner do Card Principal */}
      {/* Layout cabeçalho */}
      <ProdutoHeader onOpenCreate={() => setIsCreateOpen(true)} />
      <div
        id="products-main-card"
        className="my-4 rounded-2xl border border-slate-200/80 bg-white p-5 md:p-8 shadow-xs space-y-6"
      >


        {/* Barra de filtros e tamanho da página */}
        <ProdutoFiltrosBar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          pageSize={pageSize}
          onPageSizeChange={handlePageSizeChange}
          stockFilter={stockFilter}
          onStockFilterChange={setStockFilter}
          minPrice={minPrice}
          maxPrice={maxPrice}
          onPriceFilterChange={(min, max) => {
            setMinPrice(min);
            setMaxPrice(max);
          }}
          onClearFilters={handleClearFilters}
          hasActiveFilters={hasActiveFilters}
        />

        {/* Barra de ações de multisseleção */}
        {selectedIds.length > 0 && (
          <div className="flex items-center justify-between rounded-xl bg-indigo-50/80 px-4 py-2.5 text-xs sm:text-sm text-indigo-900 border border-indigo-100">
            <span className="font-medium">
              {selectedIds.length} {selectedIds.length === 1 ? 'produto selecionado' : 'produtos selecionados'}
            </span>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setSelectedIds([])}
                className="cursor-pointer font-medium text-slate-600 hover:text-slate-800 px-2 py-1"
              >
                Desmarcar
              </button>
              <button
                type="button"
                onClick={handleBatchDelete}
                disabled={isBatchDeleting}
                className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg bg-rose-600 px-3 py-1.5 text-xs font-semibold text-white shadow-2xs hover:bg-rose-700 disabled:opacity-60"
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span>{isBatchDeleting ? 'Excluindo...' : 'Excluir Selecionados'}</span>
              </button>
            </div>
          </div>
        )}

        {/* Tabela de Produtos (Desktop) */}
        {processedProducts.length > 0 ? (
          <>
            <ProductTable
              products={processedProducts}
              selectedIds={selectedIds}
              onToggleSelectAll={handleToggleSelectAll}
              onToggleSelectOne={handleToggleSelectOne}
              sortField={sortField}
              sortOrder={sortOrder}
              onSort={handleSort}
              onViewProduct={(p) => setViewProduct(p)}
              onEditProduct={(p) => setEditProduct(p)}
              onDeleteProduct={(p) => setDeleteProduct(p)}
            />

            {/* Cartões para Dispositivos Móveis (Celular / Tablet) */}
            <ProductMobileCards
              products={processedProducts}
              selectedIds={selectedIds}
              onToggleSelectOne={handleToggleSelectOne}
              onViewProduct={(p) => setViewProduct(p)}
              onEditProduct={(p) => setEditProduct(p)}
              onDeleteProduct={(p) => setDeleteProduct(p)}
            />
          </>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 py-12 px-4 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 mb-3">
              <PackageOpen className="h-6 w-6" />
            </div>
            <h3 className="text-base font-semibold text-slate-800">
              Nenhum produto encontrado
            </h3>
            <p className="mt-1 text-xs sm:text-sm text-slate-500 max-w-sm">
              {searchTerm || hasActiveFilters
                ? 'Tente ajustar ou remover os filtros aplicados para visualizar os itens.'
                : 'Não há produtos cadastrados na sua loja ainda.'}
            </p>

            <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
              {searchTerm || hasActiveFilters ? (
                <button
                  type="button"
                  onClick={handleClearFilters}
                  className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Limpar Busca e Filtros
                </button>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => setIsCreateOpen(true)}
                    className="rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-indigo-700"
                  >
                    + Novo Produto
                  </button>
                  <button
                    type="button"
                    onClick={() => { }}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    <RotateCcw className="h-3.5 w-3.5 text-slate-500" />
                    <span>Carregar Produtos do Layout</span>
                  </button>
                </>
              )}
            </div>
          </div>
        )}

        {/* Paginação */}
        <ProdutoPagination
          total={pagination.total ?? processedProducts.length}
          currentPage={currentPage}
          totalPages={pagination.totalPages ?? 1}
          onPageChange={handlePageChange}
        />
      </div>

      {/* Modais */}
      <CreateProdutoModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onOpenBatchCreate={() => setIsBatchCreateOpen(true)}
        onSuccess={(msg) => showToast(msg, 'success')}
      />


      <BatchCreateModal
        isOpen={isBatchCreateOpen}
        onClose={() => setIsBatchCreateOpen(false)}
        onOpenSingleCreate={() => setIsCreateOpen(true)}
        onSuccess={(msg) => showToast(msg, 'success')}
      />

      <EditProdutoModal
        product={editProduct}
        isOpen={!!editProduct}
        onClose={() => setEditProduct(null)}
        onSuccess={(msg) => showToast(msg, 'success')}
      />

      <ViewProdutoModal
        product={viewProduct}
        isOpen={!!viewProduct}
        onClose={() => setViewProduct(null)}
        onEdit={(p) => setEditProduct(p)}
        onDelete={(p) => setDeleteProduct(p)}
      />

      <DeleteProdutoModal
        product={deleteProduct}
        isOpen={!!deleteProduct}
        onClose={() => setDeleteProduct(null)}
        onSuccess={(msg) => showToast(msg, 'success')}
      />

      {/* Toast Feedback */}
      <ToastBanner
        message={toastMessage}
        type={toastType}
        onDismiss={() => setToastMessage(null)}
      />
    </div>
  );
}
