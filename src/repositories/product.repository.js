import ProductMongoDAO from "../daos/mongo/product.mongo.dao.js";

const productDAO = new ProductMongoDAO();

class ProductRepository {
	constructor(dao = productDAO) {
		this.dao = dao;
	}

	async getProducts(query, options) {
		return this.dao.getAll(query, options);
	}

	async getProductById(id) {
		return this.dao.getById(id);
	}

	async getProductByCode(code) {
		return this.dao.getByCode(code);
	}

	async saveProduct(product) {
		return this.dao.create(product);
	}

	async updateProduct(id, data) {
		return this.dao.update(id, data);
	}

	async removeProduct(id) {
		return this.dao.delete(id);
	}

	async subtractStock(id, quantity) {
		return this.dao.updateStock(id, quantity);
	}
}

export default ProductRepository;
