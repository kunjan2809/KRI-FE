export interface Order {
  orders: OrderData[]
}

export interface OrderData {
  _id: string
  user_id: UserId
  shipping_address_id: ShippingAddressId
  order_number: string
  order_status: string
  payment_status: string
  total_amount: number
  order_items: OrderItem[]
  products:Product[]
  created_at:string
}

export interface UserId {
  _id: string
  first_name: string
  last_name: string
  email: string
  mobile_number: string
}

export interface ShippingAddressId {
  full_name: string
  formatted_address: string
}

export interface OrderItem {
  _id: string
  product_name_snapshot: string
  quantity: number
  price: number
}

export interface Product {
  product_id: string
  quantity: number
}
