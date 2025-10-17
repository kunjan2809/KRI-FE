// ----------------------------------------------------------------------

export type IOrderFilterValue = string | string[] | number | number[];

export type IOrderFilters = {
  status: string[];
  payment_status: string[];
  dateRange: string[];
  search: string;
};

// ----------------------------------------------------------------------

export type IOrderItem = {
  id: string;
  order_id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  total_amount: number;
  order_status: 'pending' | 'shipped' | 'cancelled' | 'delivered' | 'return';
  payment_status: 'paid' | 'cod' | 'unpaid' | 'refunded';
  shipping_address: IOrderAddress;
  billing_address: IOrderAddress;
  products: IOrderProduct[];
  delivery_info?: IOrderDelivery;
  created_at: string;
  updated_at: string;
  notes?: string;
  tracking_number?: string;
};

export type IOrderAddress = {
  street: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  landmark?: string;
};

export type IOrderProduct = {
  product_id: string;
  product_name: string;
  product_sku: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  product_image?: string;
  variant?: string;
};

export type IOrderDelivery = {
  delivery_date?: string;
  delivery_time?: string;
  delivery_person?: string;
  delivery_notes?: string;
  delivery_status?: 'pending' | 'in_transit' | 'delivered' | 'failed';
};

export type IOrderTableFilterValue = string | string[];

export type IOrderTableFilters = {
  status: string[];
  payment_status: string[];
};

// ----------------------------------------------------------------------

// API response types based on the order API documentation
export type IOrderAPIResponse = {
  _id: string;
  order_id: string;
  customer_id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  total_amount: number;
  order_status: string;
  payment_status: string;
  shipping_address: IOrderAddress;
  billing_address: IOrderAddress;
  products: IOrderProduct[];
  delivery_info?: IOrderDelivery;
  created_at: string;
  updated_at: string;
  notes?: string;
  tracking_number?: string;
};

export type IOrderCreateRequest = {
  customer_id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  shipping_address: IOrderAddress;
  billing_address: IOrderAddress;
  products: IOrderProduct[];
  notes?: string;
  payment_method: string;
};

export type IOrderUpdateRequest = {
  order_status?: string;
  payment_status?: string;
  tracking_number?: string;
  notes?: string;
  delivery_info?: IOrderDelivery;
};

export type IOrderStatus = {
  order_status: string;
};

export type IOrderPaymentStatus = {
  payment_status: string;
};

export type IOrderDeliveryUpdate = {
  delivery_date?: string;
  delivery_time?: string;
  delivery_person?: string;
  delivery_notes?: string;
  delivery_status?: string;
};

// ----------------------------------------------------------------------

// Pagination and filtering types
export type IOrderPagination = {
  current_page: number;
  total_pages: number;
  total_orders: number;
  per_page: number;
  has_next_page: boolean;
  has_prev_page: boolean;
};

export type IOrderSorting = {
  sort_by: string;
  sort_order: 'asc' | 'desc';
};

export type IOrderFiltersResponse = {
  status_options: string[];
  payment_status_options: string[];
  date_range: {
    min_date: string;
    max_date: string;
  };
};