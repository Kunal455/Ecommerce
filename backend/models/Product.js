const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    description: {
      type: String,
      required: true
    },

    price: {
      type: Number,
      required: true
    },

    discountPrice: {
      type: Number,
      default: 0
    },

    countInStock: {
      type: Number,
      required:true,
      default: 0
    },

    sku: {
      type: String,
      unique: true
    },

    category: {
      type: String,
      required: true
    },

    brand: {
      type: String
    },

    sizes: {
        type: [String],
        required: true,
    },

    colors: {
        type: [String],
        required: true,
    },

    collections: {
        type:[String],
        required: true
    },

    material: {
      type: String
    },

    gender: {
      type: String,
      enum: ["Men", "Women", "Kids", "Unisex"]
    },

    images: [
      {
        url: {
            type:String,
            required: true,
        },
        altText: {
            type: String,
        }
      }
    ],

    isFeatured: {
      type: Boolean,
      default: false
    },

    isPublished: {
        type:Boolean,
        default: false
    },

    rating: {
      type: Number,
      default: 0
    },

    numReviews: {
        type: Number,
        default: 0,
    },

  

    tags: [String],

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    metaTitle: {
      type: String
    },

    metaDescription: {
      type: String
    },

    metaKeywords: [
      {
        type: String
      }
    ],

    dimensions: {
      length: {
        type: Number
      },
      width: {
        type: Number
      },
      height: {
        type: Number
      }
    },

    weight: {
      type: Number
    },

    
  },
  {
    timestamps: true
  }
);

// High Performance Indexes
productSchema.index({ 
  name: 'text', 
  description: 'text', 
  category: 'text', 
  brand: 'text', 
  gender: 'text', 
  material: 'text', 
  collections: 'text' 
});
productSchema.index({ category: 1, createdAt: -1 });
productSchema.index({ brand: 1, createdAt: -1 });
productSchema.index({ gender: 1, createdAt: -1 });
productSchema.index({ price: 1 });
productSchema.index({ rating: -1 });
productSchema.index({ createdAt: -1 });

module.exports = mongoose.model("Product", productSchema);
