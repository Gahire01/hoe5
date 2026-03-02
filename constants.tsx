import { Product, Category, Supplier, PaymentMethod, FeaturedService, TeamMember } from './types';
import {
  FaMobileAlt,
  FaHeadphones,
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
  FaApple,
  FaAndroid,
  FaWindows,
  FaPlaystation,
  FaGoogle,
  FaMobile,
} from 'react-icons/fa';
import { MdPayments, MdSupportAgent } from 'react-icons/md';
import {
  SiOneplus,
  SiXiaomi,
  SiLenovo,
  SiOppo,
  SiVivo,
} from 'react-icons/si';

export const ADMIN_NAME = 'saido salley';

export const CONTACT_INFO = {
  location: 'Around Makuza Peace Plaza, Kigali, Rwanda',
  phone: '+250 780 615 795',
  email: 'homeofelectronics20@gmail.com',
  adminEmail: 'homeofelectronics20@gmail.com',
  adminPassword: '234456',
};

export const CATEGORIES: Category[] = [
  { id: '1', name: 'Smartphone', icon: FaMobileAlt },
  { id: '2', name: 'Accessories', icon: FaHeadphones },
  { id: '3', name: 'Audio', icon: FaHeadphones },
  { id: '4', name: 'Computer & Laptop', icon: FaLaptop },
  { id: '5', name: 'Games & Consoles', icon: FaGamepad },
  { id: '6', name: 'Watches', icon: FaClock },
  { id: '7', name: 'Camera', icon: FaCamera },
];

export const SUPPLIERS: Supplier[] = [
  { name: 'Apple', logo: 'FaApple' },
  { name: 'Samsung', logo: 'FaAndroid' },
  { name: 'Google', logo: 'FaGoogle' },
  { name: 'Sony', logo: 'FaPlaystation' },
  { name: 'Microsoft', logo: 'FaWindows' },
  { name: 'Xiaomi', logo: 'SiXiaomi' },
  { name: 'OnePlus', logo: 'SiOneplus' },
  { name: 'Lenovo', logo: 'SiLenovo' },
  { name: 'Oppo', logo: 'SiOppo' },
  { name: 'Vivo', logo: 'SiVivo' },
  { name: 'Infinix', logo: 'FaMobile' },
  { name: 'Tecno', logo: 'FaMobileAlt' },
];

export const PAYMENT_METHODS: PaymentMethod[] = [
  { name: 'Momo Pay', icon: MdPayments },
  { name: 'Airtel Money', icon: FaMoneyBillWave },
  { name: 'Cash', icon: FaMoneyBillWave },
  { name: 'Visa / Mastercard', icon: FaCreditCard },
];

export const FEATURED_SERVICES: FeaturedService[] = [
  { title: 'Join Risk Free', desc: '30 days refund guarantee', icon: FaGem },
  { title: '100% Safe', desc: 'Secure payments encrypted', icon: FaShieldAlt },
  { title: '24/7 Support', desc: 'Instant expert technical help', icon: MdSupportAgent },
  { title: 'Best Offers', desc: 'Up to 50% discount deals', icon: FaTags },
  { title: 'Free Delivery', desc: 'On all orders above $500', icon: FaTruck },
];

export const TEAM_MEMBERS: TeamMember[] = [
  {
    id: '1',
    name: 'John Doe',
    role: 'CEO & Founder',
    image: 'https://randomuser.me/api/portraits/men/1.jpg',
    email: 'john@homeofelectronics.rw',
    phone: '+250 781 234 567',
    social: { linkedin: '#', twitter: '#', github: '#' },
  },
  {
    id: '2',
    name: 'Jane Smith',
    role: 'CTO',
    image: 'https://randomuser.me/api/portraits/women/2.jpg',
    email: 'jane@homeofelectronics.rw',
    phone: '+250 782 345 678',
    social: { linkedin: '#', twitter: '#', github: '#' },
  },
  {
    id: '3',
    name: 'Alice Johnson',
    role: 'Lead Engineer',
    image: 'https://randomuser.me/api/portraits/women/3.jpg',
    email: 'alice@homeofelectronics.rw',
    phone: '+250 783 456 789',
    social: { linkedin: '#', twitter: '#', github: '#' },
  },
];

export const PRODUCTS: Product[] = [
  // ... (your existing products, unchanged)
];
