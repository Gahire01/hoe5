import { 
  Smartphone, 
  Headphones, 
  Laptop, 
  Gamepad2, 
  Watch, 
  Camera, 
  ShieldCheck, 
  Tag, 
  Truck, 
  Gem, 
  MessageSquare,
  Search,
  Cpu
} from 'lucide-react';
import { 
  FaApple, 
  FaAndroid, 
  FaWindows, 
  FaPlaystation, 
  FaGoogle, 
  FaMobile,
  FaMobileAlt,
  FaMoneyBillWave,
  FaCreditCard
} from 'react-icons/fa';
import { MdPayments, MdSupportAgent } from 'react-icons/md';
import { SiOneplus, SiXiaomi, SiLenovo, SiOppo, SiVivo } from 'react-icons/si';

export const ADMIN_NAME = 'saido salley';

export const CONTACT_INFO = {
  location: 'Around Makuza Peace Plaza, Kigali, Rwanda',
  phone: '+250 780 615 795',
  email: 'homeofelectronics20@gmail.com',
  adminEmail: 'homeofelectronics20@gmail.com',
  adminPassword: '234456',
  whatsapp: '250780615795',
};

export const CATEGORIES: Category[] = [
  { id: 'smartphone', name: 'Smartphone', icon: Smartphone as any },
  { id: 'accessories', name: 'Accessories', icon: Headphones as any },
  { id: 'audio', name: 'Audio', icon: Headphones as any },
  { id: 'computer-laptop', name: 'Computer & Laptop', icon: Laptop as any },
  { id: 'games-consoles', name: 'Games & Consoles', icon: Gamepad2 as any },
  { id: 'watches', name: 'Watches', icon: Watch as any },
  { id: 'camera', name: 'Camera', icon: Camera as any },
];

export const SUPPLIERS: Supplier[] = [
  { name: 'Apple', icon: FaApple as any, color: 'hover:text-white' },
  { name: 'Samsung', icon: FaAndroid as any, color: 'hover:text-blue-500' },
  { name: 'Google', icon: FaGoogle as any, color: 'hover:text-red-500' },
  { name: 'Sony', icon: FaPlaystation as any, color: 'hover:text-blue-600' },
  { name: 'Microsoft', icon: FaWindows as any, color: 'hover:text-blue-400' },
  { name: 'Xiaomi', icon: SiXiaomi as any, color: 'hover:text-orange-500' },
  { name: 'OnePlus', icon: SiOneplus as any, color: 'hover:text-red-600' },
  { name: 'Lenovo', icon: SiLenovo as any, color: 'hover:text-red-600' },
  { name: 'Oppo', icon: SiOppo as any, color: 'hover:text-green-500' },
  { name: 'Vivo', icon: SiVivo as any, color: 'hover:text-blue-400' },
  { name: 'Infinix', icon: FaMobile as any, color: 'hover:text-green-400' },
  { name: 'Tecno', icon: FaMobileAlt as any, color: 'hover:text-blue-500' },
];

export const PAYMENT_METHODS: PaymentMethod[] = [
  { name: 'Momo Pay', icon: MdPayments },
  { name: 'Airtel Money', icon: FaMoneyBillWave },
  { name: 'Cash', icon: FaMoneyBillWave },
  { name: 'Visa / Mastercard', icon: FaCreditCard },
];

export const FEATURED_SERVICES: FeaturedService[] = [
  { title: 'Join Risk Free', desc: '30 days refund guarantee', icon: Gem as any },
  { title: '100% Safe', desc: 'Secure payments encrypted', icon: ShieldCheck as any },
  { title: '24/7 Support', desc: 'Instant expert technical help', icon: MdSupportAgent as any },
  { title: 'Best Offers', desc: 'Up to 50% discount deals', icon: Tag as any },
  { title: 'Free Delivery', desc: 'On all orders above $500', icon: Truck as any },
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
];

// Placeholder products – you can keep your existing ones
export const PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'iPhone 15 Pro Max',
    price: 1399000,
    originalPrice: 1599000,
    category: 'Smartphone',
    image: 'https://images.unsplash.com/photo-1696446701796-da61225697cc?auto=format&fit=crop&w=600',
    rating: 5,
    isNew: true,
    stock: 12,
    specs: { Processor: 'A17 Pro', RAM: '8GB', Storage: '256GB' },
  },
  // ... add more as needed
];
