import { Schema, models, model } from "mongoose";
const sizeSchema = new Schema({
    name: String,
    price: Number,
});

const menuItemSchema = new Schema({
    image: {
        type: String,
    },
    name: {
        type: String,
    },
    description: {
        type: String,
    },
    basePrice: {
        type: Number,
    },
    sizes: {
        type: [sizeSchema],
    },
    extraIngredients: {
        type: [sizeSchema],
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: "Category",
    },
}, { timestamps: true });

const MenuItem = models.MenuItem || model("MenuItem", menuItemSchema);

export default MenuItem;