
import { Product, Category, Supplier, PaymentMethod } from './types';

export const CONTACT_INFO = {
  location: "Around Makuza Peace plaza, Kigali, Rwanda",
  phone: "+250 780 615 795",
  email: "homeofelectronics20@gmail.com",
  adminEmail: "homeofelectronics20@gmail.com",
  adminPassword: "234456"
};

export const CATEGORIES: Category[] = [
  { id: '1', name: 'Smartphone', icon: '📱' },
  { id: '2', name: 'Accessories', icon: '🎧' },
  { id: '3', name: 'Audio', icon: '🔊' },
  { id: '4', name: 'Computer & Laptop', icon: '💻' },
  { id: '5', name: 'Games & Consoles', icon: '🎮' },
  { id: '6', name: 'Watches', icon: '⌚' },
  { id: '7', name: 'Camera', icon: '📷' },
];

export const SUPPLIERS: Supplier[] = [
  { name: 'Apple', logo: 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg' },
  { name: 'Samsung', logo: 'https://upload.wikimedia.org/wikipedia/commons/2/24/Samsung_Logo.svg' },
  { name: 'Google Pixel', logo: 'https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg' },
  { name: 'Sony PS5', logo: 'https://upload.wikimedia.org/wikipedia/commons/0/00/PlayStation_logo.svg' },
  { name: 'Dell', logo: 'https://upload.wikimedia.org/wikipedia/commons/1/18/Dell_logo_2016.svg' },
  { name: 'HP', logo: 'https://upload.wikimedia.org/wikipedia/commons/a/ad/HP_logo_2012.svg' },
];

export const PAYMENT_METHODS: PaymentMethod[] = [
  { name: 'Momo Pay', icon: '📲' },
  { name: 'Airtel Money', icon: '💸' },
  { name: 'Cash', icon: '💵' },
  { name: 'Visa/Mastercard', icon: '💳' },
];

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
      "Processor": "A17 Pro Chip",
      "Display": "6.7-inch OLED",
      "Camera": "48MP Main System",
      "Battery": "Up to 29h video",
      "Material": "Aerospace Titanium"
    }
  },
  {
    id: 'p2',
    name: 'Sony WH-1000XM5 Wireless',
    price: 349000,
    category: 'Audio',
    image: 'https://images.unsplash.com/photo-1670057037146-590050868a8b?auto=format&fit=crop&q=80&w=800',
    rating: 4.8,
    isNew: true,
    stock: 25,
    specs: {
      "Noise Cancelling": "Industry-leading",
      "Battery Life": "30 Hours",
      "Driver Unit": "30mm Carbon",
      "Bluetooth": "v5.2",
      "Sensors": "Wearing Sensor"
    }
  },
  {
    id: 'p3',
    name: 'Galaxy Watch 6 Classic',
    price: 299000,
    originalPrice: 320000,
    category: 'Watches',
    image: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?auto=format&fit=crop&q=80&w=800',
    rating: 4.5,
    stock: 8,
    specs: {
      "Bezel": "Rotating",
      "Display": "Sapphire Crystal",
      "OS": "Wear OS 4",
      "Tracking": "BIA Analysis",
      "Durability": "IP68 / 5ATM"
    }
  },
  {
    id: 'p4',
    name: 'MacBook Pro M3 Max 14"',
    price: 2499000,
    category: 'Computer & Laptop',
    image: 'https://images.unsplash.com/photo-1517336714481-489a2013cc01?auto=format&fit=crop&q=80&w=800',
    rating: 5,
    badge: 'Premium',
    stock: 5,
    specs: {
      "CPU": "14-core M3 Max",
      "RAM": "36GB Unified",
      "Storage": "1TB SSD",
      "Display": "Liquid Retina XDR",
      "Portability": "14.2-inch form"
    }
  },
  {
    id: 'p5',
    name: 'DualSense Edge Controller',
    price: 199000,
    category: 'Games & Consoles',
    image: 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?auto=format&fit=crop&q=80&w=800',
    rating: 4.7,
    stock: 40,
    specs: {
      "Feature": "Pro Customization",
      "Triggers": "Adjustable",
      "Buttons": "Swappable Sticks",
      "Feedback": "Haptic",
      "Interface": "USB-C / Wireless"
    }
  },
  {
    id: 'p6',
    name: 'iPad Pro 12.9" M2',
    price: 1099000,
    category: 'Computer & Laptop',
    image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&q=80&w=800',
    rating: 4.9,
    isNew: true,
    stock: 15,
    specs: {
      "Chip": "Apple M2",
      "Display": "Mini-LED XDR",
      "Brightness": "1600 nits peak",
      "Connectivity": "Wi-Fi 6E / 5G",
      "Apple Pencil": "Hover support"
    }
  },
  {
    id: 'p7',
    name: 'PlayStation 5 Console',
    price: 650000,
    category: 'Games & Consoles',
    image: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&q=80&w=800',
    rating: 5,
    stock: 10,
    specs: {
      "Storage": "825GB SSD",
      "Resolution": "4K 120Hz",
      "HDR": "Supported",
      "Ray Tracing": "Yes",
      "Controller": "DualSense Included"
    }
  },
  {
    id: 'p8',
    name: 'Google Pixel 8 Pro',
    price: 950000,
    category: 'Smartphone',
    image: 'https://images.unsplash.com/photo-1696446701796-da61225697cc?auto=format&fit=crop&q=80&w=800',
    rating: 4.8,
    stock: 15,
    specs: {
      "Processor": "Google Tensor G3",
      "Display": "6.7-inch LTPO OLED",
      "Camera": "50MP Triple System",
      "AI": "Magic Editor",
      "Security": "Titan M2"
    }
  }
];

export const FEATURED_SERVICES = [
  { title: 'Join Risk Free', desc: '30 days refund guarantee', icon: '💎' },
  { title: '100% Safe', desc: 'Secure payments encrypted', icon: '🛡️' },
  { title: '24/7 Support', desc: 'Instant expert technical help', icon: '🛠️' },
  { title: 'Best Offers', desc: 'Up to 50% discount deals', icon: '🏷️' },
  { title: 'Free Delivery', desc: 'On all orders above $500', icon: '🚚' },
];
