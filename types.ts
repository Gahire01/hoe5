import { IconType } from 'react-icons';

export type UserRole = 'user' | 'admin' | 'guest';

export interface User {
  uid: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

export interface Category {
  id: string;
  name: string;
  icon: IconType;
}

export interface Supplier {
  name: string;
  logo: string; // icon component name, but we'll keep as string for simplicity
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
}

export interface TopUpRequest {
  id: string;
  userId: string;
  userName: string;
  phone: string;
  model: string;
  images: string[];
  message: string;
  status: 'pending' | 'in-progress' | 'completed';
  createdAt: Date;
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
