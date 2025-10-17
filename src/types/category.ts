// ----------------------------------------------------------------------

export interface ICategory {
  _id: string;
  name: string;
  description?: string;
  created_at: string;
  product_count?: number;
}

export interface ICategoryResponse {
  success: boolean;
  data: {
    categories: ICategory[];
    total_categories: number;
  };
}

export interface ICategoryTableFilters {
  // Add filters as needed in the future
}

export type ICategoryTableFilterValue = string | string[];

export interface ICategoryCreateRequest {
  name: string;
  description?: string;
}

export interface ICategoryUpdateRequest {
  name: string;
  description?: string;
}

