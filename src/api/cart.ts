
import useSWR from 'swr';

import { endpoints, } from 'src/utils/axios';

import { BASE_API } from 'src/config-global';
import { Address } from 'src/types/cart';

export interface AddNewAddressPayload {
  full_name: string
  mobile_number: string
  address_line_1: string
  address_line_2: string
  landmark: string
  city: string
  state: string
  postal_code: string
  country: string
  is_default: boolean
}
export interface CheckoutPayload {
  cart_item_ids: string[]
  shipping_address_id: string
  payment_method: string
  discount_type?: string
  discount_rate?: number
}


// get all cart iteam
export async function getAllCartProducts(token: string) {

  const URL = `${BASE_API}${endpoints.cart.all}`;

  const response = await fetch(URL, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorDetails = await response.json();
    throw new Error(errorDetails.message || 'falied to fetching Cart Iteam');
  }
  return response.json();
}

// post req for add to cart
export async function AddToCart(token: string, productId: string, variationId?: string,) {

  const URL = `${BASE_API}${endpoints.cart.add}`;

  const response = await fetch(URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ product_id: productId, variation_id: variationId })
  });

  if (!response.ok) {
    const errorDetails = await response.json();
    throw new Error(errorDetails.message || 'Failed To add Product');
  }
  return response.json();
}

export async function removeItemFromCart(cartItemId: string, token: string) {

  const URL = `${BASE_API}${endpoints.cart.remove}/${cartItemId}`;

  const response = await fetch(URL, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorDetails = await response.json();
    throw new Error(errorDetails.message || 'Failed To remove Item');
  }

  return response.json();
}
export async function updateItemQuantity(cartItemId: string, token: string, quantity: number) {

  const URL = `${BASE_API}${endpoints.cart.update}/${cartItemId}`;

  const response = await fetch(URL, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ quantity })
  });

  if (!response.ok) {
    const errorDetails = await response.json();
    throw new Error(errorDetails.message || 'Failed To Update ItemQuantity');
  }

  return response.json();
}

export async function placeOrder( token: string,checkoutData:CheckoutPayload) {

  const URL = `${BASE_API}${endpoints.cart.place}`;

  const response = await fetch(URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(checkoutData)
  });

  if (!response.ok) {
    const errorDetails = await response.json();
    throw new Error(errorDetails.message || 'Failed To Update ItemQuantity');
  }

  return response.json();
}

export async function getAllAddress( token: string,) {

  const URL = `${BASE_API}${endpoints.shipment.getAll}`;

  const response = await fetch(URL, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorDetails = await response.json();
    throw new Error(errorDetails.message || 'Failed To Update ItemQuantity');
  }

  return response.json();
}
export async function getDefalutAddress( token: string,) {

  const URL = `${BASE_API}${endpoints.shipment.getDefault}`;

  const response = await fetch(URL, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorDetails = await response.json();
    throw new Error(errorDetails.message || 'Failed To Update ItemQuantity');
  }

  return response.json();
}

export async function postNewAddress( token: string,address:AddNewAddressPayload) {

  const URL = `${BASE_API}${endpoints.shipment.add}`;

  const response = await fetch(URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body:JSON.stringify(address)
  });

  if (!response.ok) {
    const errorDetails = await response.json();
    throw new Error(errorDetails.message || 'Failed To Update ItemQuantity');
  }

  return response.json();
}
















