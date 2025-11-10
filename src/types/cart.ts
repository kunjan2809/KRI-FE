export interface CartItemsApiResponse {
  success: boolean
  data: Data
}

export interface Data {
  cart_items: CartItem[]
  cart_summary: CartSummary
}

export interface CartItem {
  id: string
  product: CartProduct
  variation: Variation2
  quantity: number
  item_total: number
  added_at: string
  updated_at: string
}

export interface CartProduct {
  id: string
  name: string
  sku: string
  description: string
  product_description: string
  price: number
  mrp: number
  final_price: number
  discount_type: string
  discount_rate: number
  discount_amount: number
  stock_quantity: number
  in_stock: boolean
  low_stock: boolean
  weight: number
  status: string
  featured: boolean
  category: Category
  primary_image: CartPrimaryImage
  all_images: AllImage[]
  variations: Variation[]
  review_overview: ReviewOverview
  created_at: string
  edited_at: string
}

export interface Category {
  id: string
  name: string
}

export interface CartPrimaryImage {
  id: string
  image_url: string
  is_primary: boolean
}

export interface AllImage {
  id: string
  image_url: string
  is_primary: boolean
}

export interface Variation {
  id: string
  color: string
  size: string
  price: number
  stock_quantity: number
  sku: string
  status: string
}

export interface ReviewOverview {
  average_rating: number
  total_reviews: number
}

export interface Variation2 {
  id: string
  color: string
  size: string
  price: number
  price_adjustment: number
  stock_quantity: number
  sku: string
  status: string
}

export interface CartSummary {
  total_items: number
  cart_total: number
  items_count: number
}
