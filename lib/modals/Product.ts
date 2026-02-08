import { model, models, Schema } from "mongoose";

const productSchema = new Schema(
  {
    // Admin only fields
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true, // createdAt and updatedAt
  }
);

// Prevent model overwrite
const Product = models.Product || model("Product", productSchema);

export default Product;
