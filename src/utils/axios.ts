import axios, { AxiosRequestConfig } from 'axios';

import { BASE_API } from 'src/config-global';
import { SESSION_ACCESS_TOKEN, SESSION_USER_DATA } from './constants';

// ----------------------------------------------------------------------

const axiosInstance = axios.create({ baseURL: BASE_API });

axiosInstance.interceptors.response.use(
  (res) => res,
  (error) => {
    console.error('error', error);
    if (error.response.status === 401 && error.response.data.code === 'UNAUTHORIZED') {
      localStorage.removeItem(SESSION_ACCESS_TOKEN);
      localStorage.removeItem(SESSION_USER_DATA);
      window.location.href = '/login';
    }
    return Promise.reject((error.response && error.response.data) || 'Something went wrong');
  }
);

export default axiosInstance;

// ----------------------------------------------------------------------

export const fetcher = async (args: string | [string, AxiosRequestConfig]) => {
  const [url, config] = Array.isArray(args) ? args : [args];

  const res = await axiosInstance.get(url, { ...config });

  return res.data;
};

// Fetcher for Next.js API routes (same origin)
export const apiFetcher = async (args: string | [string, AxiosRequestConfig]) => {
  const [url, config] = Array.isArray(args) ? args : [args];

  const res = await axios.get(url, { ...config });

  return res.data;
};

export const apiProductFetcher = async (key: { url: string; token?: string }) => {
  const { url, token } = key;

  const headers: any = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(url, { headers });

  if (!response.ok) {
    const errorDetails = await response.json();
    throw new Error(errorDetails.message || 'Error fetching data');
  }

  return response.json();
};

// ----------------------------------------------------------------------

export const endpoints = {
  chat: '/api/chat',
  kanban: '/api/kanban',
  calendar: '/api/calendar',
  auth: {
    profile: '/api/auth/profile',
    me: '/api/auth/me',
    login: '/api/auth/login',
    register: '/api/auth/register',
    signup: '/api/auth/signup',
    forgetPassword: '/api/auth/forget-password',
    getUserAddress: '/api/addresses',
    resetPassword: '/api/auth/reset-password',
    changePassword: '/api/auth/change-password',
  },
  analytics: {
    dashboard: '/api/analytics/dashboard/',
    orders: '/api/analytics/orders/',
    users: '/api/analytics/users/',
    categories: '/api/analytics/categories/',
    revenue: '/api/analytics/revenue/',
    yearlyOrders: '/api/analytics/yearly/',
    status: '/api/analytics/users/status',
    orderStatus:'/api/orders/admin/statistics/order-status'
  },
  mail: {
    list: '/api/mail/list',
    details: '/api/mail/details',
    labels: '/api/mail/labels',
  },
  post: {
    list: '/api/post/list',
    details: '/api/post/details',
    latest: '/api/post/latest',
    search: '/api/post/search',
  },
  product: {
    productAll: '/api/products/all',
    productSuggestion: '/api/products/suggestions',
    list: '/api/product/list',
    details: '/api/products/details/',
    search: '/api/product/search',
    all: '/api/products/admin/all',
    create: '/api/products/admin/add',
    update: '/api/products/admin/edit/',
    delete: '/api/products/admin/delete/',
    detailsById: '/api/products/admin/details/',
    quantity: '/api/products/admin/quantity/',
    status: '/api/products/admin/status/',
    featured: '/api/products/featured',
    addVariations: '/api/products/admin/:productId/variations',
    editVariations: '/api/products/admin/:productId/variations/:variationId',
    deleteVariations: '/api/products/admin/:productId/variations/:variationId',
    featuredtStatus: '/api/products/admin/featured',
    suggestions: '/api/products/suggestions/',
  },
  cart: {
    all: '/api/cart',
    add: '/api/cart/add',
    remove: '/api/cart/remove',
    update: '/api/cart/update',
    place: '/api/orders/place',
  },
  shipment: {
    add: '/api/addresses',
    getAll: '/api/addresses',
    getDefault: '/api/addresses/default',
  },
  image: {
    product: '/api/images/product/',
    review: '/api/images/review/',
  },
  order: {
    all: '/api/orders/admin/all',
    updateStatus: '/api/orders/',
    details: '/api/orders/admin/details/',
    delivery: '/api/orders/admin/delivery/',
    create: '/api/orders/admin/create/',
    update: '/api/orders/admin/update/',
    delete: '/api/orders/admin/delete/',
    statistics: '/api/orders/admin/statistics',
    export: '/api/orders/admin/export',
    orderDetails: '/api/orders/',
    returnRequest: '/api/orders/:orderId/return',
  },
  user: {
    all: '/api/users/admin/all',
    status: '/api/users/admin/status/',
  },
  category: {
    all: '/api/category/all',
    add: '/api/category/add',
    edit: '/api/category/edit',
    delete: '/api/category/delete',
   variation:'/api/products/variation-options'
  },
  wishlist: {
    all: '/api/wishlist',
    add: '/api/wishlist/add',
    remove: '/api/wishlist/remove/',
  },
  newsletter: {
    subscribe: '/api/leads/subscribe',
  },
  reviews: {
    add: '/api/reviews/product/',
    all: '/api/reviews/product/',
  },
  shipping: {
    add: '/api/addresses',
    delete: '/api/addresses/',
    edit: '/api/addresses/',
  },
};
