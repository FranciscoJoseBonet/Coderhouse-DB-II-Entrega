import TicketRepository from "../repositories/ticket.repository.js";
import CartRepository from "../repositories/cart.repository.js";
import ProductRepository from "../repositories/product.repository.js";
import TicketDTO from "../dtos/TicketDTO.js";

const ticketRepository = new TicketRepository();
const cartRepository = new CartRepository();
const productRepository = new ProductRepository();

class PurchaseService {
	/**
	 * @param {string} cartId ID del carrito a comprar
	 * @param {string} purchaserEmail Correo del usuario
	 */

	async processPurchase(cartId, purchaserEmail) {
		const cart = await cartRepository.getCartById(cartId);
		if (!cart || cart.products.length === 0) {
			throw new Error("El carrito está vacío o no existe.");
		}

		let totalAmount = 0;
		const productsToPurchase = [];
		const productsToRemain = [];

		for (const item of cart.products) {
			const product = item.product;
			const requestedQuantity = item.quantity;

			if (!product || product.stock < requestedQuantity) {
				productsToRemain.push(item);
			} else {
				productsToPurchase.push(item);
				totalAmount += product.price * requestedQuantity;
			}
		}

		if (productsToPurchase.length === 0) {
			const failedIds = productsToRemain.map((item) => item.product._id);
			return { ticket: null, failedProducts: failedIds };
		}

		const stockUpdates = productsToPurchase.map((item) =>
			productRepository.subtractStock(item.product._id, item.quantity)
		);
		await Promise.all(stockUpdates);

		const newTicket = await ticketRepository.generateTicket({
			amount: totalAmount,
			purchaser: purchaserEmail,
		});

		const remainingProductsInCart = productsToRemain.map((item) => ({
			product: item.product._id,
			quantity: item.quantity,
		}));
		await cartRepository.updateProducts(cartId, remainingProductsInCart);

		const failedIds = productsToRemain.map((item) => item.product._id);

		return {
			ticket: new TicketDTO(newTicket),
			failedProducts: failedIds,
		};
	}
}

export default new PurchaseService();
