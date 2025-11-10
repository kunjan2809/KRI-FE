


import { endpoints, } from 'src/utils/axios';

import { BASE_API } from 'src/config-global';


// ----------------------------------------------------------------------


// get all wishlist iteam 
export async function getAllWishlist(token: string) {

  const URL = `${BASE_API}${endpoints.wishlist.all}`;

  const response = await fetch(URL, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorDetails = await response.json();
    throw new Error(errorDetails.message || 'Error fetching wishlist');
  }
  return response.json();
}

// add the wishlist 
export async function addWishlist(productId: string, token: string) {

  const URL = `${BASE_API}${endpoints.wishlist.add}`;

  const response = await fetch(URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ product_id: productId })
  });

  if (!response.ok) {
    const errorDetails = await response.json();
    return errorDetails
  }
  return response.json();
}
// remove the wishlist
export async function removeWishlist(productId: string, token: string) {

  const URL = `${BASE_API}${endpoints.wishlist.remove}/${productId}`;

  const response = await fetch(URL, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorDetails = await response.json();
    throw new Error(errorDetails.message || 'Failed To remove  wishlist');
  }

  return response.json();
}

