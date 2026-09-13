export interface IProducto {
    _id: string;
    name: string;
    description?: string;
    price: number;
    stock: number;
    createdBy: string;
    createdAt?: string;
    updatedAt?: string;
    __v?: number;
  }
  
  export interface IProductoEntidade {
    name: string;
    description?: string;
    price: number;
    stock: number;
    createdBy: string;
  }
  
  export interface CreateProductoInput {
    name: string;
    description?: string;
    price: number;
    stock: number;
    user?: string;
  }
  
  export interface UpdateProductoInput {
    name?: string;
    description?: string;
    price?: number;
    stock?: number;
  }
  
  export interface PaginationMeta {
    total: number;
    currentPage: number;
    totalPages: number;
    pageSize: number;
  }
  
  export interface ProductsApiResponse {
    statusText: string;
    data: IProducto[];
    pagination: PaginationMeta;
  }
  
  export interface ProductApiResponse {
    statusText: string;
    data: IProducto[];
    pagination?: PaginationMeta;
  }
  