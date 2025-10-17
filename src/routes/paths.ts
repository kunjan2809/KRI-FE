// ----------------------------------------------------------------------

import { _id } from 'src/_mock/assets';


const ROOTS = {
  AUTH: '/auth',
  ADMIN: '/admin',
  DASHBOARD: '/admin/dashboard',
  USER: '/',
};
const MOCK_ID = _id[1];

// ----------------------------------------------------------------------

export const paths = {
  minimalUI: 'https://mui.com/store/items/minimal-dashboard/',
  // AUTH
  auth: {
    jwt: {
      login: `${ROOTS.AUTH}/jwt/login`,
      register: `${ROOTS.AUTH}/jwt/register`,
    },
  },
  // USER SITE
  user: {
    root: ROOTS.USER,
    landing: ROOTS.USER,
    products: {
      root: '/products',
      details: (id: string) => `/products/${id}`,
      demo: {
        details: `/products/${MOCK_ID}`,
      },
    },
    categories: {
      gifts: '/gifts',
      personalisation: '/personalisation',
      homeFavourites: '/home-favourites',
      fashion: '/fashion',
      registry: '/registry',
    },
    cart: '/cart',
    orderDetails: '/order-details',
    profile: '/profile',
    orders: '/orders',
    helpCenter: '/help-center',
    wishlist: '/wishlist',
  },
  // DASHBOARD
  dashboard: {
    root: ROOTS.DASHBOARD,
    order: {
      root: `${ROOTS.DASHBOARD}/order`,
      details: (id: string) => `${ROOTS.DASHBOARD}/order/${id}`,
      demo: {
        details: `${ROOTS.DASHBOARD}/order/${MOCK_ID}`,
      },
    },
    user: {
      root: `${ROOTS.DASHBOARD}/user`,
      new: `${ROOTS.DASHBOARD}/user/new`,
      list: `${ROOTS.DASHBOARD}/user/list`,
      cards: `${ROOTS.DASHBOARD}/user/cards`,
      profile: `${ROOTS.DASHBOARD}/user/profile`,
      account: `${ROOTS.DASHBOARD}/user/account`,
      edit: (id: string) => `${ROOTS.DASHBOARD}/user/${id}/edit`,
      demo: {
        edit: `${ROOTS.DASHBOARD}/user/${MOCK_ID}/edit`,
      },
    },
    product: {
      root: `${ROOTS.DASHBOARD}/product`,
      new: `${ROOTS.DASHBOARD}/product/new`,
      createNew: `${ROOTS.DASHBOARD}/product/create-new`,
      details: (id: string) => `${ROOTS.DASHBOARD}/product/${id}`,
      edit: (id: string) => `${ROOTS.DASHBOARD}/product/edit/${id}`,
      demo: {
        details: `${ROOTS.DASHBOARD}/product/${MOCK_ID}`,
        edit: `${ROOTS.DASHBOARD}/product/${MOCK_ID}/edit`,
      },
    },
    invoice: {
      root: `${ROOTS.DASHBOARD}/invoice`,
      new: `${ROOTS.DASHBOARD}/invoice/new`,
      details: (id: string) => `${ROOTS.DASHBOARD}/invoice/${id}`,
      edit: (id: string) => `${ROOTS.DASHBOARD}/invoice/${id}/edit`,
      demo: {
        details: `${ROOTS.DASHBOARD}/invoice/${MOCK_ID}`,
        edit: `${ROOTS.DASHBOARD}/invoice/${MOCK_ID}/edit`,
      },
    },
    category: {
      root: `${ROOTS.DASHBOARD}/category`,
    },
  },
};
