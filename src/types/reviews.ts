export interface ReviewRoot {
  success: boolean
  data: Data
}

export interface Data {
  product: Product
  reviews: Reviews
}

export interface Product {
  _id: string
  name: string
  sku: string
}

export interface Reviews {
  summary: Summary
  details: Detail[]
}

export interface Summary {
  average_rating: number
  total_reviews: number
  rating_distribution: RatingDistribution[]
}

export interface RatingDistribution {
  _id: number
  count: number
}

export interface Detail {
  _id: string
  product_id: string
  user_id: UserId
  title: string
  rating: number
  rating_description: string
  order_id: string
  created_at: string
  edited_at: string
  images: Image[]
}

export interface UserId {
  _id: string
  first_name: string
  last_name: string
  email: string
  profile_icon:string
}

export interface Image {
  _id: string
  review_id: string
  image_url: string
  created_at: string
}

//response
export interface ReviewResponseRoot {
  success: boolean
  message: string
  data: DataResponse
}

export interface DataResponse {
  review: ReviewResponse
}

export interface ReviewResponse {
  _id: string
  product_id: string
  user_id: UserId
  title: string
  rating_description: string
  rating: number
  order_id: any
  created_at: string
  edited_at: string
}

export interface UserIdResponse {
  _id: string
  first_name: string
  last_name: string
  email: string
  full_name: string
  id: string
}
