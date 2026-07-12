export interface Address {
  id: string;
  label: string;
  fullName: string;
  phone: string;
  line1: string;
  line2: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
}

export interface Notifications {
  orderUpdates: boolean;
  promotions: boolean;
  newArrivals: boolean;
  priceDrops: boolean;
  emailEnabled: boolean;
  pushEnabled: boolean;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  image: string | null;
  role: string;
  phone: string;
  bio: string;
  dateOfBirth: string;
  gender: string;
  addresses: Address[];
  notifications: Notifications;
}

export interface OrderItem {
  productId: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
}

export interface Order {
  _id: string;
  items: OrderItem[];
  subtotal?: number;
  discount?: number;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: string;
  couponCode?: string;
  stripeSessionId?: string;
  shippingAddress?: {
    name: string;
    line1: string;
    city: string;
    country: string;
  };
}

export type ProfileTab =
  | 'overview'
  | 'personal'
  | 'addresses'
  | 'orders'
  | 'security'
  | 'danger';
