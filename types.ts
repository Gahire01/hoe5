import { IconType } from 'react-icons';

export type UserRole = 'user' | 'admin' | 'guest';

export interface User {
  id: string;
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
  logo: string;
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
