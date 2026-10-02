import { model, models, Schema } from 'mongoose';

const orderItemSchema = new Schema(
  {
    productId: { type: String, required: true },
    name:      { type: String, required: true },
    image:     { type: String, required: true },
    price:     { type: Number, required: true },
    quantity:  { type: Number, required: true, min: 1 },
    color:     { type: String, default: null },
    size:      { type: String, default: null },
  },
  { _id: false }
);

const orderSchema = new Schema(
  {
    userId: { type: String, required: true, index: true },
    userEmail: { type: String, required: true },
    items: { type: [orderItemSchema], required: true },
    subtotal: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    total: { type: Number, required: true },
    couponCode: { type: String, default: null },
    paymentMethod: {
      type: String,
      enum: ['stripe', 'cod'],
      default: 'stripe',
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'],
      default: 'pending',
    },
    stripeSessionId: { type: String, default: null, index: true },
    shippingAddress: {
      name:       String,
      line1:      String,
      line2:      String,
      city:       String,
      state:      String,
      postalCode: String,
      country:    String,
    },
  },
  { timestamps: true }
);

const Order = models.Order || model('Order', orderSchema);
export default Order;
