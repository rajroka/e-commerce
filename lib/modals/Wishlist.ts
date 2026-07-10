import { model, models, Schema } from 'mongoose';

const wishlistItemSchema = new Schema(
  {
    productId: { type: String, required: true },
    name: { type: String, required: true },
    image: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String, required: true },
  },
  { _id: false }
);

const wishlistSchema = new Schema(
  {
    userId: { type: String, required: true, unique: true, index: true },
    items: { type: [wishlistItemSchema], default: [] },
  },
  { timestamps: true }
);

const Wishlist = models.Wishlist || model('Wishlist', wishlistSchema);
export default Wishlist;
