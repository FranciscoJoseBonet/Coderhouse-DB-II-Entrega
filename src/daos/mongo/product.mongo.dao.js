import ProductModel from "../../models/product.model.js";

class ProductMongoDAO {
	async getAll(query, options) {
		return ProductModel.find(query).limit(options.limit).skip(options.skip).lean();
	}

	async getById(pid) {
		return ProductModel.findById(pid).lean();
	}

	async create(product) {
		return ProductModel.create(product);
	}

	async update(pid, data) {
		return ProductModel.findByIdAndUpdate(pid, data, {
			new: true,
			runValidators: true,
		}).lean();
	}

	async delete(pid) {
		return ProductModel.findByIdAndDelete(pid).lean();
	}

	async getByCode(code) {
		return ProductModel.findOne({ code: code }).lean();
	}

	async updateStock(pid, quantityToSubtract) {
		return ProductModel.findByIdAndUpdate(
			pid,
			{ $inc: { stock: -quantityToSubtract } },
			{ new: true }
		).lean();
	}
}

export default ProductMongoDAO;
