import mongoose from 'mongoose';

/**
 * A customer review of a product.
 *
 * Constraints:
 *  - One review per (user, product), enforced by a compound unique index.
 *  - Only verified buyers may create a review (enforced in the route layer).
 *  - Photos are stored as binary Buffers (same pattern as product/category images).
 */
const reviewSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    // Snapshot of the reviewer's name for display + resilience to renames.
    userName: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, maxlength: 1000, trim: true, default: '' },
    // Up to 4 review photos. Each stores the binary buffer + content type,
    // served via /api/images/review/:id/:index.
    photos: [{
      data: Buffer,
      contentType: String,
    }],
  },
  { timestamps: true }
);

// Enforce one review per user per product at the DB level.
reviewSchema.index({ product: 1, user: 1 }, { unique: true });

/**
 * Recompute a product's aggregate rating + review count from its reviews.
 * Wrapped so a recalculation failure never blocks the triggering write.
 */
async function recomputeProductRating(productId) {
  if (!productId) return;
  try {
    const agg = await mongoose.model('Review').aggregate([
      { $match: { product: productId } },
      { $group: { _id: null, avg: { $avg: '$rating' }, count: { $sum: 1 } } },
    ]);
    const Product = mongoose.model('Product');
    if (agg.length > 0) {
      await Product.findByIdAndUpdate(productId, {
        rating: Math.round(agg[0].avg * 10) / 10,
        reviewCount: agg[0].count,
      });
    } else {
      // No reviews left → reset to neutral defaults.
      await Product.findByIdAndUpdate(productId, {
        rating: 0,
        reviewCount: 0,
      });
    }
  } catch (err) {
    console.error('review rating recompute failed:', err.message);
  }
}

// Recompute on create/update.
reviewSchema.post('save', function () {
  recomputeProductRating(this.product);
});

// Recompute on document deletion (doc.deleteOne() / doc.remove()).
reviewSchema.post('deleteOne', { document: true, query: false }, function () {
  recomputeProductRating(this.product);
});

// Recompute on query-based deletion (findByIdAndDelete / findOneAndDelete).
// `this` is the deleted document in the post hook.
reviewSchema.post('findOneAndDelete', function (doc) {
  if (doc) recomputeProductRating(doc.product);
});

export default mongoose.model('Review', reviewSchema);
