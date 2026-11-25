
import useSWR from "swr";
import { useMemo } from "react";

import { BASE_API } from "src/config-global";
import { apiProductFetcher, endpoints } from "src/utils/axios";
import { OrderStatistics } from "src/types/analytics";


//------------------------------------------------------------------------------------


export function useGetDashboardAnalytics(token: string) {
    const baseUrl = BASE_API;
    const URL = `${baseUrl}${endpoints.analytics.dashboard}`;

    const { data, isLoading, error, isValidating } = useSWR(
        token ? { url: URL, token } : null,
        apiProductFetcher,
        {
            revalidateOnFocus: false,
            revalidateOnReconnect: false,
            errorRetryCount: 3,
            onError: (err) => {
                console.error('useGetDashboardAnalytics error:', err);
            }
        });

    const memoizedValue = useMemo(() => ({
        analytics: data?.data as any,
        analyticsLoading: isLoading,
        analyticsError: error,
        analyticsValidating: isValidating,
    }),
        [data?.data, error, isLoading, isValidating]
    );

    return memoizedValue;
}

export function useGetDashboardAnalyticsUser(token: string) {
    const baseUrl = BASE_API;
    const URL = `${baseUrl}${endpoints.analytics.users}`;

    const { data, isLoading, error, isValidating } = useSWR(
        token ? { url: URL, token } : null,
        apiProductFetcher,
        {
            revalidateOnFocus: false,
            revalidateOnReconnect: false,
            errorRetryCount: 3,
            onError: (err) => {
                console.error('useGetDashboardAnalyticsUser error:', err);
            }
        });

    const memoizedValue = useMemo(() => ({
        users: data?.data as any,
        usersLoading: isLoading,
        usersError: error,
        usersValidating: isValidating,
    }),
        [data?.data, error, isLoading, isValidating]
    );

    return memoizedValue;
}

export function useGetDashboardAnalyticsOrderCategory(token: string) {
    const baseUrl = BASE_API;
    const URL = `${baseUrl}${endpoints.analytics.categories}`;

    const { data, isLoading, error, isValidating } = useSWR(
        token ? { url: URL, token } : null,
        apiProductFetcher,
        {
            revalidateOnFocus: false,
            revalidateOnReconnect: false,
            errorRetryCount: 3,
            onError: (err) => {
                console.error('useGetDashboardAnalyticsOrderCategory error:', err);
            }
        });

    const memoizedValue = useMemo(() => ({
        orderCategory: data?.data as any,
        orderCategoryLoading: isLoading,
        orderCategoryError: error,
        orderCategoryValidating: isValidating,
    }),
        [data?.data, error, isLoading, isValidating]
    );

    return memoizedValue;
}

export function useGetDashboardAnalyticsOrders(token: string) {
    const baseUrl = BASE_API;
    const URL = `${baseUrl}${endpoints.analytics.orders}`;

    const { data, isLoading, error, isValidating } = useSWR(
        token ? { url: URL, token } : null,
        apiProductFetcher,
        {
            revalidateOnFocus: false,
            revalidateOnReconnect: false,
            errorRetryCount: 3,
            onError: (err) => {
                console.error('useGetDashboardAnalyticsOrders error:', err);
            }
        });

    const memoizedValue = useMemo(() => ({
        orders: data?.data as any,
        ordersLoading: isLoading,
        ordersError: error,
        ordersValidating: isValidating,
    }),
        [data?.data, error, isLoading, isValidating]
    );

    return memoizedValue;
}

export function useGetDashboardAnalyticsRevenue(token: string) {
    const baseUrl = BASE_API;
    const URL = `${baseUrl}${endpoints.analytics.revenue}`;

    const { data, isLoading, error, isValidating } = useSWR(
        token ? { url: URL, token } : null,
        apiProductFetcher,
        {
            revalidateOnFocus: false,
            revalidateOnReconnect: false,
            errorRetryCount: 3,
            onError: (err) => {
                console.error('useGetDashboardAnalyticsRevenue error:', err);
            }
        });

    const memoizedValue = useMemo(() => ({
        revenue: data?.data as any,
        revenueLoading: isLoading,
        revenueError: error,
        revenueValidating: isValidating,
    }),
        [data?.data, error, isLoading, isValidating]
    );

    return memoizedValue;
}

export function useGetDashboardAnalyticsYearlyOrders(token: string, year: string) {
    const baseUrl = BASE_API;
    const URL = `${baseUrl}${endpoints.analytics.yearlyOrders}${year}`;

    const { data, isLoading, error, isValidating } = useSWR(
        token ? { url: URL, token, year } : null,
        apiProductFetcher,
        {
            revalidateOnFocus: false,
            revalidateOnReconnect: false,
            errorRetryCount: 3,
            onError: (err) => {
                console.error('useGetDashboardAnalyticsYearlyOrders error:', err);
            }
        });

    const memoizedValue = useMemo(() => ({
        yearlyOrders: data?.data as any,
        yearlyOrdersLoading: isLoading,
        yearlyOrdersError: error,
        yearlyOrdersValidating: isValidating,
    }),
        [data?.data, error, isLoading, isValidating]
    );

    return memoizedValue;
}
export function useGetUserStatus(token: string) {
    const baseUrl = BASE_API;
    const URL = `${baseUrl}${endpoints.analytics.status}`;

    const { data, isLoading, error, isValidating } = useSWR(
        token ? { url: URL, token } : null,
        apiProductFetcher,
        {
            revalidateOnFocus: false,
            revalidateOnReconnect: false,
            errorRetryCount: 3,
            onError: (err) => {
                console.error('useGetUserStatus error:', err);
            }
        });

    const memoizedValue = useMemo(() => ({
        usercount: data?.data as any,
        userloading: isLoading,
        userError: error,
        userValidating: isValidating,
    }),
        [data?.data, error, isLoading, isValidating]
    );

    return memoizedValue;
}

export function useGetOrderStatus(token: string) {
    const baseUrl = BASE_API;
    const URL = `${baseUrl}${endpoints.analytics.orderStatus}`;

    const { data, isLoading, error, isValidating } = useSWR(
        token ? { url: URL, token } : null,
        apiProductFetcher,
        {
            revalidateOnFocus: false,
            revalidateOnReconnect: false,
            errorRetryCount: 3,
            onError: (err) => {
                console.error('useGetUserStatus error:', err);
            }
        });

    const memoizedValue = useMemo(() => ({
        orderStatic: data?.data as OrderStatistics,
        orderStatusloading: isLoading,
        orderStatusrError: error,
        orderStatusValidating: isValidating,
    }),
        [data?.data, error, isLoading, isValidating]
    );

    return memoizedValue;
}
