const fs = require('fs');
const path = require('path');

const NUM_PRODUCTS = 1000;

// Data arrays for generation
const adjectives = ['Classic', 'Modern', 'Elegant', 'Casual', 'Vintage', 'Premium', 'Essential', 'Cozy', 'Stylish', 'Sporty', 'Urban', 'Chic', 'Comfort'];
const types = {
  'Sets': ['Suit Set', 'Tracksuit', 'Co-ord Set', 'Pajama Set'],
  'Dresses': ['Maxi Dress', 'Midi Dress', 'Wrap Dress', 'Summer Dress'],
  'T-Shirts': ['Basic Tee', 'Graphic T-Shirt', 'Polo Shirt', 'V-Neck Tee'],
  'Trousers': ['Chinos', 'Cargo Pants', 'Tailored Trousers', 'Joggers'],
  'Jackets': ['Denim Jacket', 'Leather Bomber', 'Windbreaker', 'Blazer'],
  'Skirts': ['Pleated Skirt', 'Mini Skirt', 'Midi Skirt', 'Pencil Skirt'],
  'Ethnic': ['Kurta', 'Saree', 'Sherwani', 'Lehenga']
};

const brands = ["RAQEEBA", "STUDIO RQB", "Urban Threads", "Modern Fit", "ActiveWear", "StreetStyle", "LuxeLine"];
const colors = ["Black", "White", "Navy", "Grey", "Beige", "Green", "Yellow", "Red", "Pink", "Blue"];
const sizesList = ["XS", "S", "M", "L", "XL", "XXL"];
const materials = ["Cotton", "Polyester", "Silk", "Linen", "Denim", "Wool", "Viscose", "Blend"];
const collectionsList = ["New Arrivals", "Best Sellers", "Sale", "Essentials", "Summer Collection", "Winter Collection", "Office Wear", "Party Wear"];
const genders = ["Men", "Women", "Kids", "Unisex"];

const images = {
  "Men": [
    "https://images.unsplash.com/photo-1516257984-b1b4d707412e?auto=format&fit=crop&w=500&q=80",
    "https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?auto=format&fit=crop&w=500&q=80",
    "https://images.unsplash.com/photo-1617137968427-85924c800a22?auto=format&fit=crop&w=500&q=80",
    "https://images.unsplash.com/photo-1507680434567-5739c80be1ac?auto=format&fit=crop&w=500&q=80"
  ],
  "Women": [
    "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=500&q=80",
    "https://images.unsplash.com/photo-1539008835657-9e8e9680c956?auto=format&fit=crop&w=500&q=80",
    "https://images.unsplash.com/photo-1434389678232-09af52dcd03e?auto=format&fit=crop&w=500&q=80",
    "https://images.unsplash.com/photo-1524041255072-7da0525d6b34?auto=format&fit=crop&w=500&q=80"
  ],
  "Kids": [
    "https://images.unsplash.com/photo-1519238361099-0df8555845ea?auto=format&fit=crop&w=500&q=80",
    "https://images.unsplash.com/photo-1503919545889-aef636e10cb4?auto=format&fit=crop&w=500&q=80",
    "https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?auto=format&fit=crop&w=500&q=80",
    "https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=500&q=80"
  ],
  "Unisex": [
    "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=500&q=80",
    "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=500&q=80"
  ]
};

// Helpers
const randElement = (arr) => arr[Math.floor(Math.random() * arr.length)];
const randNumber = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const randSubset = (arr, maxItems) => {
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, randNumber(1, maxItems));
};

const products = [];

for (let i = 1; i <= NUM_PRODUCTS; i++) {
  const category = randElement(Object.keys(types));
  const typeName = randElement(types[category]);
  const adj = randElement(adjectives);
  const color = randElement(colors);
  
  const name = `${adj} ${color} ${typeName}`;
  const price = randNumber(1000, 15000);
  // 30% chance of being on sale
  const isSale = Math.random() < 0.3;
  const discountPrice = isSale ? Math.floor(price * (randNumber(50, 90) / 100)) : price;
  
  const gender = randElement(genders);
  const prodImages = [
    { url: randElement(images[gender]), altText: name }
  ];

  const product = {
    name,
    description: `Experience the perfect blend of comfort and style with our ${name}. Crafted from premium ${randElement(materials).toLowerCase()} materials, this piece is designed to elevate your everyday wardrobe.`,
    price,
    discountPrice,
    countInStock: randNumber(0, 100),
    sku: `SKU-${Date.now()}-${i}-${Math.random().toString(36).substring(7).toUpperCase()}`,
    category,
    brand: randElement(brands),
    sizes: randSubset(sizesList, 4),
    colors: randSubset(colors, 3),
    collections: randSubset(collectionsList, 2),
    material: randElement(materials),
    gender,
    images: prodImages,
    isFeatured: Math.random() < 0.1,
    isPublished: true,
    rating: Number((Math.random() * 2 + 3).toFixed(1)), // Rating between 3.0 and 5.0
    numReviews: randNumber(0, 500)
  };

  products.push(product);
}

const fileContent = `const products = ${JSON.stringify(products, null, 2)};\n\nmodule.exports = products;\n`;
const filePath = path.join(__dirname, 'products.js');

fs.writeFileSync(filePath, fileContent);
console.log("Successfully generated " + NUM_PRODUCTS + " products and saved to " + filePath);
