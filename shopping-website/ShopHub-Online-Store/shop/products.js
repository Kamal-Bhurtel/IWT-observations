const products = [
  {
    id: 1,
    name: "Wireless Noise-Cancelling Headphones",
    price: 12499,
    originalPrice: 16999,
    category: "electronics",
    rating: 4.8,
    reviews: 1243,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=600&h=600&fit=crop"
    ],
    description: "Experience premium sound with active noise cancellation, 30-hour battery life, and comfortable over-ear design. Perfect for travel, work, and music lovers.",
    features: ["Active Noise Cancellation", "30-hour battery", "Bluetooth 5.2", "Built-in mic", "Foldable design"],
    stock: 45,
    badge: "Sale"
  },
  {
    id: 2,
    name: "Smart Fitness Watch Pro",
    price: 16999,
    originalPrice: 21999,
    category: "electronics",
    rating: 4.6,
    reviews: 892,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&h=500&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=600&h=600&fit=crop"
    ],
    description: "Track your health and fitness with advanced sensors, GPS, heart-rate monitoring, and 7-day battery life. Water-resistant up to 50m.",
    features: ["GPS tracking", "Heart rate monitor", "Sleep tracking", "50m water resistant", "7-day battery"],
    stock: 32,
    badge: "Bestseller"
  },
  {
    id: 3,
    name: "Minimalist Leather Backpack",
    price: 7499,
    originalPrice: null,
    category: "fashion",
    rating: 4.7,
    reviews: 567,
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&h=500&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1622560480605-d83c853243b5?w=600&h=600&fit=crop"
    ],
    description: "Crafted from genuine leather with a sleek minimalist design. Multiple compartments, laptop sleeve, and adjustable straps for everyday comfort.",
    features: ["Genuine leather", "15\" laptop sleeve", "Water-resistant", "Multiple pockets", "Adjustable straps"],
    stock: 28,
    badge: null
  },
  {
    id: 4,
    name: "Premium Cotton T-Shirt",
    price: 1499,
    originalPrice: 1999,
    category: "fashion",
    rating: 4.5,
    reviews: 2103,
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&h=500&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=600&h=600&fit=crop"
    ],
    description: "Soft, breathable 100% organic cotton t-shirt. Classic fit, pre-shrunk, available in multiple colors. Perfect for everyday wear.",
    features: ["100% organic cotton", "Pre-shrunk", "Classic fit", "Machine washable", "Eco-friendly"],
    stock: 120,
    badge: "Sale"
  },
  {
    id: 5,
    name: "Ceramic Coffee Mug Set",
    price: 2499,
    originalPrice: null,
    category: "home",
    rating: 4.9,
    reviews: 445,
    image: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=500&h=500&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1572116469696-31de0f17cc34?w=600&h=600&fit=crop"
    ],
    description: "Set of 4 handcrafted ceramic mugs. Microwave and dishwasher safe. Beautiful matte finish that feels great in your hands.",
    features: ["Set of 4", "Microwave safe", "Dishwasher safe", "Matte finish", "350ml capacity"],
    stock: 67,
    badge: null
  },
  {
    id: 6,
    name: "Modern Desk Lamp",
    price: 4499,
    originalPrice: 5999,
    category: "home",
    rating: 4.4,
    reviews: 312,
    image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=500&h=500&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=600&h=600&fit=crop"
    ],
    description: "Sleek LED desk lamp with adjustable brightness, color temperature control, and USB charging port. Perfect for work or study.",
    features: ["LED lighting", "Adjustable brightness", "USB port", "Touch control", "Eye-care mode"],
    stock: 41,
    badge: "Sale"
  },
  {
    id: 7,
    name: "Yoga Mat Premium",
    price: 2999,
    originalPrice: null,
    category: "sports",
    rating: 4.7,
    reviews: 789,
    image: "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=500&h=500&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1592432678016-e910b445f7c3?w=600&h=600&fit=crop"
    ],
    description: "Extra-thick non-slip yoga mat with alignment guides. Eco-friendly material, includes carrying strap. Ideal for yoga, pilates, and floor exercises.",
    features: ["6mm thickness", "Non-slip surface", "Alignment lines", "Eco-friendly", "Carrying strap"],
    stock: 55,
    badge: null
  },
  {
    id: 8,
    name: "Wireless Earbuds Pro",
    price: 5999,
    originalPrice: 7999,
    category: "electronics",
    rating: 4.5,
    reviews: 1567,
    image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500&h=500&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=600&h=600&fit=crop"
    ],
    description: "True wireless earbuds with deep bass, transparency mode, and 24-hour total battery life with charging case. IPX5 water resistant.",
    features: ["True wireless", "24h battery", "Transparency mode", "IPX5 waterproof", "Touch controls"],
    stock: 88,
    badge: "Sale"
  },
  {
    id: 9,
    name: "Running Shoes Elite",
    price: 8999,
    originalPrice: 11999,
    category: "sports",
    rating: 4.6,
    reviews: 934,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&h=500&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=600&h=600&fit=crop"
    ],
    description: "Lightweight performance running shoes with responsive cushioning and breathable mesh upper. Designed for long-distance comfort.",
    features: ["Responsive cushioning", "Breathable mesh", "Lightweight", "Durable outsole", "Reflective details"],
    stock: 37,
    badge: "Bestseller"
  },
  {
    id: 10,
    name: "Scented Candle Collection",
    price: 1999,
    originalPrice: null,
    category: "home",
    rating: 4.8,
    reviews: 623,
    image: "https://images.unsplash.com/photo-1602609385954-bac07f0c9b0a?w=500&h=500&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1602609385954-bac07f0c9b0a?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1603006905003-be475563bc59?w=600&h=600&fit=crop"
    ],
    description: "Set of 3 premium soy wax candles with natural essential oils. Long-lasting burn time of 40+ hours each. Beautifully packaged gift set.",
    features: ["Soy wax", "Natural scents", "40h burn time", "Gift packaging", "Set of 3"],
    stock: 74,
    badge: null
  },
  {
    id: 11,
    name: "Classic Denim Jacket",
    price: 5999,
    originalPrice: 7999,
    category: "fashion",
    rating: 4.4,
    reviews: 411,
    image: "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=500&h=500&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600&h=600&fit=crop"
    ],
    description: "Timeless denim jacket with a modern slim fit. Durable construction, classic styling, and versatile enough for any season.",
    features: ["100% cotton denim", "Slim fit", "Button closure", "Multiple pockets", "Machine washable"],
    stock: 29,
    badge: "Sale"
  },
  {
    id: 12,
    name: "Resistance Bands Set",
    price: 1499,
    originalPrice: 2299,
    category: "sports",
    rating: 4.6,
    reviews: 1089,
    image: "https://images.unsplash.com/photo-1598289431512-b97b0917affc?w=500&h=500&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1598289431512-b97b0917affc?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=600&h=600&fit=crop"
    ],
    description: "Complete resistance band set with 5 levels of resistance, handles, door anchor, and carrying bag. Perfect for home workouts.",
    features: ["5 resistance levels", "Handles included", "Door anchor", "Carrying bag", "Exercise guide"],
    stock: 95,
    badge: "Sale"
  }
];

function formatINR(amount) {
  return '₹' + amount.toLocaleString('en-IN');
}
