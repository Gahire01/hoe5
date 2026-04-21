import { IconType } from 'react-icons';

export type UserRole = 'user' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  phone?: string;
}

export interface Category {
  id: string;
  name: string;
  icon: IconType;
}

export interface Supplier {
  name: string;
  icon: IconType;
  color?: string;
}

export interface PaymentMethod {
  name: string;
  icon: IconType;
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
  specs: Record<string, string>;
  created_at?: string;
}

export interface Employee {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: string;
  social?: {
    linkedin?: string;
    twitter?: string;
    instagram?: string;
    tiktok?: string;
    facebook?: string;
    github?: string;
  };
  image?: string;
  created_at?: string;
}

export interface TopUpRequest {
  id: string;
  user_id: string;
  user_name: string;
  phone: string;
  amount: number;
  images: string[];
  message: string;
  status: 'pending' | 'in-progress' | 'completed';
  created_at: Date;
}

export interface FeaturedService {
  title: string;
  desc: string;
  icon: IconType;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  image: string;
  email: string;
  phone: string;
  social?: {
    linkedin?: string;
    twitter?: string;
    github?: string;
  };
}

export interface CartItem extends Product {
  quantity: number;
}
