const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/user');
const Product = require('./models/Product');
const Order = require('./models/Order');

dotenv.config();

const seedOrders = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log('MongoDB Connected for Order Seeding');

    // Fetch existing users and products
    const users = await User.find({});
    const products = await Product.find({});

    if (users.length === 0 || products.length === 0) {
      console.error('Need both users and products to seed orders. Run other seeders first.');
      process.exit(1);
    }

    // Clear existing orders for a clean slate
    await Order.deleteMany();
    console.log('Existing orders cleared');

    const statuses = ['Processing', 'Shipped', 'Delivered'];
    const ordersToCreate = [];

    // Generate 30 random orders
    for (let i = 0; i < 30; i++) {
      // Random user
      const randomUser = users[Math.floor(Math.random() * users.length)];
      
      // Random 1-4 products for this order
      const numItems = Math.floor(Math.random() * 4) + 1;
      const orderItems = [];
      let orderTotal = 0;

      for (let j = 0; j < numItems; j++) {
        const randomProduct = products[Math.floor(Math.random() * products.length)];
        const qty = Math.floor(Math.random() * 3) + 1;
        const price = randomProduct.discountPrice > 0 ? randomProduct.discountPrice : randomProduct.price;
        
        orderItems.push({
          productId: randomProduct._id,
          name: randomProduct.name,
          image: randomProduct.images?.[0]?.url || '',
          price: price,
          quantity: qty,
          size: randomProduct.sizes?.[0] || 'M',
          color: randomProduct.colors?.[0] || 'Black'
        });
        
        orderTotal += (price * qty);
      }

      const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
      
      // Generate a date within the last 30 days
      const randomDaysAgo = Math.floor(Math.random() * 30);
      const createdAtDate = new Date();
      createdAtDate.setDate(createdAtDate.getDate() - randomDaysAgo);

      ordersToCreate.push({
        user: randomUser._id,
        orderItems: orderItems,
        shippingAddress: {
          name: `${randomUser.firstName} ${randomUser.lastName}`,
          address: '123 Fake St',
          city: 'Metropolis',
          postalCode: '12345',
          country: 'USA'
        },
        paymentMethod: 'Card',
        totalPrice: orderTotal,
        isPaid: true,
        paidAt: createdAtDate,
        paymentStatus: 'paid',
        status: randomStatus,
        isDelivered: randomStatus === 'Delivered',
        deliveredAt: randomStatus === 'Delivered' ? createdAtDate : null,
        createdAt: createdAtDate
      });
    }

    await Order.insertMany(ordersToCreate);
    console.log(`Successfully seeded ${ordersToCreate.length} orders!`);
    
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

seedOrders();
