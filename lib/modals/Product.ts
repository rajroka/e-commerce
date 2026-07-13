import { model, models, Schema } from 'mongoose';

const productSchema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String, required: true },
    category: { type: String, required: true },
    stock: { type: Number, required: true, default: 0, min: 0 },
    // Admin-defined variants — empty arrays mean "no variants for this product"
    colors: { type: [String], default: [] },
    sizes:  { type: [String], default: [] },
    // Admin-controlled discount
    discountPct:    { type: Number, default: 0, min: 0, max: 100 },
    discountEndsAt: { type: Date,   default: null },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    reviewCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Product = models.Product || model('Product', productSchema);
export default Product;
