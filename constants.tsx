import { Product, Category, Supplier, PaymentMethod, FeaturedService } from './types';

/* =========================
   ICON IMPORTS
========================= */
import {
  FaMobileAlt,
  FaHeadphonesAlt,
  FaLaptop,
  FaGamepad,
  FaClock,
  FaCamera,
  FaShieldAlt,
  FaTags,
  FaTruck,
  FaGem,
  FaMoneyBillWave,
  FaCreditCard,
} from 'react-icons/fa';

import { MdPayments, MdSupportAgent } from 'react-icons/md';

/* =========================
   CONTACT INFO
========================= */
export const CONTACT_INFO = {
  location: 'Around Makuza Peace Plaza, Kigali, Rwanda',
  phone: '+250 780 615 795',
  email: 'homeofelectronics20@gmail.com',
  adminEmail: 'homeofelectronics20@gmail.com',
  adminPassword: '234456',
};

/* =========================
   CATEGORIES
========================= */
export const CATEGORIES: Category[] = [
  { id: '1', name: 'Smartphone', icon: FaMobileAlt },
  { id: '2', name: 'Accessories', icon: FaHeadphonesAlt },
  { id: '3', name: 'Audio', icon: FaHeadphonesAlt },
  { id: '4', name: 'Computer & Laptop', icon: FaLaptop },
  { id: '5', name: 'Games & Consoles', icon: FaGamepad },
  { id: '6', name: 'Watches', icon: FaClock },
  { id: '7', name: 'Camera', icon: FaCamera },
];

/* =========================
   SUPPLIERS
========================= */
export const SUPPLIERS: Supplier[] = [
  { name: 'Apple', logo: 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg' },
  { name: 'Samsung', logo: 'https://upload.wikimedia.org/wikipedia/commons/2/24/Samsung_Logo.svg' },
  { name: 'Google', logo: 'https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg' },
  { name: 'Sony', logo: 'https://upload.wikimedia.org/wikipedia/commons/0/00/PlayStation_logo.svg' },
  { name: 'Dell', logo: 'https://upload.wikimedia.org/wikipedia/commons/1/18/Dell_logo_2016.svg' },
  { name: 'HP', logo: 'https://upload.wikimedia.org/wikipedia/commons/a/ad/HP_logo_2012.svg' },
  { name: 'Xiaomi', logo: 'https://upload.wikimedia.org/wikipedia/commons/2/29/Xiaomi_logo.svg' },
  { name: 'OnePlus', logo: 'https://upload.wikimedia.org/wikipedia/commons/c/c9/OnePlus_logo.svg' },
  { name: 'Lenovo', logo: 'https://upload.wikimedia.org/wikipedia/commons/b/b8/Lenovo_logo_2015.svg' },
];

/* =========================
   PAYMENT METHODS
========================= */
export const PAYMENT_METHODS: PaymentMethod[] = [
  { name: 'Momo Pay', icon: MdPayments },
  { name: 'Airtel Money', icon: FaMoneyBillWave },
  { name: 'Cash', icon: FaMoneyBillWave },
  { name: 'Visa / Mastercard', icon: FaCreditCard },
];

/* =========================
   FEATURED SERVICES
========================= */
export const FEATURED_SERVICES: FeaturedService[] = [
  { title: 'Join Risk Free', desc: '30 days refund guarantee', icon: FaGem },
  { title: '100% Safe', desc: 'Secure payments encrypted', icon: FaShieldAlt },
  { title: '24/7 Support', desc: 'Instant expert technical help', icon: MdSupportAgent },
  { title: 'Best Offers', desc: 'Up to 50% discount deals', icon: FaTags },
  { title: 'Free Delivery', desc: 'On all orders above $500', icon: FaTruck },
];

/* =========================
   PRODUCTS (UNCHANGED LOGIC)
========================= */
export const PRODUCTS: Product[] = [
  {
    id: 'p1',
    name: 'iPhone 15 Pro Max Titanium',
    price: 1399000,
    originalPrice: 1450000,
    category: 'Smartphone',
    image: 'https://images.unsplash.com/photo-1696446701796-da61225697cc?auto=format&fit=crop&q=80&w=800',
    rating: 5,
    badge: 'Best Seller',
    stock: 12,
    specs: {
      Processor: 'A17 Pro Chip',
      Display: '6.7-inch OLED',
      Camera: '48MP Main System',
      Battery: 'Up to 29h video',
      Material: 'Aerospace Titanium',
    },
  },
  // (rest of products stay exactly the same)
];
