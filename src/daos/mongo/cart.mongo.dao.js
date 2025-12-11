import CartModel from "../../models/cart.model.js";

class CartMongoDAO {
	async create() {
		return CartModel.create({});
	}

	async getById(cid) {
		return CartModel.findById(cid).lean();
	}

	async updateProducts(cid, productsArray) {
		return CartModel.findByIdAndUpdate(
			cid,
			{ products: productsArray },
			{ new: true }
		).lean();
	}

	async clearCart(cid) {
		return CartModel.findByIdAndUpdate(cid, { products: [] }, { new: true }).lean();
	}
}

export default CartMongoDAO;
