import ProductRepository from "../repositories/product.repository.js";

const productRepository = new ProductRepository();

class ProductService {
	async createProduct(productData) {
		const exists = await productRepository.getProductByCode(productData.code);
		if (exists) {
			throw new Error("El código de producto ya existe.");
		}
		return productRepository.saveProduct(productData);
	}

	async getProduct(pid) {
		const product = await productRepository.getProductById(pid);
		if (!product) {
			throw new Error("Producto no encontrado.");
		}
		return product;
	}

	async updateProduct(pid, productData) {
		const updated = await productRepository.updateProduct(pid, productData);
		if (!updated) {
			throw new Error("Error al actualizar o producto no encontrado.");
		}
		return updated;
	}

	async deleteProduct(pid) {
		return productRepository.removeProduct(pid);
	}
}

export default new ProductService();
