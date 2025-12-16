import CartMongoDAO from "../daos/mongo/cart.mongo.dao.js";

const cartDAO = new CartMongoDAO();

class CartRepository {
	constructor(dao = cartDAO) {
		this.dao = dao;
	}

	async createNewCart() {
		return this.dao.create();
	}

	async getCartById(cid) {
		return this.dao.getById(cid);
	}

	async updateProducts(cid, productsArray) {
		return this.dao.updateProducts(cid, productsArray);
	}

	async emptyCart(cid) {
		return this.dao.clearCart(cid);
	}
}

export default CartRepository;
