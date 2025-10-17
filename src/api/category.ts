import useSWR from 'swr';
import { useMemo } from 'react';

import { endpoints, apiFetcher } from 'src/utils/axios';
import { BASE_API } from 'src/config-global';

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

export function useGetCategories() {
  const URL = `${BASE_API}${endpoints.category.all}`;

  const { data, isLoading, error, isValidating } = useSWR(URL, apiFetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    errorRetryCount: 3,
    onError: (err) => {
      console.error('useGetCategories error:', err);
    },
  });

  const memoizedValue = useMemo(
    () => ({
      categories: (data?.data?.categories as ICategory[]) || [],
      totalCategories: data?.data?.total_categories || 0,
      categoriesLoading: isLoading,
      categoriesError: error,
      categoriesValidating: isValidating,
      categoriesEmpty: !isLoading && !data?.data?.categories?.length,
    }),
    [data?.data?.categories, data?.data?.total_categories, error, isLoading, isValidating]
  );

  return memoizedValue;
}

export async function addCategory(category: { name: string; description?: string }, token: string) {
  const baseUrl = BASE_API;
  const URL = `${baseUrl}${endpoints.category.add}`;

  const response = await fetch(URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(category),
  });

  if (!response.ok) {
    const errorDetails = await response.json();
    throw new Error(errorDetails.message || 'Error creating category');
  }

  return response.json();
}


export async function deleteCategory(categoryId: string, token: string) {
  const baseUrl = BASE_API;
  const URL = `${baseUrl}${endpoints.category.delete}/${categoryId}`;

  const response = await fetch(URL, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorDetails = await response.json();
    throw new Error(errorDetails.message || 'Error deleting category');
  }

  return response.json();
}

export async function updateCategory(categoryId: string, category: { name: string; description?: string }, token: string) {
  const baseUrl = BASE_API;
  const URL = `${baseUrl}${endpoints.category.edit}/${categoryId}`;

  const response = await fetch(URL, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(category),
  });

  if (!response.ok) {
    const errorDetails = await response.json();
    throw new Error(errorDetails.message || 'Error updating category');
  }

  return response.json();
}
