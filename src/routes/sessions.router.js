import { Router } from "express";
import passport from "passport";
import jwt from "jsonwebtoken";

const router = Router();

const JWT_SECRET = process.env.JWT_SECRET || "fallback-secret-key-coder";

//Usamos el middleware de Passport con la estrategia 'register'
router.post(
	"/register",
	passport.authenticate("register", {
		failureRedirect: "/api/sessions/failregister",
		session: false, // session: false para que no inicie sesión automáticamente.
	}),
	async (req, res) => {
		res.status(201).send({
			status: "success",
			message: "Usuario registrado exitosamente",
			payload: req.user._id,
		});
	}
);

router.get("/failregister", (req, res) => {
	res.status(400).send({
		status: "error",
		message: "Error al registrar el usuario",
	});
});

//Ahora el endpoint del login
router.post(
	"/login",
	passport.authenticate("login", {
		failureRedirect: "/api/sessions/faillogin",
		session: false,
	}),
	async (req, res) => {
		//¡No guardar la contraseña hasheada en el token!
		const user = req.user;
		//A-Creamos el payload para el JWT con los datos requeridos
		const payload = {
			id: user._id,
			first_name: user.first_name,
			last_name: user.last_name,
			email: user.email,
			role: user.role,
		};
		//B-Firmamos el token
		const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "1h" });
		//C-Lo mandamos en la cookie
		res.cookie("coderCookie", token, {
			httpOnly: true, //proteccion del clinete
			secure: false,
			maxAge: 3600000, //expiracion
		});
		//D-Respuesta al cliente
		res.status(200).send({
			status: "success",
			message: "Login exitoso",
			payload: payload,
		});
	}
);

router.get("/faillogin", (req, res) => {
	res.status(401).send({
		status: "error",
		message: "Error en el inicio de sesión",
	});
});

router.get("/current", passport.authenticate("jwt", { session: false }), (req, res) => {
	const userDTO = {
		id: req.user._id,
		first_name: req.user.first_name,
		last_name: req.user.last_name,
		email: req.user.email,
		role: req.user.role,
	};

	res.status(200).send({
		status: "success",
		message: "Usuario actual",
		payload: userDTO,
	});
});

export default router;
