import useSWR from 'swr';
import { useMemo } from 'react';

import { BASE_API } from 'src/config-global';
import { apiFetcher, endpoints, apiProductFetcher } from 'src/utils/axios';
import { useAuthToken } from 'src/auth/hooks';

import {
  IProductItem,
  IProductCreateRequest,
  IProductQuantity,
  IUploadProductImage,
  IUploadReviewImage,
  IProductStatus,
  IProductAPIResponse,
  IProductUpdateRequest,
  IProductCraeteVariation,
} from 'src/types/product';

// ----------------------------------------------------------------------

interface GetProductsParams {
  page?: number;
  limit?: number;
  stock_filters?: string[];
  status_filters?: string[];
  search?: string;
  sort_by?: 'created_at' | 'name' | 'price' | 'stock_quantity' | 'sku';
  sort_order?: 'asc' | 'desc';
}

export function useGetProducts(params: GetProductsParams = {}) {
  const {
    page = 1,
    limit = 20,
    stock_filters = [],
    status_filters = [],
    search = '',
    sort_by = 'created_at',
    sort_order = 'desc',
  } = params;

  const token = useAuthToken();
  const baseUrl = BASE_API;

  // Build query string with parameters
  const queryParams = new URLSearchParams();
  queryParams.append('page', page.toString());
  queryParams.append('limit', limit.toString());
  queryParams.append('sort_by', sort_by);
  queryParams.append('sort_order', sort_order);

  if (stock_filters.length > 0) {
    stock_filters.forEach((filter) => queryParams.append('stock_filters', filter));
  }

  if (status_filters.length > 0) {
    status_filters.forEach((filter) => queryParams.append('status_filters', filter));
  }

  if (search) {
    queryParams.append('search', search);
  }

  const URL = `${baseUrl}${endpoints.product.all}?${queryParams.toString()}`;

  const { data, isLoading, error, isValidating } = useSWR(
    token ? { url: URL, token } : null,
    apiProductFetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      errorRetryCount: 3,

      onError: (err) => {
        console.error('useGetProducts error:', err);
      },
    }
  );

  const memoizedValue = useMemo(
    () => ({
      products: (data?.data?.products as IProductItem[]) || [],
      pagination: data?.data?.pagination || null,
      filters: data?.data?.filters || null,
      sorting: data?.data?.sorting || null,
      productsLoading: isLoading,
      productsError: error,
      productsValidating: isValidating,
      productsEmpty: !isLoading && !data?.data?.products?.length,
    }),
    [
      data?.data?.products,
      data?.data?.pagination,
      data?.data?.filters,
      data?.data?.sorting,
      error,
      isLoading,
      isValidating,
    ]
  );

  return memoizedValue;
}

// ----------------------------------------------------------------------

// export function useGetProduct(productId: string) {
//   const URL = productId ? [endpoints.product.details, { params: { productId } }] : '';

//   const { data, isLoading, error, isValidating } = useSWR(URL, apiFetcher, {
//     revalidateOnFocus: false,
//     revalidateOnReconnect: false,
//     errorRetryCount: 3,
//     onError: (err) => {
//       console.error('useGetProduct error:', err);
//     }
//   });

//   const memoizedValue = useMemo(
//     () => ({
//       product: data?.product as IProductItem,
//       productLoading: isLoading,
//       productError: error,
//       productValidating: isValidating,
//     }),
//     [data?.product, error, isLoading, isValidating]
//   );

//   return memoizedValue;
// }

// ----------------------------------------------------------------------

export function useSearchProducts(query: string) {
  const URL = query ? [endpoints.product.search, { params: { query } }] : '';

  const { data, isLoading, error, isValidating } = useSWR(URL, apiFetcher, {
    keepPreviousData: true,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    errorRetryCount: 3,
    onError: (err) => {
      console.error('useSearchProducts error:', err);
    },
  });

  const memoizedValue = useMemo(
    () => ({
      searchResults: (data?.results as IProductItem[]) || [],
      searchLoading: isLoading,
      searchError: error,
      searchValidating: isValidating,
      searchEmpty: !isLoading && !data?.results?.length,
    }),
    [data?.results, error, isLoading, isValidating]
  );

  return memoizedValue;
}

export async function createProduct(productData: any, token: string) {
  const baseUrl = BASE_API;
  const URL = `${baseUrl}${endpoints.product.create}`;

  const response = await fetch(URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(productData),
  });

  if (!response.ok) {
    console.log('first');
    const errorDetails = await response.json();
    throw new Error(errorDetails.message || 'Error creating product');
  }

  return response.json();
}

export async function createVariations(
  productId: string,
  productData: IProductCraeteVariation,
  token: string
) {
  const baseUrl = BASE_API;
  const updatedURL = `${baseUrl}${endpoints.product.addVariations.replace(':productId', `${productId}`)}`;

  const response = await fetch(updatedURL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(productData),
  });

  if (!response.ok) {
    const errorDetails = await response.json();
    throw new Error(errorDetails.message || 'Error creating product');
  }

  return response.json();
}

export async function editVariations(
  productId: string,
  variationId: string,
  productdata: IProductCraeteVariation,
  token: string
) {
  const baseUrl = BASE_API;
  const url = `${baseUrl}${endpoints.product.editVariations.replace(':productId', `${productId}`).replace(':variationId', `${variationId}`)}`;

  const response = await fetch(url, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(productdata),
  });

  if (!response.ok) {
    const errorDetails = await response.json();
    throw new Error(errorDetails.message || 'Error updating product');
  }

  return response.json();
}

export async function deleteVariation(productId: string, variationId: string,token:string) {
  const baseUrl = BASE_API;
    const url = `${baseUrl}${endpoints.product.deleteVariations.replace(':productId', `${productId}`).replace(':variationId', `${variationId}`)}`;

  const response = await fetch(url, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorDetails = await response.json();
    throw new Error(errorDetails.message || 'Error deleting product');
  }

  return response.json();
}

export async function deleteProduct(productId: string, token: string) {
  const baseUrl = BASE_API;
  const URL = `${baseUrl}${endpoints.product.delete}${productId}`;

  const response = await fetch(URL, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorDetails = await response.json();
    throw new Error(errorDetails.message || 'Error deleting product');
  }

  return response.json();
}

export async function updateProduct(
  productId: string,
  productData: IProductUpdateRequest,
  token: string
) {
  const baseUrl = BASE_API;
  const URL = `${baseUrl}${endpoints.product.update}${productId}`;

  const response = await fetch(URL, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(productData),
  });

  if (!response.ok) {
    const errorDetails = await response.json();
    throw new Error(errorDetails.message || 'Error updating product');
  }

  return response.json();
}

export async function getProductById(productId: string, token: string) {
  const baseUrl = BASE_API;
  const URL = `${baseUrl}${endpoints.product.detailsById}${productId}`;

  const response = await fetch(URL, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorDetails = await response.json();
    throw new Error(errorDetails.message || 'Error fetching product');
  }

  return response.json();
}

export async function updateProductQuantity(
  productId: string,
  productQuantity: IProductQuantity,
  token: string
) {
  const baseUrl = BASE_API;
  const URL = `${baseUrl}${endpoints.product.quantity}${productId}`;

  const response = await fetch(URL, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(productQuantity),
  });

  if (!response.ok) {
    const errorDetails = await response.json();
    throw new Error(errorDetails.message || 'Error updating product quantity');
  }

  return response.json();
}

export async function updateProductStatus(
  productId: string,
  productStatus: IProductStatus,
  token: string
) {
  const baseUrl = BASE_API;
  const URL = `${baseUrl}${endpoints.product.status}${productId}`;

  const response = await fetch(URL, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(productStatus),
  });

  if (!response.ok) {
    const errorDetails = await response.json();
    throw new Error(errorDetails.message || 'Error updating product status');
  }

  return response.json();
}

export async function uploadProductImage(
  productId: string,
  productImage: IUploadProductImage,
  token: string
) {
  const baseUrl = BASE_API;
  const URL = `${baseUrl}${endpoints.image.product}${productId}`;

  const formData = new FormData();

  // If file is provided, append it; otherwise use image_url
  if (productImage.file) {
    formData.append('image', productImage.file);
  } else if (productImage.image_url) {
    formData.append('image_url', productImage.image_url);
  } else {
    throw new Error('Either file or image_url must be provided');
  }

  formData.append('is_primary', productImage.is_primary.toString());

  const response = await fetch(URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!response.ok) {
    const errorDetails = await response.json();
    throw new Error(errorDetails.message || 'Error uploading product image');
  }

  return response.json();
}

export async function uploadReviewImage(
  reviewId: string,
  reviewImage: IUploadReviewImage,
  token: string
) {
  const baseUrl = BASE_API;
  const URL = `${baseUrl}${endpoints.image.review}`;

  const formData = new FormData();

  // If file is provided, append it; otherwise use image_url
  if (reviewImage.file) {
    formData.append('image', reviewImage.file);
  } else if (reviewImage.image_url) {
    formData.append('image_url', reviewImage.image_url);
  } else {
    throw new Error('Either file or image_url must be provided');
  }

  formData.append('review_id', reviewId);

  const response = await fetch(URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!response.ok) {
    const errorDetails = await response.json();
    throw new Error(errorDetails.message || 'Error uploading review image');
  }

  return response.json();
}
