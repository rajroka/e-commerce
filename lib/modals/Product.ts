
import { model ,models , Schema } from "mongoose";

const productSchema = new Schema(
     

    {
        
        name :{
            type: String,
            required: true,
            unique: false,
        },
        description :{
            type: String,
            required: true,
        },
        price :{
            type: Number,
            required: true,
        },
        image :{
            type: String,
            required: true,
        },
        category :{
            type: String,
            required: true,
        },
        stock :{
            type: Number,
            
            default: 0,
        },
        rating :{
            type: Number,
            
            default: 0,
        },
        reviews :{
            type: Number,
        
            default: 0,
        },

         
    },

    {
        timestamps: true,
    }

)

const Product = models.Product || model("Product", productSchema);

export default Product;