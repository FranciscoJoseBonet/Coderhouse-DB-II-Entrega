import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

const ticketCollection = "tickets";

const ticketSchema = new mongoose.Schema({
	code: {
		type: String,
		unique: true,
		required: true,
		default: () => uuidv4(),
	},

	purchase_datetime: {
		type: Date,
		default: Date.now,
		required: true,
	},

	amount: {
		type: Number,
		required: true,
	},

	purchaser: {
		type: String,
		required: true,
	},

	products: {
		type: [
			{
				product: {
					type: mongoose.Schema.Types.ObjectId,
					ref: "products",
				},
				quantity: Number,
				price: Number,
			},
		],
		default: [],
	},
});

const ticketModel = mongoose.model(ticketCollection, ticketSchema);
export default ticketModel;
