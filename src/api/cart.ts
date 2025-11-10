import { BASE_API } from "src/config-global";
import { endpoints } from "src/utils/axios";

export async function addCart(cart: { product_id: string;quantity?:number; variation_id?: string }, token: string) {
  const baseUrl = BASE_API;
  const URL = `${baseUrl}${endpoints.cart.add}`;
  const response = await fetch(URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(cart),
  });

  if (!response.ok) {
    const errorDetails = await response.json();
    throw new Error(errorDetails.message || 'Error creating category');
  }

  return response.json();
}