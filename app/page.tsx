import { Suspense } from 'react';
import Link from 'next/link';
import { getProdutos } from '@/lib/api';
import { ProdutoManager } from '@/componets/produtos/produto-manager';
import { Loader2, AlertCircle } from 'lucide-react';
import { IProducto, PaginationMeta } from '@/types/produtos';

interface PageProps {
  searchParams?: Promise<{
    page?: string;
    pageSize?: string;
  }>;
}

async function loadProdutos(page: number, pageSize: number): Promise<{
  products: IProducto[];
  pagination: PaginationMeta;
  error?: string;
}> {
  try {
    const response = await getProdutos(page, pageSize);
    return {
      products: response.data || [],
      pagination: response.pagination || {
        total: response.data?.length || 0,
        currentPage: page,
        totalPages: Math.ceil((response.data?.length || 0) / pageSize) || 1,
        pageSize: pageSize,
      },
    };
  } catch (err: unknown) {
    return {
      products: [],
      pagination: {
        total: 0,
        currentPage: page,
        totalPages: 1,
        pageSize: pageSize,
      },
      error: err instanceof Error ? err.message : 'Erro ao carregar dados da API.',
    };
  }
}

export default async function Page({ searchParams }: PageProps) {
  const resolvedParams = searchParams ? await searchParams : {};
  const page = Math.max(1, Number(resolvedParams.page) || 1);
  const pageSize = Math.max(1, Number(resolvedParams.pageSize) || 10);

  const { products, pagination, error } = await loadProdutos(page, pageSize);

  if (error) {
    return (
      <main className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-md w-full rounded-2xl bg-white p-6 shadow-sm border border-slate-200 text-center space-y-4">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 text-rose-500">
            <AlertCircle className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Falha na Conexão com a API
            </h2>
            <p className="mt-1 text-xs text-slate-500">{error}</p>
          </div>
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-xl bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
          >
            Tentar Novamente
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen py-4 md:py-8">
      <Suspense
        fallback={
          <div className="flex h-96 items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
          </div>
        }
      >
        <ProdutoManager
          initialProducts={products}
          pagination={pagination}
        />
      </Suspense>
    </main>
  );
}
