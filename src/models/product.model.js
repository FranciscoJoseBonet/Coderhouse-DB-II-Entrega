import mongoose from "mongoose";

const productCollection = "products";

const productSchema = new mongoose.Schema({
	title: { type: String, required: true },
	description: { type: String, required: true },
	price: { type: Number, required: true },
	stock: { type: Number, required: true, default: 0 },
	category: { type: String, required: true },
	status: { type: Boolean, default: true },
	thumbnails: { type: [String], default: [] },
	code: { type: String, required: true, unique: true },
});

const productModel = mongoose.model(productCollection, productSchema);

export default productModel;
