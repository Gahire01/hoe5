
export type UserRole = 'user' | 'admin' | 'guest';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  category: string;
  image: string;
  rating: number;
  badge?: string;
  isNew?: boolean;
  stock: number;
  specs?: Record<string, string>;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Supplier {
  name: string;
  logo: string;
}

export interface PaymentMethod {
  name: string;
  icon: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
}
