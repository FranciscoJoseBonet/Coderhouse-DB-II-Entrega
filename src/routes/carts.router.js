/**
 * @schema TicketDTO
 * @desc Datos del ticket de compra generado.
 * @prop {string} id ID único de MongoDB
 * @prop {string} code Código de la compra (UUID)
 * @prop {string} purchase_datetime Fecha y hora de la compra
 * @prop {number} amount Monto total
 * @prop {string} purchaser Email del comprador
 */
import { Router } from "express";
import passport from "passport";
import { authorization } from "../middlewares/authorization.middleware.js";
import PurchaseService from "../services/purchase.service.js";

const router = Router();
const authenticate = passport.authenticate("jwt", { session: false });

/**
 * @endpoint /api/carts/:cid/purchase
 * @method POST
 * @group Carritos / Compras
 * @desc Finaliza el proceso de compra de un carrito.
 * Corrobora el stock de los productos, resta stock, y genera un Ticket. El carrito se actualiza para contener solo los productos sin stock.
 * @header {string} Authorization Token Bearer JWT
 * @param {string} cid ID del carrito a comprar
 * @return {object} Resultado de la compra
 * @prop {TicketDTO} [ticket] Ticket generado (si la compra fue exitosa)
 * @prop {Array<string>} failedProducts IDs de los productos que NO se compraron por falta de stock
 * @status {200} Compra exitosa. Ticket generado.
 * @status {400} Carrito vacío, no existe, o no había stock disponible para NINGÚN producto.
 * @status {403} Acceso Denegado (rol no 'user' o 'premium')
 * @example
 * {
 * "status": "success",
 * "message": "Compra finalizada exitosamente. Ticket generado.",
 * "ticket": { "code": "d2c0...", "amount": 1500, "purchaser": "user@mail.com" },
 * "failedProducts": ["65b5d..."]
 * }
 */
router.post(
	"/:cid/purchase",
	authenticate,
	authorization(["user", "premium"]),
	async (req, res) => {
		const cartId = req.params.cid;

		const purchaserEmail = req.user.email;

		try {
			const result = await PurchaseService.processPurchase(cartId, purchaserEmail);

			if (result.ticket) {
				res.status(200).send({
					status: "success",
					message: "Compra finalizada exitosamente. Ticket generado.",
					ticket: result.ticket,
					failedProducts: result.failedProducts,
				});
			} else {
				res.status(400).send({
					status: "warning",
					message:
						"No se pudo generar el ticket. No había stock para los productos solicitados.",
					failedProducts: result.failedProducts,
				});
			}
		} catch (error) {
			res.status(400).send({ status: "error", message: error.message });
		}
	}
);

export default router;
