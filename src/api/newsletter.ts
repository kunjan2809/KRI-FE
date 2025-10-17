import { BASE_API } from 'src/config-global';
import { endpoints } from 'src/utils/axios';

// ----------------------------------------------------------------------

export interface INewsletterSubscribeRequest {
  email: string;
}

export interface INewsletterSubscribeResponse {
  success: boolean;
  message: string;
  data?: {
    email: string;
    subscribed_at: string;
  };
}

export async function subscribeToNewsletter(email: string): Promise<INewsletterSubscribeResponse> {
  const URL = `${BASE_API}${endpoints.newsletter.subscribe}`;

  const response = await fetch(URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to subscribe to newsletter');
  }

  return data;
}
