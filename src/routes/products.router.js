import { Router } from "express";
import passport from "passport";
import { authorization } from "../middlewares/authorization.middleware.js";
import ProductService from "../services/product.service.js";

const router = Router();
const authenticate = passport.authenticate("jwt", { session: false });

router.get("/", async (req, res) => {
	try {
		const products = await ProductService.getProducts(req.query);
		res.status(200).send({ status: "success", payload: products });
	} catch (error) {
		res.status(500).send({ status: "error", message: error.message });
	}
});

router.post("/", authenticate, authorization(["admin"]), async (req, res) => {
	try {
		const newProduct = await ProductService.createProduct(req.body);
		res.status(201).send({ status: "success", payload: newProduct });
	} catch (error) {
		res.status(400).send({ status: "error", message: error.message });
	}
});

router.put("/:pid", authenticate, authorization(["admin"]), async (req, res) => {
	try {
		const updatedProduct = await ProductService.updateProduct(req.params.pid, req.body);
		res.status(200).send({ status: "success", payload: updatedProduct });
	} catch (error) {
		res.status(400).send({ status: "error", message: error.message });
	}
});

router.delete("/:pid", authenticate, authorization(["admin"]), async (req, res) => {
	try {
		await ProductService.deleteProduct(req.params.pid);
		res.status(200).send({ status: "success", message: "Producto eliminado." });
	} catch (error) {
		res.status(400).send({ status: "error", message: error.message });
	}
});

export default router;
