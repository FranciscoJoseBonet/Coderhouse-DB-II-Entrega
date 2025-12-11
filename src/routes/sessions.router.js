import { Router } from "express";
import passport from "passport";
import jwt from "jsonwebtoken";
import UserService from "../services/user.service.js";

const router = Router();

const JWT_SECRET = process.env.JWT_SECRET;

router.post(
	"/register",
	passport.authenticate("register", {
		failureRedirect: "/api/sessions/failregister",
		session: false,
	}),
	async (req, res) => {
		try {
			await UserService.registerUser(req.user);

			res.status(201).send({
				status: "success",
				message: "Usuario registrado y carrito creado exitosamente.",
				payload: { userId: req.user._id },
			});
		} catch (error) {
			res.status(400).send({
				status: "error",
				message: error.message,
			});
		}
	}
);

router.get("/failregister", (req, res) => {
	res.status(400).send({
		status: "error",
		message: "Error al registrar el usuario.",
	});
});

router.post(
	"/login",
	passport.authenticate("login", {
		failureRedirect: "/api/sessions/faillogin",
		session: false,
	}),
	async (req, res) => {
		const user = req.user;

		const payload = {
			id: user._id,
			email: user.email,
			role: user.role,
		};

		const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "1h" });

		res.cookie("coderCookie", token, {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			maxAge: 3600000,
		});

		const userDTO = await UserService.getUserCurrent(user);

		res.status(200).send({
			status: "success",
			message: "Login exitoso",
			payload: userDTO,
		});
	}
);

router.get("/faillogin", (req, res) => {
	res.status(401).send({
		status: "error",
		message: "Fallo en la autenticación. Credenciales inválidas.",
	});
});

router.get(
	"/current",
	passport.authenticate("jwt", { session: false }),
	async (req, res) => {
		const userDTO = await UserService.getUserCurrent(req.user);

		res.status(200).send({
			status: "success",
			message: "Información de sesión actual obtenida de forma segura.",
			payload: userDTO,
		});
	}
);

router.post("/forgotpassword", async (req, res) => {
	const { email } = req.body;
	try {
		await UserService.sendRecoveryEmail(email);
		res.status(200).send({
			status: "success",
			message: "Si el email existe, se ha enviado un enlace de recuperación.",
		});
	} catch (error) {
		console.error("Error sending recovery email:", error);
		res.status(500).send({
			status: "error",
			message: "Error al procesar la solicitud de recuperación. Intente más tarde.",
		});
	}
});

router.post("/resetpassword/:token", async (req, res) => {
	const { token } = req.params;
	const { newPassword } = req.body;

	try {
		await UserService.resetPassword(token, newPassword);
		res.status(200).send({
			status: "success",
			message: "Contraseña restablecida correctamente.",
		});
	} catch (error) {
		let status = 400;
		if (error.message.includes("expirado")) {
			status = 401;
		}
		res.status(status).send({
			status: "error",
			message: error.message,
		});
	}
});

router.get("/logout", (req, res) => {
	res.clearCookie("coderCookie");
	res.status(200).send({
		status: "success",
		message: "Sesión cerrada exitosamente.",
	});
});

export default router;
