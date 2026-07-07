import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    originalPrice: { type: Number },
    // Binary image storage — primary/cover image (images[0] is mirrored here
    // for backward compatibility with product.image consumers).
    imageData: { type: Buffer },
    imageContentType: { type: String },
    // All product images (max 5). images[0] === primary. Each entry stores the
    // binary buffer + content type, served via /api/images/product/:id/:index.
    images: [{
      data: Buffer,
      contentType: String,
    }],
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    rating: { type: Number, default: 4.5, min: 0, max: 5 },
    reviewCount: { type: Number, default: 0 },
    bestseller: { type: Boolean, default: false },
    salesCount: { type: Number, default: 0, min: 0, index: true },
    stockQuantity: { type: Number, default: 50, min: 0 },
    discountPercent: { type: Number, default: 0, min: 0, max: 100 },
    inStock: { type: Boolean, default: true },
    // Flash Sale
    flashSale:        { type: Boolean, default: false, index: true },
    flashSalePrice:   { type: Number },
    flashSaleEndsAt:  { type: Date },
  },
  { timestamps: true }
);

export default mongoose.model('Product', productSchema);
