import mongoose from "mongoose";

const userCollection = "users";

const userSchema = new mongoose.Schema({
	first_name: {
		type: String,
		required: true,
	},
	last_name: {
		type: String,
		required: true,
	},
	email: {
		type: String,
		required: true,
		unique: true,
		index: true,
	},
	age: {
		type: Number,
		required: true,
	},
	password: {
		type: String,
		required: true,
	},

	cart: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "carts",
	},
	role: {
		type: String,
		default: "user",
	},
});

// Middleware para 'populate'
// Cada vez que se ejecute un 'find' o 'findOne',
// se populará automáticamente el campo 'cart'.
// Lo comentamos por ahora para no generar conflictos si aún no existe el modelo Cart
// userSchema.pre('find', function() {
//     this.populate('cart');
// });
// userSchema.pre('findOne', function() {
//     this.populate('cart');
// });

const userModel = mongoose.model(userCollection, userSchema);

export default userModel;
