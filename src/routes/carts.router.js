import { Router } from "express";
import passport from "passport";
import { authorization } from "../middlewares/authorization.middleware.js";
import PurchaseService from "../services/purchase.service.js";

const router = Router();
const authenticate = passport.authenticate("jwt", { session: false });

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
