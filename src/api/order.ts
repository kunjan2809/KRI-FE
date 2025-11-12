import useSWR from 'swr';
import { useMemo } from 'react';

import { BASE_API } from 'src/config-global';
import { apiFetcher, endpoints, apiProductFetcher } from 'src/utils/axios';
import { useAuthToken } from 'src/auth/hooks';

import { 
  IOrderItem, 
  IOrderCreateRequest, 
  IOrderUpdateRequest, 
  IOrderStatus, 
  IOrderPaymentStatus, 
  IOrderDeliveryUpdate, 
  IOrderItemTableData,
  Order
} from 'src/types/order';

// ----------------------------------------------------------------------

interface GetOrdersParams {
  page?: number;
  limit?: number;
  order_status?: string;
  payment_status?: string;
  start_date?: string;
  end_date?: string;
  search?: string;
  sort_by?: 'created_at' | 'total_amount' | 'order_status';
  sort_order?: 'asc' | 'desc';
}

export async function getUserAllOrders(token: string) {
  const baseUrl = BASE_API;
  const URL = `${baseUrl}${endpoints.order.updateStatus}`;

  const response = await fetch(URL, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorDetails = await response.json();
    throw new Error(errorDetails.message || 'Error updating order');
  }

  return response.json();
}
export function useGetOrders(params: GetOrdersParams = {}) {
  const {
    page = 1,
    limit = 20,
    order_status = '',
    payment_status = '',
    start_date = '',
    end_date = '',
    search = '',
    sort_by = 'created_at',
    sort_order = 'desc'
  } = params;
  const token = useAuthToken();
  const baseUrl = BASE_API;

  // Build query string with parameters
  const queryParams = new URLSearchParams();
  queryParams.append('page', page.toString());
  queryParams.append('limit', limit.toString());
  queryParams.append('sort_by', sort_by);
  queryParams.append('sort_order', sort_order);

  if (order_status) {
    queryParams.append('order_status', order_status);
  }

  if (payment_status) {
    queryParams.append('payment_status', payment_status);
  }

  if (start_date) {
    queryParams.append('start_date', start_date);
  }

  if (end_date) {
    queryParams.append('end_date', end_date);
  }

  if (search) {
    queryParams.append('search', search);
  }

  const URL = `${baseUrl}${endpoints.order.all}?${queryParams.toString()}`;

  const { data, isLoading, error, isValidating } = useSWR(
    token ? { url: URL, token } : null,
    apiProductFetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      errorRetryCount: 3,

      onError: (err) => {
        console.error('useGetOrders error:', err);
      },
    });

  const memoizedValue = useMemo(
    () => ({
      orders: (data?.data?.orders as Order[]) || [],
      pagination: data?.data?.pagination || null,
      filters: data?.data?.filters || null,
      sorting: data?.data?.sorting || null,
      ordersLoading: isLoading,
      ordersError: error,
      ordersValidating: isValidating,
      ordersEmpty: !isLoading && !data?.data?.orders?.length,
    }),
    [data?.data?.orders, data?.data?.pagination, data?.data?.filters, data?.data?.sorting, error, isLoading, isValidating]
  );

  return memoizedValue;
}

// ----------------------------------------------------------------------

export function useGetOrder(orderId: string) {
  const token = useAuthToken();
  const baseUrl = BASE_API;
  const URL = orderId ? `${baseUrl}${endpoints.order.details}${orderId}` : '';

  const { data, isLoading, error, isValidating } = useSWR(
    token && orderId ? { url: URL, token } : null,
    apiProductFetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      errorRetryCount: 3,
      onError: (err) => {
        console.error('useGetOrder error:', err);
      }
    });

  const memoizedValue = useMemo(
    () => ({
      order: data?.data?.order as IOrderItem,
      orderLoading: isLoading,
      orderError: error,
      orderValidating: isValidating,
    }),
    [data?.data?.order, error, isLoading, isValidating]
  );

  return memoizedValue;
}

// ----------------------------------------------------------------------

export function useSearchOrders(query: string) {
  const URL = query ? [endpoints.order.all, { params: { search: query } }] : '';

  const { data, isLoading, error, isValidating } = useSWR(URL, apiFetcher, {
    keepPreviousData: true,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    errorRetryCount: 3,
    onError: (err) => {
      console.error('useSearchOrders error:', err);
    }
  });

  const memoizedValue = useMemo(
    () => ({
      searchResults: (data?.results as IOrderItem[]) || [],
      searchLoading: isLoading,
      searchError: error,
      searchValidating: isValidating,
      searchEmpty: !isLoading && !data?.results?.length,
    }),
    [data?.results, error, isLoading, isValidating]
  );

  return memoizedValue;
}

// ----------------------------------------------------------------------

export async function createOrder(orderData: IOrderCreateRequest, token: string) {
  const baseUrl = BASE_API;
  const URL = `${baseUrl}${endpoints.order.create}`;

  const response = await fetch(URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(orderData),
  });

  if (!response.ok) {
    const errorDetails = await response.json();
    throw new Error(errorDetails.message || 'Error creating order');
  }

  return response.json();
}

// ----------------------------------------------------------------------

export async function updateOrder(orderId: string, orderData: IOrderUpdateRequest, token: string) {
  const baseUrl = BASE_API;
  const URL = `${baseUrl}${endpoints.order.update}${orderId}`;

  const response = await fetch(URL, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(orderData),
  });

  if (!response.ok) {
    const errorDetails = await response.json();
    throw new Error(errorDetails.message || 'Error updating order');
  }

  return response.json();
}

// ----------------------------------------------------------------------

export async function getOrderById(orderId: string, token: string) {
  const baseUrl = BASE_API;
  const URL = `${baseUrl}${endpoints.order.details}${orderId}`;

  const response = await fetch(URL, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorDetails = await response.json();
    throw new Error(errorDetails.message || 'Error fetching order');
  }

  return response.json();
}

// ----------------------------------------------------------------------

export async function updateOrderStatus(orderId: string, orderStatus: IOrderStatus, token: string) {
  const baseUrl = BASE_API;
  const URL = `${baseUrl}${endpoints.order.updateStatus}${orderId}/status`;

  const response = await fetch(URL, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(orderStatus),
  });

  if (!response.ok) {
    const errorDetails = await response.json();
    throw new Error(errorDetails.message || 'Error updating order status');
  }

  return response.json();
}

// ----------------------------------------------------------------------

export async function updateOrderPaymentStatus(orderId: string, paymentStatus: IOrderPaymentStatus, token: string) {
  const baseUrl = BASE_API;
  const URL = `${baseUrl}${endpoints.order.details}${orderId}/payment-status`;

  const response = await fetch(URL, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(paymentStatus),
  });

  if (!response.ok) {
    const errorDetails = await response.json();
    throw new Error(errorDetails.message || 'Error updating payment status');
  }

  return response.json();
}

// ----------------------------------------------------------------------

export async function updateOrderDelivery(orderId: string, deliveryData: IOrderDeliveryUpdate, token: string) {
  const baseUrl = BASE_API;
  const URL = `${baseUrl}${endpoints.order.delivery}${orderId}`;

  const response = await fetch(URL, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(deliveryData),
  });

  if (!response.ok) {
    const errorDetails = await response.json();
    throw new Error(errorDetails.message || 'Error updating delivery information');
  }

  return response.json();
}

// ----------------------------------------------------------------------

export async function deleteOrder(orderId: string, token: string) {

  const baseUrl = BASE_API;
  const URL = `${baseUrl}${endpoints.order.delete}${orderId}`;

  const response = await fetch(URL, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorDetails = await response.json();
    throw new Error(errorDetails.message || 'Error deleting order');
  }

  return response.json();
}

// ----------------------------------------------------------------------

export async function getOrderStatistics(token: string, params: {
  start_date?: string;
  end_date?: string;
  status?: string;
} = {}) {
  const baseUrl = BASE_API;
  const queryParams = new URLSearchParams();
  
  if (params.start_date) queryParams.append('start_date', params.start_date);
  if (params.end_date) queryParams.append('end_date', params.end_date);
  if (params.status) queryParams.append('status', params.status);

  const URL = `${baseUrl}${endpoints.order.statistics}?${queryParams.toString()}`;

  const response = await fetch(URL, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorDetails = await response.json();
    throw new Error(errorDetails.message || 'Error fetching order statistics');
  }

  return response.json();
}

// ----------------------------------------------------------------------

export async function exportOrders(token: string, params: {
  format?: 'csv' | 'excel' | 'pdf';
  start_date?: string;
  end_date?: string;
  status?: string;
  payment_status?: string;
} = {}) {
  const baseUrl = BASE_API;
  const queryParams = new URLSearchParams();
  
  if (params.format) queryParams.append('format', params.format);
  if (params.start_date) queryParams.append('start_date', params.start_date);
  if (params.end_date) queryParams.append('end_date', params.end_date);
  if (params.status) queryParams.append('status', params.status);
  if (params.payment_status) queryParams.append('payment_status', params.payment_status);

  const URL = `${baseUrl}${endpoints.order.export}?${queryParams.toString()}`;

  const response = await fetch(URL, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorDetails = await response.json();
    throw new Error(errorDetails.message || 'Error exporting orders');
  }

  return response.blob();
}
