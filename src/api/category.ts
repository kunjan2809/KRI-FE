import useSWR from 'swr';
import { useMemo } from 'react';

import { BASE_API } from 'src/config-global';
import { apiFetcher, endpoints } from 'src/utils/axios';

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
