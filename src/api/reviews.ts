import { enqueueSnackbar } from 'notistack';
import { BASE_API } from 'src/config-global';
import { IUploadReviewImage } from 'src/types/product';
import { ReviewResponseRoot, ReviewRoot } from 'src/types/reviews';
import { endpoints } from 'src/utils/axios';

interface Review {
  title: string;
  rating_description: string;
  rating: number;
  order_id?: string;
}

export async function addReview(
  productId: string,
  reviewImageData: IUploadReviewImage,
  review: Review,
  token: string
) {
  const baseUrl = BASE_API;
  const URL = `${baseUrl}${endpoints.reviews.add}${productId}`;
  console.log('review', review)
  const response = await fetch(URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(review),
  });

  if (!response.ok) {
    const errorDetails = await response.json();
    throw new Error(errorDetails.message || 'Error creating category');
  }
  
  const data: ReviewResponseRoot = await response.json();
  const reviewId = data.data.review._id
  try{
    if(reviewId){
      const reviewImg = reviewImageData.file?.forEach((reviewImage)=>{
        console.log('reviewImage', reviewImage)
         uploadReviewImage(reviewId,reviewImage,token)
      })
    }
  }catch(err){
     const errorMessage = err instanceof Error ? err.message : 'Failed to fetch image';
          enqueueSnackbar(errorMessage, { variant: 'error' });
  }

  return data;
}

export async function getReviewDetail(productId: string, token: string) {
  const baseUrl = BASE_API;
  const URL = `${baseUrl}${endpoints.reviews.all}${productId}`;

  const response = await fetch(URL, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorDetails = await response.json();
    throw new Error(errorDetails.message || 'Error fetching product');
  }

  const data: ReviewRoot = await response.json();
  return data;
}

export async function uploadReviewImage(
  reviewId: string,
  reviewImage: File,
  token: string
) {
  const baseUrl = BASE_API;
  const URL = `${baseUrl}${endpoints.image.review}${reviewId}`;

  const formData = new FormData();

  // If file is provided, append it; otherwise use image_url
  if (reviewImage) {
    formData.append('image', reviewImage);
  } else {
    throw new Error('Either file or image_url must be provided');
  }

  formData.append('review_id', reviewId);
  
  const response = await fetch(URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!response.ok) {
    const errorDetails = await response.json();
    throw new Error(errorDetails.message || 'Error uploading review image');
  }


  return response.json();
}
