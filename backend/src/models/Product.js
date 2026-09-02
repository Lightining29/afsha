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
    badge: { type: String, default: '' },
    isTrending: { type: Boolean, default: false },
    isBestseller: { type: Boolean, default: false },
    isNewArrival: { type: Boolean, default: false },
    isLimitedEdition: { type: Boolean, default: false },
    salesCount: { type: Number, default: 0, min: 0, index: true },
    stockQuantity: { type: Number, default: 50, min: 0 },
    discountPercent: { type: Number, default: 0, min: 0, max: 100 },
    inStock: { type: Boolean, default: true },
    // Flash Sale
    flashSale:        { type: Boolean, default: false, index: true },
    flashSalePrice:   { type: Number },
    flashSaleEndsAt:  { type: Date },
    // Buy 1 Get 1 Free (BOGO) Offer
    isBogo:           { type: Boolean, default: false, index: true },
    bogoEndsAt:       { type: Date, default: null },
    bogoBadgeText:    { type: String, default: 'BUY 1 GET 1 FREE' },
    // Custom Background & Accent Colors set by Admin
    backgroundColor:  { type: String, default: '#fef3c7' },
    accentColor:      { type: String, default: '#ea580c' },
  },
  { timestamps: true }
);

// Compound database indexes for high-speed sub-millisecond query execution
productSchema.index({ category: 1, salesCount: -1 });
productSchema.index({ bestseller: 1, salesCount: -1 });
productSchema.index({ flashSale: 1, flashSaleEndsAt: 1 });
productSchema.index({ isBogo: 1, bogoEndsAt: 1 });
productSchema.index({ createdAt: -1 });

export default mongoose.model('Product', productSchema);

