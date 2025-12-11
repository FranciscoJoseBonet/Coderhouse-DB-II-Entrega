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

	async updateProductsInCart(cid, productsArray) {
		return this.dao.updateProducts(cid, productsArray);
	}

	async emptyCart(cid) {
		return this.dao.clearCart(cid);
	}

	// (lógica de compra)
	async processPurchase(cid) {
		// Lógica que va en la Capa de Servicios/Compra, pero el repositorio expone el acceso a datos
		return null;
	}
}

export default CartRepository;
