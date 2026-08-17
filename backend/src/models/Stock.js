import mongoose from 'mongoose';

const stockTransactionSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    transactionType: { type: String, enum: ['add', 'remove', 'adjust', 'order'], required: true },
    quantity: { type: Number, required: true },
    previousQuantity: { type: Number, required: true },
    newQuantity: { type: Number, required: true },
    reason: { type: String },
    notes: { type: String },
    order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
  },
  { timestamps: true }
);

export default mongoose.model('StockTransaction', stockTransactionSchema);
