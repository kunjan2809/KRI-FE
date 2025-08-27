// ----------------------------------------------------------------------

export type IProductFilterValue = string | string[] | number | number[];

export type IProductFilters = {
  rating: string;
  gender: string[];
  category: string;
  colors: string[];
  priceRange: number[];
};

// ----------------------------------------------------------------------

export type IProductReviewNewForm = {
  rating: number | null;
  review: string;
  name: string;
  email: string;
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
};

// ----------------------------------------------------------------------

// New API response types based on the provided structure
export type IProductImage = {
  _id: string;
  product_id: string;
  image_url: string;
  alt_text: string;
  is_primary: boolean;
  sort_order: number;
  created_at: string;
  edited_at: string;
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
};

export type IProductCreateRequest = {
  name: string;
  sku: string;
  description: string;
  price: number;
  discount_type?: string | null;
  discount_rate?: number;
  stock_quantity: number;
  color: string;
  weight: number;
  status: string;
  category_id: string;
  primary_image?: {
    image_url: string;
    alt_text: string;
    is_primary: boolean;
    sort_order: number;
  };
};


export type IProductQuantity = {
  quantity: number;
};