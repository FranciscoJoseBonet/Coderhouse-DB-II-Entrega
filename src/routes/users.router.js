import { Router } from "express";
import passport from "passport";
import { authorization } from "../middlewares/authorization.middleware.js";
import UserService from "../services/user.service.js";

const router = Router();

const authenticate = passport.authenticate("jwt", { session: false });

router.get("/", authenticate, authorization(["admin"]), async (req, res) => {
	try {
		const result = await UserService.getAllUsers();
		res.send({
			status: "success",
			payload: result,
		});
	} catch (error) {
		res.status(500).send({
			status: "error",
			message: error.message,
		});
	}
});

router.post("/", authenticate, authorization(["admin"]), async (req, res) => {
	const userData = req.body;
	try {
		const result = await UserService.registerUser(userData);
		res.send({
			status: "success",
			payload: result,
		});
	} catch (error) {
		res.status(400).send({
			status: "error",
			message: error.message,
		});
	}
});

router.put("/:uid", authenticate, authorization(["admin"]), async (req, res) => {
	const uid = req.params.uid;
	const data = req.body;
	try {
		const updatedUser = await UserService.updateUser(uid, data);
		res.send({
			status: "success",
			payload: updatedUser,
		});
	} catch (error) {
		res.status(400).send({
			status: "error",
			message: error.message,
		});
	}
});

router.delete("/:uid", authenticate, authorization(["admin"]), async (req, res) => {
	const uid = req.params.uid;
	try {
		const result = await UserService.deleteUser(uid);
		res.status(200).send({
			status: "success",
			payload: result,
		});
	} catch (error) {
		res.status(400).send({
			status: "error",
			message: error.message,
		});
	}
});

export default router;
