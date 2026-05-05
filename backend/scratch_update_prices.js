const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product.js');

dotenv.config();

mongoose.connect(process.env.MONGO_URL).then(async () => {
    try {
        const products = await Product.find({}, '_id');
        const bulkOps = products.map(p => ({
            updateOne: {
                filter: { _id: p._id },
                update: {
                    $set: {
                        price: Math.floor(Math.random() * 5) + 1,
                        discountPrice: 0
                    }
                }
            }
        }));
        
        if (bulkOps.length > 0) {
            await Product.bulkWrite(bulkOps);
        }
        
        console.log('✅ Successfully updated ' + bulkOps.length + ' products to 1-5 rupees!');
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
});
