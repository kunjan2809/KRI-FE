// ----------------------------------------------------------------------

export type IProductFilterValue = string | string[] | number | number[];

export type IProductFilters = {
  rating: string;
  gender: string;
  category: string;
  colors: string[];
  priceRange: number[];
};

// ----------------------------------------------------------------------

export type IProductReviewNewForm = {
  title: string;
  rating: number;
  rating_description: string;
  order_id?: string;
};

export type IProductReview = {
  id: string;
  name: string;
  rating: number;
  comment: string;
  helpful: number;
  avatarUrl: string;
  isPurchased: boolean;
  attachments?: string[];
  postedAt: Date;
};

export type IProductItem = {
  id: string;
  sku: string;
  name: string;
  code: string;
  price: number;
  taxes: number;
  tags: string[];
  gender: string;
  sizes: string[];
  publish: string;
  coverUrl: string;
  primary_image: {
    image_url:string
  };
  mrp:string;
  stock_quantity:number;
  images: string[];
  colors: string[];
  quantity: number;
  category: string;
  available: number;
  totalSold: number;
  description: string;
  totalRatings: number;
  totalReviews: number;
  inventoryType: string;
  subDescription: string;
  priceSale: number | null;
  reviews: IProductReview[];
  createdAt: Date;
  wishlist: boolean;
  ratings: {
    name: string;
    starCount: number;
    reviewCount: number;
  }[];
  saleLabel: {
    enabled: boolean;
    content: string;
  };
  newLabel: {
    enabled: boolean;
    content: string;
  };
};

export type IProductTableFilterValue = string | string[];

export type IProductTableFilters = {
  stock: string[];
  publish: string[];
  search: string;
};

// ----------------------------------------------------------------------

// New API response types based on the provided structure
export type IProductImage = {
  image_url: string;
  is_primary: boolean;
};

export type IProductImageForm = {
  file?: File | null | undefined;
  url?: string | null | undefined;
  id: string;
  isFile: boolean;
  primary: boolean;
};

export type IUploadProductImage = {
  product_id?: string;
  image_url?: string;
  is_primary: boolean;
  file?: File[];
};

export type IUploadReviewImage = {
  review_id?: string;
  image_url?: string;
  file?: File[];
};

export type IProductCategory = {
  _id: string;
  name: string;
};

export type IProductAPIResponse = {
  _id: string;
  name: string;
  sku: string;
  description: string;
  price: number;
  discount_type: string | null;
  discount_rate: number;
  mrp: number;
  stock_quantity: number;
  color: string;
  weight: number;
  status: string;
  category_id: IProductCategory;
  deleted_at: string | null;
  final_price: number;
  discount_amount: number;
  in_stock: boolean;
  low_stock: boolean;
  is_deleted: boolean;
  created_at: string;
  edited_at: string;
  primary_image: IProductImage;
  variations: IProductVariantRowResponse[];
};

export type IProductCreateRequest = {
  name: string;
  sku: string;
  description: string;
  pricing: Pricing;
  stock_quantity: number;
  weight: number;
  status: string;
  category_id: string;
  variations: IProductCraeteVariation[];
};

export type IProductUpdateRequest = {
  _id?: string;
  name?: string;
  sku?: string;
  description?: string;
  price?: number;
  discount_type?: string | null;
  mrp?: number;
  discount_rate?: number;
  stock_quantity?: number;
  weight?: number;
  status?: string;
  category_id?: string;
  primary_image?: {
    _id?: string;
    product_id?: string;
    image_url?: string;
    is_primary?: boolean;
  };
};

export interface EditProductRequest {
  name: string;
  sku: string;
  description: string;
  product_description: string;
  price: string;
  mrp: string;
  discount_type: string | null;
  discount_rate: string | null;
  stock_quantity: string;
  weight: string;
  status: string;
  category_id: string;
}

export type Pricing = {
  mrp: number;
  price: number;
  discount_type: string | null | undefined;
  discount_rate: number | undefined;
};

export type IProductCraeteVariation = {
  color: string;
  size: string;
  sku: string;
  price: number;
  stock_quantity: number;
  status: string;
};

export type IProductQuantity = {
  quantity: number;
};

export type IProductStatus = {
  status: string;
};

export type IProductVariantRow = {
  id: string;
  color: string;
  size: string;
  sku: string;
  price: number;
  stock_quantity: number;
  isLocal?: boolean;
};

export type IProductVariantRowResponse = {
  _id: string;
  color: string;
  size: string;
  sku: string;
  price: number;
  stock_quantity: number;
  status: string;
};

export interface ProductDetailsRoot {
  success: boolean;
  data: ProductDetailsData;
}

export interface ProductDetailsData {
  product: Product;
  reviews: Reviews;
}

export interface Product {
  _id: string;
  name: string;
  sku: string;
  description: string;
  product_description: string;
  price: number;
  mrp: number;
  discount_type: any;
  discount_rate: number;
  sold: number;
  stock_quantity: number;
  weight: number;
  status: string;
  category_id: CategoryId;
  deleted_at: any;
  featured: boolean;
  created_at: string;
  edited_at: string;
  __v: number;
  images: Image[];
  variations?: Variation[] | [];
}

export interface CategoryId {
  _id: string;
  name: string;
}

export interface Image {
  _id: string;
  product_id: string;
  image_url: string;
  alt_text: string;
  is_primary: boolean;
  sort_order: number;
  created_at: string;
  edited_at: string;
  __v: number;
}

export interface TransformProduct {
  _id: string;
  name: string;
  sku: string;
  description: string;
  product_description: string;
  price: number;
  mrp: number;
  discount_type: any;
  discount_rate: number;
  sold: number;
  stock_quantity: number;
  weight: number;
  status: string;
  category_id: CategoryId;
  deleted_at: any;
  featured: boolean;
  created_at: string;
  edited_at: string;
  __v: number;
  images: string[];
  variations?: Variation[];
}

export interface Variation {
  _id: string;
  product_id: string;
  color: string;
  size: string;
  price: number;
  stock_quantity: number;
  sku: string;
  status: string;
  deleted_at: any;
  created_at: string;
  updated_at: string;
  __v: number;
  variation_name: string;
  is_deleted: boolean;
  id: string;
}

export interface Reviews {
  summary: Summary;
  details: Detail;
}

export interface Summary {
  average_rating: number;
  total_reviews: number;
}

export interface Detail {
  _id: string;
  product_id: string;
  user_id: UserId;
  rating: number;
  rating_description: string;
  order_id: string;
  created_at: string;
  edited_at: string;
  images: ReviewImage[];
}

export interface UserId {
  _id: string;
  first_name: string;
  last_name: string;
  email: string;
  mobile_number: string;
  is_admin: boolean;
  full_name: string;
  created_at: string;
  edited_at: string;
}
export interface ReviewImage {
  _id: string;
  review_id: string;
  image_url: string;
  created_at: string;
}

//suggestion product

export interface SuggestionRoot {
  success: boolean;
  data: SuggestionData;
}

export interface SuggestionData {
  product_id: string;
  category_id: string;
  suggestions: Suggestion[];
  total_suggestions: number;
}

export interface Suggestion {
  _id: string;
  id: string;
  name: string;
  sku: string;
  description: string;
  collection: string;
  originalPrice: number;
  price: number;
  mrp: number;
  image: string;
  wishlist: boolean;
  is_in_wishlist: boolean;
  discount_type?: string;
  discount_rate: number;
  stock_quantity: number;
  weight: number;
  status: string;
  category: Category;
  category_id: string;
  deleted_at: any;
  created_at: string;
  edited_at: string;
  __v: number;
  primary_image: PrimaryImage;
  all_images: AllImage[];
  variations: Variation[];
  review_overview: ReviewOverview;
  product_description?: string;
  featured?: boolean;
}

export interface PrimaryImage {
  _id: string;
  product_id: string;
  image_url: string;
  alt_text: string;
  is_primary: boolean;
  sort_order: number;
  created_at: string;
  edited_at: string;
  __v: number;
}

export interface Category {
  _id: string;
  id: string;
  name: string;
  description: string;
}

export interface AllImage {
  _id: string;
  product_id: string;
  image_url: string;
  alt_text: string;
  is_primary: boolean;
  sort_order: number;
  created_at: string;
  edited_at: string;
  __v: number;
}

export interface Variation {
  deleted_at: any;
  _id: string;
  product_id: string;
  color: string;
  size: string;
  price: number;
  stock_quantity: number;
  sku: string;
  status: string;
  created_at: string;
  updated_at: string;
  __v: number;
  variation_name: string;
  is_deleted: boolean;
  id: string;
}

export interface ReviewOverview {
  average_rating: number;
  total_reviews: number;
}
