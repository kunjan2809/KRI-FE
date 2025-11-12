import useSWR from 'swr';

import { BASE_API } from 'src/config-global';
import { endpoints, apiProductFetcher } from 'src/utils/axios';

import { AddAddress, GetUserInfoRes, IUserStatus, UserPersonalInfo } from 'src/types/user';

// ----------------------------------------------------------------------

interface GetUsersParams {
  page?: number;
  limit?: number;
  search?: string;
  status_filter?: string[];
}

export function useGetUsers(params: GetUsersParams, token: string) {
  const { page = 1, limit = 20, search = '', status_filter = [] } = params;

  const baseUrl = BASE_API;

  // Build query string with parameters
  const queryParams = new URLSearchParams();
  queryParams.append('page', page.toString());
  queryParams.append('limit', limit.toString());

  if (status_filter.length > 0) {
    status_filter.forEach((filter) => queryParams.append('status_filter', filter));
  }

  if (search) {
    queryParams.append('search', search);
  }

  const URL = `${baseUrl}${endpoints.user.all}?${queryParams.toString()}`;

  const { data, error, isLoading } = useSWR(token ? { url: URL, token } : null, apiProductFetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    errorRetryCount: 3,
  });

  if (error) {
    console.error('useGetUsers error:', error);
  }

  return {
    data: data?.data || [],
    error,
    isLoading,
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

export async function getAllAddress(token: string) {
  const baseUrl = BASE_API;
  const URL = `${baseUrl}${endpoints.auth.getUserAddress}`;

  const response = await fetch(URL, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorDetails = await response.json();
    throw new Error(errorDetails.message || 'Error updating user address');
  }

  return response.json();
}

export async function resetPassword(new_password:string, token: string) {
  const baseUrl = BASE_API;
  const URL = `${baseUrl}${endpoints.auth.resetPassword}`;
  const body = {
    token,
    new_password
  }
  const response = await fetch(URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorDetails = await response.json();
    throw new Error(errorDetails.message || 'Error reset password');
  }

  return response.json();
}

interface Password {
  old_password:string,
  new_password:string
}
export async function changePassword(password:Password, token: string) {
  const baseUrl = BASE_API;
  const URL = `${baseUrl}${endpoints.auth.changePassword}`;
  const response = await fetch(URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(password),
  });

  if (!response.ok) {
    const errorDetails = await response.json();
    throw new Error(errorDetails.message || 'Error change password');
  }

  return response.json();
}

export async function addAddress(addressData: AddAddress, token: string) {
  const baseUrl = BASE_API;
  const URL = `${baseUrl}${endpoints.shipping.add}`;

  const response = await fetch(URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(addressData),
  });

  if (!response.ok) {
    const errorDetails = await response.json();
    throw new Error(errorDetails.message || 'Error adding address');
  }

  return response.json();
}

export async function editAddress( addressId: string, addressData:AddAddress, token: string) {
  const baseUrl = BASE_API;
  const url = `${baseUrl}${endpoints.shipping.edit}${addressId}`;

  const response = await fetch(url, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(addressData),
  });

  if (!response.ok) {
    const errorDetails = await response.json();
    throw new Error(errorDetails.message || 'Error updating address');
  }

  return response.json();
}

export async function updateUserInfo(personalInfo: UserPersonalInfo, token: string) {
  const baseUrl = BASE_API;
  const URL = `${baseUrl}${endpoints.auth.profile}`;

  const response = await fetch(URL, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(personalInfo),
  });

  if (!response.ok) {
    const errorDetails = await response.json();
    throw new Error(errorDetails.message || 'Error updating user info');
  }

  return response.json();
}

export async function getUserInfo(token: string) {
  const baseUrl = BASE_API;
  const URL = `${baseUrl}${endpoints.auth.profile}`;

  const response = await fetch(URL, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorDetails = await response.json();
    throw new Error(errorDetails.message || 'Error getting user info');
  }

  return response.json();
}

export async function deleteAddress(userId: string, token: string) {
  const baseUrl = BASE_API;
  const url = `${baseUrl}${endpoints.shipping.delete}${userId}`;

  const response = await fetch(url, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorDetails = await response.json();
    throw new Error(errorDetails.message || 'Error deleting address');
  }

  return response.json();
}
