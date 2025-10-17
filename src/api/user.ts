
import useSWR from 'swr';

import { BASE_API } from 'src/config-global';
import { endpoints, apiProductFetcher } from 'src/utils/axios';

import { IUserStatus } from 'src/types/user';

// ----------------------------------------------------------------------

interface GetUsersParams {
    page?: number;
    limit?: number;
    search?: string;
    status_filter?: string[];
}

export function useGetUsers(params: GetUsersParams, token: string) {
    const {
        page = 1,
        limit = 20,
        search = '',
        status_filter = [],
    } = params;

    const baseUrl = BASE_API;

    // Build query string with parameters
    const queryParams = new URLSearchParams();
    queryParams.append('page', page.toString());
    queryParams.append('limit', limit.toString());

    if (status_filter.length > 0) {
        status_filter.forEach(filter => queryParams.append('status_filter', filter));
    }

    if (search) {
        queryParams.append('search', search);
    }

    const URL = `${baseUrl}${endpoints.user.all}?${queryParams.toString()}`;

    const { data, error, isLoading } = useSWR(
        token ? { url: URL, token } : null,
        apiProductFetcher,
        {
            revalidateOnFocus: false,
            revalidateOnReconnect: false,
            errorRetryCount: 3,
        }
    );

    if (error) {
        console.error('useGetUsers error:', error);
    }

    return {
        data: data?.data || [],
        error,
        isLoading
    };
}

export async function updateUserStatus(userId: string, userStatus: IUserStatus, token: string) {
    const baseUrl = BASE_API;
    const URL = `${baseUrl}${endpoints.user.status}${userId}`;

    const response = await fetch(URL, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(userStatus),
    });

    if (!response.ok) {
        const errorDetails = await response.json();
        throw new Error(errorDetails.message || 'Error updating user status');
    }

    return response.json();
}
