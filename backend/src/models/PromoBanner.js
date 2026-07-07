import mongoose from 'mongoose';

const promoBannerSchema = new mongoose.Schema(
  {
    // Display image stored as binary
    imageData:        { type: Buffer, required: true },
    imageContentType: { type: String, required: true },

    // Alt text for accessibility / SEO
    altText: { type: String, default: '' },

    // Where clicking the banner goes
    linkType: {
      type: String,
      enum: ['product', 'category', 'url', 'none'],
      default: 'none',
    },
    // product slug, category slug, or full URL depending on linkType
    linkValue: { type: String, default: '' },

    // Where it appears on the homepage
    position: {
      type: String,
      enum: ['above_categories', 'below_categories'],
      default: 'below_categories',
    },

    // Display order — lower number = shown first
    sortOrder: { type: Number, default: 0 },

    // Toggle visibility without deleting
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model('PromoBanner', promoBannerSchema);
