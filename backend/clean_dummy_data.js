const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Order = require('./models/Order');

dotenv.config();

const cleanDummyData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log('MongoDB Connected for Cleanup');

    // Delete orders that have the dummy address
    const result = await Order.deleteMany({ 'shippingAddress.address': '123 Fake St' });
    
    console.log(`Successfully deleted ${result.deletedCount} dummy orders.`);

    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

cleanDummyData();
