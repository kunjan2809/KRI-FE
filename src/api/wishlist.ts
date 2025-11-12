import { BASE_API } from "src/config-global";
import { endpoints } from "src/utils/axios";

export async function addWishlist(wishlist:{product_id:string}, token: string) {
  const baseUrl = BASE_API;
  const URL = `${baseUrl}${endpoints.wishlist.add}`;

  const response = await fetch(URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(wishlist),
  });

  if (!response.ok) {
    const errorDetails = await response.json();
    throw new Error(errorDetails.message || 'Error adding wishlist');
  }

  return response.json();
}

export async function removeWishlist(productId:string, token: string) {
  const baseUrl = BASE_API;
  const URL = `${baseUrl}${endpoints.wishlist.remove}${productId}`;

  const response = await fetch(URL, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorDetails = await response.json();
    throw new Error(errorDetails.message || 'Error removing wishlist');
  }

  return response.json();
}